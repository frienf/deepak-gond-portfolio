/**
 * The Pipeline Lattice
 * ====================
 * A data pipeline rendered as five node clusters along one axis:
 *
 *   RAW DATA -> TRANSFORM -> ANALYZE -> VISUALIZE -> INSIGHT
 *
 * Reading left to right, node count falls and node size rises: many raw
 * records are refined into one decision. Packets travel precomputed paths
 * across all five stages, so what you see moving is throughput, not decoration.
 *
 * The scene is purely decorative - the hero legend states the same five
 * stages in text, and the section works with WebGL unavailable.
 */

import * as THREE from 'three';

/* ---- Composition ------------------------------------------------------- */

const STAGES = [
  { x: -15.0, count: 58, radius: 7.4, size: 0.30, mix: 0.00 },
  { x: -7.5, count: 34, radius: 5.8, size: 0.42, mix: 0.25 },
  { x: 0.0, count: 20, radius: 4.3, size: 0.58, mix: 0.50 },
  { x: 7.5, count: 10, radius: 2.7, size: 0.85, mix: 0.75 },
  { x: 15.0, count: 1, radius: 0.0, size: 1.80, mix: 1.00 },
];

const COLOR_RAW = new THREE.Color('#4fd8e4');     /* signal teal  */
const COLOR_INSIGHT = new THREE.Color('#ffc46b'); /* insight amber */

/** Soft round sprite, generated once - no texture file to download. */
function createDotTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.75)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Deterministic scatter inside a disc facing the pipeline axis. */
function stageNodes(stage, rand) {
  const nodes = [];
  for (let i = 0; i < stage.count; i++) {
    if (stage.radius === 0) {
      nodes.push(new THREE.Vector3(stage.x, 0, 0));
      continue;
    }
    const angle = rand() * Math.PI * 2;
    // sqrt keeps the scatter even instead of clumping at the centre
    const r = Math.sqrt(rand()) * stage.radius;
    nodes.push(new THREE.Vector3(
      stage.x + (rand() - 0.5) * 2.2,
      Math.sin(angle) * r,
      Math.cos(angle) * r * 0.75,
    ));
  }
  return nodes;
}

