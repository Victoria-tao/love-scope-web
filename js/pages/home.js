/**
 * pages/home.js — 首页（导航：情感配对/趣味卡牌/性格速配/个人解读/每日日历/MBTI测试）
 */
(function () {
  App.register('home', {
    render: function () {
      var h = '';
      h += '<div class="hero">';
      h += '<img src="' + App.IMG.HOME_HERO + '" alt="hero">';
      h += '<div class="hero-overlay"></div>';
      // 右上角语言切换
      var langLabel = App.lang === 'zh' ? 'EN' : '中';
      var langTarget = App.lang === 'zh' ? 'en' : 'zh';
      h += '<div onclick="App.setLang(\'' + langTarget + '\')" style="position:absolute;top:16px;right:16px;z-index:10;cursor:pointer;padding:8px 16px;border-radius:20px;background:rgba(255,255,255,0.15);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.25);color:#fff;font-size:14px;font-weight:600;">🌐 ' + langLabel + '</div>';
      h += '<div class="hero-content">';
      h += '<div class="hero-badge">✦ ' + App.t('心灵契合') + ' ✦</div>';
      h += '<div class="hero-title">' + App.t('性格契合度') + '</div>';
      h += '<div class="hero-sub">' + App.t('星座 · 属相 · 性格匹配') + '<br/>' + App.t('分析两个人的相处模式与沟通建议') + '</div>';
      h += '</div></div>';

      h += '<div class="entries">';
      // 情感配对
      h += '<div class="entry-card entry-pink" onclick="App.go(\'matching\')">';
      h += '<div class="entry-icon">💞</div>';
      h += '<div class="entry-title">' + App.t('情感配对') + '</div>';
      h += '<div class="entry-desc">' + App.t('星座 · 属相 · 出生信息') + '<br/>' + App.t('双人缘分 & 个人年度状态') + '</div>';
      h += '<div class="entry-arrow">→</div></div>';
      // 趣味卡牌
      h += '<div class="entry-card entry-purple" onclick="App.go(\'tarot\')">';
      h += '<div class="entry-icon">🃏</div>';
      h += '<div class="entry-title">' + App.t('趣味卡牌') + '</div>';
      h += '<div class="entry-desc">' + App.t('6大方向自由选 · 抽1张或3张') + '<br/>' + App.t('探索你的当下状态') + '</div>';
      h += '<div class="entry-arrow">→</div></div>';
      // 性格速配
      h += '<div class="entry-card entry-green" onclick="App.go(\'mbti-matching\')">';
      h += '<div class="entry-icon">🧩</div>';
      h += '<div class="entry-title">' + App.t('性格速配') + '</div>';
      h += '<div class="entry-desc">' + App.t('MBTI 双人匹配') + '<br/>' + App.t('读懂你们的相处模式') + '</div>';
      h += '<div class="entry-arrow">→</div></div>';
      h += '</div>';

      // 小工具入口
      h += '<div class="mini-entries">';
      h += '<div class="mini-entry" onclick="App.go(\'personal\')"><div class="mini-icon">👤</div><div class="mini-name">' + App.t('个人解读') + '</div><div class="mini-desc">' + App.t('MBTI 深度解析') + '</div></div>';
      h += '<div class="mini-entry" onclick="App.go(\'daily\')"><div class="mini-icon">📅</div><div class="mini-name">' + App.t('每日日历') + '</div><div class="mini-desc">' + App.t('黄历 · 星座 · 属相') + '</div></div>';
      h += '<div class="mini-entry" onclick="App.go(\'mbti-test\')"><div class="mini-icon">🧪</div><div class="mini-name">' + App.t('MBTI 测试') + '</div><div class="mini-desc">' + App.t('16道题测人格') + '</div></div>';
      h += '</div>';

      h += '<div style="padding:16px 16px 0;"><div class="card" style="margin-bottom:0;">';
      h += '<div class="card-title">✨ ' + App.t('关于本应用') + '</div>';
      h += '<div class="card-tip" style="margin-bottom:4px;">' + App.t('星座、属相、生日、性格——从多个维度解读两个人的相处模式与沟通建议。全部内容仅供娱乐参考，帮助你在轻松中多一些自我了解与彼此理解。') + '</div>';
      h += '</div></div>';

      h += App.footer();
      return h;
    }
  });
})();
