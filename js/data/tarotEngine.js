/**
 * utils/tarotEngine.js (Web版)
 * 趣味抽卡引擎：洗牌（Fisher-Yates）+ 抽牌（1张/3张）+ 正逆位随机
 */
(function () {
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function drawCards(deck, count, question) {
    var shuffled = shuffle(deck);
    var positions = count === 3 ? ['过去', '现在', '未来'] : ['当下'];
    return shuffled.slice(0, count).map(function (card, idx) {
      return {
        card: card,
        upright: Math.random() >= 0.5,
        positionName: positions[idx] || '当下'
      };
    });
  }

  window.TE = { shuffle: shuffle, drawCards: drawCards };
})();
