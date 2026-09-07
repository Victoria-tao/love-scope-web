/**
 * data/zodiacAnimal.js
 * 属相配对数据：12生肖（含五行/阴阳）+ 传统关系（六合/三合/六冲/六害/比和）
 * + 五行生克（道视角）+ 单属相年度个人运
 *
 * 生肖五行：鼠水 牛土 虎木 兔木 龙土 蛇火 马火 羊土 猴金 鸡金 狗土 猪水
 */

const yf = require('./yearFortune.js');

// ============ 12生肖（索引 0-11；wx=五行, yin=阴阳） ============
const ANIMALS = [
  { key: 'rat',    name: '鼠', wx: '水', yin: true,  keywords: ['机灵', '敏锐'], traits: '聪明机敏，洞察力强，点子多' },
  { key: 'ox',     name: '牛', wx: '土', yin: false, keywords: ['踏实', '勤恳'], traits: '任劳任怨，稳重靠谱，认定就不回头' },
  { key: 'tiger',  name: '虎', wx: '木', yin: true,  keywords: ['霸气', '果敢'], traits: '自信强势，敢爱敢闯，气场强大' },
  { key: 'rabbit', name: '兔', wx: '木', yin: false, keywords: ['温柔', '细腻'], traits: '温和体贴，善解人意，心思柔软' },
  { key: 'dragon', name: '龙', wx: '土', yin: true,  keywords: ['自信', '耀眼'], traits: '天生主角，志向远大，魅力出众' },
  { key: 'snake',  name: '蛇', wx: '火', yin: false, keywords: ['神秘', '睿智'], traits: '冷静理性，观察入微，神秘感十足' },
  { key: 'horse',  name: '马', wx: '火', yin: true,  keywords: ['奔放', '乐观'], traits: '热情开朗，自由奔放，行动力强' },
  { key: 'goat',   name: '羊', wx: '土', yin: false, keywords: ['温顺', '浪漫'], traits: '温柔善良，心思细腻，重感情' },
  { key: 'monkey', name: '猴', wx: '金', yin: true,  keywords: ['灵动', '机智'], traits: '机灵鬼马，风趣幽默，社交达人' },
  { key: 'rooster',name: '鸡', wx: '金', yin: false, keywords: ['精明', '干练'], traits: '认真细致，追求完美，效率至上' },
  { key: 'dog',    name: '狗', wx: '土', yin: true,  keywords: ['忠诚', '正直'], traits: '忠诚可靠，仗义真诚，安全感满分' },
  { key: 'pig',    name: '猪', wx: '水', yin: false, keywords: ['豁达', '真诚'], traits: '乐观豁达，随和真诚，懂得享受生活' }
];

// ============ 传统关系定义 ============
const LIUHE = [[0,1],[2,11],[3,10],[4,9],[5,8],[6,7]];
const SANHE = [[8,0,4],[5,9,1],[2,6,10],[11,3,7]];
const LIUCHONG = [[0,6],[1,7],[2,8],[3,9],[4,10],[5,11]];
const LIUHAI = [[0,7],[1,6],[2,5],[3,4],[8,11],[9,10]];

function getRelation(i, j) {
  if (i === j) return 'same';
  const a = Math.min(i, j), b = Math.max(i, j);
  if (LIUHE.some(p => p[0] === a && p[1] === b)) return 'liuhe';
  if (LIUCHONG.some(p => p[0] === a && p[1] === b)) return 'liuchong';
  if (LIUHAI.some(p => p[0] === a && p[1] === b)) return 'liuhai';
  if (SANHE.some(g => g.includes(i) && g.includes(j))) return 'sanhe';
  return 'normal';
}

