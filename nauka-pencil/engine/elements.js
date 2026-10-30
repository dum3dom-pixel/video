/* Pencil infographics: callout, bigNumber, steps, versus, dotGrid, levels, card, button, brain, lever. */
(function () {
  const { S, pstroke, ellipsePts, closed, bez, prect, clipPoly, hatch, bboxOf, ptext, fitSize, hr, strSeed, clamp, lerp, easeOut, easeInOut, pr, col, PAL } = PE;
  const SZ = { xl: 132, l: 96, m: 70, s: 54 };
  const arrow = (a, b, o) => {
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), h = o.head || 34;
    pstroke([a, b], { ...o, seed: o.seed || 1 });
    pstroke([[b[0] - Math.cos(ang - 0.5) * h, b[1] - Math.sin(ang - 0.5) * h], b, [b[0] - Math.cos(ang + 0.5) * h, b[1] - Math.sin(ang + 0.5) * h]], { ...o, seed: (o.seed || 1) + 1, sketch: false });
  };
  const scribbleUnder = (x0, x1, y, o) => {
    const pts = [];
    const n = 14;
    for (let i = 0; i <= n; i++) pts.push([lerp(x0, x1, i / n), y + (i % 2 ? 7 : -3)]);
    pstroke(pts, { w: 5, ...o });
  };
  const checkMark = (cx, cy, s, o) => pstroke([[cx - s * 0.5, cy], [cx - s * 0.1, cy + s * 0.4], [cx + s * 0.6, cy - s * 0.5]], { w: 9, ...o });
  const wrapLines = (txt) => String(txt).split("\n");

  /* greedy wrap into lines no wider than maxW at this size */
  const wrapTo = (str, size, maxW) => {
    const out = []; let cur = "";
    for (const w of String(str).split(" ")) {
      const next = cur ? cur + " " + w : w;
      if (cur && PE.textWidth(next, size) > maxW) { out.push(cur); cur = w; } else cur = next;
    }
    if (cur) out.push(cur);
    return out;
  };

  const R = {};

  R.callout = (e, t, A) => {
    const c = e.color || "red", seed = strSeed("callout" + e.text);
    const w = Math.min(A.w, 1300), h = 420, x = A.cx - w / 2, y = A.top + Math.max(0, (A.h - h) / 2);
    S.ctx.save(); S.ctx.translate(A.cx, y + h / 2); S.ctx.rotate(-0.018); S.ctx.translate(-A.cx, -(y + h / 2));
    prect(x, y, w, h, { w: 6, col: c, seed, prog: pr(t, 0.1, 0.7), glow: 10 });
    hatch(clipPoly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]), [x, y, x + w, y + h], { angle: 55, gap: 18, col: c, alpha: 0.08 * pr(t, 0.4, 0.8), seed });
    const fs = fitSize(e.text, SZ.xl, w - 120);
    ptext(e.text, A.cx, y + h * 0.3, { size: fs, col: c, seed: seed + 1, prog: pr(t, 0.5, 0.7) });
    if (e.note) wrapTo(e.note, 60, w - 120).forEach((ln, i, all) => ptext(ln, A.cx, y + h * 0.7 + (i - (all.length - 1) / 2) * 70, { size: 60, col: "line", seed: seed + 2 + i, prog: pr(t, 1.2 + i * 0.6, 0.9) }));
    S.ctx.restore();
  };

  R.bigNumber = (e, t, A) => {
    const seed = strSeed("big" + e.value), y = A.top + A.h * 0.42;
    const fs = fitSize(e.value, 250, A.w - 100);
    const wv = PE.textWidth(e.value, fs);
    ptext(e.value, A.cx, y, { size: fs, col: "orange", seed, prog: pr(t, 0.2, 0.9) });
    scribbleUnder(A.cx - wv / 2, A.cx + wv / 2, y + fs * 0.55, { col: "orange", seed: seed + 5, prog: pr(t, 1.2, 0.5), glow: 8 });
    if (e.caption) ptext(e.caption, A.cx, y + fs * 0.55 + 100, { size: fitSize(e.caption, SZ.m, A.w), col: "grey", seed: seed + 3, prog: pr(t, 1.7, 0.9) });
  };

  R.steps = (e, t, A) => {
    const n = e.items.length, bw = Math.min(400, (A.w - 40) / n), base = A.top + A.h - 20;
    e.items.forEach((it, i) => {
      const c = it.color || "line", seed = strSeed("step" + it.label), h = 150 + i * 140, x = A.cx - (n * bw) / 2 + i * bw;
      const p = pr(t, 0.4 + i * 0.7, 0.6);
      if (p <= 0) return;
      prect(x + 10, base - h * easeOut(p), bw - 20, h * easeOut(p), { w: 5, col: c, seed, glow: c === "orange" ? 10 : 0 });
      if (p > 0.5) hatch(clipPoly([[x + 10, base - h], [x + bw - 10, base - h], [x + bw - 10, base], [x + 10, base]]), [x + 10, base - h, x + bw - 10, base], { angle: 60, gap: c === "orange" ? 9 : 22, col: c, alpha: c === "orange" ? 0.35 : 0.14, seed, prog: pr(t, 0.8 + i * 0.7, 0.8) });
      ptext(it.label, x + bw / 2, base - h - 50, { size: fitSize(it.label, SZ.m, bw - 20), col: c, seed: seed + 2, prog: pr(t, 0.9 + i * 0.7, 0.6) });
    });
    arrow([A.cx - (n * bw) / 2, base + 4], [A.cx + (n * bw) / 2 - 10, base + 4], { w: 4, col: "soft", seed: 99, prog: pr(t, 0.2, 0.8), head: 22 });
  };

  R.versus = (e, t, A) => {
    const seed = strSeed("vs" + e.left.label), pw = Math.min(640, (A.w - 140) / 2), py = A.top + 30, ph = 420;
    const sides = [["left", A.cx - 70 - pw], ["right", A.cx + 70]];
    sides.forEach(([k, x], i) => {
      const it = e[k], c = it.color || "line", p = pr(t, 0.2 + i * 0.5, 0.7);
      prect(x, py, pw, ph, { w: 5, col: c, seed: seed + i, prog: p, glow: c === "orange" ? 8 : 0 });
      ptext(it.label, x + pw / 2, py + 70, { size: fitSize(it.label, SZ.l, pw - 90), col: c, seed: seed + 10 + i, prog: pr(t, 0.5 + i * 0.5, 0.7) });
      // icon: straight arrow (push) vs curved arrow (turn)
      const q = pr(t, 1.0 + i * 0.5, 0.7), cx = x + pw / 2, cy = py + 270;
      if (i === 0) {
        arrow([cx - 140, cy], [cx - 140 + 280 * q, cy], { w: 9, col: c, seed: seed + 20, head: 40 });
      } else {
        const pts = ellipsePts(cx, cy, 100, 100, -Math.PI * 0.85, Math.PI * 0.55);
        pstroke(pts, { w: 9, col: c, seed: seed + 21, prog: q, glow: 10 });
        if (q > 0.95) { const b = pts[pts.length - 1]; pstroke([[b[0] - 36, b[1] - 8], b, [b[0] + 8, b[1] - 38]], { w: 9, col: c, seed: seed + 22, glow: 10, sketch: false }); }
      }
    });
    ptext("VS", A.cx, py + ph / 2, { size: 64, col: "soft", seed: seed + 5, prog: pr(t, 0.4, 0.4) });
    if (e.winner) {
      const x = e.winner === "right" ? A.cx + 70 : A.cx - 70 - pw, wp = pr(t, 2.6, 0.7);
      pstroke(closed(ellipsePts(x + pw / 2, py + ph / 2, pw * 0.62, ph * 0.66)), { w: 6, col: "green", seed: seed + 30, prog: wp, glow: 12 });
      if (wp > 0.9) checkMark(x + pw - 10, py - 10, 90, { col: "green", seed: seed + 31, glow: 12 });
    }
    if (e.note) ptext(e.note, A.cx, py + ph + 90, { size: fitSize(e.note, SZ.m, A.w), col: "grey", seed: seed + 6, prog: pr(t, 3.4, 0.8) });
  };

  R.dotGrid = (e, t, A) => {
    const seed = strSeed("dots" + e.count), n = e.count, cols = Math.min(5, Math.ceil(Math.sqrt(n))), rows = Math.ceil(n / cols);
    const gap = rows > 3 ? 100 : 112, gx = A.cx - ((cols - 1) * gap) / 2, gy = A.top + A.h * 0.52 - ((rows - 1) * gap) / 2 + 10;
    const hl = e.highlight === undefined ? 0 : e.highlight, hc = e.color || "orange";
    for (let i = 0; i < n; i++) {
      const r = Math.floor(i / cols), k = i % cols, p = pr(t, 0.15 + i * 0.06, 0.4);
      if (p <= 0) continue;
      const x = gx + k * gap, y = gy + r * gap, on = i < hl && t > 1.6, c = on ? hc : "line";
      const pts = ellipsePts(x, y, 38 * easeOut(p), 38 * easeOut(p));
      pstroke(closed(pts), { w: 4, col: c, seed: seed + i, glow: on ? 8 : 0 });
      hatch(clipPoly(pts), [x - 40, y - 40, x + 40, y + 40], { angle: 50, gap: on ? 7 : 12, col: c, alpha: on ? 0.55 : 0.25, seed: seed + i });
      pstroke([[x - 14, y - 6], [x - 14, y - 6]], { w: 7, col: c, seed: seed + 200 + i, sketch: false, gapP: 0 });
      pstroke([[x + 14, y - 6], [x + 14, y - 6]], { w: 7, col: c, seed: seed + 300 + i, sketch: false, gapP: 0 });
    }
    if (e.label) ptext(e.label, A.cx, A.top + 30, { size: fitSize(e.label, SZ.s, A.w), col: e.color || "grey", seed: seed + 1, prog: pr(t, 0.2, 0.9) });
    if (e.caption) ptext(e.caption, A.cx, A.top + A.h - 30, { size: fitSize(e.caption, SZ.l, A.w), col: hc, seed: seed + 2, prog: pr(t, 1.7, 0.8) });
  };

  R.levels = (e, t, A) => {
    const n = e.items.length, rh = Math.min(230, (A.h - 40) / n), w = Math.min(A.w, 1560), x = A.cx - w / 2, narrow = w < 1100;
    e.items.forEach((it, i) => {
      const c = it.color || "line", seed = strSeed("lv" + it.label + i), y = A.top + 20 + i * rh, p = pr(t, 0.2 + i * 0.7, 0.6);
      if (p <= 0) return;
      const lw = narrow ? w : w * 0.38, lh = narrow ? (rh - 36) * 0.5 : rh - 36;
      prect(x, y, lw, lh, { w: 5, col: c, seed, prog: p, glow: c === "line" ? 0 : 8 });
      hatch(clipPoly([[x, y], [x + lw, y], [x + lw, y + lh], [x, y + lh]]), [x, y, x + lw, y + lh], { angle: 60, gap: 14, col: c, alpha: 0.2, seed, prog: p });
      ptext(it.label, x + lw / 2, y + lh / 2, { size: fitSize(it.label, SZ.m, lw - 30), col: c, seed: seed + 1, prog: pr(t, 0.4 + i * 0.7, 0.6) });
      if (narrow) {
        ptext(it.text, x + w / 2, y + lh + 38, { size: fitSize(it.text, SZ.m, w - 20), col: "line", seed: seed + 3, prog: pr(t, 0.7 + i * 0.7, 0.8) });
      } else {
        arrow([x + lw + 20, y + lh / 2], [x + lw + 90, y + lh / 2], { w: 5, col: "soft", seed: seed + 2, prog: pr(t, 0.6 + i * 0.7, 0.4), head: 22 });
        ptext(it.text, x + lw + 130, y + lh / 2, { size: fitSize(it.text, SZ.m, w - lw - 160), col: "line", seed: seed + 3, prog: pr(t, 0.7 + i * 0.7, 0.8), align: "left" });
      }
    });
  };

  R.card = (e, t, A) => {
    const seed = strSeed("card" + e.title), w = Math.min(A.w, 1100), h = e.note ? 640 : 560, x = A.cx - w / 2, y = A.top + (A.h - h) / 2;
    const c = S.ctx;
    c.save(); c.translate(A.cx, y + h / 2); c.rotate(-0.02); c.translate(-A.cx, -(y + h / 2));
    c.fillStyle = PAL.paper2; c.fillRect(x, y, w, h);
    prect(x, y, w, h, { w: 5, col: "line", seed, prog: pr(t, 0.1, 0.6) });
    pstroke([[x + w - 70, y], [x + w - 70, y + 70], [x + w, y + 70]], { w: 4, col: "soft", seed: seed + 1, prog: pr(t, 0.5, 0.4) });
    ptext(e.title, x + 60, y + 90, { size: SZ.l, col: "orange", seed: seed + 2, prog: pr(t, 0.5, 0.6), align: "left" });
    scribbleUnder(x + 60, x + 60 + PE.textWidth(e.title, SZ.l), y + 150, { col: "orange", seed: seed + 3, prog: pr(t, 1.0, 0.4), glow: 6 });
    wrapLines(e.body).forEach((ln, i) => ptext(ln, x + 60, y + 250 + i * 90, { size: fitSize(ln, SZ.m, w - 120), col: "line", seed: seed + 10 + i, prog: pr(t, 1.3 + i * 0.7, 0.7), align: "left" }));
    if (e.note) ptext(e.note, x + 60, y + h - 60, { size: fitSize(e.note, SZ.s, w - 120), col: "grey", seed: seed + 5, prog: pr(t, 3.4, 0.8), align: "left" });
    if (e.page) ptext(`${e.page[0]}/${e.page[1]}`, x + w - 200, y + 90, { size: SZ.s, col: "soft", seed: seed + 6, prog: pr(t, 0.6, 0.3) });
    c.restore();
  };

  R.button = (e, t, A) => {
    const seed = strSeed("btn" + e.label), w = 720, h = 190, x = A.cx - w / 2, y = A.top + A.h * 0.62;
    const click = 2.0, pressed = t > click, bounce = pressed ? Math.max(0, 1 - (t - click) / 0.25) : 0;
    const c = S.ctx;
    c.save(); c.translate(A.cx, y + h / 2); c.scale(1 - 0.05 * bounce, 1 - 0.05 * bounce); c.translate(-A.cx, -(y + h / 2));
    const body = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
    hatch(clipPoly(body), [x, y, x + w, y + h], { angle: 55, gap: pressed ? 7 : 11, col: "red", alpha: pressed ? 0.7 : 0.4, seed, prog: pr(t, 0.4, 0.9) });
    prect(x, y, w, h, { w: 6, col: "red", seed, prog: pr(t, 0.1, 0.6), glow: 10 });
    ptext(e.label, A.cx, y + h / 2, { size: fitSize(e.label, SZ.l, w - 60), col: "white", seed: seed + 1, prog: pr(t, 0.7, 0.8) });
    c.restore();
    // cursor arrow glides in and clicks
    const k = easeInOut(pr(t, 1.0, 1.0)), cx0 = x + w + 140, cy0 = y + h + 160, cx = lerp(cx0, A.cx + 180, k) + 0, cy = lerp(cy0, y + h * 0.7, k) + bounce * 6;
    const cur = [[cx, cy], [cx, cy + 90], [cx + 24, cy + 68], [cx + 52, cy + 120], [cx + 74, cy + 108], [cx + 46, cy + 58], [cx + 80, cy + 56]];
    c.fillStyle = PAL.paper2; c.beginPath(); cur.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.closePath(); c.fill();
    pstroke(closed(cur), { w: 5, col: "line", seed: seed + 3, prog: pr(t, 1.0, 0.3) });
    if (pressed) for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2 + 0.3, r0 = 40 + 60 * (1 - bounce) , r1 = r0 + 36; pstroke([[A.cx + 180 + Math.cos(a) * r0, y + h * 0.7 + Math.sin(a) * r0], [A.cx + 180 + Math.cos(a) * r1, y + h * 0.7 + Math.sin(a) * r1]], { w: 4, col: "orange", seed: seed + 40 + i, alpha: bounce > 0 ? 1 : 0.0, glow: 6, sketch: false, gapP: 0 }); }
  };

  /* top-down head: skull + brain. Rotation: skull turns at once, brain lags and the tissue between stretches. */
  R.brain = (e, t, A) => {
    const mode = e.mode || "rest", cx = A.cx, cy = A.top + A.h * 0.47, hit = 0.7, seed = strSeed("brain" + mode);
    const rs = 215, rsy = 265, rb = 165, rby = 205;
    let skA = 0, brA = 0, skX = 0, brX = 0;
    if (mode === "rotate") { skA = 30 * easeOut(pr(t, hit, 0.18)); brA = 30 * easeInOut(pr(t, hit + 0.25, 1.1)) * 0.86; }
    if (mode === "push") { skX = 120 * easeOut(pr(t, hit, 0.18)); brX = 120 * easeInOut(pr(t, hit + 0.25, 1.0)) * 0.7; }
    const drift = mode === "rest" ? Math.sin(t * 2.4) * 7 : 0, driftY = mode === "rest" ? Math.cos(t * 1.9) * 5 : 0;
    const rot = (p, a, ox, oy) => { const r = (a * Math.PI) / 180, dx = p[0] - cx, dy = p[1] - cy; return [cx + ox + dx * Math.cos(r) - dy * Math.sin(r), cy + dx * Math.sin(r) + dy * Math.cos(r) + oy]; };
    const sk = (p) => rot(p, skA, skX, 0), br = (p) => rot(p, brA, brX + drift, driftY);
    const draw = pr(t, 0, 0.9);
    // skull
    const skullPts = ellipsePts(cx, cy, rs, rsy).map(sk);
    pstroke(closed(skullPts), { w: 8, col: "line", seed, prog: draw });
    pstroke([sk([cx - 60, cy - rsy + 10]), sk([cx, cy - rsy - 60]), sk([cx + 60, cy - rsy + 10])], { w: 7, col: "line", seed: seed + 1, prog: draw }); // nose = front
    pstroke(ellipsePts(cx - rs - 6, cy + 10, 16, 42).map(sk), { w: 6, col: "line", seed: seed + 2, prog: draw });
    pstroke(ellipsePts(cx + rs + 6, cy + 10, 16, 42).map(sk), { w: 6, col: "line", seed: seed + 3, prog: draw });
    // brain
    const brainPts = ellipsePts(cx, cy + 6, rb, rby).map(br);
    hatch(clipPoly(brainPts), bboxOf(brainPts), { angle: 55, gap: 9, col: "orange", alpha: 0.4, seed: seed + 4, prog: pr(t, 0.3, 1.0) });
    pstroke(closed(brainPts), { w: 7, col: "orange", seed: seed + 5, prog: pr(t, 0.3, 0.9), glow: 12 });
    pstroke([br([cx, cy - rby + 14]), br([cx, cy + rby - 4])], { w: 4, col: "orange", seed: seed + 6, prog: pr(t, 0.9, 0.5), alpha: 0.8 });
    for (let k = 0; k < 6; k++) {
      const y = cy - rby * 0.75 + k * (rby * 1.5) / 5;
      [-1, 1].forEach((sd, j) => pstroke([[cx + sd * 16, y], [cx + sd * 56, y - 22], [cx + sd * 96, y + 4], [cx + sd * 130, y - 16]].map(br), { w: 3.5, col: "orange", seed: seed + 10 + k * 2 + j, prog: pr(t, 1.0, 0.6), alpha: 0.75, sketch: false }));
    }
    // tissue between skull and brain: straight when at rest, slanted while they differ
    const shear = Math.abs(skA - brA) + Math.abs(skX - brX) / 8;
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI * 2 + 0.2, pb = br([cx + Math.cos(a) * rb, cy + 6 + Math.sin(a) * rby]), ps = sk([cx + Math.cos(a) * (rs - 8), cy + Math.sin(a) * (rsy - 8)]);
      const c = shear > 3 ? "red" : "soft";
      pstroke([pb, ps], { w: shear > 3 ? 4.5 : 2.5, col: c, seed: seed + 40 + k, prog: pr(t, 1.2, 0.5), alpha: shear > 3 ? 1 : 0.55, sketch: false, gapP: 0, glow: shear > 3 ? 8 : 0 });
    }
    ptext("череп", cx - rs - 120, cy - rsy + 20, { size: SZ.s, col: "line", seed: seed + 50, prog: pr(t, 0.5, 0.5) });
    ptext("мозг", cx + rb + 190, cy - 40, { size: SZ.s, col: "orange", seed: seed + 51, prog: pr(t, 0.9, 0.5) });
    if (mode === "rotate" && shear > 3) ptext("СДВИГ СЛОЁВ", cx, cy + rsy + 62, { size: fitSize("СДВИГ СЛОЁВ", SZ.m, 520), col: "red", seed: seed + 52, prog: pr(t, hit + 0.3, 0.5) });
    if (e.caption) ptext(e.caption, cx, A.top + A.h - 20, { size: fitSize(e.caption, SZ.m, A.w), col: "grey", seed: seed + 53, prog: pr(t, 1.6, 0.9) });
  };

  /* lever: same horizontal punch, through the centre of mass (head only moves) vs. at the chin (head turns) */
  const headLocal = {
    skull: () => ellipsePts(0, 0, 118, 128),
    jaw: [[-62, 92], [-92, 158], [-52, 190], [30, 164], [84, 108]],
    nose: [[-112, 6], [-150, 44], [-114, 52]],
  };
  function leverHead(x, y, turns, t, seed, title, c, note, t0, hitT) {
    const SC = 1.2, M = (p) => [x + (p[0] - x) * SC, y + (p[1] - y) * SC];
    const k = easeOut(pr(t, hitT, turns ? 0.22 : 0.3));
    const ang = turns ? (-34 * Math.PI) / 180 * k : 0, tx = (turns ? 26 : 90) * k;
    const T = (p) => { const ca = Math.cos(ang), sa = Math.sin(ang); return M([x + tx + p[0] * ca - p[1] * sa, y + p[0] * sa + p[1] * ca]); };
    const draw = pr(t, t0, 0.9), W0 = 6 * SC;
    const shoulderY = y + 300;
    // neck: fixed shoulders, attached to the head wherever it goes
    pstroke([T([84, 108]), M([x + 96, shoulderY])], { w: W0 - 1, col: "line", seed: seed + 1, prog: draw });
    pstroke([T([30, 164]), M([x + 24, shoulderY])], { w: W0 - 1, col: "line", seed: seed + 2, prog: draw });
    pstroke([M([x - 190, shoulderY + 4]), M([x + 230, shoulderY + 4])], { w: 5, col: "soft", seed: seed + 3, prog: draw });
    const skull = headLocal.skull().map(T);
    if (k > 0.05) {
      const g0 = headLocal.skull().map((p) => M([x + p[0], y + p[1]]));
      pstroke(closed(g0), { w: 3, col: "soft", seed: seed + 40, alpha: 0.35, sketch: false, gapP: 0.8 });
      if (turns) {
        const cc = T([0, 0]), arc = ellipsePts(cc[0], cc[1], 250, 250, 1.75, 0.2 + 0.0 * k);
        pstroke(arc, { w: 7, col: "orange", seed: seed + 41, prog: pr(t, hitT + 0.1, 0.5), glow: 10 });
        const e = arc[arc.length - 1];
        if (k > 0.9) pstroke([[e[0] - 8, e[1] - 40], e, [e[0] - 40, e[1] + 6]], { w: 7, col: "orange", seed: seed + 42, glow: 10, sketch: false });
      } else arrow(M([x + 150, y - 60]), M([x + 150 + 150 * k, y - 60]), { w: 7, col: "line", seed: seed + 43, head: 30, alpha: 0.9 });
    }
    hatch(clipPoly(skull), bboxOf(skull), { angle: 60, gap: 16, col: "line", alpha: 0.12, seed, prog: draw });
    pstroke(closed(skull), { w: W0, col: "line", seed: seed + 4, prog: draw });
    pstroke(headLocal.jaw.map(T), { w: W0, col: "line", seed: seed + 5, prog: draw });
    pstroke(headLocal.nose.map(T), { w: W0 - 1, col: "line", seed: seed + 6, prog: draw });
    const eye = T([-66, -22]); pstroke(ellipsePts(eye[0], eye[1], 9, 7), { w: 4, col: "line", seed: seed + 7, prog: draw, sketch: false });
    // centre of mass
    const com = T([0, 0]);
    pstroke(ellipsePts(com[0], com[1], 15, 15), { w: 5, col: "orange", seed: seed + 8, prog: draw, glow: 8, sketch: false });
    pstroke([[com[0] - 26, com[1]], [com[0] + 26, com[1]]], { w: 3, col: "orange", seed: seed + 9, prog: draw, sketch: false });
    pstroke([[com[0], com[1] - 26], [com[0], com[1] + 26]], { w: 3, col: "orange", seed: seed + 10, prog: draw, sketch: false });
    // punch: horizontal arrow from the left at the force line y0
    const y0 = turns ? y + 168 : y, xHit = turns ? x - 94 : x - 128, Y0 = M([x, y0])[1];
    const come = easeOut(pr(t, hitT - 1.1, 1.0)), hold = 1 - pr(t, hitT + 0.1, 0.4) * 0.6;
    const xs = lerp(M([x - 420, 0])[0], M([xHit - 14, 0])[0], come);
    if (come > 0) arrow([xs - 240, Y0], [xs, Y0], { w: 12, col: c, seed: seed + 20, head: 46, alpha: hold, glow: 10 });
    pstroke([M([x - 330, y0]), M([x + 200, y0])], { w: 3, col: c, seed: seed + 21, prog: pr(t, hitT - 0.9, 0.7), alpha: 0.55, sketch: false });
    const armX = M([x - 330, 0])[0];
    if (turns) {
      const q = pr(t, hitT - 0.6, 0.6), yA = M([x, y])[1];
      pstroke([[armX, yA], [armX, Y0]], { w: 6, col: "orange", seed: seed + 22, prog: q, glow: 8 });
      pstroke([[armX - 18, yA], [armX + 18, yA]], { w: 4, col: "orange", seed: seed + 23, prog: q, sketch: false });
      pstroke([[armX - 18, Y0], [armX + 18, Y0]], { w: 4, col: "orange", seed: seed + 24, prog: q, sketch: false });
      ptext("плечо", armX - 76, (yA + Y0) / 2, { size: SZ.s, col: "orange", seed: seed + 25, prog: pr(t, hitT - 0.2, 0.4) });
    } else ptext("плечо = 0", armX + 130, Y0 - 100, { size: SZ.s, col: "grey", seed: seed + 26, prog: pr(t, hitT - 0.5, 0.5) });
    ptext(title, x, y - 235, { size: fitSize(title, SZ.m, 560), col: c, seed: seed + 30, prog: pr(t, t0 + 0.1, 0.6) });
    ptext(note, x, shoulderY + 135, { size: SZ.m, col: c, seed: seed + 31, prog: pr(t, hitT + 0.3, 0.7) });
  }
  R.lever = (e, t, A) => {
    const y = 420;
    leverHead(A.cx - 450, y, false, t, 11, "В ЦЕНТР", "line", "голову толкает", 0.2, 3.2);
    leverHead(A.cx + 450, y, true, t, 23, "В ПОДБОРОДОК", "orange", "голова крутится", 5.7, 6.9);
    if (e.caption) ptext(e.caption, A.cx, 935, { size: fitSize(e.caption, SZ.m, A.w), col: "grey", seed: 5, prog: pr(t, 8.0, 0.9) });
  };

  window.ELEM = { R, SZ, scribbleUnder, arrow };
})();
