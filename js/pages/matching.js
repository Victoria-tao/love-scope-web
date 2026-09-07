/**
 * pages/matching.js — 情感配对输入
 * 星座/属相下拉 + 出生年手输 + 月/日下拉 + 出生时间下拉 + 城市文本输入
 */
(function () {
  var zodiac = window.ZD, animal = window.ZA, birthMatch = window.BM, astrology = window.AST;

  var state = {
    myZIdx: 0, taZIdx: 0, myAIdx: 0, taAIdx: 0,
    myBirthYear: '', myBirthday: '', myBirthTime: '', myCity: '',
    taBirthYear: '', taBirthday: '', taBirthTime: '', taCity: '',
    myMonthIdx: 0, myDayIdx: 0, taMonthIdx: 0, taDayIdx: 0,
    yearIdx: 0, autoHint: ''
  };

  var zodiacNames = ['未选'].concat(zodiac.ZODIAC.map(function (z) { return z.fullName; }));
  var zodiacDates = ['-'].concat(zodiac.ZODIAC.map(function (z) { return z.date; }));
  var animalNames = ['未选'].concat(animal.ANIMALS.map(function (a) { return a.name; }));
  var years = ['今年', '明年'];

  function zodiacOptions(selected) {
    var s = '';
    zodiacNames.forEach(function (n, i) {
      var label = i === 0 ? App.t(n) : App.t(n) + '（' + zodiacDates[i] + '）';
      s += '<option value="' + i + '" ' + (i === selected ? 'selected' : '') + '>' + label + '</option>';
    });
    return s;
  }
  function animalOptions(selected) {
    var s = '';
    animalNames.forEach(function (n, i) {
      s += '<option value="' + i + '" ' + (i === selected ? 'selected' : '') + '>' + (i === 0 ? App.t(n) : App.t('属' + n)) + '</option>';
    });
    return s;
  }
  function yearOptions(selected) {
    var s = '';
    years.forEach(function (n, i) { s += '<option value="' + i + '" ' + (i === selected ? 'selected' : '') + '>' + App.t(n) + '</option>'; });
    return s;
  }
  function monthOptions(selected) {
    var s = '';
    App.months.forEach(function (n, i) { s += '<option value="' + i + '" ' + (i === selected ? 'selected' : '') + '>' + App.t(n) + '</option>'; });
    return s;
  }
  function dayOptions(days, selected) {
    var s = '';
    days.forEach(function (n, i) { s += '<option value="' + i + '" ' + (i === selected ? 'selected' : '') + '>' + App.t(n) + '</option>'; });
    return s;
  }

  function updateAutoHint() {
    var hints = [];
    if (state.myBirthday && state.myZIdx > 0) hints.push(App.t('你的星座已自动填充'));
    if (state.taBirthday && state.taZIdx > 0) hints.push(App.t('TA的星座已自动填充'));
    if (state.myBirthYear && state.myAIdx > 0) hints.push(App.t('你的属相已自动填充'));
    if (state.taBirthYear && state.taAIdx > 0) hints.push(App.t('TA的属相已自动填充'));
    var myReady = state.myBirthYear && state.myBirthday && state.myBirthTime && state.myCity.trim();
    var taReady = state.taBirthYear && state.taBirthday && state.taBirthTime && state.taCity.trim();
    if (myReady && taReady) hints.push(App.t('专业性格星图配对已就绪'));
    else if (myReady || taReady) hints.push(App.t('补全另一方信息可解锁专业性格星图'));
    state.autoHint = hints.join('，');
  }

  function onMyYearInput(val) {
    state.myBirthYear = val;
    if (val && val.length === 4 && state.myAIdx === 0) {
      var ai = birthMatch.getAnimalIndexByYear(parseInt(val)) + 1;
      if (ai > 0 && ai <= 12) {
        state.myAIdx = ai;
        var sel = document.getElementById('myA');
        if (sel) sel.value = ai;
      }
    }
    updateAutoHint();
    App.pages.matching.syncHint();
  }
  function onTaYearInput(val) {
    state.taBirthYear = val;
    if (val && val.length === 4 && state.taAIdx === 0) {
      var ai = birthMatch.getAnimalIndexByYear(parseInt(val)) + 1;
      if (ai > 0 && ai <= 12) {
        state.taAIdx = ai;
        var sel = document.getElementById('taA');
        if (sel) sel.value = ai;
      }
    }
    updateAutoHint();
    App.pages.matching.syncHint();
  }
  function applyMyBirthday() {
    var mi = state.myMonthIdx, di = state.myDayIdx;
    if (mi > 0 && di > 0) {
      var m = mi < 10 ? '0' + mi : '' + mi;
      var d = di < 10 ? '0' + di : '' + di;
      state.myBirthday = m + '-' + d;
      if (state.myZIdx === 0) {
        state.myZIdx = birthMatch.getZodiacIndexByBirthday(mi, di) + 1;
        var sel = document.getElementById('myZ');
        if (sel) sel.value = state.myZIdx;
      }
    } else { state.myBirthday = ''; }
    updateAutoHint();
    App.pages.matching.syncHint();
  }
  function applyTaBirthday() {
    var mi = state.taMonthIdx, di = state.taDayIdx;
    if (mi > 0 && di > 0) {
      var m = mi < 10 ? '0' + mi : '' + mi;
      var d = di < 10 ? '0' + di : '' + di;
      state.taBirthday = m + '-' + d;
      if (state.taZIdx === 0) {
        state.taZIdx = birthMatch.getZodiacIndexByBirthday(mi, di) + 1;
        var sel = document.getElementById('taZ');
        if (sel) sel.value = state.taZIdx;
      }
    } else { state.taBirthday = ''; }
    updateAutoHint();
    App.pages.matching.syncHint();
  }

  function findCityCoords(cityName) {
    if (!cityName) return null;
    var name = cityName.trim();
    var city = astrology.CITIES.filter(function (c) { return c.name === name; })[0];
    if (city) return { lon: city.lon, lat: city.lat, name: city.name };
    return { lon: 116.4, lat: 39.9, name: name };
  }
  function buildBirthInfo(yearStr, birthdayStr, timeStr, cityName) {
    if (!yearStr || yearStr.length !== 4) return null;
    var bd = astrology.parseBirthday(birthdayStr);
    var tm = astrology.parseTime(timeStr);
    var coords = findCityCoords(cityName);
    if (!bd || !tm || !coords) return null;
    return {
      year: parseInt(yearStr), month: bd.month, day: bd.day,
      hour: tm.hour, minute: tm.minute,
      lon: coords.lon, lat: coords.lat, cityName: coords.name
    };
  }

  function onStart() {
    var thisYear = new Date().getFullYear();
    var year = state.yearIdx === 0 ? thisYear : thisYear + 1;
    var mz = state.myZIdx, tz = state.taZIdx;
    var ma = state.myAIdx, ta = state.taAIdx;
    var hasAny = mz > 0 || tz > 0 || ma > 0 || ta > 0 || state.myBirthYear || state.taBirthYear;
    if (!hasAny) { App.toast(App.t('请至少选择一项')); return; }

    var result = {
      year: year, yearLabel: years[state.yearIdx],
      zodiacPair: null, singleZodiac: null,
      animalPair: null, singleAnimal: null,
      birthMatch: null, natalChart: null, synastry: null,
      yearFortune: window.YF.getYearFortune(year)
    };

    if (mz > 0 && tz > 0) {
      var maName = ma > 0 ? animal.ANIMALS[ma - 1].name : null;
      var taName = ta > 0 ? animal.ANIMALS[ta - 1].name : null;
      result.zodiacPair = zodiac.getMatch(mz - 1, tz - 1, state.yearIdx === 0 ? 'this' : 'next', maName, taName);
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

    if (state.myBirthYear && state.taBirthYear && state.myBirthYear.length === 4 && state.taBirthYear.length === 4) {
      result.birthMatch = birthMatch.getBirthMatch(state.myBirthYear, state.myBirthday, state.taBirthYear, state.taBirthday);
    }

    var myBirth = buildBirthInfo(state.myBirthYear, state.myBirthday, state.myBirthTime, state.myCity);
    var taBirth = buildBirthInfo(state.taBirthYear, state.taBirthday, state.taBirthTime, state.taCity);
    if (myBirth && taBirth) {
      try {
        var myChart = astrology.getNatalChart(myBirth);
        var taChart = astrology.getNatalChart(taBirth);
        result.natalChart = { my: myChart, ta: taChart };
        result.synastry = astrology.getSynastry(myChart, taChart);
      } catch (e) { console.error('性格星图计算失败', e); }
    } else if (myBirth) {
      try { result.natalChart = { my: astrology.getNatalChart(myBirth), ta: null }; } catch (e) { console.error(e); }
    }

    App.store.lastMatch = result;
    App.go('result');
  }

  var page = {
    render: function () { return App.nav('情感契合度分析') + '<div class="page" id="matchingBody">' + page._bodyHtml() + '</div>'; },
    renderBody: function () {
      var el = document.getElementById('matchingBody');
      if (el) el.innerHTML = page._bodyHtml();
    },
    _bodyHtml: function () {
      var h = '';
      h += '<div class="section-title">' + App.t('情感契合度分析') + '</div>';
      h += '<div class="section-sub">' + App.t('星座 · 属相 · 出生信息，任意填写一项即可查看契合度') + '</div>';

      // 星座
      h += '<div class="card" style="margin-top:16px;"><div class="card-title">✨ ' + App.t('星座') + '</div>';
      h += '<div class="card-tip">' + App.t('双方都填 = 缘分配对；只填一方 = 个人年度情感状态') + '</div>';
      h += '<div class="custom-select"><select id="myZ" onchange="App.pages.matching.onMyZ(this.value)">' + zodiacOptions(state.myZIdx) + '</select></div>';
      h += '<div class="divider" style="margin:12px 0;"></div>';
      h += '<div class="custom-select"><select id="taZ" onchange="App.pages.matching.onTaZ(this.value)">' + zodiacOptions(state.taZIdx) + '</select></div>';
      h += '</div>';

      // 属相
      h += '<div class="card"><div class="card-title">🐾 ' + App.t('属相') + '</div>';
      h += '<div class="card-tip">' + App.t('双方都填 = 生肖缘分；只填一方 = 属相年度情感状态') + '</div>';
      h += '<div class="custom-select"><select id="myA" onchange="App.pages.matching.onMyA(this.value)">' + animalOptions(state.myAIdx) + '</select></div>';
      h += '<div class="divider" style="margin:12px 0;"></div>';
      h += '<div class="custom-select"><select id="taA" onchange="App.pages.matching.onTaA(this.value)">' + animalOptions(state.taAIdx) + '</select></div>';
      h += '</div>';

      // 出生信息
      h += '<div class="card"><div class="card-title">🎂 ' + App.t('出生信息') + '</div>';
      h += '<div class="card-tip">' + App.t('填全出生年+生日+时间+地点，可获得专业性格星图配对（上升星座/行星/相位）') + '</div>';

      // 我的
      h += '<div class="birth-section"><div class="birth-person">' + App.t('你的') + '</div><div class="birth-inputs">';
      h += '<input class="birth-input" type="number" placeholder="' + App.t('出生年 如1995') + '" value="' + state.myBirthYear + '" oninput="App.pages.matching.onMyYear(this.value)"/>';
      h += '<div class="birth-picker"><div class="custom-select"><select onchange="App.pages.matching.onMyMonth(this.value)">' + monthOptions(state.myMonthIdx) + '</select></div></div>';
      h += '<div class="birth-picker"><div class="custom-select"><select onchange="App.pages.matching.onMyDay(this.value)">' + dayOptions(App.buildDays(state.myMonthIdx || 1), state.myDayIdx) + '</select></div></div>';
      h += '</div></div>';
      h += '<div class="birth-section"><div class="birth-person"></div><div class="birth-inputs">';
      h += '<div class="birth-picker"><div class="custom-select"><select onchange="App.pages.matching.onMyTime(this.value)">' + App.timeOptions(state.myBirthTime) + '</select></div></div>';
      h += '<input class="birth-input" placeholder="' + App.t('出生城市 如北京') + '" value="' + state.myCity + '" oninput="App.pages.matching.onMyCity(this.value)"/>';
      h += '</div></div>';

      h += '<div class="divider" style="margin:12px 0;"></div>';

      // TA的
      h += '<div class="birth-section"><div class="birth-person">' + App.t('TA的') + '</div><div class="birth-inputs">';
      h += '<input class="birth-input" type="number" placeholder="' + App.t('出生年 如1996') + '" value="' + state.taBirthYear + '" oninput="App.pages.matching.onTaYear(this.value)"/>';
      h += '<div class="birth-picker"><div class="custom-select"><select onchange="App.pages.matching.onTaMonth(this.value)">' + monthOptions(state.taMonthIdx) + '</select></div></div>';
      h += '<div class="birth-picker"><div class="custom-select"><select onchange="App.pages.matching.onTaDay(this.value)">' + dayOptions(App.buildDays(state.taMonthIdx || 1), state.taDayIdx) + '</select></div></div>';
      h += '</div></div>';
      h += '<div class="birth-section"><div class="birth-person"></div><div class="birth-inputs">';
      h += '<div class="birth-picker"><div class="custom-select"><select onchange="App.pages.matching.onTaTime(this.value)">' + App.timeOptions(state.taBirthTime) + '</select></div></div>';
      h += '<input class="birth-input" placeholder="' + App.t('出生城市 如上海') + '" value="' + state.taCity + '" oninput="App.pages.matching.onTaCity(this.value)"/>';
      h += '</div></div>';

      if (state.autoHint) h += '<div class="birth-auto" id="autoHint"><span class="birth-auto-text">✨ ' + state.autoHint + '</span></div>';
      h += '</div>';

      // 年份
      h += '<div class="card"><div class="card-title">📅 ' + App.t('查看年份') + '</div>';
      h += '<div class="custom-select"><select onchange="App.pages.matching.onYear(this.value)">' + yearOptions(state.yearIdx) + '</select></div>';
      h += '</div>';

      h += '<button class="btn-primary mt40" onclick="App.pages.matching.onStart()">' + App.t('开始分析') + '</button>';
      h += App.footer();
      return h;
    },

    onMyZ: function (v) { state.myZIdx = Number(v); },
    onTaZ: function (v) { state.taZIdx = Number(v); },
    onMyA: function (v) { state.myAIdx = Number(v); },
    onTaA: function (v) { state.taAIdx = Number(v); },
    onYear: function (v) { state.yearIdx = Number(v); },
    onMyYear: function (v) { onMyYearInput(v); },
    onTaYear: function (v) { onTaYearInput(v); },
    onMyMonth: function (v) {
      var mi = Number(v);
      state.myMonthIdx = mi; state.myDayIdx = 0;
      applyMyBirthday();
    },
    onMyDay: function (v) { state.myDayIdx = Number(v); applyMyBirthday(); },
    onTaMonth: function (v) {
      var mi = Number(v);
      state.taMonthIdx = mi; state.taDayIdx = 0;
      applyTaBirthday();
    },
    onTaDay: function (v) { state.taDayIdx = Number(v); applyTaBirthday(); },
    onMyTime: function (v) { state.myBirthTime = v; updateAutoHint(); App.pages.matching.syncHint(); },
    onTaTime: function (v) { state.taBirthTime = v; updateAutoHint(); App.pages.matching.syncHint(); },
    onMyCity: function (v) { state.myCity = v; updateAutoHint(); App.pages.matching.syncHint(); },
    onTaCity: function (v) { state.taCity = v; updateAutoHint(); App.pages.matching.syncHint(); },
    syncHint: function () {
      var el = document.getElementById('autoHint');
      if (!el) return;
      if (state.autoHint) {
        el.style.display = '';
        el.innerHTML = '<span class="birth-auto-text">✨ ' + state.autoHint + '</span>';
      } else {
        el.style.display = 'none';
      }
    },
    onStart: onStart
  };

  App.pages.matching = page;
})();
