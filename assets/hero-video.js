// A fixed, prerecorded background playlist independent of hero content.
const root = document.querySelector('.site-video-background');
const button = document.querySelector('#hero-video-pause');
const label = document.querySelector('.hero-video-label');

if (root && button) {
  const clips = [
    { src: '/Local_StartUP/assets/media/hero-glass-3s.mp4', name: '유리빛 조형물', label: '01 / GLASS REVERIE' },
    { src: '/Local_StartUP/assets/media/hero-bloom-3s.mp4', name: '빛의 꽃', label: '02 / LUMINOUS BLOOM' },
    { src: '/Local_StartUP/assets/media/hero-tide-3s.mp4', name: '빛물결', label: '03 / TIDES OF LIGHT' }
  ];
  const videos = [...root.querySelectorAll('video')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const HOLD = 6000, FADE = 800;
  let current = 0, active = 0, transitions = 0, userPaused = reduce.matches;
  let reducedOptIn = false, failed = false, starting = false, switching = false;
  let timer = 0, fadeTimer = 0, deadline = 0, remaining = HOLD, destroyed = false;
  const loads = new WeakMap();
  videos.forEach(video => { video.muted = true; video.loop = true; video.playsInline = true; });

  function canRun() {
    return !destroyed && !userPaused && !document.hidden &&
      (!reduce.matches || reducedOptIn);
  }
  function updateButton() {
    button.textContent = userPaused || failed ? '배경영상 재생' : '배경영상 멈춤';
    button.setAttribute('aria-pressed', String(userPaused));
    root.dataset.state = failed ? 'fallback' : userPaused ? 'paused' : canRun() ? 'playing' : 'suspended';
  }
  function stop() {
    if (timer) { remaining = Math.max(0, deadline - performance.now()); clearTimeout(timer); timer = 0; }
    videos.forEach(video => video.pause());
    updateButton();
  }
  function loadClip(video, index) {
    const old = loads.get(video);
    if (old?.index === index) return old.promise;
    const promise = new Promise((resolve, reject) => {
      let timeout;
      const cleanup = () => { clearTimeout(timeout); video.removeEventListener('loadeddata', ready); video.removeEventListener('error', error); };
      const ready = () => { cleanup(); resolve(); };
      const error = () => { cleanup(); loads.delete(video); reject(new Error('Background video unavailable')); };
      video.addEventListener('loadeddata', ready, { once: true });
      video.addEventListener('error', error, { once: true });
      timeout = setTimeout(error, 8000);
      video.preload = 'auto'; video.src = clips[index].src; video.load();
    });
    loads.set(video, { index, promise });
    return promise;
  }
  function prepareNext() {
    if (!canRun()) return;
    loadClip(videos[1 - active], (current + 1) % clips.length).catch(() => {});
  }
  function schedule() {
    if (!canRun() || timer || destroyed) return;
    deadline = performance.now() + remaining;
    timer = setTimeout(() => { timer = 0; remaining = HOLD; advance(); }, remaining);
  }
  async function start() {
    if (!canRun()) { stop(); return; }
    if (starting || switching) return;
    starting = true;
    try {
      await loadClip(videos[active], current);
      videos[active].classList.add('is-visible');
      document.body.classList.add('site-video-ready');
      if (!canRun()) { stop(); return; }
      await videos[active].play();
      if (!canRun()) { stop(); return; }
      failed = false; updateButton(); schedule(); prepareNext();
    } catch {
      failed = userPaused = true; stop();
    } finally { starting = false; }
  }
  async function advance() {
    if (!canRun() || switching) return;
    switching = true;
    const next = (current + 1) % clips.length, incoming = 1 - active, outgoing = active;
    try {
      await loadClip(videos[incoming], next);
      if (!canRun()) return;
      videos[incoming].currentTime = 0;
      await videos[incoming].play();
      if (!canRun()) { videos[incoming].pause(); return; }
      active = incoming; current = next;
      videos[incoming].classList.add('is-visible');
      videos[outgoing].classList.remove('is-visible');
      label.textContent = clips[current].label;
      root.dataset.theme = clips[current].name;
      root.dataset.transitions = String(++transitions);
      clearTimeout(fadeTimer);
      fadeTimer = setTimeout(() => { videos[outgoing].pause(); prepareNext(); }, FADE);
    } catch {
      // Keep the current clip visible if the next file cannot be decoded.
      videos[incoming].pause();
    } finally {
      switching = false;
      if (canRun()) { remaining = HOLD; schedule(); } else stop();
    }
  }
  function sync() { if (canRun()) start(); else stop(); }
  button.addEventListener('click', () => {
    userPaused = !userPaused;
    if (!userPaused) { failed = false; reducedOptIn = true; }
    updateButton(); sync();
  });
  document.addEventListener('visibilitychange', sync);
  reduce.addEventListener('change', () => { reducedOptIn = false; userPaused = reduce.matches; sync(); });
  window.addEventListener('pagehide', () => { destroyed = true; stop(); clearTimeout(fadeTimer); });
  window.addEventListener('pageshow', () => { destroyed = false; sync(); });
  root.dataset.theme = clips[0].name; root.dataset.transitions = '0';
  updateButton(); sync();
}
