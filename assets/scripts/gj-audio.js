/* GJ B2B Audio prototype runtime. Shared by Mini/Full controllers and standalone item buttons. */
(function () {
  'use strict';

  var pad = function (n) { return String(n).padStart(2, '0'); };
  function formatTime(sec) {
    sec = Math.max(0, Math.floor(Number(sec) || 0));
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ':' + pad(s);
  }

  function init(root) {
    if (!root || root.__gjAudio) return;
    var media = root.querySelector('audio.gj-audio-media');
    var toggle = root.querySelector('[data-action="play"]');
    var seek = root.querySelector('.gj-audio-progress input[type="range"], .gj-slider input[type="range"]');
    var progress = root.querySelector('.gj-audio-progress, .gj-slider');
    var volume = root.querySelector('.gj-audio-volume-slider input[type="range"]');
    var volumeWrap = root.querySelector('.gj-audio-volume-slider');
    var volumeIcon = root.querySelector('.gj-audio-volume-icon');
    var muteButton = root.querySelector('[data-action="mute"]');
    var elapsed = root.querySelector('[data-audio-elapsed]');
    var total = root.querySelector('[data-audio-total]');
    var combined = root.querySelector('[data-audio-duration]');
    var state = {
      playing: media ? !media.paused : root.classList.contains('is-playing'),
      current: Number(root.dataset.startTime || 0),
      duration: Number(root.dataset.duration || 16),
      volume: media ? Math.round(media.volume * 100) : volume ? Number(volume.value) : 30
    };
    state.lastVolume = state.volume > 0 ? state.volume : 30;
    var timer = null;

    function duration() { return media && isFinite(media.duration) ? media.duration : state.duration; }
    function current() { return media ? media.currentTime : state.current; }
    function renderTime() {
      var d = duration(), c = Math.min(d || 0, current());
      var ratio = d ? c / d : 0;
      if (seek) seek.value = String(Math.round(ratio * Number(seek.max || 1000)));
      if (progress) progress.style.setProperty('--gj-audio-progress', (ratio * 100) + '%');
      if (elapsed) elapsed.textContent = formatTime(c);
      if (total) total.textContent = formatTime(d);
      if (combined) combined.textContent = formatTime(c) + '/' + formatTime(d);
    }
    function renderPlay() {
      root.classList.toggle('is-playing', state.playing);
      if (!toggle) return;
      toggle.setAttribute('aria-pressed', String(state.playing));
      toggle.setAttribute('aria-label', state.playing ? '暂停' : '播放');
    }
    function renderVolume() {
      if (media) state.volume = Math.round(media.volume * 100);
      var muted = state.volume === 0 || Boolean(media && media.muted);
      if (state.volume > 0) state.lastVolume = state.volume;
      if (volume) {
        volume.value = String(state.volume);
        volume.setAttribute('aria-valuetext', muted ? '静音' : state.volume + '%');
      }
      if (volumeWrap) volumeWrap.style.setProperty('--gj-audio-volume', state.volume + '%');
      if (volumeIcon) volumeIcon.classList.toggle('is-muted', muted);
      if (muteButton) {
        muteButton.setAttribute('aria-pressed', String(muted));
        muteButton.setAttribute('aria-label', muted ? '取消静音' : '静音');
      }
    }
    function tick() {
      state.current = Math.min(state.duration, state.current + .25);
      if (state.current >= state.duration) setPlaying(false);
      renderTime();
    }
    function setPlaying(next) {
      state.playing = Boolean(next);
      if (media) {
        if (state.playing) {
          var request = media.play();
          if (request && request.catch) request.catch(function () { state.playing = false; renderPlay(); });
        } else media.pause();
      } else {
        clearInterval(timer); timer = null;
        if (state.playing) {
          if (state.current >= state.duration) state.current = 0;
          timer = window.setInterval(tick, 250);
        }
      }
      renderPlay();
      root.dispatchEvent(new CustomEvent('gj-audio-statechange', { bubbles: true, detail: { playing: state.playing } }));
    }

    if (toggle) toggle.addEventListener('click', function () { setPlaying(!state.playing); });
    ['prev', 'next'].forEach(function (action) {
      var button = root.querySelector('[data-action="' + action + '"]');
      if (button) button.addEventListener('click', function () {
        root.dispatchEvent(new CustomEvent('gj-audio-' + action, { bubbles: true }));
      });
    });
    var close = root.querySelector('[data-action="close"]');
    if (close) close.addEventListener('click', function () {
      setPlaying(false);
      root.hidden = true;
      root.dispatchEvent(new CustomEvent('gj-audio-close', { bubbles: true }));
    });
    if (seek) seek.addEventListener('input', function () {
      var d = duration(), next = Number(seek.value) / Number(seek.max || 1000) * d;
      if (media) media.currentTime = next; else state.current = next;
      renderTime();
    });
    if (volume) volume.addEventListener('input', function () {
      state.volume = Number(volume.value);
      if (media) {
        media.volume = state.volume / 100;
        if (state.volume > 0) media.muted = false;
      }
      renderVolume();
    });
    if (muteButton) muteButton.addEventListener('click', function () {
      var muted = state.volume === 0 || Boolean(media && media.muted);
      if (!muted && state.volume > 0) state.lastVolume = state.volume;
      state.volume = muted ? state.lastVolume : 0;
      if (media) {
        media.volume = state.volume / 100;
        media.muted = state.volume === 0;
      }
      renderVolume();
    });
    if (media) {
      ['timeupdate', 'loadedmetadata', 'durationchange'].forEach(function (eventName) { media.addEventListener(eventName, renderTime); });
      media.addEventListener('play', function () { state.playing = true; renderPlay(); });
      media.addEventListener('pause', function () { state.playing = false; renderPlay(); });
      media.addEventListener('ended', function () { state.playing = false; renderPlay(); renderTime(); });
      media.addEventListener('volumechange', renderVolume);
    }

    root.__gjAudio = { play: function () { setPlaying(true); }, pause: function () { setPlaying(false); }, show: function () { root.hidden = false; }, formatTime: formatTime };
    renderTime(); renderPlay(); renderVolume();
  }

  function initButton(button) {
    if (!button || button.__gjAudioButton) return;
    if (button.closest('[data-gj-audio]') && button.matches('[data-action="play"]')) return;
    button.addEventListener('click', function () {
      var playing = button.classList.toggle('is-playing');
      button.setAttribute('aria-pressed', String(playing));
      button.setAttribute('aria-label', playing ? '暂停' : '播放');
    });
    button.__gjAudioButton = true;
  }

  function initAll(scope) {
    scope = scope || document;
    if (scope.matches && scope.matches('[data-gj-audio]')) init(scope);
    scope.querySelectorAll('[data-gj-audio]').forEach(init);
    if (scope.matches && scope.matches('.gj-audio-item-button')) initButton(scope);
    scope.querySelectorAll('.gj-audio-item-button').forEach(initButton);
  }
  window.GjAudio = { init: init, initAll: initAll, formatTime: formatTime };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { initAll(); });
  else initAll();
})();
