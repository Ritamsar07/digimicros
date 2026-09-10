/**
 * DigiMicros — Hero Sculpture
 * Renders an animated 3D ribbon torus-knot sculpture using Three.js.
 * Layered white ribbon strands with glowing cyan edges, soft studio lighting.
 */
(function () {
  'use strict';

  const canvas = document.getElementById('sculptureCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // ── Scene ──────────────────────────────────────────────────────────────────
  const scene = new THREE.Scene();
  scene.background = null; // transparent — hero background shows through

  // ── Camera ─────────────────────────────────────────────────────────────────
  const getSize = () => {
    const p = canvas.parentElement;
    return { w: p.offsetWidth || 560, h: p.offsetHeight || 560 };
  };
  const { w, h } = getSize();
  const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
  camera.position.z = 7.5;

  // ── Renderer ───────────────────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;
  renderer.shadowMap.enabled = false;

  // ── Lighting ───────────────────────────────────────────────────────────────
  // Warm top-left key light
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
  keyLight.position.set(6, 8, 6);
  scene.add(keyLight);

  // Cool fill from below-right
  const fillLight = new THREE.DirectionalLight(0xddeeff, 0.8);
  fillLight.position.set(-5, -4, 4);
  scene.add(fillLight);

  // Ambient for overall brightness
  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambient);

  // Cyan point light — gives the glowing-edge look
  const cyanLight = new THREE.PointLight(0x00d4c7, 4.5, 18);
  cyanLight.position.set(-4, -3, 5);
  scene.add(cyanLight);

  // Secondary warm accent
  const warmLight = new THREE.PointLight(0xb0d4ff, 1.5, 14);
  warmLight.position.set(5, 3, -3);
  scene.add(warmLight);

  // ── Sculpture group ────────────────────────────────────────────────────────
  const group = new THREE.Group();
  scene.add(group);

  // Knot parameters: p=3, q=4 → complex interwoven shape
  const P = 3, Q = 4;
  const TUBE_SEGS = 360;
  const RADIAL_SEGS = 3; // triangular cross-section = ribbon-like

  // ── Layered white ribbons ──────────────────────────────────────────────────
  const LAYERS = 16;
  for (let i = 0; i < LAYERS; i++) {
    const t = i / (LAYERS - 1); // 0 → 1
    const knobRadius = 1.52 + (i - LAYERS / 2) * 0.048;
    const tubeRadius = 0.026 + Math.abs(t - 0.5) * 0.01;

    const geo = new THREE.TorusKnotGeometry(knobRadius, tubeRadius, TUBE_SEGS, RADIAL_SEGS, P, Q);

    // Slightly graduated brightness — darker strands near the edges
    const b = 0.84 + (1 - Math.abs(t - 0.5) * 2) * 0.14;
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(b, b + 0.015, b + 0.025),
      roughness: 0.22,
      metalness: 0.08,
      clearcoat: 0.7,
      clearcoatRoughness: 0.06,
      envMapIntensity: 0.5,
    });

    group.add(new THREE.Mesh(geo, mat));
  }

  // ── Cyan glow edge strands ─────────────────────────────────────────────────
  const GLOW_STRANDS = 4;
  for (let e = 0; e < GLOW_STRANDS; e++) {
    // Place glowing strands at both edges of the ribbon stack
    const side = e < 2 ? -1 : 1;
    const idx = e % 2;
    const knobRadius = 1.52 + side * (LAYERS / 2 - idx) * 0.048;
    const geo = new THREE.TorusKnotGeometry(knobRadius, 0.014, TUBE_SEGS, 3, P, Q);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x00d4c7,
      transparent: true,
      opacity: 0.30 - idx * 0.08,
    });
    group.add(new THREE.Mesh(geo, mat));
  }

  // ── Subtle inner glow haze (additive blending sphere) ─────────────────────
  const hazeGeo = new THREE.SphereGeometry(1.2, 32, 32);
  const hazeMat = new THREE.MeshBasicMaterial({
    color: 0x00d4c7,
    transparent: true,
    opacity: 0.04,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  group.add(new THREE.Mesh(hazeGeo, hazeMat));

  // ── Animation ──────────────────────────────────────────────────────────────
  const clock = new THREE.Clock();
  let rafId;

  function animate() {
    rafId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Slow compound rotation
    group.rotation.x = t * 0.16;
    group.rotation.y = t * 0.26;

    // Subtle breathing pulse
    const pulse = 1 + Math.sin(t * 0.55) * 0.018;
    group.scale.setScalar(pulse);

    // Oscillate cyan light position for dynamic reflection
    cyanLight.position.x = -4 + Math.sin(t * 0.4) * 1.5;
    cyanLight.position.y = -3 + Math.cos(t * 0.3) * 1.0;

    renderer.render(scene, camera);
  }

  animate();

  // ── Responsive resize ──────────────────────────────────────────────────────
  const ro = new ResizeObserver(() => {
    const { w: nw, h: nh } = getSize();
    camera.aspect = nw / Math.max(nh, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh || nw);
  });
  ro.observe(canvas.parentElement);

  // ── Mouse parallax tilt ────────────────────────────────────────────────────
  document.addEventListener('mousemove', (e) => {
    const mx = (e.clientX / window.innerWidth - 0.5) * 2;
    const my = (e.clientY / window.innerHeight - 0.5) * 2;
    group.rotation.z = mx * 0.12;
    group.rotation.x += my * 0.001;
  }, { passive: true });
})();
