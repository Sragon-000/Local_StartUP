const stage = document.querySelector('.hero-title-wrap');
const canvas = document.querySelector('#light-field');
const trigger = document.querySelector('#light-trigger');
const controls = document.querySelector('.light-controls');
const status = document.querySelector('#light-status');
const pause = document.querySelector('#light-pause');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

const explore = document.querySelector('#light-explore');
const back = document.querySelector('#light-return');
const tools = document.querySelector('.light-tools');
const hint = document.querySelector('.light-hint');
const kicker = document.querySelector('.hero-kicker');

// The supplied visual is the default: no GPU context, buffers or animation loop until requested.
if (stage && canvas && trigger && controls && status && pause && explore && back) {
  let controller, loading = false;
  function showArt() {
    controller?.close();
    stage.classList.remove('light-experience');
    explore.hidden = reduce.matches; explore.disabled = false;
    explore.setAttribute('aria-expanded', 'false');
    controls.hidden = tools.hidden = status.hidden = hint.hidden = true;
    kicker.textContent = 'FOR YOUR FIRST CREATIVE MOMENT';
  }
  explore.addEventListener('click', async () => {
    if (loading || reduce.matches) return;
    loading = true; explore.disabled = true;
    try {
      if (!controller) {
        const geometry = await import('./light-sculpture.js');
        const wordmark = new Image();
        wordmark.src = '/Local_StartUP/assets/bitgyeol-wordmark.png';
        await wordmark.decode().catch(() => {});
        const gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
        if (!gl) throw new Error('WebGL unavailable');
        controller = initialize(gl, { ...geometry, wordmark: wordmark.naturalWidth ? wordmark : null });
      }
      stage.classList.add('light-experience'); explore.hidden = true;
      explore.setAttribute('aria-expanded', 'true');
      controls.hidden = tools.hidden = status.hidden = hint.hidden = false;
      kicker.textContent = '움직여보세요. 당신의 빛이 시작됩니다.';
      controller.open();
      back.focus({ preventScroll: true });
    } catch (error) {
      showArt(); explore.hidden = true; canvas.dataset.state = 'static';
      console.warn('Light sculpture uses static fallback:', error.message);
    } finally { loading = false; }
  });
  back.addEventListener('click', () => { showArt(); explore.focus({ preventScroll: true }); });
  stage.addEventListener('keydown', e => { if (e.key === 'Escape' && stage.classList.contains('light-experience')) { showArt(); explore.focus({ preventScroll: true }); } });
  reduce.addEventListener('change', () => { if (reduce.matches) showArt(); else explore.hidden = false; });
  showArt();
}

