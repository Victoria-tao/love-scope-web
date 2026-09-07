// pages/pro/pro.js 专业版深度匹配输入
const zodiac = require('../../data/zodiac.js');
const animal = require('../../data/zodiacAnimal.js');
const yearFortune = require('../../data/yearFortune.js');
const birthMatch = require('../../data/birthMatch.js');
const astrology = require('../../data/astrology.js');
const tarotData = require('../../data/tarot.js');
const engine = require('../../utils/tarotEngine.js');
const { TAROT_IMAGES } = require('../../utils/imageConfig.js');

// 年份下拉数据（1940~今年）
// 月份/日子下拉数据
const months = ['选择月', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
function buildDays(month) {
  let n = 31;
  if (month === 2) n = 29;
  else if ([4, 6, 9, 11].indexOf(month) >= 0) n = 30;
  const arr = ['选择日'];
  for (let d = 1; d <= n; d++) arr.push(d + '日');
  return arr;
}
const DEFAULT_DAYS = buildDays(1);

Page({
  data: {
    myYear: '', myBirthday: '', myTime: '', myCity: '',
    taYear: '', taBirthday: '', taTime: '', taCity: '',
    myZodiacName: '', myAnimalName: '',
    taZodiacName: '', taAnimalName: '',
    months,
    myDays: DEFAULT_DAYS, taDays: DEFAULT_DAYS,
    myMonthIdx: 0, myDayIdx: 0,
    taMonthIdx: 0, taDayIdx: 0,
    years: ['今年', '明年'],
    yearIdx: 0,
    readyLevel: 0,
    readyText: '',
    canSubmit: false
  },

  // ===== 我的出生信息（年份手动输入 + 月/日下拉选择） =====
  onMyYear(e) {
    this.setData({ myYear: e.detail.value });
    this.updateAuto();
  },
  onMyMonthPick(e) {
    const mi = Number(e.detail.value);
    this.setData({
      myMonthIdx: mi,
      myDays: mi > 0 ? buildDays(mi) : DEFAULT_DAYS,
      myDayIdx: 0
    });
    this.applyMyBirthday();
  },
  onMyDayPick(e) {
    this.setData({ myDayIdx: Number(e.detail.value) });
    this.applyMyBirthday();
  },
  applyMyBirthday() {
    const mi = this.data.myMonthIdx, di = this.data.myDayIdx;
    if (mi > 0 && di > 0) {
      const m = mi < 10 ? '0' + mi : '' + mi;
      const d = di < 10 ? '0' + di : '' + di;
      this.setData({ myBirthday: m + '-' + d });
    } else {
      this.setData({ myBirthday: '' });
    }
    this.updateAuto();
  },
  onMyTimePick(e) { this.setData({ myTime: e.detail.value }); this.updateAuto(); },
  onMyCityInput(e) { this.setData({ myCity: e.detail.value }); this.updateAuto(); },

  // ===== TA的出生信息（年份手动输入 + 月/日下拉选择） =====
  onTaYear(e) {
    this.setData({ taYear: e.detail.value });
    this.updateAuto();
  },
  onTaMonthPick(e) {
    const mi = Number(e.detail.value);
    this.setData({
      taMonthIdx: mi,
      taDays: mi > 0 ? buildDays(mi) : DEFAULT_DAYS,
      taDayIdx: 0
    });
    this.applyTaBirthday();
  },
  onTaDayPick(e) {
    this.setData({ taDayIdx: Number(e.detail.value) });
    this.applyTaBirthday();
  },
  applyTaBirthday() {
    const mi = this.data.taMonthIdx, di = this.data.taDayIdx;
    if (mi > 0 && di > 0) {
      const m = mi < 10 ? '0' + mi : '' + mi;
      const d = di < 10 ? '0' + di : '' + di;
      this.setData({ taBirthday: m + '-' + d });
    } else {
      this.setData({ taBirthday: '' });
    }
    this.updateAuto();
  },
  onTaTimePick(e) { this.setData({ taTime: e.detail.value }); this.updateAuto(); },
  onTaCityInput(e) { this.setData({ taCity: e.detail.value }); this.updateAuto(); },
  onYear(e) { this.setData({ yearIdx: Number(e.detail.value) }); },

  updateAuto() {
    let myZ = '', myA = '', taZ = '', taA = '';
    if (this.data.myBirthday && /^\d{2}-\d{2}$/.test(this.data.myBirthday)) {
      const [m, d] = this.data.myBirthday.split('-').map(Number);
      if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
        const idx = birthMatch.getZodiacIndexByBirthday(m, d);
        if (idx >= 0) myZ = zodiac.ZODIAC[idx].fullName;
      }
    }
    if (this.data.myYear && this.data.myYear.length === 4) {
      const idx = birthMatch.getAnimalIndexByYear(parseInt(this.data.myYear));
      if (idx >= 0) myA = animal.ANIMALS[idx].name;
    }
    if (this.data.taBirthday && /^\d{2}-\d{2}$/.test(this.data.taBirthday)) {
      const [m, d] = this.data.taBirthday.split('-').map(Number);
      if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
        const idx = birthMatch.getZodiacIndexByBirthday(m, d);
        if (idx >= 0) taZ = zodiac.ZODIAC[idx].fullName;
      }
    }
    if (this.data.taYear && this.data.taYear.length === 4) {
      const idx = birthMatch.getAnimalIndexByYear(parseInt(this.data.taYear));
      if (idx >= 0) taA = animal.ANIMALS[idx].name;
    }

    // 就绪度
    const myBasic = !!(this.data.myYear && this.data.myBirthday);
    const taBasic = !!(this.data.taYear && this.data.taBirthday);
    const myFull = myBasic && !!this.data.myTime && !!this.data.myCity.trim();
    const taFull = taBasic && !!this.data.taTime && !!this.data.taCity.trim();

    let level = 0, text = '', canSubmit = false;
    if (myFull && taFull) {
      level = 3; text = '全部信息已就绪，将解锁六维深度匹配分析'; canSubmit = true;
    } else if (myBasic && taBasic) {
      level = 2; text = '基础信息已就绪，可做星座+属相+出生信息+年度匹配；补全时间和城市可解锁更多维度'; canSubmit = true;
    } else if (myBasic || taBasic) {
      level = 1; text = '已填一方信息，补全另一方即可开始匹配'; canSubmit = false;
    } else {
      level = 0; text = ''; canSubmit = false;
    }

    this.setData({
      myZodiacName: myZ, myAnimalName: myA,
      taZodiacName: taZ, taAnimalName: taA,
      readyLevel: level, readyText: text, canSubmit
    });
  },

  // 根据城市名查找经纬度，找不到用默认（北京）
  findCityCoords(cityName) {
    if (!cityName) return null;
    const name = cityName.trim();
    const city = astrology.CITIES.find(c => c.name === name);
    if (city) return { lon: city.lon, lat: city.lat, name: city.name };
    // 未匹配到的城市，用默认经纬度（北京），保证性格维度仍可计算
    return { lon: 116.4, lat: 39.9, name: name };
  },

  buildBirthInfo(yearStr, birthdayStr, timeStr, cityName) {
    if (!yearStr || yearStr.length !== 4) return null;
    const bd = astrology.parseBirthday(birthdayStr);
    const tm = astrology.parseTime(timeStr);
    const coords = this.findCityCoords(cityName);
    if (!bd || !tm || !coords) return null;
    return {
      year: parseInt(yearStr),
      month: bd.month, day: bd.day,
      hour: tm.hour, minute: tm.minute,
      lon: coords.lon, lat: coords.lat,
      cityName: coords.name
    };
  },

  onStart() {
    if (!this.data.canSubmit) {
      wx.showToast({ title: '请至少填全双方的出生年和生日', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '正在分析...', mask: true });

    setTimeout(() => {
      const thisYear = new Date().getFullYear();
      const year = this.data.yearIdx === 0 ? thisYear : thisYear + 1;

      const result = {
        year, yearLabel: this.data.years[this.data.yearIdx],
        zodiacPair: null, animalPair: null,
        birthMatch: null, natalChart: null, synastry: null,
        yearFortune: yearFortune.getYearFortune(year),
        tarot: null,
        myInfo: null, taInfo: null
      };

      // 从生日推算星座索引
      let myZIdx = -1, taZIdx = -1, myAIdx = -1, taAIdx = -1;
      if (this.data.myBirthday && /^\d{2}-\d{2}$/.test(this.data.myBirthday)) {
        const [m, d] = this.data.myBirthday.split('-').map(Number);
        myZIdx = birthMatch.getZodiacIndexByBirthday(m, d);
      }
      if (this.data.taBirthday && /^\d{2}-\d{2}$/.test(this.data.taBirthday)) {
        const [m, d] = this.data.taBirthday.split('-').map(Number);
        taZIdx = birthMatch.getZodiacIndexByBirthday(m, d);
      }
      if (this.data.myYear && this.data.myYear.length === 4) {
        myAIdx = birthMatch.getAnimalIndexByYear(parseInt(this.data.myYear));
      }
      if (this.data.taYear && this.data.taYear.length === 4) {
        taAIdx = birthMatch.getAnimalIndexByYear(parseInt(this.data.taYear));
      }

      // 星座配对
      if (myZIdx >= 0 && taZIdx >= 0) {
        result.zodiacPair = zodiac.getMatch(myZIdx, taZIdx, this.data.yearIdx === 0 ? 'this' : 'next');
      }
      // 属相配对
      if (myAIdx >= 0 && taAIdx >= 0) {
        result.animalPair = animal.getAnimalMatch(myAIdx, taAIdx);
      }
      // 出生信息契合
      if (this.data.myYear && this.data.taYear &&
          this.data.myYear.length === 4 && this.data.taYear.length === 4) {
        result.birthMatch = birthMatch.getBirthMatch(
          this.data.myYear, this.data.myBirthday,
          this.data.taYear, this.data.taBirthday
        );
      }
      // 专业性格维度
      const myBirth = this.buildBirthInfo(this.data.myYear, this.data.myBirthday, this.data.myTime, this.data.myCity);
      const taBirth = this.buildBirthInfo(this.data.taYear, this.data.taBirthday, this.data.taTime, this.data.taCity);
      if (myBirth && taBirth) {
        try {
          const myChart = astrology.getNatalChart(myBirth);
          const taChart = astrology.getNatalChart(taBirth);
          result.natalChart = { my: myChart, ta: taChart };
          result.synastry = astrology.getSynastry(myChart, taChart);
        } catch (e) { console.error('性格维度计算失败', e); }
      } else if (myBirth) {
        try { result.natalChart = { my: astrology.getNatalChart(myBirth), ta: null }; } catch (e) {}
      }

      // 趣味卡牌抽牌（1张，综合情感指引）
      const tarotDeck = tarotData.TAROT;
      const tarotResult = engine.drawCards(tarotDeck, 1, '综合情感指引');
      if (tarotResult && tarotResult.length) {
        const r = tarotResult[0];
        result.tarot = {
          card: {
            id: r.card.id,
            no: r.card.no,
            name: r.card.name,
            en: r.card.en,
            upright: r.card.upright,
            reversed: r.card.reversed,
            uprightText: r.card.uprightText,
            reversedText: r.card.reversedText,
            love: r.card.love,
            image: TAROT_IMAGES[r.card.id] || ''
          },
          upright: r.upright,
          positionName: r.positionName
        };
      }

      // 记录输入信息
      result.myInfo = {
        year: this.data.myYear, birthday: this.data.myBirthday,
        time: this.data.myTime, city: this.data.myCity || '',
        zodiac: myZIdx >= 0 ? zodiac.ZODIAC[myZIdx].fullName : '',
        animal: myAIdx >= 0 ? animal.ANIMALS[myAIdx].name : ''
      };
      result.taInfo = {
        year: this.data.taYear, birthday: this.data.taBirthday,
        time: this.data.taTime, city: this.data.taCity || '',
        zodiac: taZIdx >= 0 ? zodiac.ZODIAC[taZIdx].fullName : '',
        animal: taAIdx >= 0 ? animal.ANIMALS[taAIdx].name : ''
      };

      const app = getApp();
      app.globalData.proResult = result;
      wx.hideLoading();
      wx.navigateTo({ url: '/pages/pro-result/pro-result' });
    }, 600);
  }
});