// ============ 关系类型定义 ============
const RELATION = {
  liuhe: {
    score: 90, name: '天作之合', tag: '🔥 天作之合',
    summary: '{AN}与{BN}是十二生肖里最"对味"的组合，天生默契，互补得刚刚好。',
    advantage: '六合生肖天生互补：{AN}的{AK}正好补上{BN}缺的那一块，{BN}的{BK}又恰好戳中{AN}的心。你们在一起顺遂合拍，家庭观念和奋斗目标都高度一致，是长辈看了都会点头的组合。',
    challenge: '太合拍也容易"理所当然"——习惯了对方的包容，偶尔会忽略经营，以为感情永远不用费心。',
    tips: ['珍惜这份天赐默契，也要定期制造惊喜', '把感谢说出口，别把对方的付出当应该', '一起定个长远目标，让默契有方向']
  },
  sanhe: {
    score: 84, name: '默契三合', tag: '💞 默契三合',
    summary: '你们属于同一"三合气场"，性格合拍、互相成就，是让人羡慕的黄金搭档。',
    advantage: '三合生肖自带"同盟气场"：{AN}的{AK}与{BN}的{BK}相互加持，你们既是恋人也是战友，一起面对生活时默契十足，日子越过越顺。',
    challenge: '默契的代价是容易"同质化"——太懂彼此反而少了新鲜感，需要主动给感情加一点不同频的惊喜。',
    tips: ['定期挑战新事物，打破默契的舒适区', '多向对方表达依赖，别总自己扛', '在朋友面前多夸对方，感情更旺']
  },
  same: {
    score: 76, name: '同根相惜', tag: '🌗 同根相惜',
    summary: '同一生肖的你们，像照镜子一样了解彼此，惺惺相惜也互相较劲。',
    advantage: '同一个生肖，同样的脾气和节奏：{AN}和{BN}都带着{AK}的特质，你们能秒懂对方的想法，相处起来不用多解释，共鸣感很强。',
    challenge: '太像的两个人，缺点也会放大——同一种倔强碰在一起，谁都不肯先让步时，容易僵持不下。',
    tips: ['约定"谁先笑谁赢"，化解僵局', '把较劲变成一起向上的动力', '偶尔扮演不同的角色，给关系加点新鲜感']
  },
  normal: {
    score: 70, name: '和谐相处', tag: '💞 和谐相处',
    summary: '你们是平稳踏实的组合，没有惊天动地，却有细水长流的默契。',
    advantage: '{AN}的{AK}与{BN}的{BK}相处起来自然舒服，性格上没有硬伤，只要用心经营，就是稳稳的幸福组合。',
    challenge: '缺少一点"宿命感"和火花，激情需要主动制造，否则容易陷入平平淡淡的惯性。',
    tips: ['定期安排二人专属约会，保持心动', '制造一点小惊喜小仪式，提升浓度', '一起培养共同爱好，感情更牢固']
  },
  liuhai: {
    score: 58, name: '需要经营', tag: '🌗 需要经营',
    summary: '你们的节奏有些错位，需要更多理解和包容，经营好了反而更懂珍惜。',
    advantage: '{AN}的{AK}和{BN}的{BK}风格差异明显，初期容易"对不上频道"，但正因不同，你们能带给彼此全新的视角，磨合后感情更有深度。',
    challenge: '一个想快一个想慢，一个直来直去一个藏着掖着，沟通不畅时容易积累"不被理解"的委屈。',
    tips: ['建立"每周谈心"时间，把误会清零', '学习对方爱的语言，用TA的方式表达', '遇到分歧先讲感受，再讲道理']
  },
  liuchong: {
    score: 50, name: '火花对撞', tag: '⚡ 火花对撞',
    summary: '你们是"相爱相杀"的高能组合，火花四溅、张力十足，爱得轰轰烈烈。',
    advantage: '六冲生肖自带强磁场：{AN}的{AK}挑战着{BN}的{BK}，彼此吸引又彼此较劲，感情里从不缺戏剧性和新鲜感，爱得够刺激。',
    challenge: '性格棱角剧烈碰撞，冲突来得快也去得快；情绪上头时容易伤人，需要极强的自我克制和包容力。',
    tips: ['情绪爆发前先"物理降温"，各自冷静', '别翻旧账，就事论事解决当下', '把较劲转化为共同的热情，一起疯一起赢']
  }
};

