import { linearTiming, type TransitionPresentation, type TransitionPresentationComponentProps } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { flip } from "@remotion/transitions/flip";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { lightLeak } from "@remotion/effects/light-leak";
import { CameraMotionBlur } from "@remotion/motion-blur";
import React from "react";
import { Easing, interpolate, Solid, useCurrentFrame, useVideoConfig } from "remotion";
import { LEAK_FRAMES } from "./timing";
import type { Transition } from "./types";

const ZOOM_FROM = 1.15;
const SHUTTER_ANGLE = 180;
const SAMPLES = 6;
const LEAK_OPACITY = 0.55;
const LEAK_HUE = 25; // hue goes yellow(0) -> red(60); 25 reads as brand orange #E8732C

/** Incoming scene scales ZOOM_FROM -> 1 while fading in; outgoing scene stays put underneath. */
const ZoomIn = ({ children, presentationDirection, presentationProgress }: TransitionPresentationComponentProps<Record<string, unknown>>) => {
  if (presentationDirection === "exiting") return <>{children}</>;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: presentationProgress,
        transform: `scale(${ZOOM_FROM - (ZOOM_FROM - 1) * presentationProgress})`,
      }}
    >
      {children}
    </div>
  );
};

/** Presentation for a transition type; undefined for "cut". */
export const presentationFor = (t: Transition): TransitionPresentation<Record<string, unknown>> | undefined => {
  switch (t) {
    case "fade":
      return fade();
    case "slide":
      return slide({ direction: "from-right" });
    case "wipe":
      return wipe({ direction: "from-left" });
    case "flip":
      return flip();
    case "zoom":
      return { component: ZoomIn, props: {} };
    default:
      return undefined;
  }
};

export const transitionTiming = (frames: number) =>
  linearTiming({ durationInFrames: frames, easing: Easing.inOut(Easing.cubic) });

/** Warm orange light leak (brand #E8732C) over the cut; `seed` varies per scene. */
export const LightLeakOverlay: React.FC<{ seed: number }> = ({ seed }) => {
  const frame = useCurrentFrame();
  const { height, width } = useVideoConfig();
  return (
    <Solid
      width={width}
      height={height}
      style={{ mixBlendMode: "screen", opacity: LEAK_OPACITY }}
      effects={[
        lightLeak({
          seed,
          hueShift: LEAK_HUE,
          progress: interpolate(frame, [0, LEAK_FRAMES - 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }),
      ]}
    />
  );
};

/**
 * Frame-driven motion blur around camera-moved content (HUD stays outside).
 * CameraMotionBlur, not HtmlInCanvasMotionBlur: the latter throws "No cached paint record" in Remotion's headless Chrome.
 */
export const MotionBlur: React.FC<{ enabled: boolean; children: React.ReactNode }> = ({ enabled, children }) =>
  enabled ? (
    <CameraMotionBlur samples={SAMPLES} shutterAngle={SHUTTER_ANGLE}>
      {children}
    </CameraMotionBlur>
  ) : (
    <>{children}</>
  );
