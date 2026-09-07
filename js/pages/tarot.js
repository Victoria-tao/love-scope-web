/**
 * pages/tarot.js — 趣味卡牌（6维度 3×2 多选，抽1张/3张）
 */
(function () {
  var tarotData = window.TR;
  var engine = window.TE;

  var CATEGORIES = [
    { key: 'love', name: '情感', icon: '💕', selected: true },
    { key: 'career', name: '事业', icon: '💼', selected: false },
    { key: 'wealth', name: '财运', icon: '💰', selected: false },
    { key: 'health', name: '健康', icon: '🏥', selected: false },
    { key: 'friend', name: '朋友', icon: '👫', selected: false },
    { key: 'family', name: '家庭', icon: '🏠', selected: false }
  ];

  var state = { question: '', count: 1, drawing: false, flipName: '', cats: CATEGORIES };

  var page = {
    render: function () {
      var h = App.nav('趣味卡牌');
      h += '<div class="page">';
      h += '<div class="section-title">' + App.t('趣味卡牌') + '</div>';
      h += '<div class="section-sub">' + App.t('选择你关注的方向，抽取属于你的指引') + '</div>';

      // 问题输入
      h += '<div class="card" style="margin-top:16px;"><div class="card-title">💬 ' + App.t('你想问的问题（选填）') + '</div>';
      h += '<input class="birth-input" id="tarotQ" placeholder="' + App.t('如：最近的感情状态如何？') + '" value="' + state.question + '" oninput="App.pages.tarot.onQuestion(this.value)"/>';
      h += '</div>';

      // 维度（3×2）
      h += '<div class="card"><div class="card-title">🎯 ' + App.t('关注方向（可多选叠加）') + '</div>';
      h += '<div class="cat-grid">';
      state.cats.forEach(function (c) {
        h += '<div class="cat-card' + (c.selected ? ' selected' : '') + '" onclick="App.pages.tarot.toggle(\'' + c.key + '\')">';
        h += '<div class="cat-icon">' + c.icon + '</div><div class="cat-name">' + App.t(c.name) + '</div></div>';
      });
      h += '</div>';
      h += '<div class="card-tip" style="margin-top:10px;">' + App.t('已选') + ' ' + state.cats.filter(function (c) { return c.selected; }).length + ' ' + App.t('个方向，可叠加抽取') + '</div>';
      h += '</div>';

      // 抽牌数量
      h += '<div class="card"><div class="card-title">🃏 ' + App.t('抽牌数量') + '</div>';
      h += '<div class="cat-grid" style="grid-template-columns:repeat(2,1fr);">';
      h += '<div class="cat-card' + (state.count === 1 ? ' selected' : '') + '" onclick="App.pages.tarot.setCount(1)"><div class="cat-icon">🎴</div><div class="cat-name">' + App.t('单张指引') + '</div></div>';
      h += '<div class="cat-card' + (state.count === 3 ? ' selected' : '') + '" onclick="App.pages.tarot.setCount(3)"><div class="cat-icon">🎴🎴🎴</div><div class="cat-name">' + App.t('三张牌阵') + '</div></div>';
      h += '</div></div>';

      // 洗牌动画区
      h += '<div id="tarotAnim"><div class="shuffle-box" id="shuffleBox" style="display:none;">🃏 ' + App.t('洗牌中...') + '</div></div>';

      h += '<button class="btn-primary mt40" onclick="App.pages.tarot.onDraw()" id="drawBtn">' + App.t('开始抽牌') + '</button>';
      h += App.footer();
      h += '</div>';
      return h;
    },

    onQuestion: function (v) { state.question = v; },
    setCount: function (n) {
      if (state.drawing) return;
      state.count = n;
      App.refresh();
    },
    toggle: function (key) {
      if (state.drawing) return;
      var selectedCount = state.cats.filter(function (c) { return c.selected; }).length;
      state.cats = state.cats.map(function (c) {
        if (c.key === key) {
          if (c.selected && selectedCount <= 1) { App.toast(App.t('至少保留一个方向')); return c; }
          return Object.assign({}, c, { selected: !c.selected });
        }
        return c;
      });
      App.refresh();
    },

    onDraw: function () {
      if (state.drawing) return;
      var deck = tarotData.TAROT;
      var question = state.question.trim();
      var selectedCategories = state.cats.filter(function (c) { return c.selected; }).map(function (c) { return c.key; });

      state.drawing = true;
      var box = document.getElementById('shuffleBox');
      var animBox = document.getElementById('tarotAnim');
      if (box) box.style.display = 'flex';
      var drawBtn = document.getElementById('drawBtn');
      if (drawBtn) drawBtn.style.opacity = '0.5';

      var tick = 0;
      var anim = setInterval(function () {
        tick++;
        if (box) box.innerHTML = '🃏 ' + deck[tick % deck.length].name;
        if (tick >= 10) {
          clearInterval(anim);
          var result = engine.drawCards(deck, state.count, question);
          App.store.lastTarot = { result: result, question: question, categories: selectedCategories };
          state.drawing = false;
          App.go('tarot-result');
        }
      }, 200);
    }
  };

  App.pages.tarot = page;
})();
