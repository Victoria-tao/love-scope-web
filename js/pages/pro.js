/**
 * pages/pro.js — 深度匹配 PRO 输入（六维综合）
 */
(function () {
  var zodiac = window.ZD, animal = window.ZA, birthMatch = window.BM, astrology = window.AST, tarotData = window.TR, engine = window.TE;

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
      s += '<option value="' + i + '" ' + (i === selected ? 'selected' : '') + '>' + n + (i > 0 ? '（' + zodiacDates[i] + '）' : '') + '</option>';
    });
    return s;
  }
  function animalOptions(selected) {
    var s = '';
    animalNames.forEach(function (n, i) { s += '<option value="' + i + '" ' + (i === selected ? 'selected' : '') + '>' + n + '</option>'; });
    return s;
  }
  function monthOptions(selected) {
    var s = '';
    App.months.forEach(function (n, i) { s += '<option value="' + i + '" ' + (i === selected ? 'selected' : '') + '>' + n + '</option>'; });
    return s;
  }
  function dayOptions(days, selected) {
    var s = '';
    days.forEach(function (n, i) { s += '<option value="' + i + '" ' + (i === selected ? 'selected' : '') + '>' + n + '</option>'; });
    return s;
  }
  function yearOptions(selected) {
    var s = '';
    years.forEach(function (n, i) { s += '<option value="' + i + '" ' + (i === selected ? 'selected' : '') + '>' + n + '</option>'; });
    return s;
  }

  function updateAutoHint() {
    var hints = [];
    if (state.myBirthday && state.myZIdx > 0) hints.push('你的星座已自动填充');
    if (state.taBirthday && state.taZIdx > 0) hints.push('TA的星座已自动填充');
    if (state.myBirthYear && state.myAIdx > 0) hints.push('你的属相已自动填充');
    if (state.taBirthYear && state.taAIdx > 0) hints.push('TA的属相已自动填充');
    var myReady = state.myBirthYear && state.myBirthday && state.myBirthTime && state.myCity.trim();
    var taReady = state.taBirthYear && state.taBirthday && state.taBirthTime && state.taCity.trim();
    if (myReady && taReady) hints.push('专业性格星图已就绪，六维深度报告可生成');
    else if (myReady || taReady) hints.push('补全另一方出生信息可解锁性格星图维度');
    state.autoHint = hints.join('，');
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
    return { year: parseInt(yearStr), month: bd.month, day: bd.day, hour: tm.hour, minute: tm.minute, lon: coords.lon, lat: coords.lat, cityName: coords.name };
  }

  function applyMyBirthday() {
    var mi = state.myMonthIdx, di = state.myDayIdx;
    if (mi > 0 && di > 0) {
      var m = mi < 10 ? '0' + mi : '' + mi;
      var d = di < 10 ? '0' + di : '' + di;
      state.myBirthday = m + '-' + d;
      if (state.myZIdx === 0) state.myZIdx = birthMatch.getZodiacIndexByBirthday(mi, di) + 1;
    } else { state.myBirthday = ''; }
    updateAutoHint(); page.renderBody();
  }
  function applyTaBirthday() {
    var mi = state.taMonthIdx, di = state.taDayIdx;
    if (mi > 0 && di > 0) {
      var m = mi < 10 ? '0' + mi : '' + mi;
      var d = di < 10 ? '0' + di : '' + di;
      state.taBirthday = m + '-' + d;
      if (state.taZIdx === 0) state.taZIdx = birthMatch.getZodiacIndexByBirthday(mi, di) + 1;
    } else { state.taBirthday = ''; }
    updateAutoHint(); page.renderBody();
  }

  function onStart() {
    var thisYear = new Date().getFullYear();
    var year = state.yearIdx === 0 ? thisYear : thisYear + 1;
    var hasAny = state.myZIdx > 0 || state.taZIdx > 0 || state.myAIdx > 0 || state.taAIdx > 0 || state.myBirthYear || state.taBirthYear;
    if (!hasAny) { App.toast('请至少选择一项'); return; }

    var result = {
      year: year, myInfo: {}, taInfo: {},
      zodiacPair: null, animalPair: null, birthMatch: null,
      natalChart: null, synastry: null, yearFortune: null, tarot: null
    };

    if (state.myZIdx > 0 && state.taZIdx > 0) {
      var maName = state.myAIdx > 0 ? animalNames[state.myAIdx] : null;
      var taName = state.taAIdx > 0 ? animalNames[state.taAIdx] : null;
      result.zodiacPair = zodiac.getMatch(state.myZIdx - 1, state.taZIdx - 1, state.yearIdx === 0 ? 'this' : 'next', maName, taName);
      result.myInfo.zodiac = result.zodiacPair.me.fullName;
      result.taInfo.zodiac = result.zodiacPair.ta.fullName;
    }
    if (state.myAIdx > 0 && state.taAIdx > 0) {
      result.animalPair = animal.getAnimalMatch(state.myAIdx - 1, state.taAIdx - 1);
      result.myInfo.animal = animalNames[state.myAIdx];
      result.taInfo.animal = animalNames[state.taAIdx];
    }
    if (state.myBirthYear && state.taBirthYear && state.myBirthYear.length === 4 && state.taBirthYear.length === 4) {
      result.birthMatch = birthMatch.getBirthMatch(state.myBirthYear, state.myBirthday, state.taBirthYear, state.taBirthday);
    }
    var myBirth = buildBirthInfo(state.myBirthYear, state.myBirthday, state.myBirthTime, state.myCity);
    var taBirth = buildBirthInfo(state.taBirthYear, state.taBirthday, state.taBirthTime, state.taCity);
    if (myBirth && taBirth) {
      try {
        result.natalChart = { my: astrology.getNatalChart(myBirth), ta: astrology.getNatalChart(taBirth) };
        result.synastry = astrology.getSynastry(result.natalChart.my, result.natalChart.ta);
      } catch (e) { console.error('星图计算失败', e); }
    }
    result.yearFortune = window.YF.getYearFortune(year);
    var drawn = engine.drawCards(tarotData.TAROT, 1, '');
    var card = drawn[0];
    card.card.image = App.tarotImage(card.card.id);
    result.tarot = card;

    App.store.proResult = result;
    App.go('pro-result');
  }

  var page = {
    render: function () {
      return App.nav('深度匹配 PRO') + '<div class="page" id="proBody">' + page._bodyHtml() + '</div>';
    },
    renderBody: function () {
      var el = document.getElementById('proBody');
      if (el) el.innerHTML = page._bodyHtml();
    },
    _bodyHtml: function () {
      var h = '';
      h += '<div class="section-title">深度匹配 PRO</div>';
      h += '<div class="section-sub">星座 · 属相 · 生辰 · 星盘 · 年度 · 卡牌 六维综合深度报告</div>';

      h += '<div class="card" style="margin-top:16px;"><div class="card-title">✨ 星座</div>';
      h += '<div class="custom-select"><select id="pMyZ" onchange="App.pages.pro.onMyZ(this.value)">' + zodiacOptions(state.myZIdx) + '</select></div>';
      h += '<div class="divider" style="margin:12px 0;"></div>';
      h += '<div class="custom-select"><select id="pTaZ" onchange="App.pages.pro.onTaZ(this.value)">' + zodiacOptions(state.taZIdx) + '</select></div>';
      h += '</div>';

      h += '<div class="card"><div class="card-title">🐾 属相</div>';
      h += '<div class="custom-select"><select id="pMyA" onchange="App.pages.pro.onMyA(this.value)">' + animalOptions(state.myAIdx) + '</select></div>';
      h += '<div class="divider" style="margin:12px 0;"></div>';
      h += '<div class="custom-select"><select id="pTaA" onchange="App.pages.pro.onTaA(this.value)">' + animalOptions(state.taAIdx) + '</select></div>';
      h += '</div>';

      h += '<div class="card"><div class="card-title">🎂 出生信息（全填可解锁星盘维度）</div>';
      h += '<div class="birth-section"><div class="birth-person">你的</div><div class="birth-inputs">';
      h += '<input class="birth-input" type="number" placeholder="出生年" value="' + state.myBirthYear + '" oninput="App.pages.pro.onMyYear(this.value)"/>';
      h += '<div class="birth-picker"><div class="custom-select"><select onchange="App.pages.pro.onMyMonth(this.value)">' + monthOptions(state.myMonthIdx) + '</select></div></div>';
      h += '<div class="birth-picker"><div class="custom-select"><select onchange="App.pages.pro.onMyDay(this.value)">' + dayOptions(App.buildDays(state.myMonthIdx || 1), state.myDayIdx) + '</select></div></div>';
      h += '</div></div>';
      h += '<div class="birth-section"><div class="birth-person"></div><div class="birth-inputs">';
      h += '<div class="birth-picker"><div class="custom-select"><select onchange="App.pages.pro.onMyTime(this.value)">' + App.timeOptions(state.myBirthTime) + '</select></div></div>';
      h += '<input class="birth-input" placeholder="出生城市" value="' + state.myCity + '" oninput="App.pages.pro.onMyCity(this.value)"/>';
      h += '</div></div>';
      h += '<div class="divider" style="margin:12px 0;"></div>';
      h += '<div class="birth-section"><div class="birth-person">TA的</div><div class="birth-inputs">';
      h += '<input class="birth-input" type="number" placeholder="出生年" value="' + state.taBirthYear + '" oninput="App.pages.pro.onTaYear(this.value)"/>';
      h += '<div class="birth-picker"><div class="custom-select"><select onchange="App.pages.pro.onTaMonth(this.value)">' + monthOptions(state.taMonthIdx) + '</select></div></div>';
      h += '<div class="birth-picker"><div class="custom-select"><select onchange="App.pages.pro.onTaDay(this.value)">' + dayOptions(App.buildDays(state.taMonthIdx || 1), state.taDayIdx) + '</select></div></div>';
      h += '</div></div>';
      h += '<div class="birth-section"><div class="birth-person"></div><div class="birth-inputs">';
      h += '<div class="birth-picker"><div class="custom-select"><select onchange="App.pages.pro.onTaTime(this.value)">' + App.timeOptions(state.taBirthTime) + '</select></div></div>';
      h += '<input class="birth-input" placeholder="出生城市" value="' + state.taCity + '" oninput="App.pages.pro.onTaCity(this.value)"/>';
      h += '</div></div>';
      if (state.autoHint) h += '<div class="birth-auto" id="pAutoHint"><span class="birth-auto-text">✨ ' + state.autoHint + '</span></div>';
      h += '</div>';

      h += '<div class="card"><div class="card-title">📅 查看年份</div>';
      h += '<div class="custom-select"><select onchange="App.pages.pro.onYear(this.value)">' + yearOptions(state.yearIdx) + '</select></div>';
      h += '</div>';

      h += '<button class="btn-primary mt40" onclick="App.pages.pro.onStart()">开始深度分析</button>';
      h += App.footer();
      return h;
    },

    onMyZ: function (v) { state.myZIdx = Number(v); },
    onTaZ: function (v) { state.taZIdx = Number(v); },
    onMyA: function (v) { state.myAIdx = Number(v); },
    onTaA: function (v) { state.taAIdx = Number(v); },
    onYear: function (v) { state.yearIdx = Number(v); },
    onMyYear: function (v) {
      state.myBirthYear = v;
      if (v && v.length === 4 && state.myAIdx === 0) {
        var ai = birthMatch.getAnimalIndexByYear(parseInt(v)) + 1;
        if (ai > 0 && ai <= 12) {
          state.myAIdx = ai;
          var sel = document.getElementById('pMyA');
          if (sel) sel.value = ai;
        }
      }
      updateAutoHint();
      App.pages.pro.syncHint();
    },
    onTaYear: function (v) {
      state.taBirthYear = v;
      if (v && v.length === 4 && state.taAIdx === 0) {
        var ai = birthMatch.getAnimalIndexByYear(parseInt(v)) + 1;
        if (ai > 0 && ai <= 12) {
          state.taAIdx = ai;
          var sel = document.getElementById('pTaA');
          if (sel) sel.value = ai;
        }
      }
      updateAutoHint();
      App.pages.pro.syncHint();
    },
    onMyMonth: function (v) { state.myMonthIdx = Number(v); state.myDayIdx = 0; applyMyBirthday(); },
    onMyDay: function (v) { state.myDayIdx = Number(v); applyMyBirthday(); },
    onTaMonth: function (v) { state.taMonthIdx = Number(v); state.taDayIdx = 0; applyTaBirthday(); },
    onTaDay: function (v) { state.taDayIdx = Number(v); applyTaBirthday(); },
    onMyTime: function (v) { state.myBirthTime = v; updateAutoHint(); App.pages.pro.syncHint(); },
    onTaTime: function (v) { state.taBirthTime = v; updateAutoHint(); App.pages.pro.syncHint(); },
    onMyCity: function (v) { state.myCity = v; updateAutoHint(); App.pages.pro.syncHint(); },
    onTaCity: function (v) { state.taCity = v; updateAutoHint(); App.pages.pro.syncHint(); },
    syncHint: function () {
      var el = document.getElementById('pAutoHint');
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

  App.pages.pro = page;
})();
