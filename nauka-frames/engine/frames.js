/* Whole-picture player for the Nauka Boya hook, paper-collage look.
   Each scene is one or two finished paper-collage pictures (assets/shots/*.png, 1536x1024) moved as a whole (camera push/pan, shake,
   torn-paper card slides, drops); everything added by code is cut paper too: strips and cut-out letters, arrows, rings, stamps, scraps.
   Motion steps at 12 fps (stop-motion), the step phase is set per scene so the hit word lands on a step.
   render(t) is a pure function of time; noise is seeded hashes, no Math.random/Date.now. */
(function () {
  const P = window.PAPER, { PAL, put, strip, letters, polySheet, sheet, ellipseSheet, ringSheet, arrowPts, memo, tearPoly, trace, grainPattern, FONT } = P;
  const W = 1920, H = 1080, DEG = Math.PI / 180, STEP = 12;
  const SP = window.SPEC, IMG = {};
  const Y = "Y", R = "R", WH = "W", INK_ = "I";

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
  /* cam {z, fx, fy (focus in image 0..1), dx, dy, rot(deg)}; returns map(nx, ny) -> screen px for anchoring cut-outs */
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
  function flash(c, t, t0, dur, a = 1) { const p = (t - t0) / dur; if (p < 0 || p > 1) return; c.fillStyle = `rgba(255,248,232,${a * Math.pow(1 - p, 1.6)})`; c.fillRect(0, 0, W, H); }
  /* cut-paper rays out of the impact point */
  function speedLines(c, t, cx, cy, a, rIn = 380) {
    if (a <= 0) return; const s = stp(t); c.save(); c.translate(cx, cy); c.shadowColor = `rgba(34,22,8,${0.35 * a})`; c.shadowBlur = 6; c.shadowOffsetY = 4;
    for (let i = 0; i < 40; i++) {
      const ang = (i / 40) * Math.PI * 2 + (hr(s, i, 1) - 0.5) * 0.09, w = 0.01 + hr(s, i, 2) * 0.026, r0 = rIn + hr(s, i, 3) * 220, r1 = 1500;
      c.fillStyle = i % 3 ? `rgba(246,241,228,${a * 0.9})` : `rgba(201,160,107,${a * 0.85})`;
      c.beginPath(); c.moveTo(Math.cos(ang - w) * r1, Math.sin(ang - w) * r1); c.lineTo(Math.cos(ang) * r0, Math.sin(ang) * r0); c.lineTo(Math.cos(ang + w) * r1, Math.sin(ang + w) * r1); c.closePath(); c.fill();
    }
    c.restore();
  }
  let VIG = null;
  /* warm vignette + paper fibre grain over the whole frame; the grain jumps every step like a re-shot sheet */
  function overlays(c, t, grainA) {
    if (!VIG) {
      VIG = document.createElement("canvas"); VIG.width = W; VIG.height = H; const g = VIG.getContext("2d");
      const gr = g.createRadialGradient(W / 2, H / 2, H * 0.5, W / 2, H / 2, H * 1.05); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(40,22,6,0.42)"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    }
    c.drawImage(VIG, 0, 0);
    const s = stp(t), pat = grainPattern(c); c.save(); c.globalAlpha = grainA; c.translate(Math.floor(hr(s, 21) * 256), Math.floor(hr(s, 22) * 256)); c.fillStyle = pat; c.fillRect(-256, -256, W + 512, H + 512); c.restore();
  }

  // ---- cut-paper text and shapes
  const COL = { Y: { bg: PAL.mustard, fg: PAL.ink }, R: { bg: PAL.red, fg: PAL.cream }, W: { bg: PAL.cream, fg: PAL.ink } };
  /* words go on torn strips; slammed words are ransom-note cut-out letters */
  function txt(c, s, x, y, size, o = {}) {
    const sc = o.sc ?? 1; if (sc <= 0 || (o.alpha ?? 1) <= 0) return;
    const k = COL[o.fill || WH], seed = hs(s) & 0xffff;
    const sp = o.cut ? letters(s, size, o.fill === Y ? { cols: [PAL.mustard, PAL.cream, PAL.mustardD] } : o.fill === R ? { fixed: PAL.red } : {}) : strip(s, size, { bg: k.bg, fg: k.fg, seed });
    put(c, sp, x, y, { rot: (o.rot || 0) * DEG, sx: sc, depth: o.depth ?? 1.6, alpha: o.alpha ?? 1 });
  }
  /* pop-in value: scale with overshoot, plus a slam variant that lands from big */
  const pop = (t, t0, d = 0.22) => { const p = (t - t0) / d; return p < 0 ? 0 : 0.4 + 0.6 * eob(p); };
  const slam = (t, t0, d = 0.16) => { const p = (t - t0) / d; return p < 0 ? 0 : p >= 1 ? 1 : lerp(2.6, 1, eo3(p)); };
  const slamA = (t, t0) => (t < t0 ? 0 : cl((t - t0) / 0.05));
  /* a title line that changes: shows the last phrase whose start time has passed */
  function seq(c, t, list, y, size, o = {}) {
    let cur = null; for (const p of list) if (t >= p.t) cur = p; if (!cur) return;
    const f = cur.slam ? slam(t, cur.t) : pop(t, cur.t), a = cur.slam ? slamA(t, cur.t) : 1;
    txt(c, cur.s, cur.x ?? W / 2, cur.y ?? y, cur.size ?? size, { fill: cur.fill || WH, sc: f, alpha: a, rot: cur.rot ?? o.rot ?? 0, cut: cur.slam });
  }
  /* black-paper arrow, revealed along its length */
  function arrow(c, x1, y1, x2, y2, prog, o = {}) {
    if (prog <= 0) return; const len = Math.round(Math.hypot(x2 - x1, y2 - y1)), w = o.w || 34, ang = Math.atan2(y2 - y1, x2 - x1);
    const sp = memo(`arrow|${len}|${w}|${o.fill}`, () => polySheet(arrowPts(len, w, w * 2.3, w * 2.4), o.fill === Y ? PAL.mustard : PAL.ink, len + w, { amp: 2.5, inset: 3 }));
    c.save(); c.translate(x1, y1); c.rotate(ang); c.beginPath(); c.rect(-40, -300, 40 + len * cl(prog) + 4, 600); c.clip();
    put(c, sp, 0, 0, { ax: 0, ay: 0.5, depth: 1.2 }); c.restore();
  }
  /* red paper ring, swept on like a hand-placed loop */
  function ring(c, x, y, r, prog) {
    if (prog <= 0) return; const sp = memo(`ring|${r}`, () => ringSheet(r, 24, PAL.red, r));
    c.save(); c.translate(x, y); c.rotate(-0.3); c.scale(1, 0.88); c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, r * 2, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * cl(prog) + 0.001); c.closePath(); c.clip();
    put(c, sp, 0, 0, { depth: 1.2 }); c.restore();
  }
  /* trail of cut-paper dashes along an arc */
  function dashArc(c, x1, y1, x2, y2, lift, prog) {
    if (prog <= 0) return; const n = 30, cx = (x1 + x2) / 2, cy = Math.min(y1, y2) - lift, dash = memo("dash", () => sheet(40, 18, PAL.cream, 5, { amp: 2, inset: 2 }));
    const pt = (u) => [(1 - u) * (1 - u) * x1 + 2 * (1 - u) * u * cx + u * u * x2, (1 - u) * (1 - u) * y1 + 2 * (1 - u) * u * cy + u * u * y2];
    for (let i = 0; i < n * cl(prog); i += 2) { const u = i / n, p0 = pt(u), p1 = pt(Math.min(1, u + 0.04)); put(c, dash, p0[0], p0[1], { rot: Math.atan2(p1[1] - p0[1], p1[0] - p0[0]), depth: 0.8 }); }
  }
  function disc(c, x, y, r, s, label, col) {
    if (s <= 0) return; const sp = memo(`disc|${r}|${label}|${col}`, () => ellipseSheet(r, r, col === R ? PAL.red : PAL.mustard, hs(label), { detail: (g, b) => { g.font = FONT(r * 1.3); g.textAlign = "center"; g.fillStyle = col === R ? PAL.cream : PAL.ink; g.fillText(label, b.x + b.w / 2, b.y + b.h * 0.72); } }));
    put(c, sp, x, y, { sx: s, rot: (hr(hs(label), 4) - 0.5) * 0.2, depth: 1.5 });
  }
  /* paper scraps that fly out of a landing */
  function dust(c, t, t0, x, y) {
    const p = (t - t0) / 0.7; if (p < 0 || p > 1) return; const cols = [PAL.kraft, PAL.mustard, PAL.cream, PAL.blue, PAL.red];
    for (let i = 0; i < 12; i++) {
      const sp = memo(`scrap|${i}`, () => sheet(18 + hr(i, 1) * 22, 14 + hr(i, 2) * 18, cols[i % 5], i, { amp: 2, inset: 2 })), dir = (hr(i, 3) - 0.5) * 2, up = 160 + hr(i, 4) * 220;
      put(c, sp, x + dir * (120 + 340 * eo3(p)), y - up * Math.sin(p * Math.PI * 0.85) + 260 * p * p, { rot: dir * 5 * p + i, alpha: 1 - sm((p - 0.6) / 0.4), depth: 0.8 });
    }
  }
  function stamp(c, label, x, y, size, sc, rot) {
    if (sc <= 0) return; put(c, strip(label, size, { bg: PAL.red, fg: PAL.cream, seed: 77 }), x, y, { sx: sc, rot: rot * DEG, depth: 2.4 });
  }

  // ---- anchors measured on the generated 1536x1024 paper pictures
  const ANCH = { s2: { tetsuHead: [0.347, 0.255] }, s3a: { fist: [0.662, 0.301], jaw: [0.713, 0.302] }, s6b: { brain: [0.57, 0.45] } };

  // torn paper card: white fibre rim + picture clipped to a slightly smaller torn outline
  const rect = (m) => [[-m, -m], [W + m, -m], [W + m, H + m], [-m, H + m]];
  const cardOutlines = (j) => memo("card" + j, () => ({ outer: tearPoly(rect(22), j * 7 + 3, 9, 16), inner: tearPoly(rect(6), j * 7 + 9, 7, 16) }));
  function cardPath(c, j) { const o = cardOutlines(j); trace(c, o.outer); c.fillStyle = PAL.white; c.fill(); trace(c, o.inner); c.clip(); }

  // ---- scenes: (c, tl) with tl = seconds since the scene start (stepped); may run a bit past the scene end while the next card slides in
  const SC = {};
  SC.hook = (c, tl) => {
    const HIT = 0.638;
    if (tl < HIT) {
      const [z, fx, fy] = kf(tl, [[0, 1.1, 0.5, 0.55], [HIT, 1.28, 0.62, 0.45]]);
      shot(c, "s1a_hook_wide", addCam({ z, fx, fy }, wob(tl, "a")));
      speedLines(c, tl, W / 2, H / 2, 0.22 * sm((tl - 0.2) / 0.4), 520);
    } else {
      const p = tl - HIT, [z, fx, fy] = kf(p, [[0, 1.5, 0.62, 0.45], [0.25, 1.12, 0.6, 0.45], [2, 1.2, 0.6, 0.45]]);
      shot(c, "s1b_hook_hit", addCam({ z, fx, fy }, wob(tl, "b"), shake(tl, HIT, 0.5, 34)));
      speedLines(c, tl, W * 0.6, H * 0.5, 0.9 * cl(1 - p / 0.5), 330);
      flash(c, tl, HIT, 0.2, 0.9);
    }
    seq(c, tl, [{ t: HIT, s: "ВЫРУБАЕТ", fill: Y, slam: true }], 105, 140);
    seq(c, tl, [{ t: 1.042, s: "НЕ СИЛА УДАРА", fill: R }], 255, 82);
  };
  SC.size = (c, tl) => {
    const [z, fx, fy] = kf(tl, [[0, 1.45, 0.65, 0.3], [1.0, 1.45, 0.65, 0.3], [1.45, 1.45, 0.345, 0.3], [2.0, 1.45, 0.345, 0.3], [2.6, 1.1, 0.5, 0.38], [3.4, 1.16, 0.5, 0.38]]);
    const map = shot(c, "s2_size", addCam({ z, fx, fy }, wob(tl, "s2"), shake(tl, 0.773, 0.35, 16)));
    const [hx, hy] = map(...ANCH.s2.tetsuHead);
    arrow(c, hx + 330, hy - 170, hx + 60, hy - 30, eo3((tl - 2.0) / 0.3), { fill: INK_ });
    seq(c, tl, [{ t: 0.1, s: "ДВА МЕТРА", fill: Y }, { t: 0.773, s: "ТЯЖЕЛОВЕС", fill: WH, slam: true }, { t: 1.446, s: "ПРОТИВ ПАРНЯ", fill: WH }, { t: 2.11, s: "НА ГОЛОВУ НИЖЕ", fill: R, slam: true }], 75, 96);
  };
  SC.punch = (c, tl) => {
    const HIT = 0.783, DROP = 1.744;
    const [z, fx, fy] = kf(tl, [[0, 1.1, 0.5, 0.5], [HIT, 1.5, 0.56, 0.34], [3.4, 1.6, 0.58, 0.34]]);
    const cam = addCam({ z, fx, fy }, wob(tl, "s3a"), shake(tl, HIT, 0.5, 34));
    const map = shot(c, "s3a_punch", cam), jaw = map(...ANCH.s3a.jaw), fist = map(...ANCH.s3a.fist);
    dashArc(c, fist[0], fist[1], jaw[0], jaw[1], 140, (tl - 0.427) / 0.35);
    ring(c, jaw[0], jaw[1], 130, (tl - HIT) / 0.3);
    speedLines(c, tl, jaw[0], jaw[1], 0.8 * cl(1 - (tl - HIT) / 0.45), 300);
    flash(c, tl, HIT, 0.2, 0.85);
    if (tl >= DROP) {
      const p = (tl - DROP) / 0.5, y = -H * (1 - bounce(p)), r = lerp(-5, 0, eo3(p / 1.2));
      c.save(); c.shadowColor = "rgba(34,22,8,0.55)"; c.shadowBlur = 50; c.shadowOffsetY = 20; c.translate(W / 2, H / 2 + y); c.rotate(r * DEG); c.translate(-W / 2, -H / 2);
      cardPath(c, 5); shot(c, "s3b_sag", addCam({ z: 1.1 + 0.05 * sm((tl - DROP) / 2), fx: 0.5, fy: 0.5 }, wob(tl, "s3b"), shake(tl, DROP + 0.45, 0.35, 22))); c.restore();
      dust(c, tl, DROP + 0.45, W / 2, H * 0.82);
    }
    seq(c, tl, [{ t: 0.1, s: "1 БОКОВОЙ", fill: Y }, { t: 0.735, s: "В ПОДБОРОДОК", fill: WH, slam: true }, { t: DROP, s: "ОСЕДАЕТ", fill: R, slam: true }], 110, 110);
  };
  SC.myth = (c, tl) => {
    const NO = 2.502, g = tl >= NO ? sm((tl - NO) / 0.25) : 0, [z, fx, fy] = kf(tl, [[0, 1.1, 0.6, 0.3], [2.4, 1.3, 0.7, 0.3], [4.4, 1.34, 0.7, 0.3]]);
    shot(c, "s4_myth", addCam({ z, fx, fy }, wob(tl, "s4"), shake(tl, NO, 0.45, 30)), { filter: g ? `grayscale(${g * 0.85}) contrast(${1 + 0.1 * g})` : "" });
    seq(c, tl, [{ t: 0.1, s: "СИЛЬНЕЕ БЬЁШЬ", fill: WH }], 80, 100);
    seq(c, tl, [{ t: 1.023, s: "БЫСТРЕЕ ВЫРУБИШЬ?", fill: Y }], 210, 100);
    arrow(c, 250, 760, 250, 520, eo3((tl - 0.571) / 0.4), { fill: INK_, w: 46 });
    if (tl >= NO) {
      const sp = memo("strike", () => sheet(1300, 26, PAL.red, 9, { amp: 3, inset: 3 }));
      c.save(); c.beginPath(); c.rect(0, 0, 310 + 1300 * eo3((tl - NO - 0.25) / 0.2), H); c.clip(); put(c, sp, 960, 215, { rot: -0.01, depth: 1.2 }); c.restore();
      stamp(c, "МИФ", W / 2, H * 0.62, 330, slam(tl, NO, 0.18), -7);
      flash(c, tl, NO, 0.15, 0.6);
    }
  };
  SC.doc = (c, tl) => {
    const [z, fx, fy] = kf(tl, [[0, 1.12, 0.35, 0.3], [4.4, 1.3, 0.38, 0.3]]), s = stp(tl);
    shot(c, "s5_doc", addCam({ z, fx, fy }, wob(tl, "s5")), { filter: "sepia(0.7) contrast(1.05) brightness(1.04)" });
    c.fillStyle = `rgba(255,236,190,${0.04 + (hr(s, 31) - 0.5) * 0.05})`; c.fillRect(0, 0, W, H);
    seq(c, tl, [{ t: 0.1, s: "ЭКСПЕРИМЕНТ", fill: WH, x: 1380, y: 180 }, { t: 1.542, s: "ПОКАЗАЛ:", fill: WH, x: 1380, y: 180 }], 180, 100);
    // paper board with four number tiles that lock on 1-9-7-2
    const lock = [0.55, 0.75, 1.0, 1.3], goal = [1, 9, 7, 2], pw = 190, k = pop(tl, 0.1, 0.3), x0 = 1380 - 2 * pw - 18;
    put(c, memo("board", () => sheet(pw * 4 + 90, 300, PAL.kraft, 12, { amp: 5 })), 1380, 440, { sx: k, depth: 2 });
    if (k > 0.99) for (let i = 0; i < 4; i++) {
      const done = tl >= lock[i], d = done ? goal[i] : Math.floor(hr(s, i, 41) * 10), b = done ? 1 + 0.1 * Math.max(0, 1 - (tl - lock[i]) / 0.2) : 1;
      put(c, memo(`tile|${d}|${done}`, () => sheet(pw - 10, 240, done ? PAL.cream : PAL.grayL, d * 3 + (done ? 1 : 0), { amp: 3, detail: (g, bx) => { g.font = FONT(210); g.textAlign = "center"; g.fillStyle = PAL.ink; g.fillText(String(d), bx.x + bx.w / 2, bx.y + bx.h * 0.82); } })), x0 + pw / 2 + i * (pw + 12), 440, { sx: b, depth: 1.2 });
    }
    if (tl >= 2.148) txt(c, "?", 1700, 700, 300, { fill: R, sc: slam(tl, 2.148, 0.2), alpha: slamA(tl, 2.148), rot: 8, cut: true });
    if (tl >= 2.475) { txt(c, "РЕШАЕТ ДРУГОЕ", 1380, 880, 90, { fill: Y, sc: slam(tl, 2.475), alpha: slamA(tl, 2.475) }); flash(c, tl, 2.475, 0.15, 0.45); }
  };
  SC.three = (c, tl) => {
    const CUT = 2.137;
    if (tl < CUT + 0.05) {
      const [z, fx, fy] = kf(tl, [[0, 1.1, 0.5, 0.34], [1.9, 1.3, 0.52, 0.34], [CUT, 2.4, 0.62, 0.47]]);
      shot(c, "s6a_three", addCam({ z, fx, fy }, wob(tl, "s6a")));
      [[0.5, "1"], [0.9, "2"], [1.3, "3"]].forEach(([t0, l], i) => disc(c, 1250 + i * 190, 400, 78, pop(tl, t0, 0.2), l, i === 2 ? R : Y));
      seq(c, tl, [{ t: 0.1, s: "3 ПРИЧИНЫ", fill: Y }, { t: 1.665, s: "И ОТВЕТ...", fill: WH }], 95, 110);
    }
    if (tl >= CUT) {
      const p = tl - CUT, beat = Math.pow(Math.max(0, Math.sin((p / (60 / 90)) * Math.PI * 2 - 0.5)), 3), [z] = kf(p, [[0, 1.9], [0.3, 1.12]]);
      shot(c, "s6b_brain", addCam({ z: z * (1 + 0.03 * beat), fx: 0.5, fy: 0.5 }, wob(tl, "s6b"), shake(tl, 3.069, 0.4, 26)));
      flash(c, tl, CUT, 0.22, 0.85);
      seq(c, tl, [{ t: CUT, s: "ПОЧЕМУ УПАЛ", fill: WH }, { t: 3.069, s: "БОЛЬШОЙ?", fill: R, slam: true, size: 130 }], 110, 110);
      if (tl >= 3.069) flash(c, tl, 3.069, 0.15, 0.45);
    }
  };
  const ORDER = ["hook", "size", "punch", "myth", "doc", "three"];
  const GRAIN_A = { hook: 0.55, size: 0.55, punch: 0.55, myth: 0.55, doc: 0.9, three: 0.55 };
  const HITS = { hook: 0.638, size: 0.773, punch: 0.783, myth: 2.502, doc: 2.475, three: 3.069 };
  /* stop-motion time: 12 steps per second, phase chosen so the scene's hit word lands exactly on a step */
  const qt = (tl, id) => { const ph = HITS[id] % (1 / STEP); return Math.floor((tl - ph) * STEP + 1e-6) / STEP + ph; };

  // card that brings scene i in (directions vary so the cuts do not feel the same)
  const TR = [null, { dx: 1, dy: 0, rot: 4 }, { dx: -1, dy: 0, rot: -4 }, { dx: 0, dy: 1, rot: 3 }, { dx: 1, dy: 0, rot: -3 }, { dx: 0, dy: -1, rot: 4 }];
  const LEAD = 0.16, TRD = 0.42;

  /* word-by-word subtitles: four words per card on cut strips, the current word on mustard */
  function subtitles(c, sc, tl) {
    const ws = sc.words; if (!ws.length) return; let first = 0;
    for (let i = 0; i < ws.length; i += 4) if (ws[i].t <= tl + 1e-6) first = i;
    const chunk = ws.slice(first, first + 4), cur = [...chunk].reverse().find((w) => w.t <= tl + 1e-6), gap = 14;
    const sps = chunk.map((w) => { const s = w.w.replace(/[.,!?—-]+$/g, "").toUpperCase(), on = w === cur; return strip(s, 50, { bg: on ? PAL.mustard : PAL.cream, fg: PAL.ink, seed: hs(s) & 0xfff }); });
    const tot = sps.reduce((a, s) => a + s.w, 0) + gap * (sps.length - 1); let x = W / 2 - tot / 2;
    chunk.forEach((w, i) => { const on = w === cur; put(c, sps[i], x + sps[i].w / 2, 985, { sx: on ? 1.1 : 1, rot: (hr(hs(w.w), 7) - 0.5) * 0.04, depth: 1.2 }); x += sps[i].w + gap; });
  }

  function render(t) {
    const c = window.FRAMES_CTX; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = "source-over"; c.filter = "none"; c.shadowColor = "transparent";
    const S = SP.scenes; let i = S.findIndex((s) => t < s.start + s.dur); if (i < 0) i = S.length - 1;
    const nx = S[i + 1], inCard = nx && t >= nx.start - LEAD;
    c.fillStyle = "#2a2522"; c.fillRect(0, 0, W, H);
    SC[ORDER[i]](c, qt(t - S[i].start, ORDER[i]));
    let cur = i;
    if (inCard) {
      const j = i + 1, tq = Math.floor(t * STEP + 1e-6) / STEP, p = (tq - (nx.start - LEAD)) / TRD, e = eo3(p), tr = TR[j];
      c.save(); c.shadowColor = "rgba(34,22,8,0.6)"; c.shadowBlur = 60; c.shadowOffsetX = -tr.dx * 20; c.shadowOffsetY = -tr.dy * 20;
      c.translate(W / 2 + tr.dx * W * (1 - e), H / 2 + tr.dy * H * (1 - e)); c.rotate(tr.rot * DEG * (1 - e)); c.translate(-W / 2, -H / 2);
      cardPath(c, j); SC[ORDER[j]](c, Math.max(0, qt(t - nx.start, ORDER[j]))); c.restore();
      cur = j;
    }
    overlays(c, t, GRAIN_A[ORDER[cur]]);
    subtitles(c, S[i], Math.max(0, t - S[i].start));
  }

  window.FRAMES = { load, render, SC, hr };
})();
