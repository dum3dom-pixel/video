import type { ExplainerSpec, VoiceDurations, VoiceWords } from "../types";
import demoJson from "./demo.json";
import { voiceDurations as demoVoice, voiceWords as demoWords } from "./demo.voice";
import armwrestleJson from "./armwrestle.json";
import { voiceDurations as armwrestleVoice, voiceWords as armwrestleWords } from "./armwrestle.voice";
import kitchenJson from "./kitchen.json";
import { voiceDurations as kitchenVoice, voiceWords as kitchenWords } from "./kitchen.voice";
import nauka01Json from "./nauka-01.json";
import { voiceDurations as nauka01Voice, voiceWords as nauka01Words } from "./nauka-01.voice";

export type VideoEntry = { spec: ExplainerSpec; voiceDurations: VoiceDurations; voiceWords?: VoiceWords };

// Add new videos here: JSON spec + generated <id>.voice.ts.
export const videos: VideoEntry[] = [
  { spec: demoJson as ExplainerSpec, voiceDurations: demoVoice, voiceWords: demoWords },
  { spec: armwrestleJson as ExplainerSpec, voiceDurations: armwrestleVoice, voiceWords: armwrestleWords },
  { spec: kitchenJson as ExplainerSpec, voiceDurations: kitchenVoice, voiceWords: kitchenWords },
  { spec: nauka01Json as ExplainerSpec, voiceDurations: nauka01Voice, voiceWords: nauka01Words },
];
