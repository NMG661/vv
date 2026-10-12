/**
 * OptiCraft Heritage — UI click sounds + generative background music.
 *
 * Loaded by EVERY page (index + all tools), before or after any other script
 * — it has no dependencies and only listens. Follows the och-ui.js pattern:
 * an IIFE with no leaking globals, so it never collides with the per-page
 * names that each tool script re-declares.
 *
 * Everything is synthesised with the WebAudio API — no audio files, so there
 * is nothing to download and no copyrighted Minecraft assets shipped:
 *  - Click: the classic menu "blip" (square wave with a fast pitch drop plus
 *    a 20ms noise snap), played on every button/nav/tab click, including
 *    clicks triggered by keyboard navigation (.click() dispatches real
 *    events that bubble to this delegated listener).
 *  - Music: a slow generative ambient loop (Fmaj7 -> Am7 -> Dm7 -> G pads with
 *    sparse pentatonic melody notes), the calm-menu vibe at low volume.
 *
 * The floating speaker button (bottom-right, above the Discord button)
 * toggles ALL audio on/off; the preference persists in localStorage under
 * 'heritage_audio' (default: on). Browsers block autoplay, so audio needs a
 * user gesture — and this ALSO keeps the music alive across page
 * navigations: navigating with a click hands user activation to the new
 * document for a few seconds, so this module tries to resume immediately on
 * load and picks the generative loop back up (bar position + next bar
 * timing) from sessionStorage instead of restarting from silence and
 * restarting the chord progression.
 */
