/* =========================================================
   FLORES PARA TI — script.js
   Experiencia romántica interactiva 100% cliente
   ========================================================= */

/* ---------------------------------------------------------
   CONFIGURACIÓN — puedes ajustar aquí
   --------------------------------------------------------- */
const CONFIG = {
  petalsPerFlower: 22,
  particleCount: 40,
  messageDelay1: 9500,   // ms desde el inicio hasta la 1a frase
  messageDelay2: 11500,  // ms desde el inicio hasta la 2a frase (Te amo)
  replayButtonDelay: 13000
};

const SVG_NS = 'http://www.w3.org/2000/svg';

let particles = [];
let canvas, ctx;
let animationFrameId;

/* ---------------------------------------------------------
   INICIO
   --------------------------------------------------------- */
function initExperience() {
  const openBtn = document.getElementById('open-btn');
  openBtn.addEventListener('click', startShow, { once: true });

  // Permitir también tocar el fondo por si el botón falla en algún navegador raro
  document.getElementById('intro-screen').addEventListener('touchstart', () => {}, { passive: true });
}

function startShow() {
  const intro = document.getElementById('intro-screen');
  intro.classList.add('hidden');

  const stage = document.getElementById('stage');
  stage.setAttribute('aria-hidden', 'false');

  startMusic();
  setupCanvas();
  buildFlowers();
  startParticleLoop();
  scheduleFlowerOpening();
  scheduleMessages();
  setupTapEffects();
  setupReplayButton();
}

/* ---------------------------------------------------------
   MÚSICA
   --------------------------------------------------------- */
function startMusic() {
  const audio = document.getElementById('bg-audio');
  audio.volume = 0.6;
  audio.play().catch(() => {
    // Si no existe romantic.mp3 todavía, esto fallará silenciosamente.
    // La experiencia visual sigue funcionando sin música.
  });
}

/* ---------------------------------------------------------
   CANVAS DE PARTÍCULAS DORADAS
   --------------------------------------------------------- */
function setupCanvas() {
  canvas = document.getElementById('particles-canvas');
  ctx = canvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  particles = [];
  for (let i = 0; i < CONFIG.particleCount; i++) {
    particles.push(createParticle(true));
  }
}

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function createParticle(randomStart) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return {
    x: Math.random() * w,
    y: randomStart ? Math.random() * h : h + 10,
    r: 0.6 + Math.random() * 1.8,
    speedY: 0.08 + Math.random() * 0.22,
    speedX: (Math.random() - 0.5) * 0.15,
    opacity: 0.15 + Math.random() * 0.5,
    fadeDir: Math.random() < 0.5 ? 1 : -1,
    twinkle: Math.random() * Math.PI * 2
  };
}

