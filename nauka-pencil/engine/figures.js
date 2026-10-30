/* Pencil characters: Tetsu (hero), Gromila (heavyweight), Doc. Skeleton + tubes, drawn with the pencil engine. */
(function () {
  const { S, pstroke, ellipsePts, closed, clipPoly, hatch, bboxOf, hr, lerp, clamp, easeInOut, col } = PE;
  const rad = (d) => (d * Math.PI) / 180;
  const dir = (a) => [Math.sin(rad(a)), Math.cos(rad(a))]; // 0 = down, 90 = forward, 180 = up

  const BUILD = {
    tetsu: { hr: 58, sh: 66, wa: 50, arm: 24, leg: 32, torso: 270 },
    gromila: { hr: 66, sh: 112, wa: 100, arm: 42, leg: 50, torso: 270 },
    doc: { hr: 54, sh: 58, wa: 48, arm: 22, leg: 29, torso: 270 },
  };
  const THIGH = 240, SHIN = 250, UP = 150, FORE = 150;

  /* poses: angles in degrees, absolute, 0 = pointing down, 90 = forward, 180 = up */
  const P = (lean, head, na, fa, nl, fl, eyes) => ({ lean, head, na, fa, nl, fl, eyes: eyes || "open" });
  const POSES = {
    stand: P(0, 0, [8, 14], [-6, 6], [6, 0], [-6, -2]),
    guard: P(8, -3, [22, 168], [10, 150], [26, 4], [-24, -6]),
    hook_1: P(-10, 0, [40, 130], [14, 160], [28, 6], [-26, -8]),
    hook_2: P(12, 2, [80, 100], [14, 160], [28, 6], [-28, -10]),
    hook_3: P(26, 4, [88, 92], [14, 160], [32, 8], [-30, -10]),
    explain: P(0, 2, [44, 112], [8, 14], [6, 0], [-6, -2]),
    pointing: P(2, 0, [86, 84], [8, 14], [6, 0], [-6, -2]),
    dodge: P(-22, -14, [30, 150], [14, 140], [-8, -6], [-28, 6]),
    swing: P(20, 6, [108, 102], [20, 150], [30, 6], [-30, -8]),
    stagger_1: P(-24, -26, [-34, -12], [-20, 20], [-14, -4], [22, 6], "dizzy"),
    stagger_2: P(-50, -50, [-62, -44], [-42, -14], [-36, 12], [34, 44], "x"),
    clipboard: P(0, 4, [26, 168], [8, 14], [6, 0], [-6, -2]),
    doc_explain: P(0, 2, [52, 118], [18, 168], [6, 0], [-6, -2]),
  };
  function lerpPose(a, b, u) {
    const L = (p, q) => p.map((v, i) => lerp(v, q[i], u));
    return { lean: lerp(a.lean, b.lean, u), head: lerp(a.head, b.head, u), na: L(a.na, b.na), fa: L(a.fa, b.fa), nl: L(a.nl, b.nl), fl: L(a.fl, b.fl), eyes: u > 0.5 ? b.eyes : a.eyes };
  }

  /* tube between two points with round caps -> closed polygon */
  function tubePts(a, b, wa, wb) {
    const dx = b[0] - a[0], dy = b[1] - a[1], dl = Math.hypot(dx, dy) || 1;
    const nx = -dy / dl, ny = dx / dl, th = Math.atan2(ny, nx);
    const pts = [[a[0] + nx * wa, a[1] + ny * wa], [b[0] + nx * wb, b[1] + ny * wb]];
    for (let k = 1; k <= 6; k++) { const f = th - (k * Math.PI) / 6; pts.push([b[0] + Math.cos(f) * wb, b[1] + Math.sin(f) * wb]); }
    pts.push([a[0] - nx * wa, a[1] - ny * wa]);
    for (let k = 1; k <= 5; k++) { const f = th + Math.PI - (k * Math.PI) / 6; pts.push([a[0] + Math.cos(f) * wa, a[1] + Math.sin(f) * wa]); }
    return pts;
  }
  function solid(pts, o) {
    const c = S.ctx;
    c.save(); c.fillStyle = PE.PAL.paper2; c.globalAlpha = o.fillAlpha === undefined ? 1 : o.fillAlpha;
    c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.closePath(); c.fill(); c.restore();
  }
  function part(pts, o) {
    // o: seed, prog, dim, hatchCol, hatchAlpha, angle, gap, w
    const a = o.dim === undefined ? 1 : o.dim;
    solid(pts, { fillAlpha: a });
    if (o.hatchAlpha !== 0) hatch(clipPoly(pts), bboxOf(pts), { angle: o.angle === undefined ? 62 : o.angle, gap: o.gap || 13, col: o.hatchCol || "line", alpha: (o.hatchAlpha === undefined ? 0.3 : o.hatchAlpha) * a, seed: o.seed, prog: o.prog, w: 1.6 });
    pstroke(closed(pts), { w: o.w || 3.6, col: o.col || "line", seed: o.seed, prog: o.prog, alpha: a, amp: 1.5 });
  }

  /* kind: tetsu|gromila|doc; pose values; (x, ground y) screen; scale; flip. Returns key world points. */
  function drawFigure(kind, pose, x, gy, scale, flip, t, id, opt = {}) {
    const B = BUILD[kind], prog = opt.prog === undefined ? 1 : opt.prog, dim = opt.dim === undefined ? 1 : opt.dim;
    const seed = PE.strSeed(id + kind);
    const sway = Math.sin(t * 2.2) * 1.4;
    const lean = pose.lean + sway;
    const S0 = [B.torso * Math.sin(rad(lean)), -B.torso * Math.cos(rad(lean))];
    const hn = B.hr + 28, ha = lean + pose.head;
    const Hc = [S0[0] + hn * Math.sin(rad(ha)), S0[1] - hn * Math.cos(rad(ha))];
    const leg = (hip, [ta, sa]) => { const k = [hip[0] + THIGH * dir(ta)[0], hip[1] + THIGH * dir(ta)[1]]; const an = [k[0] + SHIN * dir(sa)[0], k[1] + SHIN * dir(sa)[1]]; return { hip, k, an }; };
    const arm = (sh, [ua, fa]) => { const e = [sh[0] + UP * dir(ua)[0], sh[1] + UP * dir(ua)[1]]; const w = [e[0] + FORE * dir(fa)[0], e[1] + FORE * dir(fa)[1]]; return { sh, e, w }; };
    const nl = leg([8, 0], pose.nl), fl = leg([-8, 0], pose.fl);
    const na = arm([S0[0] + 6, S0[1] + 6], pose.na), fa = arm([S0[0] - 6, S0[1] + 6], pose.fa);
    const drop = Math.max(nl.an[1], fl.an[1]) + 16;
    const T = (p) => [x + (flip ? -1 : 1) * scale * p[0], gy + scale * (p[1] - drop)];
    const tw = (v) => v * scale;
    const o = { prog, dim };

    // ground scribble
    pstroke([[x - 230 * scale, gy + 4], [x + 230 * scale, gy + 2]], { w: 3, col: "soft", seed: seed + 1, prog, alpha: 0.5 * dim, amp: 2.2 });

    const limb = (a, b, wa, wb, sd, extra) => part(tubePts(T(a), T(b), tw(wa), tw(wb)), { ...o, seed: sd, ...extra });
    const foot = (an) => part(tubePts(T([an[0], an[1] + 4]), T([an[0] + 70, an[1] + 10]), tw(15), tw(11)), { ...o, seed: seed + 9, hatchAlpha: 0.15 });
    const drawLeg = (L, sd) => { limb(L.hip, L.k, B.leg, B.leg * 0.82, sd, { hatchAlpha: 0.22 }); limb(L.k, L.an, B.leg * 0.82, B.leg * 0.62, sd + 1, { hatchAlpha: 0.22 }); foot(L.an); };
    const fist = (w, sd) => {
      const c = ellipsePts(0, 0, 1, 1);
      const r = B.arm + 8, wp = T(w);
      const pts = c.map((p) => [wp[0] + p[0] * tw(r), wp[1] + p[1] * tw(r)]);
      part(pts, { ...o, seed: sd, hatchAlpha: 0.25 });
      if (kind === "tetsu") {
        for (let k = -1; k <= 1; k++) pstroke([[wp[0] - tw(r) * 0.9, wp[1] + k * tw(9)], [wp[0] + tw(r) * 0.9, wp[1] + k * tw(9) - 3]], { w: tw(7), col: "orange", seed: sd + k + 5, prog, alpha: dim, glow: 8, sketch: false });
      }
      return wp;
    };
    const drawArm = (A, sd, dm) => {
      const oo = { dim: dim * dm };
      limb(A.sh, A.e, B.arm, B.arm * 0.84, sd, { ...oo, hatchAlpha: 0.2 });
      limb(A.e, A.w, B.arm * 0.84, B.arm * 0.7, sd + 1, { ...oo, hatchAlpha: 0.2 });
      return fist(A.w, sd + 2);
    };

    // far side first
    drawLeg(fl, seed + 20);
    drawArm(fa, seed + 30, 0.7);

    // torso (and coat for doc)
    const ang = rad(lean), nx = Math.cos(ang), ny = Math.sin(ang);
    const torso = [
      [S0[0] - nx * B.sh, S0[1] - ny * B.sh + 8], [S0[0] - nx * B.sh * 0.4, S0[1] - ny * B.sh * 0.4 - 10], [S0[0] + nx * B.sh * 0.4, S0[1] + ny * B.sh * 0.4 - 10], [S0[0] + nx * B.sh, S0[1] + ny * B.sh + 8],
      [nx * B.wa + 2, ny * B.wa + 6], [-nx * B.wa - 2, -ny * B.wa + 6],
    ].map(T);
    part(torso, { ...o, seed: seed + 40, hatchAlpha: 0.28 });
    // shorts / coat
    if (kind === "doc") {
      const coat = [[-nx * B.wa - 8, 0], [nx * B.wa + 8, 0], [nx * B.wa + 30, 230], [-nx * B.wa - 30, 230]].map((p) => T([p[0], p[1] + 20]));
      part(coat, { ...o, seed: seed + 41, hatchAlpha: 0.3, angle: 80 });
      pstroke([T([0, S0[1] + 10]), T([0, 240])], { w: 3, col: "soft", seed: seed + 42, prog, alpha: dim });
    } else {
      const sh = [[-B.wa - 8, -6], [B.wa + 8, -6], [B.wa + 26, 120], [4, 150], [-B.wa - 12, 120]].map(T);
      part(sh, { ...o, seed: seed + 41, hatchAlpha: kind === "gromila" ? 0.55 : 0.65, hatchCol: kind === "gromila" ? "soft" : "line", gap: 8, angle: 40 });
      pstroke([T([-B.wa - 6, -4]), T([B.wa + 6, -4])], { w: 7, col: kind === "tetsu" ? "orange" : "soft", seed: seed + 43, prog, alpha: dim, glow: kind === "tetsu" ? 8 : 0, sketch: false });
    }
    drawLeg(nl, seed + 50);
    // neck
    const neck = [[S0[0] - tw(0) - 14, S0[1] - 14], [Hc[0] - 12, Hc[1] + B.hr - 8], [Hc[0] + 12, Hc[1] + B.hr - 8], [S0[0] + 14, S0[1] - 14]].map(T);
    part(neck, { ...o, seed: seed + 55, hatchAlpha: 0.15 });

    // head
    const hc = T(Hc), rx = tw(B.hr * 0.9), ry = tw(B.hr), tilt = (flip ? -1 : 1) * rad(ha);
    const headPts = ellipsePts(hc[0], hc[1], rx, ry, 0, Math.PI * 2, tilt);
    part(headPts, { ...o, seed: seed + 60, hatchAlpha: 0.12 });
    const hp = (dx, dy) => { const f = flip ? -1 : 1, c = Math.cos(tilt), s = Math.sin(tilt), X = f * dx * scale, Y = dy * scale; return [hc[0] + X * c - Y * s, hc[1] + X * s + Y * c]; };
    // hair / headband per kind
    if (kind === "tetsu") {
      for (let k = 0; k < 6; k++) pstroke([hp(-30 + k * 12, -B.hr * 0.8), hp(-38 + k * 14, -B.hr * 1.25 - hr(seed, k) * 14)], { w: 4, col: "line", seed: seed + 70 + k, prog, alpha: dim, sketch: false, gapP: 0 });
      pstroke([hp(-B.hr * 0.9, -B.hr * 0.35), hp(B.hr * 0.9, -B.hr * 0.45)], { w: 8, col: "orange", seed: seed + 80, prog, alpha: dim, glow: 8, sketch: false });
    } else if (kind === "gromila") {
      hatch(clipPoly(headPts), bboxOf(headPts), { angle: 30, gap: 7, alpha: 0.5 * dim, seed: seed + 81, prog });
      pstroke([hp(10, -B.hr * 0.6), hp(40, -B.hr * 0.2)], { w: 3, col: "soft", seed: seed + 82, prog, alpha: dim, sketch: false });
    } else {
      pstroke([hp(-B.hr * 0.85, -B.hr * 0.55), hp(-B.hr * 0.95, B.hr * 0.1)], { w: 7, col: "soft", seed: seed + 83, prog, alpha: dim, sketch: false });
    }
    // face
    const ey = pose.eyes;
    const E = hp(B.hr * 0.38, -B.hr * 0.12), brow = (a, b) => pstroke([hp(a[0], a[1]), hp(b[0], b[1])], { w: 4, col: "line", seed: seed + 90, prog, alpha: dim, sketch: false, gapP: 0 });
    if (ey === "x") {
      [[-1, -1, 1, 1], [-1, 1, 1, -1]].forEach((d, k) => pstroke([hp(B.hr * 0.38 + d[0] * 11, -B.hr * 0.12 + d[1] * 11), hp(B.hr * 0.38 + d[2] * 11, -B.hr * 0.12 + d[3] * 11)], { w: 4.5, col: "red", seed: seed + 91 + k, prog, alpha: dim, sketch: false, gapP: 0 }));
    } else {
      pstroke(ellipsePts(E[0], E[1], tw(7), tw(ey === "dizzy" ? 7 : 5)), { w: 4, col: "line", seed: seed + 92, prog, alpha: dim, sketch: false, gapP: 0 });
      brow([B.hr * 0.18, -B.hr * (kind === "tetsu" ? 0.45 : 0.38)], [B.hr * 0.6, -B.hr * (kind === "tetsu" ? 0.3 : 0.4)]);
    }
    pstroke([hp(B.hr * 0.86, -B.hr * 0.05), hp(B.hr * 1.02, B.hr * 0.18), hp(B.hr * 0.84, B.hr * 0.22)], { w: 3.5, col: "line", seed: seed + 95, prog, alpha: dim, sketch: false, gapP: 0 });
    const mouthOpen = ey === "x" || ey === "dizzy";
    pstroke(mouthOpen ? ellipsePts(...hp(B.hr * 0.5, B.hr * 0.5), tw(11), tw(8)) : [hp(B.hr * 0.3, B.hr * 0.5), hp(B.hr * 0.7, B.hr * 0.46)], { w: 3.5, col: "line", seed: seed + 96, prog, alpha: dim, sketch: false, gapP: 0 });
    if (kind === "doc") {
      const g1 = hp(B.hr * 0.38, -B.hr * 0.12);
      pstroke(ellipsePts(g1[0], g1[1], tw(17), tw(15)), { w: 3.5, col: "soft", seed: seed + 97, prog, alpha: dim, sketch: false });
      pstroke([hp(B.hr * 0.38 - 17, -B.hr * 0.12), hp(-B.hr * 0.8, -B.hr * 0.18)], { w: 3, col: "soft", seed: seed + 98, prog, alpha: dim, sketch: false });
    }
    // dizzy stars
    if (ey === "dizzy" || ey === "x") {
      for (let k = 0; k < 3; k++) {
        const a = t * 3 + k * 2.09, sp = [hc[0] + Math.cos(a) * rx * 1.3, hc[1] - ry * 1.15 + Math.sin(a) * ry * 0.22], sr = tw(15);
        [0, 60, 120].forEach((d, j) => pstroke([[sp[0] - Math.cos(rad(d)) * sr, sp[1] - Math.sin(rad(d)) * sr], [sp[0] + Math.cos(rad(d)) * sr, sp[1] + Math.sin(rad(d)) * sr]], { w: 3.5, col: "orange", seed: seed + 100 + k * 3 + j, prog, alpha: dim, glow: 8, sketch: false, gapP: 0 }));
      }
    }

    // near arm on top
    const wrist = drawArm(na, seed + 110, 1);
    if (kind === "doc" && opt.prop !== false) {
      const wr = T(pose === POSES.doc_explain ? fa.w : na.w);
      const bx = wr[0] - tw(30), by = wr[1] - tw(120), bw = tw(130), bh = tw(180);
      PE.prect(bx, by, bw, bh, { w: 3.4, col: "line", seed: seed + 120, prog, alpha: dim });
      for (let k = 0; k < 4; k++) pstroke([[bx + bw * 0.15, by + bh * (0.28 + k * 0.17)], [bx + bw * (0.85 - (k % 2) * 0.2), by + bh * (0.28 + k * 0.17)]], { w: 3, col: "soft", seed: seed + 121 + k, prog, alpha: dim, sketch: false });
      pstroke([[bx + bw * 0.3, by - 6], [bx + bw * 0.7, by - 6]], { w: 9, col: "orange", seed: seed + 126, prog, alpha: dim, sketch: false });
    }
    return { fist: wrist, head: hc, top: gy - scale * (drop + 1000 - drop) };
  }

  /* big fist close-up, seen from the front: knuckles on top, thumb across, orange wraps on the wrist */
  function drawFistCloseup(x, gy, scale, t, id, prog) {
    const seed = PE.strSeed(id + "fist"), cx = x, cy = gy - 520 * scale, k = scale;
    const wrist = tubePts([cx, cy + 640 * k], [cx, cy + 250 * k], 120 * k, 115 * k);
    part(wrist, { seed, prog, hatchAlpha: 0.25, angle: 80 });
    const fist = ellipsePts(cx, cy, 190 * k, 175 * k).map((p, i, a) => [p[0], p[1] + Math.max(0, (p[1] - cy) * 0.15)]);
    part(fist, { seed: seed + 1, prog, hatchAlpha: 0.2 });
    // four fingers
    for (let f = 0; f < 4; f++) {
      const fx = cx + (f - 1.5) * 84 * k;
      pstroke(ellipsePts(fx, cy - 70 * k, 38 * k, 46 * k, Math.PI, Math.PI * 2), { w: 4, col: "line", seed: seed + 5 + f, prog, sketch: false });
      pstroke([[fx - 38 * k, cy - 70 * k], [fx - 38 * k, cy + 30 * k]], { w: 3.4, col: "line", seed: seed + 9 + f, prog, sketch: false });
      pstroke([[fx + 38 * k, cy - 70 * k], [fx + 38 * k, cy + 30 * k]], { w: 3.4, col: "line", seed: seed + 13 + f, prog, sketch: false });
      pstroke([[fx - 36 * k, cy + 30 * k], [fx, cy + 46 * k], [fx + 36 * k, cy + 30 * k]], { w: 3.4, col: "line", seed: seed + 17 + f, prog, sketch: false });
    }
    // thumb across the fingers
    const thumb = ellipsePts(cx, cy + 112 * k, 170 * k, 52 * k, 0, Math.PI * 2, 0.06);
    part(thumb, { seed: seed + 30, prog, hatchAlpha: 0.2 });
    // wraps
    for (let b = 0; b < 4; b++) {
      const y = cy + (300 + b * 62) * k;
      pstroke([[cx - 122 * k, y], [cx + 122 * k, y - 10]], { w: 16 * k, col: "orange", seed: seed + 40 + b, prog: PE.clamp(prog * 2 - b * 0.2), glow: 10, sketch: false });
    }
  }

  window.FIG = { POSES, lerpPose, drawFigure, drawFistCloseup, BUILD };
})();
