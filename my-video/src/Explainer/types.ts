export type Accent = "white" | "orange" | "green" | "red" | "grey";
export type Line = { text: string; color?: Accent; size?: "xl" | "l" | "m" | "s" };
export type Character = {
  src?: string | string[]; // path(s) under public/, e.g. "explainer/demo/img/hero.png"; array = pose loop; omitted = placeholder silhouette
  pos?: "left" | "right" | "center" | "bg"; // bg = big, centered, dimmed (opacity .25) behind text
  poseFps?: number; // pose-swap rate for arrays (default 3)
  height?: number; // px, default 820
  flip?: boolean;
  dim?: boolean;
};
export type Element =
  | { type: "dotGrid"; count: number; highlight?: number; color?: Accent; label?: string; caption?: string }
  | { type: "bars"; items: { label: string; value: number; color?: Accent; note?: string }[] } // value 0..1
  | { type: "lineChart"; xLabel?: string; yLabel?: string; plateauAt?: number; note?: string; title?: string } // rising curve flattening at plateauAt (0..1 of x), dashed vertical marker there
  | { type: "reps"; total: number; filled: number; caption?: string } // row of circles, `filled` white solid, rest orange outline
  | { type: "week"; days: string[]; checked: number[] } // row of boxes with day letters above, green checkmarks pop in
  | { type: "steps"; items: { label: string; color?: Accent }[] } // rising staircase blocks, last can be red-tinted
  | { type: "card"; title: string; body: string; note?: string; page?: [number, number] } // green-outlined dark card, pager dots below
  | { type: "comments"; items: { author?: string; text: string }[] } // dark rounded comment bubbles with avatar circle, like/dislike icons
  | { type: "button"; label: string; variant: "like" | "subscribe" } // pill button, gets "pressed" (scale bounce + turns red with label change e.g. "LIKED")
  | { type: "callout"; text: string; note?: string; color?: Accent } // red/colored thin-bordered box
  | { type: "levels"; items: { label: string; text: string; color: Accent }[] } // stacked bordered rows sliding in
  | { type: "bigNumber"; value: string; caption?: string; after?: string } // huge grey number counting/popping, `after` line in green below
  | { type: "brain"; mode?: "rest" | "push" | "rotate"; caption?: string } // top-down head: on a hit the brain lags the skull (rotate = layers shear, push = moves together)
  | { type: "lever"; caption?: string } // side-view heads: punch through the centre of mass only pushes, off-centre (chin) also rotates
  | { type: "versus"; left: { label: string; color?: Accent }; right: { label: string; color?: Accent }; winner: "left" | "right"; note?: string }; // A vs B tug-of-war bar: marker wobbles ~1s, then slams to the winner (~80%)
export type SfxName = "whoosh" | "pop" | "click" | "impact" | "riser";
export type SceneSfx = { name: SfxName; at?: number /* seconds from scene start */; volume?: number };
export type Camera = "still" | "push" | "punch" | "shake"; // default "push": slow 1.0 -> 1.03 zoom over the scene
export type Transition = "cut" | "fade" | "slide" | "wipe" | "flip" | "zoom"; // cut = hard cut (default); zoom = incoming scene scales 1.15 -> 1 with fade
export type Impact = { at?: number /* seconds from scene start */; x?: number; y?: number /* px, default frame center */ }; // flash + speed lines + orange ring
export type Scene = {
  id: string;
  voice?: string; // narration text for TTS
  duration?: number; // seconds; default = voice audio length + 0.4, else 3
  rank?: 1 | 2 | 3 | 4 | 5;
  tag?: string;
  characters?: Character[];
  text?: { lines: Line[]; pos?: "center" | "right" | "left" | "top" };
  element?: Element;
  camera?: Camera;
  impact?: Impact;
  sfx?: SceneSfx[]; // extra cues; always played (independent of spec.sfx)
  transition?: Transition; // transition INTO this scene; overrides spec.transition, ignored for the first scene
  leak?: boolean; // light leak over the cut into this scene (also set by spec.leaks)
  motionBlur?: boolean; // blur the camera-moved content; automatic for camera "punch" / "shake"
};
export type Music = { src: string /* path under public/ */; volume?: number /* default 0.15 */; duck?: number /* multiplier while narration plays, default 0.35 */ };
export type ExplainerSpec = {
  id: string;
  voice?: string; // edge-tts voice name
  rate?: string; // edge-tts rate, e.g. "+15%" (TTS script only)
  character?: string;
  poses?: Record<string, string>; // image script only
  sfx?: boolean; // whoosh between scenes, pop on text lines, click/impact cues (default false)
  music?: Music;
  subtitles?: boolean; // word-by-word captions from <id>.voice.ts voiceWords (default false)
  transition?: Transition; // default transition between scenes (default "cut")
  transitionFrames?: number; // transition length in frames (default 10); overlaps scenes, total length is unchanged
  leaks?: boolean; // light leak on every cut (default false)
  scenes: Scene[];
};

export type VoiceDurations = Record<string, number>;

export type VoiceWord = { t: number; d: number; w: string }; // seconds from scene voice start
export type VoiceWords = Record<string, VoiceWord[]>;
