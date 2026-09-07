// pages/pro-result/pro-result.js 专业版深度匹配综合结果
const tarotData = require('../../data/tarot.js');
const tarotEngine = require('../../utils/tarotEngine.js');
const { TAROT_IMAGES, IMG_BASE } = require('../../utils/imageConfig.js');
const ILLU_BASE = IMG_BASE + '/pair-themes/';

// 按五行气属（火土木水）匹配配对主题背景图
const ELEMENT_THEME = {
  '火火': { name: '炽夏', image: ILLU_BASE + '01_chixia_fire-fire.jpg' },
  '土火': { name: '暖秋', image: ILLU_BASE + '02_nuanqiu_fire-earth.jpg' },
  '木火': { name: '春晓', image: ILLU_BASE + '03_chunxiao_fire-wood.jpg' },
  '水火': { name: '晨昏', image: ILLU_BASE + '04_chenhun_fire-water.jpg' },
  '土土': { name: '厚土', image: ILLU_BASE + '05_houtu_earth-earth.jpg' },
  '土木': { name: '山风', image: ILLU_BASE + '06_shanfeng_earth-wood.jpg' },
  '土水': { name: '溪谷', image: ILLU_BASE + '07_xigu_earth-water.jpg' },
  '木木': { name: '林风', image: ILLU_BASE + '08_linfeng_wood-wood.jpg' },
  '木水': { name: '春涧', image: ILLU_BASE + '09_chunjian_wood-water.jpg' },
  '水水': { name: '深海', image: ILLU_BASE + '10_shenhai_water-water.jpg' }
};
const DEFAULT_THEME = { name: '星夜', image: IMG_BASE + '/home/hero_rose-couple.jpg' };

const DIM_CONFIG = [
  { key: 'zodiac', name: '星座契合', weight: 0.25, color: '#f0a8c0' },
  { key: 'animal', name: '属相契合', weight: 0.10, color: '#ffd700' },
  { key: 'birth', name: '出生信息契合', weight: 0.15, color: '#e8956a' },
  { key: 'astrology', name: '性格星图', weight: 0.20, color: '#c4a8e8' },
  { key: 'year', name: '年度助力', weight: 0.10, color: '#8bc38b' },
  { key: 'tarot', name: '趣味卡牌', weight: 0.20, color: '#8b9dc3' }
];

