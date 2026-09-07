/**
 * app.js (Web版) — 路由 + 全局数据 + 图片路径 + 公共工具
 */
(function () {
  var App = {
    store: {},                 // 模拟 globalData
    pages: {},                 // 注册的页面 render 函数
    current: 'home',
    lang: (function () { try { return localStorage.getItem('app_lang') || 'zh'; } catch (e) { return 'zh'; } })()
  };

  // ===== 国际化 =====
  App.t = function (text) {
    if (App.lang === 'zh' || !text) return text;
    var dict = window.I18N_DICT || {};
    if (dict[text]) return dict[text];
    // 星座名带"座"：白羊座 -> 查"白羊"
    if (text.charAt(text.length - 1) === '座') {
      var base = text.substring(0, text.length - 1);
      if (dict[base]) return dict[base];
    }
    // 属相带"属"：属鼠 -> 查"鼠"
    if (text.charAt(0) === '属' && text.length === 2) {
      var animal = text.substring(1);
      if (dict[animal]) return dict[animal];
    }
    return text;
  };
  App.setLang = function (lang) {
    App.lang = lang;
    try { localStorage.setItem('app_lang', lang); } catch (e) {}
    App.refresh();
  };

  // 获取 MBTI 人格文本（自动中英文切换）
  App.mbtiGet = function (type, field) {
    var data = window.MBTI;
    if (!data || !data.MBTI_TYPES[type]) return '';
    if (App.lang === 'en' && data.MBTI_EN && data.MBTI_EN[type] && data.MBTI_EN[type][field]) {
      return data.MBTI_EN[type][field];
    }
    return data.MBTI_TYPES[type][field] || '';
  };

  // ===== 图片路径（相对 love-scope-web，引用原 love-scope 目录） =====
  var IMG = {
    HOME_HERO: './love-scope/assets/illustration/home/hero_rose-couple.jpg',
    PAIR_THEMES: './love-scope/assets/illustration/pair-themes/',
    TAROT: './love-scope/pages/tarot/images/',
    MBTI_CATS: './love-scope/pages/personal/images/'
  };
  App.IMG = IMG;

  // 塔罗牌图名映射（id -> 文件名）
  App.TAROT_IMAGES = {
    0: '00_fool.jpg', 1: '01_magician.jpg', 2: '02_high-priestess.jpg', 3: '03_empress.jpg',
    4: '04_emperor.jpg', 5: '05_hierophant.jpg', 6: '06_lovers.jpg', 7: '07_chariot.jpg',
    8: '08_strength.jpg', 9: '09_hermit.jpg', 10: '10_wheel-of-fortune.jpg', 11: '11_justice.jpg',
    12: '12_hanged-man.jpg', 13: '13_death.jpg', 14: '14_temperance.jpg', 15: '15_devil.jpg',
    16: '16_tower.jpg', 17: '17_star.jpg', 18: '18_moon.jpg', 19: '19_sun.jpg',
    20: '20_judgement.jpg', 21: '21_world.jpg'
  };
  App.tarotImage = function (id) { return IMG.TAROT + (App.TAROT_IMAGES[id] || '00_fool.jpg'); };
  App.mbtiCat = function (type) { return IMG.MBTI_CATS + type + '.jpg'; };

  // 五行配对主题图（与 pro-result 一致）
  var ELEMENT_THEME = {
    '火火': '01_chixia_fire-fire.jpg', '土火': '02_nuanqiu_fire-earth.jpg',
    '木火': '03_chunxiao_fire-wood.jpg', '水火': '04_chenhun_fire-water.jpg',
    '土土': '05_houtu_earth-earth.jpg', '土木': '06_shanfeng_earth-wood.jpg',
    '土水': '07_xigu_earth-water.jpg', '木木': '08_linfeng_wood-wood.jpg',
    '木水': '09_chunjian_wood-water.jpg', '水水': '10_shenhai_water-water.jpg'
  };
  App.pairThemeImage = function (qiA, qiB) {
    var key = [qiA, qiB].sort().join('');
    return IMG.PAIR_THEMES + (ELEMENT_THEME[key] || '01_chixia_fire-fire.jpg');
  };

  // ===== 路由 =====
  function render() {
    var hash = (location.hash || '').replace(/^#\/?/, '');
    var parts = hash.split('?');
    var name = parts[0] || 'home';
    var query = {};
    if (parts[1]) {
      parts[1].split('&').forEach(function (kv) {
        var arr = kv.split('=');
        query[decodeURIComponent(arr[0])] = decodeURIComponent(arr[1] || '');
      });
    }
    App.current = name;
    var page = App.pages[name];
    if (!page) {
      // 兼容连字符路由名 -> 驼峰注册名（mbti-matching -> mbtiMatching）
      var camel = name.replace(/-([a-z])/g, function (m, c) { return c.toUpperCase(); });
      page = App.pages[camel];
    }
    var el = document.getElementById('app');
    if (page) {
      try { el.innerHTML = page.render(query); } catch (e) { console.error(e); el.innerHTML = '<div class="loading">页面渲染出错</div>'; }
      if (page.mount) { try { page.mount(query); } catch (e) { console.error(e); } }
      window.scrollTo(0, 0);
    } else {
      el.innerHTML = '<div class="loading">页面不存在</div>';
    }
  }

  App.register = function (name, page) { App.pages[name] = page; };
  App.go = function (path) { location.hash = '#/' + path; };
  App.back = function () { history.back(); };
  App.home = function () { location.hash = '#/home'; };
  // 重新渲染当前路由页（供页面内事件调用，等价于重进本页）
  App.refresh = function () { render(); };

  // ===== 公共工具 =====

  // 生成导航栏 HTML
  App.nav = function (title, showHome) {
    var homeBtn = showHome === false ? ''
      : '<span class="nav-home" onclick="App.home()">⌂</span>';
    return '<div class="navbar">' +
      '<span class="nav-back" onclick="App.back()">‹</span>' +
      '<span class="nav-title">' + App.t(title) + '</span>' +
      homeBtn +
      '</div>';
  };

  // 底部版权
  App.footer = function () {
    return '<div class="page-footer">' +
      '<div class="footer-line"></div>' +
      '<div class="footer-entertain">✦ ' + App.t('仅供娱乐参考') + ' ✦</div>' +
      '<div class="footer-copyright">@copyright 2026 Victoria_Tao</div>' +
      '</div>';
  };

  // 提示
  App.toast = function (msg, ms) {
    var t = document.querySelector('.toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(App.toast._t);
    App.toast._t = setTimeout(function () { t.classList.remove('show'); }, ms || 1800);
  };

  // 月份/日子下拉数据
  App.months = ['选择月', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  // 出生时间下拉（含"未知"选项，0-23时 + :00/:30）
  App.timeOptions = function (selected) {
    var opts = '<option value="">' + App.t('未知') + '</option>';
    var hours = ['子时', '丑时', '寅时', '卯时', '辰时', '巳时', '午时', '未时', '申时', '酉时', '戌时', '亥时'];
    for (var i = 0; i < 24; i++) {
      var hh = i < 10 ? '0' + i : '' + i;
      var label = hh + ':00' + '（' + App.t(hours[Math.floor(i / 2)]) + '）';
      var val = hh + ':00';
      opts += '<option value="' + val + '" ' + (selected === val ? 'selected' : '') + '>' + label + '</option>';
    }
    for (var j = 0; j < 24; j++) {
      var h2 = j < 10 ? '0' + j : '' + j;
      var v2 = h2 + ':30';
      opts += '<option value="' + v2 + '" ' + (selected === v2 ? 'selected' : '') + '>' + h2 + ':30</option>';
    }
    return opts;
  };
  App.buildDays = function (month) {
    var n = 31;
    if (month === 2) n = 29;
    else if ([4, 6, 9, 11].indexOf(month) >= 0) n = 30;
    var arr = ['选择日'];
    for (var d = 1; d <= n; d++) arr.push(d + '日');
    return arr;
  };

  // 生成 select 下拉 HTML（通用）
  App.selectHtml = function (id, options, selectedIdx, placeholder) {
    var opts = '';
    for (var i = 0; i < options.length; i++) {
      var sel = (i === selectedIdx) ? 'selected' : '';
      opts += '<option value="' + i + '" ' + sel + '>' + options[i] + '</option>';
    }
    return '<div class="custom-select"><select id="' + id + '">' + opts + '</select></div>';
  };

  // 月份下拉（含天数据联动）
  App.monthDayHtml = function (prefix, monthIdx, dayIdx, days) {
    var mOpts = '';
    for (var i = 0; i < App.months.length; i++) {
      mOpts += '<option value="' + i + '" ' + (i === monthIdx ? 'selected' : '') + '>' + App.months[i] + '</option>';
    }
    var dOpts = '';
    for (var j = 0; j < days.length; j++) {
      dOpts += '<option value="' + j + '" ' + (j === dayIdx ? 'selected' : '') + '>' + days[j] + '</option>';
    }
    return '<div class="birth-picker"><div class="custom-select"><select id="' + prefix + '_month">' + mOpts + '</select></div></div>' +
      '<div class="birth-picker"><div class="custom-select"><select id="' + prefix + '_day">' + dOpts + '</select></div></div>';
  };

  // ===== Canvas 绘制工具（分享卡/雷达图共用） =====

  // 新建离屏 canvas
  App.makeCanvas = function (w, h) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    c.style.display = 'none';
    document.body.appendChild(c);
    return c;
  };

  // 下载 canvas 为图片
  App.downloadCanvas = function (canvas, filename) {
    var url = canvas.toDataURL('image/png');
    var a = document.createElement('a');
    a.href = url;
    a.download = filename || 'card.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // 文字自动换行（基于 canvas ctx）
  App.wrapText = function (ctx, text, maxWidth) {
    ctx.font = ctx.font || '20px sans-serif';
    var chars = String(text).split('');
    var lines = [];
    var line = '';
    for (var i = 0; i < chars.length; i++) {
      if (chars[i] === '\n') {
        lines.push(line);
        line = '';
        continue;
      }
      var test = line + chars[i];
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = chars[i];
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  };

  // 圆角矩形
  App.roundRect = function (ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  // 绘制雷达图到指定 ctx（通用）
  // opts: {cx, cy, R, values, labels, colors(可选), gridColor, fillGrad(可选), labelColor, scoreColor, fontSizes}
  App.drawRadar = function (ctx, opts) {
    var cx = opts.cx, cy = opts.cy, R = opts.R;
    var values = opts.values, labels = opts.labels;
    var n = values.length;
    if (!n) return;
    var gridColor = opts.gridColor || 'rgba(255,215,0,0.1)';

    // 网格
    for (var lv = 1; lv <= 5; lv++) {
      var r = (R * lv) / 5;
      ctx.beginPath();
      for (var i = 0; i <= n; i++) {
        var ang = -Math.PI / 2 + (i % n) * (2 * Math.PI / n);
        var x = cx + r * Math.cos(ang), y = cy + r * Math.sin(ang);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = gridColor; ctx.lineWidth = 1; ctx.stroke();
    }
    // 轴线
    for (var j = 0; j < n; j++) {
      var ang2 = -Math.PI / 2 + j * (2 * Math.PI / n);
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.lineTo(cx + R * Math.cos(ang2), cy + R * Math.sin(ang2));
      ctx.strokeStyle = gridColor; ctx.lineWidth = 1; ctx.stroke();
    }
    // 数据区
    ctx.beginPath();
    for (var k = 0; k < n; k++) {
      var v = Math.min(1, Math.max(0, values[k] / 100));
      var ang3 = -Math.PI / 2 + k * (2 * Math.PI / n);
      var x3 = cx + R * v * Math.cos(ang3), y3 = cy + R * v * Math.sin(ang3);
      if (k === 0) ctx.moveTo(x3, y3); else ctx.lineTo(x3, y3);
    }
    ctx.closePath();
    if (opts.fillGrad) { ctx.fillStyle = opts.fillGrad; } else {
      var g = ctx.createLinearGradient(0, 0, cx * 2, cy * 2);
      g.addColorStop(0, 'rgba(196,168,232,0.4)');
      g.addColorStop(1, 'rgba(240,168,192,0.4)');
      ctx.fillStyle = g;
    }
    ctx.fill();
    ctx.strokeStyle = opts.lineColor || '#c4a8e8'; ctx.lineWidth = 2; ctx.stroke();
    // 数据点
    for (var m = 0; m < n; m++) {
      var v2 = Math.min(1, Math.max(0, values[m] / 100));
      var ang4 = -Math.PI / 2 + m * (2 * Math.PI / n);
      var x4 = cx + R * v2 * Math.cos(ang4), y4 = cy + R * v2 * Math.sin(ang4);
      ctx.beginPath(); ctx.arc(x4, y4, 4, 0, 2 * Math.PI);
      ctx.fillStyle = opts.dotColor || '#f0a8c0'; ctx.fill();
    }
    // 标签（分享卡等场景可关闭，避免与外圈文字重合）
    if (opts.showLabels !== false) {
      ctx.fillStyle = opts.labelColor || 'rgba(255,255,255,0.7)';
      ctx.font = opts.labelFont || '12px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (var p = 0; p < n; p++) {
        var ang5 = -Math.PI / 2 + p * (2 * Math.PI / n);
        var lx = cx + (R + 22) * Math.cos(ang5), ly = cy + (R + 22) * Math.sin(ang5);
        ctx.fillText(labels[p], lx, ly);
        ctx.fillStyle = opts.scoreColor || 'rgba(255,215,0,0.9)';
        ctx.fillText(values[p], lx, ly + 14);
        ctx.fillStyle = opts.labelColor || 'rgba(255,255,255,0.7)';
      }
    }
  };

  // 绘制带图片的分享卡需要等待图片加载：包装 loadImage
  App.loadImage = function (src) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error('img load fail: ' + src)); };
      img.src = src;
    });
  };

  // 深色星夜背景（分享卡通用）
  App.drawNightBg = function (ctx, W, H, starCount) {
    var bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#1a1040');
    bg.addColorStop(0.5, '#2d1b5e');
    bg.addColorStop(1, '#1a1040');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    // 星点
    ctx.fillStyle = 'rgba(255,215,0,0.3)';
    for (var i = 0; i < (starCount || 40); i++) {
      var x = (i * 73 + 20) % W;
      var y = (i * 97 + 30) % H;
      var r = (i % 3) + 1;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
  };

  // ===== 初始化 =====
  window.addEventListener('hashchange', render);
  window.App = App;

  document.addEventListener('DOMContentLoaded', function () {
    render();
  });
  if (document.readyState !== 'loading') { render(); }
})();
