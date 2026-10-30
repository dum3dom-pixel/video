// Builds data.js (scene timeline) and index.html (canvas + audio) from spec/nauka-01.json, spec/words.json and the voice durations.
import fs from "node:fs";

const spec = JSON.parse(fs.readFileSync("spec/nauka-01.json", "utf8"));
const words = JSON.parse(fs.readFileSync("spec/words.json", "utf8"));
const voiceTs = fs.readFileSync("../my-video/src/Explainer/videos/nauka-01.voice.ts", "utf8");
const voiceDur = {};
for (const m of voiceTs.matchAll(/"([^"]+)":\s*([\d.]+),?/g)) voiceDur[m[1]] = parseFloat(m[2]);
const BEAT = parseFloat(process.env.BEAT_LEN || "21.333");
const TAIL = 0.4, LEAD = 0.45; // lead: first scene is already half drawn on frame 0
const IMPACT_WORD = { hook: "вырубает", punch: "подбородок", "b4-answer": "упал" };

// SCENES=3 node build.mjs builds only the first 3 scenes (the 15 s test cut)
if (process.env.SCENES) spec.scenes = spec.scenes.slice(0, parseInt(process.env.SCENES));
let start = 0;
const scenes = [], audio = [];
const f3 = (n) => Math.round(n * 1000) / 1000;
spec.scenes.forEach((s, i) => {
  const vd = voiceDur[s.id], silent = vd === undefined; // silent scene = the closing poster
  const dur = silent ? s.duration ?? 4 : f3(vd + TAIL), off = i === 0 ? LEAD : 0;
  const sc = { id: s.id, start: f3(start), dur: f3(dur), tag: s.tag, rank: s.rank, camera: s.camera, text: s.text, element: s.element, characters: s.characters, words: words[s.id] || [] };
  if (s.impact) {
    const w = (words[s.id] || []).find((x) => x.w.toLowerCase().startsWith(IMPACT_WORD[s.id] || "")) ;
    const at = w ? w.t : s.impact.at;
    sc.impact = { at: f3(at + off), x: s.impact.x, y: s.impact.y };
    audio.push({ id: `fx-imp-${s.id}`, src: "assets/sfx/impact.wav", start: f3(start + at), vol: 0.7, dur: 1 });
  }
  if (!silent) audio.push({ id: `v-${s.id}`, src: `assets/voice/${s.id}.mp3`, start: f3(start), vol: 1, dur: f3(vd + 0.05) });
  audio.push({ id: `fx-scr-${s.id}`, src: "assets/sfx/scratch.wav", start: f3(start + 0.05), vol: 0.22, dur: 1 });
  if (s.camera === "punch") audio.push({ id: `fx-wh-${s.id}`, src: "assets/sfx/whoosh.wav", start: f3(start), vol: 0.35, dur: 1 });
  for (const x of s.sfx || []) audio.push({ id: `fx-${x.name}-${s.id}`, src: `assets/sfx/${x.name}.wav`, start: f3(start + x.at), vol: x.volume ?? 0.4, dur: 2 });
  scenes.push(sc);
  start += dur;
});
const total = f3(start);
for (let k = 0, t = 0; t < total; k++, t += BEAT) audio.push({ id: `music-${k}`, src: "assets/sfx/beat.wav", start: f3(t), vol: 0.1, dur: f3(Math.min(BEAT, total - t)) });

fs.writeFileSync("engine/data.js", `window.SPEC = ${JSON.stringify({ subtitles: spec.subtitles !== false, total, scenes })};\n`);
// every sound is mixed into ONE track by scripts/mix.py (same constants as the picture), the page only plays assets/master.wav
fs.writeFileSync("spec/audio.json", JSON.stringify({ total, items: audio.map(({ src, start, vol, id }) => ({ id, src, start, vol })) }, null, 1));
const tags = `    <audio id="master" class="clip" data-start="0" data-duration="${total}" data-track-index="2" data-volume="1" src="assets/master.wav"></audio>`;
const html = `<!doctype html>
<html lang="ru" data-resolution="landscape">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <style>
      @font-face { font-family: "Pencil"; font-weight: 400; src: local("Segoe Print"); }
      @font-face { font-family: "Pencil"; font-weight: 700; src: local("Segoe Print Bold"), local("Segoe Print"); }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 1920px; height: 1080px; overflow: hidden; background: #1b1917; }
      #stage { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="1920" data-height="1080" data-no-timeline>
      <canvas id="stage" width="1920" height="1080"></canvas>
${tags}
    </div>
    <script src="engine/data.js"></script>
    <script src="engine/pencil.js"></script>
    <script src="engine/figures.js"></script>
    <script src="engine/elements.js"></script>
    <script src="engine/main.js"></script>
    <script>
      PE.S.ctx = document.getElementById("stage").getContext("2d");
      PE.bakePaper();
      const ready = Promise.all([document.fonts.load('700 60px "Pencil"'), document.fonts.load('400 60px "Pencil"')]).then(() => PENCIL_RENDER(0));
      window.__hf = window.__hf || {};
      window.__hf.buildReady = window.__hf.buildReady || {};
      window.__hf.buildReady["main"] = ready;
      window.addEventListener("hf-seek", (e) => {
        try { PENCIL_RENDER(e.detail.time); }
        catch (err) { const c = PE.S.ctx; c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = "#900"; c.fillRect(0, 0, 1920, 120); c.fillStyle = "#fff"; c.font = "28px monospace"; c.fillText(String(err.stack || err).slice(0, 150), 20, 70); console.error(err); }
      });
    </script>
  </body>
</html>
`;
fs.writeFileSync("index.html", html);
console.log("scenes", scenes.length, "total", total, "audio tags", audio.length);
