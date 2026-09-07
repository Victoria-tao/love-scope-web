// pages/result/result.js
const zodiac = require('../../data/zodiac.js');
const zodiacAnimal = require('../../data/zodiacAnimal.js');
const { IMG_BASE } = require('../../utils/imageConfig.js');
const ILLU_BASE = IMG_BASE + '/pair-themes/';
const ELEMENT_THEME = {
  '火火': { name: '炽夏', bg: 'linear-gradient(135deg, #FFE0C0, #FFB088)', deco: ['☀️','🌻','🔥'], c1: '#FFE0C0', c2: '#FFB088', text: '#8B4020', image: ILLU_BASE + '01_chixia_fire-fire.jpg' },
  '土火': { name: '暖秋', bg: 'linear-gradient(135deg, #F5E0C0, #E8B878)', deco: ['🍂','🌾','🎃'], c1: '#F5E0C0', c2: '#E8B878', text: '#7A5020', image: ILLU_BASE + '02_nuanqiu_fire-earth.jpg' },
  '木火': { name: '春晓', bg: 'linear-gradient(135deg, #E8F5D0, #C8E898)', deco: ['🌱','🌸','🦋'], c1: '#E8F5D0', c2: '#C8E898', text: '#4A7020', image: ILLU_BASE + '03_chunxiao_fire-wood.jpg' },
  '水火': { name: '晨昏', bg: 'linear-gradient(135deg, #FFD8C0, #B8D8F0)', deco: ['🌅','🌊','✨'], c1: '#FFD8C0', c2: '#B8D8F0', text: '#8B4050', image: ILLU_BASE + '04_chenhun_fire-water.jpg' },
  '土土': { name: '厚土', bg: 'linear-gradient(135deg, #F0E0C8, #D8C098)', deco: ['⛰️','🪨','🌾'], c1: '#F0E0C8', c2: '#D8C098', text: '#6B5030', image: ILLU_BASE + '05_houtu_earth-earth.jpg' },
  '土木': { name: '山风', bg: 'linear-gradient(135deg, #E0E8D0, #A8C898)', deco: ['🌲','🐦','☁️'], c1: '#E0E8D0', c2: '#A8C898', text: '#406030', image: ILLU_BASE + '06_shanfeng_earth-wood.jpg' },
  '土水': { name: '溪谷', bg: 'linear-gradient(135deg, #D8E8E0, #98C8B8)', deco: ['💧','🍃','🪨'], c1: '#D8E8E0', c2: '#98C8B8', text: '#306050', image: ILLU_BASE + '07_xigu_earth-water.jpg' },
  '木木': { name: '林风', bg: 'linear-gradient(135deg, #D8F0D0, #98D898)', deco: ['🌿','🍃','🌳'], c1: '#D8F0D0', c2: '#98D898', text: '#307030', image: ILLU_BASE + '08_linfeng_wood-wood.jpg' },
  '木水': { name: '春涧', bg: 'linear-gradient(135deg, #D0E8E8, #88C8D0)', deco: ['🌧️','🌱','💧'], c1: '#D0E8E8', c2: '#88C8D0', text: '#206070', image: ILLU_BASE + '09_chunjian_wood-water.jpg' },
  '水水': { name: '深海', bg: 'linear-gradient(135deg, #D0D8F0, #8898D0)', deco: ['🌙','🌊','🐚'], c1: '#D0D8F0', c2: '#8898D0', text: '#304080', image: ILLU_BASE + '10_shenhai_water-water.jpg' }
};
const DEFAULT_THEME = { name: '性格契合度', bg: 'linear-gradient(135deg, #FDE8D8, #E8E0F0)', deco: ['✨','💫','🌟'], c1: '#FDE8D8', c2: '#E8E0F0', text: '#6B4A3A' };

