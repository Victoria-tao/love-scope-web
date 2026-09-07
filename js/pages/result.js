/**
 * pages/result.js — 情感契合度结果（五维雷达 + 分享卡生成）
 */
(function () {
  var zodiac = window.ZD;

  // 五行配对主题（与小程序一致）
  var ELEMENT_THEME = {
    '火火': { name: '炽夏', image: './love-scope/assets/illustration/pair-themes/01_chixia_fire-fire.jpg' },
    '土火': { name: '暖秋', image: './love-scope/assets/illustration/pair-themes/02_nuanqiu_fire-earth.jpg' },
    '木火': { name: '春晓', image: './love-scope/assets/illustration/pair-themes/03_chunxiao_fire-wood.jpg' },
    '水火': { name: '晨昏', image: './love-scope/assets/illustration/pair-themes/04_chenhun_fire-water.jpg' },
    '土土': { name: '厚土', image: './love-scope/assets/illustration/pair-themes/05_houtu_earth-earth.jpg' },
    '土木': { name: '山风', image: './love-scope/assets/illustration/pair-themes/06_shanfeng_earth-wood.jpg' },
    '土水': { name: '溪谷', image: './love-scope/assets/illustration/pair-themes/07_xigu_earth-water.jpg' },
    '木木': { name: '林风', image: './love-scope/assets/illustration/pair-themes/08_linfeng_wood-wood.jpg' },
    '木水': { name: '春涧', image: './love-scope/assets/illustration/pair-themes/09_chunjian_wood-water.jpg' },
    '水水': { name: '深海', image: './love-scope/assets/illustration/pair-themes/10_shenhai_water-water.jpg' }
  };
  var DEFAULT_THEME = { name: '性格契合度', image: './love-scope/assets/illustration/home/hero_rose-couple.jpg' };

  // 综合星座+属相分数（星座70% + 属相30%），与小程序一致
  function buildPair(r) {
    var zp = r.zodiacPair;
    if (zp && r.animalPair) {
      var combined = Math.round(zp.score * 0.7 + r.animalPair.score * 0.3);
      zp = Object.assign({}, zp, { score: combined });
      var isEn = App.lang === 'en';
      if (combined >= 84) { zp.levelTag = isEn ? '🔥 Soulmates' : '🔥 灵魂伴侣'; zp.level = isEn ? 'Soulmates' : '灵魂伴侣'; }
      else if (combined >= 70) { zp.levelTag = isEn ? '💞 Sweet Match' : '💞 高甜组合'; zp.level = isEn ? 'Sweet Match' : '高甜组合'; }
      else if (combined >= 58) { zp.levelTag = isEn ? '🌗 Complementary' : '🌗 互补磨合'; zp.level = isEn ? 'Complementary' : '互补磨合'; }
      else { zp.levelTag = isEn ? '⚡ Spark Lovers' : '⚡ 火花恋人'; zp.level = isEn ? 'Spark Lovers' : '火花恋人'; }
    }
    return zp;
  }

  function getTheme(zp) {
    if (!zp || !zp.me || !zp.ta) return DEFAULT_THEME;
    var key = [zp.me.qi, zp.ta.qi].sort().join('');
    return ELEMENT_THEME[key] || DEFAULT_THEME;
  }

  // 英文简化版解读生成
  function buildEnCopy(zp) {
    if (!zp || !zp.me || !zp.ta) return null;
    var myName = App.t(zp.me.fullName);
    var taName = App.t(zp.ta.fullName);
    var myElem = App.t(zp.me.element);
    var taElem = App.t(zp.ta.element);
    var score = zp.score;
    var level = score >= 84 ? 'Soul Mates' : score >= 70 ? 'Sweet Match' : score >= 58 ? 'Complementary' : 'Sparks Fly';
    var comboName = myName + ' & ' + taName;
    var summary = myName + ' (' + myElem + ') and ' + taName + ' (' + taElem + ') share a ' + level.toLowerCase() + ' connection. ' +
      (score >= 70 ? 'Your energies flow naturally, creating warmth and understanding.' : 'Your differences create growth opportunities—patience is key.');
    var advantage = 'You complement each other in ' + App.t(zp.me.keywords && zp.me.keywords[0] ? zp.me.keywords[0] : 'communication') +
      ' and ' + App.t(zp.ta.keywords && zp.ta.keywords[0] ? zp.ta.keywords[0] : 'emotional depth') + '. Mutual respect builds a strong foundation.';
    var challenge = 'Watch for differences in ' + App.t(zp.me.keywords && zp.me.keywords[1] ? zp.me.keywords[1] : 'pace') +
      ' and ' + App.t(zp.ta.keywords && zp.ta.keywords[1] ? zp.ta.keywords[1] : 'expression') + '. Open communication bridges gaps.';
    var future = 'This relationship has potential for growth. Nurture understanding and celebrate your unique bond.';
    var seasons = [
      'Q1: New beginnings and fresh energy. Focus on building connection.',
      'Q2: Deepen understanding through shared experiences and open dialogue.',
      'Q3: Growth period—face challenges together and emerge stronger.',
      'Q4: Reflection and consolidation. Appreciate how far you have come.'
    ];
    return {
      comboName: comboName, summary: summary, advantage: advantage,
      challenge: challenge, future: future, keywords: zp.copy && zp.copy.keywords ? zp.copy.keywords.map(function (k) { return App.t(k); }) : [],
      tips: ['Communicate openly', 'Respect differences', 'Make time for each other']
    };
  }

  function buildEnTao(tao) {
    if (!tao) return null;
    return {
      elementName: App.t(tao.elementName) || tao.elementName,
      qiA: App.t(tao.qiA), qiB: App.t(tao.qiB),
      dao: 'Your elements ' + App.t(tao.qiA) + ' and ' + App.t(tao.qiB) + ' create a unique dynamic. Balance is the key to harmony.',
      star: 'Stars align for mutual growth and understanding.'
    };
  }

  function buildEnAnimal(ap) {
    if (!ap) return null;
    return {
      relName: App.t(ap.relName) || ap.relName,
      copy: {
        summary: 'Your animal signs bring complementary energies. Together you create balance and mutual support.',
        advantage: 'Shared values and natural understanding strengthen your bond.'
      }
    };
  }

  function buildEnSingle(s) {
    if (!s) return null;
    return {
      name: App.t(s.name) || s.name,
      element: App.t(s.element) || s.element, ruler: App.t(s.ruler) || s.ruler,
      inflTag: 'Personal Growth',
      title: App.t(s.title) || s.title,
      theme: 'This year brings opportunities for self-discovery and personal development.',
      inflTao: 'Focus on inner growth and authentic expression.',
      inflStar: 'Your inner light guides the way forward.',
      star: 'Trust your intuition and embrace new possibilities.'
    };
  }

  var page = {
    render: function () {
      var r = App.store.lastMatch || {};
      var zp = buildPair(r);
      var theme = getTheme(zp);
      var single = r.singleZodiac || null;
      var animalPair = r.animalPair || null;
      var singleAnimal = r.singleAnimal || null;
      var birthMatch = r.birthMatch || null;
      var synastry = r.synastry || null;
      var natalChart = r.natalChart || null;
      var yearFortune = r.yearFortune || null;

      var h = App.nav('契合度结果');
      h += '<div class="page">';

      // 英文简化版解读
      var isEn = App.lang === 'en';
      var enCopy = isEn ? buildEnCopy(zp) : null;
      var enTao = isEn ? buildEnTao(zp && zp.tao) : null;
      var enAnimal = isEn ? buildEnAnimal(animalPair) : null;
      var enSingle = isEn ? buildEnSingle(single) : null;
      var displayCopy = enCopy || (zp && zp.copy);
      var displayTao = enTao || (zp && zp.tao);
      var displaySeasons = isEn && enCopy ? enCopy.seasons : (zp && zp.seasons);

      // 背景图
      if (zp) {
        h += '<div class="result-hero result-hero-crop"><img src="' + theme.image + '" alt="' + theme.name + '"/></div>';
      }

      if (zp) {
        // 综合大分数
        h += '<div class="result-score-block" style="background:rgba(255,255,255,0.05);border-radius:20px;border:1px solid rgba(255,215,0,0.15);">';
        h += '<div class="result-score">' + zp.score + '</div>';
        h += '<div class="result-score-label">' + App.t('综合契合指数（星座 · 属相）') + '</div>';
        h += '<div class="result-level">' + (isEn ? '" ' : '『 ') + App.t(zp.level) + (isEn ? ' "' : ' 』') + '</div>';
        h += '</div>';

        // 五行配对（紧随分数下方）
        if (displayTao) {
          h += '<div class="text-card"><div class="tc-title">✦ ' + App.t('五行配对') + ' · ' + displayTao.elementName + '</div>';
          h += '<div class="tc-content">' + (isEn ? 'Your element: ' + displayTao.qiA + ' × Their element: ' + displayTao.qiB : '你的五行属「' + displayTao.qiA + '」 × TA 的五行属「' + displayTao.qiB + '」') + '</div>';
          h += '<div class="tc-content">' + displayTao.dao + '</div>';
          h += '<div class="tc-content" style="color:#c4a8e8;margin-top:8px;">' + displayTao.star + '</div>';
          h += '</div>';
        }

        h += '<div class="text-card"><div class="tc-title">✦ ' + displayCopy.comboName + '</div>';
        h += '<div class="tc-content">' + displayCopy.summary + '</div>';
        if (displayCopy.keywords) h += '<div class="tc-tags">' + displayCopy.keywords.map(function (k) { return '<span class="tag">' + k + '</span>'; }).join('') + '</div>';
        h += '</div>';

        // 五维雷达
        h += '<div class="section"><div class="section-title">' + App.t('五维契合雷达') + '</div></div>';
        h += '<div class="card"><div class="radar-wrap"><canvas id="resultRadar" width="300" height="300" style="width:300px;height:300px;"></canvas></div></div>';

        // 维度条
        h += '<div class="card"><div class="card-title">' + App.t('五维详情') + '</div>';
        var labels = (zp.radarLabels || ['浪漫', '沟通', '默契', '激情', '稳定']).map(function (l) { return App.t(l); });
        var colors = ['#f0a8c0', '#ffd700', '#e8956a', '#c4a8e8', '#8bc38b'];
        var radarArr = (zp.radar && zp.radar.length === 5) ? zp.radar : [78, 75, 80, 72, 76];
        radarArr.forEach(function (v, i) {
          h += '<div class="dim-bar-row"><div class="dim-name">' + labels[i] + '</div><div class="dim-bar"><div class="dim-bar-inner" style="width:' + v + '%;background:' + colors[i] + ';"></div></div><div class="dim-score">' + v + App.t('分') + '</div></div>';
        });
        h += '</div>';

        // 配对详情
        h += '<div class="text-card"><div class="tc-title">✦ ' + App.t('优势') + '</div><div class="tc-content">' + displayCopy.advantage + '</div></div>';
        h += '<div class="text-card"><div class="tc-title">✦ ' + App.t('挑战') + '</div><div class="tc-content">' + displayCopy.challenge + '</div></div>';
        if (displayCopy.tips) h += '<div class="text-card"><div class="tc-title">✦ ' + App.t('相处建议') + '</div><div class="tc-tags">' + displayCopy.tips.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('') + '</div></div>';
        h += '<div class="text-card"><div class="tc-title">✦ ' + App.t('未来展望') + '</div><div class="tc-content">' + (displayCopy.future || '') + '</div></div>';

        if (displaySeasons) {
          h += '<div class="text-card"><div class="tc-title">✦ ' + (isEn ? zp.year : zp.year + App.t('年度')) + ' · ' + (isEn ? 'Year Ahead' : zp.yearWord) + '</div>';
          displaySeasons.forEach(function (s, i) {
            h += '<div class="tc-content" style="margin-top:6px;"><span style="color:#f0a8c0;">' + App.t(['第一季度', '第二季度', '第三季度', '第四季度'][i]) + (isEn ? ': ' : '：') + '</span>' + s + '</div>';
          });
          h += '</div>';
        }
      } else if (single) {
        // 单方解读
        var ds = enSingle || single;
        h += '<div class="result-score-block"><div class="result-level">' + (isEn ? '" ' : '『 ') + ds.inflTag + (isEn ? ' "' : ' 』') + '</div></div>';
        h += '<div class="text-card"><div class="tc-title">✦ ' + ds.title + '</div>';
        h += '<div class="tc-content">' + ds.theme + '</div></div>';
        h += '<div class="text-card"><div class="tc-title">✦ ' + App.t('年度性格倾向') + '</div>';
        h += '<div class="tc-content">' + (ds.inflTao || '') + '</div>';
        h += '<div class="tc-content" style="color:#c4a8e8;margin-top:8px;">' + (ds.inflStar || '') + '</div></div>';
        h += '<div class="text-card"><div class="tc-title">✦ ' + App.t('性格星图') + '</div>';
        h += '<div class="tc-content">' + (ds.star || '') + '</div></div>';
        if (!isEn) {
          h += '<div class="text-card"><div class="tc-title">✦ ' + App.t('时令提示') + '</div>';
          h += '<div class="tc-content">' + (single.season || '') + '</div></div>';
          h += '<div class="text-card"><div class="tc-title">✦ ' + App.t('心语') + '</div>';
          h += '<div class="tc-content">' + (single.tao || '') + '</div></div>';
        }
      }

      // 属相配对
      if (animalPair) {
        var da = enAnimal || animalPair;
        h += '<div class="text-card"><div class="tc-title">🐾 ' + App.t('属相') + ' · ' + da.relName + '</div>';
        h += '<div class="tc-content">' + (da.copy && da.copy.summary) + '</div>';
        if (da.copy && da.copy.advantage) h += '<div class="tc-content" style="margin-top:8px;">' + da.copy.advantage + '</div>';
        h += '</div>';
      }
      if (singleAnimal) {
        h += '<div class="text-card"><div class="tc-title">🐾 ' + (isEn ? App.t(singleAnimal.title) : singleAnimal.title) + '</div>';
        h += '<div class="tc-content">' + (isEn ? 'Your animal sign brings unique strengths and growth opportunities.' : singleAnimal.theme) + '</div>';
        h += '</div>';
      }

      // 出生信息匹配
      if (birthMatch) {
        if (isEn) {
          h += '<div class="text-card"><div class="tc-title">🎂 ' + App.t('出生信息匹配') + '</div>';
          h += '<div class="tc-content">Age gap: ' + birthMatch.ageDiff + ' years. Birth pillars complement each other, bringing balance and growth to the relationship.</div>';
        } else {
          h += '<div class="text-card"><div class="tc-title">🎂 ' + App.t('出生信息匹配') + ' · ' + birthMatch.levelTag + '</div>';
          h += '<div class="tc-content">' + App.t('年龄差') + birthMatch.ageDiff + App.t('岁') + '：' + birthMatch.ageText + '</div>';
          h += '<div class="tc-content">' + '年柱 ' + birthMatch.myPillar.full + ' × ' + birthMatch.taPillar.full + '：' + birthMatch.stemRel.type + '（' + birthMatch.stemRel.text + '）</div>';
          if (birthMatch.seasonText) h += '<div class="tc-content">' + birthMatch.seasonText + '</div>';
        }
        h += '</div>';
      }

      // 星盘合盘
      if (synastry) {
        if (isEn) {
          h += '<div class="text-card"><div class="tc-title">🌌 ' + App.t('性格星图合盘') + '</div>';
          h += '<div class="tc-content">Ascendant: ' + (synastry.ascendantMatch.positive ? 'Harmonious outer personalities, natural attraction.' : 'Different outer styles, need mutual adaptation.') + '</div>';
          h += '<div class="tc-content">Moon: ' + (synastry.moonMatch.positive ? 'Emotional resonance, deep understanding.' : 'Emotional needs differ, nurture with patience.') + '</div>';
          h += '<div class="tc-content" style="color:#f0a8c0;margin-top:6px;">Venus-Mars aspects create ' + (synastry.venusMarsAspects.length ? 'strong romantic chemistry' : 'gentle attraction that grows through daily interaction') + '.</div>';
        } else {
          h += '<div class="text-card"><div class="tc-title">🌌 ' + App.t('性格星图合盘') + ' · ' + synastry.levelTag + '</div>';
          h += '<div class="tc-content">' + App.t('上升') + '：' + synastry.ascendantMatch.text + '</div>';
          h += '<div class="tc-content">' + App.t('月亮') + '：' + synastry.moonMatch.text + '</div>';
          if (synastry.venusMarsAspects.length) {
            synastry.venusMarsAspects.forEach(function (a) {
              h += '<div class="tc-content" style="color:#f0a8c0;margin-top:6px;">✨ ' + a.desc + '：' + a.type + (a.positive ? '（' + App.t('吉') + '）' : '（' + App.t('需经营') + '）') + '</div>';
            });
          } else {
            h += '<div class="tc-content" style="color:#c4a8e8;">金星火星之间暂无强相位，吸引力需要日常互动来点燃。</div>';
          }
          if (synastry.sunMoonAspects.length) {
            synastry.sunMoonAspects.forEach(function (a) {
              h += '<div class="tc-content" style="color:#ffd700;margin-top:6px;">💛 ' + a.desc + '：' + a.type + (a.positive ? '（' + App.t('吉') + '）' : '（' + App.t('需调和') + '）') + '</div>';
            });
          }
        }
        h += '</div>';
      }

      if (natalChart && natalChart.my) {
        var mc = natalChart.my;
        h += '<div class="text-card"><div class="tc-title">🌠 ' + App.t('你的上升星座') + '</div>';
        h += '<div class="tc-content">' + App.t('上升') + ' ' + App.t(mc.ascendant.zodiacName) + '（' + mc.ascendant.degree + '°）· ' + App.t('太阳') + ' ' + App.t(mc.planets.sun.zodiacName) + ' · ' + App.t('月亮') + ' ' + App.t(mc.planets.moon.zodiacName) + '</div>';
        h += '</div>';
      }
      if (natalChart && natalChart.ta) {
        var tc = natalChart.ta;
        h += '<div class="text-card"><div class="tc-title">🌠 ' + App.t('TA的上升星座') + '</div>';
        h += '<div class="tc-content">' + App.t('上升') + ' ' + App.t(tc.ascendant.zodiacName) + '（' + tc.ascendant.degree + '°）· ' + App.t('太阳') + ' ' + App.t(tc.planets.sun.zodiacName) + ' · ' + App.t('月亮') + ' ' + App.t(tc.planets.moon.zodiacName) + '</div>';
        h += '</div>';
      }

      // 年度
      if (yearFortune) {
        if (isEn) {
          var yScore = zp ? zp.score : 60;
          h += '<div class="text-card"><div class="tc-title">📅 ' + (isEn ? yearFortune.year + ' · Yearly Overview' : yearFortune.ganZhi + App.t('年') + ' · ' + yearFortune.summary) + '</div>';
          h += '<div class="tc-content">A year of ' + (yScore >= 75 ? 'growth and opportunity—seize the moment.' : yScore >= 60 ? 'steady progress—consistency pays off.' : 'introspection and preparation—lay foundations for future growth.') + '</div></div>';
        } else {
          h += '<div class="text-card"><div class="tc-title">📅 ' + yearFortune.ganZhi + App.t('年') + ' · ' + yearFortune.summary + '</div>';
          h += '<div class="tc-content">' + (yearFortune.tao || '') + '</div></div>';
        }
      }

      // 生成分享卡按钮
      h += '<button class="btn-primary mt40" onclick="App.pages.result.onGenerateShare()">' + App.t('生成分享卡片') + '</button>';
      h += '<button class="btn-secondary" onclick="App.home()">' + App.t('返回首页') + '</button>';
      h += '<div id="shareModal"></div>';
      h += App.footer();
      h += '</div>';
      return h;
    },

    mount: function () {
      var r = App.store.lastMatch || {};
      var zp = buildPair(r);
      if (zp) { try { page.drawRadar(zp); } catch (e) { console.error(e); } }
    },

    drawRadar: function (pair) {
      var canvas = document.getElementById('resultRadar');
      if (!canvas) return;
      var ctx = canvas.getContext('2d');
      var W = 300, H = 300;
      var dpr = window.devicePixelRatio || 1;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
      var cx = W / 2, cy = H / 2 + 5;
      var R = Math.min(W, H) / 2 - 45;
      var labels = (pair.radarLabels || ['浪漫', '沟通', '默契', '激情', '稳定']).map(function (l) { return App.t(l); });
      var values = (pair.radar || [78, 75, 80, 72, 76]).map(function (v) { return Math.min(100, Math.max(10, v)); });
      var n = labels.length;

      // 5层网格
      for (var ring = 1; ring <= 5; ring++) {
        ctx.beginPath();
        for (var i = 0; i <= n; i++) {
          var idx = i % n;
          var angle = -Math.PI / 2 + idx * 2 * Math.PI / n;
          var r = R * ring / 5;
          var x = cx + r * Math.cos(angle), y = cy + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(255,215,0,0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      // 轴线
      for (i = 0; i < n; i++) {
        var angle2 = -Math.PI / 2 + i * 2 * Math.PI / n;
        ctx.beginPath(); ctx.moveTo(cx, cy);
        ctx.lineTo(cx + R * Math.cos(angle2), cy + R * Math.sin(angle2));
        ctx.strokeStyle = 'rgba(255,215,0,0.1)';
        ctx.lineWidth = 1; ctx.stroke();
      }
      // 数据区
      ctx.beginPath();
      values.forEach(function (v, i) {
        var angle3 = -Math.PI / 2 + i * 2 * Math.PI / n;
        var r3 = R * v / 100;
        var x3 = cx + r3 * Math.cos(angle3), y3 = cy + r3 * Math.sin(angle3);
        if (i === 0) ctx.moveTo(x3, y3); else ctx.lineTo(x3, y3);
      });
      ctx.closePath();
      var grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, 'rgba(196,168,232,0.4)');
      grad.addColorStop(1, 'rgba(240,168,192,0.4)');
      ctx.fillStyle = grad; ctx.fill();
      ctx.strokeStyle = '#c4a8e8'; ctx.lineWidth = 2; ctx.stroke();
      // 数据点
      values.forEach(function (v, i) {
        var angle4 = -Math.PI / 2 + i * 2 * Math.PI / n;
        var r4 = R * v / 100;
        var x4 = cx + r4 * Math.cos(angle4), y4 = cy + r4 * Math.sin(angle4);
        ctx.beginPath(); ctx.arc(x4, y4, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#f0a8c0'; ctx.fill();
      });
      // 标签
      ctx.textAlign = 'center';
      labels.forEach(function (label, i) {
        var angle5 = -Math.PI / 2 + i * 2 * Math.PI / n;
        var labelR = R + 22;
        var x5 = cx + labelR * Math.cos(angle5);
        var y5 = cy + labelR * Math.sin(angle5);
        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        ctx.font = '13px sans-serif';
        ctx.fillText(label, x5, y5);
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(values[i] + App.t('分'), x5, y5 + 16);
      });
    },

    onGenerateShare: function () {
      var btn = event && event.target;
      App.toast('正在生成分享卡片...');
      setTimeout(function () { page._drawShareCard(); }, 50);
    },

    _drawShareCard: function () {
      var r = App.store.lastMatch || {};
      var p = buildPair(r);
      var single = r.singleZodiac || null;
      var animalPair = r.animalPair || null;
      var year = r.year || '';

      var canvas = App.makeCanvas(750, 100);
      var ctx = canvas.getContext('2d');
      var W = 750;

      // 组装总结内容
      var isEn = App.lang === 'en';
      var enCopy = isEn ? buildEnCopy(p) : null;
      var enAnimal = isEn ? buildEnAnimal(animalPair) : null;
      var enSingle = isEn ? buildEnSingle(single) : null;
      var displayCopy = enCopy || (p && p.copy);
      var displayAnimal = enAnimal || animalPair;
      var displaySingle = enSingle || single;

      var summary = '';
      if (p) {
        summary = (displayCopy && displayCopy.comboName ? displayCopy.comboName : (isEn ? 'Your Match' : '你们的组合')) + (isEn ? ': ' : '：') + (displayCopy && displayCopy.summary ? displayCopy.summary : (isEn ? 'Mutual attraction, nurture with care.' : '彼此吸引，需要用心经营。'));
        if (displayAnimal) summary += '\n' + (isEn ? 'Animal signs: ' : '生肖：') + displayAnimal.relName + (isEn ? '. ' : '，') + (displayAnimal.copy && displayAnimal.copy.summary ? displayAnimal.copy.summary : '');
        if (p.score >= 80) summary += isEn ? '\nDeep connection, cherish and cultivate.' : '\n整体缘分深厚，值得珍惜与深耕。';
        else if (p.score >= 70) summary += isEn ? '\nComplementary growth, deeper harmony over time.' : '\n整体互补成长，磨合后更加契合。';
        else summary += isEn ? '\nMore understanding and patience needed for lasting love.' : '\n整体需要更多理解与包容，用心经营方能长久。';
      } else if (displaySingle) {
        summary = isEn
          ? 'Your personal year ahead: ' + (displaySingle.inflTag || 'Growth') + '. ' + (displaySingle.inflTao || '') + ' With sincerity and wisdom, love will find you.'
          : single.name + '在' + year + '年的情感状态为「' + single.inflTag + '」。' + (single.inflTao || '') + '整体来看，' + (single.inflStar || '') + (single.season ? '这段时间' + single.season : '') + '用真诚与智慧经营，爱自然会流向你。';
      } else {
        summary = isEn ? 'No data. Please try again.' : '暂无数据，请重新分析。';
      }
      ctx.font = '20px sans-serif';
      var summaryLines = App.wrapText(ctx, summary, W - 160);

      var dims = isEn ? ['Romance', 'Communication', 'Resonance', 'Passion', 'Stability'] : ['浪漫', '沟通', '默契', '激情', '稳定'];
      var scores = [75, 72, 78, 70, 76];
      if (p && p.radar) {
        scores = p.radar.map(function (v) { return Math.min(100, Math.max(10, v)); });
        dims = (p.radarLabels || dims).map(function (l) { return isEn ? App.t(l) : l; });
      }

      // 计算高度
      var H = 120;
      if (p) {
        H += 60 + 35 + 140 + 35 + 50 + 30 + 320 + dims.length * 55 + 30;
      } else if (displaySingle) {
        var sThemeLines = App.wrapText(ctx, displaySingle.theme || '', W - 160);
        var sInflLines = App.wrapText(ctx, (displaySingle.inflTao || '') + (displaySingle.inflStar || ''), W - 160);
        var sStarLines = App.wrapText(ctx, displaySingle.star || '', W - 160);
        H += 90 + 40 + 50 + 35 + sThemeLines.length * 40 + 40 + 35 + sInflLines.length * 38 + 40 + 35 + sStarLines.length * 38 + 40 + 30;
      }
      H += 60 + summaryLines.length * 35;
      H += 80;

      canvas.width = W;
      canvas.height = H;

      // 背景
      var bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#1a0f3d');
      bg.addColorStop(0.5, '#2d1b5e');
      bg.addColorStop(1, '#150a2e');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = 'rgba(255,215,0,0.25)';
      for (var si = 0; si < 35; si++) {
        ctx.beginPath();
        ctx.arc((si * 73 + 20) % W, (si * 97 + 30) % H, 1 + (si % 3), 0, Math.PI * 2);
        ctx.fill();
      }

      var y = 90;
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,215,0,0.7)';
      ctx.font = '22px sans-serif';
      ctx.fillText(isEn ? '✦ C O M P A T I B I L I T Y ✦' : '✦ ' + App.t('性 格 契 合 度') + ' ✦', W / 2, y);

      if (p) {
        y += 60;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText(App.t(p.me.name) + ' × ' + App.t(p.ta.name), W / 2, y);

        y += 35;
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '20px sans-serif';
        var sub = '';
        if (animalPair) sub = App.t('属' + animalPair.me.name) + ' · ' + App.t('属' + animalPair.ta.name);
        if (year) sub += (sub ? ' · ' : '') + (isEn ? year : year + App.t('年度'));
        if (sub) ctx.fillText(sub, W / 2, y);

        y += 140;
        ctx.font = 'bold 110px sans-serif';
        var sg = ctx.createLinearGradient(0, y - 100, 0, y);
        sg.addColorStop(0, '#ffd700');
        sg.addColorStop(1, '#f0a8c0');
        ctx.fillStyle = sg;
        ctx.fillText(p.score, W / 2, y);

        y += 35;
        ctx.font = '20px sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText(isEn ? 'OVERALL COMPATIBILITY SCORE' : App.t('五 维 综 合 契 合 指 数'), W / 2, y);

        y += 50;
        ctx.font = 'bold 26px sans-serif';
        ctx.fillStyle = '#c4a8e8';
        ctx.fillText((isEn ? '" ' : '『 ') + p.levelTag + (isEn ? ' "' : ' 』'), W / 2, y);

        y += 30;
        var radarY = y + 130;
        App.drawRadar(ctx, { cx: W / 2, cy: radarY, R: 95, values: scores, labels: dims, gridColor: 'rgba(255,215,0,0.15)', lineColor: '#c4a8e8', dotColor: '#f0a8c0', labelColor: 'rgba(255,255,255,0.7)', labelFont: '18px sans-serif' });
        y = radarY + 95 + 70; // 下间距加宽，避免与雷达底部标签重叠

        ctx.font = '19px sans-serif';
        var colors = ['#f0a8c0', '#ffd700', '#e8956a', '#c4a8e8', '#8bc38b'];
        dims.forEach(function (name, i) {
          ctx.fillStyle = 'rgba(255,255,255,0.75)';
          ctx.textAlign = 'left';
          ctx.fillText(name, 90, y);
          ctx.textAlign = 'right';
          ctx.fillStyle = '#ffd700';
          ctx.fillText(scores[i] + (isEn ? '' : App.t('分')), W - 90, y);
          var bw = 400, bx = (W - bw) / 2, by = y + 10;
          ctx.fillStyle = 'rgba(255,255,255,0.1)';
          App.roundRect(ctx, bx, by, bw, 7, 3); ctx.fill();
          ctx.fillStyle = colors[i] || '#c4a8e8';
          App.roundRect(ctx, bx, by, bw * scores[i] / 100, 7, 3); ctx.fill();
          y += 55;
        });
        y += 30;
      } else if (displaySingle) {
        var ds = displaySingle;
        y += 90;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 40px sans-serif';
        ctx.fillText(ds.name || '', W / 2, y);

        y += 40;
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '20px sans-serif';
        ctx.fillText(isEn ? (ds.element || '') + ' element · Ruler: ' + (ds.ruler || '') : ds.element + App.t('象') + ' · ' + App.t('守护星') + ds.ruler, W / 2, y);

        y += 50;
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText((isEn ? '" ' : '『 ') + ds.inflTag + (isEn ? ' "' : ' 』'), W / 2, y);

        y += 35;
        ctx.fillStyle = 'rgba(255,180,100,0.9)';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('✦ ' + App.t('性格主题'), W / 2, y);
        y += 35;
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = '21px sans-serif';
        sThemeLines = App.wrapText(ctx, ds.theme || '', W - 160);
        sThemeLines.forEach(function (line) { ctx.fillText(line, W / 2, y); y += 40; });

        y += 20;
        ctx.fillStyle = 'rgba(255,180,100,0.9)';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('✦ ' + App.t('年度性格倾向'), W / 2, y);
        y += 35;
        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        ctx.font = '20px sans-serif';
        sInflLines = App.wrapText(ctx, (ds.inflTao || '') + (ds.inflStar || ''), W - 160);
        sInflLines.forEach(function (line) { ctx.fillText(line, W / 2, y); y += 38; });

        y += 20;
        ctx.fillStyle = 'rgba(240,168,192,0.9)';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('✦ ' + App.t('性格星图'), W / 2, y);
        y += 35;
        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        ctx.font = '20px sans-serif';
        sStarLines = App.wrapText(ctx, ds.star || '', W - 160);
        sStarLines.forEach(function (line) { ctx.fillText(line, W / 2, y); y += 38; });
        y += 30;
      }

      // 总结卡片
      var cardH = 55 + summaryLines.length * 35;
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      App.roundRect(ctx, 60, y, W - 120, cardH, 16); ctx.fill();
      ctx.strokeStyle = 'rgba(255,215,0,0.3)';
      ctx.lineWidth = 1.5;
      App.roundRect(ctx, 60, y, W - 120, cardH, 16); ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,215,0,0.85)';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('✧ ' + App.t('综 合 解 读') + ' ✧', W / 2, y + 35);

      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.font = '19px sans-serif';
      var ly = y + 65;
      summaryLines.forEach(function (line) {
        if (line.charAt(0) === '\n') line = line.substring(1);
        ctx.fillText(line, W / 2, ly);
        ly += 35;
      });

      // 底部
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.font = '17px sans-serif';
      ctx.fillText(isEn ? 'Personality Compatibility · For entertainment only' : App.t('性格契合度 · 内容仅供娱乐参考'), W / 2, H - 45);
      ctx.fillStyle = 'rgba(255,215,0,0.3)';
      ctx.font = '15px sans-serif';
      ctx.fillText('@copyright 2026 Victoria_Tao', W / 2, H - 20);

      // 显示弹窗
      var modal = document.getElementById('shareModal');
      var dataUrl = canvas.toDataURL('image/png');
      modal.innerHTML = '<div class="modal-mask"><div class="modal-box">' +
        '<img src="' + dataUrl + '" alt="分享卡"/>' +
        '<div class="modal-actions"><button class="mbtn save" onclick="App.pages.result.downloadShare()">' + App.t('保存图片') + '</button>' +
        '<button class="mbtn close" onclick="App.pages.result.closeShare()">' + App.t('关闭') + '</button></div>' +
        '</div></div>';
      App.pages.result._shareCanvas = canvas;
    },

    downloadShare: function () {
      if (App.pages.result._shareCanvas) {
        App.downloadCanvas(App.pages.result._shareCanvas, '性格契合度分享卡.png');
        App.toast('已保存图片');
      }
    },
    closeShare: function () {
      var modal = document.getElementById('shareModal');
      if (modal) modal.innerHTML = '';
    }
  };

  App.pages.result = page;
})();
