/* Paper-puppet heroes: parts cut by scripts/paperize.py (assets/paper/<hero>/*.png, rigs in engine/rigs.js).
   drawHero() assembles a pose from joint angles, with 2-bone leg IK so planted feet stay on the floor when the hips sag or hop. */
(function () {
  const { DEG, clamp, lerp, hr, hs } = PAPER;
  const IMGS = {};
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

  // joint data in sheet coordinates (mirror around the hero's cx for the R side)
  const GEO = {
    tetsu: { cx: 350, hip: [305, 590], knee: [294, 702], ankle: [282, 852], sh: [256, 280], el: [233, 404], neck: [350, 258], waist: [350, 440], pelvis: [350, 500] },
    gromila: { cx: 308, hip: [205, 575], knee: [192, 728], ankle: [176, 872], sh: [152, 282], el: [118, 508], neck: [308, 238], waist: [308, 470], pelvis: [308, 560] },
  };
  const mir = (p, cx) => [2 * cx - p[0], p[1]];

  function load() {
    const jobs = [];
    for (const hero of Object.keys(RIGS)) {
      IMGS[hero] = {};
      for (const [name, p] of Object.entries(RIGS[hero].parts)) {
        jobs.push(new Promise((res, rej) => { const im = new Image(); im.onload = () => res(); im.onerror = () => rej(new Error("img " + p.file)); im.src = p.file; IMGS[hero][name] = im; }));
      }
    }
    return Promise.all(jobs);
  }

  function legIK(g, side, hipOff, ankOff) {
    const hip = side === "L" ? g.hip : mir(g.hip, g.cx), knee = side === "L" ? g.knee : mir(g.knee, g.cx), ankle = side === "L" ? g.ankle : mir(g.ankle, g.cx);
    const H = [hip[0] + hipOff[0], hip[1] + hipOff[1]], A = [ankle[0] + ankOff[0], ankle[1] + ankOff[1]];
    const L1 = dist(hip, knee), L2 = dist(knee, ankle);
    const dx = A[0] - H[0], dy = A[1] - H[1];
    const d = clamp(Math.hypot(dx, dy), Math.abs(L1 - L2) + 0.5, L1 + L2 - 0.5);
    const base = Math.atan2(dy, dx), a = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
    const ka = base + (side === "L" ? 1 : -1) * a;
    const K = [H[0] + Math.cos(ka) * L1, H[1] + Math.sin(ka) * L1];
    const sa = Math.atan2(A[1] - K[1], A[0] - K[0]);
    const n0 = Math.atan2(knee[1] - hip[1], knee[0] - hip[0]), s0 = Math.atan2(ankle[1] - knee[1], ankle[0] - knee[0]);
    return { thigh: ka - n0, shin: sa - s0 - (ka - n0), hip, knee };
  }

  const NEUTRAL = { hx: 0, hy: 0, ankL: [0, 0], ankR: [0, 0], pelvis: 0, torso: 0, head: 0, hdx: 0, hdy: 0, uaL: 4, faL: -3, uaR: -4, faR: 3, rot: 0 };
  function lerpPose(a, b, t) {
    const o = {};
    for (const k of Object.keys({ ...NEUTRAL, ...a, ...b })) {
      const va = a[k] ?? NEUTRAL[k], vb = b[k] ?? NEUTRAL[k];
      o[k] = Array.isArray(va) ? [lerp(va[0], vb[0], t), lerp(va[1], vb[1], t)] : lerp(va, vb, t);
    }
    return o;
  }
  const pose = (p) => ({ ...NEUTRAL, ...p });

  /* o: {x, y (feet on the floor), s, flip, step (integer stop-motion step), key, z (camera zoom), jit (deg of per-step wobble), alpha, shadow} */
  function drawHero(c, hero, P, o) {
    const rig = RIGS[hero], g = GEO[hero], im = IMGS[hero];
    const s = o.s || 1, z = o.z || 1, jit = (o.jit ?? 1) * DEG, step = o.step || 0, key = hs(o.key || hero);
    const J = (n, amp = 1) => (hr(step, key, hs(n)) - 0.5) * 2 * jit * amp;
    const pt = (n, a, b) => { const p = rig.parts[n]; return [p.x, p.y]; };
    const pose = { ...NEUTRAL, ...P };
    c.save();
    c.translate(o.x + (hr(step, key, 5) - 0.5) * 2 * (o.jp ?? 1.4), o.y + (hr(step, key, 6) - 0.5) * 2 * (o.jp ?? 1.4));
    c.rotate(pose.rot * DEG + J("root", 0.5));
    c.scale((o.flip ? -1 : 1) * s, s);
    c.translate(-g.cx, -rig.feet);
    if (o.alpha !== undefined) c.globalAlpha *= o.alpha;
    if (o.shadow !== false) { c.shadowColor = "rgba(34,22,8,0.42)"; c.shadowBlur = 9 * z; c.shadowOffsetX = 3.5 * z * (o.flip ? -1 : 1) * 0 + 3.5 * z; c.shadowOffsetY = 7 * z; }
    const dp = (n) => { const p = rig.parts[n]; c.drawImage(im[n], p.x, p.y, p.w, p.h); };
    const rotAt = (pv, a, fn) => { c.save(); c.translate(pv[0], pv[1]); c.rotate(a); c.translate(-pv[0], -pv[1]); fn(); c.restore(); };
    c.translate(pose.hx, pose.hy);
    for (const side of ["L", "R"]) {
      const ik = legIK(g, side, [pose.hx, pose.hy], pose["ank" + side]);
      rotAt(ik.hip, ik.thigh, () => { dp("thigh" + side); rotAt(ik.knee, ik.shin, () => dp("shin" + side)); });
    }
    // the legs above were solved for hips at (hx,hy) already; the body below shares that translation
    rotAt(g.pelvis, pose.pelvis * DEG + J("pelvis"), () => {
      dp("pelvis");
      rotAt(g.waist, pose.torso * DEG + J("torso"), () => {
        dp("torso");
        const shL = g.sh, shR = mir(g.sh, g.cx), elL = g.el, elR = mir(g.el, g.cx);
        rotAt(shL, pose.uaL * DEG + J("uaL", 1.3), () => { dp("upperArmL"); rotAt(elL, pose.faL * DEG + J("faL", 1.3), () => dp("foreArmL")); });
        rotAt(shR, pose.uaR * DEG + J("uaR", 1.3), () => { dp("upperArmR"); rotAt(elR, pose.faR * DEG + J("faR", 1.3), () => dp("foreArmR")); });
        c.translate(pose.hdx, pose.hdy);
        rotAt(g.neck, pose.head * DEG + J("head", 1.2), () => dp("head"));
      });
    });
    c.restore();
  }

  /* where a joint ends up on screen (for effects that must stick to a fist or a jaw); mirrors drawHero's transform chain */
  function anchor(hero, P, o, name) {
    const rig = RIGS[hero], g = GEO[hero], s = o.s || 1, pose = { ...NEUTRAL, ...P };
    const M = []; // list of [type, ...] ops applied inner->outer
    let x, y;
    const rot = (p, a, c) => { const dx = p[0] - c[0], dy = p[1] - c[1]; return [c[0] + dx * Math.cos(a) - dy * Math.sin(a), c[1] + dx * Math.sin(a) + dy * Math.cos(a)]; };
    let p;
    if (name === "chin") p = [g.neck[0], g.neck[1] - 8];
    else if (name === "headc") p = [g.neck[0], g.neck[1] - 85];
    else if (name === "fistR" || name === "fistL") {
      const side = name === "fistL";
      p = side ? [g.el[0] - 4, g.el[1] + 150] : [2 * g.cx - g.el[0] + 4, g.el[1] + 150];
      const sh = side ? g.sh : mir(g.sh, g.cx), el = side ? g.el : mir(g.el, g.cx);
      p = rot(p, pose["fa" + (side ? "L" : "R")] * DEG, el);
      p = rot(p, pose["ua" + (side ? "L" : "R")] * DEG, sh);
    }
    if (name === "chin" || name === "headc") { p = [p[0] + pose.hdx, p[1] + pose.hdy]; p = rot(p, pose.head * DEG, [g.neck[0] + pose.hdx, g.neck[1] + pose.hdy]); }
    p = rot(p, pose.torso * DEG, g.waist);
    p = rot(p, pose.pelvis * DEG, g.pelvis);
    p = [p[0] + pose.hx, p[1] + pose.hy];
    x = (p[0] - g.cx) * (o.flip ? -1 : 1) * s; y = (p[1] - rig.feet) * s;
    const r = pose.rot * DEG;
    return [o.x + x * Math.cos(r) - y * Math.sin(r), o.y + x * Math.sin(r) + y * Math.cos(r)];
  }

  window.RIG = { load, drawHero, anchor, lerpPose, pose, NEUTRAL, GEO, IMGS };
})();
