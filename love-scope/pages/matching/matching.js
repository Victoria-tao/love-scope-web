// pages/matching/matching.js
const zodiac = require('../../data/zodiac.js');
const animal = require('../../data/zodiacAnimal.js');
const yearFortune = require('../../data/yearFortune.js');
const birthMatch = require('../../data/birthMatch.js');
const astrology = require('../../data/astrology.js');

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
    zodiacNames: ['未选'].concat(zodiac.ZODIAC.map(z => z.fullName)),
    zodiacDates: ['-'].concat(zodiac.ZODIAC.map(z => z.date)),
    myZIdx: 0, taZIdx: 0,
    animalNames: ['未选'].concat(animal.ANIMALS.map(a => a.name)),
    myAIdx: 0, taAIdx: 0,
    myBirthYear: '', myBirthday: '', myBirthTime: '', myCity: '',
    taBirthYear: '', taBirthday: '', taBirthTime: '', taCity: '',
    months,
    myDays: DEFAULT_DAYS, taDays: DEFAULT_DAYS,
    myMonthIdx: 0, myDayIdx: 0,
    taMonthIdx: 0, taDayIdx: 0,
    autoHint: '',
    years: ['今年', '明年'],
    yearIdx: 0
  },

  onMyZodiacChange(e) { this.setData({ myZIdx: Number(e.detail.value) }); },
  onTaZodiacChange(e) { this.setData({ taZIdx: Number(e.detail.value) }); },
  onMyAnimalChange(e) { this.setData({ myAIdx: Number(e.detail.value) }); },
  onTaAnimalChange(e) { this.setData({ taAIdx: Number(e.detail.value) }); },
  onYearChange(e) { this.setData({ yearIdx: Number(e.detail.value) }); },

  // ===== 我的出生信息（年份手动输入 + 月/日下拉选择） =====
  onMyYearInput(e) {
    const val = e.detail.value;
    this.setData({ myBirthYear: val });
    if (val && val.length === 4 && this.data.myAIdx === 0) {
      const ai = birthMatch.getAnimalIndexByYear(parseInt(val)) + 1;
      if (ai > 0 && ai <= 12) this.setData({ myAIdx: ai });
    }
    this.updateAutoHint();
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
      if (this.data.myZIdx === 0) {
        this.setData({ myZIdx: birthMatch.getZodiacIndexByBirthday(mi, di) + 1 });
      }
    } else {
      this.setData({ myBirthday: '' });
    }
    this.updateAutoHint();
  },
  onMyTimePick(e) { this.setData({ myBirthTime: e.detail.value }); this.updateAutoHint(); },
  onMyCityInput(e) { this.setData({ myCity: e.detail.value }); this.updateAutoHint(); },

  // ===== TA的出生信息（年份手动输入 + 月/日下拉选择） =====
  onTaYearInput(e) {
    const val = e.detail.value;
    this.setData({ taBirthYear: val });
    if (val && val.length === 4 && this.data.taAIdx === 0) {
      const ai = birthMatch.getAnimalIndexByYear(parseInt(val)) + 1;
      if (ai > 0 && ai <= 12) this.setData({ taAIdx: ai });
    }
    this.updateAutoHint();
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
      if (this.data.taZIdx === 0) {
        this.setData({ taZIdx: birthMatch.getZodiacIndexByBirthday(mi, di) + 1 });
      }
    } else {
      this.setData({ taBirthday: '' });
    }
    this.updateAutoHint();
  },
  onTaTimePick(e) { this.setData({ taBirthTime: e.detail.value }); this.updateAutoHint(); },
  onTaCityInput(e) { this.setData({ taCity: e.detail.value }); this.updateAutoHint(); },

  updateAutoHint() {
    const hints = [];
    if (this.data.myBirthday && this.data.myZIdx > 0) hints.push('你的星座已自动填充');
    if (this.data.taBirthday && this.data.taZIdx > 0) hints.push('TA的星座已自动填充');
    if (this.data.myBirthYear && this.data.myAIdx > 0) hints.push('你的属相已自动填充');
    if (this.data.taBirthYear && this.data.taAIdx > 0) hints.push('TA的属相已自动填充');
    const myReady = this.data.myBirthYear && this.data.myBirthday && this.data.myBirthTime && this.data.myCity.trim();
    const taReady = this.data.taBirthYear && this.data.taBirthday && this.data.taBirthTime && this.data.taCity.trim();
    if (myReady && taReady) hints.push('专业性格星图配对已就绪');
    else if (myReady || taReady) hints.push('补全另一方信息可解锁专业性格星图');
    this.setData({ autoHint: hints.length ? hints.join('，') : '' });
  },

  findCityCoords(cityName) {
    if (!cityName) return null;
    const name = cityName.trim();
    const city = astrology.CITIES.find(c => c.name === name);
    if (city) return { lon: city.lon, lat: city.lat, name: city.name };
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
    const thisYear = new Date().getFullYear();
    const year = this.data.yearIdx === 0 ? thisYear : thisYear + 1;
    const mz = this.data.myZIdx, tz = this.data.taZIdx;
    const ma = this.data.myAIdx, ta = this.data.taAIdx;

    const hasAny = mz > 0 || tz > 0 || ma > 0 || ta > 0 ||
      this.data.myBirthYear || this.data.taBirthYear;
    if (!hasAny) {
      wx.showToast({ title: '请至少选择一项', icon: 'none' });
      return;
    }

    const result = {
      year, yearLabel: this.data.years[this.data.yearIdx],
      zodiacPair: null, singleZodiac: null,
      animalPair: null, singleAnimal: null,
      birthMatch: null, natalChart: null, synastry: null,
      yearFortune: yearFortune.getYearFortune(year)
    };

    if (mz > 0 && tz > 0) {
      result.zodiacPair = zodiac.getMatch(mz - 1, tz - 1, this.data.yearIdx === 0 ? 'this' : 'next');
    } else if (mz > 0) {
      result.singleZodiac = zodiac.getSingleZodiacFortune(mz - 1, year);
    } else if (tz > 0) {
      result.singleZodiac = zodiac.getSingleZodiacFortune(tz - 1, year);
    }

    if (ma > 0 && ta > 0) {
      result.animalPair = animal.getAnimalMatch(ma - 1, ta - 1);
    } else if (ma > 0) {
      result.singleAnimal = animal.getSingleAnimalFortune(ma - 1, year);
    } else if (ta > 0) {
      result.singleAnimal = animal.getSingleAnimalFortune(ta - 1, year);
    }

    if (this.data.myBirthYear && this.data.taBirthYear &&
        this.data.myBirthYear.length === 4 && this.data.taBirthYear.length === 4) {
      result.birthMatch = birthMatch.getBirthMatch(
        this.data.myBirthYear, this.data.myBirthday,
        this.data.taBirthYear, this.data.taBirthday
      );
    }

    const myBirth = this.buildBirthInfo(this.data.myBirthYear, this.data.myBirthday, this.data.myBirthTime, this.data.myCity);
    const taBirth = this.buildBirthInfo(this.data.taBirthYear, this.data.taBirthday, this.data.taBirthTime, this.data.taCity);
    if (myBirth && taBirth) {
      try {
        const myChart = astrology.getNatalChart(myBirth);
        const taChart = astrology.getNatalChart(taBirth);
        result.natalChart = { my: myChart, ta: taChart };
        result.synastry = astrology.getSynastry(myChart, taChart);
      } catch (e) {
        console.error('性格星图计算失败', e);
      }
    } else if (myBirth) {
      try {
        result.natalChart = { my: astrology.getNatalChart(myBirth), ta: null };
      } catch (e) { console.error(e); }
    }

    const app = getApp();
    app.globalData.lastMatch = result;
    wx.navigateTo({ url: '/pages/result/result' });
  }
});
