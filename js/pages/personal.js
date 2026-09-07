/**
 * pages/personal.js — 个人解读（星座 + 属相 + MBTI + 流年 综合解读 + 总结卡片）
 */
(function () {
  var zodiacData = window.ZD, animalData = window.ZA, mbtiData = window.MBTI;

  var state = {
    zodiacIndex: 0, animalIndex: 0, mbtiIndex: 0, yearIndex: 0,
    zodiacs: zodiacData.ZODIAC, animals: animalData.ANIMALS, mbtiKeys: Object.keys(mbtiData.MBTI_TYPES),
    result: null
  };

  function zodiacOptions() {
    var s = '';
    state.zodiacs.forEach(function (z, i) { s += '<option value="' + i + '" ' + (i === state.zodiacIndex ? 'selected' : '') + '>' + App.t(z.fullName) + '</option>'; });
    return s;
  }
  function animalOptions() {
    var s = '';
    state.animals.forEach(function (a, i) { s += '<option value="' + i + '" ' + (i === state.animalIndex ? 'selected' : '') + '>' + App.t('属' + a.name) + '</option>'; });
    return s;
  }
  function mbtiOptions() {
    var s = '';
    state.mbtiKeys.forEach(function (k, i) {
      s += '<option value="' + i + '" ' + (i === state.mbtiIndex ? 'selected' : '') + '>' + k + ' · ' + App.t(mbtiData.MBTI_TYPES[k].name) + '</option>';
    });
    return s;
  }
  function yearOptions() {
    var thisYear = new Date().getFullYear();
    var years = [];
    for (var i = 0; i < 8; i++) years.push(thisYear - 3 + i);
    var s = '';
    years.forEach(function (y, i) { s += '<option value="' + i + '" ' + (i === state.yearIndex ? 'selected' : '') + '>' + y + App.t('年') + '</option>'; });
    return s;
  }

  function buildAnalysis() {
    var z = state.zodiacs[state.zodiacIndex];
    var a = state.animals[state.animalIndex];
    var mk = state.mbtiKeys[state.mbtiIndex];
    var m = mbtiData.MBTI_TYPES[mk];
    var thisYear = new Date().getFullYear();
    var year = thisYear - 3 + state.yearIndex;

    // 星座年度
    var zf = zodiacData.getSingleZodiacFortune(state.zodiacIndex, year);
    // 属相年度
    var af = animalData.getSingleAnimalFortune(state.animalIndex, year);

    var title = z.name + '座 · 属' + a.name + ' · ' + mk;
    var personality = z.name + '座的你，' + z.traits + '。属' + a.name + '之人，' + a.traits + '。' + m.name + '型人格的你，' + m.desc + '。';
    var strength = '星座赋予你' + (z.keywords[0] || '坚韧') + '与' + (z.keywords[1] || '细腻') + '，属' + a.name + '又带来' + a.keywords[0] + '的底气。MBTI 层面，' + m.strength + '。';
    var challenge = '需要注意' + z.challenge + '。属' + a.name + '之人，' + a.traits + '，同时要平衡' + a.keywords[0] + '与' + a.keywords[1] + '之间的张力。MBTI 上，' + m.challenge + '。';
    var advice = '给' + z.name + '座的一句话：' + z.tip + '。属' + a.name + '之人的建议是：' + af.theme + '。人格层面，' + m.growth + '。';
    var mbtiLove = m.love + '。在感情中，' + z.name + '座的你' + z.tip + '。';

    var flowTitle = year + '流年 · ' + zf.inflTag + ' · ' + af.inflTag;
    var flowContent = zf.theme + '，' + zf.inflTao + '。属' + a.name + '的你在' + year + '年，' + af.theme + '，' + af.inflTao + '。' +
      (zf.season ? '全年节奏：' + zf.season + '。' : '') + '综合来看，' + (zf.star || '') + (af.star || '');

    return {
      title: title,
      personality: personality,
      strength: strength,
      challenge: challenge,
      advice: advice,
      mbtiLove: mbtiLove,
      flowTitle: flowTitle,
      flowContent: flowContent,
      mbtiKey: mk,
      mbtiName: m.name,
      catImage: App.mbtiCat(mk)
    };
  }

  // 英文版本解读（简化）
  function buildAnalysisEn() {
    var z = state.zodiacs[state.zodiacIndex];
    var a = state.animals[state.animalIndex];
    var mk = state.mbtiKeys[state.mbtiIndex];
    var thisYear = new Date().getFullYear();
    var year = thisYear - 3 + state.yearIndex;

    var zName = App.t(z.fullName);
    var aName = App.t(a.name);
    var mTrait = App.mbtiGet(mk, 'trait');
    var mDesc = App.mbtiGet(mk, 'desc');
    var mStrength = App.mbtiGet(mk, 'strength');
    var mChallenge = App.mbtiGet(mk, 'challenge');
    var mGrowth = App.mbtiGet(mk, 'growth');
    var mLove = App.mbtiGet(mk, 'love');

    var title = zName + ' · ' + aName + ' · ' + mk;
    var zTraits = z.enTraits || 'unique';
    var aTraits = a.enTraits || 'strong';
    var zKw0 = App.t(z.keywords[0] || 'resilience');
    var zKw1 = App.t(z.keywords[1] || 'sensitivity');
    var aKw0 = (a.enKeywords && a.enKeywords[0]) || 'determination';
    var aKw1 = (a.enKeywords && a.enKeywords[1]) || 'rest';
    var zChallenge = z.enChallenge || 'overthinking';
    var zTip = z.enTip || 'stay true to yourself';

    var personality = 'As a ' + zName + ', you are ' + zTraits + '. Born in the Year of the ' + aName + ', you carry ' + aTraits + '. As a ' + mk + ' (' + mTrait + '), ' + mDesc + '.';
    var strength = 'Your zodiac gives you ' + zKw0 + ' and ' + zKw1 + '. Your animal sign adds ' + aKw0 + '. As ' + mk + ', your strengths include ' + mStrength + '.';
    var challenge = 'Watch out for ' + zChallenge + '. As a ' + aName + ', balance ' + aKw0 + ' and ' + aKw1 + '. Your MBTI challenge: ' + mChallenge + '.';
    var advice = 'For ' + zName + ': ' + zTip + '. For Year of ' + aName + ': focus on growth. Personal growth: ' + mGrowth + '.';
    var mbtiLove = mLove + '. In relationships, ' + zName + ' you value ' + zTip + '.';

    var flowTitle = year + ' Year Ahead';
    var flowContent = year + ' brings opportunities for growth and self-discovery. Stay open to new experiences and trust your intuition. This is a year to build meaningful connections and pursue your goals with confidence.';

    return {
      title: title,
      personality: personality,
      strength: strength,
      challenge: challenge,
      advice: advice,
      mbtiLove: mbtiLove,
      flowTitle: flowTitle,
      flowContent: flowContent,
      mbtiKey: mk,
      mbtiName: App.t(mbtiData.MBTI_TYPES[mk].name),
      catImage: App.mbtiCat(mk)
    };
  }

  var page = {
    render: function () {
      var h = App.nav('个人解读');
      h += '<div class="page">';
      h += '<div class="section-title">' + App.t('个人解读') + '</div>';
      h += '<div class="section-sub">' + App.t('星座 · 属相 · MBTI · 流年 综合解读') + '</div>';

      h += '<div class="card" style="margin-top:16px;"><div class="card-title">🌠 ' + App.t('星座') + '</div>';
      h += '<div class="custom-select"><select onchange="App.pages.personal.onZodiac(this.value)">' + zodiacOptions() + '</select></div></div>';

      h += '<div class="card"><div class="card-title">🐾 ' + App.t('属相') + '</div>';
      h += '<div class="custom-select"><select onchange="App.pages.personal.onAnimal(this.value)">' + animalOptions() + '</select></div></div>';

      h += '<div class="card"><div class="card-title">🧩 MBTI</div>';
      h += '<div class="custom-select"><select onchange="App.pages.personal.onMbti(this.value)">' + mbtiOptions() + '</select></div>';
      h += '<div class="card-tip" style="margin-top:8px;">' + App.t('不了解自己的 MBTI？') + '<span style="color:#f0a8c0;cursor:pointer;" onclick="App.go(\'mbti-test\')">' + App.t('去测试') + ' →</span></div></div>';

      h += '<div class="card"><div class="card-title">📅 ' + App.t('流年') + '</div>';
      h += '<div class="custom-select"><select onchange="App.pages.personal.onYear(this.value)">' + yearOptions() + '</select></div></div>';

      if (state.result) {
        var r = state.result;
        h += '<div class="section" style="margin-top:24px;"><div class="section-title">✦ ' + r.title + ' ✦</div></div>';
        if (r.catImage) h += '<div style="text-align:center;margin-top:8px;"><img src="' + r.catImage + '" alt="' + r.mbtiKey + '" class="cat-avatar" style="width:120px;height:120px;"/></div>';
        h += '<div class="text-card"><div class="tc-title">✦ ' + App.t('性格画像') + '</div><div class="tc-content">' + r.personality + '</div></div>';
        h += '<div class="text-card"><div class="tc-title">✦ ' + App.t('天赋优势') + '</div><div class="tc-content">' + r.strength + '</div></div>';
        h += '<div class="text-card"><div class="tc-title">✦ ' + App.t('成长挑战') + '</div><div class="tc-content">' + r.challenge + '</div></div>';
        h += '<div class="text-card"><div class="tc-title">✦ ' + App.t('成长建议') + '</div><div class="tc-content">' + r.advice + '</div></div>';
        h += '<div class="text-card"><div class="tc-title">✦ ' + App.t('感情特质') + '</div><div class="tc-content">' + r.mbtiLove + '</div></div>';
        h += '<div class="text-card"><div class="tc-title">✦ ' + r.flowTitle + '</div><div class="tc-content">' + r.flowContent + '</div></div>';
        h += '<button class="btn-primary mt40" onclick="App.pages.personal.onSaveCard()">' + App.t('生成总结卡片') + '</button>';
        h += '<div id="personalCardModal"></div>';
      } else {
        h += '<button class="btn-primary mt40" onclick="App.pages.personal.onAnalyze()">' + App.t('开始解读') + '</button>';
      }

      h += App.footer();
      h += '</div>';
      return h;
    },

    onZodiac: function (v) { state.zodiacIndex = Number(v); state.result = null; App.refresh(); },
    onAnimal: function (v) { state.animalIndex = Number(v); state.result = null; App.refresh(); },
    onMbti: function (v) { state.mbtiIndex = Number(v); state.result = null; App.refresh(); },
    onYear: function (v) { state.yearIndex = Number(v); state.result = null; App.refresh(); },
    onAnalyze: function () {
      state.result = (App.lang === 'en') ? buildAnalysisEn() : buildAnalysis();
      App.refresh();
    },
    onSaveCard: function () {
      App.toast(App.t('正在生成总结卡片...'));
      setTimeout(function () { page._drawCard(); }, 50);
    },

    _drawCard: function () {
      var r = state.result;
      if (!r) { App.toast(App.t('请先开始解读')); return; }
      var catImg = new Image();
      catImg.onload = function () { page._renderCard(r, catImg); };
      catImg.onerror = function () { page._renderCard(r, null); };
      catImg.src = r.catImage;
    },

    // 卡片 HTML 预览（本地 file:// 下也能带猫咪图展示）
    _cardHtml: function (r, catImg) {
      var cat = '';
      if (catImg && catImg.src) {
        cat = '<div style="width:130px;height:130px;border-radius:50%;overflow:hidden;margin:0 auto;border:3px solid rgba(255,215,0,0.6);box-sizing:border-box;"><img src="' + catImg.src + '" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:0;"/></div>';
      }
      var sec = function (label, content, color) {
        return '<div style="margin-top:18px;"><div style="color:' + (color || '#ffd700') + ';font-size:17px;font-weight:700;margin-bottom:8px;">✦ ' + label + '</div><div style="font-size:15px;line-height:1.85;color:rgba(255,255,255,0.85);white-space:pre-wrap;">' + content + '</div></div>';
      };
      return '<div style="width:100%;border-radius:18px;overflow:hidden;background:linear-gradient(180deg,#1a1040,#2d1b5e,#1a1040);color:#fff;padding:30px 24px 22px;box-sizing:border-box;">' +
        '<div style="text-align:center;font-size:24px;color:#ffd700;font-weight:700;letter-spacing:3px;">' + App.t('个人性格总结报告') + '</div>' +
        '<div style="text-align:center;margin-top:18px;">' + cat + '</div>' +
        '<div style="text-align:center;font-size:20px;color:#f0a8c0;margin-top:14px;">' + r.title + '</div>' +
        '<div style="height:1px;background:rgba(255,215,0,0.3);margin:18px 0;"></div>' +
        sec(App.t('性格画像'), r.personality) +
        sec(App.t('天赋优势'), r.strength) +
        sec(App.t('成长挑战'), r.challenge) +
        sec(App.t('成长建议'), r.advice) +
        sec(App.t('感情特质'), r.mbtiLove, '#f0a8c0') +
        sec(r.flowTitle, r.flowContent, '#c4a8e8') +
        '<div style="text-align:center;font-size:12px;color:rgba(255,255,255,0.4);margin-top:20px;line-height:1.7;">' + App.t('仅供娱乐参考') + '<br/>@copyright 2026 Victoria_Tao</div>' +
        '</div>';
    },

    // 渲染卡片：HTML 预览（始终带猫咪图）+ 尽力生成可下载 canvas
    _renderCard: function (r, catImg) {
      try {
        var modal = document.getElementById('personalCardModal');
        if (!modal) { App.toast('卡片容器不存在'); return; }
        modal.innerHTML = '<div class="modal-mask" style="position:fixed;inset:0;background:rgba(0,0,0,0.72);z-index:200;display:flex;align-items:center;justify-content:center;padding:18px;box-sizing:border-box;">' +
          '<div style="width:560px;max-width:100%;max-height:88vh;overflow-y:auto;border-radius:18px;box-sizing:border-box;">' +
          page._cardHtml(r, catImg) +
          '<div style="display:flex;gap:10px;margin-top:14px;">' +
          '<button class="mbtn save" style="flex:1;text-align:center;padding:12px;border-radius:24px;font-size:15px;cursor:pointer;border:none;background:linear-gradient(135deg,#ffd700,#f0a8c0);color:#1a1a4e;font-weight:700;" onclick="App.pages.personal.download()">' + App.t('保存图片') + '</button>' +
          '<button class="mbtn close" style="flex:1;text-align:center;padding:12px;border-radius:24px;font-size:15px;cursor:pointer;border:none;background:rgba(255,255,255,0.12);color:#fff;" onclick="App.pages.personal.close()">' + App.t('关闭') + '</button>' +
          '</div>' +
          '</div></div>';
        page._buildCanvas(r, catImg);
      } catch (e) {
        console.error('总结卡预览失败', e);
        App.toast('生成失败：' + (e && e.message ? e.message : e));
      }
    },

    // 生成可下载 canvas（部署到服务器后图片转 dataURL 可带图导出；file:// 本地受限时出纯文字版）
    _buildCanvas: function (r, catImg) {
      try {
        var canvas = App.makeCanvas(750, 200);
        var ctx = canvas.getContext('2d');
        var W = 750;
        var sections = [
          { label: App.t('性格画像'), content: r.personality },
          { label: App.t('天赋优势'), content: r.strength },
          { label: App.t('成长挑战'), content: r.challenge },
          { label: App.t('成长建议'), content: r.advice },
          { label: App.t('感情特质'), content: r.mbtiLove },
          { label: r.flowTitle, content: r.flowContent }
        ];
        ctx.font = '22px sans-serif';
        var hasCat = catImg && catImg.src && catImg.src.indexOf('data:') === 0;
        var fixedH = hasCat ? 460 : 340;   // 标题+猫咪+名字+分隔线固定区域（与绘制 yPos 对应）
        var secH = 0;
        sections.forEach(function (s) {
          secH += 44 + App.wrapText(ctx, s.content, W - 120).length * 38 + 25;
        });
        var H = Math.max(fixedH + secH, 700);
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
        ctx.fillText(App.t('个人性格总结报告'), W / 2, yPos);
        yPos += 60;

        if (catImg && catImg.src && catImg.src.indexOf('data:') === 0) {
          var catSize = 150;
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
          yPos += catSize + 50;
        } else {
          yPos += 40;
        }

        ctx.fillStyle = '#f0a8c0';
        ctx.font = '28px sans-serif';
        ctx.fillText(r.title, W / 2, yPos);
        yPos += 55;

        ctx.strokeStyle = 'rgba(255,215,0,0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(80, yPos);
        ctx.lineTo(W - 80, yPos);
        ctx.stroke();
        yPos += 55;

        ctx.textAlign = 'left';
        sections.forEach(function (sec) {
          ctx.fillStyle = '#ffd700';
          ctx.font = 'bold 26px sans-serif';
          ctx.fillText(sec.label, 60, yPos);
          yPos += 44;
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          ctx.font = '22px sans-serif';
          App.wrapText(ctx, sec.content, W - 120).forEach(function (line) {
            ctx.fillText(line, 60, yPos);
            yPos += 38;
          });
          yPos += 25;
        });

        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(App.t('仅供娱乐参考'), W / 2, H - 70);
        ctx.fillText('@copyright 2026 Victoria_Tao', W / 2, H - 35);

        canvas.toDataURL('image/png');
        App.pages.personal._canvas = canvas;
      } catch (e) {
        console.warn('下载图生成受限（file:// 本地模式常见）', e);
        App.pages.personal._canvas = null;
      }
    },

    download: function () {
      if (App.pages.personal._canvas) { App.downloadCanvas(App.pages.personal._canvas, '个人解读总结卡.png'); App.toast(App.t('已保存图片')); }
      else { App.toast(App.t('本地预览模式无法导出带图版，可截图保存；部署到服务器后即可保存完整卡片')); }
    },
    close: function () {
      var modal = document.getElementById('personalCardModal');
      if (modal) modal.innerHTML = '';
    }
  };

  App.pages.personal = page;
})();
