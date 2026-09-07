// pages/personal/mbti-test/mbti-test.js
const testData = require('../../../data/mbtiTest.js');
const mbtiData = require('../../../data/mbti.js');
const { MBTI_CATS } = require('../../../utils/imageConfig.js');

Page({
  data: {
    phase: 'start', // start / testing / result
    questions: [],
    currentIndex: 0,
    currentQuestion: null,
    answers: [],
    progress: 0,
    result: null,
    mbtiInfo: null,
    catImage: '',
    dims: [],
    saveImg: '',
    showSaveModal: false
  },

  onLoad() {
    this.setData({ questions: testData.QUESTIONS });
  },

  startTest() {
    this.setData({
      phase: 'testing',
      currentIndex: 0,
      currentQuestion: testData.QUESTIONS[0],
      answers: [],
      progress: 0
    });
  },

  selectOption(e) {
    const value = e.currentTarget.dataset.value;
    const questionId = this.data.currentQuestion.id;
    const answers = [...this.data.answers, { questionId, value }];
    const nextIndex = this.data.currentIndex + 1;
    const progress = Math.round((nextIndex / this.data.questions.length) * 100);

    if (nextIndex >= this.data.questions.length) {
      // 测试完成，计算结果
      const result = testData.calcMbtiType(answers);
      const mbtiInfo = mbtiData.MBTI_TYPES[result.type];
      const catImage = MBTI_CATS[result.type] || '';
      const dims = this.buildDimList(result.dims);
      this.setData({
        phase: 'result',
        answers,
        result,
        mbtiInfo,
        catImage,
        dims,
        progress: 100
      });
    } else {
      this.setData({
        answers,
        currentIndex: nextIndex,
        currentQuestion: this.data.questions[nextIndex],
        progress
      });
    }
  },

  buildDimList(dims) {
    return Object.keys(dims).map(key => {
      const d = dims[key];
      const total = d.left + d.right;
      const leftPercent = total > 0 ? Math.round((d.left / total) * 100) : 50;
      const rightPercent = 100 - leftPercent;
      const dominant = d.left >= d.right ? d.leftLabel : d.rightLabel;
      return {
        key,
        leftLabel: d.leftLabel,
        rightLabel: d.rightLabel,
        leftName: testData.DIM_INFO[d.leftLabel].name,
        rightName: testData.DIM_INFO[d.rightLabel].name,
        leftPercent,
        rightPercent,
        dominant
      };
    });
  },

  restart() {
    this.setData({
      phase: 'start',
      currentIndex: 0,
      currentQuestion: null,
      answers: [],
      progress: 0,
      result: null,
      mbtiInfo: null,
      dims: []
    });
  },

  goPersonal() {
    // 跳转到个人解读页面，带上 MBTI 结果
    wx.navigateTo({
      url: '/pages/personal/personal?mbti=' + this.data.result.type
    });
  },

  goHome() {
    wx.reLaunch({ url: '/pages/index/index' });
  },

  // 生成保存卡片
  generateCard() {
    wx.showLoading({ title: '生成中...' });
    const query = wx.createSelectorQuery();
    query.select('#mbtiCardCanvas').fields({ node: true, size: true }).exec((res) => {
      if (!res[0]) {
        wx.hideLoading();
        wx.showToast({ title: '生成失败', icon: 'none' });
        return;
      }
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const W = 750;
      const H = 1500;
      canvas.width = W;
      canvas.height = H;

      // 加载猫咪图片
      const catImg = canvas.createImage();
      catImg.onload = () => {
        this.drawMbtiCard(canvas, ctx, W, H, catImg);
      };
      catImg.onerror = () => {
        // 图片加载失败，不带图片绘制
        this.drawMbtiCard(canvas, ctx, W, H, null);
      };
      catImg.src = this.data.catImage;
    });
  },

  drawMbtiCard(canvas, ctx, W, H, catImg) {
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
    ctx.fillText('MBTI 性格报告', W / 2, yPos);
    yPos += 70;

    // 猫咪图片（圆形）
    if (catImg) {
      const catSize = 200;
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
      yPos += catSize + 70;
    } else {
      yPos += 60;
    }

    // MBTI类型
    ctx.fillStyle = '#f0a8c0';
    ctx.font = 'bold 56px sans-serif';
    ctx.fillText(this.data.result.type, W / 2, yPos);
    yPos += 60;

    // 人格名称
    ctx.fillStyle = '#fff';
    ctx.font = '30px sans-serif';
    ctx.fillText(this.data.mbtiInfo.name + ' · ' + this.data.mbtiInfo.trait, W / 2, yPos);
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

    // 性格详解
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('性格详解', 60, yPos);
    yPos += 48;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '23px sans-serif';
    const detailLines = this.wrapText(ctx, this.data.mbtiInfo.detail, W - 120, 23);
    detailLines.forEach(line => {
      ctx.fillText(line, 60, yPos);
      yPos += 40;
    });
    yPos += 30;

    // 各板块
    const sections = [
      { label: '天赋优势', content: this.data.mbtiInfo.strength },
      { label: '成长挑战', content: this.data.mbtiInfo.challenge },
      { label: '成长建议', content: this.data.mbtiInfo.growth },
      { label: '感情特质', content: this.data.mbtiInfo.love }
    ];

    sections.forEach(sec => {
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(sec.label, 60, yPos);
      yPos += 44;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '21px sans-serif';
      const lines = this.wrapText(ctx, sec.content, W - 120, 21);
      lines.forEach(line => {
        ctx.fillText(line, 60, yPos);
        yPos += 36;
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
