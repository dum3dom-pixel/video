/* Scene player for the paper-collage hook. render(t) is a pure function of time:
   scene time is quantised to 12 steps/s (stop-motion), every wobble comes from step-indexed hashes. */
(function () {
  const { W, H, PAL, clamp, lerp, pr, easeOut, easeIn, easeInOut, easeOutBack, DEG, hr, hs, memo, sheet, polySheet, ellipseSheet, ringSheet, burstPts, starPts, arrowPts, strip, letters, put } = PAPER;
  const { drawHero, anchor, lerpPose, pose: mkPose } = RIG;
  const SPEC = window.SPEC, STEPS = 12, GY = 928, TS = 0.84, GS = 1.0;
  let ST = 0, ZZ = 1; // current stop-motion step / zoom of the layer being drawn

  const wt = (sc, prefix, def) => { const w = (sc.words || []).find((x) => x.w.toLowerCase().replace(/[^а-яёa-z0-9]/g, "").startsWith(prefix)); return w ? w.t : def; };
  const jr = (key, amp) => (hr(ST, hs(key)) - 0.5) * 2 * amp; // per-step wobble
  const jrot = (key, deg = 1.4) => jr(key, deg * DEG);

  /* ---------- camera: layers move by cam*p, scale by 1+(z-1)*p ---------- */
  function lay(c, p, cam, fn, o = {}) {
    c.save();
    const zz = 1 + (cam.z - 1) * p;
    c.translate(W / 2 - cam.x * p + (o.boil === false ? 0 : jr("boil" + p, 0.9)), H / 2 - cam.y * p + (o.boil === false ? 0 : jr("boilY" + p, 0.9)));
    c.scale(zz, zz); c.translate(-W / 2, -H / 2);
    const old = ZZ; ZZ = zz; fn(); ZZ = old; c.restore();
  }
  const P = (c, sp, x, y, o = {}) => put(c, sp, x, y, { z: ZZ, ...o });

  /* ---------- sprites ---------- */
  const S_ = {
    wall: (col, seed) => memo(`wall|${col}|${seed}`, () => sheet(2300, 1340, col, seed, { rim: null, stains: 9, folds: 4, edges: "" })),
    disc: (r, col, seed) => memo(`disc|${r}|${col}`, () => ellipseSheet(r, r, col, seed, { amp: 7, rim: PAL.white, inset: 6, stains: 3 })),
    floor: (col, seed) => memo(`floor|${col}`, () => sheet(2300, 330, col, seed, { edges: "t", amp: 8, rim: PAL.white, inset: 5, stains: 12, folds: 2 })),
    apron: (col, seed) => memo(`apron|${col}`, () => sheet(2300, 260, col, seed, { edges: "t", amp: 5, rim: PAL.cream, inset: 4, stains: 4, folds: 6 })),
    rope: (col, len, th, seed) => memo(`rope|${col}|${len}|${th}`, () => sheet(len, th, col, seed, { amp: 2.5, inset: 2.5, seg: 22 })),
    post: (col, w, h, seed) => memo(`post|${col}|${w}|${h}`, () => sheet(w, h, col, seed, { amp: 3, inset: 3 })),
    scrap: (w, h, col, seed) => memo(`scrap|${w}|${h}|${col}|${seed}`, () => sheet(w, h, col, seed, { amp: 3, inset: 2 })),
    star: (r, col, seed) => memo(`star|${r}|${col}|${seed}`, () => polySheet(starPts(r, 5, 0.46), col, seed, { amp: 2, inset: 3 })),
    burst: (r, col, seed, rim) => memo(`burst|${r}|${col}|${seed}`, () => polySheet(burstPts(r * 0.62, r, 9, seed), col, seed, { amp: 3, inset: 3, rim: rim === undefined ? PAL.white : rim })),
    dash: (w, col, seed) => memo(`dash|${w}|${col}|${seed}`, () => sheet(w, 9, col, seed, { amp: 1.2, inset: 1, rim: PAL.white })),
    disc2: (r, col, seed) => memo(`d2|${r}|${col}`, () => ellipseSheet(r, r, col, seed, { amp: 3, rim: PAL.white, inset: 4 })),
  };

  /* ---------- sets (backgrounds from the grey plates: wall / ropes / floor / apron as torn layers) ---------- */
  function ringSet(c, cam, o) {
    const wall = S_.wall(o.wall, 11);
    lay(c, 0.12, cam, () => {
      P(c, wall, -150, -130, { ax: 0, ay: 0, shadow: false, depth: 0 });
      if (o.bricks) for (let r = 0; r < 7; r++) for (let k = 0; k < 9; k++) { const sp = S_.scrap(200, 80, r % 2 ? o.bricks : o.bricks2, 30 + r * 9 + k); P(c, sp, -80 + k * 238 + (r % 2) * 118, 40 + r * 100, { ax: 0, ay: 0, depth: 0.25, shadow: true, rot: (hr(r, k) - 0.5) * 0.03 }); }
    });
    lay(c, 0.2, cam, () => P(c, S_.disc(o.discR || 480, o.disc, 21), o.discX ?? 960, o.discY ?? 460, { depth: 0.8, shadow: true }));
    lay(c, 0.32, cam, () => {
      if (o.window) { const x = o.window; P(c, S_.scrap(210, 230, PAL.ink, 41), x, 260, { depth: 0.8 }); for (let i = 0; i < 4; i++) P(c, S_.scrap(84, 92, o.pane || PAL.cream, 50 + i), x - 49 + (i % 2) * 98, 214 + Math.floor(i / 2) * 106, { depth: 0.3, rot: (hr(i, 3) - 0.5) * 0.04 }); }
      if (o.bag) { const x = o.bag; P(c, S_.scrap(8, 220, PAL.ink, 61), x, 120, { depth: 0.3, shadow: false }); P(c, S_.scrap(150, 330, PAL.kraftD, 62), x, 380, { depth: 1.2, rot: 0.02 }); P(c, S_.scrap(150, 44, PAL.grayD, 63), x, 232, { depth: 0.6 }); P(c, S_.scrap(150, 22, PAL.ink, 64), x, 410, { depth: 0.2, shadow: false }); }
      if (o.ladder) { const x = o.ladder; [-46, 46].forEach((d, i) => P(c, S_.scrap(14, 330, PAL.kraftD, 70 + i), x + d, 380, { depth: 0.5 })); for (let i = 0; i < 6; i++) P(c, S_.scrap(104, 12, PAL.kraftD, 75 + i), x, 250 + i * 52, { depth: 0.4 }); }
      if (o.rack) { const x = o.rack; P(c, S_.scrap(260, 16, PAL.grayD, 80), x, 440, { depth: 0.8 }); P(c, S_.scrap(260, 16, PAL.grayD, 81), x, 520, { depth: 0.8 }); [-100, -50, 0, 50, 100].forEach((d, i) => { P(c, S_.disc2(i % 2 ? 22 : 28, PAL.gray, 82 + i), x + d, 410, { depth: 0.6 }); P(c, S_.disc2(i % 2 ? 22 : 28, PAL.grayL, 90 + i), x + d, 490, { depth: 0.6 }); }); P(c, S_.scrap(14, 220, PAL.grayD, 99), x - 120, 520, { depth: 0.5 }); P(c, S_.scrap(14, 220, PAL.grayD, 98), x + 120, 520, { depth: 0.5 }); }
    });
    lay(c, 0.55, cam, () => {
      const ys = o.ropeY || [500, 580, 664];
      ys.forEach((y, i) => { P(c, S_.rope(o.rope || PAL.cream, 2500, 24, 100 + i), 960, y, { depth: 1, rot: (i - 1) * 0.004 }); });
      [o.postL ?? 150, o.postR ?? 1790].forEach((x, i) => { P(c, S_.post(PAL.grayD, 74, 250, 110 + i), x, 575, { depth: 1.6 }); P(c, S_.post(PAL.grayL, 74, 30, 112 + i), x, 462, { depth: 1 }); });
    });
    lay(c, 0.8, cam, () => {
      P(c, S_.floor(o.floor, 120), 960, 712, { ax: 0.5, ay: 0, depth: 1.4 });
      P(c, S_.scrap(2100, 12, PAL.cream, 125), 960, 776, { rot: -0.004, depth: 0.3 });
      P(c, S_.scrap(1500, 12, PAL.cream, 126), 960, 880, { rot: 0.003, depth: 0.3 });
    });
    lay(c, 1, cam, () => { P(c, S_.apron(o.apron, 130), 960, 944, { ax: 0.5, ay: 0, depth: 2.2 }); });
  }
  function labSet(c, cam) {
    lay(c, 0.12, cam, () => P(c, S_.wall(PAL.creamD, 211), -150, -130, { ax: 0, ay: 0, shadow: false, depth: 0 }));
    lay(c, 0.2, cam, () => { P(c, S_.disc(520, PAL.cream, 213), 960, 430, { depth: 0.8 }); });
    lay(c, 0.32, cam, () => {
      [-130, 0, 130].forEach((d, i) => P(c, S_.scrap(22, 560, PAL.blueD, 220 + i), 1580 + d * 1.6, 300, { depth: 0.6 })); // pipes
      P(c, S_.scrap(250, 540, PAL.gray, 230), 1620, 640, { depth: 1.6 }); P(c, S_.scrap(8, 400, PAL.grayD, 231), 1620, 640, { depth: 0.3, shadow: false });
      for (let i = 0; i < 4; i++) P(c, S_.scrap(120, 10, PAL.grayD, 232 + i), 1620, 480 + i * 22, { depth: 0.2, shadow: false });
      P(c, S_.scrap(760, 30, PAL.blueD, 240), 650, 760, { depth: 1.2 }); [300, 1000].forEach((x, i) => P(c, S_.scrap(26, 190, PAL.blueD, 241 + i), x, 860, { depth: 0.8 }));
      P(c, S_.scrap(180, 140, PAL.grayL, 250), 440, 654, { depth: 1 }); P(c, S_.scrap(92, 60, PAL.ink, 251), 455, 654, { depth: 0.3, shadow: false });
      P(c, S_.scrap(14, 190, PAL.grayD, 252), 190, 640, { depth: 0.6, rot: -0.4 }); P(c, S_.scrap(14, 150, PAL.grayD, 253), 280, 540, { depth: 0.6, rot: 0.6 });
      P(c, S_.disc2(52, PAL.mustard, 254), 330, 462, { depth: 1 });
    });
    lay(c, 0.8, cam, () => {
      P(c, S_.floor(PAL.blueL, 260), 960, 800, { ax: 0.5, ay: 0, depth: 1.4 });
      for (let i = 0; i < 12; i++) P(c, S_.scrap(10, 330, PAL.cream, 270 + i), -200 + i * 230, 960, { depth: 0.2, rot: 0.12, shadow: false });
    });
    lay(c, 1, cam, () => { P(c, S_.apron(PAL.blueD, 280), 960, 990, { ax: 0.5, ay: 0, depth: 2 }); });
  }
  const SETS = {
    hook: (c, cam) => ringSet(c, cam, { wall: PAL.blueD, disc: PAL.cream, floor: PAL.kraft, apron: PAL.grayD, window: 230, bag: 1780, discX: 1040 }),
    size: (c, cam) => ringSet(c, cam, { wall: PAL.kraftL, disc: PAL.cream, floor: PAL.blueL, apron: PAL.blueD, ladder: 1700, window: 280, pane: PAL.blueL, discX: 960 }),
    punch: (c, cam) => ringSet(c, cam, { wall: PAL.blue, disc: PAL.mustard, floor: PAL.kraft, apron: PAL.grayD, bricks: PAL.blueD, bricks2: "#557793", bag: 1640, discX: 900, discR: 440, postL: 90, postR: 1840 }),
    myth: (c, cam) => ringSet(c, cam, { wall: PAL.grayD, disc: PAL.red, floor: PAL.kraft, apron: PAL.ink, rack: 420, bag: 1780, discX: 1240, discR: 520, postL: 90, postR: 1820 }),
    doc: (c, cam) => labSet(c, cam),
    three: (c, cam) => ringSet(c, cam, { wall: "#3d566b", disc: PAL.mustard, floor: PAL.kraftD, apron: PAL.ink, window: 230, ladder: 1650, pane: PAL.mustard, discX: 1240, discR: 420 }),
  };
  function front(c, cam, k) { // foreground scraps, move faster than the actors (parallax)
    lay(c, 1.55, cam, () => {
      P(c, S_.scrap(360, 130, k % 2 ? PAL.kraft : PAL.blueD, 300 + k), -40, 1070, { rot: -0.16, depth: 3.5 });
      P(c, S_.scrap(260, 90, k % 2 ? PAL.mustard : PAL.kraft, 310 + k), 1930, 1060, { rot: 0.2, depth: 3.5 });
    }, { boil: true });
  }

  /* ---------- heroes ---------- */
  const T = {
    guard: { uaL: 30, faL: -128, uaR: -30, faR: 128, hy: 12, torso: 0, head: 0 },
    stand: { uaL: 6, faL: -6, uaR: -6, faR: 6, hy: 2 },
    runA: { uaL: 42, faL: -34, uaR: -42, faR: 36, torso: 7, ankL: [0, -34], ankR: [0, 0], hy: 12 },
    runB: { uaL: 42, faL: -34, uaR: -42, faR: 36, torso: 7, ankL: [0, 0], ankR: [0, -34], hy: 12 },
    wind: { uaR: 58, faR: 100, uaL: 36, faL: -112, torso: -12, pelvis: -5, head: -4, hy: 22, ankL: [0, -26], ankR: [0, -12] },
    swing: { uaR: -88, faR: -14, uaL: 18, faL: -132, torso: 13, pelvis: -6, head: 5, hy: 8, ankL: [0, -30], ankR: [0, -20] },
    shrug: { uaL: 44, faL: -74, uaR: -44, faR: 74, head: 6, hy: 4, torso: -2 },
    wag: { uaR: -36, faR: 132, uaL: 8, faL: -6, hy: 2, head: -3 },
    point: { uaR: -72, faR: -8, uaL: 6, faL: -6, hy: 2, torso: 3 },
  };
  const G = {
    guard: { uaL: 24, faL: -74, uaR: -24, faR: 74, hy: 6 },
    flex: { uaL: 82, faL: 98, uaR: -82, faR: -98, hy: 8, head: 0 },
    hit: { head: 28, hdx: 24, hdy: -8, torso: 9, pelvis: 3, uaL: 40, faL: 12, uaR: -34, faR: -18, hy: 10, rot: 3 },
    sag: { hy: 148, head: 14, hdy: 16, torso: 6, uaL: 20, faL: 8, uaR: -22, faR: -10, ankL: [-34, 0], ankR: [34, 0], rot: 0 },
    sag2: { hy: 156, head: -10, hdy: 20, torso: -5, uaL: 14, faL: 12, uaR: -18, faR: -8, ankL: [-40, 0], ankR: [40, 0] },
  };
  const bob = (amp, period = 0.9, t) => amp * Math.sin((t / period) * Math.PI * 2);
  const gStand = (t, a = 3) => ({ hy: bob(a, 1.0, t) + 6 });

  /* ---------- effects ---------- */
  function pop(c, sp, x, y, t, t0, o = {}) {
    const k = pr(t, t0, o.d ?? 0.2); if (k <= 0) return;
    P(c, sp, x, y, { rot: (o.rot || 0) + jrot("p" + x + y, 1.6), sx: (o.sc || 1) * (0.35 + 0.65 * easeOutBack(k, 2.4)), depth: o.depth ?? 2, alpha: clamp(k * 5) * (o.alpha ?? 1), ax: o.ax ?? 0.5, ay: o.ay ?? 0.5 });
  }
  function slam(c, sp, x, y, t, t0, o = {}) {
    const k = pr(t, t0, 0.16); if (k <= 0) return;
    const s = (o.sc || 1) * (1 + 0.85 * (1 - easeOut(k))), lift = 3 * (1 - easeOut(k));
    P(c, sp, x, y, { rot: (o.rot || 0) + jrot("s" + x, 1.2), sx: s, depth: 0.6 + 2.4 * easeOut(k) + lift, alpha: clamp(k * 6), ax: o.ax ?? 0.5, ay: o.ay ?? 0.5 });
  }
  function scraps(c, t, t0, x, y, n, seed, o = {}) {
    const k = t - t0; if (k < 0 || k > 1.1) return;
    const cols = [PAL.cream, PAL.mustard, PAL.red, PAL.kraft, PAL.blueL, PAL.cream];
    for (let i = 0; i < n; i++) {
      const a = (o.a0 ?? -Math.PI * 0.95) + hr(seed, i) * (o.span ?? Math.PI * 0.9), v = (o.v ?? 520) + hr(seed, i, 2) * 560, sz = 14 + hr(seed, i, 3) * 26;
      const px = x + Math.cos(a) * v * k, py = y + Math.sin(a) * v * k + 1500 * k * k;
      P(c, S_.scrap(sz, sz * (0.5 + hr(seed, i, 4)), cols[i % cols.length], seed * 50 + i), px, py, { rot: hr(seed, i, 5) * 6 + k * (hr(seed, i, 6) - 0.5) * 22, depth: 1.4, alpha: 1 - pr(k, 0.7, 0.4) });
    }
  }
  function impactFx(c, t, t0, x, y, seed, o = {}) {
    const k = t - t0; if (k < 0) return;
    if (k < 0.3) { const r = (o.r || 150) * (0.55 + 0.45 * easeOutBack(pr(k, 0, 0.14))) * (1 - 0.25 * pr(k, 0.15, 0.15)); P(c, S_.burst(r, PAL.red, seed), x, y, { rot: jrot("b", 8) + 0.2 * seed, depth: 2.4 }); P(c, S_.burst(r * 0.68, PAL.mustard, seed + 1, null), x, y, { rot: jrot("b2", 8) - 0.1, depth: 0.1, shadow: false }); }
    scraps(c, t, t0, x, y, o.n || 11, seed);
  }
  function orbitStars(c, t, hx, hy, rx, ry, n = 4, seed = 1) {
    for (let i = 0; i < n; i++) { const a = t * 5.2 + (i * Math.PI * 2) / n; P(c, S_.star(22 + 4 * Math.sin(t * 8 + i), i % 2 ? PAL.mustard : PAL.cream, seed + i), hx + Math.cos(a) * rx, hy + Math.sin(a) * ry, { rot: a * 0.8, depth: 1.2 }); }
  }
  const camShake = (t, hit, amp, n) => { if (hit === undefined || t < hit) return [0, 0, 0]; const k = Math.max(0, 1 - (t - hit) / 0.5); return [(hr(n, 1) - 0.5) * 2 * amp * k, (hr(n, 2) - 0.5) * 2 * amp * k, 0.045 * Math.max(0, 1 - (t - hit) / 0.35)]; };
  function dashLine(c, x0, y0, x1, y1, k, seed) { // dashed line made of paper dashes, grows with k
    const n = Math.round(Math.hypot(x1 - x0, y1 - y0) / 44), ang = Math.atan2(y1 - y0, x1 - x0);
    for (let i = 0; i < n * k; i++) P(c, S_.dash(26, PAL.cream, seed + i), lerp(x0, x1, (i + 0.5) / n), lerp(y0, y1, (i + 0.5) / n), { rot: ang, depth: 0.5 });
  }
  function bigArrow(c, x, y, len, rot, col, k, seed) { if (k <= 0) return; P(c, memo(`arr|${len}|${col}`, () => polySheet(arrowPts(len, 34, 84, 80), col, seed, { amp: 2.4, inset: 4 })), x, y, { ax: 0, ay: 0.5, rot, sx: easeOut(k), sy: 1, depth: 1.6 }); }

  /* ---------- scenes ---------- */
  const SC = {};
  const hero = (c, name, P_, o) => drawHero(c, name, P_, { step: ST, z: ZZ, ...o });
  // where Tetsu must stand and how high he must be for his right fist to land on a given point
  function solveFist(P_, target, s) {
    const a = anchor("tetsu", P_, { x: 0, y: 0, s, flip: false }, "fistR");
    return [target[0] - a[0], target[1] - a[1]];
  }

  SC.hook = (c, t, st, sc) => {
    const hit = wt(sc, "вырубает", 0.638), gx0 = 1340, since = t - hit;
    const gPose = t < hit ? { ...G.guard, ...gStand(t, 3) } : lerpPose({ ...G.guard, hy: 6 }, G.hit, easeOut(pr(t, hit, 0.1)));
    if (t >= hit) { const w = Math.exp(-since * 2.4); gPose.head += 12 * Math.sin(since * 13) * w; gPose.torso += 4 * Math.sin(since * 11) * w; }
    const gx = gx0 + 70 * easeOut(pr(t, hit, 0.4)) + (t > hit + 0.4 ? 5 * Math.sin(t * 6) * Math.exp(-(t - hit - 0.4) * 1.2) : 0);
    const chin = anchor("gromila", G.guard, { x: gx0, y: GY, s: GS }, "chin");
    const tgt = [chin[0] - 52 * GS, chin[1] + 18], solved = solveFist(T.swing, tgt, TS);
    const hitX = solved[0], lift = GY - solved[1], air0 = 0.1, air1 = hit + 0.22, uh = pr(hit, air0, air1 - air0), A = lift / (4 * uh * (1 - uh));
    const u = pr(t, air0, air1 - air0), y = GY - (t > air0 && t < air1 ? A * 4 * u * (1 - u) : 0);
    const tx = t < hit ? lerp(-260, hitX, easeInOut(pr(t, 0, hit))) : lerp(hitX, hitX - 120, easeOut(pr(t, hit + 0.15, 0.5)));
    let tp;
    const run = Math.floor(st / 2) % 2 ? T.runA : T.runB;
    if (t < 0.14) tp = run; else if (t < 0.4) tp = lerpPose(run, T.wind, easeInOut(pr(t, 0.14, 0.26)));
    else if (t < hit) tp = lerpPose(T.wind, T.swing, Math.pow(pr(t, 0.4, hit - 0.4), 2.2));
    else if (t < hit + 0.12) tp = T.swing; else tp = lerpPose(T.swing, T.guard, easeInOut(pr(t, hit + 0.12, 0.5)));
    const sh = camShake(t, hit, 20, st), cam = { x: lerp(-90, 90, t / sc.dur) + sh[0] + (t < hit ? 0 : 20), y: sh[1], z: 1 + 0.03 * (t / sc.dur) + sh[2] };
    SETS.hook(c, cam);
    lay(c, 1, cam, () => {
      hero(c, "gromila", gPose, { x: gx, y: GY, s: GS, key: "g" });
      if (t > hit + 0.22) { const hc = anchor("gromila", gPose, { x: gx, y: GY, s: GS }, "headc"); orbitStars(c, t, hc[0], hc[1] - 130, 120, 26, 4, 3); }
      hero(c, "tetsu", tp, { x: tx, y, s: TS, key: "t" });
      const fp = anchor("tetsu", tp, { x: tx, y, s: TS }, "fistR");
      impactFx(c, t, hit, tgt[0] + 10, tgt[1], 5);
      slam(c, letters("ВЫРУБАЕТ", 100, { seed: 3 }), 520, 150, t, hit, { rot: -0.05 });
      slam(c, strip("НЕ СИЛА", 190, { bg: PAL.red, fg: PAL.cream, seed: 7 }), 640, 330, t, wt(sc, "не", 1.042), { rot: -0.04, sc: 1 });
    });
    front(c, cam, 0);
    return { hit };
  };

  SC.size = (c, t, st, sc) => {
    const tH = wt(sc, "тяжеловес", 0.773), tM = wt(sc, "метра", 0.379), tN = wt(sc, "парня", 1.735), tG = wt(sc, "голову", 2.11), tV = wt(sc, "против", 1.446);
    const sh = camShake(t, tH, 9, st), cam = { x: lerp(-70, 60, t / sc.dur) + sh[0], y: sh[1], z: 1 + 0.035 * (t / sc.dur) };
    SETS.size(c, cam);
    const gx = 1340, tx = 540, gs = 1.02;
    const gP = { ...G.flex, hy: 8 + bob(2.5, 0.9, t), uaL: 82 + bob(3, 1.1, t), uaR: -82 - bob(3, 1.1, t) };
    const tP = { ...T.guard, hy: 12 + bob(5, 0.8, t), uaL: 30 + bob(4, 0.8, t), uaR: -30 - bob(4, 0.8, t) };
    lay(c, 1, cam, () => {
      hero(c, "gromila", gP, { x: gx, y: GY, s: gs, key: "g" });
      hero(c, "tetsu", tP, { x: tx, y: GY, s: TS, key: "t" });
      const gTop = GY - 796 * gs + 22, tTop = GY - 766 * TS + 14;
      // ruler along the right edge (grows to the big guy's head)
      const kr = easeOut(pr(t, tM, 0.55)), rx = 1850, top = lerp(GY, gTop, kr);
      P(c, sheet(34, GY - gTop + 20, PAL.mustard, 401, { amp: 2, inset: 2 }), rx, GY, { ax: 0.5, ay: 1, sy: kr, depth: 1.4 });
      for (let i = 0; i <= 8; i++) { const yy = lerp(GY, gTop, i / 8); if (kr >= i / 8) P(c, S_.scrap(i % 4 === 0 ? 58 : 34, 7, PAL.ink, 410 + i), rx, yy, { depth: 0.1, shadow: false }); }
      pop(c, letters("2 М", 112, { seed: 5, cols: [PAL.mustard, PAL.cream, PAL.mustard] }), 1735, gTop + 5, t, tM, { rot: -0.07 });
      slam(c, strip("ТЯЖЕЛОВЕС", 84, { bg: PAL.red, fg: PAL.cream, seed: 2 }), gx, gTop - 52, t, tH, { rot: -0.03 });
      pop(c, strip("ПРОТИВ", 62, { bg: PAL.cream, seed: 4 }), 880, 530, t, tV, { rot: 0.06 });
      pop(c, strip("СРЕДНИЙ ВЕС", 76, { bg: PAL.blueL, seed: 6 }), tx, tTop - 62, t, tN, { rot: -0.03 });
      const kl = easeOut(pr(t, tG - 0.05, 0.34));
      if (kl > 0) {
        dashLine(c, tx + 80, tTop, 1010, tTop, kl, 500); dashLine(c, gx - 170, gTop, 1010, gTop, kl, 600);
        const bx = 1010; P(c, sheet(24, tTop - gTop, PAL.red, 421, { amp: 1.5, inset: 2 }), bx, gTop, { ax: 0.5, ay: 0, sy: kl, depth: 1.4 });
        pop(c, strip("НА ГОЛОВУ НИЖЕ", 62, { bg: PAL.mustard, seed: 8 }), 880, (gTop + tTop) / 2 + 15, t, tG + 0.1, { rot: -0.04 });
      }
    });
    front(c, cam, 1);
    return { hit: tH };
  };

  SC.punch = (c, t, st, sc) => {
    const tB = wt(sc, "подбородок", 0.783) + 0.1, tSag = wt(sc, "оседает", 1.744), gx0 = 1290, since = t - tB;
    const chin = anchor("gromila", G.guard, { x: gx0, y: GY, s: GS }, "chin"), tgt = [chin[0] - 50, chin[1] + 18], solved = solveFist(T.swing, tgt, TS);
    const hitX = solved[0], lift = GY - solved[1], air0 = 0.2, air1 = tB + 0.2, uh = pr(tB, air0, air1 - air0), A = lift / (4 * uh * (1 - uh));
    const gPose = t < tB ? { ...G.guard, ...gStand(t, 2) } : (t < tSag ? lerpPose(G.guard, G.hit, easeOut(pr(t, tB, 0.1))) : lerpPose(G.hit, G.sag, easeInOut(pr(t, tSag, 0.55))));
    if (t >= tB && t < tSag + 0.3) { const w = Math.exp(-since * 2); gPose.head += 14 * Math.sin(since * 10) * w; gPose.torso += 5 * Math.sin(since * 9) * w; }
    const gx = gx0 + 90 * easeOut(pr(t, tB, 0.45)) + 40 * easeOut(pr(t, tSag, 0.5));
    const u = pr(t, air0, air1 - air0), y = GY - (t > air0 && t < air1 ? A * 4 * u * (1 - u) : 0);
    const tx = t < tB ? lerp(hitX - 330, hitX, easeInOut(pr(t, 0.05, tB - 0.05))) : lerp(hitX, hitX - 90, easeOut(pr(t, tB + 0.1, 0.6)));
    let tp;
    if (t < 0.25) tp = lerpPose(T.guard, T.wind, easeInOut(pr(t, 0, 0.25))); else if (t < tB) tp = lerpPose(T.wind, T.swing, Math.pow(pr(t, 0.45, tB - 0.45), 2.2)); else if (t < tB + 0.12) tp = T.swing; else tp = lerpPose(T.swing, T.guard, easeInOut(pr(t, tB + 0.12, 0.55)));
    if (t >= 0.25 && t < 0.45) tp = T.wind;
    const sh = camShake(t, tB, 24, st), cam = { x: lerp(-60, 100, t / sc.dur) + sh[0], y: sh[1], z: 1.03 + 0.05 * (t / sc.dur) + sh[2] };
    SETS.punch(c, cam);
    lay(c, 1, cam, () => {
      hero(c, "gromila", gPose, { x: gx, y: GY, s: GS, key: "g" });
      if (t > tB + 0.25) { const hc = anchor("gromila", gPose, { x: gx, y: GY, s: GS }, "headc"); orbitStars(c, t, hc[0], hc[1] - 125, 120, 24, 4, 3); }
      hero(c, "tetsu", tp, { x: tx, y, s: TS, key: "t" });
      // trajectory of the hook: dashed arc from low behind to the chin
      const ka = pr(t, 0.4, tB - 0.45), fade = 1 - pr(t, tB, 0.3);
      if (ka > 0 && fade > 0) {
        const P0 = [tgt[0] - 520, tgt[1] + 360], P1 = [tgt[0] - 420, tgt[1] + 200], P2 = [tgt[0] - 100, tgt[1] + 130], P3 = [tgt[0] - 30, tgt[1] + 10], n = 14;
        for (let i = 0; i <= n * ka; i++) { const q = i / n, m = 1 - q, px = m * m * m * P0[0] + 3 * m * m * q * P1[0] + 3 * m * q * q * P2[0] + q * q * q * P3[0], py = m * m * m * P0[1] + 3 * m * m * q * P1[1] + 3 * m * q * q * P2[1] + q * q * q * P3[1]; P(c, S_.star(16 + q * 14, PAL.mustard, 600 + i), px, py, { rot: q * 3, alpha: fade, depth: 1 }); }
      }
      if (t > tB - 0.02) { const k = easeOutBack(pr(t, tB, 0.18)); P(c, ringSheet(96, 22, PAL.red, 91), chin[0] + (gx - gx0) - 4, chin[1] - 10, { sx: k * (1 - 0.25 * pr(t, tB + 0.3, 0.3)), rot: jrot("ring", 3), depth: 1.6, alpha: 1 - pr(t, tSag, 0.3) }); }
      impactFx(c, t, tB, tgt[0] + 6, tgt[1], 8, { r: 170 });
      pop(c, letters("1", 190, { seed: 9, fixed: PAL.mustard }), 280, 170, t, 0.1, { rot: -0.1 });
      pop(c, strip("БОКОВОЙ", 118, { bg: PAL.mustard, seed: 10 }), 640, 150, t, wt(sc, "боковой", 0.427) - 0.05, { rot: -0.04 });
      pop(c, strip("В ПОДБОРОДОК", 84, { bg: PAL.cream, seed: 11 }), 670, 300, t, wt(sc, "подбородок", 0.783), { rot: -0.02 });
    });
    front(c, cam, 2);
    return { hit: tB };
  };

  SC.myth = (c, t, st, sc) => {
    const tN = wt(sc, "нет", 2.502), tS = wt(sc, "сильнее", 0.1), tB = wt(sc, "бьёшь", 0.571), tF = wt(sc, "быстрее", 1.023), tV = wt(sc, "вырубишь", 1.408), tm = tN + 0.1;
    const sh = camShake(t, tm, 18, st), cam = { x: lerp(60, -50, t / sc.dur) + sh[0], y: sh[1], z: 1 + 0.03 * (t / sc.dur) + sh[2] };
    SETS.myth(c, cam);
    const gP = { ...G.flex, hy: 8 + bob(3, 0.6, t), uaL: 82 + bob(4, 0.7, t), uaR: -82 - bob(4, 0.7, t) };
    let tP = t > tN ? lerpPose(T.stand, T.wag, easeOut(pr(t, tN, 0.2))) : { ...T.stand, ...{ hy: 2 + bob(3, 1, t) } };
    if (t > tN + 0.15) { tP = { ...tP, faR: tP.faR + 18 * Math.sin((t - tN) * 22), head: -10 * Math.sin((t - tN) * 18) }; }
    lay(c, 1, cam, () => {
      hero(c, "gromila", gP, { x: 1380, y: GY, s: 1.02, key: "g" });
      hero(c, "tetsu", tP, { x: 470, y: GY, s: TS, key: "t" });
      pop(c, strip("СИЛЬНЕЕ БЬЁШЬ —", 92, { bg: PAL.cream, seed: 12 }), 700, 120, t, tS, { rot: -0.02 });
      pop(c, strip("БЫСТРЕЕ ВЫРУБИШЬ?", 92, { bg: PAL.cream, seed: 13 }), 760, 262, t, tF, { rot: 0.015 });
      // "stronger" arrow, "faster" clock
      bigArrow(c, 600, 480, 220, -Math.PI / 2 + 0.0, PAL.mustard, pr(t, tB, 0.3), 14);
      if (t > tF + 0.1) {
        const k = easeOutBack(pr(t, tV - 0.1, 0.25)), ang = (t - tV) * 14;
        P(c, S_.disc2(88, PAL.cream, 15), 930, 480, { sx: k, depth: 1.8 }); P(c, S_.disc2(66, PAL.blueL, 16), 930, 480, { sx: k, shadow: false, depth: 0 });
        P(c, S_.scrap(8, 66, PAL.ink, 17), 930 + Math.sin(ang) * 31, 480 - Math.cos(ang) * 31, { rot: ang, sx: k, depth: 0.2, shadow: false }); P(c, S_.scrap(8, 40, PAL.red, 18), 930 + Math.sin(ang / 12) * 18, 480 - Math.cos(ang / 12) * 18, { rot: ang / 12, sx: k, depth: 0.2, shadow: false });
      }
      // cross-out and МИФ stamp on "Нет"
      const kx = easeOut(pr(t, tN - 0.02, 0.16));
      if (kx > 0) { const sp = sheet(1100, 40, PAL.red, 19, { amp: 2, inset: 3 }); P(c, sp, 700, 190, { rot: 0.22, sx: kx, depth: 1.8, ax: 0.5 }); }
      slam(c, strip("МИФ", 330, { bg: PAL.red, fg: PAL.cream, seed: 20, rim: PAL.cream, amp: 14 }), 1030, 640, t, tm, { rot: -0.13, sc: 1 });
      scraps(c, t, tm, 1030, 640, 12, 21, { a0: -Math.PI, span: Math.PI * 2 });
    });
    front(c, cam, 3);
    return { hit: tm };
  };

  SC.doc = (c, t, st, sc) => {
    const tE = wt(sc, "эксперимент", 0.1), t72 = wt(sc, "семьдесят", 0.648), tQ = wt(sc, "другое", 2.475), tR = wt(sc, "решает", 2.148);
    const sh = camShake(t, tQ, 12, st), cam = { x: lerp(-40, 40, t / sc.dur) + sh[0], y: sh[1], z: 1 + 0.03 * (t / sc.dur) };
    SETS.doc(c, cam);
    const dx = lerp(-300, 560, easeOut(pr(t, 0, 0.55)));
    lay(c, 1, cam, () => {
      hero(c, "gromila", { ...G.sag, hy: 150 + bob(3, 1.3, t), head: 14 + 4 * Math.sin(t * 5) }, { x: 1690, y: GY + 4, s: 0.74, key: "g" });
      { const hc = anchor("gromila", { ...G.sag, hy: 150 }, { x: 1690, y: GY + 4, s: 0.74 }, "headc"); orbitStars(c, t, hc[0], hc[1] - 90, 80, 18, 3, 3); }
      drawDoc(c, dx, GY + 2, 0.98, t);
      // sign board
      const k = easeOutBack(pr(t, tE, 0.35)), cx = 1160, cy = 420;
      P(c, sheet(26, 520, PAL.kraftD, 31, { amp: 2 }), cx, cy + 200, { ax: 0.5, ay: 0, depth: 1.6 });
      P(c, sheet(640, 400, PAL.kraft, 32, { amp: 5, inset: 5, stains: 5, folds: 1 }), cx, cy, { sx: k, depth: 2.4, rot: -0.02 });
      P(c, sheet(560, 70, PAL.mustard, 33, { amp: 2, inset: 3 }), cx, cy - 135, { sx: k, depth: 0.5, rot: -0.02 });
      pop(c, strip("ЭКСПЕРИМЕНТ", 66, { bg: PAL.cream, seed: 34 }), cx, cy - 138, t, tE + 0.2, { rot: -0.02, depth: 0.8 });
      pop(c, letters("1972", 190, { seed: 35, cols: [PAL.mustard, PAL.cream, PAL.blueL, PAL.cream] }), cx, cy + 40, t, t72, { rot: -0.03 });
      pop(c, letters("?", 280, { seed: 36, fixed: PAL.red }), 1270, 190, t, tQ, { rot: 0.1, sc: 1.0 });
      pop(c, strip("РЕШАЕТ ДРУГОЕ", 70, { bg: PAL.red, fg: PAL.cream, seed: 37 }), 1110, 640, t, tR, { rot: 0.025 });
    });
    front(c, cam, 4);
    return { hit: tQ };
  };
  function drawDoc(c, x, y, s, t) {
    const p = RIGS.doc.parts.whole, im = RIG.IMGS.doc.whole;
    c.save(); c.translate(x + jr("dx", 1.2), y + jr("dy", 1.2)); c.rotate((jr("dr", 1.0) * 1) + 0.012 * Math.sin(t * 2.4)); c.scale(s, s * (1 + 0.006 * Math.sin(t * 3)));
    c.shadowColor = "rgba(34,22,8,0.42)"; c.shadowBlur = 9 * ZZ; c.shadowOffsetX = 3.5 * ZZ; c.shadowOffsetY = 7 * ZZ;
    c.translate(-RIGS.doc.cx, -RIGS.doc.feet); c.drawImage(im, p.x, p.y, p.w, p.h); c.restore();
  }

  SC.three = (c, t, st, sc) => {
    const tP = wt(sc, "почему", 2.137), tB = wt(sc, "большой", 3.069), tT = wt(sc, "три", 0.1);
    const sh = camShake(t, tB, 20, st), cam = { x: lerp(40, -40, t / sc.dur) + sh[0], y: sh[1], z: 1 + 0.03 * (t / sc.dur) + sh[2] };
    SETS.three(c, cam);
    const gS = { ...G.sag, hy: 150 + bob(3, 1.3, t), head: 14 + 4 * Math.sin(t * 5) };
    lay(c, 1, cam, () => {
      hero(c, "gromila", gS, { x: 1400, y: GY + 4, s: GS, key: "g" });
      { const hc = anchor("gromila", gS, { x: 1400, y: GY + 4, s: GS }, "headc"); orbitStars(c, t, hc[0], hc[1] - 125, 118, 24, 4, 3); }
      hero(c, "tetsu", t > tP ? lerpPose(T.stand, T.shrug, easeOut(pr(t, tP, 0.3))) : T.stand, { x: 470, y: GY, s: TS, key: "t" });
      const gone = 1 - pr(t, 1.75, 0.2);
      if (gone > 0) {
        pop(c, strip("3 ПРИЧИНЫ", 130, { bg: PAL.mustard, seed: 41 }), 700, 150, t, tT, { rot: -0.03, alpha: gone });
        [1, 2, 3].forEach((n, i) => { const t0 = 0.5 + i * 0.3; pop(c, memo(`num|${n}`, () => { const cv = ellipseSheet(66, 66, PAL.cream, 50 + n, { amp: 3, inset: 4 }); return cv; }), 430 + i * 160, 370, t, t0, { rot: (i - 1) * 0.08 }); pop(c, letters(String(n), 96, { seed: 60 + n, fixed: PAL.cream }), 430 + i * 160, 372, t, t0, { depth: 0 }); });
      }
      pop(c, strip("ПОЧЕМУ УПАЛ", 100, { bg: PAL.cream, seed: 42 }), 760, 135, t, tP, { rot: -0.02 });
      slam(c, letters("БОЛЬШОЙ?", 210, { seed: 43, cols: [PAL.red, PAL.cream, PAL.red, PAL.mustard] }), 800, 330, t, tB, { rot: 0.03 });
      scraps(c, t, tB, 800, 330, 12, 44, { a0: -Math.PI, span: Math.PI * 2 });
    });
    front(c, cam, 5);
    return { hit: tB };
  };

  /* ---------- subtitles: word chunks on cream strips, current word on mustard ---------- */
  function subtitles(c, sc, tg) {
    if (!SPEC.subtitles || !sc.words || !sc.words.length) return;
    const t = tg - sc.start, ws = sc.words;
    let cur = -1; for (let i = 0; i < ws.length; i++) if (t >= ws[i].t - 0.02) cur = i;
    if (cur < 0) return;
    const group = 4, g0 = Math.floor(cur / group) * group, chunk = ws.slice(g0, g0 + group), size = 52;
    const sps = chunk.map((w, i) => strip(w.w.toUpperCase(), size, { bg: g0 + i === cur ? PAL.mustard : PAL.cream, seed: 70 + i, amp: 2.5 }));
    const gap = 6, total = sps.reduce((a, s) => a + s.w, 0) + gap * (sps.length - 1);
    let x = 960 - total / 2;
    sps.forEach((sp, i) => { put(c, sp, x + sp.w / 2, 1022, { depth: 1.2, rot: ((g0 + i) % 3 - 1) * 0.012, sx: g0 + i === cur ? 1.07 : 1 }); x += sp.w + gap; });
  }

  /* ---------- transitions: a paper sheet slides over the cut ---------- */
  const TR = [{ col: PAL.kraft, dir: -1 }, { col: PAL.blue, dir: 1 }, { col: PAL.red, dir: -1 }, { col: PAL.mustard, dir: 1 }, { col: PAL.cream, dir: -1 }];
  const TR_PRE = 0.16, TR_LEN = 0.46, SW = 1150;

  function sceneAt(tg) { for (let i = SPEC.scenes.length - 1; i >= 0; i--) if (tg >= SPEC.scenes[i].start - 1e-6) return i; return 0; }
  function drawScene(c, i, tg) {
    const sc = SPEC.scenes[i], tl = tg - sc.start, ph = (HITS[sc.id] ?? 0) % (1 / STEPS);
    const st = Math.floor((tl - ph) * STEPS + 1e-6), tq = st / STEPS + ph;
    ST = st;
    c.save(); SC[sc.id](c, tq, st, sc); c.restore();
  }
  const HITS = { hook: 0.638, size: 0.773, punch: 0.883, myth: 2.602, doc: 2.475, three: 3.069 };

  function render(tReal) {
    const tg = Math.min(tReal, SPEC.total - 1e-3), c = window.TOON_CTX;
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.clearRect(0, 0, W, H);
    const idx = sceneAt(tg);
    // transition window around the start of scene idx+1 (and idx for the tail of the sheet)
    let tr = -1;
    for (let k = 0; k < SPEC.scenes.length - 1; k++) { const b = SPEC.scenes[k + 1].start; if (tg >= b - TR_PRE && tg < b - TR_PRE + TR_LEN) tr = k; }
    if (tr < 0) { drawScene(c, idx, tg); }
    else {
      const b = SPEC.scenes[tr + 1].start, gst = Math.floor(tg * STEPS) / STEPS, u = easeInOut(pr(gst, b - TR_PRE, TR_LEN - 1 / STEPS)), d = TR[tr].dir;
      const lead = d < 0 ? W - u * (W + SW) : -SW + u * (W + SW); // leading edge x of the sheet
      const l = d < 0 ? lead : lead - 0, left = d < 0 ? lead : lead, right = d < 0 ? lead + SW : lead + SW;
      // A (old scene) on the side the sheet has not reached, B (new) on the side it left
      const A = tr, B = tr + 1;
      c.save(); c.beginPath(); if (d < 0) c.rect(0, 0, left, H); else c.rect(right, 0, W - right, H); c.clip(); drawScene(c, A, tg); c.restore();
      c.save(); c.beginPath(); if (d < 0) c.rect(right, 0, W - right, H); else c.rect(0, 0, left, H); c.clip(); drawScene(c, B, tg); c.restore();
      ST = Math.floor(tg * STEPS);
      const sp = memo(`tr|${tr}`, () => sheet(SW, H + 160, TR[tr].col, 500 + tr, { edges: "tblr", amp: 9, inset: 6, stains: 10, folds: 3 }));
      put(c, sp, left + SW / 2, H / 2, { depth: 3, rot: jrot("tr", 0.6), z: 1 });
    }
    ST = Math.floor(tg * STEPS);
    subtitles(c, SPEC.scenes[idx], Math.floor(tg * STEPS) / STEPS);
  }
  window.TOON_RENDER = render;
})();
