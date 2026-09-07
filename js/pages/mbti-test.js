/**
 * pages/mbti-test.js — MBTI 性格测试（16题 + 结果 + 猫咪人格 + 报告卡片）
 */
(function () {
  var testData = window.MBTI_TEST, mbtiData = window.MBTI;

  var state = {
    phase: 'start', questions: testData.QUESTIONS,
    currentIndex: 0, currentQuestion: null, answers: [], progress: 0,
    result: null, mbtiInfo: null, catImage: '', dims: []
  };

  function buildDimList(dims) {
    var arr = [];
    var dimInfo = (App.lang === 'en' && testData.DIM_INFO_EN) ? testData.DIM_INFO_EN : testData.DIM_INFO;
    Object.keys(dims).forEach(function (key) {
      var d = dims[key];
      var total = d.left + d.right;
      var leftPercent = total > 0 ? Math.round((d.left / total) * 100) : 50;
      var rightPercent = 100 - leftPercent;
      var dominant = d.left >= d.right ? d.leftLabel : d.rightLabel;
      arr.push({
        key: key,
        leftLabel: d.leftLabel, rightLabel: d.rightLabel,
        leftName: dimInfo[d.leftLabel].name,
        rightName: dimInfo[d.rightLabel].name,
        leftPercent: leftPercent, rightPercent: rightPercent, dominant: dominant
      });
    });
    return arr;
  }

  var page = {
    render: function () {
      var h = App.nav('MBTI 测试');
      h += '<div class="page" id="mbtiBody">' + page._body() + '</div>';
      return h;
    },
    _body: function () {
      var h = '';
      if (state.phase === 'start') {
        h += '<div class="section-title">' + App.t('MBTI 性格测试') + '</div>';
        h += '<div class="section-sub">' + App.t('选择适合你的模式') + '</div>';
        h += '<div class="card" style="margin-top:16px;text-align:center;padding:32px 20px;">';
        h += '<div style="font-size:64px;">🧠</div>';
        h += '<div class="tc-content" style="margin-top:12px;">' + App.t('根据真实 MBTI 理论改编的性格测试') + '</div>';
        h += '<div class="tc-content" style="font-size:13px;color:rgba(255,255,255,0.5);margin-top:6px;">' + App.t('无对错之分 · 遵从第一直觉') + '</div>';
        h += '</div>';
        h += '<button class="btn-primary mt40" onclick="App.pages.mbtiTest.start(\'quick\')">⚡ ' + App.t('快速版 · 16 题（约 2 分钟）') + '</button>';
        h += '<button class="btn-primary" style="margin-top:16px;" onclick="App.pages.mbtiTest.start(\'full\')">✦ ' + App.t('完整版 · 28 题（约 4 分钟）') + '</button>';
      } else if (state.phase === 'testing') {
        var q = state.currentQuestion;
        h += '<div class="section-title">' + App.t('第') + ' ' + (state.currentIndex + 1) + ' / ' + state.questions.length + ' ' + App.t('题') + '</div>';
        h += '<div class="progress-bar"><div class="progress-inner" style="width:' + state.progress + '%;"></div></div>';
        h += '<div class="card" style="margin-top:16px;">';
        h += '<div class="tc-title" style="font-size:19px;">' + q.question + '</div>';
        q.options.forEach(function (opt, i) {
          h += '<div class="option-card" onclick="App.pages.mbtiTest.select(\'' + opt.value + '\')">';
          h += '<div class="option-letter">' + ['A', 'B'][i] + '</div>';
          h += '<div class="option-text">' + opt.text + '</div>';
          h += '</div>';
        });
        h += '</div>';
        h += '<div class="card-tip" style="text-align:center;margin-top:14px;font-size:12px;color:rgba(255,255,255,0.4);">' + App.t('选择更符合你平时状态的选项') + '</div>';
      } else if (state.phase === 'result') {
        var r = state.result, info = state.mbtiInfo, dims = state.dims;
        h += '<div class="section-title">' + App.t('测试完成') + '</div>';
        h += '<div class="section-sub">' + App.t('你的性格类型是') + ' ' + r.type + '</div>';
        h += '<div class="card" style="text-align:center;padding:24px 16px;">';
        if (state.catImage) h += '<img src="' + state.catImage + '" alt="' + App.t('人格猫咪') + '" class="cat-avatar"/>';
        h += '<div style="font-size:52px;font-weight:800;color:#f0a8c0;margin-top:12px;">' + r.type + '</div>';
        h += '<div style="font-size:18px;color:#fff;margin-top:6px;">' + App.t(info.name) + ' · ' + App.mbtiGet(r.type, 'trait') + '</div>';
        h += '<div class="tc-content" style="font-size:14px;color:rgba(255,255,255,0.6);margin-top:8px;">' + App.mbtiGet(r.type, 'desc') + '</div>';
        h += '</div>';

        // 维度占比
        h += '<div class="card"><div class="card-title">' + App.t('维度倾向') + '</div>';
        dims.forEach(function (d) {
          h += '<div class="dim-pair">';
          h += '<div class="dp-side">' + d.leftLabel + ' ' + App.t(d.leftName) + '</div>';
          h += '<div class="dp-bar"><div class="dp-bar-inner" style="width:' + d.leftPercent + '%;"></div></div>';
          h += '<div class="dp-side right">' + d.rightPercent + '%</div>';
          h += '</div>';
          h += '<div class="dim-pair" style="flex-direction:row-reverse;">';
          h += '<div class="dp-side right">' + d.rightLabel + ' ' + App.t(d.rightName) + '</div>';
          h += '<div class="dp-bar"><div class="dp-bar-inner right" style="width:' + d.rightPercent + '%;"></div></div>';
          h += '<div class="dp-side"></div>';
          h += '</div>';
        });
        h += '</div>';

        // 性格详解
        h += '<div class="text-card"><div class="tc-title">✦ ' + App.t('性格详解') + '</div><div class="tc-content">' + App.mbtiGet(r.type, 'detail') + '</div></div>';
        h += '<div class="text-card"><div class="tc-title">✦ ' + App.t('天赋优势') + '</div><div class="tc-content">' + App.mbtiGet(r.type, 'strength') + '</div></div>';
        h += '<div class="text-card"><div class="tc-title">✦ ' + App.t('成长挑战') + '</div><div class="tc-content">' + App.mbtiGet(r.type, 'challenge') + '</div></div>';
        h += '<div class="text-card"><div class="tc-title">✦ ' + App.t('成长建议') + '</div><div class="tc-content">' + App.mbtiGet(r.type, 'growth') + '</div></div>';
        h += '<div class="text-card"><div class="tc-title">✦ ' + App.t('感情特质') + '</div><div class="tc-content">' + App.mbtiGet(r.type, 'love') + '</div></div>';

        h += '<button class="btn-primary mt40" onclick="App.pages.mbtiTest.onGenerateCard()">' + App.t('生成性格报告卡片') + '</button>';
        h += '<div class="btn-row">';
        h += '<button class="btn-secondary" onclick="App.pages.mbtiTest.restart()">' + App.t('重新测试') + '</button>';
        h += '<button class="btn-secondary" onclick="App.go(\'personal\')">' + App.t('去个人解读') + '</button>';
        h += '</div>';
        h += '<div id="mbtiTestCardModal"></div>';
      }
      return h;
    },

    start: function (mode) {
      state.mode = mode || 'quick';
      var qs = (App.lang === 'en' && testData.QUESTIONS_EN) ? testData.QUESTIONS_EN : testData.QUESTIONS;
      state.questions = (mode === 'full') ? qs : qs.slice(0, 16);
      state.phase = 'testing';
      state.currentIndex = 0;
      state.currentQuestion = state.questions[0];
      state.answers = [];
      state.progress = 0;
      App.refresh();
    },
    select: function (value) {
      var q = state.currentQuestion;
      state.answers.push({ questionId: q.id, value: value });
      var nextIndex = state.currentIndex + 1;
      state.progress = Math.round((nextIndex / state.questions.length) * 100);
      if (nextIndex >= state.questions.length) {
        var result = testData.calcMbtiType(state.answers);
        var info = mbtiData.MBTI_TYPES[result.type];
        state.result = result;
        state.mbtiInfo = info;
        state.catImage = App.mbtiCat(result.type);
        state.dims = buildDimList(result.dims);
        state.phase = 'result';
        state.progress = 100;
        App.refresh();
      } else {
        state.currentIndex = nextIndex;
        state.currentQuestion = state.questions[nextIndex];
        App.refresh();
      }
    },
    restart: function () {
      state.phase = 'start';
      state.currentIndex = 0;
      state.currentQuestion = null;
      state.answers = [];
      state.progress = 0;
      state.result = null;
      state.mbtiInfo = null;
      state.dims = [];
      App.refresh();
    },

    onGenerateCard: function () {
      App.toast(App.t('正在生成报告卡片...'));
      setTimeout(function () {
        page._loadCatImg(function (catImg) { page._renderCard(catImg, true); });
      }, 50);
    },

    // 安全加载猫咪图（优先转 dataURL，避免 file:// 下 canvas 污染导致无法导出）
    _loadCatImg: function (cb) {
      var src = state.catImage;
      if (!src) { cb(null); return; }
      var viaImage = function (s) {
        var im = new Image();
        im.onload = function () { cb(im); };
        im.onerror = function () { cb(null); };
        im.src = s;
      };
      if (window.fetch && src.indexOf('data:') !== 0) {
        fetch(src).then(function (resp) { return resp.blob(); }).then(function (blob) {
          var fr = new FileReader();
          fr.onload = function () { viaImage(fr.result); };
          fr.readAsDataURL(blob);
        }).catch(function () { viaImage(src); });
      } else {
        viaImage(src);
      }
    },

    // 卡片 HTML 预览（本地 file:// 下也能带猫咪图展示）
    _cardHtml: function (info, catImg) {
      var cat = '';
      if (catImg && catImg.src) {
        cat = '<div style="width:150px;height:150px;border-radius:50%;overflow:hidden;margin:0 auto;border:3px solid rgba(255,215,0,0.6);box-sizing:border-box;"><img src="' + catImg.src + '" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:0;"/></div>';
      }
      var sec = function (title, content) {
        return '<div style="text-align:left;margin-top:18px;"><div style="color:#ffd700;font-size:17px;font-weight:700;margin-bottom:8px;">✦ ' + title + '</div><div style="font-size:15px;line-height:1.8;color:rgba(255,255,255,0.85);white-space:pre-wrap;">' + content + '</div></div>';
      };
      return '<div style="width:100%;border-radius:18px;overflow:hidden;background:linear-gradient(180deg,#1a1040,#2d1b5e,#1a1040);color:#fff;padding:32px 26px 24px;box-sizing:border-box;">' +
        '<div style="text-align:center;font-size:25px;color:#ffd700;font-weight:700;letter-spacing:4px;">' + App.t('MBTI 性格报告') + '</div>' +
        '<div style="text-align:center;margin-top:22px;">' + cat + '</div>' +
        '<div style="text-align:center;font-size:50px;font-weight:800;color:#f0a8c0;line-height:1.2;margin-top:8px;">' + state.result.type + '</div>' +
        '<div style="text-align:center;font-size:16px;color:#fff;margin-top:6px;">' + App.t(info.name) + ' · ' + App.mbtiGet(state.result.type, 'trait') + '</div>' +
        '<div style="height:1px;background:rgba(255,215,0,0.3);margin:20px 0;"></div>' +
        sec(App.t('性格详解'), App.mbtiGet(state.result.type, 'detail')) +
        sec(App.t('天赋优势'), App.mbtiGet(state.result.type, 'strength')) +
        sec(App.t('成长挑战'), App.mbtiGet(state.result.type, 'challenge')) +
        sec(App.t('成长建议'), App.mbtiGet(state.result.type, 'growth')) +
        sec(App.t('感情特质'), App.mbtiGet(state.result.type, 'love')) +
        '<div style="text-align:center;font-size:12px;color:rgba(255,255,255,0.4);margin-top:22px;line-height:1.7;">' + App.t('仅供娱乐参考') + '<br/>@copyright 2026 Victoria_Tao</div>' +
        '</div>';
    },

    // 渲染报告卡片：HTML 预览（始终带猫咪图）+ 尽力生成可下载 canvas
    _renderCard: function (catImg) {
      try {
        var r = state.result, info = state.mbtiInfo;
        if (!info || !r) { App.toast(App.t('报告数据异常，请重新测试')); return; }
        var modal = document.getElementById('mbtiTestCardModal');
        if (!modal) { App.toast(App.t('卡片容器不存在')); return; }
        modal.innerHTML = '<div class="modal-mask" style="position:fixed;inset:0;background:rgba(0,0,0,0.72);z-index:200;display:flex;align-items:center;justify-content:center;padding:18px;box-sizing:border-box;">' +
          '<div style="width:560px;max-width:100%;max-height:88vh;overflow-y:auto;border-radius:18px;box-sizing:border-box;">' +
          page._cardHtml(info, catImg) +
          '<div style="display:flex;gap:10px;margin-top:14px;">' +
          '<button class="mbtn save" style="flex:1;text-align:center;padding:12px;border-radius:24px;font-size:15px;cursor:pointer;border:none;background:linear-gradient(135deg,#ffd700,#f0a8c0);color:#1a1a4e;font-weight:700;" onclick="App.pages.mbtiTest.download()">' + App.t('保存图片') + '</button>' +
          '<button class="mbtn close" style="flex:1;text-align:center;padding:12px;border-radius:24px;font-size:15px;cursor:pointer;border:none;background:rgba(255,255,255,0.12);color:#fff;" onclick="App.pages.mbtiTest.closeCard()">' + App.t('关闭') + '</button>' +
          '</div>' +
          '</div></div>';
        page._buildCanvas(catImg);
      } catch (e) {
        console.error('报告卡预览失败', e);
        App.toast('生成失败：' + (e && e.message ? e.message : e));
      }
    },

    // 生成可下载的 canvas 图片（部署到服务器后 fetch 转 dataURL 可带图导出；file:// 本地受限时提示）
    _buildCanvas: function (catImg) {
      try {
        var r = state.result, info = state.mbtiInfo;
        var W = 750;
        var canvas = App.makeCanvas(W, 200);
        var ctx = canvas.getContext('2d');
        var hasCat = catImg && catImg.src && catImg.src.indexOf('data:') === 0;

        // 精确计算高度（与绘制流程逐段对应）
        var sections = [
          { label: App.t('天赋优势'), content: App.mbtiGet(r.type, 'strength') },
          { label: App.t('成长挑战'), content: App.mbtiGet(r.type, 'challenge') },
          { label: App.t('成长建议'), content: App.mbtiGet(r.type, 'growth') },
          { label: App.t('感情特质'), content: App.mbtiGet(r.type, 'love') }
        ];
        ctx.font = '23px sans-serif';
        var detailLines = App.wrapText(ctx, App.mbtiGet(r.type, 'detail'), W - 120).length;
        ctx.font = '21px sans-serif';
        var secLines = sections.map(function (s) { return App.wrapText(ctx, s.content, W - 120).length; });
        var H = 80 + 70 + (hasCat ? 270 : 60) + 60 + 55 + 55
              + 48 + detailLines * 40 + 30
              + secLines.reduce(function (a, n, i) { return a + 44 + n * 36 + 25; }, 0)
              + 90;
        canvas.width = W; canvas.height = H;

        var grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#1a1040');
        grad.addColorStop(0.5, '#2d1b5e');
        grad.addColorStop(1, '#1a1040');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = 'rgba(255,215,0,0.3)';
        for (var i = 0; i < 40; i++) {
          ctx.beginPath();
          ctx.arc((i * 73 + 20) % W, (i * 97 + 30) % H, (i % 3) + 1, 0, Math.PI * 2);
          ctx.fill();
        }
        var yPos = 80;
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 38px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(App.t('MBTI 性格报告'), W / 2, yPos);
        yPos += 70;
        if (hasCat) {
          // 只有 dataURL 图片才可安全导出（file:// 本地图片会污染画布）
          var catSize = 200;
          var catX = W / 2, catY = yPos + catSize / 2;
          ctx.save();
          ctx.beginPath();
          ctx.arc(catX, catY, catSize / 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(catImg, catX - catSize / 2, catY - catSize / 2, catSize, catSize);
          ctx.restore();
          ctx.strokeStyle = 'rgba(255,215,0,0.6)';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(catX, catY, catSize / 2, 0, Math.PI * 2);
          ctx.stroke();
          yPos += catSize + 70;
        } else {
          yPos += 60;
        }
        ctx.fillStyle = '#f0a8c0';
        ctx.font = 'bold 56px sans-serif';
        ctx.fillText(r.type, W / 2, yPos);
        yPos += 60;
        ctx.fillStyle = '#fff';
        ctx.font = '30px sans-serif';
        ctx.fillText(App.t(info.name) + ' · ' + App.mbtiGet(r.type, 'trait'), W / 2, yPos);
        yPos += 55;
        ctx.strokeStyle = 'rgba(255,215,0,0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(80, yPos);
        ctx.lineTo(W - 80, yPos);
        ctx.stroke();
        yPos += 55;
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText(App.t('性格详解'), 60, yPos);
        yPos += 48;
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = '23px sans-serif';
        App.wrapText(ctx, App.mbtiGet(r.type, 'detail'), W - 120).forEach(function (line) { ctx.fillText(line, 60, yPos); yPos += 40; });
        yPos += 30;
        sections.forEach(function (sec) {
          ctx.fillStyle = '#ffd700';
          ctx.font = 'bold 26px sans-serif';
          ctx.fillText(sec.label, 60, yPos);
          yPos += 44;
          ctx.fillStyle = 'rgba(255,255,255,0.8)';
          ctx.font = '21px sans-serif';
          App.wrapText(ctx, sec.content, W - 120).forEach(function (line) { ctx.fillText(line, 60, yPos); yPos += 36; });
          yPos += 25;
        });
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(App.t('仅供娱乐参考'), W / 2, H - 70);
        ctx.fillText('@copyright 2026 Victoria_Tao', W / 2, H - 35);
        canvas.toDataURL('image/png');
        App.pages.mbtiTest._canvas = canvas;
      } catch (e) {
        console.warn('下载图生成受限（file:// 本地模式常见）', e);
        App.pages.mbtiTest._canvas = null;
      }
    },

    download: function () {
      if (App.pages.mbtiTest._canvas) { App.downloadCanvas(App.pages.mbtiTest._canvas, 'MBTI性格报告.png'); App.toast(App.t('已保存图片')); }
      else { App.toast(App.t('本地预览模式无法导出带图版，可截图保存；部署到服务器后即可保存完整卡片')); }
    },
    closeCard: function () {
      var modal = document.getElementById('mbtiTestCardModal');
      if (modal) modal.innerHTML = '';
    }
  };

  App.pages.mbtiTest = page;
})();
