/**
 * data/mbtiTest.js
 * MBTI 性格测试题目
 * 16道题，每个维度4题（E/I, S/N, T/F, J/P）
 * 每题二选一，A/B 对应不同维度倾向
 */

const QUESTIONS = [
  // ===== E/I 维度（外向/内向）=====
  {
    id: 1,
    dim: 'EI',
    question: '周末休息时，你更愿意？',
    options: [
      { value: 'E', text: '和朋友出去聚会，人多热闹' },
      { value: 'I', text: '在家独处，看书追剧放松' }
    ]
  },
  {
    id: 2,
    dim: 'EI',
    question: '在一个陌生的聚会上，你通常会？',
    options: [
      { value: 'E', text: '主动和陌生人聊天，认识新朋友' },
      { value: 'I', text: '待在熟悉的人身边，等别人来搭话' }
    ]
  },
  {
    id: 3,
    dim: 'EI',
    question: '遇到难题时，你更倾向于？',
    options: [
      { value: 'E', text: '说出来和别人讨论，边说边想' },
      { value: 'I', text: '自己一个人安静思考，想清楚再说' }
    ]
  },
  {
    id: 4,
    dim: 'EI',
    question: '忙碌了一天后，你恢复精力的方式是？',
    options: [
      { value: 'E', text: '约朋友出去玩，在社交中充电' },
      { value: 'I', text: '一个人安静待着，不被打扰' }
    ]
  },
  // ===== S/N 维度（感觉/直觉）=====
  {
    id: 5,
    dim: 'SN',
    question: '你更关注什么？',
    options: [
      { value: 'S', text: '眼前的实际情况和具体细节' },
      { value: 'N', text: '未来的可能性和整体趋势' }
    ]
  },
  {
    id: 6,
    dim: 'SN',
    question: '学习新技能时，你更喜欢？',
    options: [
      { value: 'S', text: '按步骤来，有具体例子和实操' },
      { value: 'N', text: '先理解整体概念和理论框架' }
    ]
  },
  {
    id: 7,
    dim: 'SN',
    question: '描述一件事时，你倾向于？',
    options: [
      { value: 'S', text: '按事实和细节，如实描述' },
      { value: 'N', text: '用比喻和联想，表达感受' }
    ]
  },
  {
    id: 8,
    dim: 'SN',
    question: '做计划时，你更看重？',
    options: [
      { value: 'S', text: '可执行的具体步骤和时间表' },
      { value: 'N', text: '整体方向和可能的变化空间' }
    ]
  },
  // ===== T/F 维度（思考/情感）=====
  {
    id: 9,
    dim: 'TF',
    question: '做重要决定时，你更依赖？',
    options: [
      { value: 'T', text: '逻辑分析，权衡利弊' },
      { value: 'F', text: '个人感受和对他人的影响' }
    ]
  },
  {
    id: 10,
    dim: 'TF',
    question: '朋友向你倾诉烦恼，你会？',
    options: [
      { value: 'T', text: '帮他分析问题，给出解决方案' },
      { value: 'F', text: '先共情安慰，理解他的情绪' }
    ]
  },
  {
    id: 11,
    dim: 'TF',
    question: '你更看重什么？',
    options: [
      { value: 'T', text: '公平公正，对事不对人' },
      { value: 'F', text: '和谐融洽，照顾每个人感受' }
    ]
  },
  {
    id: 12,
    dim: 'TF',
    question: '被别人批评时，你通常？',
    options: [
      { value: 'T', text: '理性分析批评是否有道理' },
      { value: 'F', text: '先感到受伤或委屈，再慢慢消化' }
    ]
  },
  // ===== J/P 维度（判断/知觉）=====
  {
    id: 13,
    dim: 'JP',
    question: '你的生活状态更接近？',
    options: [
      { value: 'J', text: '有计划有条理，按部就班' },
      { value: 'P', text: '随性灵活，随机应变' }
    ]
  },
  {
    id: 14,
    dim: 'JP',
    question: '出门旅行，你更喜欢？',
    options: [
      { value: 'J', text: '提前做好详细攻略和行程' },
      { value: 'P', text: '到了再看心情决定去哪' }
    ]
  },
  {
    id: 15,
    dim: 'JP',
    question: '面对截止日期，你通常？',
    options: [
      { value: 'J', text: '提前完成，留有余量' },
      { value: 'P', text: '最后期限前集中冲刺' }
    ]
  },
  {
    id: 16,
    dim: 'JP',
    question: '你的房间或桌面通常？',
    options: [
      { value: 'J', text: '整洁有序，东西各归其位' },
      { value: 'P', text: '有点乱，但知道东西在哪' }
    ]
  }
];

// 维度说明
const DIM_INFO = {
  E: { name: '外向', desc: '从社交和外部世界获取能量' },
  I: { name: '内向', desc: '从独处和内心世界获取能量' },
  S: { name: '感觉', desc: '关注具体事实和细节' },
  N: { name: '直觉', desc: '关注可能性和整体趋势' },
  T: { name: '思考', desc: '用逻辑和分析做决定' },
  F: { name: '情感', desc: '用价值观和感受做决定' },
  J: { name: '判断', desc: '喜欢有计划、有秩序' },
  P: { name: '知觉', desc: '喜欢灵活、随性' }
};

// 计算 MBTI 类型
function calcMbtiType(answers) {
  // answers: [{questionId, value}]
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  answers.forEach(a => {
    if (scores[a.value] !== undefined) {
      scores[a.value]++;
    }
  });

  const type =
    (scores.E >= scores.I ? 'E' : 'I') +
    (scores.S >= scores.N ? 'S' : 'N') +
    (scores.T >= scores.F ? 'T' : 'F') +
    (scores.J >= scores.P ? 'J' : 'P');

  // 各维度百分比
  const dims = {
    EI: { left: scores.E, right: scores.I, leftLabel: 'E', rightLabel: 'I' },
    SN: { left: scores.S, right: scores.N, leftLabel: 'S', rightLabel: 'N' },
    TF: { left: scores.T, right: scores.F, leftLabel: 'T', rightLabel: 'F' },
    JP: { left: scores.J, right: scores.P, leftLabel: 'J', rightLabel: 'P' }
  };

  return { type, scores, dims };
}

module.exports = {
  QUESTIONS,
  DIM_INFO,
  calcMbtiType
};
