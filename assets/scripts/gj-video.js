/*
 * GJ B2B Video player runtime (preview / prototype layer, not a production player).
 * Initializes every [data-gj-video] root built from the shared .gj-video-* base:
 *   [data-action="play"]        play ↔ pause toggle (data-icon play/pause, aria-pressed, aria-label)
 *   [data-action="mute"]        mute toggle inside .gj-video-volume (data-icon volume/mute)
 *   .gj-video-volume input      volume 0–100, drives --gj-video-volume; 0 counts as muted
 *   .gj-video-progress input    seek 0–1000, drives --gj-video-progress
 *   [data-current] [data-total] time text (mm:ss or h:mm:ss)
 *   [data-action="fullscreen"]  Fullscreen API on the root; falls back to an icon-only toggle
 * With a child <video class="gj-video-media"> it binds to the real media element; without one it
 * simulates playback from data-duration / data-start-time (seconds) so docs pages can be operated.
 */
(function () {
  'use strict';
  var pad = function (n) { return String(n).padStart(2, '0'); };
  function formatTime(sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return h ? h + ':' + pad(m) + ':' + pad(s) : pad(m) + ':' + pad(s);
  }

  // Native range thumbs travel within (width - thumbSize), not the full track.
  function paintProgress(input, ratio) {
    ratio = Math.max(0, Math.min(1, Number(ratio) || 0));
    input.style.setProperty('--gj-video-progress', (ratio * 100) + '%');
    input.style.setProperty('--gj-video-progress-position', 'calc(' + (ratio * 100) + '% + var(--ds-component-video-progress-thumb-size) * ' + (0.5 - ratio) + ')');
  }

  function initProgress(root) {
    if (!root || root.__gjVideoProgress) return;
    var input = root.querySelector('input[type=range]');
    if (!input) return;
    var player = document.getElementById((root.dataset.player || '').replace(/^#/, ''));
    if (player) init(player);
    var api = player && player.__gjVideo;
    function bounds() {
      return { min: input.min === '' ? 0 : Number(input.min), max: input.max === '' ? 100 : Number(input.max) };
    }
    function render() {
      var b = bounds(), value = Number(input.value);
      var ratio = b.max > b.min ? (value - b.min) / (b.max - b.min) : 0;
      paintProgress(input, ratio);
      input.setAttribute('aria-valuetext', Math.round(ratio * 100) + '%');
      root.setAttribute('aria-disabled', String(input.disabled));
      return { value: value, min: b.min, max: b.max, ratio: ratio };
    }
    function update(value, notify, type) {
      input.value = String(value); // Native range clamps and quantizes min/max/step.
      var detail = render();
      if (notify) {
        if (api) api.seekRatio(detail.ratio);
        detail.type = type;
        root.dispatchEvent(new CustomEvent('gj-video-progresschange', { bubbles: true, detail: detail }));
      }
    }
    ['input', 'change'].forEach(function (type) {
      input.addEventListener(type, function () { if (!input.disabled) update(input.value, true, type); });
    });
    function sync(event) {
      var b = bounds(), d = event.detail;
      update(b.min + (b.max - b.min) * (d.duration > 0 ? d.current / d.duration : 0), false);
    }
    if (player) player.addEventListener('gj-video-timeupdate', sync);
    root.__gjVideoProgress = {
      setValue: function (value) { update(value, true, 'programmatic'); },
      refresh: render
    };
    render();
    if (api) api.refreshTime();
  }

  function init(root) {
    if (!root || root.__gjVideo) return;
    var media = root.querySelector('video.gj-video-media');
    var playBtn = root.querySelector('[data-action="play"]');
    var muteBtn = root.querySelector('[data-action="mute"]');
    var fsBtn = root.querySelector('[data-action="fullscreen"]');
    var volume = root.querySelector('.gj-video-volume');
    var volumeInput = root.querySelector('.gj-video-volume input[type=range]');
    var seek = root.querySelector('.gj-video-progress input[type=range]');
    var currentEl = root.querySelector('[data-current]');
    var totalEl = root.querySelector('[data-total]');
    var state = {
      playing: media ? !media.paused : root.classList.contains('is-playing'),
      current: Number(root.dataset.startTime || 0),
      duration: Number(root.dataset.duration || 0),
      volume: media ? Math.round(media.volume * 100) : volumeInput ? Number(volumeInput.value) : 67,
      muted: media ? media.muted : root.dataset.muted === 'true',
      fallbackFullscreen: false
    };
    var timer = null;
    var seeking = false;

    function renderTime() {
      var duration = media && isFinite(media.duration) ? media.duration : state.duration;
      var current = media ? media.currentTime : state.current;
      var ratio = duration ? Math.min(1, current / duration) : 0;
      if (seek && !seeking) seek.value = String(Math.round(ratio * 1000));
      if (seek) paintProgress(seek, seeking ? Number(seek.value) / 1000 : ratio);
      if (currentEl) currentEl.textContent = formatTime(current);
      if (totalEl) totalEl.textContent = formatTime(duration);
      root.dispatchEvent(new CustomEvent('gj-video-timeupdate', { bubbles: true, detail: { current: current, duration: duration } }));
    }
    function renderPlay() {
      if (!playBtn) return;
      playBtn.dataset.icon = state.playing ? 'pause' : 'play';
      playBtn.setAttribute('aria-pressed', String(state.playing));
      playBtn.setAttribute('aria-label', state.playing ? '暂停' : '播放');
      root.classList.toggle('is-playing', state.playing);
      root.dispatchEvent(new CustomEvent('gj-video-statechange', { bubbles: true, detail: { playing: state.playing } }));
    }
    function renderVolume() {
      var silent = state.muted || state.volume === 0;
      if (volumeInput) {
        volumeInput.value = String(state.muted ? 0 : state.volume);
        volumeInput.style.setProperty('--gj-video-volume', (state.muted ? 0 : state.volume) + '%');
      }
      if (muteBtn) {
        muteBtn.dataset.icon = silent ? 'mute' : 'volume';
        muteBtn.setAttribute('aria-pressed', String(silent));
        muteBtn.setAttribute('aria-label', silent ? '取消静音' : '静音');
      }
      if (volume) volume.classList.toggle('is-muted', silent);
      if (media) { media.muted = silent; media.volume = state.volume / 100; }
    }
    function isFullscreen() { return document.fullscreenElement === root || state.fallbackFullscreen; }
    function renderFullscreen() {
      if (!fsBtn) return;
      var on = isFullscreen();
      fsBtn.dataset.icon = on ? 'fullscreen-exit' : 'fullscreen';
      fsBtn.setAttribute('aria-label', on ? '退出全屏' : '全屏');
    }

    function tick() {
      state.current = Math.min(state.duration, state.current + 0.25);
      var ended = state.current >= state.duration;
      if (ended) setPlaying(false);
      renderTime();
      if (ended) root.dispatchEvent(new CustomEvent('gj-video-ended', { bubbles: true }));
    }
    function setPlaying(next) {
      state.playing = next;
      if (media) { if (next) { var p = media.play(); if (p && p.catch) p.catch(function () { state.playing = false; renderPlay(); }); } else media.pause(); }
      else {
        clearInterval(timer); timer = null;
        if (next) { if (state.current >= state.duration) state.current = 0; timer = setInterval(tick, 250); }
      }
      renderPlay();
    }

    ['prev', 'next'].forEach(function (direction) {
      var button = root.querySelector('[data-action="' + direction + '"]');
      if (button) button.addEventListener('click', function () { root.dispatchEvent(new CustomEvent('gj-video-' + direction, { bubbles: true })); });
    });
    if (playBtn) playBtn.addEventListener('click', function () { setPlaying(!state.playing); });
    if (muteBtn) muteBtn.addEventListener('click', function () {
      if (state.muted || state.volume === 0) { state.muted = false; if (state.volume === 0) state.volume = 50; }
      else state.muted = true;
      renderVolume();
    });
    if (volumeInput) volumeInput.addEventListener('input', function () {
      state.volume = Number(volumeInput.value); state.muted = state.volume === 0; renderVolume();
    });
    if (seek) {
      seek.addEventListener('input', function () {
        seeking = true;
        var duration = media && isFinite(media.duration) ? media.duration : state.duration;
        var t = Number(seek.value) / 1000 * duration;
        if (media) media.currentTime = t; else state.current = t;
        renderTime();
      });
      seek.addEventListener('change', function () { seeking = false; renderTime(); });
    }
    if (fsBtn) fsBtn.addEventListener('click', function () {
      if (isFullscreen()) {
        if (document.fullscreenElement === root && document.exitFullscreen) document.exitFullscreen().catch(function () {});
        state.fallbackFullscreen = false; renderFullscreen(); return;
      }
      var req = root.requestFullscreen ? root.requestFullscreen() : null;
      if (req && req.catch) req.catch(function () { state.fallbackFullscreen = true; renderFullscreen(); });
      else if (!req) { state.fallbackFullscreen = true; renderFullscreen(); }
    });
    document.addEventListener('fullscreenchange', renderFullscreen);
    if (media) {
      ['timeupdate', 'loadedmetadata', 'durationchange'].forEach(function (e) { media.addEventListener(e, renderTime); });
      media.addEventListener('play', function () { state.playing = true; renderPlay(); });
      media.addEventListener('pause', function () { state.playing = false; renderPlay(); });
      media.addEventListener('ended', function () {
        state.playing = false; renderPlay(); renderTime();
        root.dispatchEvent(new CustomEvent('gj-video-ended', { bubbles: true }));
      });
      media.addEventListener('volumechange', function () {
        var nextVolume = Math.round(media.volume * 100);
        var nextMuted = media.muted;
        if (state.volume === nextVolume && (state.muted || state.volume === 0) === nextMuted) return;
        state.volume = nextVolume; state.muted = nextMuted; renderVolume();
      });
    }

    root.__gjVideo = {
      play: function () { setPlaying(true); },
      pause: function () { setPlaying(false); },
      refreshTime: renderTime,
      seekRatio: function (ratio) {
        ratio = Math.max(0, Math.min(1, Number(ratio) || 0));
        var duration = media && isFinite(media.duration) ? media.duration : state.duration;
        if (media) { try { media.currentTime = ratio * duration; } catch (error) { return false; } }
        else state.current = ratio * duration;
        renderTime(); return true;
      },
      load: function (item) {
        // Real playlists require a source per item; never replay the previous media as a new item.
        if (media && !item.src) return false;
        setPlaying(false);
        state.current = 0; state.duration = Math.max(0, Number(item.duration) || 0);
        root.dataset.duration = String(state.duration);
        if (media) {
          if (media.getAttribute('src') !== item.src) { media.src = item.src; media.load(); }
          try { media.currentTime = 0; } catch (error) { /* Wait for metadata when the media is not seekable yet. */ }
        }
        renderTime();
        if (item.autoplay) setPlaying(true);
        return true;
      },
      formatTime: formatTime
    };
    renderTime(); renderPlay(); renderVolume(); renderFullscreen();
  }

  function initPlaylist(root) {
    if (!root || root.__gjVideoPlaylist) return;
    var playerId = (root.dataset.player || '').replace(/^#/, '');
    var player = playerId ? document.getElementById(playerId) : null;
    var items = Array.from(root.querySelectorAll('.gj-video-playlist-item'));
    var count = root.querySelector('[data-playlist-count]');
    var body = root.querySelector('.gj-video-playlist-body');
    if (!body) return;
    var current = -1;
    var visited = new Set(items.filter(function (item) { return item.dataset.played === 'true'; }));
    if (player) init(player);
    var api = player && player.__gjVideo;
    function enabledFrom(start, direction) {
      for (var i = start; i >= 0 && i < items.length; i += direction) if (!items[i].disabled) return i;
      return -1;
    }
    function render() {
      var playing = Boolean(player && player.classList.contains('is-playing'));
      if (playing && current >= 0) visited.add(items[current]);
      items.forEach(function (item, index) {
        var active = index === current;
        item.classList.toggle('is-current', active);
        if (active) item.setAttribute('aria-current', 'true'); else item.removeAttribute('aria-current');
        var status = item.querySelector('[data-playlist-status]');
        if (status) status.textContent = active ? playing ? '正在播放' : '已暂停' : visited.has(item) ? '已播放' : '未播放';
        var title = item.querySelector('.gj-video-playlist-title');
        if (title) title.title = title.textContent;
      });
      if (count) count.textContent = '（' + (current + 1) + '/' + items.length + '）';
      if (player) ['prev', 'next'].forEach(function (direction) {
        var button = player.querySelector('[data-action="' + direction + '"]');
        if (button) button.disabled = current < 0 || enabledFrom(current + (direction === 'prev' ? -1 : 1), direction === 'prev' ? -1 : 1) < 0;
      });
    }
    function select(index, autoplay) {
      if (index < 0 || index >= items.length || items[index].disabled) return;
      var item = items[index];
      if (player && player.querySelector('video.gj-video-media') && !item.dataset.src) {
        root.dispatchEvent(new CustomEvent('gj-video-playlist-error', { bubbles: true, detail: { index: index + 1, reason: 'missing-media-src' } }));
        return;
      }
      if (index === current) { if (api && autoplay) api.play(); return; }
      current = index;
      if (api) api.load({ src: item.dataset.src || '', duration: Number(item.dataset.duration) || 0, autoplay: Boolean(autoplay) });
      render();
      var title = item.querySelector('.gj-video-playlist-title');
      var detail = player && player.closest('.gj-video-detail');
      var heading = detail && detail.querySelector('[data-video-active-title]');
      if (heading && title) heading.textContent = title.textContent;
      if (body.scrollHeight > body.clientHeight) {
        var top = item.getBoundingClientRect().top - body.getBoundingClientRect().top + body.scrollTop;
        if (top < body.scrollTop) body.scrollTop = top;
        else if (top + item.offsetHeight > body.scrollTop + body.clientHeight) body.scrollTop = top + item.offsetHeight - body.clientHeight;
      }
      root.dispatchEvent(new CustomEvent('gj-video-selectionchange', { bubbles: true, detail: { index: index + 1, total: items.length, title: title ? title.textContent : '', src: item.dataset.src || '' } }));
    }
    items.forEach(function (item, index) {
      item.addEventListener('click', function () { select(index, true); });
      item.addEventListener('keydown', function (event) {
        var target = -1;
        if (event.key === 'ArrowDown') target = enabledFrom(index + 1, 1);
        else if (event.key === 'ArrowUp') target = enabledFrom(index - 1, -1);
        else if (event.key === 'Home') target = enabledFrom(0, 1);
        else if (event.key === 'End') target = enabledFrom(items.length - 1, -1);
        else return;
        event.preventDefault();
        if (target >= 0) items[target].focus();
      });
    });
    if (player) {
      player.addEventListener('gj-video-statechange', render);
      player.addEventListener('gj-video-prev', function () { select(enabledFrom(current - 1, -1), true); });
      player.addEventListener('gj-video-next', function () { select(enabledFrom(current + 1, 1), true); });
      player.addEventListener('gj-video-ended', function () { select(enabledFrom(current + 1, 1), true); });
    }
    root.__gjVideoPlaylist = { select: select };
    var declared = root.dataset.currentIndex;
    var active = items.findIndex(function (item) { return item.classList.contains('is-current') || item.getAttribute('aria-current') === 'true'; });
    var initial = declared !== undefined ? Number(declared) - 1 : active >= 0 ? active : enabledFrom(0, 1);
    select(initial, false); render();
  }

  function initAll(scope) {
    scope = scope || document;
    if (scope.matches && scope.matches('[data-gj-video]')) init(scope);
    scope.querySelectorAll('[data-gj-video]').forEach(init);
    if (scope.matches && scope.matches('[data-gj-video-progress]')) initProgress(scope);
    scope.querySelectorAll('[data-gj-video-progress]').forEach(initProgress);
    if (scope.matches && scope.matches('[data-gj-video-playlist]')) initPlaylist(scope);
    scope.querySelectorAll('[data-gj-video-playlist]').forEach(initPlaylist);
  }
  window.GjVideo = { init: init, initProgress: initProgress, initPlaylist: initPlaylist, initAll: initAll, formatTime: formatTime };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { initAll(); });
  else initAll();
})();
