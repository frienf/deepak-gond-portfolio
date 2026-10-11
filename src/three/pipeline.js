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
 *
 * Every point in the scene - all four node stages, every packet and every
 * trail sample - is drawn by one ShaderMaterial over two geometries. Size,
 * colour and opacity are per-vertex attributes, which is what lets the
 * stages share a draw call instead of needing one material each.
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

/* Two palettes, because the scene cannot simply be recoloured for light.
   Additive blending adds light to what is behind it, so on a bright ground
   it washes out to nothing. Light mode switches to normal blending with
   darker, denser colour and carries more opacity to compensate. */
const PALETTES = {
  dark: {
    raw: '#4fd8e4',
    insight: '#ffa160',
    packet: '#e8fbff',
    blending: THREE.AdditiveBlending,
    edgeOpacity: 0.16,
    glowOpacity: 0.55,
    nodeBase: 0.55,
    nodeGain: 0.40,
  },
  light: {
    raw: '#005d5f',
    insight: '#913600',
    packet: '#0f3c46',
    blending: THREE.NormalBlending,
    edgeOpacity: 0.34,
    glowOpacity: 0.12,
    nodeBase: 0.52,
    nodeGain: 0.34,
  },
};

/* ---- Point shader -------------------------------------------------------
   Replaces PointsMaterial for two reasons: per-vertex size (so all stages
   share one draw call) and a depth fade that PointsMaterial cannot express.
   The disc is procedural, so there is no texture to sample either. */

const POINT_VERTEX = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aAlpha;

  uniform float uScale;     // drawing-buffer height / 2, in device pixels
  uniform float uMaxSize;   // clamp so a near point cannot cost a huge quad
  uniform float uFadeNear;
  uniform float uFadeFar;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;

    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float dist = max(-mv.z, 0.001);

    // Depth fade: the far end of the lattice recedes instead of every node
    // reading at one flat level. This is the main thing the built-in
    // material could not do. Floored at half rather than reaching zero, so
    // the raw-data cluster stays legible instead of dissolving.
    // (smoothstep is undefined when edge0 > edge1, hence the inverted form.)
    float fade = 1.0 - smoothstep(uFadeNear, uFadeFar, dist);
    vAlpha = aAlpha * mix(0.5, 1.0, fade);

    gl_PointSize = min(aSize * uScale / dist, uMaxSize);
    gl_Position = projectionMatrix * mv;
  }
`;

const POINT_FRAGMENT = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Soft disc, matching the falloff of the sprite this replaces
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;

    float alpha = pow(smoothstep(0.5, 0.0, d), 1.7) * vAlpha;
    if (alpha < 0.01) discard;

    gl_FragColor = vec4(vColor, alpha);
    #include <colorspace_fragment>
  }
`;

/** Soft round sprite, generated once - still used by the insight glow. */
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

function stageColor(mix, palette) {
  return palette.rawColor.clone().lerp(palette.insightColor, mix);
}

/**
 * Create the scene.
 * @param {HTMLCanvasElement} canvas
 * @param {{reducedMotion: boolean}} options
 * @returns {{camera: THREE.PerspectiveCamera, root: THREE.Group, render: () => void, dispose: () => void} | null}
 *          null when WebGL is unavailable, so the CSS fallback stays visible.
 */
