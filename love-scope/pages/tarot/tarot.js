// pages/tarot/tarot.js
const tarotData = require('../../data/tarot.js');
const engine = require('../../utils/tarotEngine.js');

Page({
  data: {
    question: '',
    count: 1,
    drawing: false,
    flipName: '',
    selectedCount: 1,
    categories: [
      { key: 'love', name: '情感', icon: '💕', selected: true },
      { key: 'career', name: '事业', icon: '💼', selected: false },
      { key: 'wealth', name: '财运', icon: '💰', selected: false },
      { key: 'health', name: '健康', icon: '🏥', selected: false },
      { key: 'friend', name: '朋友', icon: '👫', selected: false },
      { key: 'family', name: '家庭', icon: '🏠', selected: false }
    ]
  },

  onQuestionInput(e) {
    this.setData({ question: e.detail.value });
  },

  setCount(e) {
    if (this.data.drawing) return;
    this.setData({ count: Number(e.currentTarget.dataset.count) });
  },

  toggleCategory(e) {
    if (this.data.drawing) return;
    const key = e.currentTarget.dataset.key;
    let newCategories = this.data.categories.map(item => {
      if (item.key === key) {
        const selectedCount = this.data.categories.filter(c => c.selected).length;
        if (item.selected && selectedCount <= 1) {
          wx.showToast({ title: '至少保留一个方向', icon: 'none' });
          return item;
        }
        return { ...item, selected: !item.selected };
      }
      return item;
    });
    const newCount = newCategories.filter(c => c.selected).length;
    this.setData({ categories: newCategories, selectedCount: newCount });
  },

  // 开始抽牌（带洗牌动画）
  onDraw() {
    if (this.data.drawing) return;
    const deck = tarotData.TAROT;
    const question = this.data.question.trim();
    const selectedCategories = this.data.categories.filter(c => c.selected).map(c => c.key);

    this.setData({ drawing: true });

    // 洗牌动画：牌名快速轮换，约2秒后出结果
    let tick = 0;
    const anim = setInterval(() => {
      tick++;
      this.setData({ flipName: deck[tick % deck.length].name });
      if (tick >= 10) {
        clearInterval(anim);
        const result = engine.drawCards(deck, this.data.count, question);
        const app = getApp();
        app.globalData.lastTarot = { result: result, question: question, categories: selectedCategories };
        this.setData({ drawing: false });
        wx.navigateTo({ url: '/pages/tarot/tarot-result/tarot-result' });
      }
    }, 200);
  }
});
