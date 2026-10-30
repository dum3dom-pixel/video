/* Cartoon toolkit: thick brown outline, flat fill + one cel shadow, comic text, sunburst backgrounds, FX. Everything is a pure function of time. */
(function () {
  const W = 1920, H = 1080;
  const OUT = "#3a1a12", OW = 9;
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, u) => a + (b - a) * u;
  const easeOut = (u) => 1 - Math.pow(1 - clamp(u), 3);
  const easeInOut = (u) => { u = clamp(u); return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
  const easeOutBack = (u) => { u = clamp(u); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); };
  const pr = (t, s, d) => clamp((t - s) / d);
  const hr = (a, b = 0, c = 0) => { let h = Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265263) ^ Math.imul(c | 0, 2147483647); h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
  const strSeed = (s) => { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) | 0; return Math.abs(h); };
  const FONT = '"Toon", Impact, "Arial Black", sans-serif';

  /* fill a path with a flat colour plus a crescent shadow (light from the upper left), then the outline */
  function shape(c, path, fill, shade, off, lw) {
    c.save();
    path(); c.fillStyle = shade || fill; c.fill();
    if (shade) { c.save(); c.clip(); c.translate(off[0], off[1]); path(); c.fillStyle = fill; c.fill(); c.restore(); }
    path(); c.lineWidth = lw; c.lineJoin = "round"; c.lineCap = "round"; c.strokeStyle = OUT; c.stroke();
    c.restore();
  }

  /* convex hull of two circles: a tapered limb */
  function hull(c, a, b, ra, rb) {
    return () => {
      const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1e-6, th = Math.atan2(dy, dx);
      const ph = Math.acos(clamp((ra - rb) / d, -0.99, 0.99));
      c.beginPath();
      c.moveTo(a[0] + ra * Math.cos(th + ph), a[1] + ra * Math.sin(th + ph));
      c.lineTo(b[0] + rb * Math.cos(th + ph), b[1] + rb * Math.sin(th + ph));
      c.arc(b[0], b[1], rb, th + ph, th - ph, true);
      c.lineTo(a[0] + ra * Math.cos(th - ph), a[1] + ra * Math.sin(th - ph));
      c.arc(a[0], a[1], ra, th - ph, th + ph, true);
      c.closePath();
    };
  }
  const rrect = (c, x, y, w, h, r) => () => {
    r = Math.min(r, w / 2, h / 2);
    c.beginPath(); c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.arcTo(x + w, y, x + w, y + r, r); c.lineTo(x + w, y + h - r); c.arcTo(x + w, y + h, x + w - r, y + h, r);
    c.lineTo(x + r, y + h); c.arcTo(x, y + h, x, y + h - r, r); c.lineTo(x, y + r); c.arcTo(x, y, x + r, y, r); c.closePath();
  };
  const poly = (c, pts) => () => { c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.closePath(); };
  const ell = (c, x, y, rx, ry, rot = 0) => () => { c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); };

  /* chunky comic lettering: white halo, brown outline, vertical gradient fill, soft shadow */
  function comicText(c, str, x, y, size, o = {}) {
    const { fill = ["#ffe66b", "#ffae1a"], rot = 0, sc = 1, align = "center", outer = "#ffffff", ow = 0.2, alpha = 1 } = o;
    if (alpha <= 0 || sc <= 0) return 0;
    c.save(); c.globalAlpha *= alpha; c.translate(x, y); c.rotate(rot); c.scale(sc, sc);
    c.font = `${size}px ${FONT}`; c.textAlign = align; c.textBaseline = "middle"; c.lineJoin = "round"; c.miterLimit = 2;
    const w = c.measureText(str).width;
    c.save(); c.translate(0, size * 0.09); c.strokeStyle = "rgba(40,15,10,.38)"; c.lineWidth = size * (ow + 0.16); c.strokeText(str, 0, 0); c.restore();
    if (outer) { c.strokeStyle = outer; c.lineWidth = size * (ow + 0.16); c.strokeText(str, 0, 0); }
    c.strokeStyle = OUT; c.lineWidth = size * ow; c.strokeText(str, 0, 0);
    const g = c.createLinearGradient(0, -size * 0.5, 0, size * 0.5); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]);
    c.fillStyle = g; c.fillText(str, 0, 0);
    c.restore();
    return w * sc;
  }
  function textWidth(c, str, size) { c.save(); c.font = `${size}px ${FONT}`; const w = c.measureText(str).width; c.restore(); return w; }

  /* ---------- FX ---------- */
  function star(c, x, y, r, rot, fill, seed) {
    const pts = [];
    for (let i = 0; i < 10; i++) { const a = rot - Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
    shape(c, poly(c, pts), fill, null, [0, 0], 5);
  }
  function burst(c, x, y, r, rot, seed, k) {
    const n = 12, pts = [], ptsIn = [];
    for (let i = 0; i < n * 2; i++) {
      const a = rot + i * Math.PI / n, jit = 0.88 + 0.24 * hr(seed, i);
      pts.push([x + Math.cos(a) * (i % 2 ? 0.58 : 1) * r * jit, y + Math.sin(a) * (i % 2 ? 0.58 : 1) * r * jit]);
      ptsIn.push([x + Math.cos(a) * (i % 2 ? 0.34 : 0.66) * r * jit, y + Math.sin(a) * (i % 2 ? 0.34 : 0.66) * r * jit]);
    }
    shape(c, poly(c, pts), "#ff6a2b", null, [0, 0], 11);
    shape(c, poly(c, ptsIn), "#ffe14d", null, [0, 0], 6);
  }
  function drop(c, x, y, r, rot) {
    c.save(); c.translate(x, y); c.rotate(rot);
    const path = () => { c.beginPath(); c.moveTo(0, -r * 1.7); c.bezierCurveTo(r * 0.9, -r * 0.5, r, 0.2 * r, 0, r); c.bezierCurveTo(-r, 0.2 * r, -r * 0.9, -r * 0.5, 0, -r * 1.7); c.closePath(); };
    shape(c, path, "#52b8ff", "#2f86d6", [-r * 0.25, -r * 0.25], 5);
    c.restore();
  }
  function cloud(c, x, y, s, fill, shade, seed, outline = true) {
    const parts = [[0, 0, 60], [-62, 14, 44], [60, 16, 46], [-24, -30, 46], [30, -26, 40], [100, 30, 30], [-100, 30, 30]].map((p) => [x + p[0] * s, y + p[1] * s, p[2] * s]);
    c.save();
    if (outline) { c.fillStyle = OUT; parts.forEach((p) => { c.beginPath(); c.arc(p[0], p[1], p[2] + 5, 0, Math.PI * 2); c.fill(); }); }
    c.fillStyle = shade; parts.forEach((p) => { c.beginPath(); c.arc(p[0], p[1], p[2], 0, Math.PI * 2); c.fill(); });
    c.fillStyle = fill; parts.forEach((p) => { c.beginPath(); c.arc(p[0] - p[2] * 0.12, p[1] - p[2] * 0.16, p[2] * 0.86, 0, Math.PI * 2); c.fill(); });
    c.restore();
  }
  /* long thin streaks sliding across the frame */
  function speedLines(c, t, seed, n, alpha, dirx, y0 = 80, y1 = 900, col = "255,255,255") {
    c.save();
    for (let i = 0; i < n; i++) {
      const y = y0 + hr(seed, i) * (y1 - y0), len = 380 + hr(seed, i, 1) * 700, sp = 2600 + hr(seed, i, 2) * 2400, th = 3 + hr(seed, i, 3) * 6;
      const x = ((hr(seed, i, 4) * (W + len) + t * sp * dirx) % (W + len) + (W + len)) % (W + len) - len;
      const g = c.createLinearGradient(x, 0, x + len * dirx * -1, 0);
      g.addColorStop(0, `rgba(${col},${alpha})`); g.addColorStop(1, `rgba(${col},0)`);
      c.fillStyle = g; c.beginPath(); c.moveTo(x, y); c.lineTo(x - dirx * len, y - th * 0.15); c.lineTo(x - dirx * len, y + th * 0.15); c.closePath();
      c.moveTo(x, y); c.lineTo(x - dirx * len, y - th); c.lineTo(x - dirx * len, y + th); c.closePath(); c.fill();
    }
    c.restore();
  }

  /* ---------- backgrounds ---------- */
  const PAL = {
    day: { top: "#3fb2e6", bot: "#a6e6f3", ray: "rgba(255,255,255,.15)", cloud: ["#ffffff", "#cfeaf5"], mesa: "#7fc6dd", g0: "#ffc15f", g1: "#f39c3d", ridge: "#d98428" },
    red: { top: "#c92a2a", bot: "#ff9440", ray: "rgba(255,226,120,.2)", cloud: ["#ffd9b0", "#f0a070"], mesa: "#c4533c", g0: "#e79b4c", g1: "#c36a2b", ridge: "#9b4a1d" },
    teal: { top: "#12727f", bot: "#62d2c0", ray: "rgba(255,255,255,.13)", cloud: ["#e9fff8", "#a6e4d6"], mesa: "#3b9b9c", g0: "#f0bd68", g1: "#d08c3a", ridge: "#a8661f" },
    dusk: { top: "#35247f", bot: "#f0638a", ray: "rgba(255,205,150,.17)", cloud: ["#ffd0e0", "#c97fb0"], mesa: "#7a3d8f", g0: "#e5934d", g1: "#b8622f", ridge: "#8a4120" },
  };
  function cactus(c, x, y, s) {
    const g = "#5dbb57", gs = "#3d9142", lw = OW * 0.8;
    shape(c, hull(c, [x, y], [x, y - 150 * s], 22 * s, 22 * s), g, gs, [-5, -5], lw);
    shape(c, hull(c, [x + 22 * s, y - 70 * s], [x + 52 * s, y - 70 * s], 14 * s, 14 * s), g, gs, [-4, -4], lw);
    shape(c, hull(c, [x + 52 * s, y - 70 * s], [x + 52 * s, y - 112 * s], 14 * s, 14 * s), g, gs, [-4, -4], lw);
    shape(c, hull(c, [x - 22 * s, y - 95 * s], [x - 50 * s, y - 95 * s], 13 * s, 13 * s), g, gs, [-4, -4], lw);
    shape(c, hull(c, [x - 50 * s, y - 95 * s], [x - 50 * s, y - 128 * s], 13 * s, 13 * s), g, gs, [-4, -4], lw);
  }
  function drawBG(c, kind, t, spread) {
    const p = PAL[kind] || PAL.day, HZ = 840;
    const g = c.createLinearGradient(0, 0, 0, HZ); g.addColorStop(0, p.top); g.addColorStop(1, p.bot);
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.save(); c.translate(960, 720); c.rotate(t * 0.045);
    for (let i = 0; i < 18; i++) { const a0 = (i / 18) * Math.PI * 2, a1 = a0 + Math.PI / 18; c.fillStyle = p.ray; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 2600, a0, a1); c.closePath(); c.fill(); }
    c.restore();
    // clouds drift
    [[260, 190, 1.5, 0.017], [1050, 120, 1.1, 0.011], [1600, 260, 1.7, 0.02], [600, 330, 0.9, 0.013]].forEach((q, i) => {
      const x = ((q[0] + t * q[3] * 900) % (W + 500)) - 250;
      cloud(c, x, q[1], q[2], p.cloud[0], p.cloud[1], i, false);
    });
    // far mesas
    c.fillStyle = p.mesa; c.globalAlpha = 0.85;
    [[0, 150, 230], [330, 100, 150], [1060, 190, 210], [1420, 120, 260], [1740, 100, 170]].forEach((m) => {
      c.beginPath(); c.moveTo(m[0] - m[1], HZ); c.lineTo(m[0] - m[1] * 0.6, HZ - m[2]); c.lineTo(m[0] + m[1] * 0.6, HZ - m[2]); c.lineTo(m[0] + m[1], HZ); c.closePath(); c.fill();
    });
    c.globalAlpha = 1;
    // ground
    const gg = c.createLinearGradient(0, HZ - 40, 0, H); gg.addColorStop(0, p.g0); gg.addColorStop(1, p.g1);
    c.beginPath(); c.moveTo(0, H);
    for (let x = 0; x <= W; x += 40) c.lineTo(x, HZ - 20 + Math.sin(x * 0.006 + 1) * 16 + Math.sin(x * 0.017) * 6);
    c.lineTo(W, H); c.closePath(); c.fillStyle = gg; c.fill();
    c.lineWidth = 7; c.strokeStyle = OUT; c.lineJoin = "round"; c.stroke();
    // dune ridge shading + cracks
    c.strokeStyle = p.ridge; c.lineWidth = 5; c.lineCap = "round";
    for (let i = 0; i < 9; i++) {
      const x = 120 + i * 220 + hr(5, i) * 80, y = 920 + hr(6, i) * 120;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + 50, y + 12); c.lineTo(x + 100, y - 4); c.lineTo(x + 130, y + 10); c.stroke();
    }
    cactus(c, 150, HZ + 15, 1); cactus(c, 1810, HZ + 25, 1.25);
  }

  window.TOON = { W, H, OUT, OW, FONT, clamp, lerp, easeOut, easeInOut, easeOutBack, pr, hr, strSeed, shape, hull, rrect, poly, ell, comicText, textWidth, star, burst, drop, cloud, speedLines, drawBG, PAL };
})();
