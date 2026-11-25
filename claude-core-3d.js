// <claude-core-3d> — núcleo 3D del ecosistema. Carga three.js de forma diferida
// al entrar en viewport. Si no hay WebGL o el usuario pide menos movimiento,
// se queda el fallback estático que vive dentro del elemento.
(function () {
  if (customElements.get('claude-core-3d')) return;
  const SRC = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
  let modPromise = null;
  const loadThree = () => (modPromise = modPromise || import(SRC));

  const hasWebGL = () => {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
    } catch (e) { return false; }
  };

  class ClaudeCore3D extends HTMLElement {
    connectedCallback() {
      if (this._init) return;
      this._init = true;
      this.style.display = 'block';
      this.style.position = 'absolute';
      this.style.inset = '0';
      this.style.width = '100%';
      this.style.height = '100%';
      this._reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!hasWebGL()) return;
      this.querySelectorAll('[data-fallback]').forEach(el => { el.style.opacity = '0'; el.style.transition = 'opacity 400ms linear'; });
      this._io = new IntersectionObserver((es) => {
        if (!es.some(e => e.isIntersecting)) { this._visible = false; return; }
        this._visible = true;
        this._io.disconnect();
        const go = () => this.boot();
        window.requestIdleCallback ? requestIdleCallback(go, { timeout: 1200 }) : setTimeout(go, 200);
      }, { rootMargin: '120px' });
      this._io.observe(this);
    }

    disconnectedCallback() {
      this._io && this._io.disconnect();
      this._vio && this._vio.disconnect();
      this._ro && this._ro.disconnect();
      cancelAnimationFrame(this._raf);
      if (this._renderer) { this._renderer.dispose(); this._renderer.domElement.remove(); this._renderer = null; }
      if (this._geos) this._geos.forEach(g => g.dispose());
      if (this._mats) this._mats.forEach(m => m.dispose());
    }

    async boot() {
      let THREE;
      try { THREE = await loadThree(); } catch (e) { return; }
      if (!this.isConnected) return;

      const w = this.clientWidth || 480, h = this.clientHeight || 480;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setSize(w, h, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      const cv = renderer.domElement;
      Object.assign(cv.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' });
      this.appendChild(cv);
      this._renderer = renderer;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, w / h, 0.1, 100);
      camera.position.set(0, 0, 11);

      const geos = this._geos = [], mats = this._mats = [];

      // --- Sunburst: 11 radios cónicos con punta redondeada ---
      const burst = new THREE.Group();
      const N = 11, inner = 0.30, outer = 2.05, wIn = 0.085, wOut = 0.20;
      const pts = [];
      const tipX = outer - wOut, segs = 10;
      pts.push(new THREE.Vector2(inner, -wIn), new THREE.Vector2(tipX, -wOut));
      for (let s = 1; s < segs; s++) { const a = -Math.PI / 2 + (s / segs) * Math.PI; pts.push(new THREE.Vector2(tipX + Math.cos(a) * wOut, Math.sin(a) * wOut)); }
      pts.push(new THREE.Vector2(tipX, wOut), new THREE.Vector2(inner, wIn));
      for (let s = 1; s < 6; s++) { const a = Math.PI / 2 + (s / 6) * Math.PI; pts.push(new THREE.Vector2(inner + Math.cos(a) * wIn, Math.sin(a) * wIn)); }
      const shape = new THREE.Shape(pts);
      const spokeGeo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.26, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 2, curveSegments: 1
      });
      spokeGeo.translate(0, 0, -0.13);
      geos.push(spokeGeo);

      const amber = new THREE.MeshStandardMaterial({
        color: 0xD97757, metalness: 0.62, roughness: 0.26,
        emissive: 0xB33A14, emissiveIntensity: 0.32
      });
      const amberHot = amber.clone();
      amberHot.color = new THREE.Color(0xF08A52);
      amberHot.emissive = new THREE.Color(0xD9541E);
      amberHot.emissiveIntensity = 0.55;
      mats.push(amber, amberHot);

      const lens = [1, 0.82, 0.95, 0.74, 1, 0.86, 0.78, 1, 0.9, 0.8, 0.94];
      for (let i = 0; i < N; i++) {
        const m = new THREE.Mesh(spokeGeo, i % 3 === 0 ? amberHot : amber);
        m.rotation.z = (i / N) * Math.PI * 2 + 0.18;
        m.scale.x = lens[i];
        burst.add(m);
      }
      const hubGeo = new THREE.SphereGeometry(0.42, 32, 24);
      geos.push(hubGeo);
      burst.add(new THREE.Mesh(hubGeo, amberHot));
      burst.rotation.set(-0.18, 0.32, 0);
      scene.add(burst);
      this._burst = burst;

      // --- Campo de partículas ---
      const COUNT = 280, pos = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT; i++) {
        const r = 3.2 + Math.random() * 4.2, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
        pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
        pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
        pos[i * 3 + 2] = r * Math.cos(ph) * 0.5 - 1.5;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const pMat = new THREE.PointsMaterial({ size: 0.045, color: 0xE8A87C, transparent: true, opacity: 0.65, depthWrite: false, blending: THREE.AdditiveBlending });
      geos.push(pGeo); mats.push(pMat);
      const points = new THREE.Points(pGeo, pMat);
      scene.add(points);
      this._points = points;

      // --- Luz ---
      scene.add(new THREE.AmbientLight(0xffe4cc, 0.55));
      const key = new THREE.DirectionalLight(0xffd9b0, 2.4); key.position.set(4, 5, 6); scene.add(key);
      const rim = new THREE.DirectionalLight(0xff7a3c, 2.0); rim.position.set(-5, -2, -4); scene.add(rim);
      const violet = new THREE.PointLight(0x8A08AB, 9, 16); violet.position.set(-3.4, 2.6, 2.4); scene.add(violet);
      const warm = new THREE.PointLight(0xFF8A3D, 7, 14); warm.position.set(2.8, -2.2, 3); scene.add(warm);

      this._ro = new ResizeObserver(() => {
        const W = this.clientWidth || 1, H = this.clientHeight || 1;
        renderer.setSize(W, H, false);
        camera.aspect = W / H; camera.updateProjectionMatrix();
      });
      this._ro.observe(this);

      this._vio = new IntersectionObserver((es) => { this._visible = es[0].isIntersecting; }, { rootMargin: '120px' });
      this._vio.observe(this);
      this._visible = true;

      const start = performance.now();
      const tick = () => {
        this._raf = requestAnimationFrame(tick);
        if (!this._visible) return;
        const t = (performance.now() - start) / 1000;
        if (!this._reduce) {
          burst.rotation.z = t * 0.14;
          burst.rotation.x = -0.18 + Math.sin(t * 0.5) * 0.07;
          burst.rotation.y = 0.32 + Math.cos(t * 0.4) * 0.1;
          burst.position.y = Math.sin(t * 0.6) * 0.12;
          points.rotation.y = t * 0.03;
          const s = 1 + (this._energy || 0) * 0.12;
          burst.scale.setScalar(s);
        }
        renderer.render(scene, camera);
      };
      tick();
      this.setAttribute('data-ready', '');
    }

    // 0..1 — intensidad ligada al progreso de scroll de la sección
    set energy(v) { this._energy = Math.max(0, Math.min(1, v || 0)); }
  }
  customElements.define('claude-core-3d', ClaudeCore3D);
})();
