/**
 * data/zodiac.js (Web版)
 * 星座配对数据：12星座基础信息 + 12×12评分矩阵 + 相位模板 + 精选文案 + 元素生克 + 单星座年度运
 * 依赖 window.YF
 */
(function () {
  var ZODIAC = [
    { key: 'aries', name: '白羊', fullName: '白羊座', date: '3.21-4.19', element: '火', qi: '火', yin: true, ruler: '火星', keywords: ['炽热', '直率', '行动派'], traits: '冲锋型选手，爱就直说，从不藏着掖着。', strength: '热情坦荡、行动力爆表，说走就走，爱意从不迟到。', challenge: '急脾气、耐心余额不足，情绪上头时容易口不择言。', tip: '学会慢半拍，吵架前先深呼吸三秒。', enTraits: 'bold and direct, loves to lead', enStrength: 'passionate, decisive, full of drive', enChallenge: 'impatient and quick-tempered, speaks before thinking', enTip: 'slow down and breathe before you react' },
    { key: 'taurus', name: '金牛', fullName: '金牛座', date: '4.20-5.20', element: '土', qi: '土', yin: false, ruler: '金星', keywords: ['稳定', '踏实', '专一'], traits: '慢热但深情，把爱都藏在行动和细节里。', strength: '极度靠谱，说到做到，是十二星座里最值得托付的"定海神针"。', challenge: '固执起来十头牛拉不动，情绪内敛到对方猜不透。', tip: '心里话别憋着，说出来对方才接得住。', enTraits: 'steady and devoted, loves through actions', enStrength: 'reliable, patient, deeply loyal', enChallenge: 'stubborn, keeps feelings hidden', enTip: 'share your feelings out loud' },
    { key: 'gemini', name: '双子', fullName: '双子座', date: '5.21-6.21', element: '风', qi: '木', yin: true, ruler: '水星', keywords: ['灵动', '好奇', '善谈'], traits: '永远在线的社交达人，脑子里住着一百个话题。', strength: '沟通力天花板，聊天永不冷场，恋爱像一场永远新鲜的派对。', challenge: '心思飘忽、三分钟热度，情绪来得快去得也快。', tip: '该认真时别用玩笑带过，给感情留点"踏实感"。', enTraits: 'lively and curious, the social butterfly', enStrength: 'great communicator, fun and quick-witted', enChallenge: 'restless, loses interest fast', enTip: 'be serious when it really matters' },
    { key: 'cancer', name: '巨蟹', fullName: '巨蟹座', date: '6.22-7.22', element: '水', qi: '水', yin: false, ruler: '月亮', keywords: ['温柔', '念旧', '重情'], traits: '情感细腻的守护者，家和恋人是全世界。', strength: '体贴入微、记性好到可怕，会把你说过的每句话都放在心上。', challenge: '缺乏安全感、容易胡思乱想，情绪一上来就躲进壳里。', tip: '直接表达需求，别让TA猜；给足安全感就稳了。', enTraits: 'gentle and nostalgic, a natural caretaker', enStrength: 'caring, attentive, remembers every detail', enChallenge: 'insecure, over-thinks, retreats into a shell', enTip: 'state your needs directly and clearly' },
    { key: 'leo', name: '狮子', fullName: '狮子座', date: '7.23-8.22', element: '火', qi: '火', yin: true, ruler: '太阳', keywords: ['耀眼', '慷慨', '骄傲'], traits: '天生的聚光灯，大方热烈，爱要爱得轰轰烈烈。', strength: '大方又护短，把最好的一切都捧到你面前，占有欲也全是爱意。', challenge: '面子大过天，吃软不吃硬，被批评容易炸毛。', tip: '给足面子再加糖，顺毛撸比讲道理有用一百倍。', enTraits: 'radiant and generous, loves big and bright', enStrength: 'warm, protective, gives their all', enChallenge: 'prideful, hates losing face', enTip: 'praise first, then gently advise' },
    { key: 'virgo', name: '处女', fullName: '处女座', date: '8.23-9.22', element: '土', qi: '土', yin: false, ruler: '水星', keywords: ['细腻', '认真', '完美'], traits: '细节控+挑剔狂魔，但挑剔的背后全是上心。', strength: '做事周全、条理清晰，把你们的日子安排得明明白白。', challenge: '毒舌属性+完美主义，容易把关心说成嫌弃。', tip: '少挑毛病多夸人，把挑剔换成"我帮你"会甜很多。', enTraits: 'meticulous and detail-oriented, a perfectionist at heart', enStrength: 'organized, thoughtful, plans everything well', enChallenge: 'overly critical, perfectionist streak', enTip: 'praise more and criticize less' },
    { key: 'libra', name: '天秤', fullName: '天秤座', date: '9.23-10.23', element: '风', qi: '木', yin: true, ruler: '金星', keywords: ['优雅', '平衡', '社交'], traits: '天生的端水大师，颜值与情商双在线。', strength: '恋爱氛围感大师，浪漫体贴，把关系处得赏心悦目。', challenge: '选择困难+优柔寡断，关键时刻总想"再想想"。', tip: '关键决定别逃避，你的犹豫会让对方没底。', enTraits: 'elegant and balanced, the natural peacemaker', enStrength: 'charming, romantic, creates harmony', enChallenge: 'indecisive, avoids hard choices', enTip: 'commit when it counts' },
    { key: 'scorpio', name: '天蝎', fullName: '天蝎座', date: '10.24-11.22', element: '水', qi: '水', yin: false, ruler: '冥王星', keywords: ['深情', '神秘', '占有'], traits: '爱得深沉浓烈，眼里容不得一粒沙子。', strength: '极致专注与深情，认定一个人就是一辈子，忠诚度拉满。', challenge: '占有欲和疑心双高，安全感一旦动摇就开启试探模式。', tip: '坦诚是唯一的钥匙，主动报备比解释一万次都管用。', enTraits: 'intense and mysterious, loves with depth', enStrength: 'focused, loyal, all-in when committed', enChallenge: 'possessive and jealous, tests trust', enTip: 'be open and honest, always' },
    { key: 'sagittarius', name: '射手', fullName: '射手座', date: '11.23-12.21', element: '火', qi: '火', yin: true, ruler: '木星', keywords: ['自由', '乐观', '洒脱'], traits: '追风少年，快乐至上，爱玩也懂浪漫。', strength: '乐观感染力MAX，跟他在一起永远不闷，日子像冒险。', challenge: '自由至上，最怕被管；承诺来得快也容易飘。', tip: '给足空间反而抓得更牢，一起玩比盯人有效。', enTraits: 'free-spirited and optimistic, loves adventure', enStrength: 'fun, inspiring, never boring', enChallenge: 'fears being tied down, makes light promises', enTip: 'give space to keep them close' },
    { key: 'capricorn', name: '摩羯', fullName: '摩羯座', date: '12.22-1.19', element: '土', qi: '土', yin: false, ruler: '土星', keywords: ['务实', '坚韧', '责任'], traits: '人间清醒努力家，爱是责任也是长期主义。', strength: '可靠到可以托付终身，把未来规划得清清楚楚，行动胜过情话。', challenge: '情感表达短路，恋爱谈得像做项目，缺一点浪漫温度。', tip: '偶尔放下"正事"，说句情话真的不会掉肉。', enTraits: 'practical and resilient, loves with responsibility', enStrength: 'reliable, plans a solid future', enChallenge: 'emotionally reserved, too serious', enTip: 'a sweet word now and then goes a long way' },
    { key: 'aquarius', name: '水瓶', fullName: '水瓶座', date: '1.20-2.18', element: '风', qi: '木', yin: true, ruler: '天王星', keywords: ['独特', '理性', '创新'], traits: '外星人本星，思维清奇，爱自由也爱灵魂共鸣。', strength: '思想独立、灵魂有趣，能给感情带来别人给不了的新鲜感。', challenge: '忽冷忽热、理性过头，情绪价值输出全靠心情。', tip: '别用"讲道理"代替"哄"，该走心时请走心。', enTraits: 'unique and rational, a free thinker', enStrength: 'independent, original, fascinating mind', enChallenge: 'distant, overly logical, hot and cold', enTip: 'show warmth, not just logic' },
    { key: 'pisces', name: '双鱼', fullName: '双鱼座', date: '2.19-3.20', element: '水', qi: '水', yin: false, ruler: '海王星', keywords: ['浪漫', '感性', '共情'], traits: '梦幻造梦家，共情力爆表，把恋爱过成童话。', strength: '温柔浪漫天花板，情绪感知力强，最懂怎么温暖人心。', challenge: '太感性易内耗，遇到问题容易逃避躲进幻想里。', tip: '落地一点，把童话放进现实里才走得远。', enTraits: 'romantic and empathetic, a dreamer at heart', enStrength: 'gentle, intuitive, deeply caring', enChallenge: 'overly sensitive, escapes into fantasy', enTip: 'keep dreams grounded in reality' }
  ];

  var MATRIX = [
    [88, 64, 76, 54, 84, 58, 70, 58, 84, 54, 76, 64],
    [64, 88, 64, 76, 54, 84, 58, 70, 58, 84, 54, 76],
    [76, 64, 88, 64, 76, 54, 84, 58, 70, 58, 84, 54],
    [54, 76, 64, 88, 64, 76, 54, 84, 58, 70, 58, 84],
    [84, 54, 76, 64, 88, 64, 76, 54, 84, 58, 70, 58],
    [58, 84, 54, 76, 64, 88, 64, 76, 54, 84, 58, 70],
    [70, 58, 84, 54, 76, 64, 88, 64, 76, 54, 84, 58],
    [58, 70, 58, 84, 54, 76, 64, 88, 64, 76, 54, 84],
    [84, 58, 70, 58, 84, 54, 76, 64, 88, 64, 76, 54],
    [54, 84, 58, 70, 58, 84, 54, 76, 64, 88, 64, 76],
    [76, 54, 84, 58, 70, 58, 84, 54, 76, 64, 88, 64],
    [64, 76, 54, 84, 58, 70, 58, 84, 54, 76, 64, 88]
  ];

  var PHASE = {
    same:     { add: 38, name: '镜像型',     score: 88, radar: [88, 82, 92, 85, 86], title: '灵魂伴侣', tag: '🔥 灵魂伴侣' },
    trine:    { add: 34, name: '灵魂同频',   score: 84, radar: [82, 85, 90, 78, 84], title: '高甜组合', tag: '💞 高甜组合' },
    sextile:  { add: 26, name: '和谐互补',   score: 76, radar: [75, 80, 76, 68, 82], title: '高甜组合', tag: '💞 高甜组合' },
    opposite: { add: 20, name: '致命吸引',   score: 70, radar: [90, 65, 68, 92, 58], title: '高甜组合', tag: '💞 高甜组合' },
    adjacent: { add: 14, name: '温和陪伴',   score: 64, radar: [68, 72, 66, 58, 74], title: '互补磨合', tag: '🌗 互补磨合' },
    quincunx: { add: 8,  name: '需要经营',   score: 58, radar: [65, 58, 56, 72, 55], title: '互补磨合', tag: '🌗 互补磨合' },
    square:   { add: 4,  name: '火花恋人',   score: 54, radar: [72, 48, 46, 82, 45], title: '火花恋人', tag: '⚡ 火花恋人' }
  };

  var DIST_TO_PHASE = ['same', 'adjacent', 'sextile', 'square', 'trine', 'quincunx', 'opposite'];

  var PHASE_COPY = {
    same: { comboName: '{AN}与{BN} · 镜中知己', summary: '你们像彼此的一面镜子，同频到不需要解释就能懂对方，是十二星座里最"知己"的组合。', keywords: ['同频共振', '默契满格', '互相成就'], advantage: '同样的星座意味着同样的底牌：你们对爱情的需求、节奏、仪式感几乎严丝合缝。{AN}的{AK}，遇上{BN}的{BK}，像两个齿轮咬合得刚刚好，相处起来毫不费力。', challenge: '镜子也有盲区——太像的两个人，缺点也会加倍放大。当你们同时任性、同时沉默、同时钻牛角尖，谁都不愿先低头时，就会卡在原地。', tips: ['情绪同步时也要记得"谁先示弱谁赢"', '定期制造一点不同频的新鲜感', '把对方当成"另一个自己"来包容'], future: '今年是你们关系"升级年"：本季度同频感最强，适合共同规划未来；下半年注意在琐碎日常里为感情充电，年末会有一次关系质的飞跃。' },
    trine: { comboName: '{AN}×{BN} · 灵魂同频', summary: '你们属于同一元素的灵魂共鸣，像两条溪流自然汇入同一条河，顺畅得让人羡慕。', keywords: ['灵魂共鸣', '顺其自然', '互相滋养'], advantage: '同为{AE}象星座，你们的价值观、生活方式、对感情的理解高度同频。{AN}的{AK}与{BN}的{BK}相互映照，在一起的每一天都像顺水行舟，舒服又安心。', challenge: '太顺畅的组合容易"舒适区化"——没有风浪也就少了激情。习惯了彼此的好，反而容易忽略经营，让日子变得平淡如水。', tips: ['主动制造"惊喜按钮"，别让舒适变成麻木', '把感谢说出口，别觉得理所当然', '共同培养一个新爱好，保持一起成长'], future: '今年是你们的"滋养年"：本季度关系平稳升温，适合见家长、谈长远；下半年一起搞点事情（旅行/副业/学习），感情会随之再上一个台阶。' },
    sextile: { comboName: '{AN}×{BN} · 和谐互补', summary: '你们是"刚刚好"的互补组合，一个填一个的空，在一起有种莫名的合拍。', keywords: ['优势互补', '相得益彰', '轻松愉快'], advantage: '{AN}的{AK}正好补上{BN}缺的那一块，{BN}的{BK}又恰好戳中{AN}的心。你们像拼图的两块，独立时各自精彩，拼在一起完整又好看，相处氛围轻松愉快。', challenge: '互补的另一面是"依赖惯性"——习惯了对方补位，容易把差异变成"你应该懂我"，当对方偶尔掉线，就会感到失落。', tips: ['感谢彼此的差异，别把"不同"当缺点', '保持各自的独立空间，别过度捆绑', '出现分歧先站到对方角度看问题'], future: '今年是你们的"协作年"：本季度合作默契度高，适合一起推进共同目标；下半年注意别因忙碌忽略情感互动，周末的二人时光要守住。' },
    opposite: { comboName: '{AN}×{BN} · 致命吸引', summary: '你们是宇宙里的两极，截然相反却又被彼此强烈吸引，是十二星座里最"上头"的组合。', keywords: ['致命吸引', '火花四溅', '宿命感'], advantage: '一个{AE}象、一个{BE}象，你们身上有对方最渴望却最缺乏的特质。{AN}的{AK}遇上{BN}的{BK}，像磁铁两极，越是不同越是想靠近，爱情浓度极高。', challenge: '致命的吸引力往往也伴随致命的碰撞。价值观的冲突、节奏的错位会让你们相爱相杀，情绪剧烈起伏，需要极强的包容力才能稳住。', tips: ['把"他为什么这样"换成"他本来就是这样"', '约定情绪降温机制，别在气头上做决定', '共同明确核心原则，其余小事别较真'], future: '今年是你们的"考验年"：本季度吸引力爆棚，感情升温快但也容易引爆矛盾；下半年有一次重要磨合，熬过去就是深度绑定，熬不过去就成陌路。' },
    adjacent: { comboName: '{AN}×{BN} · 温和陪伴', summary: '你们是细水长流的组合，没有惊天动地，却有恰到好处的温暖陪伴。', keywords: ['细水长流', '温柔以待', '慢慢来'], advantage: '相邻星座的你们，性格里有相似的底色又有微妙的差异。{AN}的{AK}与{BN}的{BK}相处起来自然不设防，是那种"在一起就很安心"的平淡浪漫。', challenge: '太"温和"的组合容易缺火花——习惯成自然之后，激情容易被日常吞没，爱情慢慢变成"习惯"，少了心动的仪式感。', tips: ['定期安排"约会日"，给平淡加点糖', '学会直接表达爱意，别把心动藏在心里', '偶尔一起突破舒适区，制造共同记忆'], future: '今年是你们的"沉淀年"：本季度关系稳中有升，适合把感情落到实处；下半年注意别让工作/忙碌稀释了陪伴，用心经营就能细水长流。' },
    quincunx: { comboName: '{AN}×{BN} · 需要经营', summary: '你们是"需要磨合"的组合，节奏不太一致，但经营好了反而能碰撞出惊喜。', keywords: ['差异碰撞', '磨合成长', '越懂越爱'], advantage: '{AN}的{AK}和{BN}的{BK}风格迥异，初期会有些"对不上频道"，但正因如此，你们能带给彼此完全不同的视角和体验，磨合后往往更懂珍惜。', challenge: '你们的情绪节奏、表达方式差异较大，一个想要热烈回应时，另一个可能在慢热思考。沟通若不到位，容易积累"你没那么在乎我"的误会。', tips: ['明确彼此的表达方式，建立"翻译机制"', '情绪不同步时，先接纳差异再谈对错', '为关系设定共同目标，让磨合有方向'], future: '今年是你们的"磨合年"：本季度会有几次小摩擦，别灰心，这是互相理解的必经之路；下半年彼此默契度明显提升，感情会进入更成熟的阶段。' },
    square: { comboName: '{AN}×{BN} · 火花恋人', summary: '你们是"相爱相杀"的高能组合，火花四溅，激情与张力并存，爱得轰轰烈烈。', keywords: ['火花四溅', '张力十足', '轰轰烈烈'], advantage: '90°刑相位的你们，天生带着"不服输"的吸引力。{AN}的{AK}挑战着{BN}的{BK}，彼此较劲又彼此欣赏，感情里从不缺戏剧性和新鲜感。', challenge: '你们的相处像过山车：上头时爱到骨子里，争执时也针尖对麦芒。性格的棱角互相碰撞，情绪管理不到位就很容易两败俱伤。', tips: ['情绪上头先各自冷静，别硬碰硬', '把"你对我错"改成"我们怎么解决"', '多用肢体语言破冰，拥抱比讲道理有效'], future: '今年是你们的"激情年"：本季度火花不断，感情浓度极高；下半年注意别让较劲变成消耗，学会把张力转化为默契，关系会更上一层楼。' }
  };

  var SEASON = {
    火: { yearWord: '炽热绽放', q1: '本季度热情高涨，是主动出击、确认关系的黄金期，大胆表达你的心意。', q2: '第二季度火候稍缓，适合一起规划未来、落实承诺，别让热情只停留在嘴上。', q3: '第三季度适合一起外出探索，旅行或尝试新事物能点燃新激情，感情随之升温。', q4: '年末迎来高光时刻，适合见家长、谈婚论嫁，或一起迎接某个重要的共同节点。' },
    土: { yearWord: '深耕稳固', q1: '本季度关系进入务实期，适合共同规划财务与生活细节，把爱落到实处。', q2: '第二季度适合见家长、谈长远，你们的感情会在现实考验中变得更扎实。', q3: '第三季度注意别被工作淹没，多留二人时光，感情需要主动"浇水施肥"。', q4: '年末收获期，共同的目标初见成果，关系在安稳中进一步升温。' },
    风: { yearWord: '灵感流动', q1: '本季度思维火花多，沟通顺畅，适合深入谈心、解决历史遗留问题。', q2: '第二季度社交活跃，一起参加活动或认识新朋友，能为感情注入新鲜空气。', q3: '第三季度注意别"聊太多做太少"，把计划落实到行动上，感情才不走空。', q4: '年末适合共同学习、一起做一件事，精神同频会让你们更亲密。' },
    水: { yearWord: '深情涌动', q1: '本季度情绪浓度高，共情力在线，是修复关系、加深羁绊的好时机。', q2: '第二季度注意情绪内耗，有不安就坦诚沟通，别让猜疑发酵。', q3: '第三季度浪漫指数上升，适合制造仪式感，重温初识的心动。', q4: '年末感情进入更深阶段，适合表达承诺、规划更远的未来。' }
  };

  var FEATURED = {
    '0-4': { comboName: '烈焰燎原', score: 84, summary: '你们像两团火相遇，热烈得能点燃整片夜空。', keywords: ['炽热', '义气', '耀眼'], advantage: '同属火象，一个冲锋陷阵、一个聚光灯下，你们是彼此最忠实的啦啦队；默契高到不用开口就知道对方想玩什么，日子过得像连播的冒险电影。', challenge: '火遇火，容易从"一起疯"变成"一起炸"——好胜心对撞时，谁都不肯先低头，一句气话能烧掉三天的好心情。', tips: ['吵架前先喊停30分钟，让肾上腺素退潮', '把"谁对谁错"换成"我们怎么赢"', '每周留一天纯粹玩，别谈正事'], future: '今年关键词「破晓」：本季度热度不减，是确认关系/升温的好时机；下半年注意忙起来时别把对方冷落在队伍后面，年末会有一次把感情推进一步的契机。' },
    '1-7': { comboName: '深海与磐石', score: 70, summary: '一个把爱藏在行动里，一个把爱藏在眼神里，沉默对沉默，却暗流汹涌。', keywords: ['占有', '忠诚', '暗涌'], advantage: '你们是十二宫里最"稳"和最"深"的组合，天蝎的洞察遇上金牛的可靠，会产生一种外人看不懂、彼此却很安心的极致占有式浪漫。', challenge: '一个不愿说、一个不愿猜，误会全闷在心里发酵；安全感一旦动摇，天蝎会试探，金牛会冷战，局面容易僵成冰面。', tips: ['建立"每日10分钟真心话"雷打不动', '吃醋了直接说，别让对方猜谜', '金牛多表达一句"我爱你"，抵得过十次行动'], future: '今年关键词「破冰」：本季度关系进入深度磨合期，适合谈清楚未来规划；下半年有一次信任考验，挺过去感情会进入新浓度。' },
    '2-6': { comboName: '双翼共舞', score: 84, summary: '两个风象人凑在一起，就是一场永远聊不完的新鲜派对。', keywords: ['智性恋', '好玩', '自由'], advantage: '沟通力是全场最高组合，聊文学聊八卦聊宇宙都能接住彼此；你们尊重对方的社交圈和自由，恋爱谈得像知己加恋人的双重身份，轻松不腻。', challenge: '风太自由，容易飘——双方都太"讲道理"时，反而少了情绪落地，遇到该走心的事会用玩笑带过，久了会缺一点"踏实感"。', tips: ['定期制造"二人专属话题"维持新鲜感', '别用幽默回避严肃问题，该认真时请认真', '一起定个共同小目标，把风聚成方向'], future: '今年关键词「翱翔」：本季度社交活跃、感情氛围轻松，适合一起出去玩；下半年注意收心，把"聊得来"升级成"靠得住"，会有惊喜。' },
    '0-6': { comboName: '风火交融', score: 70, summary: '一个敢爱敢闯，一个优雅从容，你们是彼此世界里最亮的那道光。', keywords: ['互补', '魅力', '进阶'], advantage: '白羊的冲动配上火向的感染力，天秤的优雅调和出更好的节奏——你们在一起，一个负责点燃，一个负责照亮，化学反应强烈又好看。', challenge: '白羊要的是即刻回应，天秤要的是权衡再三，节奏差容易让小误会升级；白羊嫌天秤磨叽，天秤嫌白羊鲁莽。', tips: ['给彼此"不同的回应速度"留出空间', '白羊学会等一等，天秤学会拍板', '一起出席社交场合是你们的加分项'], future: '今年关键词「进阶」：本季度吸引力强，适合确立关系；下半年一起搞定一件"正经事"，感情会更稳固。' },
    '3-9': { comboName: '港湾与灯塔', score: 70, summary: '巨蟹的温柔遇上摩羯的担当，一个给家，一个给未来，踏实得刚刚好。', keywords: ['守护', '责任', '长久'], advantage: '这是十二星座里最"过日子"的组合之一：巨蟹提供情绪港湾，摩羯提供现实靠山，一个主内一个主外，分工默契得像天作之合。', challenge: '巨蟹需要随时随地的情绪回应，摩羯却习惯先解决问题再谈感受，一个觉得被冷落，一个觉得太黏人。', tips: ['摩羯主动说"我在乎你"，巨蟹给摩羯处理空间', '情绪和事情分开谈，先安抚再讲理', '一起做长期规划，让安全感有落点'], future: '今年关键词「筑巢」：本季度适合见家长、谈婚论嫁；下半年注意平衡工作与陪伴，年末会有关系升级的重大进展。' },
    '4-8': { comboName: '双火同燃', score: 84, summary: '两团火凑一起，就是一场声势浩大的爱情宣言，热烈、坦荡、所向披靡。', keywords: ['热烈', '坦荡', '同频'], advantage: '同为火象，你们对爱情的态度一拍即合：喜欢就追，爱就大声说。相处起来没有弯弯绕绕，是朋友恋人一体的高配组合。', challenge: '都太要强，都爱面子，一旦较劲谁也不让谁，容易把甜蜜变成"赛场"。', tips: ['轮流当"先低头"的那个人', '把胜负欲用在共同目标上', '别在公共场合互踩，给足彼此面子'], future: '今年关键词「驰骋」：本季度感情火力全开；下半年一起搞事业或旅行，能让感情更上一层楼。' },
    '7-11': { comboName: '深水密语', score: 58, summary: '一个深情到极致，一个浪漫到梦幻，你们的关系需要慢慢品、细细养。', keywords: ['深邃', '幻梦', '疗愈'], advantage: '天蝎的专注遇上双鱼的温柔，会产生一种极致的浪漫磁场：一个给深沉的爱，一个给温柔的梦，精神层面的共鸣非常深刻。', challenge: '两个水象都太敏感，情绪一叠加就容易上演"内心戏"；一个试探一个逃避，误会容易在沉默中发酵。', tips: ['把心里的戏说出来，别让对方猜', '约定"今日事今日毕"，情绪不过夜', '一起做点创作类的事，把感性变成作品'], future: '今年关键词「深潜」：本季度精神共鸣强，适合深聊和共同创作；下半年注意情绪管理，把敏感转化为共情，感情会更深。' }
  };

  function elementRel(ea, eb) {
    if (ea === eb) return 'same';
    var pair = [ea, eb].sort().join('');
    if (pair === '木火') return 'sheng';
    if (pair === '土水') return 'sheng';
    if (pair === '土火') return 'cheng';
    if (pair === '木水') return 'cheng';
    if (pair === '水火') return 'chong';
    return 'hao';
  }

  var ELEMENT_REL_TEXT = {
    same: { name: '比和共鸣', dao: '同气相求，万物并生。两股同源之气相合，如双木成林、双水合流，彼此成就，是谓得道之合。', star: '元素同频，能量场天然共振，相处毫不费力，是性格意义上的"舒适圈"组合。' },
    sheng: { name: '相生相济', dao: '相生相济，气机流通。此缘得天地生养之气，一者生发、一者承纳，顺遂之象，堪称美配。', star: '元素互为"燃料与舞台"：火借风势、土容水润，能量自然流通，感情顺水行舟。' },
    cheng: { name: '相成相铸', dao: '相成相铸，如窑火炼土。彼此在磨合中锻造，经火淬而愈坚，此缘虽需经营，成则贵。', star: '元素彼此"锻造"：火暖土以成器、水载木以成舟，差异化为互补，磨合后默契深厚。' },
    chong: { name: '相冲相激', dao: '水火相冲，气有争衡。此缘张力极强，如冰火相煎，需以柔克刚、以静制动，方能化冲为合、转危为安。', star: '元素相克（水火不容），激情与冲突并存，是"虐恋"高发组合，考验定力与包容。' },
    hao: { name: '相耗相蚀', dao: '木土相耗，气有散逸。此缘需各自守住心神，以诚补耗、以信立根，方能聚气成势，得见长久。', star: '元素相耗（风蚀土），能量容易互相"消耗"，需刻意经营，避免热情被日常磨损。' }
  };

  function yinYangText(ya, yb) {
    if (ya === yb) {
      return '同气同源，如日月并明，热烈深刻；然同极相斥，需留白透气，防过犹不及。';
    }
    return '孤阴不生，独阳不长。你二人一阴一阳、刚柔相济，乃合道之配，阴阳和则百事顺。';
  }

  function buildTao(me, ta) {
    var rel = elementRel(me.qi, ta.qi);
    var rt = ELEMENT_REL_TEXT[rel];
    return {
      qiA: me.qi, qiB: ta.qi, elementName: rt.name,
      dao: rt.dao, star: rt.star, yinText: yinYangText(me.yin, ta.yin)
    };
  }

  var ELEMENT_TAO = {
    火: '心若向阳，无惧忧伤；情如火候，贵在持中，过烈则焚，适度则暖。',
    土: '厚德载物，静水流深；情以诚立，爱以恒久，不争而天下莫能与之争。',
    木: '风过无痕，随缘而安；情如春木，向阳而生，顺其自然，方得自在。',
    水: '上善若水，水善利万物而不争；情深不寿，慧极必伤，贵在中和守常。'
  };
  var ELEMENT_SEASON = {
    火: '春夏是你们的气运旺季，宜主动出击、大胆表白；秋冬宜守成滋养，别在疲态时做重大决定。',
    土: '四季皆宜稳步深耕，春末夏初是播种良机；秋冬宜把关系落到现实，谈规划、见家人。',
    木: '春季生发之气最旺，是开拓新缘、推进关系的上佳时节；秋季宜收心沉淀，把"飘"变成"定"。',
    水: '秋冬水气充盈，是交心深谈、感情升温的好时节；春夏防情绪波动，别让敏感发酵成猜忌。'
  };

  function getSingleZodiacFortune(idx, year) {
    var me = ZODIAC[idx];
    var yf = window.YF;
    var gz = yf.getGanZhi(year);
    var infl = yf.getYearInfluence(me.qi, year);
    return {
      title: gz.year + '年' + gz.ganZhi + '年 · ' + me.fullName + '情感状态',
      name: me.fullName, element: me.element, qi: me.qi, ruler: me.ruler,
      theme: '『' + me.keywords[0] + ' · ' + me.keywords[1] + '』' + me.traits,
      inflTag: infl.tag, inflTao: infl.tao, inflStar: infl.star,
      season: ELEMENT_SEASON[me.qi], tao: ELEMENT_TAO[me.qi],
      star: '守护星' + me.ruler + '照临你的情感宫位，' + me.fullName + '的' + me.keywords[0] + '气质在' + gz.ganZhi + '年会被放大，把握住自己的节奏，爱自然会流向你。'
    };
  }

  function getPhaseType(i, j) {
    var dist = Math.min(Math.abs(i - j), 12 - Math.abs(i - j));
    return DIST_TO_PHASE[dist];
  }

  function resolveYear(year) {
    var thisYear = new Date().getFullYear();
    if (year === 'next') return thisYear + 1;
    if (typeof year === 'number') return year;
    return thisYear;
  }

  // 星座元素 -> 五行（用于年度流年生克判断；风象传统归木）
  var ELEM_FIVE = { 火: '火', 土: '土', 风: '木', 水: '水' };

  // 按年份 + 双方星座 + 双方属相 生成差异化季度运势
  function buildSeasons(me, ta, yearNum, myAnimal, taAnimal) {
    var base = SEASON[me.element];
    var gz = window.YF.getGanZhi(yearNum);
    var infl = window.YF.getYearInfluence(ELEM_FIVE[me.element] || me.element, yearNum) || { tag: '流年平和', rel: 'same' };
    var yf = window.YF.getYearFortune(yearNum) || { theme: '情缘流转' };
    var up = (infl.rel === 'a_sheng_b' || infl.rel === 'same') ? '顺势而为' : '稳中求进';
    var mA = myAnimal || gz.animal, tA = taAnimal || gz.animal;
    var head = me.name + '·' + mA + ' × ' + ta.name + '·' + tA;
    return {
      yearWord: base.yearWord + ' · ' + gz.ganZhi + '年',
      seasons: [
        head + ' 在' + gz.ganZhi + '年（' + gz.animal + '年），年度基调「' + yf.theme + '」。开季' + infl.tag + '，' + base.q1,
        base.q2 + ' ' + gz.animal + '年气场延续，此季宜' + up + '，别让心意停在嘴边。',
        base.q3 + ' 年度中期' + infl.tag + '，第三季度宜把浪漫落到日常。',
        base.q4 + ' ' + gz.ganZhi + '年收官，' + up + '收束，年末宜兑现承诺、共赴来年。'
      ]
    };
  }

  function generateCopy(i, j, phaseKey, p1, p2) {
    var tpl = PHASE_COPY[phaseKey];
    var rep = function (s) {
      return s
        .replace(/\{AN\}/g, p1.name).replace(/\{BN\}/g, p2.name)
        .replace(/\{AK\}/g, p1.keywords[0]).replace(/\{BK\}/g, p2.keywords[0])
        .replace(/\{AE\}/g, p1.element).replace(/\{BE\}/g, p2.element);
    };
    return {
      comboName: rep(tpl.comboName), summary: rep(tpl.summary),
      keywords: tpl.keywords, advantage: rep(tpl.advantage), challenge: rep(tpl.challenge),
      tips: tpl.tips, future: rep(tpl.future)
    };
  }

  function getMatch(myIdx, taIdx, year, myAnimal, taAnimal) {
    year = year || 'this';
    var me = ZODIAC[myIdx];
    var ta = ZODIAC[taIdx];
    var score = MATRIX[taIdx][myIdx];
    var phaseKey = getPhaseType(myIdx, taIdx);
    var phase = PHASE[phaseKey];

    var featuredKey = myIdx + '-' + taIdx;
    var copy = FEATURED[featuredKey];
    var isFeatured = !!copy;
    if (!copy) {
      copy = generateCopy(myIdx, taIdx, phaseKey, me, ta);
    }
    copy.score = score;

    var yearNum = resolveYear(year);
    var seasonInfo = buildSeasons(me, ta, yearNum, myAnimal, taAnimal);
    var future = copy.future || (seasonInfo.seasons[0] + seasonInfo.seasons[3]);

    var level = score >= 84 ? PHASE.same.title : score >= 70 ? '高甜组合' : score >= 58 ? '互补磨合' : '火花恋人';
    var levelTag = score >= 84 ? PHASE.same.tag : score >= 70 ? PHASE.sextile.tag : score >= 58 ? PHASE.adjacent.tag : PHASE.square.tag;

    return {
      me: { name: me.name, fullName: me.fullName, element: me.element, qi: me.qi, yin: me.yin, ruler: me.ruler, keywords: me.keywords },
      ta: { name: ta.name, fullName: ta.fullName, element: ta.element, qi: ta.qi, yin: ta.yin, ruler: ta.ruler, keywords: ta.keywords },
      score: score, phaseName: phase.name, level: level, levelTag: levelTag,
      radar: phase.radar, radarLabels: ['浪漫', '沟通', '默契', '激情', '稳定'],
      year: yearNum, yearWord: seasonInfo.yearWord, seasons: seasonInfo.seasons,
      copy: copy, isFeatured: isFeatured, tao: buildTao(me, ta)
    };
  }

  window.ZD = {
    ZODIAC: ZODIAC, MATRIX: MATRIX, PHASE: PHASE, SEASON: SEASON, FEATURED: FEATURED,
    getMatch: getMatch, getPhaseType: getPhaseType, elementRel: elementRel,
    buildTao: buildTao, getSingleZodiacFortune: getSingleZodiacFortune
  };
})();
