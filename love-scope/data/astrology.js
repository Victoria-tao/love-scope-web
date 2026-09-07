// data/astrology.js 专业星盘计算（上升星座+行星+宫位+相位+配对）
// 简化版天文学计算，适用于娱乐用途

const ZODIAC_NAMES = ['白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座','水瓶座','双鱼座'];
const ZODIAC_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
const PLANET_NAMES = { sun:'太阳', moon:'月亮', mercury:'水星', venus:'金星', mars:'火星', jupiter:'木星', saturn:'土星' };
const PLANET_SYMBOLS = { sun:'☉', moon:'☽', mercury:'☿', venus:'♀', mars:'♂', jupiter:'♃', saturn:'♄' };

// 中国主要城市经纬度（东经, 北纬）
const CITIES = [
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

// 角度归一化 0-360
function norm360(deg) {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

// 黄经 → 星座索引 0-11
function zodiacIndex(deg) {
  return Math.floor(norm360(deg) / 30);
}

// 儒略日计算（公历日期 → JD）
function toJulianDay(year, month, day, hour, minute) {
  if (month <= 2) { year -= 1; month += 12; }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  const JD = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
  return JD + (hour + minute / 60) / 24;
}

// 格林威治平恒星时（度）
function getGMST(jd) {
  const T = (jd - 2451545.0) / 36525;
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - T * T * T / 38710000;
  return norm360(gmst);
}

/**
 * 计算上升星座（黄经）
 * @param {number} year 出生年
 * @param {number} month 月
 * @param {number} day 日
 * @param {number} hour 时（北京时间）
 * @param {number} minute 分
 * @param {number} lon 经度（东经正）
 * @param {number} lat 纬度（北纬正）
 * @returns {number} 上升点黄经 0-360
 */
function getAscendantDegree(year, month, day, hour, minute, lon, lat) {
  // 北京时间 → UT
  const utHour = hour - 8;
  let utDay = day, utMonth = month, utYear = year;
  let h = utHour + minute / 60;
  if (h < 0) { h += 24; utDay -= 1; }
  if (utDay < 1) {
    utMonth -= 1;
    if (utMonth < 1) { utMonth = 12; utYear -= 1; }
    const daysInMonth = [31, utYear % 4 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    utDay = daysInMonth[utMonth - 1];
  }

  const jd = toJulianDay(utYear, utMonth, utDay, Math.floor(h), (h % 1) * 60);
  const gmst = getGMST(jd);
  const lst = norm360(gmst + lon); // 当地恒星时
  const epsilon = 23.4397; // 黄赤交角
  const latRad = lat * Math.PI / 180;
  const epsRad = epsilon * Math.PI / 180;
  const lstRad = lst * Math.PI / 180;

  // 上升点公式
  const y = -Math.cos(lstRad);
  const x = Math.sin(lstRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad);
  let asc = Math.atan2(y, x) * 180 / Math.PI;
  return norm360(asc);
}

// J2000.0 基准行星黄经（2000-01-01 12:00 UT）和平均速度（度/天）
const PLANET_BASE = {
  sun:     { lon: 280.24, speed: 0.985647 },
  moon:    { lon: 205.82, speed: 13.176396 },
  mercury: { lon: 246.44, speed: 4.092377 },
  venus:   { lon: 325.61, speed: 1.602192 },
  mars:    { lon: 348.74, speed: 0.524033 },
  jupiter: { lon: 24.32,  speed: 0.083092 },
  saturn:  { lon: 40.25,  speed: 0.033460 }
};

/**
 * 计算行星黄经（简化平均轨道）
 */
function getPlanetLon(planet, year, month, day, hour, minute) {
  const jd = toJulianDay(year, month, day, hour - 8, minute); // 北京时间→UT
  const days = jd - 2451545.0 - 0.5; // 距J2000基准的天数
  const base = PLANET_BASE[planet];
  return norm360(base.lon + base.speed * days);
}

/**
 * 计算完整星盘
 * @param {Object} birth { year, month, day, hour, minute, lon, lat, cityName }
 * @returns {Object} 星盘数据
 */
function getNatalChart(birth) {
  const { year, month, day, hour, minute, lon, lat } = birth;
  const ascDeg = getAscendantDegree(year, month, day, hour, minute, lon, lat);
  const ascIdx = zodiacIndex(ascDeg);

  // 行星位置
  const planets = {};
  for (const key of Object.keys(PLANET_BASE)) {
    const lonDeg = getPlanetLon(key, year, month, day, hour, minute);
    const idx = zodiacIndex(lonDeg);
    planets[key] = {
      name: PLANET_NAMES[key],
      symbol: PLANET_SYMBOLS[key],
      longitude: Math.round(lonDeg * 100) / 100,
      zodiac: idx,
      zodiacName: ZODIAC_NAMES[idx],
      zodiacSymbol: ZODIAC_SYMBOLS[idx],
      degree: Math.round((lonDeg % 30) * 10) / 10
    };
  }

  // 整宫制宫位：第1宫=上升星座，依次排列
  const houses = [];
  for (let i = 0; i < 12; i++) {
    const zIdx = (ascIdx + i) % 12;
    houses.push({
      house: i + 1,
      zodiac: zIdx,
      zodiacName: ZODIAC_NAMES[zIdx],
      zodiacSymbol: ZODIAC_SYMBOLS[zIdx]
    });
  }

  // 行星落入宫位
  for (const key of Object.keys(planets)) {
    const p = planets[key];
    const houseIdx = ((p.zodiac - ascIdx) % 12 + 12) % 12 + 1;
    p.house = houseIdx;
  }

  // 主要相位（行星间）
  const aspects = calcAspects(planets);

  return {
    ascendant: { degree: Math.round(ascDeg * 100) / 100, zodiac: ascIdx, zodiacName: ZODIAC_NAMES[ascIdx], zodiacSymbol: ZODIAC_SYMBOLS[ascIdx] },
    planets,
    houses,
    aspects
  };
}

// 相位定义
const ASPECT_TYPES = [
  { name: '合相', symbol: '☌', angle: 0, orb: 8, positive: true },
  { name: '六合', symbol: '⚹', angle: 60, orb: 4, positive: true },
  { name: '拱相', symbol: '△', angle: 120, orb: 6, positive: true },
  { name: '刑相', symbol: '□', angle: 90, orb: 6, positive: false },
  { name: '冲相', symbol: '☍', angle: 180, orb: 8, positive: false }
];

/**
 * 计算星盘内主要相位
 */
function calcAspects(planets) {
  const keys = Object.keys(planets);
  const aspects = [];
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const p1 = planets[keys[i]];
      const p2 = planets[keys[j]];
      let diff = Math.abs(p1.longitude - p2.longitude);
      if (diff > 180) diff = 360 - diff;
      for (const asp of ASPECT_TYPES) {
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

/**
 * 星盘配对分析（比较盘）
 * @param {Object} chartA 我的星盘
 * @param {Object} chartB TA的星盘
 * @returns {Object} 配对分析
 */
function getSynastry(chartA, chartB) {
  // 1. 上升星座匹配
  const ascMatch = zodiacPairScore(chartA.ascendant.zodiac, chartB.ascendant.zodiac);

  // 2. 月亮星座匹配（情绪契合）
  const moonMatch = zodiacPairScore(chartA.planets.moon.zodiac, chartB.planets.moon.zodiac);

  // 3. 金星-火星相位（吸引力）
  const venusMarsAspects = [];
  // A金星 vs B火星
  const vm1 = crossAspects(chartA.planets.venus, chartB.planets.mars);
  if (vm1) venusMarsAspects.push({ ...vm1, desc: '你的金星 × TA的火星' });
  // B金星 vs A火星
  const vm2 = crossAspects(chartB.planets.venus, chartA.planets.mars);
  if (vm2) venusMarsAspects.push({ ...vm2, desc: 'TA的金星 × 你的火星' });

  // 4. 太阳-月亮相位（核心配合）
  const sunMoonAspects = [];
  const sm1 = crossAspects(chartA.planets.sun, chartB.planets.moon);
  if (sm1) sunMoonAspects.push({ ...sm1, desc: '你的太阳 × TA的月亮' });
  const sm2 = crossAspects(chartB.planets.sun, chartA.planets.moon);
  if (sm2) sunMoonAspects.push({ ...sm2, desc: 'TA的太阳 × 你的月亮' });

  // 5. 金星-金星相位（价值观）
  const venusVenus = crossAspects(chartA.planets.venus, chartB.planets.venus);

  // 综合评分
  let total = ascMatch.score * 0.2 + moonMatch.score * 0.25;
  let attraction = 0;
  if (venusMarsAspects.length) {
    attraction = venusMarsAspects.reduce((s, a) => s + (a.positive ? 85 : 55), 0) / venusMarsAspects.length;
  } else {
    attraction = 65;
  }
  let coreFit = 70;
  if (sunMoonAspects.length) {
    coreFit = sunMoonAspects.reduce((s, a) => s + (a.positive ? 88 : 60), 0) / sunMoonAspects.length;
  }
  total += attraction * 0.3 + coreFit * 0.25;
  total = Math.round(total);

  return {
    totalScore: total,
    levelTag: total >= 85 ? '星图深契' : total >= 72 ? '星图相和' : total >= 60 ? '星图互补' : '星图相磨',
    ascendantMatch: ascMatch,
    moonMatch,
    venusMarsAspects,
    sunMoonAspects,
    venusVenus,
    attractionScore: Math.round(attraction),
    coreFitScore: Math.round(coreFit)
  };
}

// 两个行星间的相位
function crossAspects(p1, p2) {
  let diff = Math.abs(p1.longitude - p2.longitude);
  if (diff > 180) diff = 360 - diff;
  for (const asp of ASPECT_TYPES) {
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

// 星座配对评分（简化版，基于元素和模式）
const ZODIAC_ELEMENTS = ['火','土','风','水','火','土','风','水','火','土','风','水'];
function zodiacPairScore(a, b) {
  const ea = ZODIAC_ELEMENTS[a], eb = ZODIAC_ELEMENTS[b];
  let score = 60;
  let text = '';
  if (ea === eb) { score = 80; text = '同元素，性情相近，容易理解'; }
  else if ((ea==='火'&&eb==='风')||(ea==='风'&&eb==='火')) { score = 85; text = '火风相生，热情与智性共振'; }
  else if ((ea==='土'&&eb==='水')||(ea==='水'&&eb==='土')) { score = 82; text = '土水相养，稳定与深情互补'; }
  else if ((ea==='火'&&eb==='水')||(ea==='水'&&eb==='火')) { score = 55; text = '火水相激，热情与情绪需调和'; }
  else if ((ea==='土'&&eb==='风')||(ea==='风'&&eb==='土')) { score = 58; text = '土风相疏，现实与理念需磨合'; }
  else { score = 70; text = '元素中和，关系平稳'; }
  // 相邻星座加一点
  if (Math.abs(a - b) === 1 || Math.abs(a - b) === 11) { score = Math.min(95, score + 5); text += '，相邻星座有天然吸引力'; }
  return { score, text, elementA: ea, elementB: eb };
}

// 解析生日字符串 "MM-DD"
function parseBirthday(str) {
  if (!str || !/^\d{2}-\d{2}$/.test(str)) return null;
  const [m, d] = str.split('-').map(Number);
  return { month: m, day: d };
}

// 解析时间字符串 "HH:MM"
function parseTime(str) {
  if (!str || !/^\d{2}:\d{2}$/.test(str)) return null;
  const [h, m] = str.split(':').map(Number);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return { hour: h, minute: m };
}

module.exports = {
  ZODIAC_NAMES, ZODIAC_SYMBOLS, CITIES,
  getNatalChart, getSynastry,
  getAscendantDegree, zodiacIndex, norm360,
  parseBirthday, parseTime,
  zodiacPairScore
};
