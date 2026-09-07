/**
 * data/astrology.js (Web版)
 * 专业星盘计算（上升星座+行星+宫位+相位+配对）—— 简化版天文学计算，娱乐用途
 */
(function () {
  var ZODIAC_NAMES = ['白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座','水瓶座','双鱼座'];
  var ZODIAC_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
  var PLANET_NAMES = { sun:'太阳', moon:'月亮', mercury:'水星', venus:'金星', mars:'火星', jupiter:'木星', saturn:'土星' };
  var PLANET_SYMBOLS = { sun:'☉', moon:'☽', mercury:'☿', venus:'♀', mars:'♂', jupiter:'♃', saturn:'♄' };

  var CITIES = [
    { name:'北京', lon:116.40, lat:39.90 }, { name:'上海', lon:121.47, lat:31.23 },
    { name:'广州', lon:113.27, lat:23.13 }, { name:'深圳', lon:114.06, lat:22.55 },
    { name:'成都', lon:104.07, lat:30.67 }, { name:'杭州', lon:120.15, lat:30.28 },
    { name:'武汉', lon:114.31, lat:30.59 }, { name:'西安', lon:108.95, lat:34.27 },
    { name:'重庆', lon:106.55, lat:29.56 }, { name:'南京', lon:118.78, lat:32.06 },
    { name:'天津', lon:117.20, lat:39.13 }, { name:'苏州', lon:120.58, lat:31.30 },
    { name:'长沙', lon:112.94, lat:28.23 }, { name:'郑州', lon:113.62, lat:34.75 },
    { name:'青岛', lon:120.38, lat:36.07 }, { name:'大连', lon:121.62, lat:38.92 },
    { name:'厦门', lon:118.09, lat:24.48 }, { name:'福州', lon:119.30, lat:26.08 },
    { name:'济南', lon:117.00, lat:36.65 }, { name:'合肥', lon:117.27, lat:31.86 },
    { name:'沈阳', lon:123.43, lat:41.80 }, { name:'长春', lon:125.32, lat:43.82 },
    { name:'哈尔滨', lon:126.53, lat:45.80 }, { name:'昆明', lon:102.72, lat:25.04 },
    { name:'贵阳', lon:106.63, lat:26.65 }, { name:'南宁', lon:108.37, lat:22.82 },
    { name:'海口', lon:110.33, lat:20.03 }, { name:'兰州', lon:103.83, lat:36.06 },
    { name:'乌鲁木齐', lon:87.62, lat:43.83 }, { name:'拉萨', lon:91.13, lat:29.65 },
    { name:'香港', lon:114.17, lat:22.32 }, { name:'澳门', lon:113.55, lat:22.20 },
    { name:'台北', lon:121.56, lat:25.03 }
  ];

  function norm360(deg) {
    var d = deg % 360;
    if (d < 0) d += 360;
    return d;
  }

  function zodiacIndex(deg) {
    return Math.floor(norm360(deg) / 30);
  }

  function toJulianDay(year, month, day, hour, minute) {
    if (month <= 2) { year -= 1; month += 12; }
    var A = Math.floor(year / 100);
    var B = 2 - A + Math.floor(A / 4);
    var JD = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
    return JD + (hour + minute / 60) / 24;
  }

  function getGMST(jd) {
    var T = (jd - 2451545.0) / 36525;
    var gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - T * T * T / 38710000;
    return norm360(gmst);
  }

  function getAscendantDegree(year, month, day, hour, minute, lon, lat) {
    var utHour = hour - 8;
    var utDay = day, utMonth = month, utYear = year;
    var h = utHour + minute / 60;
    if (h < 0) { h += 24; utDay -= 1; }
    if (utDay < 1) {
      utMonth -= 1;
      if (utMonth < 1) { utMonth = 12; utYear -= 1; }
      var daysInMonth = [31, utYear % 4 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      utDay = daysInMonth[utMonth - 1];
    }
    var jd = toJulianDay(utYear, utMonth, utDay, Math.floor(h), (h % 1) * 60);
    var gmst = getGMST(jd);
    var lst = norm360(gmst + lon);
    var epsilon = 23.4397;
    var latRad = lat * Math.PI / 180;
    var epsRad = epsilon * Math.PI / 180;
    var lstRad = lst * Math.PI / 180;
    var y = -Math.cos(lstRad);
    var x = Math.sin(lstRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad);
    var asc = Math.atan2(y, x) * 180 / Math.PI;
    return norm360(asc);
  }

  var PLANET_BASE = {
    sun:     { lon: 280.24, speed: 0.985647 },
    moon:    { lon: 205.82, speed: 13.176396 },
    mercury: { lon: 246.44, speed: 4.092377 },
    venus:   { lon: 325.61, speed: 1.602192 },
    mars:    { lon: 348.74, speed: 0.524033 },
    jupiter: { lon: 24.32,  speed: 0.083092 },
    saturn:  { lon: 40.25,  speed: 0.033460 }
  };

  function getPlanetLon(planet, year, month, day, hour, minute) {
    var jd = toJulianDay(year, month, day, hour - 8, minute);
    var days = jd - 2451545.0 - 0.5;
    var base = PLANET_BASE[planet];
    return norm360(base.lon + base.speed * days);
  }

  function getNatalChart(birth) {
    var year = birth.year, month = birth.month, day = birth.day, hour = birth.hour, minute = birth.minute, lon = birth.lon, lat = birth.lat;
    var ascDeg = getAscendantDegree(year, month, day, hour, minute, lon, lat);
    var ascIdx = zodiacIndex(ascDeg);

    var planets = {};
    Object.keys(PLANET_BASE).forEach(function (key) {
      var lonDeg = getPlanetLon(key, year, month, day, hour, minute);
      var idx = zodiacIndex(lonDeg);
      planets[key] = {
        name: PLANET_NAMES[key], symbol: PLANET_SYMBOLS[key],
        longitude: Math.round(lonDeg * 100) / 100,
        zodiac: idx, zodiacName: ZODIAC_NAMES[idx], zodiacSymbol: ZODIAC_SYMBOLS[idx],
        degree: Math.round((lonDeg % 30) * 10) / 10
      };
    });

    var houses = [];
    for (var i = 0; i < 12; i++) {
      var zIdx = (ascIdx + i) % 12;
      houses.push({ house: i + 1, zodiac: zIdx, zodiacName: ZODIAC_NAMES[zIdx], zodiacSymbol: ZODIAC_SYMBOLS[zIdx] });
    }

    Object.keys(planets).forEach(function (key) {
      var p = planets[key];
      var houseIdx = ((p.zodiac - ascIdx) % 12 + 12) % 12 + 1;
      p.house = houseIdx;
    });

    var aspects = calcAspects(planets);

    return {
      ascendant: { degree: Math.round(ascDeg * 100) / 100, zodiac: ascIdx, zodiacName: ZODIAC_NAMES[ascIdx], zodiacSymbol: ZODIAC_SYMBOLS[ascIdx] },
      planets: planets, houses: houses, aspects: aspects
    };
  }

  var ASPECT_TYPES = [
    { name: '合相', symbol: '☌', angle: 0, orb: 8, positive: true },
    { name: '六合', symbol: '⚹', angle: 60, orb: 4, positive: true },
    { name: '拱相', symbol: '△', angle: 120, orb: 6, positive: true },
    { name: '刑相', symbol: '□', angle: 90, orb: 6, positive: false },
    { name: '冲相', symbol: '☍', angle: 180, orb: 8, positive: false }
  ];

  function calcAspects(planets) {
    var keys = Object.keys(planets);
    var aspects = [];
    for (var i = 0; i < keys.length; i++) {
      for (var j = i + 1; j < keys.length; j++) {
        var p1 = planets[keys[i]];
        var p2 = planets[keys[j]];
        var diff = Math.abs(p1.longitude - p2.longitude);
        if (diff > 180) diff = 360 - diff;
        for (var ai = 0; ai < ASPECT_TYPES.length; ai++) {
          var asp = ASPECT_TYPES[ai];
          if (Math.abs(diff - asp.angle) <= asp.orb) {
            aspects.push({
              p1: keys[i], p1Name: p1.name, p1Symbol: p1.symbol,
              p2: keys[j], p2Name: p2.name, p2Symbol: p2.symbol,
              type: asp.name, symbol: asp.symbol, positive: asp.positive,
              orb: Math.round(Math.abs(diff - asp.angle) * 10) / 10
            });
            break;
          }
        }
      }
    }
    return aspects;
  }

  function crossAspects(p1, p2) {
    var diff = Math.abs(p1.longitude - p2.longitude);
    if (diff > 180) diff = 360 - diff;
    for (var ai = 0; ai < ASPECT_TYPES.length; ai++) {
      var asp = ASPECT_TYPES[ai];
      if (Math.abs(diff - asp.angle) <= asp.orb) {
        return {
          p1Name: p1.name, p1Symbol: p1.symbol, p1Zodiac: p1.zodiacName,
          p2Name: p2.name, p2Symbol: p2.symbol, p2Zodiac: p2.zodiacName,
          type: asp.name, symbol: asp.symbol, positive: asp.positive,
          orb: Math.round(Math.abs(diff - asp.angle) * 10) / 10
        };
      }
    }
    return null;
  }

  var ZODIAC_ELEMENTS = ['火','土','风','水','火','土','风','水','火','土','风','水'];
  function zodiacPairScore(a, b) {
    var ea = ZODIAC_ELEMENTS[a], eb = ZODIAC_ELEMENTS[b];
    var score = 60;
    var text = '';
    if (ea === eb) { score = 80; text = '同元素，性情相近，容易理解'; }
    else if ((ea==='火'&&eb==='风')||(ea==='风'&&eb==='火')) { score = 85; text = '火风相生，热情与智性共振'; }
    else if ((ea==='土'&&eb==='水')||(ea==='水'&&eb==='土')) { score = 82; text = '土水相养，稳定与深情互补'; }
    else if ((ea==='火'&&eb==='水')||(ea==='水'&&eb==='火')) { score = 55; text = '火水相激，热情与情绪需调和'; }
    else if ((ea==='土'&&eb==='风')||(ea==='风'&&eb==='土')) { score = 58; text = '土风相疏，现实与理念需磨合'; }
    else { score = 70; text = '元素中和，关系平稳'; }
    if (Math.abs(a - b) === 1 || Math.abs(a - b) === 11) { score = Math.min(95, score + 5); text += '，相邻星座有天然吸引力'; }
    return { score: score, text: text, elementA: ea, elementB: eb };
  }

  function getSynastry(chartA, chartB) {
    var ascMatch = zodiacPairScore(chartA.ascendant.zodiac, chartB.ascendant.zodiac);
    var moonMatch = zodiacPairScore(chartA.planets.moon.zodiac, chartB.planets.moon.zodiac);

    var venusMarsAspects = [];
    var vm1 = crossAspects(chartA.planets.venus, chartB.planets.mars);
    if (vm1) { vm1.desc = '你的金星 × TA的火星'; venusMarsAspects.push(vm1); }
    var vm2 = crossAspects(chartB.planets.venus, chartA.planets.mars);
    if (vm2) { vm2.desc = 'TA的金星 × 你的火星'; venusMarsAspects.push(vm2); }

    var sunMoonAspects = [];
    var sm1 = crossAspects(chartA.planets.sun, chartB.planets.moon);
    if (sm1) { sm1.desc = '你的太阳 × TA的月亮'; sunMoonAspects.push(sm1); }
    var sm2 = crossAspects(chartB.planets.sun, chartA.planets.moon);
    if (sm2) { sm2.desc = 'TA的太阳 × 你的月亮'; sunMoonAspects.push(sm2); }

    var venusVenus = crossAspects(chartA.planets.venus, chartB.planets.venus);

    var total = ascMatch.score * 0.2 + moonMatch.score * 0.25;
    var attraction = 0;
    if (venusMarsAspects.length) {
      attraction = venusMarsAspects.reduce(function (s, a) { return s + (a.positive ? 85 : 55); }, 0) / venusMarsAspects.length;
    } else {
      attraction = 65;
    }
    var coreFit = 70;
    if (sunMoonAspects.length) {
      coreFit = sunMoonAspects.reduce(function (s, a) { return s + (a.positive ? 88 : 60); }, 0) / sunMoonAspects.length;
    }
    total += attraction * 0.3 + coreFit * 0.25;
    total = Math.round(total);

    return {
      totalScore: total,
      levelTag: total >= 85 ? '星图深契' : total >= 72 ? '星图相和' : total >= 60 ? '星图互补' : '星图相磨',
      ascendantMatch: ascMatch, moonMatch: moonMatch,
      venusMarsAspects: venusMarsAspects, sunMoonAspects: sunMoonAspects, venusVenus: venusVenus,
      attractionScore: Math.round(attraction), coreFitScore: Math.round(coreFit)
    };
  }

  function parseBirthday(str) {
    if (!str || !/^\d{2}-\d{2}$/.test(str)) return null;
    var parts = str.split('-').map(Number);
    return { month: parts[0], day: parts[1] };
  }

  function parseTime(str) {
    if (!str || !/^\d{2}:\d{2}$/.test(str)) return null;
    var parts = str.split(':').map(Number);
    if (parts[0] < 0 || parts[0] > 23 || parts[1] < 0 || parts[1] > 59) return null;
    return { hour: parts[0], minute: parts[1] };
  }

  window.AST = {
    ZODIAC_NAMES: ZODIAC_NAMES, ZODIAC_SYMBOLS: ZODIAC_SYMBOLS, CITIES: CITIES,
    getNatalChart: getNatalChart, getSynastry: getSynastry,
    getAscendantDegree: getAscendantDegree, zodiacIndex: zodiacIndex, norm360: norm360,
    parseBirthday: parseBirthday, parseTime: parseTime, zodiacPairScore: zodiacPairScore
  };
})();