(function () {
  var PREF_KEY = 'heritage_audio';

  function isEs() {
    return (localStorage.getItem('heritage_lang') || 'en') === 'es';
  }
  function audioEnabled() {
    return localStorage.getItem(PREF_KEY) !== 'off';
  }

  var ctx = null;
  var musicBus = null;
  var musicTimer = null;
  var barIndex = 0;
  var started = false;
  var nextBarEpoch = 0; // Date.now() timestamp of the next scheduled bar

  var MUSIC_STATE_KEY = 'och_music_state';

  // The previous page hands the loop over to the next one through
  // sessionStorage (per-tab, dies with the tab — right lifetime for audio).
  function persistMusicState() {
    if (!musicTimer) return;
    try {
      sessionStorage.setItem(MUSIC_STATE_KEY, JSON.stringify({ bar: barIndex, nextBarAt: nextBarEpoch }));
    } catch (err) { /* storage unavailable */ }
  }

  function consumeMusicState() {
    try {
      var stored = JSON.parse(sessionStorage.getItem(MUSIC_STATE_KEY) || 'null');
      sessionStorage.removeItem(MUSIC_STATE_KEY);
      if (stored && typeof stored.bar === 'number' && typeof stored.nextBarAt === 'number') return stored;
    } catch (err) { /* ignore corrupt state */ }
    return null;
  }

  function ensureCtx() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      musicBus = ctx.createGain();
      musicBus.gain.value = 1;
      musicBus.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // --- UI click: the classic menu blip, synthesised ---
  function playClick() {
    var ac = ensureCtx();
    if (!ac || ac.state !== 'running') return;
    var t = ac.currentTime;

    var osc = ac.createOscillator();
    var gain = ac.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(950, t);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.055);
    gain.gain.setValueAtTime(0.16, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.07);

    // Short noise snap for the "wood" edge of the click
    var len = Math.floor(ac.sampleRate * 0.02);
    var buf = ac.createBuffer(1, len, ac.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var noise = ac.createBufferSource();
    var ng = ac.createGain();
    ng.gain.setValueAtTime(0.09, t);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);
    noise.buffer = buf;
    noise.connect(ng);
    ng.connect(ac.destination);
    noise.start(t);
  }

  // --- Background music: slow generative ambient ---
  // Fmaj7 -> Am7 -> Dm7 -> G, one chord every ~9s, warm low register.
  var CHORDS = [
    { name: 'Fmaj7', bass: 87.31, freqs: [174.61, 220.00, 261.63, 329.63] },
    { name: 'Am7', bass: 110.00, freqs: [220.00, 261.63, 329.63, 392.00] },
    { name: 'Dm7', bass: 73.42, freqs: [146.83, 174.61, 220.00, 261.63] },
    { name: 'G', bass: 98.00, freqs: [196.00, 246.94, 293.66, 392.00] }
  ];
  // F pentatonic melody notes, high and soft
  var MELODY = [698.46, 783.99, 880.00, 1046.50, 1174.66];
  var BAR_MS = 9000;

  function playVoice(freq, when, dur, vol, type) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.linearRampToValueAtTime(vol, when + dur * 0.35);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.connect(gain);
    gain.connect(musicBus);
    osc.start(when);
    osc.stop(when + dur + 0.1);
  }

  function playBell(freq, when) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.linearRampToValueAtTime(0.055, when + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 2.4);
    osc.connect(gain);
    gain.connect(musicBus);
    osc.start(when);
    osc.stop(when + 2.6);
  }

  function scheduleBar() {
    musicTimer = null;
    if (!audioEnabled() || !ctx) return;
    if (ctx.state !== 'running') {
      // Resume may still be pending (autoplay policy); retry shortly instead
      // of dropping the whole loop.
      nextBarEpoch = Date.now() + 500;
      musicTimer = setTimeout(scheduleBar, 500);
      return;
    }
    var chord = CHORDS[barIndex % CHORDS.length];
    barIndex++;
    var t = ctx.currentTime + 0.05;
    playVoice(chord.bass, t, BAR_MS / 1000, 0.05, 'triangle');
    for (var i = 0; i < chord.freqs.length; i++) {
      playVoice(chord.freqs[i], t, BAR_MS / 1000, i === 0 ? 0.035 : 0.026, i === 0 ? 'triangle' : 'sine');
    }
    if (Math.random() < 0.75) {
      playBell(MELODY[Math.floor(Math.random() * MELODY.length)], t + 1 + Math.random() * 5);
    }
    nextBarEpoch = Date.now() + BAR_MS;
    musicTimer = setTimeout(scheduleBar, BAR_MS);
  }

  function stopMusic() {
    if (musicTimer) { clearTimeout(musicTimer); musicTimer = null; }
    if (musicBus && ctx) {
      try {
        musicBus.gain.cancelScheduledValues(ctx.currentTime);
        musicBus.gain.setValueAtTime(0, ctx.currentTime);
      } catch (err) { /* context not ready yet */ }
    }
  }

  function startMusic() {
    if (musicBus && ctx) musicBus.gain.setValueAtTime(1, ctx.currentTime);
    if (musicTimer) return;
    // Continue where the previous page left off if the user navigated here:
    // keep the chord progression position and honour the next-bar timing.
    var stored = consumeMusicState();
    if (stored) {
      barIndex = stored.bar;
      var delay = Math.max(0, Math.min(BAR_MS, stored.nextBarAt - Date.now()));
      nextBarEpoch = Date.now() + delay;
      musicTimer = setTimeout(scheduleBar, delay);
    } else {
      scheduleBar();
    }
  }

  // --- Audio start ---
  // Try right away: when the user got here by clicking a link, the user
  // activation carries over to the new document for a few seconds, so the
  // music resumes by itself instead of going silent until the next gesture.
  // If that window already expired (e.g. a pasted URL), the AudioContext
  // stays suspended and we fall back to the first pointer/key gesture.
  function start() {
    if (started) return;
    var ac = ensureCtx();
    if (!ac) return;
    if (ac.state === 'running') {
      started = true;
      if (audioEnabled()) startMusic();
    } else {
      // resume() was called by ensureCtx(); inside a user gesture it flips
      // to running shortly and resolves the promise.
      ac.resume().then(function () {
        if (started) return;
        started = true;
        if (audioEnabled()) startMusic();
      }).catch(function () { });
    }
  }
  document.addEventListener('pointerdown', start, true);
  document.addEventListener('keydown', start, true);
  start();

  // Hand the loop over to the next page (bar position + next bar timing).
  window.addEventListener('pagehide', persistMusicState);

  // --- Click sounds on every interactive control ---
  // Buttons AND links. A link that navigates away from the page has to wait
  // for the blip or the sound dies with the document (the browser starts
  // tearing the page down before the ~70ms click reaches the speakers), so
  // for plain left-clicks on in-place navigations we preventDefault, play
  // the click, and follow the href once it landed. Modified clicks
  // (ctrl/cmd/middle, target="_blank", download) are left untouched —
  // those keep the current page alive, so their sound plays fine.
  var NAV_SOUND_MS = 130;
  var navUrl = null;
  var navToken = 0;

  document.addEventListener('click', function (e) {
    if (!audioEnabled()) return;
    if (!e.target || !e.target.closest) return;
    var el = e.target.closest('button, a.menu-button, a.legacy-button, a.nav-back-btn, a.legacy-btn, a.discord-corner-btn');
    if (el) playClick();

    if (!el || el.tagName !== 'A') return;
    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

    // e.button is 0 for plain left click (and Enter); modified presses /
    // target="_blank" keep this page alive, so their sound plays unimpeded
    if (el.target || el.hasAttribute('download')) return;

    var href = el.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#') return;

    e.preventDefault();
    navUrl = href;
    var token = ++navToken;
    setTimeout(function () {
      if (token === navToken && navUrl) {
        var url = navUrl;
        navUrl = null;
        window.location.href = url;
      }
    }, NAV_SOUND_MS);
  }, true);

  // --- Floating toggle button (bottom-right, above the Discord button) ---
  if (!document.getElementById('och-audio-style')) {
    var style = document.createElement('style');
    style.id = 'och-audio-style';
    style.textContent = [
      '.och-audio-btn{position:fixed;bottom:64px;right:16px;z-index:50;display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;color:#fff;font-size:17px;text-shadow:2px 2px #222;background:#2b8444;border:2px solid #1b1b1b;box-shadow:inset 2px 2px #4fc473,inset -2px -2px #144924,3px 3px rgba(0,0,0,.65);cursor:pointer;transition:filter .15s ease;}',
      '.och-audio-btn:hover{filter:brightness(1.15);}',
      '.och-audio-btn.off{background:#555;box-shadow:inset 2px 2px #aaa,inset -2px -2px #222,3px 3px rgba(0,0,0,.65);}',
      '@media(max-width:640px){.och-audio-btn{bottom:70px;right:12px;width:38px;height:38px;}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function refreshButton(btn) {
    var on = audioEnabled();
    btn.classList.toggle('off', !on);
    btn.innerHTML = on
      ? '<i class="fa-solid fa-volume-high" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-volume-xmark" aria-hidden="true"></i>';
    var label = on
      ? (isEs() ? 'Sonido: activado' : 'Sound: on')
      : (isEs() ? 'Sonido: desactivado' : 'Sound: off');
    btn.title = label;
    btn.setAttribute('aria-label', label);
  }

  function buildButton() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'och-audio-btn';
    btn.id = 'och-audio-btn';
    refreshButton(btn);
    btn.addEventListener('click', function () {
      var on = audioEnabled();
      localStorage.setItem(PREF_KEY, on ? 'off' : 'on');
      on = !on;
      if (on) {
        var ac = ensureCtx();
        if (ac) startMusic();
      } else {
        stopMusic();
      }
      refreshButton(btn);
    });
    document.body.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildButton);
  } else {
    buildButton();
  }
})();
