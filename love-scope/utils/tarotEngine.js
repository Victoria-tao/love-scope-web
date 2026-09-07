/**
 * utils/tarotEngine.js
 * 趣味抽卡引擎：洗牌（Fisher-Yates）+ 抽牌（1张/3张）+ 正逆位随机
 */

// Fisher-Yates 洗牌（返回新数组，不修改原数组）
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

/**
 * 抽牌
 * @param {Array} deck 牌库
 * @param {Number} count 抽牌张数（1 或 3）
 * @param {String} question 用户的问题（可空）
 * @returns {Array} [{ card, upright, positionName }]
 */
function drawCards(deck, count, question) {
  const shuffled = shuffle(deck);
  const positions = count === 3 ? ['过去', '现在', '未来'] : ['当下'];
  return shuffled.slice(0, count).map((card, idx) => ({
    card: card,
    upright: Math.random() >= 0.5,
    positionName: positions[idx] || '当下'
  }));
}

module.exports = {
  shuffle: shuffle,
  drawCards: drawCards
};
