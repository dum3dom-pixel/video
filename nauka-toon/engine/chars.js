/* Two original cartoon fighters built from a skeleton: Tetsu (small luchador, orange mask) and Gromila (huge bruiser).
   Angles are absolute degrees: 0 = hanging down, 90 = forward, 180 = up. Everything is drawn in a local frame (x forward, y down, ground = 0). */
(function () {
  const { OUT, OW, clamp, lerp, shape, hull, rrect, poly, ell, hr } = TOON;
  const rad = (d) => (d * Math.PI) / 180;
  const dir = (a) => [Math.sin(rad(a)), Math.cos(rad(a))];
  const seg = (p, a, len) => { const d = dir(a); return [p[0] + d[0] * len, p[1] + d[1] * len]; };

  const B = {
    tetsu: { thigh: 78, shin: 76, torso: 150, tw: 132, ry: 0.62, hd: 52, hw: 54, hh: 56, ua: 70, fa: 64, ur: [21, 18], fr: [18, 20], lr: [25, 19], fist: 26, sw: 108, sh: 66,
      skin: "#f6c795", skinS: "#d99b66", boot: "#2c2a40", bootS: "#1b1a2b", shorts: "#2c2a40", shortsS: "#1b1a2b", wrap: "#f0782e", wrapS: "#c75a17", belt: "#f0782e" },
    gromila: { thigh: 92, shin: 88, torso: 225, tw: 316, ry: 0.64, hd: 58, hw: 86, hh: 76, ua: 104, fa: 92, ur: [50, 42], fr: [40, 46], lr: [44, 34], fist: 52, sw: 216, sh: 104,
      skin: "#e8a36c", skinS: "#c47a46", boot: "#5b2f22", bootS: "#3f1f16", shorts: "#7a2a5a", shortsS: "#561c3f", wrap: "#2b2430", wrapS: "#1a151d", belt: "#ffc530" },
  };

  /* poses: lean (torso tilt, + forward), head (extra tilt), na/fa = near/far arm [upper, fore], nl/fl = near/far leg [thigh, shin], face, mouth */
  const P = (lean, head, na, fa, nl, fl, face, mouth) => ({ lean, head, na, fa, nl, fl, face: face || "angry", mouth: mouth || "grit" });
  const POSES = {
    tetsu: {
      stand: P(3, 0, [14, 22], [-14, -10], [8, -4], [-10, 2], "angry", "grit"),
      guard: P(8, 4, [62, 162], [30, 150], [24, -16], [-20, 10], "angry", "grit"),
      windup: P(-12, -4, [-72, -66], [28, 150], [-12, -30], [34, 8], "angry", "grit"),
      strike: P(16, 6, [108, 132], [-30, -60], [42, 16], [-34, -6], "angry", "open"),
      recoil: P(-6, -4, [60, 120], [20, 100], [4, -10], [-14, 6], "shock", "open"),
      wag: P(2, 2, [100, 176], [-14, -10], [8, -4], [-10, 2], "smug", "grit"),
      point: P(6, 2, [104, 106], [-48, 30], [14, -6], [-14, 4], "angry", "grit"),
      shrug: P(0, 6, [52, 118], [-52, -118], [8, -4], [-10, 2], "shock", "flat"),
    },
    gromila: {
      stand: P(0, 0, [26, 16], [-26, -16], [8, -2], [-8, 2], "angry", "grit"),
      guard: P(4, 2, [72, 152], [48, 142], [18, -6], [-14, 6], "angry", "grit"),
      flex: P(0, 0, [100, 178], [-100, -178], [14, -2], [-14, 2], "smug", "grit"),
      hit: P(-20, -34, [-34, -64], [64, 104], [-6, -8], [-18, 10], "shock", "open"),
      kneel: P(-8, -22, [22, 8], [-12, 0], [2, -86], [84, 8], "dizzy", "open"),
    },
  };

  function lerpPose(a, b, u) {
    u = clamp(u);
    const L = (p, q) => [lerp(p[0], q[0], u), lerp(p[1], q[1], u)];
    return { lean: lerp(a.lean, b.lean, u), head: lerp(a.head, b.head, u), na: L(a.na, b.na), fa: L(a.fa, b.fa), nl: L(a.nl, b.nl), fl: L(a.fl, b.fl), face: u > 0.5 ? b.face : a.face, mouth: u > 0.5 ? b.mouth : a.mouth };
  }

  function eye(c, x, y, rw, rh, mood, inner, lid, iris, ow, t) {
    c.save();
    if (mood === "dizzy") {
      shape(c, ell(c, x, y, rw, rw), "#ffffff", null, [0, 0], ow);
      c.strokeStyle = OUT; c.lineWidth = ow * 0.7; c.lineCap = "round"; c.beginPath();
      for (let i = 0; i <= 40; i++) { const a = i * 0.45 + t * 6, r = (i / 40) * rw * 0.85; i ? c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r) : c.moveTo(x, y); }
      c.stroke(); c.restore(); return;
    }
    shape(c, ell(c, x, y, rw, rh), "#ffffff", null, [0, 0], ow);
    c.save(); ell(c, x, y, rw, rh)(); c.clip();
    const ir = mood === "shock" ? rh * 0.42 : rh * 0.62;
    c.fillStyle = iris; c.beginPath(); c.arc(x + inner * rw * 0.18, y + rh * 0.08, ir, 0, Math.PI * 2); c.fill();
    c.fillStyle = OUT; c.beginPath(); c.arc(x + inner * rw * 0.18, y + rh * 0.08, ir * 0.5, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#fff"; c.beginPath(); c.arc(x + inner * rw * 0.18 - ir * 0.25, y - ir * 0.15, ir * 0.18, 0, Math.PI * 2); c.fill();
    const cutIn = mood === "angry" ? rh * 1.05 : mood === "smug" ? rh * 0.8 : 0, cutOut = mood === "angry" ? rh * 0.15 : mood === "smug" ? rh * 0.8 : 0;
    if (cutIn || cutOut) {
      c.fillStyle = lid; c.beginPath();
      c.moveTo(x - rw - 4, y - rh - 4); c.lineTo(x + rw + 4, y - rh - 4);
      c.lineTo(x + rw + 4, y - rh + (inner > 0 ? cutOut : cutIn)); c.lineTo(x - rw - 4, y - rh + (inner > 0 ? cutIn : cutOut)); c.closePath(); c.fill();
      c.strokeStyle = OUT; c.lineWidth = ow; c.beginPath(); c.moveTo(x - rw - 4, y - rh + (inner > 0 ? cutIn : cutOut)); c.lineTo(x + rw + 4, y - rh + (inner > 0 ? cutOut : cutIn)); c.stroke();
    }
    c.restore();
    c.restore();
  }

  function mouth(c, x, y, w, kind, ow, t) {
    c.save(); c.lineJoin = "round"; c.lineCap = "round";
    if (kind === "grit") {
      shape(c, rrect(c, x - w / 2, y - w * 0.2, w, w * 0.4, w * 0.1), "#ffffff", null, [0, 0], ow);
      c.strokeStyle = OUT; c.lineWidth = ow * 0.6; c.beginPath();
      for (let i = 1; i < 5; i++) { c.moveTo(x - w / 2 + (w / 5) * i, y - w * 0.2); c.lineTo(x - w / 2 + (w / 5) * i, y + w * 0.2); }
      c.moveTo(x - w / 2, y); c.lineTo(x + w / 2, y); c.stroke();
    } else if (kind === "open") {
      shape(c, ell(c, x, y, w * 0.42, w * 0.34), "#5a1a1a", null, [0, 0], ow);
      c.save(); ell(c, x, y, w * 0.42, w * 0.34)(); c.clip(); c.fillStyle = "#ff7a8a"; c.beginPath(); c.ellipse(x, y + w * 0.3, w * 0.28, w * 0.2, 0, 0, Math.PI * 2); c.fill();
      c.fillStyle = "#fff"; c.fillRect(x - w * 0.36, y - w * 0.36, w * 0.72, w * 0.12); c.restore();
      c.strokeStyle = OUT; c.lineWidth = ow; ell(c, x, y, w * 0.42, w * 0.34)(); c.stroke();
    } else {
      c.strokeStyle = OUT; c.lineWidth = ow * 1.2; c.beginPath(); c.moveTo(x - w * 0.3, y); c.lineTo(x + w * 0.3, y); c.stroke();
    }
    c.restore();
  }

  /* draws one fighter; returns key points in canvas coordinates (head centre, chin, fist, top, feet) */
  function drawFigure(c, kind, pose, x, y, scale, flip, t, o = {}) {
    const b = B[kind], f = flip ? -1 : 1, s = scale, ow = OW / s, alpha = o.alpha === undefined ? 1 : o.alpha;
    const toCanvas = (p) => [x + f * p[0] * s, y + p[1] * s];
    const offs = (k) => [(-k * f) / s, -k / s];
    const ext = (l) => b.thigh * Math.cos(rad(l[0])) + b.shin * Math.cos(rad(l[1]));
    const hipH = Math.max(ext(pose.nl), ext(pose.fl));
    const lean = pose.lean + (o.sway || 0);
    const hip = [0, -hipH], ld = [Math.sin(rad(lean)), -Math.cos(rad(lean))], pp = [Math.cos(rad(lean)), Math.sin(rad(lean))];
    const S = [hip[0] + ld[0] * b.torso, hip[1] + ld[1] * b.torso];
    const ha = lean + pose.head, hd = [Math.sin(rad(ha)), -Math.cos(rad(ha))];
    const Hc = [S[0] + hd[0] * b.hd, S[1] + hd[1] * b.hd];
    const shade = 14 * (kind === "gromila" ? 1 : 0.7);
    c.save(); c.globalAlpha *= alpha; c.translate(x, y); c.scale(f * s, s); c.translate(0, 0);
    // shadow on the ground
    c.save(); c.fillStyle = "rgba(60,25,10,.28)"; c.beginPath(); c.ellipse(0, 4, b.tw * 0.62, b.tw * 0.1, 0, 0, Math.PI * 2); c.fill(); c.restore();

    const leg = (l, side) => {
      const h0 = [hip[0] + pp[0] * b.tw * 0.17 * side, hip[1] + pp[1] * b.tw * 0.17 * side];
      const k = seg(h0, l[0], b.thigh), a = seg(k, l[1], b.shin);
      shape(c, hull(c, h0, k, b.lr[0], (b.lr[0] + b.lr[1]) / 2), b.skin, b.skinS, offs(shade * 0.6), ow);
      shape(c, hull(c, k, a, (b.lr[0] + b.lr[1]) / 2, b.lr[1]), b.skin, b.skinS, offs(shade * 0.6), ow);
      shape(c, hull(c, [a[0] - 4, a[1] - 14], [a[0] + b.lr[1] * 1.7, a[1] - 6], b.lr[1] * 1.25, b.lr[1] * 0.95), b.boot, b.bootS, offs(shade * 0.5), ow);
      return a;
    };
    leg(pose.fl, -1); const footN = leg(pose.nl, 1);

    // torso (egg) + chest detail
    const C = [hip[0] + ld[0] * b.torso * 0.54, hip[1] + ld[1] * b.torso * 0.54], rx = b.tw / 2, ry = b.torso * b.ry;
    shape(c, ell(c, C[0], C[1], rx, ry, rad(lean)), b.skin, b.skinS, offs(shade), ow);
    c.save(); c.translate(C[0], C[1]); c.rotate(rad(lean)); c.strokeStyle = OUT; c.lineWidth = ow * 0.75; c.lineCap = "round";
    if (kind === "gromila") {
      c.beginPath(); c.moveTo(-rx * 0.62, -ry * 0.1); c.quadraticCurveTo(-rx * 0.32, ry * 0.2, -rx * 0.02, -ry * 0.02); c.moveTo(rx * 0.62, -ry * 0.1); c.quadraticCurveTo(rx * 0.32, ry * 0.2, rx * 0.02, -ry * 0.02); c.stroke();
      c.beginPath(); c.moveTo(0, -ry * 0.02); c.lineTo(0, ry * 0.45); c.stroke();
      for (let i = 0; i < 16; i++) { const px = (hr(3, i) - 0.5) * rx * 1.3, py = -ry * 0.55 + hr(4, i) * ry * 0.7, a = -0.5 + hr(5, i) * 1; c.beginPath(); c.moveTo(px, py); c.lineTo(px + Math.cos(a) * 14, py + Math.sin(a) * 9); c.stroke(); }
    } else {
      c.beginPath(); c.moveTo(-rx * 0.5, -ry * 0.12); c.quadraticCurveTo(-rx * 0.22, ry * 0.12, 0, -ry * 0.04); c.moveTo(rx * 0.5, -ry * 0.12); c.quadraticCurveTo(rx * 0.22, ry * 0.12, 0, -ry * 0.04); c.stroke();
      c.beginPath(); c.moveTo(-rx * 0.2, ry * 0.3); c.lineTo(rx * 0.2, ry * 0.3); c.moveTo(-rx * 0.18, ry * 0.5); c.lineTo(rx * 0.18, ry * 0.5); c.stroke();
    }
    c.restore();
    // shorts + belt
    c.save(); c.translate(hip[0], hip[1]); c.rotate(rad(lean));
    shape(c, rrect(c, -b.sw / 2, -b.sh * 0.62, b.sw, b.sh, b.sh * 0.36), b.shorts, b.shortsS, offs(shade * 0.7), ow);
    shape(c, rrect(c, -b.sw / 2 - 2, -b.sh * 0.62, b.sw + 4, b.sh * 0.27, b.sh * 0.1), b.belt, null, [0, 0], ow * 0.9);
    c.restore();

    const arm = (a, side, behind) => {
      const sh = [S[0] - ld[0] * b.torso * 0.16 + pp[0] * b.tw * 0.4 * side, S[1] - ld[1] * b.torso * 0.16 + pp[1] * b.tw * 0.4 * side];
      const e = seg(sh, a[0], b.ua), w = seg(e, a[1], b.fa);
      shape(c, hull(c, sh, e, b.ur[0], b.ur[1]), b.skin, b.skinS, offs(shade * 0.8), ow);
      shape(c, hull(c, e, w, b.fr[0], b.fr[1]), b.skin, b.skinS, offs(shade * 0.8), ow);
      const d = dir(a[1]), w0 = [w[0] - d[0] * b.fa * 0.34, w[1] - d[1] * b.fa * 0.34];
      shape(c, hull(c, w0, w, b.fr[1] * 1.08, b.fr[1] * 1.12), b.wrap, b.wrapS, offs(shade * 0.5), ow);
      const fp = [w[0] + d[0] * b.fist * 0.55, w[1] + d[1] * b.fist * 0.55];
      shape(c, ell(c, fp[0], fp[1], b.fist, b.fist * 0.92), b.skin, b.skinS, offs(shade * 0.6), ow);
      c.save(); c.strokeStyle = OUT; c.lineWidth = ow * 0.7; c.lineCap = "round"; c.beginPath();
      const nx = -d[1], ny = d[0];
      for (let i = -1; i <= 1; i++) { const q0 = [fp[0] + d[0] * b.fist * 0.15 + nx * i * b.fist * 0.4, fp[1] + d[1] * b.fist * 0.15 + ny * i * b.fist * 0.4]; c.moveTo(q0[0], q0[1]); c.lineTo(q0[0] + d[0] * b.fist * 0.6, q0[1] + d[1] * b.fist * 0.6); }
      c.stroke(); c.restore();
      return fp;
    };
    arm(pose.fa, -1);

    // head
    c.save(); c.translate(Hc[0], Hc[1]); c.rotate(rad(ha));
    const hw = b.hw, hh = b.hh, sk = b.skin, sS = b.skinS;
    if (kind === "gromila") {
      shape(c, ell(c, -hw, 8, 16, 22), sk, sS, offs(8), ow); shape(c, ell(c, hw, 8, 16, 22), sk, sS, offs(8), ow);
      shape(c, rrect(c, -hw, -hh, hw * 2, hh * 2, 30), sk, sS, offs(shade), ow);
      // buzz cut
      c.save(); rrect(c, -hw, -hh, hw * 2, hh * 2, 30)(); c.clip();
      c.fillStyle = "#2d1b16"; c.beginPath(); c.moveTo(-hw - 4, -hh - 4); c.lineTo(hw + 4, -hh - 4); c.lineTo(hw + 4, -hh * 0.38); c.lineTo(hw * 0.5, -hh * 0.2); c.lineTo(0, -hh * 0.42); c.lineTo(-hw * 0.5, -hh * 0.2); c.lineTo(-hw - 4, -hh * 0.38); c.closePath(); c.fill();
      c.restore();
      c.strokeStyle = OUT; c.lineWidth = ow; c.beginPath(); c.moveTo(-hw, -hh * 0.38); c.lineTo(-hw * 0.5, -hh * 0.2); c.lineTo(0, -hh * 0.42); c.lineTo(hw * 0.5, -hh * 0.2); c.lineTo(hw, -hh * 0.38); c.stroke();
      shape(c, ell(c, 4, 12, 15, 17), sk, sS, offs(5), ow * 0.9);
      eye(c, -hw * 0.42, -hh * 0.02, 17, 15, pose.face, 1, sk, "#7a4a1d", ow * 0.8, t); eye(c, hw * 0.42, -hh * 0.02, 17, 15, pose.face, -1, sk, "#7a4a1d", ow * 0.8, t);
      c.strokeStyle = OUT; c.lineWidth = ow * 1.9; c.lineCap = "round"; c.beginPath();
      const ang = pose.face === "angry" ? 14 : pose.face === "shock" ? -8 : pose.face === "smug" ? 8 : 0;
      c.moveTo(-hw * 0.72, -hh * 0.28 - (pose.face === "angry" ? 0 : 0)); c.lineTo(-hw * 0.12, -hh * 0.28 + ang); c.moveTo(hw * 0.72, -hh * 0.28); c.lineTo(hw * 0.12, -hh * 0.28 + ang); c.stroke();
      mouth(c, 0, hh * 0.58, hw * 0.78, pose.mouth, ow, t);
    } else {
      // flame crest + orange mask
      shape(c, poly(c, [[-hw * 0.5, -hh * 0.9], [-hw * 0.28, -hh * 1.5], [-hw * 0.02, -hh * 1.0], [hw * 0.18, -hh * 1.62], [hw * 0.42, -hh * 0.95], [hw * 0.7, -hh * 1.3], [hw * 0.8, -hh * 0.7]]), "#f0782e", "#c75a17", offs(5), ow);
      shape(c, rrect(c, -hw, -hh, hw * 2, hh * 2, 24), sk, sS, offs(shade * 0.8), ow);
      c.save(); rrect(c, -hw, -hh, hw * 2, hh * 2, 24)(); c.clip();
      const mask = () => { c.beginPath(); c.moveTo(-hw - 6, -hh - 6); c.lineTo(hw + 6, -hh - 6); c.lineTo(hw + 6, hh * 0.18); c.lineTo(hw * 0.3, hh * 0.3); c.lineTo(0, hh * 0.12); c.lineTo(-hw * 0.3, hh * 0.3); c.lineTo(-hw - 6, hh * 0.18); c.closePath(); };
      mask(); c.fillStyle = "#c75a17"; c.fill();
      c.save(); c.clip(); c.translate(offs(shade * 0.8)[0], offs(shade * 0.8)[1]); mask(); c.fillStyle = "#f0782e"; c.fill(); c.restore();
      mask(); c.lineWidth = ow; c.strokeStyle = OUT; c.stroke();
      c.restore();
      // white eye patches (lightning shape) + eyes
      const patch = (sd) => poly(c, [[sd * hw * 0.08, -hh * 0.2], [sd * hw * 0.5, -hh * 0.48], [sd * hw * 0.92, -hh * 0.3], [sd * hw * 0.74, hh * 0.02], [sd * hw * 0.34, hh * 0.1]]);
      shape(c, patch(-1), "#fff4d6", null, [0, 0], ow * 0.8); shape(c, patch(1), "#fff4d6", null, [0, 0], ow * 0.8);
      eye(c, -hw * 0.42, -hh * 0.12, 15, 13, pose.face, 1, "#fff4d6", "#ffd21f", ow * 0.7, t); eye(c, hw * 0.42, -hh * 0.12, 15, 13, pose.face, -1, "#fff4d6", "#ffd21f", ow * 0.7, t);
      mouth(c, 0, hh * 0.58, hw * 0.74, pose.mouth, ow, t);
    }
    c.restore();
    const fistN = arm(pose.na, 1);
    c.restore();
    return { head: toCanvas(Hc), chin: toCanvas([Hc[0] - hd[0] * b.hh, Hc[1] - hd[1] * b.hh]), fist: toCanvas(fistN), top: toCanvas([Hc[0] + hd[0] * b.hh, Hc[1] + hd[1] * b.hh]), feet: toCanvas(footN), hw: b.hw * s, hh: b.hh * s };
  }

  window.CHARS = { POSES, lerpPose, drawFigure, B };
})();
