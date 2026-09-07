/**
 * pages/mbti-result.js — 性格速配结果（四维雷达 + 分享卡）
 */
(function () {
  var page = {
    render: function () {
      var r = App.store.mbtiResult;
      if (!r || !r.mbtiResult) {
        return App.nav('速配结果') + '<div class="page"><div class="loading">' + App.t('未找到配对数据') + '</div><button class="btn-primary" onclick="App.go(\'mbti-matching\')">' + App.t('去速配') + '</button></div>';
      }
      var mr = r.mbtiResult;
      page._r = r; page._mr = mr;

      // 根据语言选择配对解读
      var displayMr = mr;
      if (App.lang === 'en' && window.MBTI && window.MBTI.buildMatchEn) {
        var en = window.MBTI.buildMatchEn(mr, r.myMbti, r.taMbti);
        displayMr = Object.assign({}, mr, en);
      }

      var h = App.nav('性格速配结果');
      h += '<div class="page">';

      h += '<div class="result-score-block" style="background:rgba(255,255,255,0.05);border-radius:20px;border:1px solid rgba(255,215,0,0.15);">';
      h += '<div class="result-score" style="font-size:76px;background:linear-gradient(180deg,#ffb464,#f0a8c0);-webkit-background-clip:text;background-clip:text;color:transparent;">' + displayMr.score + '</div>';
      h += '<div class="result-score-label">' + App.t('性格匹配度') + '</div>';
      h += '<div class="result-level">『 ' + displayMr.tag + ' 』</div>';
      h += '</div>';

      h += '<div class="card" style="text-align:center;padding:20px;">';
      h += '<div style="display:flex;justify-content:space-around;align-items:center;">';
      h += '<div><div style="font-size:44px;font-weight:800;color:#fff;">' + r.myMbti + '</div><div style="font-size:14px;color:rgba(255,255,255,0.6);margin-top:4px;">' + App.t(mr.typeA.name) + '</div></div>';
      h += '<div style="font-size:22px;color:rgba(255,215,0,0.5);">VS</div>';
      h += '<div><div style="font-size:44px;font-weight:800;color:#fff;">' + r.taMbti + '</div><div style="font-size:14px;color:rgba(255,255,255,0.6);margin-top:4px;">' + App.t(mr.typeB.name) + '</div></div>';
      h += '</div></div>';

      // 四维雷达
      h += '<div class="section"><div class="section-title">' + App.t('四维契合雷达') + '</div></div>';
      h += '<div class="card"><div class="radar-wrap"><canvas id="mbtiRadar" width="300" height="300" style="width:300px;height:300px;"></canvas></div></div>';

      // 维度条
      h += '<div class="card"><div class="card-title">' + App.t('维度详情') + '</div>';
      displayMr.details.forEach(function (f) {
        h += '<div class="dim-bar-row"><div class="dim-name">' + f.dim + '</div><div class="dim-bar"><div class="dim-bar-inner" style="width:' + f.score + '%;background:#ffb464;"></div></div><div class="dim-score">' + f.score + App.t('分') + '</div></div>';
      });
      h += '</div>';

      h += '<div class="text-card"><div class="tc-title">✦ ' + App.t('综合解读') + '</div><div class="tc-content">' + displayMr.summary + '</div></div>';
      h += '<div class="text-card"><div class="tc-title">✦ ' + App.t('契合优势') + '</div><div class="tc-content">' + displayMr.advantage + '</div></div>';
      h += '<div class="text-card"><div class="tc-title">✦ ' + App.t('相处建议') + '</div><div class="tc-content">' + displayMr.challenge + '</div></div>';

      h += '<button class="btn-primary mt40" onclick="App.pages.mbtiResult.onSave()">' + App.t('生成速配分享卡') + '</button>';
      h += '<button class="btn-secondary" onclick="App.go(\'mbti-matching\')">' + App.t('重新速配') + '</button>';
      h += '<div id="mbtiShareModal"></div>';
      h += App.footer();
      h += '</div>';
      return h;
    },

    mount: function () {
      var mr = page._mr;
      if (!mr || !mr.details) return;
      try { page.drawRadar(mr); } catch (e) { console.error(e); }
    },

    drawRadar: function (mr) {
      var canvas = document.getElementById('mbtiRadar');
      if (!canvas) return;
      var ctx = canvas.getContext('2d');
      var W = 300, H = 300;
      var dpr = window.devicePixelRatio || 1;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
      var cx = W / 2, cy = H / 2, radius = Math.min(W, H) / 2 - 40;
      var factors = mr.details, count = factors.length;
      App.drawRadar(ctx, { cx: cx, cy: cy, R: radius, values: factors.map(function (f) { return f.score; }), labels: factors.map(function (f) { return App.t(f.dim); }), lineColor: '#ffb464', dotColor: '#ffd700', labelColor: 'rgba(255,255,255,0.75)', labelFont: '11px sans-serif' });
    },

    onSave: function () {
      App.toast(App.t('正在生成速配分享卡...'));
      setTimeout(function () { page._drawShareCard(); }, 50);
    },

    _drawShareCard: function () {
      var r = page._r, mr = page._mr;
      // 根据语言选择配对解读
      var displayMr = mr;
      if (App.lang === 'en' && window.MBTI && window.MBTI.buildMatchEn) {
        displayMr = Object.assign({}, mr, window.MBTI.buildMatchEn(mr, r.myMbti, r.taMbti));
      }
      var canvas = App.makeCanvas(750, 200);
      var ctx = canvas.getContext('2d');
      var W = 750;

      // 精确计算高度（与绘制流程逐段对应）
      var isEn = App.lang === 'en';
      ctx.font = '23px sans-serif';
      var summaryLines = App.wrapText(ctx, displayMr.summary || '', W - 200);
      ctx.font = '21px sans-serif';
      var advantageLines = App.wrapText(ctx, displayMr.advantage || '', W - 200);
      var challengeLines = App.wrapText(ctx, displayMr.challenge || '', W - 200);
      var H = 110 + 45 + 90 + 130 + 155 + 60
            + displayMr.details.length * 65
            + 75 + 60 + summaryLines.length * 38 + 30
            + 58 + advantageLines.length * 34 + 30
            + 58 + challengeLines.length * 34
            + 90;
      H = Math.max(H, 1250);
      canvas.width = W; canvas.height = H;

      var bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, '#1a1040');
      bgGrad.addColorStop(0.5, '#2d1b5e');
      bgGrad.addColorStop(1, '#1a1040');
      ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = 'rgba(255,215,0,0.1)';
      for (var si = 0; si < 25; si++) {
        ctx.beginPath(); ctx.arc((si * 83 + 30) % W, (si * 107 + 40) % H, (si % 3) + 1, 0, Math.PI * 2); ctx.fill();
      }

      var y = 110;
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 40px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✦ ' + App.t('性格速配报告') + ' ✦', W / 2, y);
      y += 45;
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '21px sans-serif';
      ctx.fillText(App.t('MBTI 双人性格匹配'), W / 2, y);
      y += 90;

      // 双方MBTI
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 50px sans-serif';
      ctx.fillText(r.myMbti, W / 2 - 160, y);
      y += 10;
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '21px sans-serif';
      ctx.fillText(App.t(mr.typeA.name), W / 2 - 160, y + 30);      ctx.fillStyle = 'rgba(255,215,0,0.4)';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('VS', W / 2, y + 5);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 50px sans-serif';
      ctx.fillText(r.taMbti, W / 2 + 160, y - 10);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '21px sans-serif';
      ctx.fillText(App.t(mr.typeB.name), W / 2 + 160, y + 30);
      y += 130;

      // 分数
      ctx.fillStyle = '#ffb464';
      ctx.font = 'bold 96px sans-serif';
      ctx.fillText(mr.score + '', W / 2, y);
      y += 35;
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '23px sans-serif';
      ctx.fillText(App.t('性格匹配度'), W / 2, y);
      y += 50;
      ctx.fillStyle = '#f0a8c0';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText((isEn ? '" ' : '「') + displayMr.tag + (isEn ? ' "' : '」'), W / 2, y);
      y += 70;

      ctx.strokeStyle = 'rgba(255,215,0,0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(100, y); ctx.lineTo(W - 100, y); ctx.stroke();
      y += 60;

      // 维度
      ctx.textAlign = 'left';
      displayMr.details.forEach(function (f) {
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = '24px sans-serif';
        ctx.fillText(f.dim, 100, y);
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(f.score + App.t('分'), W - 100, y);
        ctx.textAlign = 'left';
        y += 20;
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fillRect(100, y, W - 200, 14);
        var barGrad = ctx.createLinearGradient(100, 0, W - 100, 0);
        barGrad.addColorStop(0, '#ffb464');
        barGrad.addColorStop(1, '#f0a8c0');
        ctx.fillStyle = barGrad;
        ctx.fillRect(100, y, (W - 200) * f.score / 100, 14);
        y += 45;
      });

      y += 20;
      ctx.strokeStyle = 'rgba(255,215,0,0.15)';
      ctx.beginPath(); ctx.moveTo(100, y); ctx.lineTo(W - 100, y); ctx.stroke();
      y += 55;

      // 综合解读
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(App.t('综合解读'), 100, y);
      y += 20;
      ctx.fillStyle = 'rgba(255,180,100,0.5)';
      ctx.fillRect(100, y, 50, 3);
      y += 40;
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.font = '23px sans-serif';
      App.wrapText(ctx, displayMr.summary || '', W - 200).forEach(function (line) { ctx.fillText(line, 100, y); y += 38; });
      y += 30;

      // 契合优势
      ctx.fillStyle = '#ffb464';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('✦ ' + App.t('契合优势'), 100, y);
      y += 20;
      ctx.fillStyle = 'rgba(255,180,100,0.4)';
      ctx.fillRect(100, y, 40, 3);
      y += 38;
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.font = '21px sans-serif';
      App.wrapText(ctx, displayMr.advantage || '', W - 200).forEach(function (line) { ctx.fillText(line, 100, y); y += 34; });
      y += 30;

      // 相处建议
      ctx.fillStyle = '#f0a8c0';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('✦ ' + App.t('相处建议'), 100, y);
      y += 20;
      ctx.fillStyle = 'rgba(240,168,192,0.4)';
      ctx.fillRect(100, y, 40, 3);
      y += 38;
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.font = '21px sans-serif';
      App.wrapText(ctx, displayMr.challenge || '', W - 200).forEach(function (line) { ctx.fillText(line, 100, y); y += 34; });

      // 底部
      var footerY = H - 90;
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✦ ' + App.t('仅供娱乐参考') + ' ✦', W / 2, footerY);
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.font = '18px sans-serif';
      ctx.fillText('@copyright 2026 Victoria_Tao', W / 2, footerY + 35);

      var modal = document.getElementById('mbtiShareModal');
      var dataUrl = canvas.toDataURL('image/png');
      modal.innerHTML = '<div class="modal-mask"><div class="modal-box">' +
        '<img src="' + dataUrl + '" alt="速配分享卡"/>' +
        '<div class="modal-actions"><button class="mbtn save" onclick="App.pages.mbtiResult.download()">' + App.t('保存图片') + '</button>' +
        '<button class="mbtn close" onclick="App.pages.mbtiResult.close()">' + App.t('关闭') + '</button></div>' +
        '</div></div>';
      App.pages.mbtiResult._canvas = canvas;
    },

    download: function () {
      if (App.pages.mbtiResult._canvas) { App.downloadCanvas(App.pages.mbtiResult._canvas, '性格速配分享卡.png'); App.toast(App.t('已保存图片')); }
    },
    close: function () {
      var modal = document.getElementById('mbtiShareModal');
      if (modal) modal.innerHTML = '';
    }
  };

  App.pages.mbtiResult = page;
})();
