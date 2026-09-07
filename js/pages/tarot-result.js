/**
 * pages/tarot-result.js — 卡牌结果（分维度解读 + 综合总结图生成）
 */
(function () {
  var tarotData = window.TR;

  var state = { cards: [], question: '', categories: ['love'], categoryNames: ['情感'], finalSummary: null, finalTitle: '' };

  function buildFinalSummary(cards, categoryNames, question) {
    var uprightCount = cards.filter(function (c) { return c.upright; }).length;
    var reversedCount = cards.length - uprightCount;
    var isEn = App.lang === 'en';
    var names = categoryNames.map(function (n) { return App.t(n); }).join(isEn ? ', ' : '、');
    var uprightKeywords = [], reversedKeywords = [];
    cards.forEach(function (c) {
      if (c.upright) uprightKeywords.push.apply(uprightKeywords, (c.keywords || []));
      else reversedKeywords.push.apply(reversedKeywords, (c.keywords || []));
    });

    var energyLevel, energyText, energyColor;
    if (uprightCount > reversedCount) {
      energyLevel = isEn ? 'Positive' : '积极向上';
      energyText = isEn
        ? 'Mostly upright cards—overall energy flows well. Past efforts are bearing fruit. Now is the time to seize opportunities.'
        : '正位牌居多，整体能量顺畅，所问之事有向好趋势。过去的积累正在显现成果，现在是把握机会、乘胜追击的好时机。';
      energyColor = '#ffd700';
    } else if (reversedCount > uprightCount) {
      energyLevel = isEn ? 'Needs Adjustment' : '需要调整';
      energyText = isEn
        ? 'Mostly reversed cards—some obstacles or inner blocks exist. This is a growth opportunity. Face issues and adjust direction.'
        : '逆位牌居多，提示当前存在一些阻碍或内在卡点。这不是坏消息，而是成长的契机——正视问题、调整方向，低谷之后必有反弹。';
      energyColor = '#f0a8c0';
    } else {
      energyLevel = isEn ? 'Balanced Transition' : '平衡过渡';
      energyText = isEn
        ? 'Equal upright and reversed—opportunities and challenges coexist. A transition period. Stay balanced, advance when ready, retreat when needed.'
        : '正逆位相当，机遇与挑战并存。这是一个过渡期，保持平衡心态，该进取时进取，该退守时退守，方能稳操胜券。';
      energyColor = '#c4a8e8';
    }

    var coreInsight = isEn ? 'Core keywords: ' : '本次卡牌核心关键词：';
    if (uprightKeywords.length) coreInsight += (isEn ? '' : '「') + uprightKeywords.slice(0, 3).join(isEn ? ', ' : '、') + (isEn ? '' : '」');
    if (reversedKeywords.length) coreInsight += (isEn ? '. Watch for: ' : '，需注意「') + reversedKeywords.slice(0, 3).join(isEn ? ', ' : '、') + (isEn ? '.' : '」。');
    if (isEn) {
      coreInsight += ' In ' + names + ', ' + (uprightCount >= reversedCount
        ? 'trust your judgment and act proactively. Maintain confidence and momentum.'
        : 'slow down and look inward first. Clarify obstacles before acting.');
    } else {
      coreInsight += '在「' + names + '」方面，';
      if (uprightCount >= reversedCount) {
        coreInsight += '相信自己的判断，主动出击会有好回报。保持信心和行动力，顺着趋势前行，目标终将达成。';
      } else {
        coreInsight += '放慢脚步，先向内审视，把阻碍看清楚再行动。反思调整不是退缩，而是为了更稳地前进。';
      }
    }

    var actionAdvice = '';
    if (isEn) {
      actionAdvice = cards.length === 1
        ? (cards[0].upright ? 'Now is the time—dont hesitate. Turn ideas into action, small steps at a time.' : 'Pause first. This is not the time to push hard. Break down the problem and wait for clarity.')
        : 'Phase your approach: handle reversed-card issues first, clear obstacles, then use upright energy to move forward. Communicate openly in relationships; deliver results in career; budget carefully in finances.';
    } else {
      if (cards.length === 1) {
        actionAdvice = cards[0].upright
          ? '当下就是最好时机，不要犹豫，把想法转化为行动。小步快跑，边做边调整，你会看到进展。'
          : '先停下来想一想，现在不是硬冲的时候。把问题拆解，找到卡点，等思路清晰了再行动也不迟。';
      } else {
        actionAdvice = '分阶段推进：先处理逆位牌提示的问题，扫清障碍；再借正位牌的能量主动出击。';
        if (categoryNames.indexOf('情感') >= 0) actionAdvice += '感情中多沟通少猜测，用行动表达心意。';
        if (categoryNames.indexOf('事业') >= 0) actionAdvice += '事业上稳扎稳打，用成果说话。';
        if (categoryNames.indexOf('财运') >= 0) actionAdvice += '财务上量入为出，该投资时不犹豫。';
      }
    }

    var keyReminder = isEn
      ? (question ? 'About your question "' + question + '", the answer is in the cards. ' : '') + 'Remember: cards are guidance only. The final choice is yours. Listen to your inner voice.'
      : (question ? '关于你的问题「' + question + '」，答案已在牌中显现。' : '') + '记住：牌面只是提示，最终的选择和行动在你自己手中。听从内心的声音，做出最适合自己的决定。';

    return {
      energyLevel: energyLevel, energyText: energyText, energyColor: energyColor,
      coreInsight: coreInsight, actionAdvice: actionAdvice, keyReminder: keyReminder,
      uprightCount: uprightCount, reversedCount: reversedCount,
      uprightKeywords: uprightKeywords.slice(0, 4), reversedKeywords: reversedKeywords.slice(0, 4)
    };
  }

  var page = {
    render: function () {
      var tarot = App.store.lastTarot;
      if (!tarot || !tarot.result || !tarot.result.length) {
        return App.nav('卡牌结果') + '<div class="page"><div class="loading">' + App.t('请先选牌') + '</div><button class="btn-primary" onclick="App.go(\'tarot\')">' + App.t('去抽牌') + '</button></div>';
      }
      var categories = (tarot.categories && tarot.categories.length) ? tarot.categories : ['love'];
      var categoryNames = categories.map(function (c) { return tarotData.CATEGORY_NAMES[c] || c; });

      state.cards = tarot.result.map(function (r) {
        var isEn = App.lang === 'en';
        var dimensionTexts = {};
        categories.forEach(function (cat) {
          dimensionTexts[cat] = (isEn && tarotData.getDimensionTextEn)
            ? tarotData.getDimensionTextEn(r.card, cat, r.upright)
            : tarotData.getDimensionText(r.card, cat, r.upright);
        });
        var kws = r.upright ? r.card.upright : r.card.reversed;
        if (isEn && tarotData.TAROT_KW_EN && tarotData.TAROT_KW_EN[r.card.id]) {
          kws = r.upright ? tarotData.TAROT_KW_EN[r.card.id].upright : tarotData.TAROT_KW_EN[r.card.id].reversed;
        }
        var cardName = App.t(r.card.name);
        var posLabel = r.upright ? App.t('正位') : App.t('逆位');
        var coreText = isEn
          ? cardName + ' ' + posLabel + '. Core energy: ' + kws.join(', ') + '. ' + (r.upright ? 'Positive forward energy—new opportunities and growth.' : 'Caution needed—slow down and reflect.')
          : r.card.name + (r.upright ? '正位' : '逆位') + '，核心能量是「' + kws.join('、') + '」。' +
            (r.upright ? '这是一股积极向前的能量，代表着新的机会和成长的可能。' : '这是一股需要审慎对待的能量，提示你放慢脚步、反思调整。');
        var combinedText = '';
        if (categories.length > 1) {
          var names = categoryNames.map(function (n) { return App.t(n); }).join(isEn ? ', ' : '、');
          if (isEn) {
            combinedText = r.upright
              ? 'Across these areas, this cards energy reinforces itself positively. Good time to pursue multiple goals. Balance your energy across areas for synergistic results.'
              : 'Across these areas, energy may pull in different directions. Focus on the most important area first, then expand. Prioritize and tackle one at a time.';
          } else if (r.upright) {
            combinedText = '在「' + names + '」这些领域，这张牌的能量会相互促进、形成正向循环。整体趋势向上，适合同时推进多个计划。行动建议：抓住当前的窗口期，把精力均衡分配到各个领域，会有意想不到的协同效应。';
          } else {
            combinedText = '在「' + names + '」这些领域，这张牌的能量可能相互牵制、形成连锁反应。建议不要多线作战，先聚焦最核心的领域突破，再逐步扩展到其他方面。行动建议：列出优先级，逐个解决，避免精力分散导致全面停滞。';
          }
        }
        return {
          id: r.card.id, no: r.card.no, name: r.card.name, en: r.card.en,
          upright: r.upright, positionName: r.positionName,
          keywords: kws,
          text: coreText, dimensionTexts: dimensionTexts, combinedText: combinedText,
          image: App.tarotImage(r.card.id)
        };
      });

      state.question = tarot.question || '';
      state.categories = categories;
      state.categoryNames = categoryNames;
      state.finalSummary = buildFinalSummary(state.cards, categoryNames, state.question);
      var uprightCount = state.cards.filter(function (c) { return c.upright; }).length;
      state.finalTitle = uprightCount > state.cards.length / 2 ? '✦ ' + App.t('整体状态向好') + ' ✦' : '✦ ' + App.t('需要谨慎应对') + ' ✦';

      var h = App.nav('卡牌结果');
      h += '<div class="page">';
      h += '<div class="section-title">' + state.finalTitle + '</div>';
      h += '<div class="section-sub">' + App.t('关注方向') + (App.lang === 'en' ? ': ' : '：') + state.categoryNames.map(function (n) { return App.t(n); }).join(App.lang === 'en' ? ', ' : '、') + (state.question ? (App.lang === 'en' ? ' · Q: ' : ' · ' + App.t('问题') + '：') + state.question : '') + '</div>';

      // 牌面展示
      h += '<div class="tarot-cards">';
      state.cards.forEach(function (c) {
        h += '<div class="tarot-card-item' + (c.upright ? '' : ' reversed') + '">';
        h += '<img class="tc-img" src="' + c.image + '" alt="' + c.name + '"/>';
        h += '<div class="tc-name">' + App.t(c.name) + ' · ' + App.t(c.positionName) + '</div>';
        h += '<div class="tc-pos">' + (c.upright ? App.t('正位') : App.t('逆位')) + '</div>';
        h += '</div>';
      });
      h += '</div>';

      // 每张牌的分维度解读
      state.cards.forEach(function (c, ci) {
        h += '<div class="text-card"><div class="tc-title">🎴 ' + App.t('第') + (ci + 1) + App.t('张') + ' · ' + App.t(c.name) + '（' + (c.upright ? App.t('正位') : App.t('逆位')) + '）· ' + App.t(c.positionName) + '</div>';
        h += '<div class="tc-tags">' + c.keywords.map(function (k) { return '<span class="tag">' + k + '</span>'; }).join('') + '</div>';
        h += '<div class="tc-content" style="margin-top:8px;"><span style="color:#ffd700;">' + App.t('核心含义') + (App.lang === 'en' ? ': ' : '：') + '</span>' + c.text + '</div>';
        // 分维度
        Object.keys(c.dimensionTexts).forEach(function (dk) {
          var dName = tarotData.CATEGORY_NAMES[dk] || dk;
          var bracketL = App.lang === 'en' ? '[' : '【';
          var bracketR = App.lang === 'en' ? ']' : '】';
          h += '<div class="tc-content" style="margin-top:8px;"><span style="color:#f0a8c0;">' + bracketL + App.t(dName) + (App.lang === 'en' ? '' : App.t('维度')) + bracketR + '</span>' + c.dimensionTexts[dk] + '</div>';
        });
        if (c.combinedText) {
          h += '<div class="tc-content" style="margin-top:8px;color:#c4a8e8;">' + (App.lang === 'en' ? '[' : '【') + App.t('多维度联动') + (App.lang === 'en' ? ']' : '】') + c.combinedText + '</div>';
        }
        h += '</div>';
      });

      // 综合解读
      var s = state.finalSummary;
      h += '<div class="section"><div class="section-title">✦ ' + App.t('综合解读') + ' · ' + App.t(s.energyLevel) + ' ✦</div></div>';
      h += '<div class="text-card"><div class="tc-content" style="color:' + s.energyColor + ';">' + s.energyText + '</div></div>';
      h += '<div class="text-card"><div class="tc-title">✦ ' + App.t('核心启示') + '</div><div class="tc-content">' + s.coreInsight + '</div></div>';
      h += '<div class="text-card"><div class="tc-title">✦ ' + App.t('行动建议') + '</div><div class="tc-content" style="color:#8bc38b;">' + s.actionAdvice + '</div></div>';
      h += '<div class="text-card"><div class="tc-title">✦ ' + App.t('重点提醒') + '</div><div class="tc-content" style="color:#f0a8c0;">' + s.keyReminder + '</div></div>';

      h += '<button class="btn-primary mt40" onclick="App.pages.tarotResult.onSaveSummary()">' + App.t('生成总结卡片') + '</button>';
      h += '<button class="btn-secondary" onclick="App.go(\'tarot\')">' + App.t('再抽一次') + '</button>';
      h += '<div id="summaryModal"></div>';
      h += App.footer();
      h += '</div>';
      return h;
    },

    onSaveSummary: function () {
      App.toast('正在生成总结卡片...');
      setTimeout(function () { page._drawSummary(); }, 50);
    },

    _drawSummary: function () {
      var cards = state.cards;
      var s = state.finalSummary;
      var canvas = App.makeCanvas(750, 200);
      var ctx = canvas.getContext('2d');
      var W = 750;

      // 计算高度（与绘制流程逐段精确对应；统一用21px算行数，确保不溢出）
      var isEn = App.lang === 'en';
      var sep = isEn ? ', ' : '、';
      var qPrefix = isEn ? '"' : '「';
      var qSuffix = isEn ? '"' : '」';
      ctx.font = '21px sans-serif';
      var qLines = state.question ? App.wrapText(ctx, qPrefix + state.question + qSuffix, W - 140).length : 0;
      var cardCoreLines = cards.map(function (c) { return App.wrapText(ctx, c.text, W - 140).length; });
      var cardKwLines = cards.map(function (c) { return c.keywords && c.keywords.length ? App.wrapText(ctx, c.keywords.join(sep), W - 160).length : 0; });
      var energyLines = App.wrapText(ctx, s.energyText, W - 120).length;
      var coreInsightLines = App.wrapText(ctx, s.coreInsight, W - 120).length;
      var actionLines = App.wrapText(ctx, (isEn ? 'Action: ' : '行动建议：') + s.actionAdvice, W - 120).length;
      var keyLines = App.wrapText(ctx, s.keyReminder, W - 120).length;

      var H = 85;                                  // 标题起始 y
      H += 42 + 45;                                // 标题→方向→间距
      if (state.question) H += qLines * 28 + 15;   // 问题行
      H += 50;                                     // "抽到的牌"标题段
      H += cards.length * 45;                      // 牌列表
      cards.forEach(function (c, i) { H += cardKwLines[i] * 26; }); // 关键词行
      H += 10 + 40;                                // 分隔线
      H += 53;                                     // "牌面要点"标题段
      cards.forEach(function (c, i) { H += 32 + cardCoreLines[i] * 32 + 15; });
      H += 10 + 40;                                // 分隔线
      H += 53;                                     // "综合解读"标题段
      H += energyLines * 34 + 15;
      H += coreInsightLines * 34 + 15;
      H += actionLines * 34 + 30;
      H += 53;                                     // "重点提醒"标题段
      H += keyLines * 32;
      H += 90;                                     // 底部留白（底部文字在 H-50 / H-22）

      canvas.width = W;
      canvas.height = H;

      // 背景
      var bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, '#1a1040');
      bgGrad.addColorStop(0.5, '#2d1b5e');
      bgGrad.addColorStop(1, '#1a1040');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = 'rgba(255,215,0,0.12)';
      for (var si = 0; si < 30; si++) {
        ctx.beginPath();
        ctx.arc((si * 83 + 25) % W, (si * 107 + 35) % H, (si % 3) + 1, 0, Math.PI * 2);
        ctx.fill();
      }

      var y = 85;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('✦ ' + App.t('卡牌综合解读') + ' ✦', W / 2, y);
      y += 42;
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '21px sans-serif';
      ctx.fillText(App.t('关注方向') + (isEn ? ': ' : '：') + state.categoryNames.map(function (n) { return App.t(n); }).join(sep), W / 2, y);
      y += 45;

      if (state.question) {
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '19px sans-serif';
        var qLines = App.wrapText(ctx, qPrefix + state.question + qSuffix, W - 140);
        qLines.forEach(function (line) { ctx.fillText(line, W / 2, y); y += 28; });
        y += 15;
      }

      // 抽到的牌
      ctx.textAlign = 'left';
      ctx.fillStyle = '#f0a8c0';
      ctx.font = 'bold 25px sans-serif';
      ctx.fillText('✦ ' + App.t('抽到的牌') + '（' + (isEn ? 'Upright ' : App.t('正')) + s.uprightCount + (isEn ? ' · Reversed ' : ' · ' + App.t('逆')) + s.reversedCount + '）', 60, y);
      y += 18;
      ctx.fillStyle = 'rgba(240,168,192,0.4)';
      ctx.fillRect(60, y, 40, 3);
      y += 32;
      cards.forEach(function (card, idx) {
        ctx.fillStyle = card.upright ? '#ffd700' : '#a0b0e0';
        ctx.font = '22px sans-serif';
        ctx.fillText((idx + 1) + '. ' + App.t(card.name) + ' · ' + (card.upright ? App.t('正位') : App.t('逆位')), 80, y);
        if (card.keywords && card.keywords.length) {
          var kwLines2 = App.wrapText(ctx, card.keywords.join(sep), W - 160);
          ctx.fillStyle = 'rgba(255,255,255,0.5)';
          ctx.font = '17px sans-serif';
          kwLines2.forEach(function (line, li) { ctx.fillText(line, 80, y + 28 + li * 24); });
          y += 45 + kwLines2.length * 26;
        } else {
          y += 45;
        }
      });

      y += 10;
      ctx.strokeStyle = 'rgba(255,215,0,0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, y); ctx.lineTo(W - 60, y); ctx.stroke();
      y += 40;

      // 牌面要点
      ctx.fillStyle = '#c4a8e8';
      ctx.font = 'bold 25px sans-serif';
      ctx.fillText('✦ ' + App.t('牌面要点'), 60, y);
      y += 18;
      ctx.fillStyle = 'rgba(196,168,232,0.4)';
      ctx.fillRect(60, y, 40, 3);
      y += 35;
      cards.forEach(function (card) {
        ctx.fillStyle = card.upright ? '#ffd700' : '#a0b0e0';
        ctx.font = 'bold 21px sans-serif';
        ctx.fillText(App.t(card.name) + (card.upright ? (isEn ? ' (Upright)' : '（' + App.t('正位') + '）') : (isEn ? ' (Reversed)' : '（' + App.t('逆位') + '）')), 70, y);
        y += 32;
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.font = '20px sans-serif';
        var coreLines = App.wrapText(ctx, card.text, W - 140);
        coreLines.forEach(function (line) { ctx.fillText(line, 80, y); y += 32; });
        y += 15;
      });

      y += 10;
      ctx.strokeStyle = 'rgba(255,215,0,0.2)';
      ctx.beginPath();
      ctx.moveTo(60, y); ctx.lineTo(W - 60, y); ctx.stroke();
      y += 40;

      // 综合解读
      ctx.fillStyle = s.energyColor;
      ctx.font = 'bold 25px sans-serif';
      ctx.fillText('✦ ' + App.t('综合解读') + (isEn ? ' (' : '（') + s.energyLevel + (isEn ? ')' : '）'), 60, y);
      y += 18;
      ctx.fillStyle = s.energyColor + '66';
      ctx.fillRect(60, y, 40, 3);
      y += 35;
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.font = '21px sans-serif';
      App.wrapText(ctx, s.energyText, W - 120).forEach(function (line) { ctx.fillText(line, 60, y); y += 34; });
      y += 15;
      App.wrapText(ctx, s.coreInsight, W - 120).forEach(function (line) { ctx.fillText(line, 60, y); y += 34; });
      y += 15;
      ctx.fillStyle = '#8bc38b';
      ctx.font = 'bold 21px sans-serif';
      App.wrapText(ctx, App.t('行动建议') + (isEn ? ': ' : '：') + s.actionAdvice, W - 120).forEach(function (line) { ctx.fillText(line, 60, y); y += 34; });
      y += 30;

      // 重点提醒
      ctx.fillStyle = '#f0a8c0';
      ctx.font = 'bold 25px sans-serif';
      ctx.fillText('✦ ' + App.t('重点提醒'), 60, y);
      y += 18;
      ctx.fillStyle = 'rgba(240,168,192,0.4)';
      ctx.fillRect(60, y, 40, 3);
      y += 35;
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.font = '20px sans-serif';
      App.wrapText(ctx, s.keyReminder, W - 120).forEach(function (line) { ctx.fillText(line, 60, y); y += 32; });

      // 底部
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✦ ' + App.t('仅供娱乐参考') + ' ✦', W / 2, H - 50);
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.font = '16px sans-serif';
      ctx.fillText('@copyright 2026 Victoria_Tao', W / 2, H - 22);

      var modal = document.getElementById('summaryModal');
      var dataUrl = canvas.toDataURL('image/png');
      modal.innerHTML = '<div class="modal-mask"><div class="modal-box">' +
        '<img src="' + dataUrl + '" alt="总结卡"/>' +
        '<div class="modal-actions"><button class="mbtn save" onclick="App.pages.tarotResult.download()">' + App.t('保存图片') + '</button>' +
        '<button class="mbtn close" onclick="App.pages.tarotResult.close()">' + App.t('关闭') + '</button></div>' +
        '</div></div>';
      App.pages.tarotResult._canvas = canvas;
    },

    download: function () {
      if (App.pages.tarotResult._canvas) {
        App.downloadCanvas(App.pages.tarotResult._canvas, '卡牌综合解读.png');
        App.toast('已保存图片');
      }
    },
    close: function () {
      var modal = document.getElementById('summaryModal');
      if (modal) modal.innerHTML = '';
    }
  };

  App.pages.tarotResult = page;
})();
