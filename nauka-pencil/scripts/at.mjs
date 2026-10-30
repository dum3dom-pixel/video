// prints "scene:time" for snapshot: node scripts/at.mjs hook+1.2 punch+2 ...
import fs from "node:fs";
const d = JSON.parse(fs.readFileSync("engine/data.js", "utf8").replace(/^window.SPEC = /, "").replace(/;\s*$/, ""));
console.log(process.argv.slice(2).map((a) => { const [id, off] = a.split("+"); const sc = d.scenes.find((s) => s.id === id); return (sc.start + parseFloat(off || "1")).toFixed(2); }).join(","));
