// pages/mbti-matching/mbti-matching.js 性格速配输入
const mbti = require('../../data/mbti.js');

Page({
  data: {
    mbtiList: Object.keys(mbti.MBTI_TYPES),
    myMbtiIdx: -1, taMbtiIdx: -1,
    myMbti: '', taMbti: '',
    readyText: '',
    canSubmit: false
  },

  onMyMbti(e) {
    const idx = e.detail.value;
    this.setData({ myMbtiIdx: idx, myMbti: this.data.mbtiList[idx] }, this.checkReady);
  },
  onTaMbti(e) {
    const idx = e.detail.value;
    this.setData({ taMbtiIdx: idx, taMbti: this.data.mbtiList[idx] }, this.checkReady);
  },

  checkReady() {
    const hasMbti = this.data.myMbti && this.data.taMbti;
    let text = '';
    if (hasMbti) {
      text = '双方 MBTI 已就绪，将生成性格匹配报告';
    }
    this.setData({ readyText: text, canSubmit: hasMbti });
  },

  onStart() {
    if (!this.data.canSubmit) {
      wx.showToast({ title: '请先填写双方MBTI', icon: 'none' });
      return;
    }

    // 计算MBTI匹配
    const mbtiResult = mbti.calcMbtiMatch(this.data.myMbti, this.data.taMbti);

    // 存入全局
    getApp().globalData.mbtiResult = {
      mbtiResult,
      myMbti: this.data.myMbti,
      taMbti: this.data.taMbti
    };

    wx.navigateTo({ url: '/pages/mbti-result/mbti-result' });
  }
});
