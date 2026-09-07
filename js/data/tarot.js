/**
 * data/tarot.js (Web版)
 * 趣味卡牌牌库：22张大阿卡纳（Major Arcana）
 */
(function () {
  var TAROT = [
    { id: 0, no: '0', name: '愚者', en: 'The Fool', upright: ['新的开始', '冒险', '纯真'], reversed: ['鲁莽', '犹豫', '原地踏步'], uprightText: '愚者正位象征一段全新的旅程即将开启。在感情里，这意味着一种毫无保留的纯粹与勇气——也许是刚认识的心动，也许是决定放下顾虑、迈出第一步。此刻的你，带着一颗赤子之心去爱，反而最能遇见惊喜。', reversedText: '逆位的愚者提醒你：是不是想得太多、犹豫太久，反而错过了出发的时机？或者，你正在用"自由"当借口逃避认真的承诺。问问自己，是时候大胆一次，还是该先想清楚方向。', love: '新缘分的信号，勇敢迈出第一步，别让犹豫错过心动。' },
    { id: 1, no: 'I', name: '魔术师', en: 'The Magician', upright: ['创造', '行动力', '心想事成'], reversed: ['拖延', '空谈', '方向迷失'], uprightText: '魔术师正位代表"心想事成"的能量。你手上拥有让感情变好的一切工具——沟通、行动、真诚。如果你有心仪的人，现在是主动出击的最佳时机；如果已有伴侣，一个用心的安排就能让关系焕然一新。', reversedText: '逆位的魔术师提醒：是不是想得太多、做得太少？空有计划和承诺，却没有行动，再好的牌也会沦为空谈。别被花言巧语迷惑，看行动，别只听承诺。', love: '行动力是关键词，把心动变成行动，主动创造属于你们的故事。' },
    { id: 2, no: 'II', name: '女祭司', en: 'The High Priestess', upright: ['直觉', '内在', '静观其变'], reversed: ['忽视直觉', '压抑感受', '表象迷惑'], uprightText: '女祭司正位强调"倾听内心"。在感情里，你的直觉可能比任何分析都准确——有些事不必急着挑明，静观其变，答案会自然浮现。适合独处、反思，让内心告诉你该走向何方。', reversedText: '逆位的女祭司提示：你是否在压抑真实的感受，用理性掩盖了直觉？也许你看到了某些"不对劲"却选择视而不见。请信任自己的第六感，别被表面的平静蒙蔽。', love: '静下来听内心的声音，直觉比任何分析都更接近真相。' },
    { id: 3, no: 'III', name: '皇后', en: 'The Empress', upright: ['丰盛', '温柔', '滋养'], reversed: ['过度付出', '依赖', '自我忽视'], uprightText: '皇后正位是爱与丰盛的象征。你的感情正处在被滋养的阶段，关系温暖而充满生命力。如果你是单身，你自身的魅力磁场正在吸引对的人靠近；有伴侣的话，是关系开花结果、更进一步的甜蜜期。', reversedText: '逆位的皇后提醒：你是不是付出得太多，忘了好好爱自己？过度牺牲和讨好并不会换来珍惜，先把自己宠成"皇后"，感情才会丰盛。', love: '先好好爱自己，你的丰盛自然会吸引对的人，关系正进入甜蜜生长期。' },
    { id: 4, no: 'IV', name: '皇帝', en: 'The Emperor', upright: ['稳定', '责任', '掌控'], reversed: ['控制欲', '固执', '缺乏安全感'], uprightText: '皇帝正位代表稳定与责任。你们的关系正朝着"扎实"的方向发展：承诺、规划、安全感都在升级。这是一个适合谈未来、定承诺的时期，把感情建立在坚实的土地上。', reversedText: '逆位的皇帝提示：关系中是否有一方控制欲过强，或安全感缺失到需要用"掌控"来填补？过度的强势和固执会压抑彼此，学会柔软，把"我说了算"换成"我们一起商量"。', love: '关系正在走向稳定成熟，用责任和承诺为感情打下坚实基础。' },
    { id: 5, no: 'V', name: '教皇', en: 'The Hierophant', upright: ['传统', '承诺', '指引'], reversed: ['束缚', '墨守成规', '质疑'], uprightText: '教皇正位象征传统与承诺的认可。感情进入了被"正式化"的阶段——可能是见家长、谈婚论嫁，也可能是关系得到周围人的祝福与认可。这是一段被祝福的关系，值得认真对待。', reversedText: '逆位的教皇提示：你们是否被某种"应该"和"传统"束缚住了？也许内心在质疑这段关系是否符合自己的心意。勇敢审视：是真心想要，还是只是"到了该结婚的年纪"。', love: '关系走向"被认可"的阶段，认真对待承诺，感情会得到祝福。' },
    { id: 6, no: 'VI', name: '恋人', en: 'The Lovers', upright: ['爱', '结合', '选择'], reversed: ['失衡', '诱惑', '价值观冲突'], uprightText: '恋人牌是趣味卡牌中最纯粹的爱情象征。正位代表心意相通、双向奔赴，你们正处在感情浓度极高的阶段；若单身，这是"对的人出现"的强烈信号。同时它也提醒：爱是一种主动的选择，请坚定地选择彼此。', reversedText: '逆位的恋人牌提示关系中的失衡：可能是价值观的冲突、一方的心不在焉，或外在诱惑的干扰。诚实面对——这段关系里的选择，是不是双方都心甘情愿的？', love: '爱情最纯粹的时刻，双向奔赴、心意相通，勇敢坚定地选择彼此。' },
    { id: 7, no: 'VII', name: '战车', en: 'The Chariot', upright: ['胜利', '决心', '掌控方向'], reversed: ['失控', '冲突', '方向不明'], uprightText: '战车正位代表"迎难而上、终获胜利"。在感情里，这意味着你有能力把关系推向想要的方向——主动表白、修复裂痕、突破瓶颈，只要下定决心，就能掌控局面、赢得想要的结局。', reversedText: '逆位的战车提示：情绪或矛盾是否正在失控？前进的方向有些混乱，急于求成反而容易翻车。先稳住自己，理清到底想要什么，再继续前进。', love: '下定决心就能掌控局面，主动出击，把关系推向你想要的方向。' },
    { id: 8, no: 'VIII', name: '力量', en: 'Strength', upright: ['温柔', '勇气', '包容'], reversed: ['自我怀疑', '软弱', '情绪失控'], uprightText: '力量牌正位代表"以柔克刚"的智慧。真正的力量不是强势，而是温柔而坚定的包容。在感情里，你有能力用耐心和爱化解矛盾，用柔软治愈彼此。此刻的你，比想象中更有力量。', reversedText: '逆位的力量提示：你可能正陷入自我怀疑，或在情绪面前感到无力。别急着证明什么，先安抚内心的小野兽。柔软不是软弱，允许自己有脆弱，也是勇气的一部分。', love: '温柔而坚定地爱，用包容化解矛盾，你比想象中更有力量。' },
    { id: 9, no: 'IX', name: '隐士', en: 'The Hermit', upright: ['独处', '内省', '寻找答案'], reversed: ['孤立', '逃避', '过度封闭'], uprightText: '隐士正位是一段"向内探索"的时期。在感情里，可能是需要独处来想清楚自己真正要什么，也可能是暂时的"单身期"让你更了解自己。别怕独处，想清楚才能爱明白。', reversedText: '逆位的隐士提示：你是不是把自己封闭得太久了？独处和逃避是两回事。如果心里有想靠近的人，别用"想静静"当借口，走出山洞，光才能照进来。', love: '给自己一点独处的时间想清楚，答案在心里，不必急着向外求。' },
    { id: 10, no: 'X', name: '命运之轮', en: 'Wheel of Fortune', upright: ['转机', '机遇', '命运推动'], reversed: ['反复', '失控', '停滞'], uprightText: '命运之轮正位代表"时来运转"。感情正处在一个转折点——也许是意外的重逢、错过的人再度出现，也许是关系迎来重要的改变。命运正在转动，抓住这个时机，顺势而为。', reversedText: '逆位的命运之轮提示：事情似乎陷入了反复和停滞，努力了半天却看不到进展。别灰心，轮子总会转回来。此刻的不顺只是暂时的，保持耐心，别在低谷时做重大决定。', love: '命运的齿轮正在转动，抓住转机，新的可能正在靠近。' },
    { id: 11, no: 'XI', name: '正义', en: 'Justice', upright: ['平衡', '公正', '因果'], reversed: ['偏见', '不公', '逃避责任'], uprightText: '正义牌正位强调"种什么因得什么果"。感情中的付出与回报终将平衡——真诚会得到真诚，敷衍会换来疏离。此刻适合冷静、客观地审视这段关系：它是否公平？是否值得继续投入？', reversedText: '逆位的正义提示：关系中可能存在失衡或"双重标准"——一方付出、一方索取，或问题被粉饰掩盖。诚实面对，逃避责任只会让天平越来越歪。', love: '感情需要公平与真诚，审视付出与回报，种下的因终会结出对应的果。' },
    { id: 12, no: 'XII', name: '倒吊人', en: 'The Hanged Man', upright: ['换位思考', '暂停', '牺牲'], reversed: ['拖延', '徒劳', '固执己见'], uprightText: '倒吊人正位提醒你"换个角度看问题"。感情里的困境，也许换个立场就豁然开朗。这段时间适合暂停、等待、调整视角，暂时的"牺牲"或妥协，可能正是破局的关键。', reversedText: '逆位的倒吊人提示：无谓的拖延和牺牲正在消耗你。如果已经耗了很久却毫无进展，可能是方向本身就错了。别再用"再等等"自我安慰，及时止损也是一种智慧。', love: '换个角度看问题，暂时的停顿可能是破局的关键，别急着下结论。' },
    { id: 13, no: 'XIII', name: '死神', en: 'Death', upright: ['结束', '重生', '蜕变'], reversed: ['抗拒改变', '停滞', '放不下'], uprightText: '死神牌并非噩耗，它代表"旧的结束、新的开始"。在感情里，可能是一段不合适的关系走到终点，也可能是关系正在经历蜕变、进入全新阶段。学会告别，才能迎接新生。', reversedText: '逆位的死神提示：你是否在抗拒一段早就该结束的关系，或抓住已经变质的感情不肯放手？害怕改变只会让痛苦延长。放下执念，新生才会开始。', love: '告别不合适的，才能迎接新的可能。结束也是另一种开始。' },
    { id: 14, no: 'XIV', name: '节制', en: 'Temperance', upright: ['调和', '耐心', '适度'], reversed: ['失衡', '极端', '急躁'], uprightText: '节制正位代表"刚刚好的艺术"。感情需要调和与耐心：不急不躁、不过度索取也不过度付出，找到彼此的节奏。你们的关系正在磨合中走向和谐，给彼此一点时间和空间。', reversedText: '逆位的节制提示：关系可能有些"失衡"——一方太热、一方太冷，或节奏严重错位。别走极端，也别急于求成。找回平衡，感情才能细水长流。', love: '感情讲究"刚刚好"，耐心调和彼此的节奏，细水才能长流。' },
    { id: 15, no: 'XV', name: '恶魔', en: 'The Devil', upright: ['执念', '束缚', '欲望'], reversed: ['挣脱', '觉醒', '解放'], uprightText: '恶魔牌正位揭示关系中的"枷锁"：也许是明知不合适却放不下的执念，也许是沉溺于激情而忽视本质的诱惑，也许是不健康的依赖。诚实面对，这段关系是滋养你，还是困住你？', reversedText: '逆位的恶魔牌是"挣脱枷锁"的信号。你正在觉醒，意识到什么在束缚你，并开始为自己松绑。这是一段从执念中解放的过程，勇敢走出来，外面是自由的空气。', love: '看清关系中的执念与束缚，别让不健康的情感困住你，觉醒就是解脱。' },
    { id: 16, no: 'XVI', name: '高塔', en: 'The Tower', upright: ['突变', '崩塌', '真相'], reversed: ['逃避', '延迟', '余波'], uprightText: '高塔牌代表"突如其来的剧变"。可能是关系的真相被揭开、长久的隐患瞬间爆发，或是一段建立在虚假上的感情轰然倒塌。虽然痛苦，但唯有崩塌虚假，真实才有立足之地。', reversedText: '逆位的高塔提示：危机被暂时压住了，但隐患仍在。别以为躲过一劫就万事大吉，逃避只会让问题延期爆发。趁现在，主动处理那些早就该面对的问题。', love: '突如其来的变化可能很痛，但真相会让你看清什么值得留下。' },
    { id: 17, no: 'XVII', name: '星星', en: 'The Star', upright: ['希望', '疗愈', '心愿'], reversed: ['失望', '迷茫', '信心不足'], uprightText: '星星牌是最治愈的牌之一，代表"希望与疗愈"。无论之前经历了什么，现在都是修复与重生的时期。在感情里，这是充满信心和憧憬的吉兆：缘分在靠近，关系在变好，你的心愿值得相信。', reversedText: '逆位的星星提示：你是否有些失去信心，开始怀疑"会不会有好结果"？失望是暂时的，别让一时的阴霾遮住星光。先疗愈自己，希望会重新点亮。', love: '治愈与希望的时刻，相信爱，你的心愿正在一步步靠近。' },
    { id: 18, no: 'XVIII', name: '月亮', en: 'The Moon', upright: ['不确定', '潜意识', '幻象'], reversed: ['真相浮现', '释然', '走出迷雾'], uprightText: '月亮牌代表"迷雾与不确定性"。在感情里，有些话没被说透，有些真相藏在潜意识里，让你看不清全貌。这段时间容易多疑和不安，别急着下结论，也别被表象迷惑，让时间照亮答案。', reversedText: '逆位的月亮提示：迷雾正在散去，真相逐渐浮现。你终于看清了一些事，也许会释然，也许会更清醒。无论答案如何，走出迷雾就是进步。', love: '迷雾中的关系需要耐心，别被表象迷惑，真相会随着时间浮现。' },
    { id: 19, no: 'XIX', name: '太阳', en: 'The Sun', upright: ['喜悦', '成功', '光明'], reversed: ['过度乐观', '延迟', '幸福打折'], uprightText: '太阳牌是趣味卡牌中最明朗的吉兆，代表"纯粹的幸福"。感情正处于阳光灿烂的高光时刻：快乐、坦诚、充满生命力。如果你是单身，这是正缘临近的强烈信号；有伴侣则关系如日中天。', reversedText: '逆位的太阳提示：幸福似乎打了折扣，或者你有些过度乐观、忽略了现实问题。别只盯着美好的一面，把问题处理干净，阳光才能真正照进来。', love: '感情的高光时刻，坦荡快乐，正缘或幸福正在向你靠近。' },
    { id: 20, no: 'XX', name: '审判', en: 'Judgement', upright: ['觉醒', '复活', '新阶段'], reversed: ['自我怀疑', '旧事重提', '逃避'], uprightText: '审判牌代表"觉醒与重生"。在感情里，这是一个回顾与决定的时刻：过去的关系模式被重新审视，你终于看清自己真正想要什么。这是开启感情新阶段的契机，勇敢回应内心的召唤。', reversedText: '逆位的审判提示：你是不是在回避某个重要的决定？或总被旧事牵绊，难以向前？别活在过去的审判里，放下包袱，才能听见内心真实的声音。', love: '觉醒的时刻，审视过去、看清内心，勇敢开启感情的新阶段。' },
    { id: 21, no: 'XXI', name: '世界', en: 'The World', upright: ['圆满', '完成', '达成'], reversed: ['未完成', '停滞', '差一步'], uprightText: '世界牌是趣味卡牌的终章，代表"圆满达成"。在感情里，这是关系修成正果、完满合一的征兆：也许是修成正果，也许是达到前所未有的默契与和谐。你走过了所有关卡，值得一个圆满的答案。', reversedText: '逆位的世界提示：事情似乎"差最后一步"——也许是不敢跨出那一步，也许是某个环节没完成。别在终点前停下，补上最后一块拼图，圆满就在眼前。', love: '关系走向圆满的征兆，你值得一个完满的答案，别在终点前停下。' }
  ];

  var CATEGORY_NAMES = { love: '情感', career: '事业', wealth: '财运', health: '健康', friend: '朋友', family: '家庭' };

  function getDimensionText(card, category, upright) {
    var kws = upright ? card.upright : card.reversed;
    var kw = kws[0] || '';
    var kw2 = kws[1] || '';
    var templates = {
      career: {
        upright: '事业上迎来「' + kw + '」的能量。这意味着你在工作中拥有' + kw2 + '的优势，适合主动出击、把握机会。如果有新项目或晋升机会，现在是行动的好时机。',
        reversed: '事业上需要注意「' + kw + '」的倾向。工作中可能遇到' + kw2 + '的状况，建议稳扎稳打，避免冲动决策，先理清方向再行动。'
      },
      wealth: {
        upright: '财运上出现「' + kw + '」的好兆头。' + kw2 + '的能量有助于进财，可能有意外收入或投资机会。但记得理性理财，别让好运冲昏头脑。',
        reversed: '财运上提醒你警惕「' + kw + '」的风险。近期可能有' + kw2 + '的状况，建议保守理财、避免大额投资或借贷，守住钱包就是赢。'
      },
      health: {
        upright: '健康状态呈现「' + kw + '」的积极信号。身体和精神都处在较好的状态，' + kw2 + '的能量帮助你保持活力。适合建立规律的作息和运动习惯。',
        reversed: '健康方面提醒你关注「' + kw + '」的问题。身体可能发出' + kw2 + '的信号，别忽视疲劳和不适。建议放慢节奏、好好休息。'
      },
      friend: {
        upright: '朋友关系中充满「' + kw + '」的氛围。你和朋友之间有着' + kw2 + '的默契，适合聚会、倾诉、共同成长。这段友谊会给你带来支持和快乐。',
        reversed: '朋友关系中出现「' + kw + '」的状况。可能存在' + kw2 + '的问题，需要坦诚沟通。别让误会积累，主动迈出一步，关系会有转机。'
      },
      family: {
        upright: '家庭关系洋溢着「' + kw + '」的温暖。家人之间' + kw2 + '，是增进感情的好时机。多陪伴家人，表达关心，家庭会成为你最坚实的后盾。',
        reversed: '家庭关系中需要处理「' + kw + '」的问题。可能有' + kw2 + '的摩擦，多些耐心和理解。家是讲爱的地方，退一步海阔天空。'
      }
    };
    if (category === 'love') return card.love;
    var tpl = templates[category];
    if (!tpl) return card.love;
    return upright ? tpl.upright : tpl.reversed;
  }

  // 英文简化版塔罗牌解读
  var TAROT_EN = {
    0: { uprightText: 'A new journey begins. In love, this means pure courage and openness—take that first step without fear.', reversedText: 'Are you overthinking and hesitating? Or using "freedom" as an excuse to avoid commitment? Decide your direction.', love: 'New romance signal. Be brave and take the first step.' },
    1: { uprightText: 'You have all the tools to make things happen—communication, action, sincerity. Now is the time to act.', reversedText: 'Too much planning, too little action. Dont be fooled by empty promises—watch what people do, not what they say.', love: 'Action is key. Turn your feelings into real moves.' },
    2: { uprightText: 'Listen to your inner voice. In relationships, your intuition knows more than your analysis. Wait and observe.', reversedText: 'Are you suppressing your true feelings? Trust your sixth sense—dont be fooled by surface calm.', love: 'Quiet your mind and listen. Your intuition knows the truth.' },
    3: { uprightText: 'Love and abundance surround you. Your magnetism is drawing the right person closer, or your relationship is blooming.', reversedText: 'Are you giving too much and forgetting yourself? Love yourself first, then love others.', love: 'Love yourself first. Your abundance attracts the right person.' },
    4: { uprightText: 'Stability and responsibility. Your relationship is building a solid foundation—commitment and security are growing.', reversedText: 'Is one person too controlling? Learn to be flexible. Replace "my way" with "lets decide together".', love: 'Relationship is maturing. Build on trust and commitment.' },
    5: { uprightText: 'Tradition and commitment. Your relationship is being recognized—meeting family, marriage talks, or blessings from others.', reversedText: 'Are you trapped by "shoulds" and expectations? Ask yourself: do you truly want this, or is it just "the right age"?', love: 'Relationship is being formalized. Take commitment seriously.' },
    6: { uprightText: 'The purest card of love. Mutual connection and devotion. If single, the right person is near. Love is a choice—choose each other.', reversedText: 'Imbalance in the relationship: value clashes, distraction, or outside temptation. Be honest with each other.', love: 'Pure love moment. Choose each other bravely.' },
    7: { uprightText: 'Victory through determination. You can steer your relationship where you want it—confess, repair, break through.', reversedText: 'Emotions or conflicts spiraling out of control. Stabilize yourself first, then decide your direction.', love: 'With determination, you control the outcome. Take charge.' },
    8: { uprightText: 'Strength through gentleness. True power is patient and loving. You can heal conflicts with softness.', reversedText: 'Self-doubt or feeling overwhelmed. Softness is not weakness—allow yourself to be vulnerable.', love: 'Love gently but firmly. Patience resolves conflicts.' },
    9: { uprightText: 'A time for inner reflection. You may need solitude to figure out what you truly want in love.', reversedText: 'Are you isolating yourself for too long? Solitude and avoidance are different. Step out and connect.', love: 'Take time alone to think clearly. The answer is within.' },
    10: { uprightText: 'Luck is turning. A turning point in love—unexpected reunion or important change. Seize the moment.', reversedText: 'Things feel stuck and repetitive. Dont lose heart—the wheel will turn. Avoid big decisions at low points.', love: 'Fate is shifting. Catch the turning point.' },
    11: { uprightText: 'Balance and fairness. What you give comes back. Examine your relationship honestly—is it equal?', reversedText: 'Imbalance or double standards. One gives, one takes. Face the truth—avoidance tilts the scale further.', love: 'Love needs fairness and honesty. What you sow, you reap.' },
    12: { uprightText: 'See things from a new angle. Relationship puzzles may clear when you shift perspective. Pause and wait.', reversedText: 'Pointless delay and sacrifice draining you. If nothing changes after long trying, the direction may be wrong.', love: 'Try a different perspective. Pause may be the breakthrough.' },
    13: { uprightText: 'Endings and rebirth. An unsuitable relationship concludes, or your relationship transforms into something new.', reversedText: 'Are you clinging to a relationship that should end? Fear of change only prolongs pain. Let go to begin anew.', love: 'Let go of what doesnt fit. Endings open new doors.' },
    14: { uprightText: 'The art of "just right". Relationships need patience and balance—not too much, not too little. Find your rhythm.', reversedText: 'Imbalance—one too hot, one too cold. Avoid extremes and rushing. Restore balance for lasting love.', love: 'Love in moderation. Patient harmony lasts longer.' },
    15: { uprightText: 'Chains and obsessions. Are you trapped in an unhealthy attachment, passion over substance, or dependency?', reversedText: 'Breaking free. You are awakening to what binds you and loosening the grip. Liberation is coming.', love: 'See the chains. Dont let unhealthy patterns hold you.' },
    16: { uprightText: 'Sudden upheaval. Truths revealed, hidden issues exploding. Painful, but only false foundations fall—truth remains.', reversedText: 'Crisis temporarily suppressed but still lurking. Dont think you escaped—deal with problems now.', love: 'Sudden change hurts, but truth reveals what truly matters.' },
    17: { uprightText: 'Hope and healing. Whatever happened, now is time for renewal. Love is near, relationships improving.', reversedText: 'Losing faith? Disappointment is temporary. Heal yourself first, and hope returns.', love: 'Healing and hope. Believe in love—your wish is coming true.' },
    18: { uprightText: 'Mystery and uncertainty. Some things unsaid, truths hidden. Dont rush to conclusions—let time reveal.', reversedText: 'Fog is lifting, truth emerging. You finally see things clearly—whether relief or clarity, progress is made.', love: 'Be patient in uncertainty. Truth surfaces with time.' },
    19: { uprightText: 'The brightest card—pure joy. Relationship in its golden age: happy, honest, alive. True love near if single.', reversedText: 'Happiness feels discounted, or you are overly optimistic. Dont ignore real issues—fix them for true sunshine.', love: 'Golden moment. Joy and honesty—true love approaches.' },
    20: { uprightText: 'Awakening and rebirth. A time to review and decide—you finally know what you want. New chapter begins.', reversedText: 'Avoiding an important decision? Or stuck in the past? Let go of baggage to hear your true calling.', love: 'Awakening moment. Review the past and start fresh.' },
    21: { uprightText: 'Completion and fulfillment. Relationship reaching its peak—deep harmony, or commitment fulfilled. You earned this.', reversedText: 'So close yet one step short. Dont stop at the finish line—complete the final piece.', love: 'Fulfillment is near. You deserve a complete answer.' }
  };

  // 英文关键词（22张牌，用于英文分享卡）
  var TAROT_KW_EN = {
    0: { upright: ['New beginning', 'Adventure', 'Innocence'], reversed: ['Recklessness', 'Hesitation', 'Stuck'] },
    1: { upright: ['Creation', 'Action', 'Manifestation'], reversed: ['Procrastination', 'Empty talk', 'Lost direction'] },
    2: { upright: ['Intuition', 'Inner self', 'Observe & wait'], reversed: ['Ignoring intuition', 'Suppressed feelings', 'Surface illusion'] },
    3: { upright: ['Abundance', 'Gentleness', 'Nurture'], reversed: ['Over-giving', 'Dependency', 'Self-neglect'] },
    4: { upright: ['Stability', 'Responsibility', 'Control'], reversed: ['Controlling', 'Stubbornness', 'Insecurity'] },
    5: { upright: ['Tradition', 'Commitment', 'Guidance'], reversed: ['Restriction', 'Rigidity', 'Questioning'] },
    6: { upright: ['Love', 'Union', 'Choice'], reversed: ['Imbalance', 'Temptation', 'Value clash'] },
    7: { upright: ['Victory', 'Determination', 'Direction'], reversed: ['Loss of control', 'Conflict', 'Unclear direction'] },
    8: { upright: ['Gentleness', 'Courage', 'Tolerance'], reversed: ['Self-doubt', 'Weakness', 'Emotional turmoil'] },
    9: { upright: ['Solitude', 'Introspection', 'Seeking answers'], reversed: ['Isolation', 'Avoidance', 'Over-closed'] },
    10: { upright: ['Turning point', 'Opportunity', 'Fate'], reversed: ['Repetition', 'Loss of control', 'Stagnation'] },
    11: { upright: ['Balance', 'Fairness', 'Karma'], reversed: ['Bias', 'Injustice', 'Avoiding responsibility'] },
    12: { upright: ['Perspective', 'Pause', 'Sacrifice'], reversed: ['Delay', 'Futility', 'Stubbornness'] },
    13: { upright: ['Ending', 'Rebirth', 'Transformation'], reversed: ['Resisting change', 'Stagnation', 'Letting go'] },
    14: { upright: ['Harmony', 'Patience', 'Balance'], reversed: ['Imbalance', 'Extremes', 'Impatience'] },
    15: { upright: ['Obsession', 'Bondage', 'Desire'], reversed: ['Breaking free', 'Awakening', 'Liberation'] },
    16: { upright: ['Upheaval', 'Collapse', 'Truth'], reversed: ['Avoidance', 'Delay', 'Aftermath'] },
    17: { upright: ['Hope', 'Healing', 'Wishes'], reversed: ['Disappointment', 'Confusion', 'Loss of faith'] },
    18: { upright: ['Uncertainty', 'Subconscious', 'Illusion'], reversed: ['Truth emerging', 'Clarity', 'Out of fog'] },
    19: { upright: ['Joy', 'Success', 'Brightness'], reversed: ['Over-optimism', 'Delay', 'Dimmed joy'] },
    20: { upright: ['Awakening', 'Rebirth', 'New stage'], reversed: ['Self-doubt', 'Old issues', 'Avoidance'] },
    21: { upright: ['Fulfillment', 'Completion', 'Achievement'], reversed: ['Incomplete', 'Stagnation', 'One step short'] }
  };

  // 英文维度解读
  function getDimensionTextEn(card, category, upright) {
    if (category === 'love') return TAROT_EN[card.id] ? TAROT_EN[card.id].love : card.love;
    var templates = {
      career: { upright: 'Career energy is positive. You have advantages at work—seize opportunities and act now.', reversed: 'Career caution needed. Avoid impulsive decisions. Stabilize and clarify direction first.' },
      wealth: { upright: 'Good financial signs. Opportunities for income may appear. Invest rationally, dont get carried away.', reversed: 'Financial risk alert. Be conservative—avoid large investments or loans. Protect what you have.' },
      health: { upright: 'Positive health signals. Body and mind are in good shape. Build regular routines and exercise.', reversed: 'Health attention needed. Dont ignore fatigue or discomfort. Slow down and rest properly.' },
      friend: { upright: 'Warm friendship atmosphere. Good rapport with friends—gather, share, and grow together.', reversed: 'Friendship issues possible. Communicate honestly. Dont let misunderstandings accumulate.' },
      family: { upright: 'Warm family energy. Good time to bond with family. Show care—family is your strongest support.', reversed: 'Family friction possible. Be patient and understanding. Home is about love, not winning.' }
    };
    var tpl = templates[category];
    if (!tpl) return TAROT_EN[card.id] ? TAROT_EN[card.id].love : card.love;
    return upright ? tpl.upright : tpl.reversed;
  }

  window.TR = { TAROT: TAROT, TAROT_EN: TAROT_EN, TAROT_KW_EN: TAROT_KW_EN, CATEGORY_NAMES: CATEGORY_NAMES, getDimensionText: getDimensionText, getDimensionTextEn: getDimensionTextEn };
})();
