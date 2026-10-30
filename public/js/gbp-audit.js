/**
 * Google Business Profile self-audit.
 *
 * Runs entirely in the browser: nothing is sent anywhere, nothing is stored.
 * Question data is injected as JSON by the page so the copy stays in one place.
 */
(function () {
  'use strict';

  var dataEl = document.getElementById('auditData');
  var form = document.getElementById('auditTool');
  if (!dataEl || !form) return;

  var data;
  try {
    data = JSON.parse(dataEl.textContent);
  } catch (e) {
    return;
  }

  var byId = {};
  data.questions.forEach(function (q) {
    byId[q.id] = q;
  });

  var scoreEl = document.getElementById('auditScore');
  var answeredEl = document.getElementById('auditAnswered');
  var verdictEl = document.getElementById('auditVerdict');
  var ctaEl = document.getElementById('auditCta');
  var adviceWrap = document.getElementById('auditAdvice');
  var adviceList = document.getElementById('auditAdviceList');

  function readAnswers() {
    var answers = {};
    data.questions.forEach(function (q) {
      var checked = form.querySelector('input[name="' + q.id + '"]:checked');
      if (checked) answers[q.id] = Number(checked.value);
    });
    return answers;
  }

  var scoreFrame = null;
  var scoreTarget = 0;
  var completedOnce = false;

  /**
   * The count-up is decoration; the number itself is not. requestAnimationFrame
   * does not run in a hidden tab and reduced-motion users should not get it at
   * all, so both paths write the final value directly. The target is also kept
   * on the element so a tab regaining focus can snap to it.
   *
   * Answering several questions quickly fires several renders — the previous
   * frame loop is cancelled so an older animation cannot finish last and leave
   * a stale number behind.
   */
  function setScore(el, from, to) {
    scoreTarget = to;
    el.dataset.target = String(to);

    if (scoreFrame !== null) {
      cancelAnimationFrame(scoreFrame);
      scoreFrame = null;
    }

    var canAnimate =
      typeof requestAnimationFrame === 'function' &&
      document.visibilityState === 'visible' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!canAnimate) {
      el.textContent = String(to);
      return;
    }

    var start = null;
    var duration = 320;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      el.textContent = String(Math.round(from + (to - from) * progress));
      if (progress < 1) {
        scoreFrame = requestAnimationFrame(step);
      } else {
        scoreFrame = null;
        el.textContent = String(to);
      }
    }
    scoreFrame = requestAnimationFrame(step);
  }

  function render() {
    var answers = readAnswers();
    var answeredIds = Object.keys(answers);
    var total = answeredIds.reduce(function (sum, id) {
      return sum + answers[id];
    }, 0);

    setScore(scoreEl, Number(scoreEl.textContent) || 0, total);
    answeredEl.textContent = String(answeredIds.length);
    // Görsel halka ve ilerleme çubuğu için (v2 tasarım); klasik tasarım bunları yok sayar.
    form.style.setProperty('--audit-score', String(total));
    form.style.setProperty('--audit-answered', String(answeredIds.length / data.questions.length));
    form.style.setProperty('--audit-n', String(answeredIds.length));

    // Per-group bars
    data.groups.forEach(function (group) {
      var bar = form.querySelector('.audit-bar[data-group="' + group.id + '"]');
      if (!bar) return;
      var got = 0;
      data.questions.forEach(function (q) {
        if (q.group === group.id && answers[q.id] !== undefined) got += answers[q.id];
      });
      bar.querySelector('[data-group-score]').textContent = got + '/' + group.max;
      var fill = bar.querySelector('.audit-bar-fill');
      fill.style.width = Math.round((got / group.max) * 100) + '%';
      bar.classList.toggle('is-weak', got < group.max * 0.5);
      bar.classList.toggle('is-strong', got >= group.max * 0.8);
    });

    // Mark answered questions so the list is easy to scan
    data.questions.forEach(function (q) {
      var block = form.querySelector('[data-question="' + q.id + '"]');
      if (block) block.classList.toggle('is-answered', answers[q.id] !== undefined);
    });

    var complete = answeredIds.length === data.questions.length;

    if (complete) {
      var band = data.bands.find(function (b) {
        return total >= b.min;
      });
      verdictEl.innerHTML =
        '<strong>' + band.title + '</strong><p>' + band.text + '</p>';
      verdictEl.hidden = false;
      ctaEl.hidden = false;

      // Only the first completion counts; changing answers afterwards would
      // otherwise fire the event on every keystroke.
      if (!completedOnce) {
        completedOnce = true;
        if (window.akTrack) window.akTrack('tool_completed', { score: total, band: band.title });
      }
    } else {
      verdictEl.hidden = true;
      ctaEl.hidden = true;
    }

    // Advice for every question scoring below half its maximum
    var weak = data.questions.filter(function (q) {
      return answers[q.id] !== undefined && answers[q.id] < q.max / 2;
    });

    if (weak.length) {
      adviceList.innerHTML = weak
        .map(function (q) {
          var link = q.href
            ? '<a class="audit-advice-link" href="' + q.href + '">' + data.ui.adviceLink + '</a>'
            : '';
          return (
            '<div class="audit-advice-item"><h3>' +
            q.question +
            '</h3><p>' +
            q.advice +
            '</p>' +
            link +
            '</div>'
          );
        })
        .join('');
      adviceWrap.hidden = false;
    } else {
      adviceWrap.hidden = true;
    }
  }

  // A tab that was hidden while the user answered snaps to the real value.
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') scoreEl.textContent = String(scoreTarget);
  });

  ctaEl.addEventListener('click', function () {
    if (window.akTrack) window.akTrack('tool_cta_click', { score: scoreTarget });
  });

  form.addEventListener('change', function (event) {
    if (event.target && event.target.type === 'radio') render();
  });

  // "Baştan başla" gibi bir reset butonu varsa ekranı da sıfırla.
  form.addEventListener('reset', function () {
    setTimeout(render, 0);
  });

  // Never submit — there is no server side to this tool.
  form.addEventListener('submit', function (event) {
    event.preventDefault();
  });

  render();
})();
