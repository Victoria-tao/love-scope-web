/**
 * pages/daily.js — 每日日历（黄历 + 星座/属相运势 + 日历选日）
 */
(function () {
  var zodiacData = window.ZD, animalData = window.ZA;

  var state = {
    zodiacs: zodiacData.ZODIAC.map(function (z) { return z.name; }),
    animals: animalData.ANIMALS.map(function (a) { return a.name; }),
    zodiacIndex: 0, animalIndex: 0,
    selectedYear: 0, selectedMonth: 0, selectedDay: 0,
    selectedDateText: '', isSelectedToday: true,
    calendarDays: [], currentMonth: '', currentYear: 0, currentMonthIdx: 0,
    zodiacFortune: null, animalFortune: null, huangli: null, summary: ''
  };

  function getDayOfYear(date) {
    var start = new Date(date.getFullYear(), 0, 0);
    var diff = date - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
  function calcScore(seed, offset) {
    var base = (seed * 37 + offset * 13) % 100;
    return Math.max(45, Math.min(95, base + 30));
  }
  function getLevel(score) {
    var isEn = App.lang === 'en';
    if (score >= 85) return isEn ? 'Excellent' : '状态佳';
    if (score >= 75) return isEn ? 'Good' : '状态良好';
    if (score >= 65) return isEn ? 'Stable' : '状态平稳';
    if (score >= 55) return isEn ? 'Average' : '状态一般';
    return isEn ? 'Low' : '状态平';
  }
  function getScoreColor(score) {
    if (score >= 85) return '#ffd700';
    if (score >= 75) return '#f0a8c0';
    if (score >= 65) return '#c4a8e8';
    return '#a0b0e0';
  }
  function getLuckyItem(seed, day) {
    var colors = ['金色', '粉色', '紫色', '蓝色', '绿色', '白色', '红色', '黄色', '青色', '橙色', '银白', '绯红'];
    var numbers = ['3', '5', '7', '8', '9', '6', '2', '1', '4', '10', '11', '12'];
    var directions = ['东', '南', '西', '北', '东南', '西北', '东北', '西南'];
    return {
      color: colors[(seed + day) % colors.length],
      number: numbers[(seed * 2 + day) % numbers.length],
      direction: directions[(seed + day * 2) % directions.length]
    };
  }

  // 星座运势文字：分数 5 档 + 星座元素/关键词 + 日期变体，避免同档文案雷同
  function getZodiacAdvice(zodiac, score, seed) {
    var name = zodiac.name + '座';
    var kw0 = zodiac.keywords[0] || '自信';
    var kw1 = zodiac.keywords[1] || '从容';
    var el = zodiac.element || '火';
    var v = seed % 2;
    if (score >= 88) {
      return v === 0 ? name + '今日高光，' + el + '象能量全开，' + kw0 + '的你适合大胆推进，主动表达会得到热烈回应。'
        : name + '今天气场很足，' + kw0 + '与' + kw1 + '同时在线，宜把握关键节点，勇敢做决定。';
    }
    if (score >= 78) {
      return v === 0 ? name + '整体顺遂，' + el + '象氛围加持，' + kw0 + '的特质帮你打开局面，适合社交与合作。'
        : name + '今天状态上扬，保持' + kw1 + '的心态稳步推进，会有小惊喜。';
    }
    if (score >= 66) {
      return v === 0 ? name + '今日平稳，按部就班即可，' + kw0 + '是你的加分项，别急也别拖。'
        : name + '状态中等，多倾听少冲动，' + el + '象的洞察力会帮你避开小麻烦。';
    }
    if (score >= 55) {
      return v === 0 ? name + '今天略需耐心，' + kw1 + '一点，遇事先缓一缓，晚上情绪会回稳。'
        : name + '气场偏弱，宜低调，把' + kw0 + '用在刀刃上，避开争执。';
    }
    return v === 0 ? name + '今日宜养精蓄锐，' + el + '象能量收敛，静下来反而能看清方向。'
      : name + '状态欠佳，别硬撑，先照顾好自己节奏，明天再出发。';
  }

  // 属相运势文字：分数 5 档 + 属相五行/关键词 + 日期变体
  function getAnimalAdvice(animal, score, seed) {
    var name = animal.name + '年生人';
    var kw0 = animal.keywords[0] || '稳重';
    var kw1 = animal.keywords[1] || '踏实';
    var wx = animal.wx || '土';
    var v = seed % 2;
    if (score >= 88) {
      return v === 0 ? name + '今日运程亮眼，' + wx + '行得势，' + kw0 + '的你容易获得贵人助力，宜主动争取。'
        : name + '今天顺风顺水，' + kw0 + '与' + kw1 + '并举，适合谈合作、见重要的人。';
    }
    if (score >= 78) {
      return v === 0 ? name + '整体向好，' + wx + '行相生，' + kw0 + '的特质带来好人缘，适合社交。'
        : name + '今天状态不错，保持' + kw1 + '的节奏，稳中有进。';
    }
    if (score >= 66) {
      return v === 0 ? name + '今日平稳，' + kw0 + '照常发挥即可，注意别被琐事牵绊。'
        : name + '状态中等，宜守正出奇，' + kw1 + '一点反而更顺。';
    }
    if (score >= 55) {
      return v === 0 ? name + '今天略感吃力，' + kw1 + '为先，重要决定缓一缓再说。'
        : name + '气场偏沉，少说多做，避开' + wx + '相冲的人与事。';
    }
    return v === 0 ? name + '今日宜静不宜动，' + kw0 + '用在修养上，明天会更好。'
      : name + '状态欠佳，先照顾身体和情绪，别勉强自己。';
  }

  function generateFortunes() {
    var zodiac = zodiacData.ZODIAC[state.zodiacIndex];
    var animal = animalData.ANIMALS[state.animalIndex];
    var date = new Date(state.selectedYear, state.selectedMonth, state.selectedDay);
    var dayOfYear = getDayOfYear(date);
    var huangli = state.huangli;
    var isEn = App.lang === 'en';

    var zodiacScore = calcScore(dayOfYear + state.zodiacIndex, 5);
    var animalScore = calcScore(dayOfYear + state.animalIndex, 7);

    var zodiacFortune = {
      name: zodiac.name, score: zodiacScore, level: getLevel(zodiacScore),
      color: getScoreColor(zodiacScore),
      lucky: getLuckyItem(state.zodiacIndex, dayOfYear),
      advice: isEn
        ? (zodiacScore >= 75 ? App.t(zodiac.fullName) + ': High energy day—take initiative and express yourself.' : zodiacScore >= 60 ? App.t(zodiac.fullName) + ': Steady day—focus and proceed with patience.' : App.t(zodiac.fullName) + ': Take it easy—rest and recharge.')
        : getZodiacAdvice(zodiac, zodiacScore, dayOfYear + state.zodiacIndex)
    };
    var animalFortune = {
      name: animal.name, score: animalScore, level: getLevel(animalScore),
      color: getScoreColor(animalScore),
      lucky: getLuckyItem(state.animalIndex + 12, dayOfYear),
      advice: isEn
        ? (animalScore >= 75 ? App.t(animal.name) + ' year: Strong fortune—good for socializing and cooperation.' : animalScore >= 60 ? App.t(animal.name) + ' year: Stable progress—stay consistent.' : App.t(animal.name) + ' year: Slow down—take care of yourself.')
        : getAnimalAdvice(animal, animalScore, dayOfYear + state.animalIndex)
    };

    var avgScore = Math.round((zodiacScore + animalScore) / 2);
    var luckyColor = zodiacFortune.lucky.color;
    var luckyNumber = zodiacFortune.lucky.number;
    var luckyDirection = animalFortune.lucky.direction;
    var hl = huangli || { wuxing: '土日', yiArr: ['祈福'], jiArr: ['动土'] };

    var summary = '';
    if (isEn) {
      summary = 'Today overall: ' + getLevel(avgScore) + ' (' + avgScore + '/100). ';
      summary += 'Lucky color: ' + App.t(luckyColor) + ', Lucky number: ' + luckyNumber + ', Favorable direction: ' + App.t(luckyDirection) + '. ';
      summary += 'Element: ' + App.t(hl.wuxing.replace('日', '')) + '. ';
      if (avgScore >= 75) summary += 'Positive energy—take initiative and seize opportunities.';
      else if (avgScore >= 60) summary += 'Steady energy—focus on details and steady progress.';
      else summary += 'Take it easy today—rest and recharge, act tomorrow.';
    } else {
      summary = '今日综合状态' + getLevel(avgScore) + '（' + avgScore + '分）。';
      summary += '灵感色：' + luckyColor + '，灵感数字：' + luckyNumber + '，顺向方位：' + luckyDirection + '。';
      summary += '今日五行属' + hl.wuxing.replace('日', '') + '，宜' + (hl.yiArr && hl.yiArr.length ? hl.yiArr.slice(0, 2).join('、') : '祈福') + '，忌' + (hl.jiArr && hl.jiArr.length ? hl.jiArr.slice(0, 2).join('、') : '动土') + '。';
      var s = dayOfYear % 2;
      if (avgScore >= 75) summary += s ? '整体能量积极，主动出击会有不错的收获。' : '能量在线，把想法落地，机会就在眼前。';
      else if (avgScore >= 60) summary += s ? '整体状态平稳，脚踏实地做好本职，不宜冒进。' : '稳中求进，今天适合处理细活与旧账。';
      else summary += s ? '今日宜守不宜攻，低调行事，避免冲动决策。' : '节奏放慢一点，休息也是蓄力，明天再发力。';
    }

    state.zodiacFortune = zodiacFortune;
    state.animalFortune = animalFortune;
    state.summary = summary;
  }

  function generateHuangli(date) {
    var dayOfYear = getDayOfYear(date);
    var yiList = ['祭祀', '祈福', '求嗣', '塑绘', '订盟', '纳采', '嫁娶', '动土', '安床', '入宅', '移徙', '安香', '栽种', '纳畜', '开市', '交易', '立券', '纳财', '开仓', '出行', '会亲友', '求医', '治病', '破屋', '坏垣', '掘井', '开池'];
    var jiList = ['诸事不宜', '动土', '破土', '安葬', '开仓', '出货财', '嫁娶', '入宅', '移徙', '作灶', '栽种', '纳畜', '掘井', '开池', '置产', '造船', '行丧'];
    var yiCount = 4 + (dayOfYear % 3);
    var jiCount = 3 + (dayOfYear % 2);
    var yi = [], ji = [];
    for (var i = 0; i < yiCount; i++) {
      var idx = (dayOfYear * 3 + i * 7) % yiList.length;
      if (yi.indexOf(yiList[idx]) < 0) yi.push(yiList[idx]);
    }
    for (var j = 0; j < jiCount; j++) {
      var jdx = (dayOfYear * 5 + j * 11) % jiList.length;
      if (ji.indexOf(jiList[jdx]) < 0) ji.push(jiList[jdx]);
    }
    var animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
    var directions = ['北', '南', '东', '西', '东北', '东南', '西北', '西南'];
    var wuxingList = ['金', '木', '水', '火', '土'];
    return {
      yi: yi.join('、'), ji: ji.join('、'), yiArr: yi, jiArr: ji,
      chong: '冲' + animals[dayOfYear % 12],
      sha: '煞' + directions[dayOfYear % directions.length],
      wuxing: wuxingList[dayOfYear % 5] + '日',
      jishen: ['天德', '月恩', '四相', '阳德'][dayOfYear % 4],
      xiongshen: ['月破', '大耗', '四忌', '八专'][dayOfYear % 4]
    };
  }

  function selectDate(year, month, day) {
    var date = new Date(year, month, day);
    var now = new Date();
    state.selectedYear = year; state.selectedMonth = month; state.selectedDay = day;
    state.selectedDateText = year + '年' + (month + 1) + '月' + day + '日';
    state.isSelectedToday = date.toDateString() === now.toDateString();
    state.currentYear = year; state.currentMonthIdx = month;
    generateCalendar(year, month, day);
    state.huangli = generateHuangli(date);
    generateFortunes();
    App.refresh();
  }

  function generateCalendar(year, month, selectedDay) {
    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var now = new Date();
    var today = now.getDate();
    var isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
    var days = [];
    for (var i = 0; i < firstDay; i++) days.push({ day: '', isToday: false, isSelected: false, isCurrent: false });
    for (var d = 1; d <= daysInMonth; d++) {
      days.push({ day: d, isToday: isCurrentMonth && d === today, isSelected: d === selectedDay, isCurrent: true });
    }
    state.calendarDays = days;
    state.currentMonth = year + '年' + (month + 1) + '月';
  }

  var page = {
    render: function () {
      var isEn = App.lang === 'en';
      var h = App.nav('每日日历');
      h += '<div class="page">';
      h += '<div class="section-title">' + App.t('每日日历') + '</div>';
      h += '<div class="section-sub">' + App.t('黄历 · 星座 · 属相，自由选择任意日期查看') + '</div>';

      // 日历卡片
      h += '<div class="calendar-card" style="margin-top:16px;">';
      h += '<div class="calendar-nav">';
      h += '<div class="nav-btn" onclick="App.pages.daily.prev()">‹</div>';
      h += '<div class="calendar-title">' + state.currentMonth + '</div>';
      h += '<div class="nav-btn today" onclick="App.pages.daily.today()">' + App.t('今天') + '</div>';
      h += '<div class="nav-btn" onclick="App.pages.daily.next()">›</div>';
      h += '</div>';
      h += '<div class="calendar-grid">';
      var weekdays = ['日', '一', '二', '三', '四', '五', '六'];
      weekdays.forEach(function (w) { h += '<div class="cal-weekday">' + App.t(w) + '</div>'; });
      state.calendarDays.forEach(function (cd) {
        if (!cd.day) { h += '<div class="cal-day empty"></div>'; }
        else {
          h += '<div class="cal-day' + (cd.isToday ? ' today' : '') + (cd.isSelected ? ' selected' : '') + '" onclick="App.pages.daily.pick(' + cd.day + ')">' + cd.day + '</div>';
        }
      });
      h += '</div></div>';

      // 星座 / 属相选择
      h += '<div class="card"><div class="card-title">🌠 ' + App.t('你的星座 · 属相') + '</div>';
      h += '<div class="birth-section"><div class="birth-person" style="width:auto;margin-right:10px;">' + App.t('星座') + '</div><div class="birth-inputs"><div class="custom-select"><select onchange="App.pages.daily.onZodiac(this.value)">';
      state.zodiacs.forEach(function (n, i) { h += '<option value="' + i + '" ' + (i === state.zodiacIndex ? 'selected' : '') + '>' + App.t(n + '座') + '</option>'; });
      h += '</select></div></div></div>';
      h += '<div class="birth-section"><div class="birth-person" style="width:auto;margin-right:10px;">' + App.t('属相') + '</div><div class="birth-inputs"><div class="custom-select"><select onchange="App.pages.daily.onAnimal(this.value)">';
      state.animals.forEach(function (n, i) { h += '<option value="' + i + '" ' + (i === state.animalIndex ? 'selected' : '') + '>' + App.t('属' + n) + '</option>'; });
      h += '</select></div></div></div>';
      h += '</div>';

      // 黄历
      var hl = state.huangli;
      if (hl) {
        if (isEn) {
          h += '<div class="text-card"><div class="tc-title">📜 ' + state.selectedDateText + ' · Daily Almanac</div>';
          h += '<div class="tc-content">Element: ' + App.t(hl.wuxing.replace('日', '')) + '</div>';
          h += '<div class="tc-content"><span style="color:#8bc38b;">Good for: ' + (hl.yiArr && hl.yiArr.length ? 'reflection, planning, rest' : 'quiet activities') + '</span></div>';
          h += '<div class="tc-content"><span style="color:#f0a8c0;">Avoid: ' + (hl.jiArr && hl.jiArr.length ? 'major decisions, conflicts' : 'impulsive actions') + '</span></div>';
        } else {
          h += '<div class="text-card"><div class="tc-title">📜 ' + state.selectedDateText + ' · ' + App.t('黄历') + '</div>';
          h += '<div class="tc-content">' + App.t('五行') + '：' + hl.wuxing + ' · ' + hl.chong + ' · ' + hl.sha + '</div>';
          h += '<div class="tc-content">' + App.t('吉神') + '：' + hl.jishen + ' · ' + App.t('凶神') + '：' + hl.xiongshen + '</div>';
          h += '<div class="tc-content"><span style="color:#8bc38b;">' + App.t('宜') + '：' + hl.yi + '</span></div>';
          h += '<div class="tc-content"><span style="color:#f0a8c0;">' + App.t('忌') + '：' + hl.ji + '</span></div>';
        }
        h += '</div>';
      }

      // 星座运势
      if (state.zodiacFortune) {
        var zf = state.zodiacFortune;
        h += '<div class="card"><div class="card-title">🌠 ' + App.t(zf.name + '座') + ' ' + App.t('运势') + '</div>';
        h += '<div class="fortune-row"><div class="f-name">' + App.t(zf.name + '座') + '</div><div class="f-score" style="color:' + zf.color + ';">' + zf.score + App.t('分') + '</div><div class="f-level">' + App.t(zf.level) + '</div></div>';
        h += '<div class="tc-content" style="font-size:13px;margin-top:6px;">' + App.t('灵感色') + '：' + App.t(zf.lucky.color) + ' · ' + App.t('灵感数字') + '：' + zf.lucky.number + '</div>';
        h += '<div class="tc-content" style="font-size:13px;">' + zf.advice + '</div>';
        h += '</div>';
      }

      // 属相运势
      if (state.animalFortune) {
        var af = state.animalFortune;
        h += '<div class="card"><div class="card-title">🐾 ' + App.t('属' + af.name) + ' ' + App.t('运势') + '</div>';
        h += '<div class="fortune-row"><div class="f-name">' + App.t('属' + af.name) + '</div><div class="f-score" style="color:' + af.color + ';">' + af.score + App.t('分') + '</div><div class="f-level">' + App.t(af.level) + '</div></div>';
        h += '<div class="tc-content" style="font-size:13px;margin-top:6px;">' + App.t('顺向方位') + '：' + App.t(af.lucky.direction) + '</div>';
        h += '<div class="tc-content" style="font-size:13px;">' + af.advice + '</div>';
        h += '</div>';
      }

      // 综合总结
      if (state.summary) {
        h += '<div class="text-card"><div class="tc-title">✦ ' + App.t('综合解读') + '</div><div class="tc-content">' + state.summary + '</div></div>';
      }

      h += App.footer();
      h += '</div>';
      return h;
    },

    onZodiac: function (v) { state.zodiacIndex = Number(v); generateFortunes(); App.refresh(); },
    onAnimal: function (v) { state.animalIndex = Number(v); generateFortunes(); App.refresh(); },
    pick: function (day) { selectDate(state.currentYear, state.currentMonthIdx, day); },
    prev: function () {
      var year = state.currentYear, month = state.currentMonthIdx - 1;
      if (month < 0) { month = 11; year--; }
      state.currentYear = year; state.currentMonthIdx = month;
      generateCalendar(year, month, state.selectedDay);
      App.refresh();
    },
    next: function () {
      var year = state.currentYear, month = state.currentMonthIdx + 1;
      if (month > 11) { month = 0; year++; }
      state.currentYear = year; state.currentMonthIdx = month;
      generateCalendar(year, month, state.selectedDay);
      App.refresh();
    },
    today: function () {
      var now = new Date();
      selectDate(now.getFullYear(), now.getMonth(), now.getDate());
    }
  };

  // 初始化
  (function init() {
    var now = new Date();
    state.selectedYear = now.getFullYear();
    state.selectedMonth = now.getMonth();
    state.selectedDay = now.getDate();
    state.currentYear = now.getFullYear();
    state.currentMonthIdx = now.getMonth();
    generateCalendar(now.getFullYear(), now.getMonth(), now.getDate());
    state.huangli = generateHuangli(now);
    generateFortunes();
  })();

  App.pages.daily = page;
})();