// 五行生克的传统解读（完整五行）
function buildAnimalTao(a, b) {
  const wa = a.wx, wb = b.wx;
  let rel, dao, star;
  if (wa === wb) {
    rel = '比和';
    dao = '同五行之气相合，如双水汇流、双土成山，同气相求，根基稳固。';
    star = '星象五行同频，价值观与节奏天然接近，相处踏实安心。';
  } else if (yf.SHENG[wa] === wb) {
    rel = wa + '生' + wb;
    dao = wa + '气生' + wb + '气，相生相济，你二人一者施生、一者承纳，气机流通，是为吉配。';
    star = '五行相生，能量自然输送，感情中一方滋养另一方，互补互旺。';
  } else if (yf.SHENG[wb] === wa) {
    rel = wb + '生' + wa;
    dao = wb + '气生' + wa + '气，你被对方之气滋养，如木得水、火得薪，是被温柔托举的组合。';
    star = '五行相生，对方是你情感能量的"补给站"，相处顺遂受惠。';
  } else if (yf.KE[wa] === wb) {
    rel = wa + '克' + wb;
    dao = wa + '气克' + wb + '气，此缘有制衡之意，需以柔化刚，勿以强压强，方能转克为生。';
    star = '五行相克，性格有相互制约之处，张力与吸引力并存，需智慧经营。';
  } else {
    rel = wb + '克' + wa;
    dao = wb + '气克' + wa + '气，你易被对方之气所制，相处中多一份退让与包容，关系方能长久。';
    star = '五行相克，对方气场略胜于你，学会借力而非硬顶，关系更顺。';
  }
  return { wxA: wa, wxB: wb, rel: rel, dao: dao, star: star };
}

// 生肖阴阳
function buildAnimalYin(a, b) {
  if (a.yin === b.yin) {
    return '同气同阳/同阴，气场相合亦有相斥，热烈而需留白。';
  }
  return '一阴一阳谓之道，你二人阴阳互补、刚柔相济，是合和之象。';
}

function generateAnimalCopy(i, j, relKey, a, b) {
  const tpl = RELATION[relKey];
  const rep = (s) => s
    .replace(/\{AN\}/g, a.name).replace(/\{BN\}/g, b.name)
    .replace(/\{AK\}/g, a.keywords[0]).replace(/\{BK\}/g, b.keywords[0]);
  return {
    summary: rep(tpl.summary),
    advantage: rep(tpl.advantage),
    challenge: rep(tpl.challenge),
    tips: tpl.tips
  };
}

function getAnimalMatch(myIdx, taIdx) {
  const me = ANIMALS[myIdx];
  const ta = ANIMALS[taIdx];
  const relKey = getRelation(myIdx, taIdx);
  const rel = RELATION[relKey];
  const copy = generateAnimalCopy(myIdx, taIdx, relKey, me, ta);
  const tao = buildAnimalTao(me, ta);
  return {
    me: { name: me.name, wx: me.wx, yin: me.yin, keywords: me.keywords },
    ta: { name: ta.name, wx: ta.wx, yin: ta.yin, keywords: ta.keywords },
    score: rel.score,
    relName: rel.name,
    relTag: rel.tag,
    copy: copy,
    tao: tao,
    yinText: buildAnimalYin(me, ta)
  };
}

// 单属相年度个人运（道/星双视角）
function getSingleAnimalFortune(idx, year) {
  const me = ANIMALS[idx];
  const gz = yf.getGanZhi(year);
  const infl = yf.getYearInfluence(me.wx, year);
  return {
    title: gz.year + '年' + gz.ganZhi + '年 · 属' + me.name + '情感状态',
    name: '属' + me.name,
    wx: me.wx,
    theme: '『' + me.keywords[0] + ' · ' + me.keywords[1] + '』' + me.traits,
    inflTag: infl.tag,
    inflTao: infl.tao,
    inflStar: infl.star,
    tao: '属' + me.name + '五行属' + me.wx + '，' + (me.yin ? '阳' : '阴') + '气所主。' + infl.tao,
    star: '年度' + gz.ganZhi + '（' + gz.animal + '年），' + infl.star
  };
}

module.exports = {
  ANIMALS: ANIMALS,
  RELATION: RELATION,
  getRelation: getRelation,
  getAnimalMatch: getAnimalMatch,
  getSingleAnimalFortune: getSingleAnimalFortune
};
