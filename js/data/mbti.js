/**
 * data/mbti.js (Web版)
 * MBTI 16型人格数据 + 配对引擎
 */
(function () {
  var MBTI_TYPES = {
    INTJ: { name: '建筑师', nickname: 'INTJ', trait: '独立思考 · 战略规划', desc: '理性冷静，善于长远规划，追求效率与深度', detail: '你是天生的战略家，喜欢在行动前深思熟虑，制定周密的计划。你的独立思考能力很强，不盲从权威，更相信自己的判断。在工作和学习中，你追求效率和深度，不喜欢无意义的社交和琐碎的事务。你可能给人一种距离感，但熟悉你的人都知道你内心有着坚定的信念和温暖的一面。', strength: '战略思维、独立决断、追求卓越、洞察力强', challenge: '过于理性、容易忽视他人感受、完美主义、不耐烦', growth: '学会表达情感，多倾听他人的想法，允许自己偶尔放松', love: '在感情中慢热但专一，需要精神层面的共鸣' },
    INTP: { name: '逻辑学家', nickname: 'INTP', trait: '思辨好奇 · 创新思维', desc: '思维跳跃，热爱探索抽象概念，追求真理', detail: '你是一个充满好奇心的思想者，对世界充满了探索的欲望。你喜欢分析事物背后的逻辑和原理，常常能发现别人忽略的细节和可能性。你的思维非常活跃，脑子里总是有各种新奇的想法，但有时会因为想太多而迟迟不行动。你享受独处和思考的时光，在自己感兴趣的领域会投入极大的热情。', strength: '逻辑分析、创新思维、求知欲强、客观理性', challenge: '行动力不足、容易钻牛角尖、社交被动、忽视细节', growth: '把想法付诸实践，多关注身边人的情感需求，学会完成比完美更重要', love: '在感情中需要空间，欣赏能理解自己的人' },
    ENTJ: { name: '指挥官', nickname: 'ENTJ', trait: '果断领导 · 目标导向', desc: '天生的领导者，执行力强，追求卓越', detail: '你是天生的领导者，具有强大的决断力和组织能力。你善于制定目标并带领团队高效执行，不喜欢拖泥带水和效率低下的工作方式。你对自己和他人都有很高的要求，追求卓越和成功。在人群中你往往是焦点和决策者，你的自信和魄力能感染身边的人。但要注意，过于强势可能会让身边的人感到压力。', strength: '领导能力、决断力、执行力、战略眼光', challenge: '过于强势、缺乏耐心、忽视情感、工作狂倾向', growth: '学会倾听和授权，多关注团队成员的感受，平衡工作与生活', love: '在感情中主动直接，欣赏独立有想法的伴侣' },
    ENTP: { name: '辩论家', nickname: 'ENTP', trait: '机智幽默 · 思维敏捷', desc: '热爱辩论和新想法，充满创造力和活力', detail: '你是一个充满活力和创造力的人，思维敏捷，能言善辩。你喜欢挑战常规，对新鲜事物充满好奇，总是能提出与众不同的观点和解决方案。你的幽默感和机智让你在社交场合很受欢迎，你享受思想碰撞的乐趣。但有时你会因为太喜欢辩论而无意中伤害到别人，或者因为想法太多而难以坚持完成一件事。', strength: '创新思维、沟通能力、适应力强、知识面广', challenge: '缺乏耐心、容易半途而废、喜欢争辩、不够专注', growth: '学会倾听和接纳不同意见，专注于少数重要的目标，考虑他人感受', love: '在感情中充满趣味，需要智力上的碰撞' },
    INFJ: { name: '提倡者', nickname: 'INFJ', trait: '深邃洞察 · 理想主义', desc: '富有洞察力，追求意义，关心他人成长', detail: '你是一个深邃而理想主义的人，有着强烈的使命感和对意义的追求。你对他人的情绪和需求有着敏锐的洞察力，常常能理解别人没有说出口的想法。你关心他人的成长和幸福，愿意为了更美好的世界而努力。你内心世界丰富，重视深度和真实，不喜欢肤浅的社交。虽然你看起来温和，但内心有着坚定的原则和信念。', strength: '洞察力、同理心、理想主义、深度思考', challenge: '过于敏感、容易内耗、完美主义、过度付出', growth: '学会保护自己的能量，设定边界，接纳不完美', love: '在感情中深情专一，渴望深度连接' },
    INFP: { name: '调停者', nickname: 'INFP', trait: '温柔浪漫 · 价值驱动', desc: '内心丰富，追求真实，富有同情心', detail: '你是一个温柔而浪漫的梦想家，内心世界丰富多彩。你忠于自己的价值观和感受，追求真实和有意义的生活。你对他人有着深切的同情心，善于理解和接纳不同的人。你有着丰富的想象力和创造力，在艺术、文学等领域往往有独特的天赋。你可能看起来安静内向，但熟悉你的人都知道你内心有着炽热的情感和坚定的信念。', strength: '同理心、创造力、真诚善良、忠于自我', challenge: '过于理想化、容易受伤、行动力不足、逃避冲突', growth: '学会面对现实和冲突，把梦想付诸行动，照顾自己的需求', love: '在感情中浪漫理想化，需要被理解和接纳' },
    ENFJ: { name: '主人公', nickname: 'ENFJ', trait: '热情感染力 · 利他主义', desc: '富有魅力，善于激励他人，追求和谐', detail: '你是一个温暖而有魅力的领导者，天生具有感染力和号召力。你善于发现他人的潜力，乐于帮助别人成长和进步。你重视和谐和人际关系，总是努力营造温暖包容的氛围。你的热情和真诚让你很容易赢得他人的信任和喜爱。你有着强烈的责任感和利他精神，常常把他人的需求放在自己前面。但要注意不要因为照顾别人而忽视了自己。', strength: '领导力、同理心、沟通能力、激励他人', challenge: '过度付出、忽视自我、容易受伤、控制欲', growth: '学会照顾自己的需求，接受不能帮助所有人，设定健康边界', love: '在感情中温暖投入，重视彼此的成长' },
    ENFP: { name: '竞选者', nickname: 'ENFP', trait: '热情自由 · 充满想象', desc: '活力四射，热爱自由，富有感染力', detail: '你是一个充满热情和想象力的人，对生活充满了好奇和热爱。你善于发现生活中的美好和可能性，总是能给身边的人带来正能量和惊喜。你的思维跳跃而富有创造力，喜欢探索新事物和新想法。你重视自由和真实，不喜欢被束缚和限制。你的温暖和热情让你很容易交到朋友，但有时也会因为太随性而让人觉得不够稳定。', strength: '热情开朗、创造力、同理心、适应力强', challenge: '注意力分散、情绪化、不够专注、容易焦虑', growth: '学会专注和坚持，管理情绪，落实计划', love: '在感情中热情浪漫，需要新鲜感和空间' },
    ISTJ: { name: '物流师', nickname: 'ISTJ', trait: '踏实可靠 · 责任担当', desc: '严谨务实，重视承诺，做事有条理', detail: '你是一个踏实可靠的人，做事严谨有条理，重视承诺和责任。你喜欢按计划和规则行事，注重细节和效率。你对自己的工作和职责非常认真，总是能按时高质量地完成任务。你不喜欢频繁的变化和冒险，更倾向于稳定有序的生活。虽然你可能不擅长表达情感，但你的行动说明了一切，你是身边人最值得信赖的依靠。', strength: '责任心、可靠稳重、注重细节、执行力强', challenge: '过于保守、固执、不善表达、抗拒变化', growth: '学会接受变化和新事物，多表达自己的感受，灵活应变', love: '在感情中稳定可靠，用行动表达爱意' },
    ISFJ: { name: '守卫者', nickname: 'ISFJ', trait: '温暖细心 · 默默守护', desc: '体贴入微，重视传统，乐于奉献', detail: '你是一个温暖细心的人，善于照顾他人的需求和感受。你重视传统和家庭，乐于为身边的人付出和奉献。你的记忆力很好，能记住别人的喜好和重要的日子，总是在细节处给人温暖。你不喜欢冲突，总是努力维持和谐的氛围。你可能不太善于表达自己的需求，总是把别人放在第一位，但你的温柔和体贴让你成为最让人安心的存在。', strength: '体贴细心、可靠忠诚、有耐心、重视他人', challenge: '过度付出、忽视自我、抗拒变化、过于谦虚', growth: '学会表达自己的需求，接受帮助，适当自私一点', love: '在感情中温柔体贴，把伴侣放在首位' },
    ESTJ: { name: '总经理', nickname: 'ESTJ', trait: '务实组织 · 规则意识', desc: '高效组织，重视秩序，执行力强', detail: '你是一个务实高效的组织者，善于管理和执行。你重视规则和秩序，喜欢按计划行事，对自己和他人都有明确的要求。你有着强烈的责任感和职业道德，总是能把事情安排得井井有条。你不喜欢拖延和低效，遇到问题会迅速采取行动解决。你的果断和干练让你在工作和生活中都很出色，但有时会因为太直接而让人觉得不够温柔。', strength: '组织能力、执行力、责任感、果断决策', challenge: '过于强势、缺乏弹性、忽视情感、固执己见', growth: '学会倾听和灵活变通，关注他人的情感需求，接受不同的做事方式', love: '在感情中认真负责，追求稳定的关系' },
    ESFJ: { name: '执政官', nickname: 'ESFJ', trait: '热心社交 · 关怀他人', desc: '善于社交，重视和谐，乐于助人', detail: '你是一个热心肠的人，善于社交和关心他人。你重视和谐的人际关系，总是努力让身边的人感到温暖和被重视。你有着很强的服务意识，乐于帮助别人，喜欢看到别人开心。你注重传统和仪式感，善于组织活动和照顾大家的需求。你的温暖和周到让你很受欢迎，但有时你会因为太在意别人的看法而忽略了自己的真实感受。', strength: '社交能力、关怀他人、组织能力、忠诚可靠', challenge: '过于在意他人评价、回避冲突、容易受伤、控制欲', growth: '学会关注自己的需求，接受不是所有人都会喜欢你，表达真实想法', love: '在感情中温暖体贴，需要被认可和感激' },
    ISTP: { name: '鉴赏家', nickname: 'ISTP', trait: '冷静灵活 · 动手能力强', desc: '务实冷静，善于解决问题，喜欢自由', detail: '你是一个冷静务实的行动派，善于观察和解决实际问题。你有着很强的动手能力和逻辑思维，喜欢拆解和理解事物的运作原理。你灵活应变，能在危机中保持冷静，迅速找到解决方案。你重视自由和独立，不喜欢被规则和计划束缚。你可能话不多，但你的行动说明了一切，你是一个低调而有实力的人。', strength: '动手能力、冷静理性、适应力强、解决问题', challenge: '不善表达、容易厌倦、回避情感、不够规划', growth: '学会表达情感和想法，做长远规划，多与他人沟通', love: '在感情中低调务实，需要独立空间' },
    ISFP: { name: '探险家', nickname: 'ISFP', trait: '温和艺术 · 活在当下', desc: '敏感细腻，热爱美好，追求和谐', detail: '你是一个温和而有艺术气质的人，对美有着敏锐的感知力。你活在当下，享受生活中的小确幸，不喜欢给自己太大压力。你有着丰富的内心世界和创造力，在艺术、音乐、设计等领域往往有独特的天赋。你温柔善良，不喜欢冲突，总是尽量避免伤害别人。你可能看起来安静随和，但内心有着自己的坚持和原则。', strength: '艺术感知、温柔善良、灵活随和、活在当下', challenge: '过于敏感、回避冲突、缺乏长远规划、容易焦虑', growth: '学会面对冲突，做长远规划，表达自己的真实想法', love: '在感情中温柔体贴，用行动表达爱意' },
    ESTP: { name: '企业家', nickname: 'ESTP', trait: '活力冒险 · 随机应变', desc: '充满活力，热爱冒险，善于应变', detail: '你是一个充满活力和冒险精神的人，喜欢刺激和挑战。你思维敏捷，善于随机应变，能在复杂的情况下迅速做出判断和行动。你热爱生活，享受当下，不喜欢被条条框框束缚。你的自信和魅力让你在社交场合很受欢迎，你善于说服和影响他人。你是行动派，不喜欢空想，遇到问题会立刻动手解决。', strength: '行动力、适应力、社交魅力、危机处理', challenge: '冲动鲁莽、缺乏耐心、忽视长远、容易厌倦', growth: '学会三思而后行，做长远规划，关注他人感受', love: '在感情中热情直接，需要刺激和新鲜感' },
    ESFP: { name: '表演者', nickname: 'ESFP', trait: '热情开朗 · 享受当下', desc: '乐观外向，热爱生活，善于营造氛围', detail: '你是一个天生的表演者，热情开朗，善于营造欢乐的氛围。你热爱生活，享受当下的每一刻，总能发现生活中的乐趣和美好。你善于观察他人的情绪，知道如何让别人开心和放松。你的乐观和感染力让你成为人群中的焦点，有你在的地方总是充满笑声。你不喜欢复杂和抽象的东西，更看重真实的体验和感受。', strength: '热情开朗、社交能力、感染力、实用主义', challenge: '注意力分散、缺乏规划、容易冲动、回避深度', growth: '学会专注和规划，面对严肃的问题，关注长远发展', love: '在感情中热情洋溢，需要快乐和陪伴' }
  };

  function calcMbtiMatch(typeA, typeB) {
    if (!MBTI_TYPES[typeA] || !MBTI_TYPES[typeB]) {
      return { score: 50, tag: '待探索', summary: '请填写有效的MBTI类型', advantage: '', challenge: '' };
    }
    var a = typeA.split('');
    var b = typeB.split('');
    var total = 0;
    var details = [];

    var eiSame = a[0] === b[0];
    var eiScore = eiSame ? 75 : 85;
    total += eiScore;
    details.push({ dim: '能量来源', score: eiScore, text: eiSame ? '同为' + a[0] + '型，节奏一致' : a[0] + '与' + b[0] + '互补，互相吸引' });

    var snSame = a[1] === b[1];
    var snScore = snSame ? 90 : 60;
    total += snScore;
    details.push({ dim: '认知方式', score: snScore, text: snSame ? '同为' + a[1] + '型，理解彼此' : a[1] + '与' + b[1] + '差异，需要换位思考' });

    var tfSame = a[2] === b[2];
    var tfScore = tfSame ? 70 : 85;
    total += tfScore;
    details.push({ dim: '决策方式', score: tfScore, text: tfSame ? '同为' + a[2] + '型，决策逻辑一致' : a[2] + '与' + b[2] + '互补，刚柔并济' });

    var jpSame = a[3] === b[3];
    var jpScore = jpSame ? 75 : 80;
    total += jpScore;
    details.push({ dim: '生活方式', score: jpScore, text: jpSame ? '同为' + a[3] + '型，生活节奏合拍' : a[3] + '与' + b[3] + '互补，动静相宜' });

    var score = Math.round(total / 4);

    var tag = '';
    if (score >= 85) tag = '高度契合';
    else if (score >= 75) tag = '比较匹配';
    else if (score >= 65) tag = '良好互补';
    else if (score >= 55) tag = '需要磨合';
    else tag = '差异较大';

    var typeAInfo = MBTI_TYPES[typeA];
    var typeBInfo = MBTI_TYPES[typeB];

    var summary = typeAInfo.name + '（' + typeA + '）与' + typeBInfo.name + '（' + typeB + '）的组合，' +
      '在' + details.filter(function (d) { return d.score >= 80; }).map(function (d) { return d.dim; }).join('、') + '上尤为契合，' +
      '整体呈现「' + tag + '」的状态。';

    var advantage = details.filter(function (d) { return d.score >= 80; }).map(function (d) { return d.text; }).join('；') || '双方在多个维度上有互补空间';
    var challenge = details.filter(function (d) { return d.score < 70; }).map(function (d) { return d.text; }).join('；') || '没有明显的冲突维度，保持沟通即可';

    return { score: score, tag: tag, summary: summary, advantage: advantage, challenge: challenge, details: details, typeA: typeAInfo, typeB: typeBInfo };
  }

  function calcCombinedMatch(mbtiResult, zodiacPair, animalPair) {
    var finalScore = mbtiResult.score;
    var factors = mbtiResult.details.map(function (d) { return { name: d.dim, score: d.score, weight: 0.25 }; });
    var tag = '';
    if (finalScore >= 85) tag = '高度契合';
    else if (finalScore >= 75) tag = '比较匹配';
    else if (finalScore >= 65) tag = '良好互补';
    else if (finalScore >= 55) tag = '需要磨合';
    else tag = '差异较大';
    return { finalScore: finalScore, tag: tag, factors: factors };
  }

  // 英文简化版解读
  var MBTI_EN = {
    INTJ: { trait: 'Independent · Strategic', desc: 'Rational and calm, values efficiency and depth', detail: 'You are a natural strategist who thinks deeply before acting. You value independence and efficiency, and prefer meaningful work over small talk. You may seem reserved, but those close to you know your warmth and conviction.', strength: 'Strategic thinking, independent, insightful', challenge: 'Too rational, perfectionist, impatient', growth: 'Express emotions more, listen to others', love: 'Slow to warm up but loyal, needs mental connection' },
    INTP: { trait: 'Curious · Innovative', desc: 'Explores abstract ideas, seeks truth', detail: 'You are a curious thinker who loves analyzing logic and patterns. Your mind is always active with new ideas, though you may overthink before acting. You enjoy solitude and deep dives into interests.', strength: 'Logical, creative, objective', challenge: 'Low action, overthinks, socially passive', growth: 'Put ideas into practice, care for others feelings', love: 'Needs space, appreciates understanding partners' },
    ENTJ: { trait: 'Decisive · Goal-oriented', desc: 'Natural leader, strong execution', detail: 'You are a born leader with strong decision-making and organization skills. You set goals and execute efficiently, demanding excellence from yourself and others. Your confidence inspires those around you.', strength: 'Leadership, decisive, strategic', challenge: 'Too dominant, impatient, workaholic', growth: 'Listen more, balance work and life', love: 'Direct and proactive, values independent partners' },
    ENTP: { trait: 'Witty · Creative', desc: 'Loves debate and new ideas', detail: 'You are energetic and creative, with quick thinking and charm. You enjoy challenging conventions and proposing novel solutions. Your humor makes you popular, though you may accidentally offend in debates.', strength: 'Creative, communicative, adaptable', challenge: 'Impatient, easily bored, argumentative', growth: 'Listen to others, focus on key goals', love: 'Fun and playful, needs intellectual spark' },
    INFJ: { trait: 'Insightful · Idealistic', desc: 'Deep understanding, seeks meaning', detail: 'You are deeply idealistic with a strong sense of purpose. You sense others emotions and care about their growth. You value depth and authenticity, and have a rich inner world.', strength: 'Insightful, empathetic, idealistic', challenge: 'Too sensitive, perfectionist, over-giving', growth: 'Protect your energy, set boundaries', love: 'Deep and devoted, craves true connection' },
    INFP: { trait: 'Gentle · Value-driven', desc: 'Rich inner world, seeks authenticity', detail: 'You are a gentle dreamer with a vivid inner world. You stay true to your values and care deeply for others. Creative and imaginative, you often shine in artistic fields.', strength: 'Empathetic, creative, sincere', challenge: 'Too idealistic, avoids conflict, low action', growth: 'Face reality, act on dreams', love: 'Romantic and idealistic, needs acceptance' },
    ENFJ: { trait: 'Warm · Inspiring', desc: 'Charismatic, helps others grow', detail: 'You are a warm and charismatic leader who inspires others. You see potential in people and nurture it. You value harmony and always create inclusive atmospheres.', strength: 'Leadership, empathetic, inspiring', challenge: 'Over-giving, neglects self, controlling', growth: 'Care for yourself, accept limits', love: 'Warm and devoted, values mutual growth' },
    ENFP: { trait: 'Enthusiastic · Imaginative', desc: 'Loves freedom, full of energy', detail: 'You are enthusiastic and imaginative, curious about life. You see possibilities everywhere and bring positivity to others. You value freedom and authenticity above all.', strength: 'Enthusiastic, creative, empathetic', challenge: 'Distracted, emotional, unfocused', growth: 'Stay focused, manage emotions', love: 'Passionate and romantic, needs novelty and space' },
    ISTJ: { trait: 'Reliable · Responsible', desc: 'Practical and organized, keeps promises', detail: 'You are dependable and thorough, following plans and rules carefully. You take responsibilities seriously and always deliver quality work. You prefer stability over constant change.', strength: 'Responsible, reliable, detail-oriented', challenge: 'Too conservative, rigid, reserved', growth: 'Embrace change, express feelings', love: 'Stable and reliable, shows love through actions' },
    ISFJ: { trait: 'Warm · Caring', desc: 'Thoughtful, traditional, devoted', detail: 'You are warm and attentive, skilled at caring for others needs. You value tradition and family, and give selflessly. Your thoughtfulness makes you the most comforting presence.', strength: 'Caring, loyal, patient', challenge: 'Over-giving, resists change, too modest', growth: 'Express your needs, accept help', love: 'Gentle and devoted, puts partner first' },
    ESTJ: { trait: 'Organized · Practical', desc: 'Efficient manager, values order', detail: 'You are a practical organizer who values rules and efficiency. You manage things well and take responsibilities seriously. Your decisiveness makes you effective in work and life.', strength: 'Organized, decisive, responsible', challenge: 'Too rigid, insensitive, stubborn', growth: 'Be flexible, care for feelings', love: 'Serious and committed, seeks stability' },
    ESFJ: { trait: 'Sociable · Caring', desc: 'People-oriented, maintains harmony', detail: 'You are warm and sociable, skilled at making others feel valued. You care deeply about relationships and always help those around you. Your thoughtfulness makes you popular.', strength: 'Sociable, caring, loyal', challenge: 'Too concerned with approval, avoids conflict', growth: 'Focus on your own needs, be honest', love: 'Warm and attentive, needs appreciation' },
    ISTP: { trait: 'Calm · Hands-on', desc: 'Practical problem solver, loves freedom', detail: 'You are a calm and practical doer, skilled at solving real problems. You are handy and logical, and stay cool under pressure. You value freedom and independence.', strength: 'Hands-on, calm, adaptable', challenge: 'Reserved, easily bored, avoids planning', growth: 'Express feelings, plan ahead', love: 'Low-key and practical, needs personal space' },
    ISFP: { trait: 'Artistic · Present', desc: 'Sensitive, loves beauty, harmonious', detail: 'You are gentle and artistic, with a keen sense of beauty. You live in the moment and enjoy lifes small joys. Creative and kind, you shine in artistic pursuits.', strength: 'Artistic, gentle, adaptable', challenge: 'Too sensitive, avoids conflict, no long-term plan', growth: 'Face conflict, plan for future', love: 'Gentle and caring, shows love through actions' },
    ESTP: { trait: 'Energetic · Adventurous', desc: 'Loves excitement, quick thinker', detail: 'You are energetic and adventurous, thriving on challenges. You think fast and adapt quickly in complex situations. Your confidence and charm make you popular in social settings.', strength: 'Action-oriented, adaptable, charismatic', challenge: 'Impulsive, impatient, short-sighted', growth: 'Think before acting, plan long-term', love: 'Passionate and direct, needs excitement' },
    ESFP: { trait: 'Cheerful · Spontaneous', desc: 'Loves life, creates joy', detail: 'You are a natural performer, cheerful and outgoing. You enjoy every moment and find joy everywhere. Your optimism and energy light up any room you enter.', strength: 'Enthusiastic, sociable, practical', challenge: 'Distracted, impulsive, avoids depth', growth: 'Stay focused, face serious matters', love: 'Warm and lively, needs fun and companionship' }
  };

  // 配对维度英文
  var MATCH_EN = {
    dims: { '能量来源': 'Energy', '认知方式': 'Perception', '决策方式': 'Decision', '生活方式': 'Lifestyle' },
    tags: { '高度契合': 'Highly Compatible', '比较匹配': 'Good Match', '良好互补': 'Complementary', '需要磨合': 'Needs Work', '差异较大': 'Different', '待探索': 'To Explore' }
  };

  // 英文配对结果生成
  function buildMatchEn(mr, typeA, typeB) {
    var dimsEn = { '能量来源': 'Energy', '认知方式': 'Perception', '决策方式': 'Decision', '生活方式': 'Lifestyle' };
    var tagsEn = { '高度契合': 'Highly Compatible', '比较匹配': 'Good Match', '良好互补': 'Complementary', '需要磨合': 'Needs Work', '差异较大': 'Different' };
    var detailsEn = mr.details.map(function (d) {
      return { dim: dimsEn[d.dim] || d.dim, score: d.score, text: d.score >= 80 ? 'Strong alignment' : d.score >= 70 ? 'Good balance' : 'Needs understanding' };
    });
    var strongDims = detailsEn.filter(function (d) { return d.score >= 80; }).map(function (d) { return d.dim; });
    var summary = MBTI_EN[typeA] ? MBTI_EN[typeA].trait : typeA;
    summary += ' and ' + (MBTI_EN[typeB] ? MBTI_EN[typeB].trait : typeB);
    summary += ' connect well in ' + (strongDims.join(', ') || 'many areas') + '. Overall: ' + (tagsEn[mr.tag] || mr.tag) + '.';
    var advantage = detailsEn.filter(function (d) { return d.score >= 80; }).map(function (d) { return d.dim + ': ' + d.text; }).join('; ') || 'Complementary in multiple dimensions';
    var challenge = detailsEn.filter(function (d) { return d.score < 70; }).map(function (d) { return d.dim + ': needs patience and communication'; }).join('; ') || 'No major conflicts, keep communicating';
    return { summary: summary, advantage: advantage, challenge: challenge, details: detailsEn, tag: tagsEn[mr.tag] || mr.tag };
  }

  window.MBTI = { MBTI_TYPES: MBTI_TYPES, MBTI_EN: MBTI_EN, MATCH_EN: MATCH_EN, calcMbtiMatch: calcMbtiMatch, calcCombinedMatch: calcCombinedMatch, buildMatchEn: buildMatchEn };
})();