Page({
  data: {
    year: '', myInfo: {}, taInfo: {},
    zodiacPair: null, animalPair: null,
    birthMatch: null, natalChart: null, synastry: null,
    yearFortune: null, yearScore: 78,
    tarot: null, tarotScore: 0,
    totalScore: 0, levelTag: '',
    summaryText: '', keywords: [],
    dimLabels: [], dimScores: [], dimColors: [],
    pairTheme: null,
    shareImg: '', showShareModal: false, isGenerating: false
  },

  onLoad() {
    const app = getApp();
    const r = app.globalData.proResult;
    if (!r) {
      wx.showToast({ title: '请先进行匹配', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 800);
      return;
    }

    // 计算各维度分数
    const dimScores = [];
    const dimLabels = [];
    const dimColors = [];
    let totalWeight = 0;
    let weightedSum = 0;

    DIM_CONFIG.forEach(dim => {
      let score = 70; // 默认分，确保始终6个维度
      if (dim.key === 'zodiac' && r.zodiacPair) score = r.zodiacPair.score;
      else if (dim.key === 'animal' && r.animalPair) score = r.animalPair.score;
      else if (dim.key === 'birth' && r.birthMatch) score = r.birthMatch.totalScore;
      else if (dim.key === 'astrology' && r.synastry) score = r.synastry.totalScore;
      else if (dim.key === 'year' && r.yearFortune) score = this.calcYearScore(r.yearFortune);
      else if (dim.key === 'tarot') score = r.tarot ? (r.tarot.upright ? 82 : 65) : 75;

      dimScores.push(score);
      dimLabels.push(dim.name);
      dimColors.push(dim.color);
      weightedSum += score * dim.weight;
      totalWeight += dim.weight;
    });

    const baseScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 70;

    // 等级
    let levelTag = '';
    if (baseScore >= 90) levelTag = '天作之合';
    else if (baseScore >= 80) levelTag = '高度契合';
    else if (baseScore >= 70) levelTag = '互补成长';
    else if (baseScore >= 60) levelTag = '需要磨合';
    else levelTag = '挑战较大';

    // 综合总评
    const summary = this.buildSummary(r, baseScore, levelTag);
    const keywords = this.buildKeywords(r, baseScore);

    // 配对背景图（按五行气属匹配）
    let pairTheme = null;
    if (r.zodiacPair && r.zodiacPair.me && r.zodiacPair.ta) {
      const key = [r.zodiacPair.me.qi, r.zodiacPair.ta.qi].sort().join('');
      pairTheme = ELEMENT_THEME[key] || DEFAULT_THEME;
    } else {
      pairTheme = DEFAULT_THEME;
    }

    this.setData({
      year: r.year, myInfo: r.myInfo || {}, taInfo: r.taInfo || {},
      zodiacPair: r.zodiacPair, animalPair: r.animalPair,
      birthMatch: r.birthMatch, natalChart: r.natalChart, synastry: r.synastry,
      yearFortune: r.yearFortune, yearScore: this.calcYearScore(r.yearFortune),
      tarot: r.tarot || null,
      totalScore: baseScore, levelTag,
      summaryText: summary.text, keywords: summary.kws || keywords,
      dimLabels, dimScores, dimColors,
      pairTheme
    });
  },

  onReady() {
    if (this.data.dimScores.length > 0) {
      setTimeout(() => this.drawRadar(), 150);
    }
  },

  calcYearScore(yf) {
    if (!yf) return 78;
    const theme = yf.theme || '';
    if (/吉|丰|盛|旺|喜/.test(theme)) return 85;
    if (/平|稳|和/.test(theme)) return 78;
    if (/冲|克|破|耗/.test(theme)) return 68;
    return 75;
  },

  buildSummary(r, score, level) {
    const parts = [];
    const kws = [];
    if (r.zodiacPair) {
      parts.push(r.zodiacPair.copy.comboName + '的你们，' + r.zodiacPair.copy.summary);
      kws.push(r.zodiacPair.copy.keywords ? r.zodiacPair.copy.keywords[0] : '星座契合');
    }
    if (r.animalPair) {
      parts.push('生肖上' + r.animalPair.relName + '，' + r.animalPair.copy.summary);
    }
    if (r.birthMatch) {
      parts.push('出生年份属性' + r.birthMatch.stemRel.type + '，' + r.birthMatch.ageText);
    }
    if (r.synastry) {
      parts.push('性格星图显示' + r.synastry.levelTag + '，' + r.synastry.ascendantMatch.text);
    }
    if (r.yearFortune) {
      parts.push(r.year + '年逢' + r.yearFortune.ganZhi + '年，' + r.yearFortune.summary);
    }

    let text = '';
    if (parts.length >= 3) {
      text = '综合六维来看，' + parts.slice(0, 2).join('；') + '。' + parts.slice(2).join('；') + '。';
    } else if (parts.length > 0) {
      text = parts.join('；') + '。';
    } else {
      text = '这段关系有着独特的缘分，需要用心去感受和经营。';
    }

    if (score >= 80) text += '整体缘分深厚，值得珍惜与深耕。';
    else if (score >= 70) text += '整体互补成长，彼此磨合后会更加契合。';
    else text += '整体需要更多理解与包容，用心经营方能长久。';

    if (kws.length === 0) kws.push(level);
    return { text, kws: kws.slice(0, 4) };
  },

  buildKeywords(r, score) {
    const kws = [];
    if (r.zodiacPair && r.zodiacPair.copy.keywords) kws.push(...r.zodiacPair.copy.keywords);
    if (r.animalPair) kws.push(r.animalPair.relName);
    if (r.synastry) kws.push(r.synastry.levelTag);
    return kws.slice(0, 4);
  },

  drawRadar(retry) {
    const values = this.data.dimScores;
    const labels = this.data.dimLabels;
    if (!values || !values.length) return;
    const query = wx.createSelectorQuery();
    query.select('#proRadar').fields({ node: true, size: true }).exec((res) => {
      if (!res || !res[0] || !res[0].node) {
        if ((retry || 0) < 5) {
          setTimeout(() => this.drawRadar((retry || 0) + 1), 100);
        }
        return;
      }
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const dpr = wx.getSystemInfoSync().pixelRatio;
      const w = res[0].width, h = res[0].height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) / 2 - 40;
      const n = values.length;
      ctx.clearRect(0, 0, w, h);
      for (let lv = 1; lv <= 5; lv++) {
        const r = (R * lv) / 5;
        ctx.beginPath();
        for (let i = 0; i <= n; i++) {
          const ang = -Math.PI / 2 + (i % n) * (2 * Math.PI / n);
          const x = cx + r * Math.cos(ang), y = cy + r * Math.sin(ang);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(255,215,0,0.1)'; ctx.lineWidth = 1; ctx.stroke();
      }
      for (let i = 0; i < n; i++) {
        const ang = -Math.PI / 2 + i * (2 * Math.PI / n);
        ctx.beginPath(); ctx.moveTo(cx, cy);
        ctx.lineTo(cx + R * Math.cos(ang), cy + R * Math.sin(ang));
        ctx.strokeStyle = 'rgba(255,215,0,0.1)'; ctx.lineWidth = 1; ctx.stroke();
      }
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const v = values[i] / 100;
        const ang = -Math.PI / 2 + i * (2 * Math.PI / n);
        const x = cx + R * v * Math.cos(ang), y = cy + R * v * Math.sin(ang);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, 'rgba(196,168,232,0.4)');
      grad.addColorStop(1, 'rgba(240,168,192,0.4)');
      ctx.fillStyle = grad; ctx.fill();
      ctx.strokeStyle = '#c4a8e8'; ctx.lineWidth = 2; ctx.stroke();
      for (let i = 0; i < n; i++) {
        const v = values[i] / 100;
        const ang = -Math.PI / 2 + i * (2 * Math.PI / n);
        const x = cx + R * v * Math.cos(ang), y = cy + R * v * Math.sin(ang);
        ctx.beginPath(); ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#f0a8c0'; ctx.fill();
      }
      ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '12px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (let i = 0; i < n; i++) {
        const ang = -Math.PI / 2 + i * (2 * Math.PI / n);
        const lx = cx + (R + 22) * Math.cos(ang), ly = cy + (R + 22) * Math.sin(ang);
        ctx.fillText(labels[i], lx, ly);
        ctx.fillStyle = 'rgba(255,215,0,0.9)';
        ctx.fillText(values[i], lx, ly + 14);
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
      }
    });
  },

  onDrawTarot() {
    const drawn = tarotEngine.drawCards(tarotData.TAROT, 1, '');
    const card = drawn[0];
    card.card.image = TAROT_IMAGES[card.card.id] || '';
    const score = card.upright ? 82 : 65;
    this.setData({ tarot: card, tarotScore: score });

    // 更新趣味卡牌维度分数
    const dimScores = [...this.data.dimScores];
    const tarotIdx = this.data.dimLabels.findIndex(l => l === '趣味卡牌');
    if (tarotIdx >= 0) {
      dimScores[tarotIdx] = score;
    }

    // 重新计算综合分
    let weightedSum = 0;
    let totalWeight = 0;
    DIM_CONFIG.forEach((dim, i) => {
      if (dimScores[i] !== undefined) {
        weightedSum += dimScores[i] * dim.weight;
        totalWeight += dim.weight;
      }
    });
    const newTotal = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 70;

    let levelTag = '';
    if (newTotal >= 90) levelTag = '天作之合';
    else if (newTotal >= 80) levelTag = '高度契合';
    else if (newTotal >= 70) levelTag = '互补成长';
    else if (newTotal >= 60) levelTag = '需要磨合';
    else levelTag = '挑战较大';

    this.setData({ dimScores, totalScore: newTotal, levelTag });
    setTimeout(() => this.drawRadar(), 100);
  },

  onGenerateShare() {
    if (this.data.isGenerating) return;
    this.setData({ isGenerating: true });
    wx.showLoading({ title: '绘制中...', mask: true });
    setTimeout(() => this._drawShareCard(), 100);
  },

  _drawShareCard() {
    const query = wx.createSelectorQuery();
    query.select('#shareCanvas').fields({ node: true, size: true }).exec((res) => {
      wx.hideLoading();
      this.setData({ isGenerating: false });
      if (!res || !res[0] || !res[0].node) {
        wx.showToast({ title: '绘制失败', icon: 'none' });
        return;
      }
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const dpr = wx.getSystemInfoSync().pixelRatio;
      const W = 750;

      // ===== 先计算内容总高度 =====
      const dims = this.data.dimLabels;
      const scores = this.data.dimScores;
      const summaryText = this.data.summaryText || '这段关系有着独特的缘分，需要用心去感受和经营。';
      const cardW = W - 140;
      // 临时canvas用于测量文字
      const summaryLines = this._wrapText(ctx, summaryText, cardW - 60, '20px sans-serif');

      let tarotLines = [];
      let hasTarot = !!(this.data.tarot && this.data.tarot.card);
      if (hasTarot && this.data.tarot.card.love) {
        tarotLines = this._wrapText(ctx, this.data.tarot.card.love, W - 160, '20px sans-serif');
      }

      // 累加计算高度
      let y = 40; // 顶部padding
      y += 30; // 顶部装饰线
      y += 40; // 标题
      y += 65; // 星座×星座
      y += 40; // 属相
      y += 25; // 间距
      y += 130; // 大分数
      y += 35; // 指数文字
      y += 50; // 等级
      y += 30; // 间距
      const radarCenterY = y + 160;
      y += 320; // 雷达图
      y += 20; // 间距
      const dimStartY = y;
      y += dims.length * 52; // 维度分数条（每行52px）
      y += 20; // 间距
      const summaryStartY = y;
      const summaryCardH = 52 + summaryLines.length * 30;
      y += summaryCardH; // 综合总结卡片
      y += 16; // 间距
      if (hasTarot) {
        y += 35; // 趣味卡牌牌名
        if (tarotLines.length) y += tarotLines.length * 30; // 趣味卡牌含义
      }
      y += 30; // 间距
      y += 80; // 底部三行文字
      y += 40; // 底部padding

      const H = y;

      // 设置画布尺寸
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.scale(dpr, dpr);

      // ===== 背景：深紫星云渐变 =====
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#1a0f3d');
      bg.addColorStop(0.3, '#2d1b5e');
      bg.addColorStop(0.6, '#3d256e');
      bg.addColorStop(1, '#150a2e');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // 星云光晕
      const glow1 = ctx.createRadialGradient(150, 200, 0, 150, 200, 350);
      glow1.addColorStop(0, 'rgba(240,168,192,0.18)');
      glow1.addColorStop(1, 'rgba(240,168,192,0)');
      ctx.fillStyle = glow1; ctx.fillRect(0, 0, W, H);

      const glow2 = ctx.createRadialGradient(600, H - 300, 0, 600, H - 300, 400);
      glow2.addColorStop(0, 'rgba(196,168,232,0.15)');
      glow2.addColorStop(1, 'rgba(196,168,232,0)');
      ctx.fillStyle = glow2; ctx.fillRect(0, 0, W, H);

      // 随机星点（覆盖整个高度）
      ctx.globalAlpha = 0.5; ctx.fillStyle = '#ffd700';
      for (let i = 0; i < 40; i++) {
        const sx = Math.random() * W;
        const sy = Math.random() * H;
        const sr = 1 + Math.random() * 2.5;
        ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // 顶部装饰线
      ctx.strokeStyle = 'rgba(255,215,0,0.3)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(100, 60); ctx.lineTo(W - 100, 60); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(150, 70); ctx.lineTo(W - 150, 70); ctx.stroke();

      // 底部装饰线
      ctx.beginPath(); ctx.moveTo(100, H - 60); ctx.lineTo(W - 100, H - 60); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(150, H - 70); ctx.lineTo(W - 150, H - 70); ctx.stroke();

      // ===== 标题区 =====
      let curY = 110;
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,215,0,0.7)'; ctx.font = '22px sans-serif';
      ctx.fillText('✦ 性 格 契 合 度 · 深 度 匹 配 ✦', W / 2, curY);

      curY += 65;
      ctx.fillStyle = '#fff'; ctx.font = 'bold 34px sans-serif';
      ctx.fillText(this.data.myInfo.zodiac + ' × ' + this.data.taInfo.zodiac, W / 2, curY);

      curY += 40;
      ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '22px sans-serif';
      ctx.fillText('属' + this.data.myInfo.animal + ' · 属' + this.data.taInfo.animal + ' · ' + this.data.year + '年度', W / 2, curY);

      // ===== 大分数 =====
      curY += 25 + 130;
      ctx.font = 'bold 130px sans-serif';
      const scoreGrad = ctx.createLinearGradient(0, curY - 130, 0, curY);
      scoreGrad.addColorStop(0, '#ffd700'); scoreGrad.addColorStop(0.5, '#f0c060'); scoreGrad.addColorStop(1, '#f0a8c0');
      ctx.fillStyle = scoreGrad;
      ctx.fillText(this.data.totalScore, W / 2, curY);

      curY += 35;
      ctx.font = '22px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText('六 维 综 合 契 合 指 数', W / 2, curY);

      curY += 50;
      ctx.font = 'bold 30px sans-serif'; ctx.fillStyle = '#c4a8e8';
      ctx.fillText('『 ' + this.data.levelTag + ' 』', W / 2, curY);

      // ===== 雷达图 =====
      this._drawRadarOnShare(ctx, W / 2, radarCenterY, 105, scores, dims);

      // ===== 各维度分数条 =====
      curY = dimStartY;
      ctx.font = '20px sans-serif';
      dims.forEach((name, i) => {
        // 第一行：维度名称（左）+ 分数（右）
        ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.textAlign = 'left';
        ctx.fillText(name, 100, curY);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffd700';
        ctx.fillText(scores[i] + '分', W - 100, curY);
        // 第二行：分数条
        const barW = 420, barX = (W - barW) / 2, barY = curY + 14;
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        this._roundRect(ctx, barX, barY, barW, 8, 4); ctx.fill();
        ctx.fillStyle = this.data.dimColors[i] || '#c4a8e8';
        this._roundRect(ctx, barX, barY, barW * scores[i] / 100, 8, 4); ctx.fill();
        curY += 52;
      });

      // ===== 综合总结卡片 =====
      curY = summaryStartY;
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      this._roundRect(ctx, 70, curY, cardW, summaryCardH, 18); ctx.fill();
      ctx.strokeStyle = 'rgba(255,215,0,0.25)'; ctx.lineWidth = 1.5;
      this._roundRect(ctx, 70, curY, cardW, summaryCardH, 18); ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,215,0,0.8)'; ctx.font = 'bold 22px sans-serif';
      ctx.fillText('✧ 综 合 总 结 ✧', W / 2, curY + 32);

      ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.font = '20px sans-serif';
      summaryLines.forEach((line, i) => {
        ctx.fillText(line, W / 2, curY + 60 + i * 30);
      });

      // ===== 趣味卡牌指引 =====
      if (hasTarot) {
        curY = summaryStartY + summaryCardH + 16 + 35;
        ctx.fillStyle = 'rgba(196,168,232,0.9)'; ctx.font = '22px sans-serif';
        ctx.fillText('🎴 趣味卡牌灵感：' + this.data.tarot.card.name + '（' + (this.data.tarot.upright ? '正位' : '逆位') + '）', W / 2, curY);
        if (tarotLines.length) {
          ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.font = '20px sans-serif';
          tarotLines.forEach((line, i) => {
            ctx.fillText(line, W / 2, curY + 30 + i * 30);
          });
        }
      }

      // ===== 底部 =====
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.font = '20px sans-serif';
      ctx.fillText('性格契合度 · 内容仅供娱乐参考', W / 2, H - 70);
      ctx.fillStyle = 'rgba(255,215,0,0.25)'; ctx.font = '16px sans-serif';
      ctx.fillText('@copyright 2026 Victoria_Tao', W / 2, H - 42);

      wx.canvasToTempFilePath({
        canvas,
        success: (r) => { this.setData({ shareImg: r.tempFilePath, showShareModal: true }); },
        fail: () => { wx.showToast({ title: '生成失败', icon: 'none' }); }
      });
    });
  },

  // canvas 文字自动换行
  _wrapText(ctx, text, maxWidth, font) {
    ctx.font = font;
    const chars = text.split('');
    const lines = [];
    let line = '';
    for (let i = 0; i < chars.length; i++) {
      const testLine = line + chars[i];
      if (ctx.measureText(testLine).width > maxWidth && line) {
        lines.push(line);
        line = chars[i];
      } else {
        line = testLine;
      }
    }
    if (line) lines.push(line);
    return lines;
  },

  // 在分享图上绘制雷达图
  _drawRadarOnShare(ctx, cx, cy, R, values, labels) {
    const n = values.length;
    if (!n) return;
    // 网格
    for (let lv = 1; lv <= 5; lv++) {
      const r = (R * lv) / 5;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const ang = -Math.PI / 2 + (i % n) * (2 * Math.PI / n);
        const x = cx + r * Math.cos(ang), y = cy + r * Math.sin(ang);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255,215,0,0.15)'; ctx.lineWidth = 1; ctx.stroke();
    }
    // 轴线
    for (let i = 0; i < n; i++) {
      const ang = -Math.PI / 2 + i * (2 * Math.PI / n);
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.lineTo(cx + R * Math.cos(ang), cy + R * Math.sin(ang));
      ctx.strokeStyle = 'rgba(255,215,0,0.12)'; ctx.lineWidth = 1; ctx.stroke();
    }
    // 数据区域
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const v = Math.min(1, Math.max(0, values[i] / 100));
      const ang = -Math.PI / 2 + i * (2 * Math.PI / n);
      const x = cx + R * v * Math.cos(ang), y = cy + R * v * Math.sin(ang);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    grad.addColorStop(0, 'rgba(196,168,232,0.5)');
    grad.addColorStop(1, 'rgba(240,168,192,0.3)');
    ctx.fillStyle = grad; ctx.fill();
    ctx.strokeStyle = '#c4a8e8'; ctx.lineWidth = 2; ctx.stroke();
    // 数据点
    for (let i = 0; i < n; i++) {
      const v = Math.min(1, Math.max(0, values[i] / 100));
      const ang = -Math.PI / 2 + i * (2 * Math.PI / n);
      const x = cx + R * v * Math.cos(ang), y = cy + R * v * Math.sin(ang);
      ctx.beginPath(); ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#f0a8c0'; ctx.fill();
    }
    // 标签
    ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '18px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let i = 0; i < n; i++) {
      const ang = -Math.PI / 2 + i * (2 * Math.PI / n);
      const lx = cx + (R + 24) * Math.cos(ang), ly = cy + (R + 24) * Math.sin(ang);
      ctx.fillText(labels[i], lx, ly);
    }
  },

  _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  },

  onSaveShare() {
    const img = this.data.shareImg;
    if (!img) return;
    wx.saveImageToPhotosAlbum({
      filePath: img,
      success: () => { wx.showToast({ title: '已保存到相册', icon: 'success' }); },
      fail: (err) => {
        if (err.errMsg && err.errMsg.indexOf('auth deny') > -1) {
          wx.showModal({
            title: '需要相册权限', content: '请在设置中开启相册权限',
            confirmText: '去设置', success: (r) => { if (r.confirm) wx.openSetting(); }
          });
        } else { wx.showToast({ title: '保存失败', icon: 'none' }); }
      }
    });
  },

  closeShareModal() {
    this.setData({ showShareModal: false });
    setTimeout(() => this.drawRadar(), 200);
  },

  onShareAppMessage() {
    return {
      title: this.data.myInfo.zodiac + '×' + this.data.taInfo.zodiac + ' · 深度匹配' + this.data.totalScore + '分',
      path: '/pages/index/index',
      imageUrl: this.data.shareImg || ''
    };
  },

  goPro() { wx.navigateTo({ url: '/pages/pro/pro' }); },
  goHome() { wx.reLaunch({ url: '/pages/index/index' }); }
});
