// pages/daily/daily.js
const zodiacData = require('../../data/zodiac.js');
const animalData = require('../../data/zodiacAnimal.js');

Page({
  data: {
    today: '',
    todayDate: null,
    selectedDateText: '',
    isSelectedToday: true,
    calendarDays: [],
    currentMonth: '',
    currentYear: 0,
    currentMonthIdx: 0,
    zodiacIndex: 0,
    animalIndex: 0,
    zodiacs: [],
    animals: [],
    zodiacFortune: null,
    animalFortune: null,
    huangli: null,
    summary: ''
  },

  onLoad() {
    const now = new Date();
    const zodiacs = zodiacData.ZODIAC.map(z => z.name);
    const animals = animalData.ANIMALS.map(a => a.name);
    this.setData({
      zodiacs,
      animals,
      todayDate: now.getDate(),
      currentYear: now.getFullYear(),
      currentMonthIdx: now.getMonth()
    });
    this.selectDate(now.getFullYear(), now.getMonth(), now.getDate());
  },

  // 选择日期
  selectDate(year, month, day) {
    const date = new Date(year, month, day);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const selectedDateText = year + '年' + (month + 1) + '月' + day + '日';

    this.setData({
      selectedYear: year,
      selectedMonth: month,
      selectedDay: day,
      selectedDateText,
      isSelectedToday: isToday,
      currentYear: year,
      currentMonthIdx: month
    });

    this.generateCalendar(year, month, day);
    const huangli = this.generateHuangli(date);
    this.generateFortunes(huangli, date);
  },

  // 点击日历上的日期
  onTapDay(e) {
    const day = e.currentTarget.dataset.day;
    if (!day) return;
    this.selectDate(this.data.currentYear, this.data.currentMonthIdx, day);
  },

  // 上个月
  prevMonth() {
    let year = this.data.currentYear;
    let month = this.data.currentMonthIdx - 1;
    if (month < 0) {
      month = 11;
      year--;
    }
    this.setData({ currentYear: year, currentMonthIdx: month });
    this.generateCalendar(year, month, this.data.selectedDay);
  },

  // 下个月
  nextMonth() {
    let year = this.data.currentYear;
    let month = this.data.currentMonthIdx + 1;
    if (month > 11) {
      month = 0;
      year++;
    }
    this.setData({ currentYear: year, currentMonthIdx: month });
    this.generateCalendar(year, month, this.data.selectedDay);
  },

  // 回到今天
  goToday() {
    const now = new Date();
    this.selectDate(now.getFullYear(), now.getMonth(), now.getDate());
  },

  generateCalendar(year, month, selectedDay) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const now = new Date();
    const today = now.getDate();
    const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: '', isToday: false, isSelected: false, isCurrent: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({
        day: d,
        isToday: isCurrentMonth && d === today,
        isSelected: d === selectedDay,
        isCurrent: true
      });
    }

    this.setData({
      calendarDays: days,
      currentMonth: year + '年' + (month + 1) + '月'
    });
  },

  generateHuangli(date) {
    const dayOfYear = this.getDayOfYear(date);
    const yiList = ['祭祀', '祈福', '求嗣', '塑绘', '齐醮', '订盟', '纳采', '嫁娶', '动土', '安床', '入宅', '移徙', '安香', '栽种', '纳畜', '牧养', '开市', '交易', '立券', '纳财', '开仓', '出行', '会亲友', '求医', '治病', '破屋', '坏垣', '掘井', '开池'];
    const jiList = ['诸事不宜', '动土', '破土', '安葬', '开仓', '出货财', '嫁娶', '入宅', '移徙', '远回', '作灶', '栽种', '纳畜', '牧养', '掘井', '开池', '置产', '造船', '行丧', '安葬'];

    const yiCount = 4 + (dayOfYear % 3);
    const jiCount = 3 + (dayOfYear % 2);
    const yi = [];
    const ji = [];

    for (let i = 0; i < yiCount; i++) {
      const idx = (dayOfYear * 3 + i * 7) % yiList.length;
      if (!yi.includes(yiList[idx])) yi.push(yiList[idx]);
    }
    for (let i = 0; i < jiCount; i++) {
      const idx = (dayOfYear * 5 + i * 11) % jiList.length;
      if (!ji.includes(jiList[idx])) ji.push(jiList[idx]);
    }

    const animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
    const chongAnimal = animals[dayOfYear % 12];
    const directions = ['北', '南', '东', '西', '东北', '东南', '西北', '西南'];
    const shaDirection = directions[dayOfYear % directions.length];
    const wuxingList = ['金', '木', '水', '火', '土'];
    const wuxing = wuxingList[dayOfYear % 5];

    const huangli = {
      yi: yi.join('、'),
      ji: ji.join('、'),
      yiArr: yi,
      jiArr: ji,
      chong: '冲' + chongAnimal,
      sha: '煞' + shaDirection,
      wuxing: wuxing + '日',
      jishen: ['天德', '月恩', '四相', '阳德'][dayOfYear % 4],
      xiongshen: ['月破', '大耗', '四忌', '八专'][dayOfYear % 4]
    };

    this.setData({ huangli });
    return huangli;
  },

  onZodiacChange(e) {
    this.setData({ zodiacIndex: Number(e.detail.value) });
    this.generateFortunes(this.data.huangli, this.getSelectedDate());
  },

  onAnimalChange(e) {
    this.setData({ animalIndex: Number(e.detail.value) });
    this.generateFortunes(this.data.huangli, this.getSelectedDate());
  },

  getSelectedDate() {
    return new Date(this.data.selectedYear, this.data.selectedMonth, this.data.selectedDay);
  },

  generateFortunes(huangli, date) {
    const zodiac = zodiacData.ZODIAC[this.data.zodiacIndex];
    const animal = animalData.ANIMALS[this.data.animalIndex];
    const dayOfYear = this.getDayOfYear(date);

    const zodiacScore = this.calcScore(dayOfYear + this.data.zodiacIndex, 5);
    const animalScore = this.calcScore(dayOfYear + this.data.animalIndex, 7);

    const zodiacFortune = {
      name: zodiac.name,
      score: zodiacScore,
      level: this.getLevel(zodiacScore),
      color: this.getScoreColor(zodiacScore),
      lucky: this.getLuckyItem(this.data.zodiacIndex, dayOfYear),
      advice: this.getZodiacAdvice(zodiac, zodiacScore)
    };

    const animalFortune = {
      name: animal.name,
      score: animalScore,
      level: this.getLevel(animalScore),
      color: this.getScoreColor(animalScore),
      lucky: this.getLuckyItem(this.data.animalIndex + 12, dayOfYear),
      advice: this.getAnimalAdvice(animal, animalScore)
    };

    const avgScore = Math.round((zodiacScore + animalScore) / 2);
    const luckyColor = zodiacFortune.lucky.color;
    const luckyNumber = zodiacFortune.lucky.number;
    const luckyDirection = animalFortune.lucky.direction;
    const hl = huangli || this.data.huangli || { wuxing: '土日', yiArr: ['祈福'], jiArr: ['动土'] };

    let summary = '今日综合状态' + this.getLevel(avgScore) + '（' + avgScore + '分）。';
    summary += '灵感色：' + luckyColor + '，灵感数字：' + luckyNumber + '，顺向方位：' + luckyDirection + '。';
    summary += '今日五行属' + hl.wuxing.replace('日', '') + '，宜' + (hl.yiArr && hl.yiArr.length ? hl.yiArr.slice(0, 2).join('、') : '祈福') + '，忌' + (hl.jiArr && hl.jiArr.length ? hl.jiArr.slice(0, 2).join('、') : '动土') + '。';
    if (avgScore >= 75) {
      summary += '整体能量积极，把握机会主动出击，会有不错的收获。';
    } else if (avgScore >= 60) {
      summary += '整体状态平稳，脚踏实地做好本职，不宜冒进。';
    } else {
      summary += '今日宜守不宜攻，低调行事，避免冲动决策。';
    }

    this.setData({ zodiacFortune, animalFortune, summary });
  },

  getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  },

  calcScore(seed, offset) {
    const base = (seed * 37 + offset * 13) % 100;
    return Math.max(45, Math.min(95, base + 30));
  },

  getLevel(score) {
    if (score >= 85) return '状态佳';
    if (score >= 75) return '状态良好';
    if (score >= 65) return '状态平稳';
    if (score >= 55) return '状态一般';
    return '状态平';
  },

  getScoreColor(score) {
    if (score >= 85) return '#ffd700';
    if (score >= 75) return '#f0a8c0';
    if (score >= 65) return '#c4a8e8';
    return '#a0b0e0';
  },

  getLuckyItem(seed, day) {
    const colors = ['金色', '粉色', '紫色', '蓝色', '绿色', '白色', '红色', '黄色'];
    const numbers = ['3', '5', '7', '8', '9', '6', '2', '1'];
    const directions = ['东', '南', '西', '北', '东南', '西北', '东北', '西南'];
    return {
      color: colors[(seed + day) % colors.length],
      number: numbers[(seed * 2 + day) % numbers.length],
      direction: directions[(seed + day * 2) % directions.length]
    };
  },

  getZodiacAdvice(zodiac, score) {
    const kw0 = zodiac.keywords[0] || '积极';
    const kw1 = zodiac.keywords[1] || '稳重';
    if (score >= 80) {
      return '今天' + zodiac.name + '座能量充沛，' + kw0 + '的特质会帮你抓住机会。适合主动出击，表达自己的想法。';
    } else if (score >= 65) {
      return '今天' + zodiac.name + '座状态平稳，保持' + kw1 + '的心态，稳步推进手头的事情即可。';
    } else {
      return '今天' + zodiac.name + '座需要多些耐心，适合低调行事、养精蓄锐。';
    }
  },

  getAnimalAdvice(animal, score) {
    const kw0 = animal.keywords[0] || '稳重';
    const kw1 = animal.keywords[1] || '踏实';
    if (score >= 80) {
      return animal.name + '年生人今天人际助力强，' + kw0 + '的特质会得到发挥，适合社交和合作。';
    } else if (score >= 65) {
      return animal.name + '年生人今天状态中等，发挥' + kw1 + '的优势，脚踏实地就好。';
    } else {
      return animal.name + '年生人今天宜静不宜动，避免冲动决策。';
    }
  },

  goHome() {
    wx.reLaunch({ url: '/pages/index/index' });
  }
});
