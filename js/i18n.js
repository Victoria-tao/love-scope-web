/**
 * i18n.js — 中英双语字典
 * 用法：App.t('中文') — 中文模式返回原文，英文模式返回英文，查不到返回原文
 */
(function () {
  var DICT = {
    // ===== 通用 =====
    '首页': 'Home',
    '仅供娱乐参考': 'For Entertainment Only',
    '性格契合度': 'Personality Compatibility',
    '页面渲染出错': 'Page render error',
    '页面不存在': 'Page not found',

    // ===== 首页 =====
    '心灵契合': 'Soul Connection',
    '星座 · 属相 · 性格匹配': 'Zodiac · Animal · Personality Match',
    '分析两个人的相处模式与沟通建议': 'Analyze relationship dynamics & communication',
    '情感配对': 'Love Match',
    '星座 · 属相 · 出生信息': 'Zodiac · Animal · Birth Info',
    '双人缘分 & 个人年度状态': 'Couple Match & Personal Year',
    '趣味卡牌': 'Fun Cards',
    '6大方向自由选 · 抽1张或3张': '6 themes · Draw 1 or 3',
    '探索你的当下状态': 'Explore your current state',
    '性格速配': 'Quick Match',
    'MBTI 双人匹配': 'MBTI Couple Match',
    '读懂你们的相处模式': 'Understand your dynamic',
    '个人解读': 'Personal Reading',
    'MBTI 深度解析': 'In-depth MBTI Analysis',
    '每日日历': 'Daily Calendar',
    '黄历 · 星座 · 属相': 'Almanac · Zodiac · Animal',
    'MBTI 测试': 'MBTI Test',
    '16道题测人格': '16-question personality test',
    '关于本应用': 'About',
    '语言': 'Language',
    '星座、属相、生日、性格——从多个维度解读两个人的相处模式与沟通建议。全部内容仅供娱乐参考，帮助你在轻松中多一些自我了解与彼此理解。': 'Zodiac, animal, birthday, personality — multi-dimensional insights into relationship dynamics & communication. All content is for entertainment only.',

    // ===== matching =====
    '情感契合度分析': 'Love Compatibility Analysis',
    '星座 · 属相 · 出生信息，任意填写一项即可查看契合度': 'Fill any one field to see compatibility',
    '星座': 'Zodiac',
    '双方都填 = 缘分配对；只填一方 = 个人年度情感状态': 'Both = couple match; One = personal year',
    '属相': 'Zodiac Animal',
    '双方都填 = 生肖缘分；只填一方 = 属相年度情感状态': 'Both = animal match; One = personal year',
    '出生信息': 'Birth Info',
    '填全出生年+生日+时间+地点，可获得专业性格星图配对（上升星座/行星/相位）': 'Full info = professional natal chart (rising/planets/aspects)',
    '你的': 'Yours',
    'TA的': 'Theirs',
    '出生年 如1995': 'Birth year e.g. 1995',
    '出生年 如1996': 'Birth year e.g. 1996',
    '出生城市 如北京': 'Birth city e.g. Beijing',
    '出生城市 如上海': 'Birth city e.g. Shanghai',
    '你的星座已自动填充': 'Your zodiac auto-filled',
    'TA的星座已自动填充': 'Their zodiac auto-filled',
    '你的属相已自动填充': 'Your animal auto-filled',
    'TA的属相已自动填充': 'Their animal auto-filled',
    '专业性格星图配对已就绪': 'Professional natal chart ready',
    '补全另一方信息可解锁专业性格星图': 'Fill the other side to unlock natal chart',
    '查看年份': 'Year',
    '今年': 'This Year',
    '明年': 'Next Year',
    '开始分析': 'Start Analysis',
    '请至少选择一项': 'Please select at least one field',
    '未选': 'Not selected',
    '未知': 'Unknown',
    '选择月': 'Month',
    '选择日': 'Day',

    // ===== result =====
    '契合度结果': 'Compatibility Result',
    '综合契合指数（星座 · 属相）': 'Overall Score (Zodiac · Animal)',
    '灵魂伴侣': 'Soulmates',
    '高甜组合': 'Sweet Match',
    '互补磨合': 'Complementary',
    '火花恋人': 'Spark Lovers',
    '五行配对': 'Five Elements Match',
    '你的五行属': 'Your element',
    'TA的五行属': 'Their element',
    '五维契合雷达': '5-Dim Radar',
    '五维详情': '5-Dim Details',
    '浪漫': 'Romance', '沟通': 'Communication', '默契': 'Rapport', '激情': 'Passion', '稳定': 'Stability',
    '分': 'pts',
    '优势': 'Strengths', '挑战': 'Challenges', '相处建议': 'Tips', '未来展望': 'Future Outlook',
    '第一季度': 'Q1', '第二季度': 'Q2', '第三季度': 'Q3', '第四季度': 'Q4',
    '年度性格倾向': 'Year Personality Trend',
    '性格主题': 'Personality Theme',
    '年度': 'Year', '象': 'Element', '守护星': 'Ruling Planet',
    '火星': 'Mars', '金星': 'Venus', '水星': 'Mercury', '木星': 'Jupiter',
    '土星': 'Saturn', '冥王星': 'Pluto', '天王星': 'Uranus', '海王星': 'Neptune',
    '保存图片': 'Save Image', '关闭': 'Close',
    '性格星图': 'Natal Chart',
    '时令提示': 'Seasonal Tips',
    '心语': 'Heart Words',
    '出生信息匹配': 'Birth Info Match',
    '年龄差': 'Age gap', '岁': 'yrs',
    '性格星图合盘': 'Synastry Chart',
    '上升': 'Rising', '月亮': 'Moon', '太阳': 'Sun',
    '吉': 'Favorable', '需经营': 'Needs work', '需调和': 'Needs balance',
    '你的上升星座': 'Your Rising Sign', 'TA的上升星座': 'Their Rising Sign',
    '生成分享卡片': 'Generate Share Card', '返回首页': 'Back to Home',
    '性 格 契 合 度': 'PERSONALITY COMPATIBILITY',
    '五 维 综 合 契 合 指 数': '5-DIM OVERALL SCORE',
    '综 合 解 读': 'OVERALL READING',
    '性格契合度 · 内容仅供娱乐参考': 'Personality Compatibility · For entertainment only',
    '暂无数据，请重新分析': 'No data, please re-analyze',
    '你们的组合': 'Your combination',
    '彼此吸引，需要用心经营': 'Mutual attraction, needs care',
    '生肖': 'Zodiac Animal',

    // 生肖关系名
    '天作之合': 'Destined Match', '默契三合': 'Harmonious Trio', '同根相惜': 'Kindred Spirits',
    '和谐相处': 'Harmonious', '需要经营': 'Needs Work', '火花对撞': 'Spark Clash',

    // 星座关键词（buildEnCopy 英文版使用）
    '炽热': 'Fiery', '直率': 'Direct', '行动派': 'Action-driven',
    '踏实': 'Grounded', '专一': 'Devoted',
    '灵动': 'Lively', '好奇': 'Curious', '善谈': 'Talkative',
    '温柔': 'Gentle', '念旧': 'Nostalgic', '重情': 'Deep-hearted',
    '耀眼': 'Radiant', '慷慨': 'Generous', '骄傲': 'Proud',
    '细腻': 'Meticulous', '认真': 'Diligent', '完美': 'Perfectionist',
    '优雅': 'Elegant', '平衡': 'Balanced', '社交': 'Social',
    '深情': 'Devoted', '神秘': 'Mysterious', '占有': 'Possessive',
    '自由': 'Free-spirited', '乐观': 'Optimistic', '洒脱': 'Easygoing',
    '务实': 'Practical', '坚韧': 'Resilient', '责任': 'Responsible',
    '独特': 'Unique', '理性': 'Rational', '创新': 'Innovative',
    '感性': 'Emotional', '共情': 'Empathetic',

    // 星座组合模板关键词
    '同频共振': 'Resonant', '默契满格': 'Perfect Chemistry', '互相成就': 'Mutual Growth',
    '灵魂共鸣': 'Soul Resonance', '顺其自然': 'Natural Flow', '互相滋养': 'Mutual Nurture',
    '优势互补': 'Complementary', '相得益彰': 'Synergistic', '轻松愉快': 'Easy & Joyful',
    '致命吸引': 'Magnetic', '火花四溅': 'Sparkling', '宿命感': 'Destined',
    '细水长流': 'Steady Love', '温柔以待': 'Gentle Care', '慢慢来': 'Take It Slow',
    '差异碰撞': 'Different Sparks', '磨合成长': 'Growing Together', '越懂越爱': 'Deeper Love',
    '张力十足': 'Intense', '轰轰烈烈': 'Grand Passion',

    // ===== tarot =====
    '选择你关注的方向，抽取属于你的指引': 'Choose your focus, draw your guidance',
    '你想问的问题（选填）': 'Your question (optional)',
    '如：最近的感情状态如何？': 'e.g. How is my love life lately?',
    '关注方向（可多选叠加）': 'Focus (multi-select)',
    '情感': 'Love', '事业': 'Career', '财运': 'Wealth', '健康': 'Health', '朋友': 'Friends', '家庭': 'Family',
    '已选': 'Selected', '个方向，可叠加抽取': ' themes, can combine',
    '抽牌数量': 'Number of Cards',
    '单张指引': 'Single Card', '三张牌阵': 'Three-Card Spread',
    '洗牌中...': 'Shuffling...', '开始抽牌': 'Draw Cards',
    '至少保留一个方向': 'Keep at least one theme',

    // ===== tarot-result =====
    '卡牌结果': 'Card Result', '请先选牌': 'Please draw cards first', '去抽牌': 'Draw Cards',
    '整体状态向好': 'Overall Positive', '需要谨慎应对': 'Needs Caution',
    '关注方向': 'Focus', '问题': 'Question',
    '正位': 'Upright', '逆位': 'Reversed',
    '核心含义': 'Core Meaning', '维度': 'Dimension', '多维度联动': 'Multi-theme Synergy',
    '综合解读': 'Overall Reading',
    '积极向上': 'Positive', '需要调整': 'Needs Adjustment', '平衡过渡': 'Balanced Transition',
    '核心启示': 'Core Insight', '行动建议': 'Action Advice', '重点提醒': 'Key Reminder',
    '生成总结卡片': 'Generate Summary Card', '再抽一次': 'Draw Again',
    '卡牌综合解读': 'Card Overall Reading',
    '抽到的牌': 'Cards Drawn', '牌面要点': 'Card Highlights',
    '正': 'Upright', '逆': 'Reversed',
    '过去': 'Past', '现在': 'Present', '未来': 'Future', '当下': 'Now',
    '正在生成总结卡片...': 'Generating summary card...',
    '已保存图片': 'Image saved',
    '本地预览模式无法导出带图版，可截图保存；部署到服务器后即可保存完整卡片': 'Local preview mode cannot export the image version; screenshot to save. Once deployed, the full card can be saved.',

    // ===== mbti-matching =====
    'MBTI 双人性格匹配，读懂你们的相处模式': 'MBTI couple match, understand your dynamic',
    '你的 MBTI': 'Your MBTI', '对方的 MBTI': 'Their MBTI',
    '请选择 MBTI': 'Select MBTI',
    '不了解自己的 MBTI？': "Don't know your MBTI?",
    '先去「MBTI 测试」完成 16 道题，测出你的性格类型再来匹配。': 'Take the MBTI test (16 Qs) to find your type first.',
    '开始匹配': 'Start Match', '去做 MBTI 测试': 'Take MBTI Test',
    '双方 MBTI 已就绪，将生成性格匹配报告': 'Both MBTI ready, generating report',
    '请先填写双方 MBTI': 'Please fill both MBTI',

    // ===== mbti-result =====
    '速配结果': 'Match Result', '未找到配对数据': 'No match data found', '去速配': 'Go to Match',
    '性格速配结果': 'Quick Match Result', '性格匹配度': 'Personality Match',
    '四维契合雷达': '4-Dim Radar', '维度详情': 'Dim Details',
    '契合优势': 'Match Strengths',
    '生成速配分享卡': 'Generate Share Card', '重新速配': 'Match Again',
    '性格速配报告': 'Quick Match Report', 'MBTI 双人性格匹配': 'MBTI Couple Match',
    '契合优势': 'Match Strengths', '相处建议': 'Relationship Tips',
    '个人性格总结报告': 'Personal Personality Report',
    '正在生成速配分享卡...': 'Generating share card...',

    // ===== mbti-test =====
    'MBTI 性格测试': 'MBTI Personality Test',
    '选择适合你的模式': 'Choose your mode',
    '根据真实 MBTI 理论改编的性格测试': 'Personality test based on MBTI theory',
    '无对错之分 · 遵从第一直觉': 'No right/wrong · Follow first instinct',
    '快速版 · 16 题（约 2 分钟）': 'Quick · 16 Qs (~2 min)',
    '完整版 · 28 题（约 4 分钟）': 'Full · 28 Qs (~4 min)',
    '第': 'Q', '题': '',
    '选择更符合你平时状态的选项': 'Choose the option that fits you best',
    '测试完成': 'Test Complete', '你的性格类型是': 'Your type is',
    '人格猫咪': 'Personality Cat',
    '维度倾向': 'Dimension Tendency',
    '性格详解': 'Personality Detail',
    '天赋优势': 'Strengths', '成长挑战': 'Challenges', '成长建议': 'Growth Tips', '感情特质': 'Love Style',
    '生成性格报告卡片': 'Generate Report Card',
    '重新测试': 'Retake', '去个人解读': 'Personal Reading',
    'MBTI 性格报告': 'MBTI Personality Report',
    '正在生成报告卡片...': 'Generating report card...',
    '报告数据异常，请重新测试': 'Report data error, please retake',
    '卡片容器不存在': 'Card container not found',
    '当前为本地预览，浏览器限制无法导出带图图片；部署到服务器后即可保存带图版，现在可截图保存': 'Local preview: browser limits image export. Deploy to server for full export; screenshot for now.',

    // ===== personal =====
    '星座 · 属相 · MBTI · 流年 综合解读': 'Zodiac · Animal · MBTI · Year Reading',
    '去测试': 'Take Test', '流年': 'Year Flow',
    '开始解读': 'Start Reading',
    '性格画像': 'Personality Profile',
    '个人性格总结报告': 'Personal Personality Report',
    '请先开始解读': 'Please start reading first',
    '总结卡片': 'Summary Card',

    // ===== daily =====
    '黄历 · 星座 · 属相，自由选择任意日期查看': 'Almanac · Zodiac · Animal, pick any date',
    '今天': 'Today',
    '你的星座 · 属相': 'Your Zodiac · Animal',
    '黄历': 'Almanac', '五行': 'Five Elements',
    '吉神': 'Auspicious', '凶神': 'Inauspicious',
    '宜': 'Suitable', '忌': 'Avoid',
    '座运势': ' Fortune', '运势': 'Fortune',
    '灵感色': 'Lucky Color', '灵感数字': 'Lucky Number', '顺向方位': 'Lucky Direction',
    '状态佳': 'Excellent', '状态良好': 'Good', '状态平稳': 'Stable', '状态一般': 'Average', '状态平': 'Low',

    // ===== 12星座 =====
    '白羊': 'Aries', '金牛': 'Taurus', '双子': 'Gemini', '巨蟹': 'Cancer',
    '狮子': 'Leo', '处女': 'Virgo', '天秤': 'Libra', '天蝎': 'Scorpio',
    '射手': 'Sagittarius', '摩羯': 'Capricorn', '水瓶': 'Aquarius', '双鱼': 'Pisces',

    // ===== 12属相 =====
    '鼠': 'Rat', '牛': 'Ox', '虎': 'Tiger', '兔': 'Rabbit',
    '龙': 'Dragon', '蛇': 'Snake', '马': 'Horse', '羊': 'Goat',
    '猴': 'Monkey', '鸡': 'Rooster', '狗': 'Dog', '猪': 'Pig',

    // ===== 五行 =====
    '金': 'Metal', '木': 'Wood', '水': 'Water', '火': 'Fire', '土': 'Earth', '风': 'Air',

    // ===== 方位 =====
    '东': 'East', '南': 'South', '西': 'West', '北': 'North',
    '东南': 'Southeast', '西北': 'Northwest', '东北': 'Northeast', '西南': 'Southwest',

    // ===== 颜色 =====
    '金色': 'Gold', '粉色': 'Pink', '紫色': 'Purple', '蓝色': 'Blue',
    '绿色': 'Green', '白色': 'White', '红色': 'Red', '黄色': 'Yellow',
    '青色': 'Cyan', '橙色': 'Orange', '银白': 'Silver', '绯红': 'Crimson',

    // ===== 塔罗牌名 =====
    '愚者': 'The Fool', '魔术师': 'The Magician', '女祭司': 'The High Priestess',
    '皇后': 'The Empress', '皇帝': 'The Emperor', '教皇': 'The Hierophant',
    '恋人': 'The Lovers', '战车': 'The Chariot', '力量': 'Strength',
    '隐士': 'The Hermit', '命运之轮': 'Wheel of Fortune', '正义': 'Justice',
    '倒吊人': 'The Hanged Man', '死神': 'Death', '节制': 'Temperance',
    '恶魔': 'The Devil', '高塔': 'The Tower', '星星': 'The Star',
    '月亮': 'The Moon', '太阳': 'The Sun', '审判': 'Judgement', '世界': 'The World',

    // ===== MBTI 人格名 =====
    '建筑师': 'Architect', '逻辑学家': 'Logician', '指挥官': 'Commander', '辩论家': 'Debater',
    '提倡者': 'Advocate', '调停者': 'Mediator', '主人公': 'Protagonist', '竞选者': 'Campaigner',
    '物流师': 'Logistician', '守卫者': 'Defender', '总经理': 'Executive', '执政官': 'Consul',
    '鉴赏家': 'Virtuoso', '探险家': 'Adventurer', '企业家': 'Entrepreneur', '表演者': 'Entertainer',

    // ===== MBTI 维度 =====
    '内向': 'Introvert', '外向': 'Extravert', '直觉': 'Intuitive', '实感': 'Observant',
    '思考': 'Thinking', '情感': 'Feeling', '判断': 'Judging', '感知': 'Prospecting',

    // ===== 五行配对主题名 =====
    '炽夏': 'Blazing Summer', '暖秋': 'Warm Autumn', '春晓': 'Spring Dawn',
    '晨昏': 'Dawn & Dusk', '厚土': 'Rich Earth', '山风': 'Mountain Wind',
    '溪谷': 'Valley Stream', '林风': 'Forest Wind', '春涧': 'Spring Ravine', '深海': 'Deep Sea',

    // ===== 黄历术语 =====
    '冲': 'Clash', '煞': 'Sha', '日': 'Day',
    '诸事不宜': 'Nothing suitable', '祭祀': 'Worship', '祈福': 'Blessing',
    '求嗣': 'Seek offspring', '塑绘': 'Sculpting/Painting', '订盟': 'Engagement',
    '纳采': 'Betrothal', '嫁娶': 'Marriage', '动土': 'Groundbreaking',
    '安床': 'Bed placement', '入宅': 'Moving in', '移徙': 'Relocation',
    '安香': 'Incense', '栽种': 'Planting', '纳畜': 'Livestock',
    '开市': 'Market opening', '交易': 'Transaction', '立券': 'Contract',
    '纳财': 'Wealth', '开仓': 'Open warehouse', '出行': 'Travel',
    '会亲友': 'Visit friends', '求医': 'Seek medical', '治病': 'Treatment',
    '破屋': 'Demolition', '坏垣': 'Wall breaking', '掘井': 'Well digging',
    '开池': 'Pond digging', '破土': 'Earth breaking', '安葬': 'Burial',
    '出货财': 'Selling goods', '作灶': 'Stove making', '置产': 'Property',
    '造船': 'Shipbuilding', '行丧': 'Funeral procession',
    '天德': 'Heavenly Virtue', '月恩': 'Monthly Grace', '四相': 'Four Phases', '阳德': 'Yang Virtue',
    '月破': 'Monthly Break', '大耗': 'Great Drain', '四忌': 'Four Taboos', '八专': 'Eight Exclusive',

    // ===== 星期 =====
    '日': 'Sun', '一': 'Mon', '二': 'Tue', '三': 'Wed', '四': 'Thu', '五': 'Fri', '六': 'Sat',

    // ===== 月份 =====
    '1月': 'Jan', '2月': 'Feb', '3月': 'Mar', '4月': 'Apr',
    '5月': 'May', '6月': 'Jun', '7月': 'Jul', '8月': 'Aug',
    '9月': 'Sep', '10月': 'Oct', '11月': 'Nov', '12月': 'Dec',
    '1日': '1', '2日': '2', '3日': '3', '4日': '4', '5日': '5',
    '6日': '6', '7日': '7', '8日': '8', '9日': '9', '10日': '10',
    '11日': '11', '12日': '12', '13日': '13', '14日': '14', '15日': '15',
    '16日': '16', '17日': '17', '18日': '18', '19日': '19', '20日': '20',
    '21日': '21', '22日': '22', '23日': '23', '24日': '24', '25日': '25',
    '26日': '26', '27日': '27', '28日': '28', '29日': '29', '30日': '30', '31日': '31',

    // ===== 时辰 =====
    '子时': 'Zi', '丑时': 'Chou', '寅时': 'Yin', '卯时': 'Mao',
    '辰时': 'Chen', '巳时': 'Si', '午时': 'Wu', '未时': 'Wei',
    '申时': 'Shen', '酉时': 'You', '戌时': 'Xu', '亥时': 'Hai'
  };

  window.I18N_DICT = DICT;
})();
