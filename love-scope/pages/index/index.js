// pages/index/index.js
const { HOME_HERO } = require('../../utils/imageConfig.js');

Page({
  data: {
    heroImage: HOME_HERO
  },
  onLoad() {},
  goMbtiTest() {
    wx.navigateTo({ url: '/pages/personal/mbti-test/mbti-test' });
  },
  goMbti() {
    wx.navigateTo({ url: '/pages/mbti-matching/mbti-matching' });
  },
  goPersonal() {
    wx.navigateTo({ url: '/pages/personal/personal' });
  }
});
