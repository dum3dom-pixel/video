/* Scene player for the cartoon hook: finds the scene at time t, draws background -> actors -> FX -> text -> subtitles. Pure function of t. */
(function () {
  const { W, H, OUT, clamp, lerp, easeOut, easeInOut, easeOutBack, pr, hr, comicText, textWidth, burst, star, drop, cloud, speedLines, drawBG, shape, hull, rrect, poly, ell } = TOON;
  const { POSES, lerpPose, drawFigure } = CHARS;
  const SPEC = window.SPEC, GY = 955;
  const scratch = document.createElement("canvas").getContext("2d");
  const figPts = (kind, pose, x, y, sc, flip) => drawFigure(scratch, kind, pose, x, y, sc, flip, 0, {});
  const TS = 1.15, GS = 1.2;

  const sceneAt = (t) => { for (let i = SPEC.scenes.length - 1; i >= 0; i--) if (t >= SPEC.scenes[i].start - 1e-6) return SPEC.scenes[i]; return SPEC.scenes[0]; };
  const wt = (sc, prefix, def) => { const w = (sc.words || []).find((x) => x.w.toLowerCase().replace(/[^а-яёa-z0-9]/g, "").startsWith(prefix)); return w ? w.t : def; };
  const pop = (c, str, x, y, size, t, t0, o = {}) => comicText(c, str, x, y, size, { ...o, sc: (o.sc || 1) * easeOutBack(pr(t, t0, 0.32)), alpha: pr(t, t0, 0.05) });
  const RED = ["#ff6a5c", "#d3202a"], ORANGE = ["#ffa24a", "#f0601a"], WHITE = ["#ffffff", "#ffe9c4"], YEL = ["#ffe66b", "#ffae1a"];

  /* ---- FX ---- */
  function hitFx(c, t, hit, pt, seed, label) {
    const k = t - hit;
    if (k < 0 || k > 1.1) return;
    const r = 175 * easeOutBack(pr(k, 0, 0.16)) * (1 - 0.8 * pr(k, 0.3, 0.3));
    if (r > 2 && k < 0.6) burst(c, pt[0], pt[1], r, 0.15 * seed, seed, k);
    if (label && k < 0.7) comicText(c, label, pt[0] - 30, pt[1] - 10, 120, { rot: -0.14, fill: ["#ffffff", "#ffe08a"], ow: 0.22, outer: null, sc: easeOutBack(pr(k, 0.02, 0.2)) * (1 - pr(k, 0.5, 0.2)) });
    for (let i = 0; i < 11; i++) {
      const a = -Math.PI * (0.05 + 0.9 * hr(seed, i)) + (hr(seed, i, 1) - 0.5) * 0.5, v = 450 + hr(seed, i, 2) * 650, rr = 11 + hr(seed, i, 3) * 11;
      const x = pt[0] + Math.cos(a) * v * k * (Math.cos(a) > 0 ? 1 : 1), y = pt[1] + Math.sin(a) * v * k + 1700 * k * k;
      if (k < 0.95) drop(c, x, y, rr * (1 - 0.4 * k), Math.atan2(Math.sin(a) * v + 3400 * k, Math.cos(a) * v) - Math.PI / 2);
    }
  }
  function smoke(c, x, y, k, seed, col) {
    if (k < 0 || k > 1.4) return;
    for (let i = 0; i < 4; i++) {
      const u = clamp(k / 1.2), dx = (hr(seed, i) - 0.5) * 220 * easeOut(u), dy = -90 * easeOut(u) - hr(seed, i, 1) * 60 * u, s = (0.35 + hr(seed, i, 2) * 0.4) * (0.5 + 0.9 * easeOut(u));
      c.save(); c.globalAlpha *= 1 - pr(u, 0.55, 0.45); cloud(c, x + dx, y + dy, s, col[0], col[1], i); c.restore();
    }
  }
  function dizzyStars(c, t, head, hw, hh) {
    for (let i = 0; i < 4; i++) {
      const a = t * 5 + (i * Math.PI) / 2, x = head[0] + Math.cos(a) * (hw * 1.15), y = head[1] - hh * 1.15 + Math.sin(a) * 18;
      star(c, x, y, 20 + 4 * Math.sin(t * 8 + i), a * 0.6, "#ffe14d", i);
    }
  }
  function shakeAt(t, at, amp) { if (t < at) return [0, 0]; const k = Math.max(0, 1 - (t - at) / 0.55), s = Math.floor(t * 30); return [(hr(s, 1) - 0.5) * 2 * amp * k, (hr(s, 2) - 0.5) * 2 * amp * k]; }

  /* ---- shared actors ---- */
  function tetsuStrike(t, hit, x0, x1, x2) {
    const T = POSES.tetsu;
    const x = t < hit ? lerp(x0, x1, easeInOut(pr(t, 0, hit))) : lerp(x1, x2, easeOut(pr(t, hit + 0.05, 0.5)));
    let pose;
    if (t < hit - 0.3) pose = T.windup; else if (t < hit) pose = lerpPose(T.windup, T.strike, easeInOut(pr(t, hit - 0.3, 0.3)));
    else if (t < hit + 0.1) pose = T.strike; else pose = lerpPose(T.strike, T.guard, easeInOut(pr(t, hit + 0.1, 0.6)));
    return { x, pose, y: GY - 95 * Math.sin(Math.PI * pr(t, 0, hit + 0.5)) };
  }
  function gromilaHit(t, hit, x0, push, kneel) {
    const G = POSES.gromila;
    let pose = lerpPose(G.guard, G.hit, easeOut(pr(t, hit, 0.12)));
    if (t < hit) pose = G.guard;
    if (kneel) pose = t < hit + 0.3 ? pose : lerpPose(G.hit, G.kneel, easeInOut(pr(t, hit + 0.3, 0.55)));
    return { x: x0 + push * easeOut(pr(t, hit, kneel ? 0.8 : 0.45)), pose, y: GY };
  }
  const tetsuHitPt = (hit, x0, x1, x2) => { const a = tetsuStrike(hit, hit, x0, x1, x2); const p = figPts("tetsu", a.pose, a.x, a.y, TS, false); return [p.fist[0] + 26, p.fist[1] - 8]; };

  /* ---- scenes ---- */
  const S = {};

  S.hook = (c, t, sc) => {
    const hit = wt(sc, "вырубает", 0.74), x0 = 1430;
    drawBG(c, "day", t);
    speedLines(c, t, 11, 14, 0.55 * (1 - pr(t, hit - 0.1, 0.5)), 1, 80, 880);
    const g = gromilaHit(t, hit, x0, 60, false);
    smoke(c, g.x - 20, 700, t - hit - 0.05, 3, ["#c9c3bb", "#9d958c"]);
    const gp = drawFigure(c, "gromila", g.pose, g.x, g.y, GS, true, t, { sway: t < hit ? 1.2 * Math.sin(t * 3) : 0 });
    const a = tetsuStrike(t, hit, 560, 1085, 900);
    drawFigure(c, "tetsu", a.pose, a.x, a.y, TS, false, t);
    hitFx(c, t, hit, tetsuHitPt(hit, 560, 1085, 900), 5, "БАХ!");
    pop(c, "ВЫРУБАЕТ", 700, 120, 96, t, hit, { fill: WHITE });
    pop(c, "НЕ СИЛА", 700, 290, 210, t, wt(sc, "не", 1.2), { fill: RED, rot: -0.04 });
    return { hit, shake: 22, flash: hit };
  };

  S.size = (c, t, sc) => {
    drawBG(c, "day", t);
    const ts = POSES.tetsu, gs = POSES.gromila;
    const bob = 3 * Math.sin(t * 3.2);
    const flex = gs.flex;
    const gx = 1330, tx = 500;
    const gp = drawFigure(c, "gromila", flex, gx, GY, GS * (1 + 0.012 * Math.sin(t * 4)), true, t);
    const tp = drawFigure(c, "tetsu", ts.guard, tx, GY + bob * 0.4, TS, false, t, { sway: 3 * Math.sin(t * 3.2) });
    const yT = tp.top[1], yG = gp.top[1];
    // measuring guides
    const kLine = pr(t, wt(sc, "голову", 2.4) - 0.1, 0.4);
    c.save(); c.setLineDash([22, 16]); c.lineWidth = 6; c.strokeStyle = "#fff"; c.globalAlpha = 0.95;
    c.beginPath(); c.moveTo(tp.top[0] + 70, yT); c.lineTo(lerp(tp.top[0] + 70, gp.top[0] - 150, easeOut(kLine)), yT); c.stroke();
    c.beginPath(); c.moveTo(gp.top[0] - 150, yG); c.lineTo(lerp(gp.top[0] - 150, tp.top[0] + 70, easeOut(kLine)), yG); c.stroke();
    c.setLineDash([]);
    const bx = 760;
    if (kLine > 0) {
      c.lineWidth = 9; c.strokeStyle = OUT; c.beginPath(); c.moveTo(bx, yT); c.lineTo(bx, lerp(yT, yG, easeOut(kLine))); c.stroke();
      c.lineWidth = 5; c.strokeStyle = "#ffe14d"; c.stroke();
      c.fillStyle = "#ffe14d"; c.strokeStyle = OUT; c.lineWidth = 5;
      [[yG, 1], [yT, -1]].forEach(([y, d]) => { c.beginPath(); c.moveTo(bx, y); c.lineTo(bx - 17, y + d * 30); c.lineTo(bx + 17, y + d * 30); c.closePath(); c.fill(); c.stroke(); });
    }
    c.restore();
    pop(c, "НА ГОЛОВУ НИЖЕ", 660, yG - 70, 66, t, wt(sc, "голову", 2.4), { fill: YEL, rot: -0.03 });
    pop(c, "2 М", gx, 118, 170, t, wt(sc, "метра", 0.43), { fill: YEL, rot: -0.04 });
    pop(c, "ТЯЖЕЛОВЕС", gx, yG - 62, 84, t, wt(sc, "тяжеловес", 0.9), { fill: RED });
    pop(c, "СРЕДНИЙ ВЕС", tx, yT - 70, 80, t, wt(sc, "парня", 2.0), { fill: ["#7fe3ff", "#2f9bd6"] });
    // ruler on the right edge
    const kr = easeOut(pr(t, wt(sc, "метра", 0.43), 0.5)), rx = 1830;
    c.save(); c.lineCap = "round";
    c.strokeStyle = OUT; c.lineWidth = 15; c.beginPath(); c.moveTo(rx, GY); c.lineTo(rx, lerp(GY, yG, kr)); c.stroke();
    c.strokeStyle = "#ffe14d"; c.lineWidth = 8; c.stroke();
    for (let i = 0; i <= 4; i++) { const y = lerp(GY, yG, i / 4); if (kr >= i / 4) { c.strokeStyle = OUT; c.lineWidth = 14; c.beginPath(); c.moveTo(rx - 30, y); c.lineTo(rx + 8, y); c.stroke(); c.strokeStyle = "#fff"; c.lineWidth = 7; c.stroke(); } }
    c.restore();
    return {};
  };

  S.punch = (c, t, sc) => {
    const hit = wt(sc, "подбородок", 0.9) + 0.1, x0 = 1430;
    drawBG(c, "day", t);
    speedLines(c, t, 21, 10, 0.4 * (1 - pr(t, hit, 0.4)), 1, 80, 880);
    const g = gromilaHit(t, hit, x0, 100, true);
    smoke(c, g.x - 20, 700, t - hit - 0.05, 4, ["#c9c3bb", "#9d958c"]);
    if (t > hit + 0.55) smoke(c, g.x + 20, GY - 70, t - hit - 0.55, 9, ["#f2d29b", "#d9a863"]);
    const gp = drawFigure(c, "gromila", g.pose, g.x, g.y, GS, true, t, { sway: t > hit + 0.9 ? 3.5 * Math.sin(t * 5) : 0 });
    const a = tetsuStrike(t, hit, 620, 1085, 880);
    const tp = drawFigure(c, "tetsu", a.pose, a.x, a.y, TS, false, t);
    const hp = tetsuHitPt(hit, 620, 1085, 880);
    // orange trajectory arc
    const ka = pr(t, 0.25, hit - 0.35), fade = 1 - pr(t, hit, 0.35);
    if (ka > 0 && fade > 0) {
      const P0 = [770, 830], P1 = [930, 900], P2 = [hp[0] - 20, hp[1] + 10], n = 28;
      c.save(); c.globalAlpha = fade; c.lineCap = "round"; c.lineJoin = "round";
      const pts = []; for (let i = 0; i <= n * ka; i++) { const u = i / n; pts.push([(1 - u) * (1 - u) * P0[0] + 2 * u * (1 - u) * P1[0] + u * u * P2[0], (1 - u) * (1 - u) * P0[1] + 2 * u * (1 - u) * P1[1] + u * u * P2[1]]); }
      const draw = (w, col) => { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.stroke(); };
      draw(30, OUT); draw(17, "#ff8a2b");
      if (ka > 0.95) { const e = pts[pts.length - 1], q = pts[pts.length - 3], an = Math.atan2(e[1] - q[1], e[0] - q[0]); c.fillStyle = "#ff8a2b"; c.strokeStyle = OUT; c.lineWidth = 9; c.beginPath(); c.moveTo(e[0] + Math.cos(an) * 34, e[1] + Math.sin(an) * 34); c.lineTo(e[0] + Math.cos(an + 2.3) * 40, e[1] + Math.sin(an + 2.3) * 40); c.lineTo(e[0] + Math.cos(an - 2.3) * 40, e[1] + Math.sin(an - 2.3) * 40); c.closePath(); c.stroke(); c.fill(); }
      c.restore();
    }
    // dust + stars
    if (t > hit + 0.7) dizzyStars(c, t, gp.head, gp.hw, gp.hh);
    hitFx(c, t, hit, hp, 8, "БАХ!");
    pop(c, "1 БОКОВОЙ", 700, 130, 150, t, wt(sc, "боковой", 0.49) - 0.1, { fill: ORANGE, rot: -0.04 });
    pop(c, "В ПОДБОРОДОК", 700, 280, 100, t, wt(sc, "подбородок", 0.9), { fill: WHITE });
    return { hit, shake: 26, flash: hit };
  };

  S.myth = (c, t, sc) => {
    const tN = wt(sc, "нет", 2.9), ts = POSES.tetsu;
    drawBG(c, "red", t);
    speedLines(c, t, 31, 9, 0.22, -1, 80, 880, "255,230,150");
    const gx = 1340;
    const gp = drawFigure(c, "gromila", POSES.gromila.flex, gx, GY, GS * 1.04 * (1 + 0.016 * Math.sin(t * 5)), true, t);
    for (let i = 0; i < 5; i++) { const ph = (t * 1.6 + i * 0.37) % 1, a = hr(40, i) * Math.PI * 2; if (ph < 0.6) star(c, gx + Math.cos(a) * 330, 560 + Math.sin(a) * 190, 24 * Math.sin(Math.PI * ph / 0.6) + 2, ph * 3, "#ffe14d", i); }
    const wag = t > tN ? lerpPose(ts.stand, ts.wag, easeOut(pr(t, tN, 0.2))) : ts.stand;
    const wagP = t > tN ? { ...wag, na: [100, 172 + 22 * Math.sin((t - tN) * 14)] } : wag;
    drawFigure(c, "tetsu", wagP, 470, GY, TS, false, t, { sway: 0 });
    pop(c, "СИЛЬНЕЕ БЬЁШЬ —", 760, 130, 100, t, wt(sc, "сильнее", 0.1), { fill: WHITE, rot: -0.02 });
    pop(c, "БЫСТРЕЕ ВЫРУБИШЬ?", 760, 262, 100, t, wt(sc, "быстрее", 1.2), { fill: WHITE, rot: 0.015 });
    // red cross-out + stamp on "Нет"
    const kx = easeOut(pr(t, tN - 0.02, 0.18));
    if (kx > 0) {
      c.save(); c.lineCap = "round";
      [[330, 70, 1190, 330]].forEach((l) => {
        c.strokeStyle = OUT; c.lineWidth = 30; c.beginPath(); c.moveTo(l[0], l[1]); c.lineTo(lerp(l[0], l[2], kx), lerp(l[1], l[3], kx)); c.stroke();
        c.strokeStyle = "#ff3030"; c.lineWidth = 18; c.stroke();
      });
      c.restore();
    }
    const ks = pr(t, tN + 0.08, 0.2);
    if (ks > 0) {
      const sc2 = lerp(2.6, 1, easeOut(ks));
      comicText(c, "МИФ", 1010, 660, 300, { fill: RED, rot: -0.14, sc: sc2, ow: 0.17, alpha: clamp(ks * 4) });
    }
    return { hit: tN + 0.08, shake: 24, flash: tN + 0.08 };
  };

  S.doc = (c, t, sc) => {
    drawBG(c, "teal", t);
    const tt = wt(sc, "эксперимент", 0.1), t72 = wt(sc, "семьдесят", 0.75), tq = wt(sc, "другое", 2.9);
    const G = POSES.gromila, ts = POSES.tetsu;
    const gp = drawFigure(c, "gromila", G.kneel, 1660, GY, 0.82, true, t, { sway: 4 * Math.sin(t * 5) });
    dizzyStars(c, t, gp.head, gp.hw, gp.hh);
    drawFigure(c, "tetsu", lerpPose(ts.stand, ts.point, easeOut(pr(t, tt + 0.1, 0.35))), 450, GY, TS, false, t, { sway: 0 });
    // wooden sign
    const sk = easeOutBack(pr(t, tt, 0.4)), cx = 1060, cy = 500;
    c.save(); c.translate(cx, cy + 190); c.scale(sk, sk); c.translate(-cx, -(cy + 190));
    shape(c, hull(c, [cx, cy + 200], [cx, GY], 26, 30), "#a8672f", "#7e4a20", [-6, -6], 9);
    c.translate(cx, cy); c.rotate(-0.025);
    shape(c, rrect(c, -390, -215, 780, 430, 40), "#d99a52", "#a8672f", [-10, -10], 10);
    c.strokeStyle = OUT; c.lineWidth = 6; c.beginPath(); c.moveTo(-390, -75); c.lineTo(390, -75); c.moveTo(-390, 70); c.lineTo(390, 70); c.stroke();
    [[-340, -170], [340, -170], [-340, 170], [340, 170]].forEach((p) => shape(c, ell(c, p[0], p[1], 10, 10), "#ffe9b0", null, [0, 0], 4));
    c.restore();
    pop(c, "1972", cx, cy - 10, 240, t, t72, { fill: YEL, rot: -0.025 });
    pop(c, "ЭКСПЕРИМЕНТ", cx, cy + 135, 82, t, tt + 0.25, { fill: WHITE, rot: -0.025 });
    pop(c, "?", 1060, 130, 230, t, tq, { fill: ORANGE, rot: 0.1 });
    return { hit: tq, shake: 12, flash: -1 };
  };

  S.three = (c, t, sc) => {
    drawBG(c, "dusk", t);
    const tp = wt(sc, "почему", 2.5), tu = wt(sc, "упал", 2.9), tb = wt(sc, "большой", 3.6), tr = wt(sc, "три", 0.1);
    const G = POSES.gromila, ts = POSES.tetsu;
    const gp = drawFigure(c, "gromila", G.kneel, 1400, GY, GS, true, t, { sway: 4 * Math.sin(t * 5) });
    dizzyStars(c, t, gp.head, gp.hw, gp.hh);
    drawFigure(c, "tetsu", t > tp ? lerpPose(ts.stand, ts.shrug, easeOut(pr(t, tp, 0.3))) : ts.stand, 470, GY, TS, false, t, { sway: 0 });
    const gone = 1 - pr(t, 1.75, 0.2);
    if (gone > 0) {
      c.save(); c.globalAlpha *= gone;
      pop(c, "3 ПРИЧИНЫ", 740, 140, 150, t, tr, { fill: YEL, rot: -0.03 });
      [3, 2, 1].forEach((n, i) => {
        const t0 = 0.4 + i * 0.3, k = easeOutBack(pr(t, t0, 0.3)), x = 440 + i * 165, y = 360;
        if (k <= 0) return;
        c.save(); c.translate(x, y); c.scale(k, k);
        shape(c, ell(c, 0, 0, 70, 70), "#ff8a2b", "#d9561a", [-10, -10], 10);
        c.restore();
        comicText(c, String(n), x, y + 4, 110, { fill: WHITE, sc: k, ow: 0.18, outer: null });
      });
      c.restore();
    }
    pop(c, "ПОЧЕМУ УПАЛ", 760, 105, 100, t, tp, { fill: WHITE, rot: -0.02 });
    pop(c, "БОЛЬШОЙ?", 760, 300, 215, t, tb, { fill: ORANGE, rot: 0.03 });
    return { hit: tb, shake: 22, flash: tb };
  };

  /* ---- frame ---- */
  function subtitles(c, sc, tg) {
    if (!SPEC.subtitles || !sc.words || !sc.words.length) return;
    const t = tg - sc.start, ws = sc.words;
    let cur = -1;
    for (let i = 0; i < ws.length; i++) if (t >= ws[i].t - 0.02) cur = i;
    if (cur < 0) return;
    const group = 4, g0 = Math.floor(cur / group) * group, chunk = ws.slice(g0, g0 + group), size = 62;
    const widths = chunk.map((w) => textWidth(c, w.w.toUpperCase(), size)), sp = size * 0.3;
    let x = 960 - (widths.reduce((a, b) => a + b, 0) + sp * (chunk.length - 1)) / 2;
    chunk.forEach((w, i) => {
      const on = g0 + i === cur;
      comicText(c, w.w.toUpperCase(), x + widths[i] / 2, 1020, size, { fill: on ? YEL : WHITE, outer: null, ow: 0.17, sc: on ? 1.08 : 1 });
      x += widths[i] + sp;
    });
  }

  function render(tReal) {
    const tg = Math.min(tReal, SPEC.total - 1e-3), sc = sceneAt(tg), t = tg - sc.start, idx = SPEC.scenes.indexOf(sc);
    const c = window.TOON_CTX;
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.clearRect(0, 0, W, H);
    c.save();
    const zoomIn = idx === 0 ? 0 : 0.07 * (1 - easeOut(pr(t, 0, 0.35)));
    const z = 1 + 0.025 * (t / sc.dur) + zoomIn;
    const info = S[sc.id](c, t, sc) || {};
    c.restore();
    // camera (slow push-in, punch-in at the cut, shake on hits) is a second pass over the finished frame
    const off = info.hit !== undefined ? shakeAt(t, info.hit, info.shake || 0) : [0, 0];
    if (z !== 1 || off[0] || off[1]) {
      const tmp = render.tmp || (render.tmp = Object.assign(document.createElement("canvas"), { width: W, height: H }));
      const tc = tmp.getContext("2d"); tc.setTransform(1, 0, 0, 1, 0, 0); tc.clearRect(0, 0, W, H); tc.drawImage(c.canvas, 0, 0);
      c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H);
      c.translate(W / 2 + off[0], H / 2 + off[1]); c.scale(z, z); c.translate(-W / 2, -H / 2); c.drawImage(tmp, 0, 0); c.setTransform(1, 0, 0, 1, 0, 0);
    }
    if (info.flash !== undefined && info.flash >= 0) { const k = (t - info.flash) / 0.14; if (k >= 0 && k < 1) { c.fillStyle = `rgba(255,255,255,${0.75 * (1 - k)})`; c.fillRect(0, 0, W, H); } }
    subtitles(c, sc, tg);
  }
  window.TOON_RENDER = render;
})();
