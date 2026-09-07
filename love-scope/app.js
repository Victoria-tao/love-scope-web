// app.js
App({
  globalData: {
    lastMatch: null,
    proResult: null,
    lastTarot: null,
    mbtiResult: null,
    version: '1.0.0',
    cloudEnv: 'your-env-id' // TODO: 替换为你的云开发环境ID
  },
  onLaunch() {
    console.log('性格契合度 启动');
    // 初始化云开发（如果已开通）
    if (wx.cloud) {
      try {
        wx.cloud.init({
          env: this.globalData.cloudEnv,
          traceUser: true
        });
        console.log('云开发初始化成功');
      } catch (e) {
        console.log('云开发未开通，使用本地存储', e);
      }
    }
  }
});
