/* Scene player: finds the scene at time t, draws paper -> guides -> characters -> element -> text -> effects -> HUD, all on twos. */
(function () {
  const { S, pstroke, ellipsePts, closed, ptext, fitSize, hr, strSeed, clamp, lerp, easeOut, easeInOut, pr, W, H } = PE;
  const SPEC = window.SPEC;
  const SZ = ELEM.SZ;
  const GROUND = 975;

  function parseChar(c) {
    const src = Array.isArray(c.src) ? c.src : [c.src];
    const names = src.map((s) => s.replace(/^.*\//, "").replace(/\.\w+$/, ""));
    const kind = src[0].includes("/gromila/") ? "gromila" : src[0].includes("/doc/") ? "doc" : "tetsu";
    return { kind, names, pos: c.pos || "center", height: c.height, dim: c.dim };
  }

  function sceneAt(t) {
    for (let i = SPEC.scenes.length - 1; i >= 0; i--) if (t >= SPEC.scenes[i].start - 1e-6) return SPEC.scenes[i];
    return SPEC.scenes[0];
  }

  /* pose of a character at scene time t */
  function poseFor(ch, sc, t) {
    const P = FIG.POSES;
    const at = sc.impact ? sc.impact.at : null;
    const key = (n) => P[n === "clipboard" && ch.kind === "doc" ? "clipboard" : n === "explain" && ch.kind === "doc" ? "doc_explain" : n] || P.stand;
    let names = ch.names;
    if (ch.kind === "tetsu" && at !== null && names.length === 1 && names[0] === "hook_3") names = ["hook_1", "hook_2", "hook_3"];
    if (names.length > 1) {
      const end = at !== null ? at : 1.2, seg = end / (names.length - 1);
      const i = Math.min(names.length - 2, Math.floor(Math.max(0, t) / seg));
      return FIG.lerpPose(key(names[i]), key(names[i + 1]), easeInOut((t - i * seg) / Math.min(seg, 0.35)));
    }
    const target = key(names[0]);
    if (ch.kind === "gromila" && names[0].startsWith("stagger") && at !== null) return FIG.lerpPose(P.guard, target, easeOut(pr(t, at, 0.3)));
    return FIG.lerpPose(P.stand, target, easeOut(pr(t, 0.05, 0.3)));
  }

  function layoutChars(sc) {
    const chars = (sc.characters || []).map(parseChar);
    const front = chars.filter((c) => c.pos !== "bg");
    const two = front.length >= 2;
    return chars.map((c) => {
      let h = c.height || 820;
      if (c.pos === "bg") h = Math.min(h, 980);
      else if (two) h = c.kind === "gromila" ? Math.min(h, 700) : Math.min(h, 600);
      else h = Math.min(h, c.kind === "gromila" ? 860 : 820);
      let x = c.pos === "left" ? (two ? 700 : 480) : c.pos === "right" ? (two ? 1130 : 1440) : c.pos === "bg" ? 960 : 960;
      if (two) { x = c.pos === "left" ? 700 : 1130; }
      return { ...c, h, x, flip: c.pos === "right" };
    });
  }

  function textLayout(sc, A, hasEl) {
    const lines = sc.text.lines, pos = sc.text.pos;
    const sizes = lines.map((l) => fitSize(l.text, SZ[l.size || "m"], A.w));
    const lh = sizes.map((s) => s * 1.28), total = lh.reduce((a, b) => a + b, 0);
    const topMode = hasEl || pos === "top" || A.both;
    const minY = sc.tag ? 135 : 40;
    let y = topMode ? minY : clamp(H / 2 - total / 2 - 40, Math.max(minY, 90), 400);
    return { sizes, lh, total, y };
  }

  function areaFor(sc, chars) {
    const front = chars.filter((c) => c.pos !== "bg");
    const left = front.some((c) => c.pos === "left"), right = front.some((c) => c.pos === "right");
    const A = { cx: 960, w: 1560, both: left && right };
    if (A.both) A.w = 1500;
    else if (left) { A.cx = 1330; A.w = 820; }
    else if (right) { A.cx = 600; A.w = 900; }
    A.top = sc.tag ? 130 : 60; A.h = 920 - A.top;
    if (sc.text && sc.text.lines && sc.text.lines.length) {
      A.tl = textLayout(sc, A, Boolean(sc.element));
      if (sc.element || sc.text.pos === "top" || A.both) { A.top = A.tl.y + A.tl.total + 20; A.h = 930 - A.top; }
    }
    return A;
  }

  function drawText(sc, t, A, hasEl, dur) {
    const lines = sc.text.lines, { sizes, lh } = A.tl;
    let y = A.tl.y;
    lines.forEach((l, i) => {
      const t0 = 0.25 + i * Math.min(1.1, (dur * 0.45) / lines.length), seed = strSeed(sc.id + l.text);
      const p = pr(t, t0, Math.max(0.35, [...l.text].length * 0.045));
      const cy = y + lh[i] / 2;
      const w = ptext(l.text, A.cx, cy, { size: sizes[i], col: l.color || "line", seed, prog: p });
      if (l.color && l.color !== "grey" && (l.size === "xl" || l.size === "l") && p >= 1) ELEM.scribbleUnder(A.cx - w / 2, A.cx + w / 2, cy + sizes[i] * 0.58, { col: l.color, seed: seed + 9, prog: pr(t, t0 + 0.5, 0.45), glow: 6, w: 4.5 });
      y += lh[i];
    });
  }

  function drawChars(sc, chars, t) {
    chars.forEach((c, i) => {
      const prog = pr(t, 0.0, 0.7), id = sc.id + i;
      if (c.names[0] === "fist_closeup") return FIG.drawFistCloseup(c.x, GROUND, c.h / 1000, t, id, prog);
      const pose = poseFor(c, sc, t), scale = c.h / 940;
      const r = FIG.drawFigure(c.kind, pose, c.x, GROUND, scale, c.flip, t, id, { prog, dim: c.pos === "bg" ? 0.3 : c.dim ? 0.4 : 1 });
      c.out = r;
    });
  }

  function guides(t, sc) {
    const k = 1 - pr(t, 0.2, 1.3);
    if (k <= 0) return;
    const c = S.ctx, seed = strSeed(sc.id + "g");
    c.save(); c.globalAlpha = 0.2 * k;
    for (let i = 0; i < 2; i++) pstroke(closed(ellipsePts(300 + hr(seed, i) * 1300, 250 + hr(seed, i, 1) * 500, 200 + hr(seed, i, 2) * 160, 200 + hr(seed, i, 2) * 160)), { w: 2, col: "guide", seed: seed + i, sketch: false, gapP: 0.7 });
    pstroke([[0, 400 + hr(seed, 5) * 300], [W, 380 + hr(seed, 6) * 300]], { w: 2, col: "guide", seed: seed + 7, sketch: false });
    pstroke([[500 + hr(seed, 8) * 900, 0], [500 + hr(seed, 9) * 900, H]], { w: 2, col: "guide", seed: seed + 8, sketch: false });
    c.restore();
  }

  function impactFx(sc, t, chars) {
    if (!sc.impact) return;
    const k = (t - sc.impact.at) / 0.5;
    if (k < 0 || k > 1) return;
    let x = sc.impact.x, y = sc.impact.y;
    const fighter = chars.find((c) => c.out && c.kind === "tetsu");
    if (fighter && fighter.out) { x = fighter.out.fist[0] + 60; y = fighter.out.fist[1] - 10; }
    const r0 = 40 + 120 * easeOut(k), seed = strSeed(sc.id + "imp");
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2 + hr(seed, i) * 0.3, r1 = r0 * (1.15 + hr(seed, i, 1) * 0.5);
      pstroke([[x + Math.cos(a) * r0, y + Math.sin(a) * r0], [x + Math.cos(a) * r1, y + Math.sin(a) * r1]], { w: 7 * (1 - k * 0.5), col: i % 2 ? "orange" : "line", seed: seed + i, alpha: 1 - k * 0.7, glow: 10, sketch: false, gapP: 0 });
    }
    pstroke(closed(ellipsePts(x, y, r0 * 0.9, r0 * 0.9)), { w: 6, col: "orange", seed: seed + 50, alpha: 1 - k, glow: 12 });
  }

  function hud(sc, t, idx) {
    const seed = strSeed(sc.id + "hud");
    if (sc.tag) {
      const w = PE.textWidth(sc.tag, 48) + 56;
      PE.prect(50, 36, w, 84, { w: 4, col: "orange", seed, prog: pr(t, 0.05, 0.4) });
      ptext(sc.tag, 78, 80, { size: 48, col: "orange", seed: seed + 1, prog: pr(t, 0.15, 0.5), align: "left" });
    }
    if (sc.rank) {
      [3, 2, 1].forEach((n, i) => {
        const x = 1640 + i * 90, y = 80, on = n === sc.rank, done = n > sc.rank, c = on ? "orange" : done ? "green" : "soft";
        const pts = ellipsePts(x, y, 34, 34);
        if (on || done) PE.hatch(PE.clipPoly(pts), [x - 36, y - 36, x + 36, y + 36], { angle: 50, gap: on ? 6 : 9, col: c, alpha: on ? 0.6 : 0.3, seed: seed + n });
        pstroke(closed(pts), { w: 4, col: c, seed: seed + 10 + n, glow: on ? 8 : 0, sketch: false });
        ptext(String(n), x, y + 2, { size: 40, col: on ? "orange" : done ? "green" : "soft", seed: seed + 20 + n, glow: 0 });
      });
    }
  }

  function subtitles(sc, tg) {
    if (!SPEC.subtitles || !sc.words || !sc.words.length) return;
    const t = tg - sc.start, ws = sc.words;
    let cur = -1;
    for (let i = 0; i < ws.length; i++) if (t >= ws[i].t - 0.02) cur = i;
    if (cur < 0) return;
    const group = 5, g0 = Math.floor(cur / group) * group, chunk = ws.slice(g0, g0 + group);
    const c = S.ctx, size = 54;
    PE.setFont(size, 700);
    const widths = chunk.map((w) => c.measureText(w.w).width), sp = c.measureText(" ").width;
    const total = widths.reduce((a, b) => a + b, 0) + sp * (chunk.length - 1);
    c.save(); c.fillStyle = "rgba(20,18,16,0.78)"; c.fillRect(960 - total / 2 - 30, 996, total + 60, 70); c.restore();
    let x = 960 - total / 2;
    chunk.forEach((w, i) => {
      ptext(w.w, x + widths[i] / 2, 1031, { size, col: g0 + i === cur ? "orange" : g0 + i < cur ? "line" : "soft", seed: 7 + i, glow: 0 });
      x += widths[i] + sp;
    });
  }

  function camera(sc, t, dur) {
    const c = S.ctx, mode = sc.camera || "still";
    let s = 1 + 0.03 * clamp(t / dur), ox = 0, oy = 0;
    if (mode === "punch") { const k = 1 - clamp(t / 0.4); s += 0.09 * k * k; }
    const at = sc.impact ? sc.impact.at : 0;
    if (mode === "shake" || (sc.impact && t >= at)) {
      const k = Math.max(0, 1 - Math.max(0, t - at) / 0.6) * (mode === "shake" || sc.impact ? 1 : 0);
      if (t >= at) { ox = (hr(S.di, 3) - 0.5) * 2 * 14 * k; oy = (hr(S.di, 4) - 0.5) * 2 * 14 * k; }
    }
    c.translate(W / 2 + ox, H / 2 + oy); c.scale(s, s); c.translate(-W / 2, -H / 2);
  }

  function render(tReal) {
    const di = Math.floor(tReal * PE.DRAW_FPS + 1e-6);
    S.di = di;
    const tg = di / PE.DRAW_FPS;
    const sc = sceneAt(tg), idx = SPEC.scenes.indexOf(sc);
    const t = tg - sc.start + (idx === 0 ? 0.45 : 0);
    const dur = sc.dur;
    const c = S.ctx;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.globalAlpha = 1;
    PE.paper();
    c.save();
    camera(sc, t, dur);
    const chars = layoutChars(sc), A = areaFor(sc, chars), hasEl = Boolean(sc.element);
    guides(t, sc);
    // background characters first
    drawChars(sc, chars.filter((c) => c.pos === "bg"), t);
    if (sc.element) ELEM.R[sc.element.type](sc.element, t, A);
    drawChars(sc, chars.filter((c) => c.pos !== "bg"), t);
    if (sc.text && sc.text.lines) drawText(sc, t, A, hasEl, dur);
    impactFx(sc, t, chars);
    hud(sc, t, idx);
    c.restore();
    subtitles(sc, tg);
    PE.grain();
  }

  window.PENCIL_RENDER = render;
})();
