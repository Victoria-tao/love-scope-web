/**
 * data/mbtiTest.js (Web版)
 * MBTI 性格测试题目（16道题，每维度4题）+ 计分
 */
(function () {
  var QUESTIONS = [
    { id: 1, dim: 'EI', question: '周末休息时，你更愿意？', options: [ { value: 'E', text: '和朋友出去聚会，人多热闹' }, { value: 'I', text: '在家独处，看书追剧放松' } ] },
    { id: 2, dim: 'EI', question: '在一个陌生的聚会上，你通常会？', options: [ { value: 'E', text: '主动和陌生人聊天，认识新朋友' }, { value: 'I', text: '待在熟悉的人身边，等别人来搭话' } ] },
    { id: 3, dim: 'EI', question: '遇到难题时，你更倾向于？', options: [ { value: 'E', text: '说出来和别人讨论，边说边想' }, { value: 'I', text: '自己一个人安静思考，想清楚再说' } ] },
    { id: 4, dim: 'EI', question: '忙碌了一天后，你恢复精力的方式是？', options: [ { value: 'E', text: '约朋友出去玩，在社交中充电' }, { value: 'I', text: '一个人安静待着，不被打扰' } ] },
    { id: 5, dim: 'SN', question: '你更关注什么？', options: [ { value: 'S', text: '眼前的实际情况和具体细节' }, { value: 'N', text: '未来的可能性和整体趋势' } ] },
    { id: 6, dim: 'SN', question: '学习新技能时，你更喜欢？', options: [ { value: 'S', text: '按步骤来，有具体例子和实操' }, { value: 'N', text: '先理解整体概念和理论框架' } ] },
    { id: 7, dim: 'SN', question: '描述一件事时，你倾向于？', options: [ { value: 'S', text: '按事实和细节，如实描述' }, { value: 'N', text: '用比喻和联想，表达感受' } ] },
    { id: 8, dim: 'SN', question: '做计划时，你更看重？', options: [ { value: 'S', text: '可执行的具体步骤和时间表' }, { value: 'N', text: '整体方向和可能的变化空间' } ] },
    { id: 9, dim: 'TF', question: '做重要决定时，你更依赖？', options: [ { value: 'T', text: '逻辑分析，权衡利弊' }, { value: 'F', text: '个人感受和对他人的影响' } ] },
    { id: 10, dim: 'TF', question: '朋友向你倾诉烦恼，你会？', options: [ { value: 'T', text: '帮他分析问题，给出解决方案' }, { value: 'F', text: '先共情安慰，理解他的情绪' } ] },
    { id: 11, dim: 'TF', question: '你更看重什么？', options: [ { value: 'T', text: '公平公正，对事不对人' }, { value: 'F', text: '和谐融洽，照顾每个人感受' } ] },
    { id: 12, dim: 'TF', question: '被别人批评时，你通常？', options: [ { value: 'T', text: '理性分析批评是否有道理' }, { value: 'F', text: '先感到受伤或委屈，再慢慢消化' } ] },
    { id: 13, dim: 'JP', question: '你的生活状态更接近？', options: [ { value: 'J', text: '有计划有条理，按部就班' }, { value: 'P', text: '随性灵活，随机应变' } ] },
    { id: 14, dim: 'JP', question: '出门旅行，你更喜欢？', options: [ { value: 'J', text: '提前做好详细攻略和行程' }, { value: 'P', text: '到了再看心情决定去哪' } ] },
    { id: 15, dim: 'JP', question: '面对截止日期，你通常？', options: [ { value: 'J', text: '提前完成，留有余量' }, { value: 'P', text: '最后期限前集中冲刺' } ] },
    { id: 16, dim: 'JP', question: '你的房间或桌面通常？', options: [ { value: 'J', text: '整洁有序，东西各归其位' }, { value: 'P', text: '有点乱，但知道东西在哪' } ] },
    { id: 17, dim: 'EI', question: '团队讨论时，你通常？', options: [ { value: 'E', text: '积极表达观点，带动气氛' }, { value: 'I', text: '先听别人说，找机会再发言' } ] },
    { id: 18, dim: 'EI', question: '收到陌生人的消息或电话，你？', options: [ { value: 'E', text: '很快回复，还能多聊几句' }, { value: 'I', text: '会纠结怎么回，能拖就拖' } ] },
    { id: 19, dim: 'EI', question: '理想的假期状态是？', options: [ { value: 'E', text: '和一群人热热闹闹地度过' }, { value: 'I', text: '和一两个亲近的人安静相处' } ] },
    { id: 20, dim: 'SN', question: '看完一部电影，你更容易记住？', options: [ { value: 'S', text: '具体的情节和画面细节' }, { value: 'N', text: '主题思想和背后的隐喻' } ] },
    { id: 21, dim: 'SN', question: '做选择时，你更看重？', options: [ { value: 'S', text: '眼前能看到的实际情况' }, { value: 'N', text: '未来的潜力和发展方向' } ] },
    { id: 22, dim: 'SN', question: '你认为"成功"更多是？', options: [ { value: 'S', text: '一步一个脚印的积累' }, { value: 'N', text: '找对方向后的关键突破' } ] },
    { id: 23, dim: 'TF', question: '同事向你吐槽工作，你第一反应是？', options: [ { value: 'T', text: '帮他理清问题出在哪里' }, { value: 'F', text: '先陪他把情绪倒完' } ] },
    { id: 24, dim: 'TF', question: '与人争论时，你更在意？', options: [ { value: 'T', text: '谁说得更有道理' }, { value: 'F', text: '别把关系伤了和气' } ] },
    { id: 25, dim: 'TF', question: '朋友做了一个你不认同的决定，你会？', options: [ { value: 'T', text: '直接指出其中的问题' }, { value: 'F', text: '尊重他，但让他知道我在意' } ] },
    { id: 26, dim: 'JP', question: '原本排好的计划被打乱，你？', options: [ { value: 'J', text: '有点烦躁，想尽快恢复秩序' }, { value: 'P', text: '无所谓，顺势调整就好' } ] },
    { id: 27, dim: 'JP', question: '面对多项任务，你习惯？', options: [ { value: 'J', text: '列清单，逐项完成' }, { value: 'P', text: '凭感觉，想到哪个做哪个' } ] },
    { id: 28, dim: 'JP', question: '关于"惊喜"，你更偏向？', options: [ { value: 'J', text: '一切尽在掌控中更安心' }, { value: 'P', text: '突如其来的变化更有趣' } ] }
  ];

  var DIM_INFO = {
    E: { name: '外向', desc: '从社交和外部世界获取能量' },
    I: { name: '内向', desc: '从独处和内心世界获取能量' },
    S: { name: '感觉', desc: '关注具体事实和细节' },
    N: { name: '直觉', desc: '关注可能性和整体趋势' },
    T: { name: '思考', desc: '用逻辑和分析做决定' },
    F: { name: '情感', desc: '用价值观和感受做决定' },
    J: { name: '判断', desc: '喜欢有计划、有秩序' },
    P: { name: '知觉', desc: '喜欢灵活、随性' }
  };

  function calcMbtiType(answers) {
    var scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    answers.forEach(function (a) {
      if (scores[a.value] !== undefined) scores[a.value]++;
    });
    var type =
      (scores.E >= scores.I ? 'E' : 'I') +
      (scores.S >= scores.N ? 'S' : 'N') +
      (scores.T >= scores.F ? 'T' : 'F') +
      (scores.J >= scores.P ? 'J' : 'P');
    var dims = {
      EI: { left: scores.E, right: scores.I, leftLabel: 'E', rightLabel: 'I' },
      SN: { left: scores.S, right: scores.N, leftLabel: 'S', rightLabel: 'N' },
      TF: { left: scores.T, right: scores.F, leftLabel: 'T', rightLabel: 'F' },
      JP: { left: scores.J, right: scores.P, leftLabel: 'J', rightLabel: 'P' }
    };
    return { type: type, scores: scores, dims: dims };
  }

  // 英文题目
  var QUESTIONS_EN = [
    { id: 1, question: 'On weekends, you prefer to?', options: [ { value: 'E', text: 'Go out with friends, lively crowds' }, { value: 'I', text: 'Stay home alone, read or watch shows' } ] },
    { id: 2, question: 'At a陌生 party, you usually?', options: [ { value: 'E', text: 'Actively chat with strangers' }, { value: 'I', text: 'Stay near familiar people' } ] },
    { id: 3, question: 'Facing a problem, you tend to?', options: [ { value: 'E', text: 'Talk it out with others' }, { value: 'I', text: 'Think quietly alone first' } ] },
    { id: 4, question: 'After a busy day, you recharge by?', options: [ { value: 'E', text: 'Meeting friends, social energy' }, { value: 'I', text: 'Quiet time alone, undisturbed' } ] },
    { id: 5, question: 'You focus more on?', options: [ { value: 'S', text: 'Present facts and details' }, { value: 'N', text: 'Future possibilities and trends' } ] },
    { id: 6, question: 'Learning new skills, you prefer?', options: [ { value: 'S', text: 'Step-by-step with examples' }, { value: 'N', text: 'Understand concepts and theory first' } ] },
    { id: 7, question: 'Describing something, you tend to?', options: [ { value: 'S', text: 'State facts and details' }, { value: 'N', text: 'Use metaphors and feelings' } ] },
    { id: 8, question: 'Planning, you value?', options: [ { value: 'S', text: 'Concrete steps and schedules' }, { value: 'N', text: 'Overall direction and flexibility' } ] },
    { id: 9, question: 'Important decisions, you rely on?', options: [ { value: 'T', text: 'Logical analysis, pros and cons' }, { value: 'F', text: 'Personal feelings and impact on others' } ] },
    { id: 10, question: 'Friend shares troubles, you?', options: [ { value: 'T', text: 'Analyze and give solutions' }, { value: 'F', text: 'Empathize and comfort first' } ] },
    { id: 11, question: 'You value more?', options: [ { value: 'T', text: 'Fairness and objectivity' }, { value: 'F', text: 'Harmony and everyones feelings' } ] },
    { id: 12, question: 'When criticized, you usually?', options: [ { value: 'T', text: 'Rationally analyze if it is valid' }, { value: 'F', text: 'Feel hurt first, then process' } ] },
    { id: 13, question: 'Your lifestyle is closer to?', options: [ { value: 'J', text: 'Planned and organized' }, { value: 'P', text: 'Spontaneous and flexible' } ] },
    { id: 14, question: 'Traveling, you prefer?', options: [ { value: 'J', text: 'Detailed itinerary in advance' }, { value: 'P', text: 'Decide on the spot by mood' } ] },
    { id: 15, question: 'Facing deadlines, you?', options: [ { value: 'J', text: 'Finish early with margin' }, { value: 'P', text: 'Crunch near the deadline' } ] },
    { id: 16, question: 'Your room/desk is usually?', options: [ { value: 'J', text: 'Tidy, everything in place' }, { value: 'P', text: 'Messy but I know where things are' } ] },
    { id: 17, question: 'Team discussions, you?', options: [ { value: 'E', text: 'Actively share, drive the mood' }, { value: 'I', text: 'Listen first, speak when ready' } ] },
    { id: 18, question: 'Unexpected message/call, you?', options: [ { value: 'E', text: 'Reply quickly, chat a bit' }, { value: 'I', text: 'Overthink how to respond' } ] },
    { id: 19, question: 'Ideal vacation is?', options: [ { value: 'E', text: 'Lively with a group of people' }, { value: 'I', text: 'Quiet with one or two close ones' } ] },
    { id: 20, question: 'After a movie, you remember?', options: [ { value: 'S', text: 'Specific plot and visual details' }, { value: 'N', text: 'Themes and hidden meanings' } ] },
    { id: 21, question: 'Making choices, you value?', options: [ { value: 'S', text: 'Current tangible situation' }, { value: 'N', text: 'Future potential and direction' } ] },
    { id: 22, question: '"Success" is more about?', options: [ { value: 'S', text: 'Step-by-step accumulation' }, { value: 'N', text: 'Key breakthrough after finding direction' } ] },
    { id: 23, question: 'Colleague vents about work, you first?', options: [ { value: 'T', text: 'Help identify the problem' }, { value: 'F', text: 'Let them express emotions first' } ] },
    { id: 24, question: 'In an argument, you care about?', options: [ { value: 'T', text: 'Who makes more sense' }, { value: 'F', text: 'Not damaging the relationship' } ] },
    { id: 25, question: 'Friend makes a decision you disagree with, you?', options: [ { value: 'T', text: 'Point out the issues directly' }, { value: 'F', text: 'Respect it but share my concern' } ] },
    { id: 26, question: 'Plans get disrupted, you?', options: [ { value: 'J', text: 'Annoyed, want to restore order' }, { value: 'P', text: 'Fine, adjust on the fly' } ] },
    { id: 27, question: 'Multiple tasks, you habitually?', options: [ { value: 'J', text: 'Make a list, complete one by one' }, { value: 'P', text: 'Go by feeling, whatever comes to mind' } ] },
    { id: 28, question: 'About "surprises", you prefer?', options: [ { value: 'J', text: 'Everything under control feels safe' }, { value: 'P', text: 'Unexpected changes are more fun' } ] }
  ];

  var DIM_INFO_EN = {
    E: { name: 'Extraversion', desc: 'Gains energy from social and external world' },
    I: { name: 'Introversion', desc: 'Gains energy from solitude and inner world' },
    S: { name: 'Sensing', desc: 'Focuses on concrete facts and details' },
    N: { name: 'Intuition', desc: 'Focuses on possibilities and patterns' },
    T: { name: 'Thinking', desc: 'Decides with logic and analysis' },
    F: { name: 'Feeling', desc: 'Decides with values and empathy' },
    J: { name: 'Judging', desc: 'Prefers planning and order' },
    P: { name: 'Perceiving', desc: 'Prefers flexibility and spontaneity' }
  };

  window.MBTI_TEST = { QUESTIONS: QUESTIONS, QUESTIONS_EN: QUESTIONS_EN, DIM_INFO: DIM_INFO, DIM_INFO_EN: DIM_INFO_EN, calcMbtiType: calcMbtiType };
})();
