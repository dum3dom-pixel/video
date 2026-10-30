/* Paper toolkit for the collage hook: seeded noise, torn-paper sprites (white fibre margin + coloured top layer + grain),
   drop shadows, cut-out words and letters. Everything is deterministic: no Math.random / Date.now, sprites are cached by key. */
(function () {
  const W = 1920, H = 1080;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const pr = (t, t0, d) => clamp((t - t0) / d);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const easeIn = (t) => t * t;
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOutBack = (t, s = 1.70158) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
  const DEG = Math.PI / 180;

  /* ---- seeded hash / noise ---- */
  function hr(a, b, c, d) {
    let h = 0x9e3779b9;
    for (const v of [a, b || 0, c || 0, d || 0]) { h = Math.imul(h ^ (v | 0), 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16; }
    return (h >>> 0) / 4294967296;
  }
  const hs = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h | 0; };
  const mk = (seed) => { let a = seed | 0; return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  const vn = (seed, x) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hr(seed, i), hr(seed, i + 1), u); };

  const PAL = {
    kraft: "#c9a06b", kraftD: "#a8793f", kraftL: "#dcb98a", cream: "#f3e8cf", creamD: "#e2d4b3", blue: "#6f8fa8", blueD: "#46627a", blueL: "#9db8cb",
    mustard: "#d9a63a", mustardD: "#b9861d", gray: "#9a9ea3", grayD: "#5d6066", grayL: "#c4c6c8", red: "#d92f2b", redD: "#a82220", ink: "#2a2522", white: "#f6f1e4",
  };

  const cache = new Map();
  const memo = (key, fn) => { let v = cache.get(key); if (!v) { v = fn(); cache.set(key, v); } return v; };
  const newCanvas = (w, h) => Object.assign(document.createElement("canvas"), { width: Math.max(1, Math.ceil(w)), height: Math.max(1, Math.ceil(h)) });

  /* ---- paper grain: fibres + speckle, tiled ---- */
  function grainPattern(ctx) {
    return memo("grain-pat", () => {
      const t = newCanvas(256, 256), g = t.getContext("2d"), r = mk(7);
      for (let i = 0; i < 2600; i++) { g.fillStyle = r() < 0.5 ? `rgba(60,40,20,${0.05 + r() * 0.09})` : `rgba(255,252,240,${0.07 + r() * 0.12})`; g.fillRect(r() * 256, r() * 256, 1 + r() * 1.6, 1 + r() * 1.6); }
      for (let i = 0; i < 520; i++) {
        const x = r() * 256, y = r() * 256, a = r() * Math.PI, l = 5 + r() * 18;
        g.strokeStyle = r() < 0.55 ? `rgba(70,45,20,${0.05 + r() * 0.07})` : `rgba(255,250,235,${0.10 + r() * 0.12})`; g.lineWidth = 0.7 + r() * 0.8;
        g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * l * 0.5 + r() * 3, y + Math.sin(a) * l * 0.5 + r() * 3, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
      }
      return ctx.createPattern(t, "repeat");
    });
  }
  function texture(g, w, h, seed, o = {}) {
    g.save(); g.globalCompositeOperation = "source-atop";
    const r = mk(seed ^ 0x5bd1);
    // soft tonal drift + stains
    const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, "rgba(255,255,255,0.10)"); gr.addColorStop(0.55, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(60,35,10,0.12)");
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    const stains = o.stains || 0;
    for (let i = 0; i < stains; i++) {
      const x = r() * w, y = r() * h, rx = 40 + r() * 140, ry = 20 + r() * 80;
      g.fillStyle = r() < 0.5 ? "rgba(70,45,20,0.07)" : "rgba(255,250,235,0.09)";
      g.beginPath(); g.ellipse(x, y, rx, ry, r() * Math.PI, 0, Math.PI * 2); g.fill();
    }
    const folds = o.folds || 0;
    for (let i = 0; i < folds; i++) {
      const x = r() * w, a = (r() - 0.5) * 0.5; g.lineWidth = 2; g.strokeStyle = "rgba(60,35,10,0.10)"; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + Math.tan(a) * h, h); g.stroke();
      g.strokeStyle = "rgba(255,250,235,0.16)"; g.beginPath(); g.moveTo(x + 2, 0); g.lineTo(x + 2 + Math.tan(a) * h, h); g.stroke();
    }
    g.fillStyle = grainPattern(g); g.globalAlpha = o.grain ?? 1; g.fillRect(0, 0, w, h);
    g.restore();
  }

  /* ---- torn outlines ---- */
  function tearPoly(pts, seed, amp, seg = 12, torn = null) {
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(len / seg));
      const nx = -(b[1] - a[1]) / (len || 1), ny = (b[0] - a[0]) / (len || 1);
      const on = torn ? torn[i] : true;
      for (let k = 0; k < n; k++) {
        const u = k / n, d = on ? ((vn(seed * 13 + i, (k * seg) / 22) - 0.5) * 2 * amp + (hr(seed, i, k) - 0.5) * amp * 0.9) : 0;
        out.push([lerp(a[0], b[0], u) + nx * d, lerp(a[1], b[1], u) + ny * d]);
      }
    }
    return out;
  }
  const trace = (g, pts) => { g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); };

  /* ---- sprites: {cv, w, h, ox, oy}; (ox,oy) is the canvas offset from the sprite's top-left ---- */
  const PAD = 16;
  function polySheet(pts, color, seed, o = {}) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const p of pts) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }
    const w = x1 - x0, h = y1 - y0, cv = newCanvas(w + PAD * 2, h + PAD * 2), g = cv.getContext("2d");
    const sh = pts.map((p) => [p[0] - x0 + PAD, p[1] - y0 + PAD]);
    const amp = o.amp ?? 4, rim = o.rim === undefined ? PAL.white : o.rim, inset = o.inset ?? 4;
    if (rim) { g.fillStyle = rim; trace(g, tearPoly(sh, seed, amp, o.seg || 12, o.torn)); g.fill(); }
    // top layer: the same outline pulled in a little, torn with another seed
    const cx = PAD + w / 2, cy = PAD + h / 2, k = rim ? Math.max(0.5, 1 - (inset * 2) / Math.max(w, h)) : 1;
    const inner = rim ? sh.map((p) => [cx + (p[0] - cx) * k, cy + (p[1] - cy) * k]) : sh;
    g.fillStyle = color; trace(g, tearPoly(inner, seed + 91, rim ? amp * 0.6 : amp, o.seg || 12, o.torn)); g.fill();
    texture(g, cv.width, cv.height, seed, o);
    if (o.detail) o.detail(g, { x: PAD, y: PAD, w, h });
    return { cv, w, h, ox: PAD, oy: PAD };
  }
  function sheet(w, h, color, seed, o = {}) {
    return polySheet([[0, 0], [w, 0], [w, h], [0, h]], color, seed, { torn: o.edges ? [o.edges.includes("t"), o.edges.includes("r"), o.edges.includes("b"), o.edges.includes("l")] : [true, true, true, true], ...o });
  }
  function ellipseSheet(rx, ry, color, seed, o = {}) {
    const n = Math.max(14, Math.round((rx + ry) / 5)), pts = [];
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; pts.push([rx + Math.cos(a) * rx, ry + Math.sin(a) * ry]); }
    return polySheet(pts, color, seed, { seg: 20, ...o });
  }
  function ringSheet(r, thick, color, seed, o = {}) {
    const cv = newCanvas(2 * r + PAD * 2, 2 * r + PAD * 2), g = cv.getContext("2d"), c = r + PAD, n = Math.round(r / 3.5), rnd = mk(seed);
    const loop = (rad, s, a) => { const pts = []; for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2, d = (vn(s, i / 2.2) - 0.5) * 2 * a + (rnd() - 0.5) * a * 0.6; pts.push([c + Math.cos(t) * (rad + d), c + Math.sin(t) * (rad + d)]); } return pts; };
    const rimW = o.rimW ?? 4;
    g.fillStyle = PAL.white; g.beginPath(); loop(r, seed, 3).forEach((p, i) => (i ? g.lineTo(...p) : g.moveTo(...p))); g.closePath(); loop(r - thick, seed + 5, 3).reverse().forEach((p, i) => (i ? g.lineTo(...p) : g.moveTo(...p))); g.closePath(); g.fill("evenodd");
    g.fillStyle = color; g.beginPath(); loop(r - rimW, seed + 9, 2).forEach((p, i) => (i ? g.lineTo(...p) : g.moveTo(...p))); g.closePath(); loop(r - thick + rimW, seed + 13, 2).reverse().forEach((p, i) => (i ? g.lineTo(...p) : g.moveTo(...p))); g.closePath(); g.fill("evenodd");
    texture(g, cv.width, cv.height, seed);
    return { cv, w: 2 * r, h: 2 * r, ox: PAD, oy: PAD };
  }
  const burstPts = (r1, r2, n, seed) => { const pts = []; for (let i = 0; i < n * 2; i++) { const a = (i / (n * 2)) * Math.PI * 2, rr = i % 2 ? r1 * (0.9 + hr(seed, i) * 0.2) : r2 * (0.85 + hr(seed, i, 3) * 0.3); pts.push([r2 + Math.cos(a) * rr, r2 + Math.sin(a) * rr]); } return pts; };
  const starPts = (r, n = 5, k = 0.45) => { const pts = []; for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + (i / (n * 2)) * Math.PI * 2, rr = i % 2 ? r * k : r; pts.push([r + Math.cos(a) * rr, r + Math.sin(a) * rr]); } return pts; };
  const arrowPts = (len, thick, head, hlen) => [[0, -thick / 2], [len - hlen, -thick / 2], [len - hlen, -head / 2], [len, 0], [len - hlen, head / 2], [len - hlen, thick / 2], [0, thick / 2]].map((p) => [p[0], p[1] + head / 2]);

  /* ---- text ---- */
  const FONT = (s) => `${s}px ImpactP, Impact, "Arial Black", sans-serif`;
  const lum = (hex) => { const n = parseInt(hex.slice(1), 16); return 0.3 * (n >> 16) + 0.59 * ((n >> 8) & 255) + 0.11 * (n & 255); };
  function measure(text, size, track = 0) {
    const g = memo("meas", () => newCanvas(8, 8).getContext("2d")); g.font = FONT(size);
    return [...text].reduce((a, ch) => a + g.measureText(ch).width + track, 0) - track;
  }
  /* a word printed on a torn strip; letters wobble like hand-cut stencils */
  function strip(text, size, o = {}) {
    const key = `strip|${text}|${size}|${o.bg}|${o.fg}|${o.seed || 0}`;
    return memo(key, () => {
      const track = o.track ?? size * 0.03, tw = measure(text, size, track), padX = size * 0.42, h = size * 1.22, w = tw + padX * 2, seed = (o.seed || 0) + hs(text);
      const bg = o.bg || PAL.cream, fg = o.fg || PAL.ink;
      const sp = polySheet([[0, 0], [w, 0], [w, h], [0, h]], bg, seed, { amp: size * 0.05, inset: 3, rim: o.rim === undefined ? PAL.white : o.rim, ...o, detail: (g) => {
        g.font = FONT(size); g.textBaseline = "alphabetic"; g.textAlign = "left"; let x = PAD + padX;
        const r = mk(seed + 3);
        for (const ch of text) {
          const cw = g.measureText(ch).width, wob = (r() - 0.5) * size * 0.05, rot = (r() - 0.5) * 0.06;
          g.save(); g.translate(x + cw / 2, PAD + h * 0.78 + wob); g.rotate(rot); g.fillStyle = fg; g.fillText(ch, -cw / 2, 0); g.restore(); x += cw + track;
        }
        g.save(); g.globalCompositeOperation = "source-atop"; g.fillStyle = grainPattern(g); g.globalAlpha = 0.9; g.fillRect(0, 0, 4000, 4000); g.restore();
      } });
      return sp;
    });
  }
  /* ransom-note word: every letter on its own scrap */
  function letters(text, size, o = {}) {
    const key = `let|${text}|${size}|${o.seed || 0}|${(o.cols || []).join()}`;
    return memo(key, () => {
      const cols = o.cols || [PAL.cream, PAL.mustard, PAL.blueL, PAL.kraftL, PAL.cream, PAL.grayL], seed = (o.seed || 0) + hs(text), r = mk(seed);
      const step = size * 0.86, w = step * text.length + size * 0.4, h = size * 1.5, cv = newCanvas(w + 2 * PAD, h + 2 * PAD), g = cv.getContext("2d");
      [...text].forEach((ch, i) => {
        if (ch === " ") return;
        const sw = size * (0.92 + r() * 0.12), sh = size * (1.12 + r() * 0.16), col = o.fixed ? o.fixed : cols[Math.floor(r() * cols.length)];
        const sp = polySheet([[0, 0], [sw, 0], [sw, sh], [0, sh]], col, seed + i * 17, { amp: size * 0.04, inset: 3, detail: (gg) => {
          gg.font = FONT(size); gg.textAlign = "center"; gg.fillStyle = lum(col) > 120 ? (o.ink || PAL.ink) : PAL.cream; gg.fillText(ch, PAD + sw / 2, PAD + sh * 0.82);
          gg.save(); gg.globalCompositeOperation = "source-atop"; gg.fillStyle = grainPattern(gg); gg.fillRect(0, 0, 999, 999); gg.restore();
        } });
        g.save(); g.translate(PAD + size * 0.2 + i * step + sw / 2, PAD + h / 2 + (r() - 0.5) * size * 0.14); g.rotate((r() - 0.5) * 0.2);
        g.shadowColor = "rgba(30,18,6,0.35)"; g.shadowBlur = 5; g.shadowOffsetY = 3; g.drawImage(sp.cv, -sp.ox - sw / 2, -sp.oy - sh / 2); g.restore();
      });
      return { cv, w, h, ox: PAD, oy: PAD, cw: w };
    });
  }

  /* ---- drawing ---- */
  /* place a sprite: (x,y) is where its anchor (ax,ay as fractions) lands. depth drives the shadow offset/softness. */
  function put(c, sp, x, y, o = {}) {
    const { rot = 0, sx = 1, sy = sx, ax = 0.5, ay = 0.5, depth = 1, alpha = 1, z = 1, shadow = true, flip = false } = o;
    if (alpha <= 0 || !sp) return;
    c.save();
    c.translate(x, y); c.rotate(rot); c.scale(flip ? -sx : sx, sy);
    c.globalAlpha *= alpha;
    if (shadow) { c.shadowColor = `rgba(34,22,8,${0.42 * Math.min(1, alpha * 1.3)})`; c.shadowBlur = (5 + depth * 5) * z; c.shadowOffsetX = depth * 2.5 * z; c.shadowOffsetY = depth * 5.5 * z; }
    c.drawImage(sp.cv, -(sp.ox + sp.w * ax), -(sp.oy + sp.h * ay));
    c.restore();
  }
  const sizeOf = (sp) => [sp.w, sp.h];

  window.PAPER = { W, H, PAL, clamp, lerp, pr, easeOut, easeIn, easeInOut, easeOutBack, DEG, hr, hs, mk, vn, memo, newCanvas, sheet, polySheet, ellipseSheet, ringSheet, burstPts, starPts, arrowPts, strip, letters, put, measure, texture, grainPattern, FONT, sizeOf };
})();
