import { artworks } from './art-shelf-data.js';

const root = document.querySelector('#art-gallery');
if (root && artworks.length) initializeGallery(root);

function initializeGallery(root) {
  const section = root.closest('section');
  const viewport = root.querySelector('.art-viewport');
  const stage = root.querySelector('.art-stage');
  const caption = root.querySelector('.archive-caption-content');
  const nav = root.querySelector('.art-slot-nav');
  const dialog = document.querySelector('#art-detail');
  const detailMedia = dialog.querySelector('.art-detail-media');
  const pause = root.querySelector('.art-pause');
  const cursor = root.querySelector('.art-cursor');
  const detailFacts = document.createElement('dl');
  detailFacts.className = 'art-detail-facts';
  detailFacts.setAttribute('aria-label', '작품 정보');
  dialog.querySelector('.art-detail-description').parentElement.after(detailFacts);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const count = artworks.length, copies = count * 3;
  const modulo = (n, m) => ((n % m) + m) % m;
  const smooth = n => n * n * (3 - 2 * n);
  let position = count, target = count, selected = -1;
  let height = 300, spine = 48, cover = 230, gap = 12;
  let frame = 0, previousTime = 0, visible = false, hovering = -1;
  let tiltX = 0, tiltY = 0, aimX = 0, aimY = 0;
  let drag = null, suppressClick = false, wheelTimer, closeAnimation;
  let userPaused = reduced.matches, returnFocus;
  const preview = document.createElement('video');
  preview.muted = true; preview.loop = true; preview.playsInline = true;
  preview.preload = 'none'; preview.setAttribute('aria-hidden', 'true');
  const panels = [];

  function placeholder(index) {
    const node = document.createElement('div');
    node.className = 'art-placeholder';
    node.setAttribute('aria-hidden', 'true');
    node.innerHTML = '<small>BITGYEOL ARCHIVE</small><b></b><span>작품 준비 중</span><em>YOUR ART HERE</em>';
    node.querySelector('b').textContent = String(index + 1).padStart(2, '0');
    return node;
  }

  function addPoster(parent, art) {
    if (!art.poster) return;
    const img = document.createElement('img');
    img.alt = ''; img.loading = 'lazy'; img.src = art.poster;
    img.addEventListener('error', () => img.remove(), { once: true });
    parent.append(img);
  }

  for (let v = 0; v < copies; v++) {
    const index = v % count, art = artworks[index];
    const button = document.createElement('button');
    button.className = 'art-panel'; button.type = 'button'; button.tabIndex = -1;
    button.setAttribute('aria-hidden', 'true');
    button.setAttribute('aria-label', `${art.title} 크게 보기`);
    button.innerHTML = '<span class="art-face art-spine" aria-hidden="true"><b></b><span></span><small>빛결</small></span><span class="art-face art-cover" aria-hidden="true"></span>';
    const side = button.querySelector('.art-spine'), front = button.querySelector('.art-cover');
    side.querySelector('b').textContent = String(index + 1).padStart(2, '0');
    side.querySelector('span').textContent = art.title + ' / MEDIA ART';
    front.append(placeholder(index)); addPoster(front, art);
    button.addEventListener('pointerenter', () => { hovering = v; requestFrame(); });
    button.addEventListener('pointerleave', () => { hovering = -1; requestFrame(); });
    button.addEventListener('click', () => {
      if (suppressClick) return;
      const relative = relativeIndex(v);
      if (Math.abs(relative) < .45) openDetail();
      else { target = Math.round(position + relative); requestFrame(); }
    });
    stage.append(button);
    panels.push({ button, side, front, v, lift: 0 });
  }
  artworks.forEach((art, index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = String(index + 1).padStart(2, '0');
    button.setAttribute('aria-label', `${art.title} 선택`);
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      const delta = modulo(index - modulo(Math.round(target), count) + count / 2, count) - count / 2;
      target = Math.round(target) + delta; requestFrame();
    });
    nav.append(button);
  });

  function relativeIndex(v) { return modulo(v - position + copies / 2, copies) - copies / 2; }
  function requestFrame() { if (!frame && visible && !document.hidden && !dialog.open) frame = requestAnimationFrame(render); }
  function measure() {
    // Resolve clamp()/vw via a probe; the authored custom property is not a pixel value.
    const probe = document.createElement('div');
    probe.style.height = 'var(--art-h)'; probe.style.position = 'absolute';
    viewport.append(probe); height = probe.getBoundingClientRect().height; probe.remove();
    spine = height * .155; cover = height * .72; gap = height * .035;
    stage.style.setProperty('--h', `${height}px`);
    stage.style.setProperty('--spine', `${spine}px`);
    stage.style.setProperty('--cover', `${cover}px`);
    requestFrame();
  }
  function updateCaption(index) {
    if (index === selected) return;
    selected = index;
    const art = artworks[index];
    caption.querySelector('.art-meta').textContent = `${String(index + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')} — ${art.medium}`;
    caption.querySelector('h3').textContent = art.title;
    caption.querySelector('.archive-caption-description').textContent = art.poster || art.video ? art.subtitle : '당신의 미디어아트가 들어갈 자리';
    for (const [i, button] of [...nav.children].entries()) button.setAttribute('aria-pressed', String(i === index));
    caption.getAnimations().forEach(a => a.cancel());
    if (!reduced.matches) caption.animate([{ transform: 'translateY(22px)', clipPath: 'inset(100% 0 0)' }, { transform: 'translateY(0)', clipPath: 'inset(0)' }], { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' });
    preview.pause(); preview.remove();
    if (art.video) { preview.src = art.video; preview.poster = art.poster || ''; }
    else { preview.removeAttribute('src'); preview.load(); }
    pause.hidden = !art.video;
    updatePlayback();
  }
  function updatePlayback() {
    pause.textContent = userPaused ? '움직임 재생' : '움직임 멈춤';
    pause.setAttribute('aria-pressed', String(userPaused));
    if (artworks[selected]?.video && visible && !document.hidden && !dialog.open && !userPaused) {
      const expectedSource = preview.getAttribute('src');
      preview.play().catch(error => {
        if (error.name === 'AbortError' || preview.getAttribute('src') !== expectedSource) return;
        userPaused = true; pause.textContent = '움직임 재생'; pause.setAttribute('aria-pressed', 'true');
      });
    } else preview.pause();
  }
  function render(time) {
    frame = 0;
    const dt = Math.min((time - (previousTime || time - 16)) / 1000, .05); previousTime = time;
    const k = reduced.matches ? 1 : 1 - Math.exp(-(drag?.moved ? 23 : 9) * dt);
    position += (target - position) * k;
    if (Math.abs(target - position) < .0005) position = target;
    if (Math.abs(position) > copies * 4) {
      const shift = Math.trunc(position / copies) * copies; position -= shift; target -= shift;
      if (drag) drag.startTarget -= shift;
    }
    const tiltK = reduced.matches ? 1 : 1 - Math.exp(-8 * dt);
    tiltX += (aimX - tiltX) * tiltK; tiltY += (aimY - tiltY) * tiltK;
    updateCaption(modulo(Math.round(position), count));
    let moving = Math.abs(target - position) > .0005 || Math.abs(tiltX - aimX) + Math.abs(tiltY - aimY) > .02;
    for (const panel of panels) {
      const r = relativeIndex(panel.v), abs = Math.abs(r);
      const open = smooth(Math.max(0, 1 - abs));
      const step = abs < 1 ? (r + Math.sin(Math.PI * r) / Math.PI) / 2 : Math.sign(r) / 2;
      const x = r * (spine + gap) + (cover - spine + 1.6 * gap) * step;
      const hidden = Math.abs(x) > viewport.clientWidth / 2 + cover;
      panel.button.style.visibility = hidden ? 'hidden' : 'visible';
      const active = abs < .5;
      panel.button.tabIndex = active ? 0 : -1;
      panel.button.setAttribute('aria-hidden', String(!active));
      const liftTarget = panel.v === hovering && !active && !drag ? 1 : 0;
      panel.lift += (liftTarget - panel.lift) * tiltK;
      if (Math.abs(liftTarget - panel.lift) > .005) moving = true;
      if (hidden) continue;
      panel.button.style.transform = `translate3d(${x}px,${-open * height * .025 - panel.lift * height * .045}px,${open * height * .18}px) rotateZ(${-4.5 * open}deg) rotateX(${tiltX * open}deg) rotateY(${(-90 + tiltY) * open}deg)`;
      panel.button.style.zIndex = String(Math.round(100 - abs * 4));
      panel.side.style.setProperty('--shade', open * .55);
      panel.front.style.setProperty('--shade', (1 - open) * .5);
      if (active && artworks[selected].video && preview.parentElement !== panel.front) panel.front.append(preview);
    }
    if (moving) requestFrame();
  }
  function step(direction) { target = Math.round(target) + direction; requestFrame(); }
  root.querySelector('.art-prev').addEventListener('click', () => step(-1));
  root.querySelector('.art-next').addEventListener('click', () => step(1));
  root.querySelector('.art-open').addEventListener('click', openDetail);
  pause.addEventListener('click', () => { userPaused = !userPaused; updatePlayback(); });
  section.addEventListener('keydown', event => {
    if (dialog.open || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); step(event.key === 'ArrowLeft' ? -1 : 1);
      nav.children[modulo(Math.round(target), count)].focus({ preventScroll: true });
    }
  });
  viewport.addEventListener('pointerdown', event => {
    if (event.button !== 0 || event.target.closest('.art-arrow')) return;
    clearTimeout(wheelTimer); suppressClick = false;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, startTarget: target, moved: false };
  });
  viewport.addEventListener('pointermove', event => {
    if (drag && drag.id === event.pointerId) {
      const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
      if (!drag.moved && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) { drag = null; return; }
      if (!drag.moved && Math.abs(dx) > 6) { drag.moved = true; viewport.setPointerCapture(event.pointerId); }
      if (drag.moved) { target = drag.startTarget - dx / (spine + gap); viewport.classList.add('is-dragging'); requestFrame(); }
      return;
    }
    const rect = viewport.getBoundingClientRect();
    const x = event.clientX - rect.left, y = event.clientY - rect.top;
    const onCover = Boolean(event.target.closest('.art-cover')) && Math.abs(target - position) < .2;
    viewport.classList.toggle('on-cover', onCover);
    cursor.style.left = `${x}px`; cursor.style.top = `${y}px`;
    aimX = onCover && !reduced.matches ? -(y - rect.height * .51) / height * 7 : 0;
    aimY = onCover && !reduced.matches ? (x - rect.width / 2) / cover * 9 : 0;
    requestFrame();
  });
  function endDrag(event) {
    if (!drag || drag.id !== event.pointerId) return;
    suppressClick = drag.moved; drag = null; target = Math.round(target);
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    viewport.classList.remove('is-dragging'); requestFrame();
    setTimeout(() => { suppressClick = false; }, 0);
  }
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  viewport.addEventListener('lostpointercapture', endDrag);
  viewport.addEventListener('pointerleave', () => { aimX = aimY = 0; hovering = -1; viewport.classList.remove('on-cover'); requestFrame(); });
  viewport.addEventListener('wheel', event => {
    // A middle-page gallery must not steal ordinary vertical page scrolling.
    if (event.ctrlKey || (!event.shiftKey && Math.abs(event.deltaX) <= Math.abs(event.deltaY))) return;
    event.preventDefault();
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientWidth : 1;
    target += (event.shiftKey ? event.deltaY || event.deltaX : event.deltaX) * unit / (spine + gap) * .5;
    clearTimeout(wheelTimer); wheelTimer = setTimeout(() => { target = Math.round(target); requestFrame(); }, 160);
    requestFrame();
  }, { passive: false });

  function activeRect() {
    return panels.reduce((best, p) => Math.abs(relativeIndex(p.v)) < Math.abs(relativeIndex(best.v)) ? p : best).front.getBoundingClientRect();
  }
  function clipFor(rect) { return `inset(${Math.max(0, rect.top)}px ${Math.max(0, innerWidth - rect.right)}px ${Math.max(0, innerHeight - rect.bottom)}px ${Math.max(0, rect.left)}px round 4px)`; }
  function openDetail() {
    if (dialog.open) return;
    clearTimeout(wheelTimer); target = Math.round(position);
    const index = modulo(target, count), art = artworks[index];
    updateCaption(index); returnFocus = document.activeElement;
    const rect = activeRect();
    dialog.querySelector('#art-detail-title').textContent = art.title;
    dialog.querySelector('.art-detail-label').textContent = `${String(index + 1).padStart(2, '0')} / ${art.medium}`;
    dialog.querySelector('.art-detail-description').textContent = art.description;
    dialog.querySelector('.art-detail-credit').textContent = art.credit;
    dialog.querySelector('.art-detail-credit').parentElement.hidden = !art.credit;
    dialog.classList.toggle('has-media', Boolean(art.poster || art.video));
    detailMedia.style.setProperty('--art-ratio', art.aspectRatio || '16 / 9');
    detailFacts.replaceChildren();
    for (const [label, value] of [['길이', art.duration], ['해상도', art.dimensions], ['감상 방식', art.presentation]]) {
      if (!value) continue;
      const row = document.createElement('div'), term = document.createElement('dt'), description = document.createElement('dd');
      term.textContent = label; description.textContent = value;
      row.append(term, description); detailFacts.append(row);
    }
    detailFacts.hidden = !detailFacts.children.length;
    dialog.querySelector('.art-detail-note').textContent = art.poster || art.video ? art.subtitle : '현재는 작품이 들어갈 자리를 미리 보여드리고 있어요.';
    detailMedia.replaceChildren(placeholder(index)); addPoster(detailMedia, art);
    if (art.video) {
      const video = document.createElement('video');
      video.controls = true; video.loop = true; video.muted = true; video.playsInline = true;
      video.preload = 'metadata'; video.poster = art.poster || ''; video.src = art.video;
      video.setAttribute('aria-label', `${art.title} 영상`); detailMedia.append(video);
      if (!reduced.matches && !userPaused) video.play().catch(() => {});
    }
    dialog.showModal();
    dialog.scrollTop = 0;
    document.documentElement.classList.add('art-dialog-open');
    updatePlayback(); cancelAnimationFrame(frame); frame = 0;
    viewport.classList.remove('on-cover');
    dialog.animate([{ clipPath: clipFor(rect), transform: 'rotate(-4.5deg)' }, { clipPath: 'inset(0)', transform: 'rotate(0deg)' }], { duration: reduced.matches ? 1 : 700, easing: 'cubic-bezier(.76,0,.18,1)' });
    if (!reduced.matches) {
      dialog.querySelectorAll('.art-detail-copy>div:not([hidden]), .art-detail-facts:not([hidden])').forEach((line, i) => line.animate([{ transform: 'translateY(35px)', clipPath: 'inset(100% 0 0)' }, { transform: 'translateY(0)', clipPath: 'inset(0)' }], { duration: 650, delay: 250 + i * 65, fill: 'backwards', easing: 'cubic-bezier(.2,.8,.2,1)' }));
      detailMedia.animate([{ clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)' }], { duration: 1000, delay: 300, fill: 'backwards', easing: 'cubic-bezier(.2,.8,.2,1)' });
    }
    dialog.querySelector('.art-close').focus({ preventScroll: true });
  }
  async function closeDetail() {
    if (!dialog.open || closeAnimation) return;
    dialog.querySelector('video')?.pause();
    dialog.getAnimations({ subtree: true }).forEach(a => a.cancel());
    closeAnimation = dialog.animate([{ clipPath: 'inset(0)', transform: 'rotate(0deg)' }, { clipPath: clipFor(activeRect()), transform: 'rotate(-4.5deg)' }], { duration: reduced.matches ? 1 : 450, easing: 'cubic-bezier(.76,0,.18,1)' });
    await closeAnimation.finished.catch(() => {});
    dialog.close(); closeAnimation = null;
  }
  dialog.querySelector('.art-close').addEventListener('click', closeDetail);
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeDetail(); });
  dialog.addEventListener('close', () => {
    dialog.querySelector('video')?.pause(); detailMedia.replaceChildren();
    document.documentElement.classList.remove('art-dialog-open');
    returnFocus?.focus({ preventScroll: true }); previousTime = 0; updatePlayback(); requestFrame();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; dialog.querySelector('video')?.pause(); }
    else { previousTime = 0; requestFrame(); }
    updatePlayback();
  });
  reduced.addEventListener('change', () => { if (reduced.matches) { userPaused = true; aimX = aimY = 0; dialog.querySelector('video')?.pause(); } updatePlayback(); requestFrame(); });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) { previousTime = 0; requestFrame(); }
    else { cancelAnimationFrame(frame); frame = 0; }
    updatePlayback();
  }, { threshold: .05 }).observe(viewport);
  new ResizeObserver(measure).observe(viewport);
  root.querySelector('.art-fallback').hidden = true;
  root.querySelector('.art-gallery-ui').hidden = false;
  updateCaption(0); measure();
}
