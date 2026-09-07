/**
 * pages/pro-result.js — 深度匹配 PRO 结果（六维雷达 + 分享卡 + 重抽卡牌）
 */
(function () {
  var tarotData = window.TR, engine = window.TE;

  var DIM_CONFIG = [
    { key: 'zodiac', name: '星座契合', weight: 0.25, color: '#f0a8c0' },
    { key: 'animal', name: '属相契合', weight: 0.10, color: '#ffd700' },
    { key: 'birth', name: '出生信息契合', weight: 0.15, color: '#e8956a' },
    { key: 'astrology', name: '性格星图', weight: 0.20, color: '#c4a8e8' },
    { key: 'year', name: '年度助力', weight: 0.10, color: '#8bc38b' },
    { key: 'tarot', name: '趣味卡牌', weight: 0.20, color: '#8b9dc3' }
  ];

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
  var DEFAULT_THEME = { name: '星夜', image: './love-scope/assets/illustration/home/hero_rose-couple.jpg' };

  function calcYearScore(yf) {
    if (!yf) return 78;
    var theme = yf.theme || '';
    if (/吉|丰|盛|旺|喜/.test(theme)) return 85;
    if (/平|稳|和/.test(theme)) return 78;
    if (/冲|克|破|耗/.test(theme)) return 68;
    return 75;
  }

  function buildSummary(r, score, level) {
    var parts = [], kws = [];
    if (r.zodiacPair) { parts.push(r.zodiacPair.copy.comboName + '的你们，' + r.zodiacPair.copy.summary); kws.push(r.zodiacPair.copy.keywords ? r.zodiacPair.copy.keywords[0] : '星座契合'); }
    if (r.animalPair) { parts.push('生肖上' + r.animalPair.relName + '，' + r.animalPair.copy.summary); }
    if (r.birthMatch) { parts.push('出生年份属性' + r.birthMatch.stemRel.type + '，' + r.birthMatch.ageText); }
    if (r.synastry) { parts.push('性格星图显示' + r.synastry.levelTag + '，' + r.synastry.ascendantMatch.text); }
    if (r.yearFortune) { parts.push(r.year + '年逢' + r.yearFortune.ganZhi + '年，' + r.yearFortune.summary); }
    var text = '';
    if (parts.length >= 3) { text = '综合六维来看，' + parts.slice(0, 2).join('；') + '。' + parts.slice(2).join('；') + '。'; }
    else if (parts.length > 0) { text = parts.join('；') + '。'; }
    else { text = '这段关系有着独特的缘分，需要用心去感受和经营。'; }
    if (score >= 80) text += '整体缘分深厚，值得珍惜与深耕。';
    else if (score >= 70) text += '整体互补成长，彼此磨合后会更加契合。';
    else text += '整体需要更多理解与包容，用心经营方能长久。';
    if (kws.length === 0) kws.push(level);
    return { text: text, kws: kws.slice(0, 4) };
  }

  function compute(r) {
    var dimScores = [], dimLabels = [], dimColors = [];
    var totalWeight = 0, weightedSum = 0;
    DIM_CONFIG.forEach(function (dim) {
      var score = 70;
      if (dim.key === 'zodiac' && r.zodiacPair) score = r.zodiacPair.score;
      else if (dim.key === 'animal' && r.animalPair) score = r.animalPair.score;
      else if (dim.key === 'birth' && r.birthMatch) score = r.birthMatch.totalScore;
      else if (dim.key === 'astrology' && r.synastry) score = r.synastry.totalScore;
      else if (dim.key === 'year' && r.yearFortune) score = calcYearScore(r.yearFortune);
      else if (dim.key === 'tarot') score = r.tarot ? (r.tarot.upright ? 82 : 65) : 75;
      dimScores.push(score);
      dimLabels.push(dim.name);
      dimColors.push(dim.color);
      weightedSum += score * dim.weight;
      totalWeight += dim.weight;
    });
    var baseScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 70;
    var levelTag = baseScore >= 90 ? '天作之合' : baseScore >= 80 ? '高度契合' : baseScore >= 70 ? '互补成长' : baseScore >= 60 ? '需要磨合' : '挑战较大';
    var sm = buildSummary(r, baseScore, levelTag);
    var pairTheme = DEFAULT_THEME;
    if (r.zodiacPair && r.zodiacPair.me && r.zodiacPair.ta) {
      var key = [r.zodiacPair.me.qi, r.zodiacPair.ta.qi].sort().join('');
      pairTheme = ELEMENT_THEME[key] || DEFAULT_THEME;
    }
    return { dimScores: dimScores, dimLabels: dimLabels, dimColors: dimColors, totalScore: baseScore, levelTag: levelTag, summaryText: sm.text, keywords: sm.kws, pairTheme: pairTheme };
  }

  var page = {
    render: function () {
      var r = App.store.proResult;
      if (!r) {
        return App.nav('深度匹配结果') + '<div class="page"><div class="loading">请先进行深度匹配</div><button class="btn-primary" onclick="App.go(\'pro\')">去匹配</button></div>';
      }
      var d = compute(r);
      page._d = d; page._r = r;

      var h = App.nav('深度匹配结果');
      h += '<div class="page">';

      // 主题背景（细长横条 + 截取中下方 + 向下渐隐融合背景）
      h += '<div class="result-hero result-hero-crop"><img src="' + d.pairTheme.image + '" alt="' + d.pairTheme.name + '"/></div>';

      h += '<div class="result-score-block" style="background:rgba(255,255,255,0.05);border-radius:20px;border:1px solid rgba(255,215,0,0.15);">';
      h += '<div class="result-score">' + d.totalScore + '</div>';
      h += '<div class="result-score-label">六维综合契合指数</div>';
      h += '<div class="result-level">『 ' + d.levelTag + ' 』</div>';
      h += '</div>';

      // 六维雷达
      h += '<div class="section"><div class="section-title">六维契合雷达</div></div>';
      h += '<div class="card"><div class="radar-wrap"><canvas id="proRadar" width="300" height="300" style="width:300px;height:300px;"></canvas></div></div>';

      // 维度条
      h += '<div class="card"><div class="card-title">六维详情</div>';
      d.dimLabels.forEach(function (name, i) {
        h += '<div class="dim-bar-row"><div class="dim-name">' + name + '</div><div class="dim-bar"><div class="dim-bar-inner" style="width:' + d.dimScores[i] + '%;background:' + d.dimColors[i] + ';"></div></div><div class="dim-score">' + d.dimScores[i] + '分</div></div>';
      });
      h += '</div>';

      // 综合总结
      h += '<div class="text-card"><div class="tc-title">✧ 综合总结</div><div class="tc-content">' + d.summaryText + '</div></div>';
      if (d.keywords.length) h += '<div class="text-card"><div class="tc-title">✦ 关键词</div><div class="tc-tags">' + d.keywords.map(function (k) { return '<span class="tag">' + k + '</span>'; }).join('') + '</div></div>';

      // 分维度详情
      if (r.zodiacPair) {
        h += '<div class="text-card"><div class="tc-title">✨ 星座契合 · ' + r.zodiacPair.score + '分</div><div class="tc-content">' + r.zodiacPair.copy.comboName + '：' + r.zodiacPair.copy.summary + '</div></div>';
      }
      if (r.animalPair) {
        h += '<div class="text-card"><div class="tc-title">🐾 属相契合 · ' + r.animalPair.score + '分</div><div class="tc-content">' + r.animalPair.relName + '：' + r.animalPair.copy.summary + '</div></div>';
      }
      if (r.birthMatch) {
        h += '<div class="text-card"><div class="tc-title">🎂 出生信息契合 · ' + r.birthMatch.totalScore + '分 · ' + r.birthMatch.levelTag + '</div>';
        h += '<div class="tc-content">' + '年柱 ' + r.birthMatch.myPillar.full + ' × ' + r.birthMatch.taPillar.full + '：' + r.birthMatch.stemRel.type + '（' + r.birthMatch.stemRel.text + '）</div>';
        h += '<div class="tc-content">' + r.birthMatch.ageText + '</div>';
        if (r.birthMatch.seasonText) h += '<div class="tc-content">' + r.birthMatch.seasonText + '</div>';
        h += '</div>';
      }
      if (r.synastry) {
        h += '<div class="text-card"><div class="tc-title">🌌 性格星图 · ' + r.synastry.totalScore + '分 · ' + r.synastry.levelTag + '</div>';
        h += '<div class="tc-content">' + r.synastry.ascendantMatch.text + '</div>';
        h += '<div class="tc-content">' + r.synastry.moonMatch.text + '</div>';
        if (r.synastry.venusMarsAspects.length) {
          r.synastry.venusMarsAspects.forEach(function (a) {
            h += '<div class="tc-content" style="color:#f0a8c0;margin-top:6px;">✨ ' + a.desc + '：' + a.type + (a.positive ? '（吉）' : '（需经营）') + '</div>';
          });
        }
        h += '</div>';
      }
      if (r.yearFortune) {
        h += '<div class="text-card"><div class="tc-title">📅 年度助力 · ' + calcYearScore(r.yearFortune) + '分</div><div class="tc-content">' + r.year + '年逢' + r.yearFortune.ganZhi + '年，' + r.yearFortune.summary + '</div></div>';
      }
      // 卡牌
      if (r.tarot && r.tarot.card) {
        var tc = r.tarot.card;
        var tScore = r.tarot.upright ? 82 : 65;
        h += '<div class="text-card"><div class="tc-title">🎴 趣味卡牌 · ' + tScore + '分 · <span style="font-size:13px;" onclick="App.pages.proResult.onDrawTarot()" style2="cursor:pointer;">（点击重抽）</span></div>';
        h += '<div class="tarot-cards" style="margin:8px 0;">';
        h += '<div class="tarot-card-item' + (r.tarot.upright ? '' : ' reversed') + '"><img class="tc-img" style="width:100px;height:170px;" src="' + tc.image + '" alt="' + tc.name + '"/><div class="tc-name">' + tc.name + '</div><div class="tc-pos">' + (r.tarot.upright ? '正位' : '逆位') + '</div></div>';
        h += '</div>';
        if (tc.love) h += '<div class="tc-content">' + tc.love + '</div>';
        h += '</div>';
      }

      h += '<button class="btn-primary mt40" onclick="App.pages.proResult.onGenerateShare()">生成深度匹配分享卡</button>';
      h += '<div id="proShareModal"></div>';
      h += App.footer();
      h += '</div>';
      return h;
    },

    mount: function () {
      var r = App.store.proResult;
      if (!r) return;
      var d = page._d || compute(r);
      try { page.drawRadar(d); } catch (e) { console.error(e); }
    },

    drawRadar: function (d) {
      var canvas = document.getElementById('proRadar');
      if (!canvas) return;
      var ctx = canvas.getContext('2d');
      var w = 300, h = 300;
      var dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      App.drawRadar(ctx, { cx: w / 2, cy: h / 2 + 2, R: 105, values: d.dimScores, labels: d.dimLabels, lineColor: '#c4a8e8', dotColor: '#f0a8c0', labelColor: 'rgba(255,255,255,0.7)', labelFont: '12px sans-serif' });
    },

    onDrawTarot: function () {
      var r = page._r;
      var drawn = engine.drawCards(tarotData.TAROT, 1, '');
      var card = drawn[0];
      card.card.image = App.tarotImage(card.card.id);
      r.tarot = card;
      var d = compute(r);
      page._d = d;
      App.store.proResult = r;
      App.refresh();
    },

    onGenerateShare: function () {
      App.toast('正在生成深度匹配分享卡...');
      setTimeout(function () { page._drawShareCard(); }, 50);
    },

    _drawShareCard: function () {
      var r = page._r, d = page._d;
      if (!r || !d) { App.toast('请先进行深度匹配'); return; }
      var canvas = App.makeCanvas(750, 200);
      var ctx = canvas.getContext('2d');
      var W = 750;
      ctx.font = '20px sans-serif';  // 与绘制时一致，确保 wrapText 行数准确，避免文字溢出卡片
      var dims = d.dimLabels, scores = d.dimScores;
      var summaryText = d.summaryText;
      var cardW = W - 160;                          // 综合总结卡片更窄居中，两侧留白更多
      var summaryX = (W - cardW) / 2;
      var summaryLines = App.wrapText(ctx, summaryText, cardW - 100);  // 文字两侧各约50px留白
      var hasTarot = !!(r.tarot && r.tarot.card);
      var tarotLines = [];
      if (hasTarot && r.tarot.card.love) tarotLines = App.wrapText(ctx, r.tarot.card.love, cardW - 100);

      var y = 44;
      y += 34 + 46 + 70 + 46 + 30 + 140 + 40 + 60 + 34;   // 顶部各段行距加宽
      var radarCenterY = y + 160;
      y += 320 + 24;
      var dimStartY = y;
      y += dims.length * 62 + 26;                   // 维度条行距加宽
      var summaryStartY = y;
      var summaryCardH = 84 + summaryLines.length * 36;  // 总结卡标题区+正文行距加宽
      y += summaryCardH + 20;
      if (hasTarot) {
        y += 46;
        if (tarotLines.length) y += tarotLines.length * 36;
      }
      y += 36 + 90 + 44;
      var H = y;

      canvas.width = W; canvas.height = H;

      var bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#1a0f3d');
      bg.addColorStop(0.3, '#2d1b5e');
      bg.addColorStop(0.6, '#3d256e');
      bg.addColorStop(1, '#150a2e');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      var glow1 = ctx.createRadialGradient(150, 200, 0, 150, 200, 350);
      glow1.addColorStop(0, 'rgba(240,168,192,0.18)');
      glow1.addColorStop(1, 'rgba(240,168,192,0)');
      ctx.fillStyle = glow1; ctx.fillRect(0, 0, W, H);
      var glow2 = ctx.createRadialGradient(600, H - 300, 0, 600, H - 300, 400);
      glow2.addColorStop(0, 'rgba(196,168,232,0.15)');
      glow2.addColorStop(1, 'rgba(196,168,232,0)');
      ctx.fillStyle = glow2; ctx.fillRect(0, 0, W, H);

      ctx.globalAlpha = 0.5; ctx.fillStyle = '#ffd700';
      for (var si = 0; si < 40; si++) {
        ctx.beginPath(); ctx.arc(Math.random() * W, Math.random() * H, 1 + Math.random() * 2.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      ctx.strokeStyle = 'rgba(255,215,0,0.3)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(100, 60); ctx.lineTo(W - 100, 60); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(150, 70); ctx.lineTo(W - 150, 70); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(100, H - 60); ctx.lineTo(W - 100, H - 60); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(150, H - 70); ctx.lineTo(W - 150, H - 70); ctx.stroke();

      var curY = 112;
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,215,0,0.7)'; ctx.font = '22px sans-serif';
      ctx.fillText('✦ 性 格 契 合 度 · 深 度 匹 配 ✦', W / 2, curY);

      curY += 70;
      ctx.fillStyle = '#fff'; ctx.font = 'bold 34px sans-serif';
      ctx.fillText((r.myInfo.zodiac || '？') + ' × ' + (r.taInfo.zodiac || '？'), W / 2, curY);
      curY += 46;
      ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '22px sans-serif';
      ctx.fillText('属' + (r.myInfo.animal || '？') + ' · 属' + (r.taInfo.animal || '？') + ' · ' + r.year + '年度', W / 2, curY);

      curY += 30 + 140;
      ctx.font = 'bold 130px sans-serif';
      var scoreGrad = ctx.createLinearGradient(0, curY - 130, 0, curY);
      scoreGrad.addColorStop(0, '#ffd700'); scoreGrad.addColorStop(0.5, '#f0c060'); scoreGrad.addColorStop(1, '#f0a8c0');
      ctx.fillStyle = scoreGrad;
      ctx.fillText(d.totalScore, W / 2, curY);
      curY += 40;
      ctx.font = '22px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText('六 维 综 合 契 合 指 数', W / 2, curY);
      curY += 60;
      ctx.font = 'bold 30px sans-serif'; ctx.fillStyle = '#c4a8e8';
      ctx.fillText('『 ' + d.levelTag + ' 』', W / 2, curY);

      App.drawRadar(ctx, { cx: W / 2, cy: radarCenterY, R: 112, values: scores, labels: dims, gridColor: 'rgba(255,215,0,0.15)', lineColor: '#c4a8e8', dotColor: '#f0a8c0', labelColor: 'rgba(255,255,255,0.75)', labelFont: '16px sans-serif' });

      curY = dimStartY;
      ctx.font = '20px sans-serif';
      dims.forEach(function (name, i) {
        ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.textAlign = 'left';
        ctx.fillText(name, 100, curY);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffd700';
        ctx.fillText(scores[i] + '分', W - 100, curY);
        var barW = 420, barX = (W - barW) / 2, barY = curY + 16;
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        App.roundRect(ctx, barX, barY, barW, 8, 4); ctx.fill();
        ctx.fillStyle = d.dimColors[i] || '#c4a8e8';
        App.roundRect(ctx, barX, barY, barW * scores[i] / 100, 8, 4); ctx.fill();
        curY += 62;
      });

      curY = summaryStartY;
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      App.roundRect(ctx, summaryX, curY, cardW, summaryCardH, 18); ctx.fill();
      ctx.strokeStyle = 'rgba(255,215,0,0.25)'; ctx.lineWidth = 1.5;
      App.roundRect(ctx, summaryX, curY, cardW, summaryCardH, 18); ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,215,0,0.8)'; ctx.font = 'bold 22px sans-serif';
      ctx.fillText('✧ 综 合 总 结 ✧', W / 2, curY + 42);
      ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.font = '20px sans-serif';
      summaryLines.forEach(function (line, i) { ctx.fillText(line, W / 2, curY + 84 + i * 36); });

      if (hasTarot) {
        curY = summaryStartY + summaryCardH + 20 + 46;
        ctx.fillStyle = 'rgba(196,168,232,0.9)'; ctx.font = '22px sans-serif';
        ctx.fillText('🎴 趣味卡牌灵感：' + r.tarot.card.name + '（' + (r.tarot.upright ? '正位' : '逆位') + '）', W / 2, curY);
        if (tarotLines.length) {
          ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.font = '20px sans-serif';
          tarotLines.forEach(function (line, i) { ctx.fillText(line, W / 2, curY + 40 + i * 36); });
        }
      }

      ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.font = '20px sans-serif';
      ctx.fillText('性格契合度 · 内容仅供娱乐参考', W / 2, H - 70);
      ctx.fillStyle = 'rgba(255,215,0,0.25)'; ctx.font = '16px sans-serif';
      ctx.fillText('@copyright 2026 Victoria_Tao', W / 2, H - 42);

      var modal = document.getElementById('proShareModal');
      var dataUrl = canvas.toDataURL('image/png');
      modal.innerHTML = '<div class="modal-mask"><div class="modal-box">' +
        '<img src="' + dataUrl + '" alt="深度匹配分享卡"/>' +
        '<div class="modal-actions"><button class="mbtn save" onclick="App.pages.proResult.download()">保存图片</button>' +
        '<button class="mbtn close" onclick="App.pages.proResult.close()">关闭</button></div>' +
        '</div></div>';
      App.pages.proResult._canvas = canvas;
    },

    download: function () {
      if (App.pages.proResult._canvas) { App.downloadCanvas(App.pages.proResult._canvas, '深度匹配分享卡.png'); App.toast('已保存图片'); }
    },
    close: function () {
      var modal = document.getElementById('proShareModal');
      if (modal) modal.innerHTML = '';
    }
  };

  App.pages.proResult = page;
})();