Page({
  data: {
    year: '', yearLabel: '',
    zodiacPair: null, singleZodiac: null,
    animalPair: null, singleAnimal: null,
    birthMatch: null,
    natalChart: null, synastry: null,
    yearFortune: null, pairTheme: null,
    shareImg: '', showShareModal: false, isGenerating: false
  },

  onLoad() {
    const app = getApp();
    const r = app.globalData.lastMatch || {};
    const update = {
      year: r.year || '', yearLabel: r.yearLabel || '',
      zodiacPair: r.zodiacPair || null,
      singleZodiac: r.singleZodiac || null,
      animalPair: r.animalPair || null,
      singleAnimal: r.singleAnimal || null,
      birthMatch: r.birthMatch || null,
      natalChart: r.natalChart || null,
      synastry: r.synastry || null,
      yearFortune: r.yearFortune || null,
      pairTheme: null
    };
    // 综合星座+属相分数（星座70% + 属相30%）
    if (r.zodiacPair && r.animalPair) {
      const zodiacScore = r.zodiacPair.score;
      const animalScore = r.animalPair.score;
      const combinedScore = Math.round(zodiacScore * 0.7 + animalScore * 0.3);
      update.zodiacPair = { ...r.zodiacPair, score: combinedScore };
      // 根据综合分数重新确定等级标签
      if (combinedScore >= 84) {
        update.zodiacPair.levelTag = '🔥 灵魂伴侣';
        update.zodiacPair.level = '灵魂伴侣';
      } else if (combinedScore >= 70) {
        update.zodiacPair.levelTag = '💞 高甜组合';
        update.zodiacPair.level = '高甜组合';
      } else if (combinedScore >= 58) {
        update.zodiacPair.levelTag = '🌗 互补磨合';
        update.zodiacPair.level = '互补磨合';
      } else {
        update.zodiacPair.levelTag = '⚡ 火花恋人';
        update.zodiacPair.level = '火花恋人';
      }
    }
    if (update.zodiacPair) {
      const key = [update.zodiacPair.me.qi, update.zodiacPair.ta.qi].sort().join('');
      update.pairTheme = ELEMENT_THEME[key] || DEFAULT_THEME;
    }
    // 存到页面普通变量，供分享卡片使用（避免this.data同步问题）
    this._cardData = {
      zodiacPair: update.zodiacPair,
      singleZodiac: update.singleZodiac,
      animalPair: update.animalPair,
      year: update.year
    };
    this.setData(update, () => {
      if (update.zodiacPair) this.drawRadar(update.zodiacPair);
    });
  },

  // 五维雷达图
  drawRadar(pair) {
    const query = wx.createSelectorQuery();
    query.select('#radarCanvas').fields({ node: true, size: true }).exec((res) => {
      if (!res || !res[0] || !res[0].node) return;
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const dpr = wx.getSystemInfoSync().pixelRatio;
      const W = res[0].width, H = res[0].height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
      const cx = W / 2, cy = H / 2 + 5;
      const R = Math.min(W, H) / 2 - 45;
      const labels = pair.radarLabels || ['浪漫', '沟通', '默契', '激情', '稳定'];
      // 确保雷达数据合理（0-100）
      const values = (pair.radar || [
        Math.min(95, Math.max(20, pair.score + 8)),
        Math.min(95, Math.max(20, pair.score - 3)),
        Math.min(95, Math.max(20, pair.score + 5)),
        Math.min(95, Math.max(20, pair.score - 8)),
        Math.min(95, Math.max(20, pair.score - 2))
      ]).map(v => Math.min(100, Math.max(10, v)));
      const n = labels.length;

      // 绘制5层网格（五边形）
      for (let ring = 1; ring <= 5; ring++) {
        ctx.beginPath();
        for (let i = 0; i <= n; i++) {
          const idx = i % n;
          const angle = -Math.PI / 2 + idx * 2 * Math.PI / n;
          const r = R * ring / 5;
          const x = cx + r * Math.cos(angle), y = cy + r * Math.sin(angle);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(255,215,0,0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 绘制轴线
      for (let i = 0; i < n; i++) {
        const angle = -Math.PI / 2 + i * 2 * Math.PI / n;
        ctx.beginPath(); ctx.moveTo(cx, cy);
        ctx.lineTo(cx + R * Math.cos(angle), cy + R * Math.sin(angle));
        ctx.strokeStyle = 'rgba(255,215,0,0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 绘制数据区域（和pro一致的紫粉线性渐变）
      ctx.beginPath();
      values.forEach((v, i) => {
        const angle = -Math.PI / 2 + i * 2 * Math.PI / n;
        const r = R * v / 100;
        const x = cx + r * Math.cos(angle), y = cy + r * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, 'rgba(196,168,232,0.4)');
      grad.addColorStop(1, 'rgba(240,168,192,0.4)');
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = '#c4a8e8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 绘制数据点（和pro一致的简单粉色圆点）
      values.forEach((v, i) => {
        const angle = -Math.PI / 2 + i * 2 * Math.PI / n;
        const r = R * v / 100;
        const x = cx + r * Math.cos(angle), y = cy + r * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#f0a8c0';
        ctx.fill();
      });

      // 绘制维度标签和分数
      ctx.textAlign = 'center';
      labels.forEach((label, i) => {
        const angle = -Math.PI / 2 + i * 2 * Math.PI / n;
        const labelR = R + 22;
        const x = cx + labelR * Math.cos(angle);
        const y = cy + labelR * Math.sin(angle);
        // 标签
        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        ctx.font = '13px sans-serif';
        ctx.fillText(label, x, y);
        // 分数
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(values[i] + '分', x, y + 16);
      });
    });
  },

  // 生成分享卡片
  onGenerateShare() {
    this.setData({ isGenerating: true });
    wx.showLoading({ title: '生成中...' });
    setTimeout(() => this._drawShareCard(), 100);
  },

  _drawShareCard() {
    // 优先用页面普通变量（onLoad时存的），其次用this.data，最后用全局数据
    const cardData = this._cardData || {};
    const app = getApp();
    const lastMatch = app.globalData.lastMatch || {};
    const p = cardData.zodiacPair || this.data.zodiacPair || lastMatch.zodiacPair || null;
    const single = cardData.singleZodiac || this.data.singleZodiac || lastMatch.singleZodiac || null;
    const animalPair = cardData.animalPair || this.data.animalPair || lastMatch.animalPair || null;
    const year = cardData.year || this.data.year || lastMatch.year || '';

    const query = wx.createSelectorQuery();
    query.select('#shareCanvas').fields({ node: true }).exec((res) => {
      if (!res || !res[0] || !res[0].node) {
        wx.hideLoading();
        this.setData({ isGenerating: false });
        return;
      }
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const dpr = wx.getWindowInfo().pixelRatio;
      const W = 750;

      // ===== 组装总结内容（确保不为空）=====
      let summary = '';
      if (p) {
        summary = (p.copy && p.copy.comboName ? p.copy.comboName : '你们的组合') + '：' + (p.copy && p.copy.summary ? p.copy.summary : '彼此吸引，需要用心经营。');
        if (animalPair) summary += '\n生肖：' + animalPair.relName + '，' + (animalPair.copy && animalPair.copy.summary ? animalPair.copy.summary : '');
        if (p.score >= 80) summary += '\n整体缘分深厚，值得珍惜与深耕。';
        else if (p.score >= 70) summary += '\n整体互补成长，磨合后更加契合。';
        else summary += '\n整体需要更多理解与包容，用心经营方能长久。';
      } else if (single) {
        summary = single.name + '在' + year + '年的情感状态为「' + single.inflTag + '」。' + (single.inflTao || '') + '整体来看，' + (single.inflStar || '') + (single.season ? '这段时间' + single.season : '') + '用真诚与智慧经营，爱自然会流向你。';
      } else {
        summary = '暂无数据，请重新分析。';
      }
      ctx.font = '20px sans-serif';
      const summaryLines = this._wrapText(ctx, summary, W - 160, '20px sans-serif');

      // 五维数据
      let dims = ['浪漫', '沟通', '默契', '激情', '稳定'];
      let scores = [75, 72, 78, 70, 76];
      if (p && p.radar) {
        scores = p.radar.map(v => Math.min(100, Math.max(10, v)));
        dims = p.radarLabels || dims;
      }

      // ===== 计算高度 =====
      let H = 120; // 顶部+标题
      if (p) {
        H += 60; // 星座名
        H += 35; // 属相
        H += 140; // 大分数
        H += 35; // 指数文字
        H += 50; // 等级
        H += 30; // 间距
        H += 250; // 雷达图
        H += dims.length * 55; // 维度条
        H += 30; // 间距
      } else if (single) {
        const sThemeLines = this._wrapText(ctx, single.theme || '', W - 160, '21px sans-serif');
        const sInflLines = this._wrapText(ctx, (single.inflTao || '') + (single.inflStar || ''), W - 160, '20px sans-serif');
        const sStarLines = this._wrapText(ctx, single.star || '', W - 160, '20px sans-serif');
        H += 90; // 星座名
        H += 40; // 元素
        H += 50; // 年度标签
        H += 35; // 主题标题
        H += sThemeLines.length * 40 + 40; // 主题内容
        H += 35; // 年度标题
        H += sInflLines.length * 38 + 40; // 年度内容
        H += 35; // 星象标题
        H += sStarLines.length * 38 + 40; // 星象内容
        H += 30; // 间距
      }
      H += 60 + summaryLines.length * 35; // 总结卡片
      H += 80; // 底部

      // 设置画布
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);

      // ===== 背景 =====
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#1a0f3d');
      bg.addColorStop(0.5, '#2d1b5e');
      bg.addColorStop(1, '#150a2e');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // 星点
      ctx.fillStyle = 'rgba(255,215,0,0.25)';
      for (let i = 0; i < 35; i++) {
        ctx.beginPath();
        ctx.arc((i * 73 + 20) % W, (i * 97 + 30) % H, 1 + (i % 3), 0, Math.PI * 2);
        ctx.fill();
      }

      // ===== 标题 =====
      let y = 90;
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,215,0,0.7)';
      ctx.font = '22px sans-serif';
      ctx.fillText('✦ 性 格 契 合 度 ✦', W / 2, y);

      if (p) {
        // 星座名
        y += 60;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText(p.me.name + ' × ' + p.ta.name, W / 2, y);

        // 属相
        y += 35;
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '20px sans-serif';
        let sub = '';
        if (animalPair) sub = '属' + animalPair.me.name + ' · 属' + animalPair.ta.name;
        if (year) sub += (sub ? ' · ' : '') + year + '年度';
        if (sub) ctx.fillText(sub, W / 2, y);

        // 大分数
        y += 140;
        ctx.font = 'bold 110px sans-serif';
        const sg = ctx.createLinearGradient(0, y - 100, 0, y);
        sg.addColorStop(0, '#ffd700');
        sg.addColorStop(1, '#f0a8c0');
        ctx.fillStyle = sg;
        ctx.fillText(p.score, W / 2, y);

        // 指数文字
        y += 35;
        ctx.font = '20px sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText('五 维 综 合 契 合 指 数', W / 2, y);

        // 等级
        y += 50;
        ctx.font = 'bold 26px sans-serif';
        ctx.fillStyle = '#c4a8e8';
        ctx.fillText('『 ' + p.levelTag + ' 』', W / 2, y);

        // 雷达图
        y += 30;
        const radarY = y + 110;
        this._drawRadarOnShare(ctx, W / 2, radarY, 95, scores, dims);
        y = radarY + 95 + 20;

        // 维度条
        ctx.font = '19px sans-serif';
        const colors = ['#f0a8c0', '#ffd700', '#e8956a', '#c4a8e8', '#8bc38b'];
        dims.forEach((name, i) => {
          ctx.fillStyle = 'rgba(255,255,255,0.75)';
          ctx.textAlign = 'left';
          ctx.fillText(name, 90, y);
          ctx.textAlign = 'right';
          ctx.fillStyle = '#ffd700';
          ctx.fillText(scores[i] + '分', W - 90, y);
          const bw = 400, bx = (W - bw) / 2, by = y + 10;
          ctx.fillStyle = 'rgba(255,255,255,0.1)';
          this._roundRect(ctx, bx, by, bw, 7, 3);
          ctx.fill();
          ctx.fillStyle = colors[i] || '#c4a8e8';
          this._roundRect(ctx, bx, by, bw * scores[i] / 100, 7, 3);
          ctx.fill();
          y += 55;
        });
        y += 30;
      } else if (single) {
        // 单方解读
        y += 90;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 40px sans-serif';
        ctx.fillText(single.name, W / 2, y);

        y += 40;
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '20px sans-serif';
        ctx.fillText(single.element + '象 · 守护星' + single.ruler, W / 2, y);

        y += 50;
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText('『 ' + single.inflTag + ' 』', W / 2, y);

        // 性格主题
        y += 35;
        ctx.fillStyle = 'rgba(255,180,100,0.9)';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('✦ 性格主题', W / 2, y);
        y += 35;
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = '21px sans-serif';
        const sThemeLines = this._wrapText(ctx, single.theme || '', W - 160, '21px sans-serif');
        sThemeLines.forEach(line => {
          ctx.fillText(line, W / 2, y);
          y += 40;
        });

        // 年度性格倾向
        y += 20;
        ctx.fillStyle = 'rgba(255,180,100,0.9)';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('✦ 年度性格倾向', W / 2, y);
        y += 35;
        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        ctx.font = '20px sans-serif';
        const sInflLines = this._wrapText(ctx, (single.inflTao || '') + (single.inflStar || ''), W - 160, '20px sans-serif');
        sInflLines.forEach(line => {
          ctx.fillText(line, W / 2, y);
          y += 38;
        });

        // 性格星图
        y += 20;
        ctx.fillStyle = 'rgba(240,168,192,0.9)';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('✦ 性格星图', W / 2, y);
        y += 35;
        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        ctx.font = '20px sans-serif';
        const sStarLines = this._wrapText(ctx, single.star || '', W - 160, '20px sans-serif');
        sStarLines.forEach(line => {
          ctx.fillText(line, W / 2, y);
          y += 38;
        });
        y += 30;
      }

      // ===== 总结卡片 =====
      const cardH = 55 + summaryLines.length * 35;
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      this._roundRect(ctx, 60, y, W - 120, cardH, 16);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,215,0,0.3)';
      ctx.lineWidth = 1.5;
      this._roundRect(ctx, 60, y, W - 120, cardH, 16);
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,215,0,0.85)';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('✧ 综 合 解 读 ✧', W / 2, y + 35);

      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.font = '19px sans-serif';
      let ly = y + 65;
      summaryLines.forEach(line => {
        if (line.startsWith('\n')) line = line.substring(1);
        ctx.fillText(line, W / 2, ly);
        ly += 35;
      });

      // ===== 底部 =====
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.font = '17px sans-serif';
      ctx.fillText('性格契合度 · 内容仅供娱乐参考', W / 2, H - 45);
      ctx.fillStyle = 'rgba(255,215,0,0.3)';
      ctx.font = '15px sans-serif';
      ctx.fillText('@copyright 2026 Victoria_Tao', W / 2, H - 20);

      // 导出
      wx.canvasToTempFilePath({
        canvas: canvas,
        success: (r) => {
          wx.hideLoading();
          this.setData({ shareImg: r.tempFilePath, showShareModal: true, isGenerating: false });
        },
        fail: () => {
          wx.hideLoading();
          this.setData({ isGenerating: false });
          wx.showToast({ title: '生成失败', icon: 'none' });
        }
      }, this);
    });
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

  onSaveShare() {
    if (!this.data.shareImg) return;
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImg,
      success: () => wx.showToast({ title: '已保存到相册', icon: 'success' }),
      fail: () => wx.showToast({ title: '保存失败', icon: 'none' })
    });
  },

  closeShareModal() { this.setData({ showShareModal: false }); },

  goTarot() { wx.navigateTo({ url: '/pages/tarot/tarot' }); },
  goMatching() { wx.navigateBack(); },
  goHome() { wx.reLaunch({ url: '/pages/index/index' }); }
});
