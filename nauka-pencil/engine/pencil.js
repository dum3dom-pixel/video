/* Pencil engine core: seeded noise, ribbon strokes, hatching, hand-written text, paper.
   Everything is a pure function of (seed, drawing index, time): no Math.random, same render every time.
   Drawings change 12 times a second ("on twos" at 24 fps). */
(function () {
  const W = 1920, H = 1080, DRAW_FPS = 12;
  const PAL = {
    paper: "#1b1917", paper2: "#242120", line: "#efe7d8", white: "#efe7d8", soft: "#9b9488", grey: "#a39d92",
    guide: "#6f685d", orange: "#f0782e", green: "#6EDB8F", red: "#E5484D",
  };
  const col = (n) => PAL[n] || n || PAL.line;

  const S = { ctx: null, di: 0 };

  /* hash -> [0,1) */
  function hr(a, b = 0, c = 0, d = 0) {
    let h = 2166136261;
    for (const n of [a, b, c, d]) {
      h = Math.imul(h ^ (Math.floor(n * 977) | 0), 16777619);
      h ^= h >>> 15;
      h = Math.imul(h, 2246822519);
      h ^= h >>> 13;
    }
    return (h >>> 0) / 4294967296;
  }
  function strSeed(s) {
    let h = 7;
    for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0;
    return Math.abs(h) % 100000;
  }
  function vn(seed, x) {
    const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
    const a = hr(seed, i), b = hr(seed, i + 1);
    return a + (b - a) * u;
  }
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, u) => a + (b - a) * u;
  const easeOut = (u) => 1 - Math.pow(1 - clamp(u), 3);
  const easeInOut = (u) => { u = clamp(u); return u * u * (3 - 2 * u); };
  /* progress 0..1 of t in [t0, t0+dur] */
  const pr = (t, t0, dur) => clamp((t - t0) / dur);

  function resample(pts, step) {
    const p = [pts[0]], s = [0];
    let acc = 0;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      const d = Math.hypot(x1 - x0, y1 - y0);
      if (d < 1e-6) continue;
      let pos = step - (acc % step || 0);
      if (acc % step === 0) pos = step;
      let walked = 0;
      while (walked + pos <= d) {
        walked += pos;
        const k = walked / d;
        p.push([x0 + (x1 - x0) * k, y0 + (y1 - y0) * k]);
        s.push(acc + walked);
        pos = step;
      }
      acc += d;
    }
    const last = pts[pts.length - 1];
    if (Math.hypot(p[p.length - 1][0] - last[0], p[p.length - 1][1] - last[1]) > 0.5) { p.push(last); s.push(acc); }
    return { p, s, L: acc };
  }

  /* One pencil line: ribbon with pressure, wobble that "boils" per drawing, breaks, thin sketch pass. */
  function pstroke(pts, o = {}) {
    const prog = o.prog === undefined ? 1 : o.prog;
    if (prog <= 0 || pts.length < 2) return;
    const c = S.ctx;
    const w = o.w || 3.4, amp = o.amp === undefined ? 1.7 : o.amp, seed = o.seed || 1, di = S.di;
    const rp = resample(pts, o.step || 6);
    const n = rp.p.length;
    if (n < 2) return;
    const nv = Math.max(2, Math.ceil(n * Math.min(1, prog)));
    const Lv = rp.s[nv - 1];
    // ALL random numbers first, independent of how much is visible
    const gaps = [];
    const gp = o.gapP === undefined ? 0.4 : o.gapP;
    for (let k = 0; k < 2; k++) {
      if (hr(seed, 50 + k, di) < gp && n > 14) {
        const a = Math.floor(hr(seed, 60 + k, di) * (n - 8)) + 4;
        gaps.push([a, a + 1 + Math.floor(hr(seed, 70 + k, di) * 2)]);
      }
    }
    const X = [], Y = [], Wd = [];
    for (let i = 0; i < nv; i++) {
      const [px, py] = rp.p[i];
      X.push(px + (vn(seed * 1.7 + di * 13.1, i * 0.21) - 0.5) * 2 * amp);
      Y.push(py + (vn(seed * 2.3 + di * 9.7 + 5, i * 0.21) - 0.5) * 2 * amp);
      const s = rp.s[i];
      const taper = clamp(Math.min(s / 18 + 0.3, (Lv - s) / 18 + 0.3), 0.3, 1);
      Wd.push(w * taper * (0.72 + 0.56 * vn(seed + 3 + di * 3.3, i * 0.3)));
    }
    c.save();
    c.fillStyle = col(o.col);
    c.globalAlpha = (o.alpha === undefined ? 1 : o.alpha) * 0.9;
    if (o.glow) { c.shadowColor = col(o.col); c.shadowBlur = o.glow; }
    let run = [];
    const flush = () => {
      if (run.length >= 2) {
        c.beginPath();
        const Lf = [], Rt = [];
        for (let k = 0; k < run.length; k++) {
          const i = run[k];
          const a = run[Math.max(0, k - 1)], b = run[Math.min(run.length - 1, k + 1)];
          let dx = X[b] - X[a], dy = Y[b] - Y[a];
          const dl = Math.hypot(dx, dy) || 1;
          dx /= dl; dy /= dl;
          Lf.push([X[i] - dy * Wd[i] / 2, Y[i] + dx * Wd[i] / 2]);
          Rt.push([X[i] + dy * Wd[i] / 2, Y[i] - dx * Wd[i] / 2]);
        }
        c.moveTo(Lf[0][0], Lf[0][1]);
        for (let k = 1; k < Lf.length; k++) c.lineTo(Lf[k][0], Lf[k][1]);
        for (let k = Rt.length - 1; k >= 0; k--) c.lineTo(Rt[k][0], Rt[k][1]);
        c.closePath();
        c.fill();
      }
      run = [];
    };
    for (let i = 0; i < nv; i++) {
      if (gaps.some((g) => i >= g[0] && i < g[1])) { flush(); continue; }
      run.push(i);
    }
    flush();
    c.restore();
    if (o.sketch !== false && w >= 2.6) {
      pstroke(pts, { ...o, seed: seed + 77, w: w * 0.38, amp: amp * 1.7, alpha: (o.alpha === undefined ? 1 : o.alpha) * 0.5, sketch: false, glow: 0, step: 8, gapP: 0.3 });
    }
  }

  /* shape point builders */
  function ellipsePts(cx, cy, rx, ry, a0 = 0, a1 = Math.PI * 2, rot = 0) {
    const n = Math.max(14, Math.ceil(Math.abs(a1 - a0) * Math.max(rx, ry) / 7));
    const out = [], cr = Math.cos(rot), sr = Math.sin(rot);
    for (let i = 0; i <= n; i++) {
      const a = a0 + ((a1 - a0) * i) / n;
      const x = Math.cos(a) * rx, y = Math.sin(a) * ry;
      out.push([cx + x * cr - y * sr, cy + x * sr + y * cr]);
    }
    return out;
  }
  const closed = (pts) => pts.concat([pts[0], pts[1]]);
  function bez(p0, p1, p2, p3, n = 24) {
    const out = [];
    for (let i = 0; i <= n; i++) {
      const u = i / n, v = 1 - u;
      out.push([
        v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0],
        v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1],
      ]);
    }
    return out;
  }
  /* hand-drawn rectangle: four separate sides that overshoot the corners */
  function prect(x, y, w, h, o = {}) {
    const seed = o.seed || 1, prog = o.prog === undefined ? 1 : o.prog;
    const ov = 10, sides = [
      [[x - ov * hr(seed, 1), y + hr(seed, 2) * 3], [x + w + ov * hr(seed, 3), y - hr(seed, 4) * 3]],
      [[x + w + hr(seed, 5) * 3, y - ov * hr(seed, 6)], [x + w - hr(seed, 7) * 3, y + h + ov * hr(seed, 8)]],
      [[x + w + ov * hr(seed, 9), y + h - hr(seed, 10) * 3], [x - ov * hr(seed, 11), y + h + hr(seed, 12) * 3]],
      [[x + hr(seed, 13) * 3, y + h + ov * hr(seed, 14)], [x - hr(seed, 15) * 3, y - ov * hr(seed, 16)]],
    ];
    sides.forEach((sd, i) => pstroke(sd, { ...o, seed: seed * 7 + i, prog: clamp(prog * 4 - i) }));
  }
  const clipPoly = (pts) => (c) => { c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.closePath(); c.clip(); };

  /* hatching: parallel short pencil lines inside a clip path */
  function hatch(clipFn, bb, o = {}) {
    const prog = o.prog === undefined ? 1 : o.prog;
    if (prog <= 0) return;
    const c = S.ctx, ang = ((o.angle === undefined ? 50 : o.angle) * Math.PI) / 180, gap = o.gap || 12, seed = o.seed || 3;
    const dx = Math.cos(ang), dy = Math.sin(ang), nx = -dy, ny = dx;
    const corners = [[bb[0], bb[1]], [bb[2], bb[1]], [bb[2], bb[3]], [bb[0], bb[3]]];
    const proj = corners.map((p) => p[0] * nx + p[1] * ny);
    const lo = Math.min(...proj), hi = Math.max(...proj);
    const cx = (bb[0] + bb[2]) / 2, cy = (bb[1] + bb[3]) / 2, half = Math.hypot(bb[2] - bb[0], bb[3] - bb[1]) / 2;
    const cproj = cx * nx + cy * ny;
    const count = Math.max(1, Math.floor((hi - lo) / gap));
    const show = Math.ceil(count * Math.min(1, prog));
    c.save();
    clipFn(c);
    for (let k = 0; k < show; k++) {
      const off = lo + (k + 0.5) * gap + (hr(seed, k) - 0.5) * gap * 0.5 - cproj;
      const px = cx + nx * off, py = cy + ny * off;
      const a = half * (0.55 + 0.45 * hr(seed, k, 9)), b = half * (0.55 + 0.45 * hr(seed, k, 8));
      pstroke([[px - dx * a, py - dy * a], [px + dx * b, py + dy * b]], { w: o.w || 1.8, amp: 1.1, col: o.col || "line", alpha: o.alpha === undefined ? 0.45 : o.alpha, seed: seed * 31 + k, sketch: false, gapP: 0.15, step: 9 });
    }
    c.restore();
  }
  function bboxOf(pts) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    return [x0, y0, x1, y1];
  }

  /* hand-written text: per-letter jitter that boils, double pass, appears letter by letter */
  const FONT = "Pencil";
  function setFont(size, weight) { S.ctx.font = `${weight || 700} ${size}px ${FONT}, "Segoe Print", sans-serif`; }
  function textWidth(str, size, weight) { setFont(size, weight); return S.ctx.measureText(str).width; }
  function fitSize(str, size, maxW, weight) {
    const w = textWidth(str, size, weight);
    return w > maxW ? Math.floor((size * maxW) / w) : size;
  }
  const GLOW = { orange: 14, green: 10, red: 12 };
  function ptext(str, x, y, o = {}) {
    const c = S.ctx, size = o.size || 64, prog = o.prog === undefined ? 1 : o.prog, seed = o.seed || 1, di = S.di;
    if (prog <= 0) return 0;
    setFont(size, o.weight);
    const widths = [...str].map((ch) => c.measureText(ch).width);
    const total = widths.reduce((a, b) => a + b, 0);
    let px = o.align === "left" ? x : o.align === "right" ? x - total : x - total / 2;
    const chars = [...str], nShow = Math.ceil(chars.length * Math.min(1, prog));
    c.save();
    c.textBaseline = "middle";
    const cname = o.col || "line", color = col(cname), alpha = o.alpha === undefined ? 1 : o.alpha;
    const glow = o.glow !== undefined ? o.glow : GLOW[cname] || 0;
    for (let i = 0; i < chars.length; i++) {
      if (i < nShow && chars[i] !== " ") {
        const jx = (hr(seed, i, di) - 0.5) * 2.2, jy = (hr(seed, i, di, 1) - 0.5) * 2.6, rot = (hr(seed, i, di, 2) - 0.5) * 0.05;
        c.save();
        c.translate(px + widths[i] / 2 + jx, y + jy);
        c.rotate(rot);
        c.textAlign = "center";
        c.fillStyle = color;
        if (glow) { c.shadowColor = color; c.shadowBlur = glow; }
        c.globalAlpha = alpha * 0.95;
        c.fillText(chars[i], 0, 0);
        c.shadowBlur = 0;
        c.globalAlpha = alpha * 0.3;
        c.fillText(chars[i], 1.6 + (hr(seed, i, di, 3) - 0.5), 1 + (hr(seed, i, di, 4) - 0.5));
        c.restore();
      }
      px += widths[i];
    }
    c.restore();
    return total;
  }

  /* paper: baked once with a seeded generator */
  let paperCv = null, grainCv = null;
  function bakePaper() {
    paperCv = document.createElement("canvas"); paperCv.width = W; paperCv.height = H;
    const c = paperCv.getContext("2d");
    c.fillStyle = PAL.paper; c.fillRect(0, 0, W, H);
    for (let i = 0; i < 16; i++) {
      const x = hr(901, i) * W, y = hr(902, i) * H, r = 120 + hr(903, i) * 260;
      const g = c.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, "rgba(70,62,52,0.28)"); g.addColorStop(1, "rgba(70,62,52,0)");
      c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2);
    }
    c.strokeStyle = "rgba(240,230,208,0.05)"; c.lineWidth = 1;
    for (let i = 0; i < 700; i++) {
      const x = hr(910, i) * W, y = hr(911, i) * H, a = hr(912, i) * Math.PI, l = 8 + hr(913, i) * 26;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke();
    }
    c.strokeStyle = "rgba(240,230,208,0.035)"; c.lineWidth = 4;   // erased ghost lines
    for (let i = 0; i < 7; i++) {
      c.beginPath(); c.arc(hr(920, i) * W, hr(921, i) * H, 200 + hr(922, i) * 500, hr(923, i) * 6, hr(923, i) * 6 + 1.3); c.stroke();
    }
    const vg = c.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 1.05);
    vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.55)");
    c.fillStyle = vg; c.fillRect(0, 0, W, H);
    grainCv = document.createElement("canvas"); grainCv.width = 512; grainCv.height = 512;
    const g = grainCv.getContext("2d");
    for (let i = 0; i < 11000; i++) {
      g.fillStyle = `rgba(27,25,23,${0.35 + hr(930, i) * 0.6})`;
      const r = 0.5 + hr(931, i) * 1.1;
      g.beginPath(); g.arc(hr(932, i) * 512, hr(933, i) * 512, r, 0, 7); g.fill();
    }
  }
  function paper() { S.ctx.drawImage(paperCv, 0, 0); }
  function grain() {
    const c = S.ctx, ox = Math.floor(hr(S.di, 41) * 512), oy = Math.floor(hr(S.di, 42) * 512);
    c.save(); c.globalAlpha = 0.6;
    for (let x = -ox; x < W; x += 512) for (let y = -oy; y < H; y += 512) c.drawImage(grainCv, x, y);
    c.restore();
  }

  window.PE = { W, H, DRAW_FPS, PAL, col, S, hr, strSeed, vn, clamp, lerp, easeOut, easeInOut, pr, pstroke, ellipsePts, closed, bez, prect, clipPoly, hatch, bboxOf, ptext, textWidth, fitSize, setFont, bakePaper, paper, grain };
})();
