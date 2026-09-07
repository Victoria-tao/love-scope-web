/**
 * data/birthMatch.js (Web版)
 * 生辰匹配（年龄差+年柱五行生克+生日季节）
 */
(function () {
  var HEAVENLY_STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  var EARTHLY_BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  var STEM_ELEMENT = {甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水'};
  var BRANCH_ELEMENT = {子:'水',丑:'土',寅:'木',卯:'木',辰:'土',巳:'火',午:'火',未:'土',申:'金',酉:'金',戌:'土',亥:'水'};

  var ELEMENT_SHENG = {木:'火',火:'土',土:'金',金:'水',水:'木'};
  var ELEMENT_KE = {木:'土',土:'水',水:'火',火:'金',金:'木'};

  var ZODIAC_NAMES = ['白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座','水瓶座','双鱼座'];
  var ZODIAC_DATES = ['3.21-4.19','4.20-5.20','5.21-6.21','6.22-7.22','7.23-8.22','8.23-9.22','9.23-10.23','10.24-11.22','11.23-12.21','12.22-1.19','1.20-2.18','2.19-3.20'];

  function getZodiacIndexByBirthday(month, day) {
    var boundaries = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 23, 22];
    var beforeZodiac = [9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8];
    var idx = month - 1;
    if (day < boundaries[idx]) return beforeZodiac[idx];
    return (beforeZodiac[idx] + 1) % 12;
  }

  function getAnimalIndexByYear(year) {
    return ((year - 4) % 12 + 12) % 12;
  }

  function getYearPillar(year) {
    var y = parseInt(year);
    var stem = HEAVENLY_STEMS[((y - 4) % 10 + 10) % 10];
    var branch = EARTHLY_BRANCHES[((y - 4) % 12 + 12) % 12];
    return {
      stem: stem, branch: branch,
      stemElement: STEM_ELEMENT[stem], branchElement: BRANCH_ELEMENT[branch],
      full: stem + branch
    };
  }

  function getElementRelation(a, b) {
    if (a === b) return { type: '比和', score: 78, text: '同气相求，性情相近，容易理解对方' };
    if (ELEMENT_SHENG[a] === b) return { type: '你生TA', score: 86, text: '你的年份属性旺TA，愿意为对方付出' };
    if (ELEMENT_SHENG[b] === a) return { type: 'TA生你', score: 84, text: 'TA的年份属性旺你，能感受到被滋养' };
    if (ELEMENT_KE[a] === b) return { type: '你克TA', score: 58, text: '你的年份属性与TA有相克，相处中注意把握分寸' };
    if (ELEMENT_KE[b] === a) return { type: 'TA克你', score: 60, text: 'TA的年份属性与你相克，记得保持自我边界' };
    return { type: '中和', score: 72, text: '五行调和，关系平稳，细水长流' };
  }

  function getSeason(month) {
    if (month >= 3 && month <= 5) return { name: '春', element: '木', trait: '生机萌发，感性浪漫' };
    if (month >= 6 && month <= 8) return { name: '夏', element: '火', trait: '热情外放，行动力强' };
    if (month >= 9 && month <= 11) return { name: '秋', element: '金', trait: '理性内敛，追求品质' };
    return { name: '冬', element: '水', trait: '沉静深邃，慢热持久' };
  }

  function getBirthMatch(myYear, myBirthday, taYear, taBirthday) {
    if (!myYear || !taYear) return null;
    var myY = parseInt(myYear);
    var taY = parseInt(taYear);
    var myPillar = getYearPillar(myY);
    var taPillar = getYearPillar(taY);
    var ageDiff = Math.abs(myY - taY);

    var ageScore, ageText;
    if (ageDiff === 0) { ageScore = 90; ageText = '同岁，成长节奏一致，共同语言多'; }
    else if (ageDiff <= 2) { ageScore = 88; ageText = '年龄相近，既有共鸣又有微小互补'; }
    else if (ageDiff <= 5) { ageScore = 84; ageText = '适度差距，一方稍成熟能带动另一方'; }
    else if (ageDiff <= 8) { ageScore = 74; ageText = '差距明显，阅历不同，需要更多耐心'; }
    else { ageScore = 64; ageText = '跨度较大，观念差异需主动磨合'; }

    var stemRel = getElementRelation(myPillar.stemElement, taPillar.stemElement);
    var branchRel = getElementRelation(myPillar.branchElement, taPillar.branchElement);

    var seasonScore = 70, seasonText = '生日信息不全，季节参考从略';
    if (myBirthday && taBirthday) {
      var mm1 = myBirthday.split('-').map(Number);
      var mm2 = taBirthday.split('-').map(Number);
      var mySeason = getSeason(mm1[0]);
      var taSeason = getSeason(mm2[0]);
      var seasonRel = getElementRelation(mySeason.element, taSeason.element);
      seasonScore = seasonRel.score;
      seasonText = '你生于' + mySeason.name + '（' + mySeason.trait + '），TA生于' + taSeason.name + '（' + taSeason.trait + '），' + seasonRel.text;
    }

    var totalScore = Math.round((ageScore + stemRel.score + branchRel.score + seasonScore) / 4);
    var levelTag = totalScore >= 85 ? '生辰相合' : totalScore >= 72 ? '生辰中和' : '生辰互补';

    return {
      myPillar: myPillar, taPillar: taPillar,
      ageDiff: ageDiff, ageScore: ageScore, ageText: ageText,
      stemRel: stemRel, branchRel: branchRel,
      seasonScore: seasonScore, seasonText: seasonText,
      totalScore: totalScore, levelTag: levelTag
    };
  }

  window.BM = {
    getZodiacIndexByBirthday: getZodiacIndexByBirthday,
    getAnimalIndexByYear: getAnimalIndexByYear,
    getYearPillar: getYearPillar,
    getBirthMatch: getBirthMatch,
    ZODIAC_NAMES: ZODIAC_NAMES,
    ZODIAC_DATES: ZODIAC_DATES
  };
})();