function initialize(gl, { createSculpture, qualityLevels, nextQuality, wordmark }) {
  const vertex = `
    precision highp float;
    attribute vec3 aText, aFlower, aWave, aScatter;
    attribute vec4 aLamp;
    attribute float aSeed;
    uniform vec4 uFrom, uTo;
    uniform float uScatterFrom, uScatterTo, uMorph, uTime, uAspect, uScale, uDpr;
    uniform float uHold, uBurst, uScroll, uDensity;
    uniform vec2 uPointer;
    varying float vAlpha, vHue, vLamp, vCore;
    vec3 form(vec4 w, float s) { return aText*w.x+aLamp.xyz*w.y+aFlower*w.z+aWave*w.w+aScatter*s; }
    void main() {
      float m=uMorph*uMorph*(3.0-2.0*uMorph);
      vec4 weights=mix(uFrom,uTo,m);
      vec3 p=mix(form(uFrom,uScatterFrom),form(uTo,uScatterTo),m);
      float arc=sin(m*3.14159);
      float angle=arc*(aSeed-.5)*1.15;
      p.xz=mat2(cos(angle),-sin(angle),sin(angle),cos(angle))*p.xz;
      p+=aScatter*arc*.15;
      float organic=1.0-weights.x*.95-weights.y*.78;
      p.y+=sin(uTime*.7+aSeed*30.0+p.x*3.0)*.026*organic;
      p.y+=sin(uTime*1.1+p.x*3.0+p.z*2.0)*.09*weights.w;
      p.z+=sin(uTime*.6+p.x*4.0+p.y*2.0)*.065*organic;
      vec2 mouse=vec2(uPointer.x*uAspect,uPointer.y-.18)/uScale;
      vec2 away=p.xy-mouse;
      float near=exp(-dot(away,away)*4.0);
      p.xy+=normalize(away+vec2(.001))*near*.16*(1.0-uHold);
      p=mix(p,vec3(mouse,p.z*.3),uHold*.72);
      p+=normalize(aScatter+vec3(.01))*uBurst*(.24+aSeed*.30);
      float ry=uPointer.x*.25+sin(uTime*.22)*.09*organic;
      float rx=-uPointer.y*.13;
      p.xz=mat2(cos(ry),-sin(ry),sin(ry),cos(ry))*p.xz;
      p.yz=mat2(cos(rx),-sin(rx),sin(rx),cos(rx))*p.yz;
      p*=uScale*(1.0-uScroll*.38);
      p.y+=.18+uScroll*.22;
      float depth=4.2/(4.2-p.z+uScroll*1.2);
      gl_Position=vec4(p.x/uAspect*depth,p.y*depth,0.0,1.0);
      float core=step(2.5,aLamp.w)*(1.0-step(3.5,aLamp.w))*weights.y;
      float corona=step(3.5,aLamp.w)*weights.y;
      gl_PointSize=(1.25+aSeed*1.5+core*1.9+corona*2.8)*uDpr*depth*uDensity;
      vAlpha=(.5+aSeed*.48)*(1.0-uScroll*.7)*(1.0-corona*.6);
      vAlpha*=1.0+core*(.35+sin(uTime*1.8)*.10);
      vHue=aSeed;vLamp=weights.y;vCore=core;
    }`;
  const fragment = `
    precision mediump float;
    varying float vAlpha, vHue, vLamp, vCore;
    void main(){
      vec2 q=gl_PointCoord-vec2(.5);
      float r=dot(q,q)*4.0;
      if(r>1.0) discard;
      float glow=(1.0-r)*(1.0-r);
      vec3 lavender=mix(vec3(.60,.37,.87),vec3(.94,.82,1.0),vHue);
      vec3 silver=mix(vec3(.63,.58,.70),vec3(.97,.94,1.0),vHue);
      vec3 color=mix(lavender,silver,vLamp*.85);
      color=mix(color,vec3(1.0,.94,1.0),vCore);
      gl_FragColor=vec4(color,glow*vAlpha);
    }`;
  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader); gl.deleteShader(shader); throw new Error(error);
    }
    return shader;
  };
  const program = gl.createProgram();
  const vs = compile(gl.VERTEX_SHADER, vertex), fs = compile(gl.FRAGMENT_SHADER, fragment);
  gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
  gl.deleteShader(vs); gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  gl.useProgram(program); gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE); gl.disable(gl.DEPTH_TEST);
  const uniforms = Object.fromEntries(['From','To','ScatterFrom','ScatterTo','Morph','Time','Aspect','Scale','Dpr','Hold','Burst','Scroll','Density','Pointer'].map(k => [k, gl.getUniformLocation(program, `u${k}`)]));
  const mobile = matchMedia('(max-width: 600px)');
  const constrained = navigator.connection?.saveData || (navigator.deviceMemory && navigator.deviceMemory <= 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
  const levels = qualityLevels({ small: mobile.matches, constrained: Boolean(constrained) });
  const maxCount = levels.at(-1).count;
  let quality = levels.length - 1, drawCount = maxCount;
  const arrays = createSculpture(maxCount);
  const mask = document.createElement('canvas'); mask.width = 900; mask.height = 400;
  const ink = mask.getContext('2d', { willReadFrequently: true });
  ink.fillStyle = 'white'; ink.textAlign = 'center'; ink.textBaseline = 'middle';
  ink.font = '700 300px "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';
  if (wordmark) {
    const scale = Math.min(900 / wordmark.naturalWidth, 400 / wordmark.naturalHeight);
    const width = wordmark.naturalWidth * scale, height = wordmark.naturalHeight * scale;
    ink.drawImage(wordmark, (900 - width) / 2, (400 - height) / 2, width, height);
  } else ink.fillText('빛결', 450, 205);
  const pixels = ink.getImageData(0, 0, 900, 400).data, glyph = [];
  for (let y = 0; y < 400; y += 2) for (let x = 0; x < 900; x += 2) if (pixels[(y * 900 + x) * 4] + pixels[(y * 900 + x) * 4 + 1] + pixels[(y * 900 + x) * 4 + 2] > 420) glyph.push(x, y);
  if (!glyph.length) throw new Error('Brand glyph unavailable');
  for (let i = 0; i < maxCount; i++) {
    const pick = Math.floor(arrays.Seed[i] * glyph.length / 2) * 2;
    arrays.Text[i * 3] = (glyph[pick] - 450) / 240;
    arrays.Text[i * 3 + 1] = (200 - glyph[pick + 1]) / 240;
    arrays.Text[i * 3 + 2] = (arrays.Seed[(i + 1) % maxCount] - .5) * .09;
  }
  // Static buffers are uploaded exactly once. Every form, pulse and interaction stays on the GPU.
  for (const [name, data] of Object.entries(arrays)) {
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const location = gl.getAttribLocation(program, `a${name}`);
    gl.enableVertexAttribArray(location); gl.vertexAttribPointer(location, name === 'Seed' ? 1 : name === 'Lamp' ? 4 : 3, gl.FLOAT, false, 0, 0);
  }

  const shapes = ['빛결','스탠드 조명','빛의 꽃','물결'];
  const shapeButtons = [...controls.querySelectorAll('[data-light-shape]')];
  // Preallocated weights avoid allocating arrays on the animation loop.
  const from = new Float32Array(4), to = new Float32Array([0,1,0,0]);
  let scatterFrom = 1, scatterTo = 0, morph = 0, shape = 1, transitionStart = 0, duration = 2300;
  let frame = 0, lastDraw = 0, lastRaf = 0, time = 0, visible = true, userPaused = false, lost = false, experience = false;
  let hold = 0, held = false, burst = 0, px = 0, py = 0, targetX = 0, targetY = 0, scroll = 0;
  let down = null, interactedAt = 0, bounds = null, pageTop = 0;
  let sampleStart = 0, sampleSum = 0, sampleCount = 0, qualityChangedAt = 0, reportAt = 0, drawn = 0, pressureSince = 0, healthySince = 0;
  const ease = t => t * t * (3 - 2 * t);
  const clamp = n => Math.min(1, Math.max(0, n));
  function interact() { interactedAt = performance.now(); }
  function setShape(index, user = true) {
    if (reduce.matches || lost || userPaused || index < 0 || index >= shapes.length) return;
    if (user) interact();
    const m = ease(morph);
    for (let i = 0; i < 4; i++) { from[i] += (to[i] - from[i]) * m; to[i] = Number(i === index); }
    scatterFrom += (scatterTo - scatterFrom) * m; scatterTo = 0;
    shape = index; morph = 0; transitionStart = time; duration = index === 1 ? 1850 : 1500;
    burst = user ? .65 : .18;
    status.textContent = `0${index + 1} / ${shapes[index]}`;
    stage.dataset.lightShape = shapes[index];
    shapeButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    start();
  }
  function resize() {
    bounds = stage.getBoundingClientRect(); pageTop = bounds.top + scrollY;
    // A DPR limit AND a total pixel budget protect large/retina windows from excessive fill work.
    const pixelBudget = mobile.matches ? 650000 : 1800000;
    const dpr = Math.min(devicePixelRatio || 1, levels[quality].dpr, mobile.matches ? 1.4 : 1.75,
      Math.sqrt(pixelBudget / Math.max(1, bounds.width * bounds.height)));
    const width = Math.max(1, Math.round(bounds.width * dpr)), height = Math.max(1, Math.round(bounds.height * dpr));
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
    gl.viewport(0, 0, width, height);
    const aspect = bounds.width / Math.max(bounds.height, 1);
    gl.uniform1f(uniforms.Aspect, aspect); gl.uniform1f(uniforms.Scale, Math.min(.56, aspect / 1.65)); gl.uniform1f(uniforms.Dpr, dpr);
    updateScroll();
    if (userPaused && experience) render(0);
  }
  function qualityReport() {
    canvas.dataset.quality = ['low','balanced','high'][quality];
    canvas.dataset.particles = String(drawCount);
  }
  function render(delta) {
    const follow = 1 - Math.exp(-delta * .007);
    px += (targetX - px) * follow; py += (targetY - py) * follow;
    hold += ((held ? 1 : 0) - hold) * follow; burst *= Math.exp(-delta * .0028);
    morph = clamp((time - transitionStart) / duration);
    gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform4fv(uniforms.From, from); gl.uniform4fv(uniforms.To, to);
    gl.uniform1f(uniforms.ScatterFrom, scatterFrom); gl.uniform1f(uniforms.ScatterTo, scatterTo);
    gl.uniform1f(uniforms.Morph, morph); gl.uniform1f(uniforms.Time, time * .001);
    gl.uniform1f(uniforms.Hold, hold); gl.uniform1f(uniforms.Burst, burst); gl.uniform1f(uniforms.Scroll, scroll);
    gl.uniform2f(uniforms.Pointer, px, py); gl.uniform1f(uniforms.Density, Math.min(1.4, Math.sqrt(maxCount / drawCount)));
    gl.drawArrays(gl.POINTS, 0, drawCount);
  }
  function draw(now) {
    frame = 0;
    if (!canRun()) return;
    const gap = lastRaf ? now - lastRaf : 0; lastRaf = now;
    if (!sampleStart) sampleStart = now;
    if (gap > 0 && gap < 120) { sampleSum += gap; sampleCount++; }
    if (now - sampleStart >= 1200 && sampleCount > 20) {
      const average = sampleSum / sampleCount;
      if (average > 25) { pressureSince ||= sampleStart; healthySince = 0; }
      else if (average < 19) { healthySince ||= sampleStart; pressureSince = 0; }
      else { pressureSince = healthySince = 0; }
      const stableMs = average > 25 ? now - pressureSince : healthySince ? now - healthySince : 0;
      const next = now - qualityChangedAt < 4000 ? quality : nextQuality(quality, average, stableMs, levels.length - 1);
      if (next !== quality) {
        quality = next; drawCount = levels[next].count; qualityChangedAt = now;
        pressureSince = healthySince = 0; resize(); qualityReport();
      }
      sampleStart = now; sampleSum = sampleCount = 0;
    }
    const active = morph < 1 || held || burst > .02 || now - interactedAt < 1600;
    const interval = mobile.matches || !active ? 1000 / 30 : 1000 / 60;
    if (!lastDraw || now - lastDraw >= interval - 1.5) {
      const delta = lastDraw ? Math.min(100, now - lastDraw) : interval;
      lastDraw = now; time += delta; render(delta); drawn++;
    }
    if (now - reportAt >= 1200) {
      if (reportAt) canvas.dataset.fps = String(Math.round(drawn * 1000 / (now - reportAt)));
      reportAt = now; drawn = 0;
    }
    frame = requestAnimationFrame(draw);
  }
  function canRun() { return experience && !reduce.matches && !userPaused && !document.hidden && visible && !lost; }
  function start() {
    if (canRun() && !frame) {
      lastDraw = lastRaf = sampleStart = 0; sampleSum = sampleCount = 0; pressureSince = healthySince = 0;
      canvas.dataset.state = 'running'; frame = requestAnimationFrame(draw);
    }
  }
  function stop(reason) {
    cancelAnimationFrame(frame); frame = 0; lastDraw = lastRaf = 0; held = false; down = null;
    canvas.dataset.state = reason;
  }
  function preferences() {
    stage.classList.toggle('light-ready', !reduce.matches && !lost);
    if (reduce.matches || lost) {
      experience = false; stage.classList.remove('light-experience');
      explore.hidden = reduce.matches || lost; controls.hidden = tools.hidden = status.hidden = hint.hidden = true;
      kicker.textContent = 'FOR YOUR FIRST CREATIVE MOMENT';
    }
    if (reduce.matches || lost) stop('static'); else start();
  }
  function updatePointer(e) {
    if (!bounds || !experience) return;
    targetX = Math.max(-1, Math.min(1, ((e.clientX - bounds.left) / bounds.width - .5) * 2));
    targetY = Math.max(-1, Math.min(1, -((e.clientY - (pageTop - scrollY)) / bounds.height - .5) * 2));
    interactedAt = performance.now();
  }
  stage.addEventListener('pointermove', e => {
    updatePointer(e);
    if (down && e.pointerType === 'touch' && Math.abs(e.clientY - down.y) > 16) { held = false; down = null; }
  }, { passive: true });
  stage.addEventListener('pointerdown', e => {
    if (!experience || e.target.closest('button,a') || userPaused || reduce.matches || !e.isPrimary) return;
    interact(); updatePointer(e); held = true; down = { id: e.pointerId, y: e.clientY };
  }, { passive: true });
  window.addEventListener('pointerup', e => {
    if (down?.id !== e.pointerId) return;
    held = false; down = null; setShape((shape + 1) % shapes.length);
  }, { passive: true });
  window.addEventListener('pointercancel', () => { held = false; down = null; });
  stage.addEventListener('pointerleave', () => { targetX = targetY = 0; });
  trigger.addEventListener('click', () => setShape((shape + 1) % shapes.length));
  shapeButtons.forEach((button, i) => button.addEventListener('click', () => setShape(i)));
  pause.addEventListener('click', () => {
    userPaused = !userPaused; interact(); pause.setAttribute('aria-pressed', String(userPaused));
    pause.textContent = userPaused ? '움직임 재생' : '움직임 멈춤';
    trigger.disabled = userPaused; shapeButtons.forEach(button => { button.disabled = userPaused; });
    if (userPaused) stop('paused'); else start();
  });
  function updateScroll() {
    if (bounds) scroll = clamp((scrollY - pageTop) / Math.max(bounds.height, 1));
  }
  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop('hidden'); else start(); });
  window.addEventListener('pagehide', () => stop('hidden'));
  window.addEventListener('pageshow', start);
  reduce.addEventListener('change', preferences);
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); lost = true; stop('static'); preferences(); });
  new ResizeObserver(resize).observe(stage);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start(); else stop('offscreen');
  }).observe(stage);
  qualityChangedAt = performance.now();
  resize(); qualityReport(); preferences();
  status.textContent = '02 / 스탠드 조명'; stage.dataset.lightShape = '스탠드 조명';
  canvas.dataset.state = 'dormant';
  return {
    open() {
      experience = true; userPaused = false;
      pause.textContent = '움직임 멈춤'; pause.setAttribute('aria-pressed', 'false');
      trigger.disabled = false; shapeButtons.forEach(button => { button.disabled = false; });
      resize(); start();
    },
    close() { experience = false; stop('dormant'); }
  };
}
