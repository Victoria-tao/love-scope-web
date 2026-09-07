// pages/personal/personal.js
const mbtiData = require('../../data/mbti.js');
const { MBTI_CATS } = require('../../utils/imageConfig.js');

Page({
  data: {
    mbtiIndex: 0,
    mbtiTypes: [],
    result: null,
    saveImg: '',
    showSaveModal: false
  },

  onLoad(options) {
    const mbtiTypes = Object.keys(mbtiData.MBTI_TYPES);

    let mbtiIndex = 0;
    if (options && options.mbti) {
      const idx = mbtiTypes.indexOf(options.mbti.toUpperCase());
      if (idx >= 0) mbtiIndex = idx;
    }

    this.setData({ mbtiTypes, mbtiIndex });
  },

  onMbtiChange(e) {
    this.setData({ mbtiIndex: Number(e.detail.value) });
  },

  goMbtiTest() {
    wx.navigateTo({ url: '/pages/personal/mbti-test/mbti-test' });
  },

  onAnalyze() {
    const mbtiKey = this.data.mbtiTypes[this.data.mbtiIndex];
    const mbti = mbtiData.MBTI_TYPES[mbtiKey];

    const result = {
      mbti: mbti,
      mbtiKey: mbtiKey,
      title: mbti.name + ' · ' + mbtiKey,
      personality: this.buildPersonality(mbti),
      strength: this.buildStrength(mbti),
      challenge: this.buildChallenge(mbti, mbtiKey),
      advice: this.buildAdvice(mbti),
      mbtiLove: mbti.love
    };

    this.setData({ result });
  },

  buildPersonality(mbti) {
    return '你是' + mbti.name + '（' + mbti.nickname + '）型人格。' + mbti.detail;
  },

  buildStrength(mbti) {
    return mbti.name + '的特质让你在' + mbti.trait.split('·')[0] + '方面尤为突出。' +
      '你的核心优势包括：' + mbti.strength + '。' +
      '在关系中，' + mbti.love + '。';
  },

  buildChallenge(mbti, mbtiKey) {
    return 'MBTI 层面，' + mbti.name + '可能在' +
      (mbtiKey[3] === 'J' ? '灵活性和开放性' : '计划性和执行力') + '上需要提升。' +
      '你的成长挑战在于：' + mbti.challenge + '。';
  },

  buildAdvice(mbti) {
    return '建议你有意识地发展自己的弱势功能：' +
      (mbti.nickname[0] === 'E' ? '适当留独处时间，倾听内心声音' : '主动走出舒适圈，在社交中获取新灵感') + '。' +
      '同时，' + mbti.growth + '。' +
      '在感情方面，' + mbti.love;
  },

  buildCardSummary(result) {
    const m = result.mbti;
    return [
      {
        label: '性格画像',
        content: result.personality
      },
      {
        label: '天赋优势',
        content: result.strength
      },
      {
        label: '成长挑战',
        content: result.challenge
      },
      {
        label: '成长建议',
        content: result.advice
      },
      {
        label: '感情特质',
        content: result.mbtiLove
      }
    ];
  },

  goHome() {
    wx.reLaunch({ url: '/pages/index/index' });
  },

  // 生成保存卡片
  generateCard() {
    wx.showLoading({ title: '生成中...' });
    const query = wx.createSelectorQuery();
    query.select('#cardCanvas').fields({ node: true, size: true }).exec((res) => {
      if (!res[0]) {
        wx.hideLoading();
        wx.showToast({ title: '生成失败', icon: 'none' });
        return;
      }
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const W = 750;
      const H = 1200; // 占位高度，实际由 drawPersonalCard 动态计算
      canvas.width = W;
      canvas.height = H;

      // 获取MBTI猫咪图片
      const mbtiType = this.data.mbtiTypes[this.data.mbtiIndex];
      const catImage = MBTI_CATS[mbtiType] || '';

      if (catImage) {
        const catImg = canvas.createImage();
        catImg.onload = () => {
          this.drawPersonalCard(canvas, ctx, W, H, catImg);
        };
        catImg.onerror = () => {
          this.drawPersonalCard(canvas, ctx, W, H, null);
        };
        catImg.src = catImage;
      } else {
        this.drawPersonalCard(canvas, ctx, W, H, null);
      }
    });
  },

  drawPersonalCard(canvas, ctx, W, H, catImg) {
    // 先计算所有板块内容，用于动态计算卡片高度
    const summarySections = this.buildCardSummary(this.data.result);
    ctx.font = '22px sans-serif';
    let fixedH = 80 + 60 + 55 + 55 + 90; // 标题 + 副标题 + 分隔线 + 底部版权区
    if (catImg) fixedH += 180 + 50; else fixedH += 40;
    let secH = 0;
    summarySections.forEach(sec => {
      secH += 44 + this.wrapText(ctx, sec.content, W - 120, 22).length * 38 + 25;
    });
    H = Math.max(fixedH + secH, 700);
    canvas.height = H;

    // 背景渐变
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#1a1040');
    grad.addColorStop(0.5, '#2d1b5e');
    grad.addColorStop(1, '#1a1040');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // 装饰星星
    ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
    for (let i = 0; i < 40; i++) {
      const x = (i * 73 + 20) % W;
      const y = (i * 97 + 30) % H;
      const r = (i % 3) + 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    let yPos = 80;

    // 标题
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 38px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('个人性格报告', W / 2, yPos);
    yPos += 60;

    // 猫咪图片（圆形）
    if (catImg) {
      const catSize = 180;
      const catX = W / 2;
      const catY = yPos + catSize / 2;
      ctx.save();
      ctx.beginPath();
      ctx.arc(catX, catY, catSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(catImg, catX - catSize / 2, catY - catSize / 2, catSize, catSize);
      ctx.restore();
      // 金色边框
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(catX, catY, catSize / 2, 0, Math.PI * 2);
      ctx.stroke();
      yPos += catSize + 50;
    } else {
      yPos += 40;
    }

    // 副标题（MBTI 类型）
    ctx.fillStyle = '#f0a8c0';
    ctx.font = '28px sans-serif';
    ctx.fillText(this.data.result.title, W / 2, yPos);
    yPos += 55;

    // 分隔线
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(80, yPos);
    ctx.lineTo(W - 80, yPos);
    ctx.stroke();
    yPos += 55;

    ctx.textAlign = 'left';

    // 综合总结（分板块，小标题金色）
    summarySections.forEach(sec => {
      // 小标题（金色）
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(sec.label, 60, yPos);
      yPos += 44;

      // 内容（白色）
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = '22px sans-serif';
      const wrapped = this.wrapText(ctx, sec.content, W - 120, 22);
      wrapped.forEach(line => {
        ctx.fillText(line, 60, yPos);
        yPos += 38;
      });
      yPos += 25;
    });

    // 底部
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('仅供娱乐参考', W / 2, H - 70);
    ctx.fillText('@copyright 2026 Victoria_Tao', W / 2, H - 35);

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
      });
    }, 100);
  },

  wrapText(ctx, text, maxWidth, fontSize) {
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
  }
});