function updateParticles() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  ctx.clearRect(0, 0, w, h);

  particles.forEach((p) => {
    p.y -= p.speedY;
    p.x += p.speedX + Math.sin(p.twinkle) * 0.05;
    p.twinkle += 0.01;
    p.opacity += p.fadeDir * 0.0025;

    if (p.opacity <= 0.08 || p.opacity >= 0.75) {
      p.fadeDir *= -1;
    }

    if (p.y < -10) {
      Object.assign(p, createParticle(false));
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 221, 122, ${Math.max(p.opacity, 0)})`;
    ctx.shadowColor = 'rgba(255, 210, 63, 0.6)';
    ctx.shadowBlur = 4;
    ctx.fill();
  });
}

function startParticleLoop() {
  function loop() {
    updateParticles();
    animationFrameId = requestAnimationFrame(loop);
  }
  loop();
}

/* ---------------------------------------------------------
   CONSTRUCCIÓN DE LAS FLORES (SVG)
   --------------------------------------------------------- */

// Posiciones relativas al viewBox 400x700 (x, y = base del tallo en el suelo)
const FLOWER_LAYOUT = [
  { id: 'top',    baseX: 230, baseY: 700, stemH: 340, cx: 240, cy: 300, scale: 0.72, sway: 6.5, delay: 0 },
  { id: 'left',   baseX: 90,  baseY: 700, stemH: 260, cx: 95,  cy: 440, scale: 0.62, sway: 5.5, delay: 400 },
  { id: 'center', baseX: 190, baseY: 700, stemH: 190, cx: 195, cy: 555, scale: 1.05, sway: 4.5, delay: 800 }
];

function buildFlowers() {
  const container = document.getElementById('flowers-container');
  container.innerHTML = '';

  // Limpiamos los registros de animación continua: al reconstruir las
  // flores (por ejemplo al pulsar "repetir"), el bucle global de viento
  // simplemente deja de tocar los elementos anteriores en vez de tener
  // que cancelar bucles individuales sueltos.
  swayTargets.length = 0;
  wiggleTargets.length = 0;

  FLOWER_LAYOUT.forEach((layout) => {
    const group = createFlower(layout);
    container.appendChild(group);
  });
}

function createFlower(layout) {
  const group = document.createElementNS(SVG_NS, 'g');
  group.classList.add('flower-group');
  group.dataset.flowerId = layout.id;

  // ---- Tallo ----
  const stem = document.createElementNS(SVG_NS, 'path');
  const stemTopX = layout.cx;
  const stemTopY = layout.cy + 34 * layout.scale;
  const ctrlX = layout.baseX + (stemTopX - layout.baseX) * 0.5 + 14;
  stem.setAttribute(
    'd',
    `M ${layout.baseX} ${layout.baseY} Q ${ctrlX} ${(layout.baseY + stemTopY) / 2} ${stemTopX} ${stemTopY}`
  );
  stem.setAttribute('stroke', 'var(--leaf-green-dark)');
  stem.setAttribute('stroke-width', 6);
  stem.setAttribute('fill', 'none');
  stem.setAttribute('stroke-linecap', 'round');
  stem.style.opacity = 0;
  stem.style.transition = 'opacity 0.9s ease';
  group.appendChild(stem);

  // ---- Hojas ----
  for (let i = 0; i < 2; i++) {
    const leaf = createLeaf(layout, i);
    group.appendChild(leaf);
  }

  // ---- Centro de la flor: disco de semillas tipo girasol real ----
  // Un girasol tiene un centro proporcionalmente grande y oscuro, con
  // una textura de "semillas". Usamos un radio mayor que antes y dos
  // capas: un degradado radial (volumen) + un patrón de puntos (textura).
  const centerR = 34 * layout.scale;

  const center = document.createElementNS(SVG_NS, 'circle');
  center.setAttribute('cx', layout.cx);
  center.setAttribute('cy', layout.cy);
  center.setAttribute('r', centerR);
  center.setAttribute('fill', 'url(#centerGrad)');
  center.setAttribute('stroke', 'var(--outline-color)');
  center.setAttribute('stroke-width', 2.5);
  center.style.opacity = 0;
  center.style.transform = 'scale(0.3)';
  center.style.transformOrigin = `${layout.cx}px ${layout.cy}px`;
  center.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(.34,1.56,.64,1)';
  group.appendChild(center);

  // Textura de semillas (patrón de puntos) sobre el degradado
  const centerTexture = document.createElementNS(SVG_NS, 'circle');
  centerTexture.setAttribute('cx', layout.cx);
  centerTexture.setAttribute('cy', layout.cy);
  centerTexture.setAttribute('r', centerR * 0.94);
  centerTexture.setAttribute('fill', 'url(#seedPattern)');
  centerTexture.style.opacity = 0;
  centerTexture.style.transition = 'opacity 0.9s ease 0.2s';
  group.appendChild(centerTexture);

  // Pequeño brillo superior para dar volumen al centro
  const centerHighlight = document.createElementNS(SVG_NS, 'ellipse');
  centerHighlight.setAttribute('cx', layout.cx - centerR * 0.25);
  centerHighlight.setAttribute('cy', layout.cy - centerR * 0.32);
  centerHighlight.setAttribute('rx', centerR * 0.32);
  centerHighlight.setAttribute('ry', centerR * 0.18);
  centerHighlight.setAttribute('fill', '#8a5a22');
  centerHighlight.setAttribute('opacity', '0.35');
  centerHighlight.style.opacity = 0;
  centerHighlight.style.transition = 'opacity 0.9s ease 0.3s';
  group.appendChild(centerHighlight);

  // ---- Pétalos ----
  // Dos capas (una interior más corta y oscura, otra exterior más
  // larga y clara) para dar la sensación de superposición real de
  // los pétalos de un girasol, en vez de un único anillo plano.
  const petalGroup = document.createElementNS(SVG_NS, 'g');
  const count = CONFIG.petalsPerFlower;
  const innerCount = Math.round(count * 0.6);

  for (let i = 0; i < innerCount; i++) {
    const angle = (360 / innerCount) * i + 9;
    const petal = createPetal(layout, angle, i, true, centerR);
    petalGroup.appendChild(petal);
  }
  for (let i = 0; i < count; i++) {
    const angle = (360 / count) * i;
    const petal = createPetal(layout, angle, innerCount + i, false, centerR);
    petalGroup.appendChild(petal);
  }
  group.appendChild(petalGroup);

  // Guardamos referencias para animar después
  group._parts = {
    stem, center, centerTexture, centerHighlight,
    leaves: group.querySelectorAll('.leaf'),
    petals: petalGroup.querySelectorAll('.petal')
  };
  group._layout = layout;

  return group;
}

function createLeaf(layout, index) {
  const side = index === 0 ? -1 : 1;
  const yOffset = 60 + index * 55;
  const leafX = layout.baseX + side * 6;
  const leafY = layout.baseY - yOffset;
  const w = 34 * layout.scale;
  const h = 16 * layout.scale;

  const leaf = document.createElementNS(SVG_NS, 'ellipse');
  leaf.classList.add('leaf');
  leaf.setAttribute('cx', leafX + side * w * 0.6);
  leaf.setAttribute('cy', leafY);
  leaf.setAttribute('rx', w);
  leaf.setAttribute('ry', h);
  leaf.setAttribute('fill', index === 0 ? 'var(--leaf-green)' : 'var(--leaf-green-dark)');
  leaf.setAttribute('stroke', 'var(--outline-color)');
  leaf.setAttribute('stroke-width', 1.5);
  leaf.setAttribute('transform', `rotate(${side * 35} ${leafX} ${leafY})`);
  leaf.style.opacity = 0;
  leaf.style.transform = `scale(0.4)`;
  leaf.style.transformOrigin = `${leafX}px ${leafY}px`;
  leaf.style.transition = `opacity 0.8s ease ${0.1 * index}s, transform 0.8s ease ${0.1 * index}s`;
  return leaf;
}

function createPetal(layout, angle, orderIndex, isInner, centerR) {
  // Pétalo lanceolado (más ancho cerca de la base, terminado en punta),
  // parecido a un pétalo real de girasol, en vez de una forma de
  // almendra/lente genérica.
  const lengthVariance = 0.92 + Math.random() * 0.18;
  const baseLength = isInner ? 46 : 68;
  const baseWidth = isInner ? 12 : 16;
  const petalLength = baseLength * layout.scale * lengthVariance;
  const petalWidth = baseWidth * layout.scale * (0.92 + Math.random() * 0.16);
  const r = isInner ? centerR * 0.72 : centerR * 0.92; // punto de anclaje

  const gradients = ['url(#petalGradA)', 'url(#petalGradB)', 'url(#petalGradC)'];
  const fill = isInner ? gradients[2] : gradients[Math.floor(Math.random() * gradients.length)];

  // Un grupo envolvente fija la posición y rotación (atributo SVG,
  // NO se anima: es barato y no participa en el "reflow"). Dentro,
  // el <path> del pétalo solo anima opacity + scale por CSS.
  const wrapper = document.createElementNS(SVG_NS, 'g');
  wrapper.setAttribute('transform', `translate(${layout.cx} ${layout.cy}) rotate(${angle})`);

  const petal = document.createElementNS(SVG_NS, 'path');
  petal.classList.add('petal');

  const d = `
    M 0 ${-r}
    Q ${petalWidth} ${-r - petalLength * 0.18} ${petalWidth * 0.38} ${-r - petalLength * 0.58}
    Q ${petalWidth * 0.14} ${-r - petalLength * 0.86} 0 ${-r - petalLength}
    Q ${-petalWidth * 0.14} ${-r - petalLength * 0.86} ${-petalWidth * 0.38} ${-r - petalLength * 0.58}
    Q ${-petalWidth} ${-r - petalLength * 0.18} 0 ${-r}
    Z
  `;
  petal.setAttribute('d', d);
  petal.setAttribute('fill', fill);
  petal.setAttribute('fill-opacity', isInner ? '0.92' : '1');
  petal.setAttribute('stroke', 'var(--outline-color)');
  petal.setAttribute('stroke-width', 1.1);

  // El escalonado de apertura lo resuelve el navegador vía
  // animation-delay (una sola escritura de estilo por pétalo, hecha
  // aquí en la construcción, no repetida en cada frame de la apertura).
  petal.style.animationDelay = `${orderIndex * 32}ms`;

  petal.dataset.angle = angle;

  wrapper.appendChild(petal);
  return wrapper;
}

/* ---------------------------------------------------------
   SECUENCIA: apertura de las flores
   --------------------------------------------------------- */
function scheduleFlowerOpening() {
  const groups = document.querySelectorAll('.flower-group');

  groups.forEach((group) => {
    const layout = group._layout;
    const { stem, center, centerTexture, centerHighlight, leaves, petals } = group._parts;

    setTimeout(() => {
      // Escena 2: tallo, hojas, centro
      stem.style.opacity = 1;
      leaves.forEach((leaf) => {
        leaf.style.opacity = 1;
        leaf.style.transform = leaf.style.transform.replace('scale(0.4)', 'scale(1)');
      });
      center.style.opacity = 1;
      center.style.transform = 'scale(1)';
      centerTexture.style.opacity = 1;
      centerHighlight.style.opacity = 1;

      // Escena 3: los pétalos se abren solos, vía CSS (animation-delay
      // ya quedó fijado en cada uno al crearlos). Una sola escritura
      // de estilo por flor, en vez de un setTimeout por pétalo — esto
      // es lo que elimina el "lag" que se sentía al juntarse.
      setTimeout(() => {
        petals.forEach((petal) => petal.classList.add('will-open'));
      }, 450);

      // Escena 4: viento — activar después de que termine de abrirse
      const openDuration = 450 + petals.length * 32 + 750;
      setTimeout(() => startWindAnimation(group, layout), openDuration);

    }, layout.delay + 700);
  });
}

/* ---------------------------------------------------------
   ESCENA 4: viento sutil permanente
   ---------------------------------------------------------
   En vez de un requestAnimationFrame independiente por flor y otro
   por cada pétalo (decenas de bucles compitiendo por el hilo
   principal), todo el balanceo se calcula en UN solo bucle global
   (ver windLoop más abajo). Aquí solo registramos los objetivos.
   --------------------------------------------------------- */
const swayTargets = [];
const wiggleTargets = [];
let windLoopStarted = false;

function startWindAnimation(group, layout) {
  swayTargets.push({
    group,
    layout,
    t: Math.random() * 100,
    speed: 0.006 + Math.random() * 0.004
  });

  // Solo una fracción de los pétalos altera su rotación (sutil aleteo);
  // el resto se queda quieto para ahorrar recursos en móviles.
  const petals = group._parts.petals;
  petals.forEach((petal, i) => {
    if (i % 3 !== 0) return;
    const wrapper = petal.parentNode; // <g> con translate+rotate fijos
    const baseAngle = parseFloat(petal.dataset.angle);
    const cx = layout.cx;
    const cy = layout.cy;
    wiggleTargets.push({
      wrapper, cx, cy, baseAngle,
      t: Math.random() * 100,
      speed: 0.01 + Math.random() * 0.01,
      amplitude: 1.4 + Math.random() * 1.4
    });
  });

  if (!windLoopStarted) {
    windLoopStarted = true;
    requestAnimationFrame(windLoop);
  }
}

function windLoop() {
  for (let i = 0; i < swayTargets.length; i++) {
    const s = swayTargets[i];
    s.t += s.speed;
    const angle = Math.sin(s.t) * s.layout.sway;
    s.group.style.transform = `rotate(${angle}deg)`;
    s.group.style.transformOrigin = `${s.layout.baseX}px ${s.layout.baseY}px`;
  }

  for (let i = 0; i < wiggleTargets.length; i++) {
    const w = wiggleTargets[i];
    w.t += w.speed;
    const extra = Math.sin(w.t) * w.amplitude;
    w.wrapper.setAttribute('transform', `translate(${w.cx} ${w.cy}) rotate(${w.baseAngle + extra})`);
  }

  requestAnimationFrame(windLoop);
}

/* ---------------------------------------------------------
   MENSAJE ROMÁNTICO
   --------------------------------------------------------- */
function scheduleMessages() {
  setTimeout(() => showMessage('line1'), CONFIG.messageDelay1);
  setTimeout(() => showMessage('line2'), CONFIG.messageDelay2);
}

function showMessage(id) {
  document.getElementById(id).classList.add('show');
}

/* ---------------------------------------------------------
   INTERACCIÓN: toques generan corazones / destellos
   --------------------------------------------------------- */
function setupTapEffects() {
  const stage = document.getElementById('stage');

  const handler = (e) => {
    const point = e.touches ? e.touches[0] : e;
    createHeart(point.clientX, point.clientY);
    createSparkleBurst(point.clientX, point.clientY);
  };

  stage.addEventListener('pointerdown', handler);
  stage.addEventListener('touchstart', handler, { passive: true });
}

function createHeart(x, y) {
  const heart = document.createElement('div');
  heart.className = 'tap-heart';
  heart.textContent = Math.random() < 0.5 ? '❤️' : '💛';
  heart.style.left = x + 'px';
  heart.style.top = y + 'px';
  document.getElementById('stage').appendChild(heart);
  setTimeout(() => heart.remove(), 1300);
}

function createSparkleBurst(x, y) {
  for (let i = 0; i < 6; i++) {
    particles.push({
      x, y,
      r: 0.8 + Math.random() * 1.5,
      speedY: -(0.3 + Math.random() * 0.6),
      speedX: (Math.random() - 0.5) * 1.2,
      opacity: 0.8,
      fadeDir: -1,
      twinkle: Math.random() * Math.PI * 2,
      burst: true
    });
  }
  // Limitar el total de partículas para no acumular memoria
  if (particles.length > CONFIG.particleCount + 60) {
    particles.splice(CONFIG.particleCount, particles.length - CONFIG.particleCount - 60);
  }
}

/* ---------------------------------------------------------
   BOTÓN REPETIR
   --------------------------------------------------------- */
function setupReplayButton() {
  const btn = document.getElementById('replay-btn');
  setTimeout(() => btn.classList.add('visible'), CONFIG.replayButtonDelay);

  btn.addEventListener('click', () => {
    document.querySelectorAll('.message-line').forEach((el) => el.classList.remove('show'));
    btn.classList.remove('visible');
    buildFlowers();
    scheduleFlowerOpening();
    scheduleMessages();
    setupReplayButton();
  });
}

/* ---------------------------------------------------------
   ARRANQUE
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', initExperience);
