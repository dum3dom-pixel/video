// Builds engine/data.js (scene timeline on the 90 BPM grid), engine/rigs.js (puppet part tables), spec/audio.json (sound list for scripts/mix.py) and index.html
// from spec/hook.json, spec/words.json, spec/voice.json and assets/paper/*/rig.json.
import fs from "node:fs";

const spec = JSON.parse(fs.readFileSync("spec/hook.json", "utf8"));
const words = JSON.parse(fs.readFileSync("spec/words.json", "utf8"));
const voiceDur = JSON.parse(fs.readFileSync("spec/voice.json", "utf8"));
const BEAT = 60 / spec.bpm, LOOP = 21.333;
const f3 = (n) => Math.round(n * 1000) / 1000;

let start = 0;
const scenes = [], audio = [];
for (const s of spec.scenes) {
  const dur = f3(s.beats * BEAT), ws = words[s.id] || [];
  if (dur < voiceDur[s.id] - 0.01) throw new Error(`scene ${s.id}: ${s.beats} beats = ${dur}s is shorter than the voice ${voiceDur[s.id]}s`);
  scenes.push({ id: s.id, start: f3(start), dur, words: ws });
  audio.push({ id: `v-${s.id}`, src: `assets/voice/${s.id}.mp3`, start: f3(start), vol: 1 });
  for (const [i, x] of (s.sfx || []).entries()) {
    let at = x.at ?? 0;
    if (x.word) { const w = ws.find((q) => q.w.toLowerCase().replace(/[^а-яёa-z0-9]/g, "").startsWith(x.word)); if (!w) throw new Error(`no word ${x.word} in ${s.id}`); at = w.t + (x.off || 0); }
    audio.push({ id: `fx-${x.name}-${s.id}-${i}`, src: `assets/sfx/${x.name}.wav`, start: Math.max(0, f3(start + at)), vol: x.vol ?? 0.4 });
  }
  start += dur;
}
const total = f3(start);
for (let k = 0, t = 0; t < total; k++, t += LOOP) audio.push({ id: `music-${k}`, src: "assets/sfx/beat.wav", start: f3(t), vol: 0.1 });

const rigs = {};
for (const h of ["tetsu", "gromila", "doc"]) rigs[h] = JSON.parse(fs.readFileSync(`assets/paper/${h}/rig.json`, "utf8"));
fs.writeFileSync("engine/rigs.js", `window.RIGS = ${JSON.stringify(rigs)};\n`);
fs.writeFileSync("engine/data.js", `window.SPEC = ${JSON.stringify({ subtitles: true, total, scenes })};\n`);
fs.writeFileSync("spec/audio.json", JSON.stringify({ total, items: audio }, null, 1));
const html = `<!doctype html>
<html lang="ru" data-resolution="landscape">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <style>
      @font-face { font-family: "ImpactP"; font-weight: 400; src: url("assets/fonts/impact.ttf") format("truetype"); }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 1920px; height: 1080px; overflow: hidden; background: #46627a; }
      #stage { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="1920" data-height="1080" data-no-timeline>
      <canvas id="stage" width="1920" height="1080"></canvas>
      <audio id="master" class="clip" data-start="0" data-duration="${total}" data-track-index="2" data-volume="1" src="assets/master.wav"></audio>
    </div>
    <script src="engine/data.js"></script>
    <script src="engine/rigs.js"></script>
    <script src="engine/paper.js"></script>
    <script src="engine/rig.js"></script>
    <script src="engine/main.js"></script>
    <script>
      window.TOON_CTX = document.getElementById("stage").getContext("2d");
      const ready = Promise.all([document.fonts.load('60px "ImpactP"'), RIG.load()]).then(() => TOON_RENDER(0));
      window.__hf = window.__hf || {};
      window.__hf.buildReady = window.__hf.buildReady || {};
      window.__hf.buildReady["main"] = ready;
      window.addEventListener("hf-seek", (e) => {
        try { TOON_RENDER(e.detail.time); }
        catch (err) { const c = window.TOON_CTX; c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = "#900"; c.fillRect(0, 0, 1920, 120); c.fillStyle = "#fff"; c.font = "28px monospace"; c.fillText(String(err.stack || err).slice(0, 150), 20, 70); console.error(err); }
      });
    </script>
  </body>
</html>
`;
fs.writeFileSync("index.html", html);
console.log("scenes", scenes.length, "total", total, "audio items", audio.length);
