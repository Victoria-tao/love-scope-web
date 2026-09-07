// pages/mbti-result/mbti-result.js 性格速配结果
const mbti = require('../../data/mbti.js');

Page({
  data: {
    myMbti: '', taMbti: '',
    mbtiResult: null,
    showShare: false,
    shareImage: ''
  },

  onLoad() {
    const app = getApp();
    const r = app.globalData.mbtiResult;
    if (!r) {
      wx.showToast({ title: '未找到配对数据', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }
    this.setData({
      myMbti: r.myMbti, taMbti: r.taMbti,
      mbtiResult: r.mbtiResult
    }, () => {
      this.drawRadar();
    });
  },

  // 绘制四维匹配雷达图（MBTI 四个维度）
  drawRadar() {
    const details = this.data.mbtiResult.details;
    if (!details) return;
    const ctx = wx.createCanvasContext('radarCanvas', this);
    const cx = 172, cy = 105, radius = 72;
    const factors = details;
    const count = factors.length;

    // 背景网格
    ctx.setStrokeStyle('rgba(255,215,0,0.12)');
    ctx.setLineWidth(1);
    for (let ring = 1; ring <= 4; ring++) {
      ctx.beginPath();
      for (let i = 0; i <= count; i++) {
        const angle = (Math.PI * 2 * i / count) - Math.PI / 2;
        const r = radius * ring / 4;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // 轴线
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i / count) - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      ctx.stroke();
    }

    // 数据区域
    const grad = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
    grad.addColorStop(0, 'rgba(255,180,100,0.45)');
    grad.addColorStop(1, 'rgba(240,168,192,0.45)');
    ctx.setFillStyle(grad);
    ctx.setStrokeStyle('#ffb464');
    ctx.setLineWidth(2);
    ctx.beginPath();
    factors.forEach((f, i) => {
      const angle = (Math.PI * 2 * i / count) - Math.PI / 2;
      const r = radius * f.score / 100;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 数据点
    factors.forEach((f, i) => {
      const angle = (Math.PI * 2 * i / count) - Math.PI / 2;
      const r = radius * f.score / 100;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.setFillStyle('#ffd700');
      ctx.fill();
    });

    // 标签
    ctx.setTextAlign('center');
    factors.forEach((f, i) => {
      const angle = (Math.PI * 2 * i / count) - Math.PI / 2;
      const labelR = radius + 22;
      const x = cx + Math.cos(angle) * labelR;
      const y = cy + Math.sin(angle) * labelR;
      ctx.setFillStyle('rgba(255,255,255,0.75)');
      ctx.setFontSize(11);
      ctx.fillText(f.dim, x, y);
      ctx.setFillStyle('rgba(255,215,0,0.9)');
      ctx.setFontSize(10);
      ctx.fillText(f.score + '分', x, y + 14);
    });

    ctx.draw();
  },

  // 生成分享卡片
  saveCard() {
    wx.showLoading({ title: '生成卡片中...' });
    const query = wx.createSelectorQuery();
    query.select('#shareCanvas').fields({ node: true, size: true }).exec((res) => {
      if (!res[0]) {
        wx.hideLoading();
        wx.showToast({ title: '生成失败，请重试', icon: 'none' });
        return;
      }
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const W = 750;
      // 先估算高度
      const mbtiResult = this.data.mbtiResult;
      let estimateH = 1400;
      // 根据内容长度估算
      const summaryLen = (mbtiResult.summary || '').length;
      const advLen = (mbtiResult.advantage || '').length;
      const chalLen = (mbtiResult.challenge || '').length;
      estimateH += Math.ceil(summaryLen / 20) * 38;
      estimateH += Math.ceil(advLen / 20) * 34;
      estimateH += Math.ceil(chalLen / 20) * 34;
      const H = Math.max(estimateH, 1600);
      canvas.width = W;
      canvas.height = H;

      this.drawShareCard(ctx, W, H, () => {
        wx.canvasToTempFilePath({
          canvas: canvas,
          success: (res) => {
            wx.hideLoading();
            this.setData({ showShare: true, shareImage: res.tempFilePath });
          },
          fail: () => {
            wx.hideLoading();
            wx.showToast({ title: '生成失败，请重试', icon: 'none' });
          }
        });
      });
    });
  },

  drawShareCard(ctx, W, H, callback) {
    const mbtiResult = this.data.mbtiResult;
    const myMbti = this.data.myMbti;
    const taMbti = this.data.taMbti;

    // 背景渐变
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#1a1040');
    bgGrad.addColorStop(0.5, '#2d1b5e');
    bgGrad.addColorStop(1, '#1a1040');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 装饰星星（柔和）
    ctx.fillStyle = 'rgba(255,215,0,0.1)';
    for (let i = 0; i < 25; i++) {
      const x = (i * 83 + 30) % W;
      const y = (i * 107 + 40) % H;
      const r = (i % 3) + 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    let y = 110;

    // ===== 标题区 =====
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 40px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦ 性格速配报告 ✦', W / 2, y);
    y += 45;
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '21px sans-serif';
    ctx.fillText('MBTI 双人性格匹配', W / 2, y);
    y += 90;

    // ===== 双方MBTI展示（左右分开，中间留空） =====
    ctx.textAlign = 'center';
    // 左边
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 50px sans-serif';
    ctx.fillText(myMbti, W / 2 - 160, y);
    y += 10;
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '21px sans-serif';
    ctx.fillText(mbtiResult.typeA.name, W / 2 - 160, y + 30);
    // 中间VS
    ctx.fillStyle = 'rgba(255,215,0,0.4)';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('VS', W / 2, y + 5);
    // 右边
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 50px sans-serif';
    ctx.fillText(taMbti, W / 2 + 160, y - 10);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '21px sans-serif';
    ctx.fillText(mbtiResult.typeB.name, W / 2 + 160, y + 30);
    y += 130;

    // ===== 综合分数（单独一块，和上面分开） =====
    ctx.fillStyle = '#ffb464';
    ctx.font = 'bold 96px sans-serif';
    ctx.fillText(mbtiResult.score + '', W / 2, y);
    y += 35;
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '23px sans-serif';
    ctx.fillText('性格匹配度', W / 2, y);
    y += 50;
    ctx.fillStyle = '#f0a8c0';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('「' + mbtiResult.tag + '」', W / 2, y);
    y += 70;

    // 分隔线
    ctx.strokeStyle = 'rgba(255,215,0,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, y);
    ctx.lineTo(W - 100, y);
    ctx.stroke();
    y += 60;

    // ===== 各维度分数 =====
    ctx.textAlign = 'left';
    mbtiResult.details.forEach((f, idx) => {
      // 维度名称
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.font = '24px sans-serif';
      ctx.fillText(f.dim, 100, y);
      // 分数
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(f.score + '分', W - 100, y);
      ctx.textAlign = 'left';
      y += 20;
      // 进度条背景
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillRect(100, y, W - 200, 14);
      // 进度条
      const barGrad = ctx.createLinearGradient(100, 0, W - 100, 0);
      barGrad.addColorStop(0, '#ffb464');
      barGrad.addColorStop(1, '#f0a8c0');
      ctx.fillStyle = barGrad;
      ctx.fillRect(100, y, (W - 200) * f.score / 100, 14);
      y += 45;
    });

    y += 20;
    // 分隔线
    ctx.strokeStyle = 'rgba(255,215,0,0.15)';
    ctx.beginPath();
    ctx.moveTo(100, y);
    ctx.lineTo(W - 100, y);
    ctx.stroke();
    y += 55;

    // ===== 综合解读 =====
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('综合解读', 100, y);
    y += 20;
    // 装饰线
    ctx.fillStyle = 'rgba(255,180,100,0.5)';
    ctx.fillRect(100, y, 50, 3);
    y += 40;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = '23px sans-serif';
    const summaryLines = this.wrapText(ctx, mbtiResult.summary || '', W - 200);
    summaryLines.forEach(line => {
      ctx.fillText(line, 100, y);
      y += 38;
    });
    y += 30;

    // ===== 契合优势 =====
    ctx.fillStyle = '#ffb464';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('✦ 契合优势', 100, y);
    y += 20;
    ctx.fillStyle = 'rgba(255,180,100,0.4)';
    ctx.fillRect(100, y, 40, 3);
    y += 38;
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '21px sans-serif';
    const advLines = this.wrapText(ctx, mbtiResult.advantage || '', W - 200);
    advLines.forEach(line => {
      ctx.fillText(line, 100, y);
      y += 34;
    });
    y += 30;

    // ===== 相处建议 =====
    ctx.fillStyle = '#f0a8c0';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('✦ 相处建议', 100, y);
    y += 20;
    ctx.fillStyle = 'rgba(240,168,192,0.4)';
    ctx.fillRect(100, y, 40, 3);
    y += 38;
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '21px sans-serif';
    const chalLines = this.wrapText(ctx, mbtiResult.challenge || '', W - 200);
    chalLines.forEach(line => {
      ctx.fillText(line, 100, y);
      y += 34;
    });

    // ===== 底部 =====
    const footerY = H - 90;
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦ 仅供娱乐参考 ✦', W / 2, footerY);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '18px sans-serif';
    ctx.fillText('@copyright 2026 Victoria_Tao', W / 2, footerY + 35);

    if (callback) callback();
  },

  wrapText(ctx, text, maxWidth) {
    const result = [];
    let line = '';
    for (let i = 0; i < text.length; i++) {
      const testLine = line + text[i];
      if (ctx.measureText(testLine).width > maxWidth && line) {
        result.push(line);
        line = text[i];
      } else {
        line = testLine;
      }
    }
    if (line) result.push(line);
    return result;
  },

  // 保存图片到相册
  saveImage() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success: () => {
        wx.showToast({ title: '已保存到相册', icon: 'success' });
      },
      fail: (err) => {
        if (err.errMsg.includes('auth deny')) {
          wx.showModal({
            title: '需要授权',
            content: '请在设置中开启保存到相册的权限',
            confirmText: '去设置',
            success: (res) => {
              if (res.confirm) wx.openSetting();
            }
          });
        } else {
          wx.showToast({ title: '保存失败', icon: 'none' });
        }
      }
    });
  },

  closeShare() {
    this.setData({ showShare: false });
  },

  goHome() {
    wx.reLaunch({ url: '/pages/index/index' });
  },

  goBack() {
    wx.navigateBack();
  }
});
