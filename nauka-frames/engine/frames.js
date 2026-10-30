/* Whole-picture player for the Nauka Boya hook: each scene is one or two finished pictures (assets/shots/*.png, 1536x1024)
   moved as a whole (camera push/pan, shake, card slides, drops) plus code-drawn text, arrows, rings, stamps and flashes.
   render(t) is a pure function of time; jitter is step-indexed seeded hashes (12 steps/s), no Math.random/Date.now. */
(function () {
  const W = 1920, H = 1080, DEG = Math.PI / 180, STEP = 12;
  const SP = window.SPEC, IMG = {};
  const FONT = (s) => `${s}px ImpactP, Impact, sans-serif`;
  const Y = "#ffd23c", R = "#e8312a", WH = "#ffffff", INK = "#141210";

  // ---- seeded noise, easing
  const hs = (s) => { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const hr = (...a) => { let h = 0x9e3779b9; for (const v of a) { h ^= (typeof v === "string" ? hs(v) : Math.floor(v)) + 0x7f4a7c15; h = Math.imul(h ^ (h >>> 15), 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16; } return (h >>> 0) / 4294967296; };
  const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const sm = (x) => { x = cl(x); return x * x * (3 - 2 * x); };
  const eo3 = (x) => 1 - Math.pow(1 - cl(x), 3);
  const eob = (x) => { x = cl(x); const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  const bounce = (x) => { x = cl(x); const n = 7.5625, d = 2.75; if (x < 1 / d) return n * x * x; if (x < 2 / d) return n * (x -= 1.5 / d) * x + 0.75; if (x < 2.5 / d) return n * (x -= 2.25 / d) * x + 0.9375; return n * (x -= 2.625 / d) * x + 0.984375; };
  const stp = (t) => Math.floor(t * STEP + 1e-6);

  /* keyframes [[t, v...], ...] -> smooth interpolation of the v's */
  function kf(t, keys) {
    if (t <= keys[0][0]) return keys[0].slice(1);
    for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const a = keys[i - 1], b = keys[i], u = sm((t - a[0]) / (b[0] - a[0])); return a.slice(1).map((v, k) => lerp(v, b[k + 1], u)); }
    return keys[keys.length - 1].slice(1);
  }

  function load() {
    return Promise.all(SP.shots.map((n) => new Promise((res, rej) => { const im = new Image(); im.onload = res; im.onerror = () => rej(new Error("shot " + n)); im.src = `assets/shots/${n}.png`; IMG[n] = im; })));
  }

  // ---- picture, camera
  /* cam {z, fx, fy (focus in image 0..1), dx, dy, rot(deg)}; returns map(nx, ny) -> screen px for anchoring effects */
  function shot(c, name, cam, o = {}) {
    const im = IMG[name], z = Math.max(cam.z, 1.08), iw = W * z, ih = (W * 1024 / 1536) * z;
    const fx = cl(cam.fx ?? 0.5, 0.5 / z, 1 - 0.5 / z), fy = cl(cam.fy ?? 0.5, (H / 2) / ih, 1 - (H / 2) / ih);
    const dx = cam.dx || 0, dy = cam.dy || 0, r = (cam.rot || 0) * DEG;
    c.save();
    if (o.filter) c.filter = o.filter;
    c.translate(W / 2 + dx, H / 2 + dy); c.rotate(r); c.translate(-fx * iw, -fy * ih);
    c.drawImage(im, 0, 0, iw, ih);
    c.restore();
    return (nx, ny) => { const x = (nx - fx) * iw, y = (ny - fy) * ih; return [W / 2 + dx + x * Math.cos(r) - y * Math.sin(r), H / 2 + dy + x * Math.sin(r) + y * Math.cos(r)]; };
  }
  /* alive-paper wobble: tiny stepped drift, always on */
  const wob = (t, key) => { const s = stp(t); return { dx: (hr(s, key, 1) - 0.5) * 6, dy: (hr(s, key, 2) - 0.5) * 6, rot: (hr(s, key, 3) - 0.5) * 0.5 }; };
  function shake(t, t0, dur, amp) {
    const p = (t - t0) / dur; if (p < 0 || p > 1) return { dx: 0, dy: 0, rot: 0 };
    const s = stp(t), k = Math.pow(1 - p, 2) * amp;
    return { dx: (hr(s, 11) - 0.5) * 2 * k, dy: (hr(s, 12) - 0.5) * 2 * k, rot: (hr(s, 13) - 0.5) * 2 * k * 0.03 };
  }
  const addCam = (cam, ...ds) => { for (const d of ds) { cam.dx = (cam.dx || 0) + d.dx; cam.dy = (cam.dy || 0) + d.dy; cam.rot = (cam.rot || 0) + d.rot; } return cam; };

  // ---- overlays
  function flash(c, t, t0, dur, a = 1, col = "255,255,255") { const p = (t - t0) / dur; if (p < 0 || p > 1) return; c.fillStyle = `rgba(${col},${a * Math.pow(1 - p, 1.6)})`; c.fillRect(0, 0, W, H); }
  function speedLines(c, t, cx, cy, a, rIn = 380) {
    if (a <= 0) return; const s = stp(t); c.save(); c.translate(cx, cy);
    for (let i = 0; i < 56; i++) {
      const ang = (i / 56) * Math.PI * 2 + (hr(s, i, 1) - 0.5) * 0.07, w = 0.008 + hr(s, i, 2) * 0.022, r0 = rIn + hr(s, i, 3) * 220, r1 = 1500;
      c.fillStyle = i % 2 ? `rgba(255,255,255,${a * 0.85})` : `rgba(20,18,16,${a * 0.55})`;
      c.beginPath(); c.moveTo(Math.cos(ang - w) * r1, Math.sin(ang - w) * r1); c.lineTo(Math.cos(ang) * r0, Math.sin(ang) * r0); c.lineTo(Math.cos(ang + w) * r1, Math.sin(ang + w) * r1); c.closePath(); c.fill();
    }
    c.restore();
  }
  let VIG = null, GRAIN = [];
  function overlays(c, t, grainA) {
    if (!VIG) {
      VIG = document.createElement("canvas"); VIG.width = W; VIG.height = H; const g = VIG.getContext("2d");
      const gr = g.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 1.0); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(15,8,0,0.5)"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      for (let k = 0; k < 4; k++) { const n = document.createElement("canvas"); n.width = n.height = 256; const q = n.getContext("2d"), d = q.createImageData(256, 256); for (let i = 0; i < 256 * 256; i++) { const v = hr(k, i) * 255; d.data[i * 4] = d.data[i * 4 + 1] = d.data[i * 4 + 2] = v; d.data[i * 4 + 3] = 255; } q.putImageData(d, 0, 0); GRAIN.push(n); }
    }
    c.drawImage(VIG, 0, 0);
    if (grainA > 0) {
      const s = stp(t), n = GRAIN[s % 4]; c.save(); c.globalAlpha = grainA; c.globalCompositeOperation = "overlay";
      const ox = Math.floor(hr(s, 21) * 256), oy = Math.floor(hr(s, 22) * 256);
      for (let x = -ox; x < W; x += 256) for (let y = -oy; y < H; y += 256) c.drawImage(n, x, y);
      c.restore();
    }
  }

  // ---- text, shapes
  function txt(c, s, x, y, size, o = {}) {
    const sc = o.sc ?? 1; if (sc <= 0 || (o.alpha ?? 1) <= 0) return;
    c.save(); c.translate(x, y); c.rotate((o.rot || 0) * DEG); c.scale(sc, sc); c.globalAlpha *= o.alpha ?? 1;
    c.font = FONT(size); c.textAlign = o.align || "center"; c.textBaseline = "middle"; c.lineJoin = "round"; c.miterLimit = 2;
    c.shadowColor = "rgba(0,0,0,0.45)"; c.shadowBlur = 0; c.shadowOffsetX = size * 0.05; c.shadowOffsetY = size * 0.07;
    c.strokeStyle = INK; c.lineWidth = size * (o.lw ?? 0.2); c.strokeText(s, 0, 0);
    c.shadowColor = "transparent"; c.fillStyle = o.fill || WH; c.fillText(s, 0, 0);
    c.restore();
  }
  /* pop-in value: scale with overshoot, plus a slam variant that lands from big */
  const pop = (t, t0, d = 0.22) => { const p = (t - t0) / d; return p < 0 ? 0 : 0.4 + 0.6 * eob(p); };
  const slam = (t, t0, d = 0.16) => { const p = (t - t0) / d; return p < 0 ? 0 : p >= 1 ? 1 : lerp(2.6, 1, eo3(p)); };
  const slamA = (t, t0) => (t < t0 ? 0 : cl((t - t0) / 0.05));
  /* a title line that changes: shows the last phrase whose start time has passed */
  function seq(c, t, list, y, size, o = {}) {
    let cur = null; for (const p of list) if (t >= p.t) cur = p; if (!cur) return;
    const f = cur.slam ? slam(t, cur.t) : pop(t, cur.t), a = cur.slam ? slamA(t, cur.t) : 1;
    txt(c, cur.s, cur.x ?? W / 2, cur.y ?? y, cur.size ?? size, { fill: cur.fill || WH, sc: f, alpha: a, rot: cur.rot ?? o.rot ?? 0 });
  }
  /* thick black arrow with a coloured fill, drawn on along its length */
  function arrow(c, x1, y1, x2, y2, prog, o = {}) {
    if (prog <= 0) return; const w = o.w || 34, p = cl(prog), len = Math.hypot(x2 - x1, y2 - y1), ang = Math.atan2(y2 - y1, x2 - x1), head = Math.min(len * p, w * 3.4);
    const L = len * p; c.save(); c.translate(x1, y1); c.rotate(ang); c.lineJoin = "round";
    const path = () => { c.beginPath(); c.moveTo(0, -w / 2); c.lineTo(Math.max(0, L - head), -w / 2); c.lineTo(Math.max(0, L - head), -w * 1.15); c.lineTo(L, 0); c.lineTo(Math.max(0, L - head), w * 1.15); c.lineTo(Math.max(0, L - head), w / 2); c.lineTo(0, w / 2); c.closePath(); };
    path(); c.shadowColor = "rgba(0,0,0,0.4)"; c.shadowOffsetX = 5; c.shadowOffsetY = 7; c.fillStyle = o.fill || INK; c.fill();
    c.shadowColor = "transparent"; if (o.stroke) { c.strokeStyle = o.stroke; c.lineWidth = 8; c.stroke(); }
    c.restore();
  }
  function ring(c, x, y, r, prog, col = R) {
    if (prog <= 0) return; c.save(); c.lineCap = "round";
    for (const [w, st] of [[26, INK], [14, col]]) { c.strokeStyle = st; c.lineWidth = w; c.beginPath(); c.ellipse(x, y, r, r * 0.88, -0.3, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * cl(prog)); c.stroke(); }
    c.restore();
  }
  function dashArc(c, x1, y1, x2, y2, lift, prog, col = WH) {
    if (prog <= 0) return; const n = 36, cx = (x1 + x2) / 2, cy = Math.min(y1, y2) - lift; c.save(); c.lineCap = "round";
    for (let i = 0; i < n * cl(prog); i += 2) {
      const a = i / n, b = Math.min(i + 1, n * cl(prog)) / n, pt = (u) => [(1 - u) * (1 - u) * x1 + 2 * (1 - u) * u * cx + u * u * x2, (1 - u) * (1 - u) * y1 + 2 * (1 - u) * u * cy + u * u * y2];
      const p0 = pt(a), p1 = pt(b); for (const [w, st] of [[22, INK], [12, col]]) { c.strokeStyle = st; c.lineWidth = w; c.beginPath(); c.moveTo(p0[0], p0[1]); c.lineTo(p1[0], p1[1]); c.stroke(); }
    }
    c.restore();
  }
  function disc(c, x, y, r, s, label, col) {
    if (s <= 0) return; c.save(); c.translate(x, y); c.scale(s, s); c.shadowColor = "rgba(0,0,0,0.4)"; c.shadowOffsetX = 5; c.shadowOffsetY = 8;
    c.fillStyle = col; c.strokeStyle = INK; c.lineWidth = 10; c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.fill(); c.shadowColor = "transparent"; c.stroke(); c.restore();
    txt(c, label, x, y + 6, r * 1.25, { sc: s, fill: INK, lw: 0, });
  }
  function dust(c, t, t0, x, y) {
    const p = (t - t0) / 0.5; if (p < 0 || p > 1) return; c.save();
    for (let i = 0; i < 9; i++) { const dir = (i / 8 - 0.5) * 2, r = 26 + hr(i, 5) * 26, ox = dir * (90 + 230 * eo3(p)), oy = -Math.abs(dir) * 50 * eo3(p) - 12 * p; c.fillStyle = `rgba(235,222,196,${0.8 * (1 - p)})`; c.beginPath(); c.arc(x + ox, y + oy, r * (0.6 + p), 0, Math.PI * 2); c.fill(); }
    c.restore();
  }
  function stamp(c, label, x, y, size, sc, rot, fg, bg) {
    if (sc <= 0) return; c.save(); c.translate(x, y); c.rotate(rot * DEG); c.scale(sc, sc);
    c.font = FONT(size); const w = c.measureText(label).width + size * 0.7, h = size * 1.25;
    c.shadowColor = "rgba(0,0,0,0.5)"; c.shadowOffsetX = 10; c.shadowOffsetY = 14; c.fillStyle = bg; c.strokeStyle = INK; c.lineWidth = 12; c.beginPath(); c.rect(-w / 2, -h / 2, w, h); c.fill(); c.shadowColor = "transparent"; c.stroke();
    c.strokeStyle = fg; c.lineWidth = 5; c.strokeRect(-w / 2 + 14, -h / 2 + 14, w - 28, h - 28);
    c.fillStyle = fg; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(label, 0, size * 0.04); c.restore();
  }

  // ---- anchors on the pictures (normalised image coords); recalibrate when real Codex shots replace the stand-ins
  const ANCH = { s2: { tetsuHead: [0.34, 0.4] }, s3a: { fist: [0.42, 0.52], jaw: [0.655, 0.24] }, s6b: { brain: [0.5, 0.45] } };

  // ---- scenes: (c, tl) with tl = seconds since the scene start; may run a bit past the scene end while the next card slides in
  const SC = {};
  SC.hook = (c, tl) => {
    const HIT = 0.638;
    if (tl < HIT) {
      const [z, fx, fy] = kf(tl, [[0, 1.1, 0.5, 0.5], [HIT, 1.28, 0.62, 0.45]]);
      shot(c, "s1a_hook_wide", addCam({ z, fx, fy }, wob(tl, "a")));
      speedLines(c, tl, W / 2, H / 2, 0.22 * sm((tl - 0.2) / 0.4), 520);
    } else {
      const p = tl - HIT, [z, fx, fy] = kf(p, [[0, 1.5, 0.62, 0.45], [0.25, 1.12, 0.6, 0.45], [2, 1.2, 0.6, 0.45]]);
      shot(c, "s1b_hook_hit", addCam({ z, fx, fy }, wob(tl, "b"), shake(tl, HIT, 0.5, 34)));
      speedLines(c, tl, W * 0.6, H * 0.5, 0.9 * cl(1 - p / 0.5), 330);
      flash(c, tl, HIT, 0.2, 0.95);
    }
    seq(c, tl, [{ t: HIT, s: "ВЫРУБАЕТ", fill: Y, slam: true }], 180, 210);
    seq(c, tl, [{ t: 1.042, s: "НЕ СИЛА УДАРА", fill: R }], 350, 120);
  };
  SC.size = (c, tl) => {
    const [z, fx, fy] = kf(tl, [[0, 1.45, 0.72, 0.62], [1.0, 1.45, 0.72, 0.62], [1.45, 1.45, 0.3, 0.62], [2.0, 1.45, 0.3, 0.62], [2.6, 1.1, 0.5, 0.5], [3.4, 1.16, 0.5, 0.5]]);
    const map = shot(c, "s2_size", addCam({ z, fx, fy }, wob(tl, "s2"), shake(tl, 0.773, 0.35, 16)));
    const [hx, hy] = map(...ANCH.s2.tetsuHead);
    arrow(c, hx + 330, hy - 170, hx + 60, hy - 30, eo3((tl - 2.0) / 0.3), { fill: INK, w: 30 });
    seq(c, tl, [{ t: 0.1, s: "ДВА МЕТРА", fill: Y }, { t: 0.773, s: "ТЯЖЕЛОВЕС", fill: WH, slam: true }, { t: 1.446, s: "ПРОТИВ ПАРНЯ", fill: WH }, { t: 2.11, s: "НА ГОЛОВУ НИЖЕ", fill: R, slam: true }], 170, 170);
  };
  SC.punch = (c, tl) => {
    const HIT = 0.783, DROP = 1.744;
    const [z, fx, fy] = kf(tl, [[0, 1.1, 0.5, 0.5], [HIT, 1.5, 0.56, 0.34], [3.4, 1.6, 0.58, 0.34]]);
    const cam = addCam({ z, fx, fy }, wob(tl, "s3a"), shake(tl, HIT, 0.5, 34));
    const map = shot(c, "s3a_punch", cam), jaw = map(...ANCH.s3a.jaw), fist = map(...ANCH.s3a.fist);
    dashArc(c, fist[0], fist[1], jaw[0], jaw[1], 140, (tl - 0.427) / 0.35);
    ring(c, jaw[0], jaw[1], 130, (tl - HIT) / 0.3);
    speedLines(c, tl, jaw[0], jaw[1], 0.8 * cl(1 - (tl - HIT) / 0.45), 300);
    flash(c, tl, HIT, 0.2, 0.9);
    if (tl >= DROP) {
      const p = (tl - DROP) / 0.5, y = -H * (1 - bounce(p)), r = lerp(-5, 0, eo3(p / 1.2)) + (p > 1 ? 0 : 0);
      c.save(); c.shadowColor = "rgba(0,0,0,0.55)"; c.shadowBlur = 50; c.shadowOffsetY = 20; c.translate(W / 2, H / 2 + y); c.rotate(r * DEG); c.translate(-W / 2, -H / 2);
      c.beginPath(); c.rect(0, 0, W, H); c.clip(); shot(c, "s3b_sag", addCam({ z: 1.1 + 0.05 * sm((tl - DROP) / 2), fx: 0.5, fy: 0.5 }, wob(tl, "s3b"), shake(tl, DROP + 0.45, 0.35, 22))); c.restore();
      dust(c, tl, DROP + 0.45, W / 2, H * 0.82);
    }
    seq(c, tl, [{ t: 0.1, s: "1 БОКОВОЙ", fill: Y }, { t: 0.735, s: "В ПОДБОРОДОК", fill: WH, slam: true }, { t: DROP, s: "ОСЕДАЕТ", fill: R, slam: true }], 170, 170);
  };
  SC.myth = (c, tl) => {
    const NO = 2.502, g = tl >= NO ? sm((tl - NO) / 0.25) : 0, [z, fx, fy] = kf(tl, [[0, 1.1, 0.6, 0.5], [2.4, 1.3, 0.7, 0.45], [4.4, 1.34, 0.7, 0.45]]);
    shot(c, "s4_myth", addCam({ z, fx, fy }, wob(tl, "s4"), shake(tl, NO, 0.45, 30)), { filter: g ? `grayscale(${g}) contrast(${1 + 0.15 * g})` : "" });
    seq(c, tl, [{ t: 0.1, s: "СИЛЬНЕЕ БЬЁШЬ", fill: WH }], 150, 150);
    seq(c, tl, [{ t: 1.023, s: "БЫСТРЕЕ ВЫРУБИШЬ?", fill: Y }], 320, 150);
    arrow(c, 250, 760, 250, 520, eo3((tl - 0.571) / 0.4), { fill: INK, w: 46, stroke: WH });
    if (tl >= NO) {
      const p = (tl - NO + 0.2) / 0.3;
      c.save(); c.lineCap = "round"; for (const [w, st] of [[34, INK], [20, R]]) { c.strokeStyle = st; c.lineWidth = w; c.beginPath(); c.moveTo(160, 330); c.lineTo(160 + 1600 * eo3((tl - NO - 0.25) / 0.2), 330 + 0); c.stroke(); } c.restore();
      stamp(c, "МИФ", W / 2, H * 0.62, 330, slam(tl, NO, 0.18), -7, WH, R);
      flash(c, tl, NO, 0.15, 0.7);
    }
  };
  SC.doc = (c, tl) => {
    const [z, fx, fy] = kf(tl, [[0, 1.12, 0.35, 0.5], [4.4, 1.3, 0.38, 0.45]]), s = stp(tl);
    shot(c, "s5_doc", addCam({ z, fx, fy }, wob(tl, "s5")), { filter: "sepia(0.85) contrast(1.08) brightness(1.05)" });
    c.fillStyle = `rgba(255,236,190,${0.05 + (hr(s, 31) - 0.5) * 0.06})`; c.fillRect(0, 0, W, H);
    seq(c, tl, [{ t: 0.1, s: "ЭКСПЕРИМЕНТ", fill: WH, x: 1380, y: 180 }, { t: 1.542, s: "ПОКАЗАЛ:", fill: WH, x: 1380, y: 180 }], 180, 120);
    // number plaque: four reels that lock on 1-9-7-2
    const lock = [0.55, 0.75, 1.0, 1.3], goal = [1, 9, 7, 2], pw = 190, x0 = 1380 - 2 * pw - 12, k = pop(tl, 0.1, 0.3);
    c.save(); c.translate(1380, 440); c.scale(k, k); c.translate(-1380, -440);
    c.fillStyle = "#e9dfc8"; c.strokeStyle = INK; c.lineWidth = 12; c.shadowColor = "rgba(0,0,0,0.45)"; c.shadowOffsetX = 8; c.shadowOffsetY = 12; c.beginPath(); c.rect(x0 - 24, 300, pw * 4 + 12 * 3 + 48, 280); c.fill(); c.shadowColor = "transparent"; c.stroke(); c.restore();
    for (let i = 0; i < 4; i++) {
      const done = tl >= lock[i], d = done ? goal[i] : Math.floor(hr(s, i, 41) * 10), b = done ? 1 + 0.1 * Math.max(0, 1 - (tl - lock[i]) / 0.2) : 1, cx = x0 + pw / 2 + i * (pw + 12);
      if (k > 0.99) { c.fillStyle = done ? WH : "#cfc6b0"; c.strokeStyle = INK; c.lineWidth = 8; c.fillRect(cx - pw / 2, 320, pw, 240); c.strokeRect(cx - pw / 2, 320, pw, 240); txt(c, String(d), cx, 448, 210 * b, { fill: INK, lw: 0 }); }
    }
    if (tl >= 2.148) txt(c, "?", 1700, 700, 320, { fill: R, sc: slam(tl, 2.148, 0.2), alpha: slamA(tl, 2.148), rot: 8 });
    if (tl >= 2.475) { txt(c, "РЕШАЕТ ДРУГОЕ", 1380, 880, 100, { fill: Y, sc: slam(tl, 2.475), alpha: slamA(tl, 2.475) }); flash(c, tl, 2.475, 0.15, 0.5); }
  };
  SC.three = (c, tl) => {
    const CUT = 2.137;
    if (tl < CUT + 0.05) {
      const [z, fx, fy] = kf(tl, [[0, 1.1, 0.5, 0.5], [1.9, 1.3, 0.5, 0.55], [CUT, 2.4, 0.5, 0.55]]);
      shot(c, "s6a_three", addCam({ z, fx, fy }, wob(tl, "s6a")));
      [[0.5, "1"], [0.9, "2"], [1.3, "3"]].forEach(([t0, l], i) => disc(c, 1250 + i * 190, 400, 78, pop(tl, t0, 0.2), l, i === 2 ? R : Y));
      seq(c, tl, [{ t: 0.1, s: "3 ПРИЧИНЫ", fill: Y }, { t: 1.665, s: "И ОТВЕТ...", fill: WH }], 170, 170);
    }
    if (tl >= CUT) {
      const p = tl - CUT, beat = Math.pow(Math.max(0, Math.sin((p / (60 / 90)) * Math.PI * 2 - 0.5)), 3), [z] = kf(p, [[0, 1.9], [0.3, 1.12]]);
      shot(c, "s6b_brain", addCam({ z: z * (1 + 0.03 * beat), fx: 0.5, fy: 0.5 }, wob(tl, "s6b"), shake(tl, 3.069, 0.4, 26)));
      flash(c, tl, CUT, 0.22, 0.9);
      seq(c, tl, [{ t: CUT, s: "ПОЧЕМУ УПАЛ", fill: WH }, { t: 3.069, s: "БОЛЬШОЙ?", fill: R, slam: true, size: 250 }], 170, 170);
      if (tl >= 3.069) flash(c, tl, 3.069, 0.15, 0.5);
    }
  };
  const ORDER = ["hook", "size", "punch", "myth", "doc", "three"];
  const GRAIN_A = { hook: 0.08, size: 0.08, punch: 0.08, myth: 0.08, doc: 0.3, three: 0.08 };

  // card slide that brings scene i in (directions vary so the cuts do not feel the same)
  const TR = [null, { dx: 1, dy: 0, rot: 4 }, { dx: -1, dy: 0, rot: -4 }, { dx: 0, dy: 1, rot: 3 }, { dx: 1, dy: 0, rot: -3 }, { dx: 0, dy: -1, rot: 4 }];
  const LEAD = 0.16, TRD = 0.42;

  function subtitles(c, sc, tl) {
    const ws = sc.words; if (!ws.length) return; let first = 0;
    for (let i = 0; i < ws.length; i += 4) if (ws[i].t <= tl + 1e-6) first = i;
    const chunk = ws.slice(first, first + 4), cur = [...chunk].reverse().find((w) => w.t <= tl + 1e-6);
    c.font = FONT(66); const txts = chunk.map((w) => w.w.replace(/[.,!?—-]+$/g, "").toUpperCase()), widths = txts.map((s) => c.measureText(s).width), gap = 38, tot = widths.reduce((a, b) => a + b, 0) + gap * (chunk.length - 1);
    let x = W / 2 - tot / 2;
    chunk.forEach((w, i) => { const on = w === cur, sc2 = on ? 1.12 : 1; txt(c, txts[i], x + widths[i] / 2, 985, 66, { fill: on ? Y : WH, sc: sc2, lw: 0.16 }); x += widths[i] + gap; });
  }

  function render(t) {
    const c = window.FRAMES_CTX; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = "source-over"; c.filter = "none"; c.shadowColor = "transparent";
    let i = SP.scenes.findIndex((s) => t < s.start + s.dur); if (i < 0) i = SP.scenes.length - 1;
    const S = SP.scenes;
    // the next scene's card starts to slide in LEAD seconds before the cut
    const nx = S[i + 1], inCard = nx && t >= nx.start - LEAD;
    let cur = i;
    c.fillStyle = INK; c.fillRect(0, 0, W, H);
    SC[ORDER[i]](c, t - S[i].start);
    if (inCard) {
      const j = i + 1, p = (t - (nx.start - LEAD)) / TRD, e = eo3(p), tr = TR[j];
      c.save(); c.shadowColor = "rgba(0,0,0,0.6)"; c.shadowBlur = 60; c.shadowOffsetX = -tr.dx * 20; c.shadowOffsetY = -tr.dy * 20;
      c.translate(W / 2 + tr.dx * W * (1 - e), H / 2 + tr.dy * H * (1 - e)); c.rotate(tr.rot * DEG * (1 - e)); c.translate(-W / 2, -H / 2);
      c.beginPath(); c.rect(0, 0, W, H); c.clip(); SC[ORDER[j]](c, Math.max(0, t - nx.start)); c.restore();
      cur = j;
    }
    // tighten the grade per scene (archive grain on the doc scene), then the subtitles
    overlays(c, t, GRAIN_A[ORDER[cur]]);
    subtitles(c, S[i], Math.max(0, t - S[i].start));
  }

  window.FRAMES = { load, render, SC, hr };
})();
