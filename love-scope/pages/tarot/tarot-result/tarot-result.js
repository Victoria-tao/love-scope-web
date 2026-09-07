// pages/tarot/tarot-result/tarot-result.js
const { TAROT_IMAGES } = require('../../../utils/imageConfig.js');
const tarotData = require('../../../data/tarot.js');

Page({
  data: {
    cards: [],
    question: '',
    categories: ['love'],
    categoryNames: ['情感'],
    finalSummary: '',
    finalTitle: '',
    showSaveModal: false,
    saveImg: ''
  },

  onLoad() {
    const app = getApp();
    const tarot = app.globalData.lastTarot;
    if (!tarot || !tarot.result || !tarot.result.length) {
      wx.showToast({ title: '请先选牌', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 800);
      return;
    }
    let categories = ['love'];
    if (tarot.categories && tarot.categories.length) {
      categories = tarot.categories;
    } else if (tarot.category) {
      categories = [tarot.category];
    }
    const categoryNames = categories.map(c => tarotData.CATEGORY_NAMES[c] || c);

    const cards = tarot.result.map(r => {
      const dimensionTexts = {};
      categories.forEach(cat => {
        dimensionTexts[cat] = tarotData.getDimensionText(r.card, cat, r.upright);
      });

      // 牌面核心含义（中性，不偏向情感）
      const kws = r.upright ? r.card.upright : r.card.reversed;
      const coreText = r.card.name + (r.upright ? '正位' : '逆位') + '，核心能量是「' + kws.join('、') + '」。' + 
        (r.upright ? '这是一股积极向前的能量，代表着新的机会和成长的可能。' : '这是一股需要审慎对待的能量，提示你放慢脚步、反思调整。');

      // 多维度综合指引（侧重联动分析和行动建议）
      let combinedText = '';
      if (categories.length > 1) {
        const names = categoryNames.join('、');
        if (r.upright) {
          combinedText = '在「' + names + '」这些领域，这张牌的能量会相互促进、形成正向循环。整体趋势向上，适合同时推进多个计划。行动建议：抓住当前的窗口期，把精力均衡分配到各个领域，会有意想不到的协同效应。';
        } else {
          combinedText = '在「' + names + '」这些领域，这张牌的能量可能相互牵制、形成连锁反应。建议不要多线作战，先聚焦最核心的领域突破，再逐步扩展到其他方面。行动建议：列出优先级，逐个解决，避免精力分散导致全面停滞。';
        }
      }

      return {
        id: r.card.id,
        no: r.card.no,
        name: r.card.name,
        en: r.card.en,
        upright: r.upright,
        positionName: r.positionName,
        keywords: r.upright ? r.card.upright : r.card.reversed,
        text: coreText,
        dimensionTexts: dimensionTexts,
        combinedText: combinedText,
        image: TAROT_IMAGES[r.card.id] || ''
      };
    });

    // 生成最终综合总结
    const finalSummary = this.buildFinalSummary(cards, categoryNames, tarot.question);
    const uprightCount = cards.filter(c => c.upright).length;
    const finalTitle = uprightCount > cards.length / 2 ? '✦ 整体状态向好 ✦' : '✦ 需要谨慎应对 ✦';
    // 页面显示用的纯文本版本
    const finalSummaryText = finalSummary.energyText + '\n\n' + finalSummary.coreInsight + '\n\n行动建议：' + finalSummary.actionAdvice + '\n\n' + finalSummary.keyReminder;

    this.setData({
      cards: cards,
      question: tarot.question || '',
      categories: categories,
      categoryNames: categoryNames,
      finalSummary: finalSummary,
      finalSummaryText: finalSummaryText,
      finalTitle: finalTitle
    });
  },

  buildFinalSummary(cards, categoryNames, question) {
    const uprightCount = cards.filter(c => c.upright).length;
    const reversedCount = cards.length - uprightCount;
    const names = categoryNames.join('、');

    // 收集关键词
    const uprightKeywords = [];
    const reversedKeywords = [];
    cards.forEach(c => {
      if (c.upright) uprightKeywords.push(...(c.keywords || []));
      else reversedKeywords.push(...(c.keywords || []));
    });

    // 整体能量判断
    let energyLevel, energyText, energyColor;
    if (uprightCount > reversedCount) {
      energyLevel = '积极向上';
      energyText = '正位牌居多，整体能量顺畅，所问之事有向好趋势。过去的积累正在显现成果，现在是把握机会、乘胜追击的好时机。';
      energyColor = '#ffd700';
    } else if (reversedCount > uprightCount) {
      energyLevel = '需要调整';
      energyText = '逆位牌居多，提示当前存在一些阻碍或内在卡点。这不是坏消息，而是成长的契机——正视问题、调整方向，低谷之后必有反弹。';
      energyColor = '#f0a8c0';
    } else {
      energyLevel = '平衡过渡';
      energyText = '正逆位相当，机遇与挑战并存。这是一个过渡期，保持平衡心态，该进取时进取，该退守时退守，方能稳操胜券。';
      energyColor = '#c4a8e8';
    }

    // 核心启示（合并能量+启示+建议）
    let coreInsight = '本次卡牌核心关键词：';
    if (uprightKeywords.length) coreInsight += '「' + uprightKeywords.slice(0, 3).join('、') + '」';
    if (reversedKeywords.length) coreInsight += '，需注意「' + reversedKeywords.slice(0, 3).join('、') + '」。';
    coreInsight += '在「' + names + '」方面，';
    if (uprightCount >= reversedCount) {
      coreInsight += '相信自己的判断，主动出击会有好回报。保持信心和行动力，顺着趋势前行，目标终将达成。';
    } else {
      coreInsight += '放慢脚步，先向内审视，把阻碍看清楚再行动。反思调整不是退缩，而是为了更稳地前进。';
    }

    // 行动建议
    let actionAdvice = '';
    if (cards.length === 1) {
      actionAdvice = cards[0].upright
        ? '当下就是最好时机，不要犹豫，把想法转化为行动。小步快跑，边做边调整，你会看到进展。'
        : '先停下来想一想，现在不是硬冲的时候。把问题拆解，找到卡点，等思路清晰了再行动也不迟。';
    } else {
      actionAdvice = '分阶段推进：先处理逆位牌提示的问题，扫清障碍；再借正位牌的能量主动出击。';
      if (categoryNames.includes('情感')) actionAdvice += '感情中多沟通少猜测，用行动表达心意。';
      if (categoryNames.includes('事业')) actionAdvice += '事业上稳扎稳打，用成果说话。';
      if (categoryNames.includes('财运')) actionAdvice += '财务上量入为出，该投资时不犹豫。';
    }

    // 重点提醒
    let keyReminder = question ? '关于你的问题「' + question + '」，答案已在牌中显现。' : '';
    keyReminder += '记住：牌面只是提示，最终的选择和行动在你自己手中。听从内心的声音，做出最适合自己的决定。';

    return {
      energyLevel: energyLevel,
      energyText: energyText,
      energyColor: energyColor,
      coreInsight: coreInsight,
      actionAdvice: actionAdvice,
      keyReminder: keyReminder,
      uprightCount: uprightCount,
      reversedCount: reversedCount,
      uprightKeywords: uprightKeywords.slice(0, 4),
      reversedKeywords: reversedKeywords.slice(0, 4)
    };
  },

  // 生成并保存总结图
  onSaveSummary() {
    wx.showLoading({ title: '生成图片中...' });
    const query = wx.createSelectorQuery();
    query.select('#summaryCanvas').fields({ node: true }).exec((res) => {
      if (!res || !res[0] || !res[0].node) {
        wx.hideLoading();
        wx.showToast({ title: '生成失败', icon: 'none' });
        return;
      }
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const W = 750;
      const s = this.data.finalSummary;

      // 计算内容高度
      let H = 180; // 顶部
      H += 70; // 关注方向
      if (this.data.question) H += 60;
      H += 55; // 抽到的牌标题
      H += this.data.cards.length * 45; // 牌列表
      H += 40; // 分隔
      // 牌面要点（每张牌核心含义）
      this.data.cards.forEach(card => {
        H += 35; // 牌名
        const coreLines = this.wrapText(ctx, card.text, W - 140, '20px sans-serif');
        H += coreLines.length * 32;
        H += 15; // 间距
      });
      H += 35; // 分隔
      H += 45; // 综合解读标题
      H += this.wrapText(ctx, s.energyText, W - 120, '21px sans-serif').length * 34;
      H += 15;
      H += this.wrapText(ctx, s.coreInsight, W - 120, '21px sans-serif').length * 34;
      H += 15;
      H += this.wrapText(ctx, '行动建议：' + s.actionAdvice, W - 120, '21px sans-serif').length * 34;
      H += 35; // 间距
      H += 45; // 重点提醒标题
      H += this.wrapText(ctx, s.keyReminder, W - 120, '20px sans-serif').length * 32;
      H += 120; // 底部（多加缓冲空间）

      canvas.width = W;
      canvas.height = H;

      // 背景渐变
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, '#1a1040');
      bgGrad.addColorStop(0.5, '#2d1b5e');
      bgGrad.addColorStop(1, '#1a1040');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // 装饰星星
      ctx.fillStyle = 'rgba(255,215,0,0.12)';
      for (let i = 0; i < 30; i++) {
        const x = (i * 83 + 25) % W;
        const y = (i * 107 + 35) % H;
        const r = (i % 3) + 1;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      let y = 85;

      // ===== 标题 =====
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('✦ 卡牌综合解读 ✦', W / 2, y);
      y += 42;
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '21px sans-serif';
      ctx.fillText('关注方向：' + this.data.categoryNames.join('、'), W / 2, y);
      y += 45;

      // 问题
      if (this.data.question) {
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '19px sans-serif';
        const qLines = this.wrapText(ctx, '「' + this.data.question + '」', W - 140, '19px sans-serif');
        qLines.forEach(line => {
          ctx.fillText(line, W / 2, y);
          y += 28;
        });
        y += 15;
      }

      // ===== 抽到的牌 =====
      ctx.textAlign = 'left';
      ctx.fillStyle = '#f0a8c0';
      ctx.font = 'bold 25px sans-serif';
      ctx.fillText('✦ 抽到的牌（正' + s.uprightCount + ' · 逆' + s.reversedCount + '）', 60, y);
      y += 18;
      ctx.fillStyle = 'rgba(240,168,192,0.4)';
      ctx.fillRect(60, y, 40, 3);
      y += 32;
      this.data.cards.forEach((card, idx) => {
        ctx.fillStyle = card.upright ? '#ffd700' : '#a0b0e0';
        ctx.font = '22px sans-serif';
        ctx.fillText((idx + 1) + '. ' + card.name + ' · ' + (card.upright ? '正位' : '逆位'), 80, y);
        if (card.keywords && card.keywords.length) {
          ctx.fillStyle = 'rgba(255,255,255,0.5)';
          ctx.font = '17px sans-serif';
          ctx.fillText(card.keywords.join('、'), 270, y);
        }
        y += 45;
      });

      // 分隔线
      y += 10;
      ctx.strokeStyle = 'rgba(255,215,0,0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, y);
      ctx.lineTo(W - 60, y);
      ctx.stroke();
      y += 40;

      // ===== 牌面要点 =====
      ctx.fillStyle = '#c4a8e8';
      ctx.font = 'bold 25px sans-serif';
      ctx.fillText('✦ 牌面要点', 60, y);
      y += 18;
      ctx.fillStyle = 'rgba(196,168,232,0.4)';
      ctx.fillRect(60, y, 40, 3);
      y += 35;
      this.data.cards.forEach((card, idx) => {
        ctx.fillStyle = card.upright ? '#ffd700' : '#a0b0e0';
        ctx.font = 'bold 21px sans-serif';
        ctx.fillText(card.name + (card.upright ? '（正位）' : '（逆位）'), 70, y);
        y += 32;
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.font = '20px sans-serif';
        const coreLines = this.wrapText(ctx, card.text, W - 140, '20px sans-serif');
        coreLines.forEach(line => {
          ctx.fillText(line, 80, y);
          y += 32;
        });
        y += 15;
      });

      // 分隔线
      y += 10;
      ctx.strokeStyle = 'rgba(255,215,0,0.2)';
      ctx.beginPath();
      ctx.moveTo(60, y);
      ctx.lineTo(W - 60, y);
      ctx.stroke();
      y += 40;

      // ===== 综合解读（合并能量+启示+建议）=====
      ctx.fillStyle = s.energyColor;
      ctx.font = 'bold 25px sans-serif';
      ctx.fillText('✦ 综合解读（' + s.energyLevel + '）', 60, y);
      y += 18;
      ctx.fillStyle = s.energyColor + '66';
      ctx.fillRect(60, y, 40, 3);
      y += 35;
      // 整体能量
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.font = '21px sans-serif';
      const energyLines = this.wrapText(ctx, s.energyText, W - 120, '21px sans-serif');
      energyLines.forEach(line => {
        ctx.fillText(line, 60, y);
        y += 34;
      });
      y += 15;
      // 核心启示
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      const insightLines = this.wrapText(ctx, s.coreInsight, W - 120, '21px sans-serif');
      insightLines.forEach(line => {
        ctx.fillText(line, 60, y);
        y += 34;
      });
      y += 15;
      // 行动建议（重点标注）
      ctx.fillStyle = '#8bc38b';
      ctx.font = 'bold 21px sans-serif';
      const adviceLines = this.wrapText(ctx, '行动建议：' + s.actionAdvice, W - 120, '21px sans-serif');
      adviceLines.forEach((line, i) => {
        ctx.fillText(line, 60, y);
        y += 34;
      });
      y += 30;

      // ===== 重点提醒 =====
      ctx.fillStyle = '#f0a8c0';
      ctx.font = 'bold 25px sans-serif';
      ctx.fillText('✦ 重点提醒', 60, y);
      y += 18;
      ctx.fillStyle = 'rgba(240,168,192,0.4)';
      ctx.fillRect(60, y, 40, 3);
      y += 35;
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.font = '20px sans-serif';
      const reminderLines = this.wrapText(ctx, s.keyReminder, W - 120, '20px sans-serif');
      reminderLines.forEach(line => {
        ctx.fillText(line, 60, y);
        y += 32;
      });

      // ===== 底部 =====
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✦ 仅供娱乐参考 ✦', W / 2, H - 50);
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.font = '16px sans-serif';
      ctx.fillText('@copyright 2026 Victoria_Tao', W / 2, H - 22);

      // 导出图片
      setTimeout(() => {
        wx.canvasToTempFilePath({
          canvas: canvas,
          success: (res) => {
            wx.hideLoading();
            this.setData({ saveImg: res.tempFilePath, showSaveModal: true });
          },
          fail: () => {
            wx.hideLoading();
            wx.showToast({ title: '生成失败', icon: 'none' });
          }
        }, this);
      }, 100);
    });
  },

  wrapText(ctx, text, maxWidth, fontSize) {
    ctx.font = fontSize; // 关键：测量前设置字体，否则行数计算不准确
    let result = [];
    let line = '';
    for (let i = 0; i < text.length; i++) {
      const testLine = line + text[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line) {
        result.push(line);
        line = text[i];
      } else {
        line = testLine;
      }
    }
    if (line) result.push(line);
    return result;
  },

  saveToAlbum() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.saveImg,
      success: () => {
        wx.showToast({ title: '已保存到相册', icon: 'success' });
        this.setData({ showSaveModal: false });
      },
      fail: () => {
        wx.showToast({ title: '保存失败', icon: 'none' });
      }
    });
  },

  closeSaveModal() {
    this.setData({ showSaveModal: false });
  },

  goTarot() {
    wx.navigateTo({ url: '/pages/tarot/tarot' });
  },
  goHome() {
    wx.reLaunch({ url: '/pages/index/index' });
  }
});
