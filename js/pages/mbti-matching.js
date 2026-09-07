/**
 * pages/mbti-matching.js — 性格速配输入（双方 MBTI）
 */
(function () {
  var mbti = window.MBTI;
  var list = Object.keys(mbti.MBTI_TYPES);
  var state = { myIdx: -1, taIdx: -1, myMbti: '', taMbti: '', readyText: '' };

  function options(selected) {
    var s = '<option value="-1">' + App.t('请选择 MBTI') + '</option>';
    list.forEach(function (k, i) {
      var name = mbti.MBTI_TYPES[k].name;
      s += '<option value="' + i + '" ' + (i === selected ? 'selected' : '') + '>' + k + ' · ' + App.t(name) + '</option>';
    });
    return s;
  }

  var page = {
    render: function () {
      var h = App.nav('性格速配');
      h += '<div class="page">';
      h += '<div class="section-title">' + App.t('性格速配') + '</div>';
      h += '<div class="section-sub">' + App.t('MBTI 双人性格匹配，读懂你们的相处模式') + '</div>';

      h += '<div class="card" style="margin-top:16px;"><div class="card-title">🧩 ' + App.t('你的 MBTI') + '</div>';
      h += '<div class="custom-select"><select onchange="App.pages.mbtiMatching.onMy(this.value)">' + options(state.myIdx) + '</select></div>';
      h += '<div class="divider" style="margin:12px 0;"></div>';
      h += '<div class="card-title">🧩 ' + App.t('对方的 MBTI') + '</div>';
      h += '<div class="custom-select"><select onchange="App.pages.mbtiMatching.onTa(this.value)">' + options(state.taIdx) + '</select></div>';
      if (state.readyText) h += '<div class="birth-auto" id="mbtiReady" style="margin-top:12px;"><span class="birth-auto-text">✨ ' + state.readyText + '</span></div>';
      h += '</div>';

      h += '<div class="text-card"><div class="tc-title">💡 ' + App.t('不了解自己的 MBTI？') + '</div>';
      h += '<div class="tc-content">' + App.t('先去「MBTI 测试」完成 16 道题，测出你的性格类型再来匹配。') + '</div></div>';

      h += '<button class="btn-primary mt40" onclick="App.pages.mbtiMatching.onStart()">' + App.t('开始匹配') + '</button>';
      h += '<button class="btn-secondary" onclick="App.go(\'mbti-test\')">' + App.t('去做 MBTI 测试') + '</button>';
      h += App.footer();
      h += '</div>';
      return h;
    },

    onMy: function (v) {
      state.myIdx = Number(v);
      state.myMbti = state.myIdx >= 0 ? list[state.myIdx] : '';
      page.checkReady();
    },
    onTa: function (v) {
      state.taIdx = Number(v);
      state.taMbti = state.taIdx >= 0 ? list[state.taIdx] : '';
      page.checkReady();
    },
    checkReady: function () {
      state.readyText = (state.myMbti && state.taMbti) ? App.t('双方 MBTI 已就绪，将生成性格匹配报告') : '';
      var el = document.getElementById('mbtiReady');
      if (el) {
        if (state.readyText) {
          el.style.display = '';
          el.innerHTML = '<span class="birth-auto-text">✨ ' + state.readyText + '</span>';
        } else {
          el.style.display = 'none';
        }
      }
    },
    onStart: function () {
      if (!state.myMbti || !state.taMbti) { App.toast(App.t('请先填写双方 MBTI')); return; }
      var mbtiResult = mbti.calcMbtiMatch(state.myMbti, state.taMbti);
      App.store.mbtiResult = { mbtiResult: mbtiResult, myMbti: state.myMbti, taMbti: state.taMbti };
      App.go('mbti-result');
    }
  };

  App.pages.mbtiMatching = page;
})();