export function createPipelineScene(canvas, options = {}) {
  const reducedMotion = Boolean(options.reducedMotion);
  /* A local copy, not the shared preset. PALETTES is module-level, and
     both StrictMode's double mount and a theme toggle would otherwise be
     writing their colour objects onto the same object. */
  const preset = PALETTES[options.theme === 'light' ? 'light' : 'dark'];
  const palette = {
    ...preset,
    rawColor: new THREE.Color(preset.raw),
    insightColor: new THREE.Color(preset.insight),
  };
  const isSmall = window.matchMedia('(max-width: 48rem)').matches;
  const isWeak = (navigator.hardwareConcurrency || 8) <= 4;

  // Budget: fewer nodes, fewer packets, shorter trails and no antialiasing
  // on small/weak devices.
  const quality = isSmall || isWeak
    ? { density: 0.45, packets: 70, dpr: 1.5, antialias: false, trail: 1 }
    : { density: 1, packets: 210, dpr: 2, antialias: true, trail: 3 };

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

  /* ---- One material for every point in the scene ---- */
  const pointMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uScale: { value: 1 },
      uMaxSize: { value: 140 },
      uFadeNear: { value: 26 },
      uFadeFar: { value: 72 },
    },
    vertexShader: POINT_VERTEX,
    fragmentShader: POINT_FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: palette.blending,
  });
  disposables.push(pointMaterial);

  /* gl_PointSize is in device pixels, so the scale factor has to track the
     drawing buffer - including when adaptive resolution lowers the DPR. */
  const bufferSize = new THREE.Vector2();
  function syncPointScale() {
    renderer.getDrawingBufferSize(bufferSize);
    pointMaterial.uniforms.uScale.value = bufferSize.y * 0.5;
  }

  /** Pack positions/size/colour/alpha for a set of points into one geometry. */
  function createPointGeometry(total) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(total * 3), 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(total), 1));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array(total * 3), 3));
    geometry.setAttribute('aAlpha', new THREE.BufferAttribute(new Float32Array(total), 1));
    return geometry;
  }

  /* ---- Nodes: all four stages in a single draw call ----
     Previously one Points object per stage, purely because PointsMaterial
     carries size as a material uniform. Per-vertex size removes that. */
  {
    const drawn = stages.slice(0, -1);              // insight node is a mesh
    const total = drawn.reduce((sum, nodes) => sum + nodes.length, 0);
    const geometry = createPointGeometry(total);
    const position = geometry.attributes.position.array;
    const size = geometry.attributes.aSize.array;
    const color = geometry.attributes.aColor.array;
    const alpha = geometry.attributes.aAlpha.array;

    let i = 0;
    drawn.forEach((nodes, s) => {
      const stage = STAGES[s];
      const tint = stageColor(stage.mix, palette);
      nodes.forEach((node) => {
        node.toArray(position, i * 3);
        size[i] = stage.size;
        color[i * 3] = tint.r;
        color[i * 3 + 1] = tint.g;
        color[i * 3 + 2] = tint.b;
        alpha[i] = palette.nodeBase + stage.mix * palette.nodeGain;
        i += 1;
      });
    });

    root.add(new THREE.Points(geometry, pointMaterial));
    disposables.push(geometry);
  }

  /* ---- Edges: static lines, coloured by how far down the pipeline they sit ---- */
  {
    const positions = new Float32Array(edges.length * 6);
    const colors = new Float32Array(edges.length * 6);
    edges.forEach(([from, to, s], i) => {
      from.toArray(positions, i * 6);
      to.toArray(positions, i * 6 + 3);
      const a = stageColor(STAGES[s].mix, palette);
      const b = stageColor(STAGES[s + 1].mix, palette);
      colors.set([a.r, a.g, a.b, b.r, b.g, b.b], i * 6);
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: palette.edgeOpacity,
      depthWrite: false,
      blending: palette.blending,
    });

    root.add(new THREE.LineSegments(geometry, material));
    disposables.push(geometry, material);
  }

  /* ---- Insight node: the single bright result at the end ---- */
  const GLOW_SCALE = 6;
  let insightMesh;
  let insightGlow;
  {
    const geometry = new THREE.SphereGeometry(0.42, 24, 16);
    const material = new THREE.MeshBasicMaterial({ color: palette.insightColor });
    insightMesh = new THREE.Mesh(geometry, material);
    insightMesh.position.set(STAGES[4].x, 0, 0);
    root.add(insightMesh);

    const glowMaterial = new THREE.SpriteMaterial({
      map: dotTexture,
      color: palette.insightColor,
      transparent: true,
      opacity: palette.glowOpacity,
      blending: palette.blending,
      depthWrite: false,
    });
    insightGlow = new THREE.Sprite(glowMaterial);
    insightGlow.scale.setScalar(GLOW_SCALE);
    insightGlow.position.copy(insightMesh.position);
    root.add(insightGlow);

    disposables.push(geometry, material, glowMaterial);
  }

  /* ---- Packets: the data actually moving through the pipeline ----
     Each packet draws a head plus a few trail samples. A packet's position
     is a pure function of its progress, so the trail is just the same path
     evaluated slightly earlier - no history buffer to keep, and it all
     stays in the one geometry and the one draw call. */
  const TRAIL = quality.trail;
  const PER_PACKET = TRAIL + 1;
  const TRAIL_STEP = 0.028;            // in path segments, ~0.2 world units
  const packetCount = paths.length;
  const packetProgress = new Float32Array(packetCount);
  const packetSpeed = new Float32Array(packetCount);
  const SEGMENTS = STAGES.length - 1;

  for (let i = 0; i < packetCount; i++) {
    packetProgress[i] = rand() * SEGMENTS;
    packetSpeed[i] = 0.32 + rand() * 0.42;
  }

  const packetGeometry = createPointGeometry(packetCount * PER_PACKET);
  const packetPositions = packetGeometry.attributes.position.array;
  {
    const size = packetGeometry.attributes.aSize.array;
    const color = packetGeometry.attributes.aColor.array;
    const alpha = packetGeometry.attributes.aAlpha.array;
    const tint = new THREE.Color();
    const packetColor = new THREE.Color(palette.packet);

    for (let i = 0; i < packetCount; i++) {
      for (let k = 0; k <= TRAIL; k++) {
        const v = i * PER_PACKET + k;
        const decay = 1 - k / (TRAIL + 1);
        // The head is near-white; the tail cools back toward signal teal
        tint.copy(packetColor).lerp(palette.rawColor, k / (TRAIL + 1));
        size[v] = 0.4 * (0.45 + decay * 0.55);
        alpha[v] = 0.9 * decay * decay;
        color[v * 3] = tint.r;
        color[v * 3 + 1] = tint.g;
        color[v * 3 + 2] = tint.b;
      }
    }
  }

  /* Positions change every frame, so the bounding sphere Three would derive
     once from the initial buffer goes stale and the whole cloud can be
     culled as the scroll scrub moves the camera. Pin one that covers the
     lattice instead of disabling culling outright. */
  packetGeometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 26);
  packetGeometry.computeBoundingSphere = () => {};

  root.add(new THREE.Points(packetGeometry, pointMaterial));
  disposables.push(packetGeometry);

  /** Place every packet, and its trail, at its current point along its path. */
  function updatePackets(delta) {
    for (let i = 0; i < packetCount; i++) {
      packetProgress[i] += delta * packetSpeed[i];
      if (packetProgress[i] >= SEGMENTS) packetProgress[i] -= SEGMENTS;

      const head = packetProgress[i];
      const path = paths[i];

      for (let k = 0; k <= TRAIL; k++) {
        // Clamped rather than wrapped: a wrapped trail would streak from the
        // insight node back to the raw cluster on every loop.
        const t = Math.max(0, head - k * TRAIL_STEP);
        const segment = Math.min(Math.floor(t), SEGMENTS - 1);
        const local = t - segment;
        const from = path[segment];
        const to = path[segment + 1];

        const o = (i * PER_PACKET + k) * 3;
        packetPositions[o] = from.x + (to.x - from.x) * local;
        packetPositions[o + 1] = from.y + (to.y - from.y) * local;
        packetPositions[o + 2] = from.z + (to.z - from.z) * local;
      }
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
    syncPointScale();
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
    // The drawing buffer just changed, so point sizes have to be rescaled
    syncPointScale();
  }

  /* ---- Render loop: only runs while visible ---- */
  const clock = new THREE.Clock();
  let frame = 0;
  let onScreen = true;
  let elapsed = 0;

  function render() {
    renderer.render(scene, camera);
  }

  /** The one result at the end of the pipeline breathes, very slightly. */
  function pulseInsight() {
    const breath = Math.sin(elapsed * 1.5) * 0.05;
    insightMesh.scale.setScalar(1 + breath);
    insightGlow.scale.setScalar(GLOW_SCALE * (1 + breath * 1.6));
  }

  function tick() {
    frame = requestAnimationFrame(tick);
    // Clamp delta so a backgrounded tab does not fast-forward the flow
    const delta = Math.min(clock.getDelta(), 0.05);
    elapsed += delta;

    const follow = 1 - Math.exp(-POINTER_RATE * delta);
    eased.x += (pointer.x - eased.x) * follow;
    eased.y += (pointer.y - eased.y) * follow;
    root.rotation.y = baseYaw + eased.x * 0.12;
    root.rotation.x = basePitch - eased.y * 0.08;

    updatePackets(delta);
    pulseInsight();
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