/** Small seeded PRNG so the layout is identical on every load. */
function mulberry32(seed) {
  return function next() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Build the lattice: nodes per stage, one edge set between adjacent stages,
 * and a pool of end-to-end paths for the packets to ride.
 */
function buildLattice(quality, rand) {
  const stages = STAGES.map((stage) => stageNodes({
    ...stage,
    count: Math.max(1, Math.round(stage.count * quality.density)),
  }, rand));

  // Edges: every node links forward to the nearest few nodes of the next stage.
  const edges = [];
  for (let s = 0; s < stages.length - 1; s++) {
    const next = stages[s + 1];
    stages[s].forEach((from, i) => {
      const links = next.length === 1 ? 1 : 1 + (i % 2);
      for (let l = 0; l < links; l++) {
        const to = next[Math.floor(rand() * next.length)];
        edges.push([from, to, s]);
      }
    });
  }

  // Paths: start at a raw node, hop forward one stage at a time.
  const paths = [];
  for (let p = 0; p < quality.packets; p++) {
    const path = [];
    for (let s = 0; s < stages.length; s++) {
      path.push(stages[s][Math.floor(rand() * stages[s].length)]);
    }
    paths.push(path);
  }

  return { stages, edges, paths };
}

function stageColor(mix) {
  return COLOR_RAW.clone().lerp(COLOR_INSIGHT, mix);
}

/**
 * Create the scene.
 * @param {HTMLCanvasElement} canvas
 * @param {{reducedMotion: boolean}} options
 * @returns {{camera: THREE.PerspectiveCamera, root: THREE.Group, dispose: () => void} | null}
 *          null when WebGL is unavailable, so the CSS fallback stays visible.
 */
export function createPipelineScene(canvas, options = {}) {
  const reducedMotion = Boolean(options.reducedMotion);
  const isSmall = window.matchMedia('(max-width: 48rem)').matches;
  const isWeak = (navigator.hardwareConcurrency || 8) <= 4;

  // Budget: fewer nodes, fewer packets and no antialiasing on small/weak devices.
  const quality = isSmall || isWeak
    ? { density: 0.45, packets: 70, dpr: 1.5, antialias: false }
    : { density: 1, packets: 210, dpr: 2, antialias: true };

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: quality.antialias, alpha: true, powerPreference: 'high-performance' });
  } catch (error) {
    console.warn('[pipeline] WebGL unavailable, keeping the static fallback.', error);
    return null;
  }
  if (!renderer.getContext()) return null;

  const baseDpr = Math.min(window.devicePixelRatio, quality.dpr);
  renderer.setPixelRatio(baseDpr);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 140);
  camera.position.set(-1.5, 1.2, 30);

  const root = new THREE.Group();
  // Slight yaw/pitch so the pipeline reads as depth rather than a flat row
  root.rotation.set(0.06, -0.34, 0);
  scene.add(root);

  const rand = mulberry32(20260411);
  const { stages, edges, paths } = buildLattice(quality, rand);
  const dotTexture = createDotTexture();
  const disposables = [dotTexture];

  /* ---- Nodes: one Points object per stage (size differs per stage) ---- */
  stages.forEach((nodes, s) => {
    const stage = STAGES[s];
    if (s === stages.length - 1) return; // insight node is drawn as a mesh

    const positions = new Float32Array(nodes.length * 3);
    nodes.forEach((n, i) => n.toArray(positions, i * 3));

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: stage.size,
      map: dotTexture,
      color: stageColor(stage.mix),
      transparent: true,
      opacity: 0.55 + stage.mix * 0.4,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    root.add(new THREE.Points(geometry, material));
    disposables.push(geometry, material);
  });

  /* ---- Edges: static lines, coloured by how far down the pipeline they sit ---- */
  {
    const positions = new Float32Array(edges.length * 6);
    const colors = new Float32Array(edges.length * 6);
    edges.forEach(([from, to, s], i) => {
      from.toArray(positions, i * 6);
      to.toArray(positions, i * 6 + 3);
      const a = stageColor(STAGES[s].mix);
      const b = stageColor(STAGES[s + 1].mix);
      colors.set([a.r, a.g, a.b, b.r, b.g, b.b], i * 6);
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    root.add(new THREE.LineSegments(geometry, material));
    disposables.push(geometry, material);
  }

  /* ---- Insight node: the single bright result at the end ---- */
  {
    const geometry = new THREE.SphereGeometry(0.42, 24, 16);
    const material = new THREE.MeshBasicMaterial({ color: COLOR_INSIGHT });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(STAGES[4].x, 0, 0);
    root.add(mesh);

    const glowMaterial = new THREE.SpriteMaterial({
      map: dotTexture,
      color: COLOR_INSIGHT,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glow = new THREE.Sprite(glowMaterial);
    glow.scale.setScalar(6);
    glow.position.copy(mesh.position);
    root.add(glow);

    disposables.push(geometry, material, glowMaterial);
  }

  /* ---- Packets: the data actually moving through the pipeline ---- */
  const packetCount = paths.length;
  const packetPositions = new Float32Array(packetCount * 3);
  const packetProgress = new Float32Array(packetCount);
  const packetSpeed = new Float32Array(packetCount);
  const SEGMENTS = STAGES.length - 1;

  for (let i = 0; i < packetCount; i++) {
    packetProgress[i] = rand() * SEGMENTS;
    packetSpeed[i] = 0.32 + rand() * 0.42;
  }

  const packetGeometry = new THREE.BufferGeometry();
  packetGeometry.setAttribute('position', new THREE.BufferAttribute(packetPositions, 3));
  const packetMaterial = new THREE.PointsMaterial({
    size: 0.4,
    map: dotTexture,
    color: new THREE.Color('#e8fbff'),
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  root.add(new THREE.Points(packetGeometry, packetMaterial));
  disposables.push(packetGeometry, packetMaterial);

  /** Place every packet at its current point along its path. */
  function updatePackets(delta) {
    for (let i = 0; i < packetCount; i++) {
      packetProgress[i] += delta * packetSpeed[i];
      if (packetProgress[i] >= SEGMENTS) packetProgress[i] -= SEGMENTS;

      const t = packetProgress[i];
      const segment = Math.min(Math.floor(t), SEGMENTS - 1);
      const local = t - segment;
      const path = paths[i];
      const from = path[segment];
      const to = path[segment + 1];

      const o = i * 3;
      packetPositions[o] = from.x + (to.x - from.x) * local;
      packetPositions[o + 1] = from.y + (to.y - from.y) * local;
      packetPositions[o + 2] = from.z + (to.z - from.z) * local;
    }
    packetGeometry.attributes.position.needsUpdate = true;
  }

  /* ---- Sizing ---- */
  function resize() {
    const { clientWidth, clientHeight } = canvas;
    if (!clientWidth || !clientHeight) return;
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / clientHeight;
    // Pull the camera back on narrow screens so the whole pipeline still fits
    camera.position.z = clientWidth < 700 ? 42 : 30;
    camera.updateProjectionMatrix();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();

  /* ---- Cursor influence: a few degrees of parallax, eased, never jumpy ----
     The follow is first-order exponential smoothing - critically damped, so it
     settles without overshoot like the rest of the motion here. The rate is
     per second, not per frame: a fixed per-frame factor would make the camera
     chase five times faster on a 144Hz laptop than on a throttled 30fps one. */
  const POINTER_RATE = 2.763;   // 1/s -> ~0.36s to close 63% of the gap
  const pointer = { x: 0, y: 0 };
  const eased = { x: 0, y: 0 };
  const basePitch = root.rotation.x;
  const baseYaw = root.rotation.y;

  function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
  }
  if (!reducedMotion && window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
  }

  /* ---- Adaptive resolution ----
     The budget above is picked once, from core count and screen size. That
     cannot see a laptop that thermally throttles, a busy machine, or an
     integrated GPU that reports eight cores. So watch real frame times and
     step the pixel ratio down if they stay bad.

     Deliberately one-way: it never steps back up, so it cannot oscillate
     between two resolutions on a device sitting right at the threshold. */
  const SLOW_FRAME = 0.022;        // worse than ~45fps
  const SLOW_STREAK = 90;          // ~1.5s of sustained slowness
  const MIN_TIER = 2;              // at most two downgrades
  let dprTier = 0;
  let slowFrames = 0;

  function adaptResolution(delta) {
    if (dprTier >= MIN_TIER) return;

    slowFrames = delta > SLOW_FRAME ? slowFrames + 1 : Math.max(0, slowFrames - 1);
    if (slowFrames < SLOW_STREAK) return;

    slowFrames = 0;
    dprTier += 1;
    renderer.setPixelRatio(Math.max(1, baseDpr * Math.pow(0.75, dprTier)));
  }

  /* ---- Render loop: only runs while visible ---- */
  const clock = new THREE.Clock();
  let frame = 0;
  let onScreen = true;

  function render() {
    renderer.render(scene, camera);
  }

  function tick() {
    frame = requestAnimationFrame(tick);
    // Clamp delta so a backgrounded tab does not fast-forward the flow
    const delta = Math.min(clock.getDelta(), 0.05);

    const follow = 1 - Math.exp(-POINTER_RATE * delta);
    eased.x += (pointer.x - eased.x) * follow;
    eased.y += (pointer.y - eased.y) * follow;
    root.rotation.y = baseYaw + eased.x * 0.12;
    root.rotation.x = basePitch - eased.y * 0.08;

    updatePackets(delta);
    render();
    adaptResolution(delta);
  }

  function start() {
    if (frame || reducedMotion) return;
    clock.getDelta();
    frame = requestAnimationFrame(tick);
  }

  function stop() {
    if (!frame) return;
    cancelAnimationFrame(frame);
    frame = 0;
  }

  // Stop rendering once the hero has scrolled away, and whenever the tab hides.
  const visibility = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (onScreen && !document.hidden) start();
    else stop();
  }, { threshold: 0 });
  visibility.observe(canvas);

  function onVisibilityChange() {
    if (document.hidden) stop();
    else if (onScreen) start();
  }
  document.addEventListener('visibilitychange', onVisibilityChange);

  if (reducedMotion) {
    // One static frame: the composition stays, the motion does not.
    updatePackets(0);
    render();
  } else {
    start();
  }

  function dispose() {
    stop();
    visibility.disconnect();
    resizeObserver.disconnect();
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('pointermove', onPointerMove);
    disposables.forEach((item) => item.dispose());
    renderer.dispose();
    // Release the WebGL context outright. Without this a remount - React's
    // StrictMode does one in development - cannot get a fresh context from
    // the same canvas element.
    renderer.forceContextLoss();
  }

  return { camera, root, render, dispose };
}
