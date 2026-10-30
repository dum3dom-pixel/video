import { Composition, Folder } from "remotion";
import { BallCity } from "./BallCity";
import { Bratok90 } from "./Bratok90";
import { BratokReal } from "./BratokReal";
import { BratokRealAnim } from "./BratokRealAnim";
import { Explainer } from "./Explainer/Explainer";
import { totalFrames } from "./Explainer/timing";
import { videos } from "./Explainer/videos";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Elements">
        <Composition
          id="Logo"
          component={Logo}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            logoColor1: "#91EAE4",
            logoColor2: "#86A8E7",
          }}
        />
        <Composition
          id="Title"
          component={Title}
          durationInFrames={115}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            titleText: "Welcome to Remotion",
            titleColor: "#000000",
          }}
        />
      </Folder>
      <Composition
        // You can take the "id" to render a video:
        // bunx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
        }}
      />
      <Composition
        id="BallCity"
        component={BallCity}
        durationInFrames={120}
        fps={12}
        width={1920}
        height={1080}
      />
      <Composition
        id="Bratok90"
        component={Bratok90}
        durationInFrames={260}
        fps={12}
        width={1080}
        height={1920}
      />
      <Composition
        id="BratokReal"
        component={BratokReal}
        durationInFrames={650}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="BratokRealAnim"
        component={BratokRealAnim}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
      />
      <Folder name="Explainer">
        {videos.map(({ spec, voiceDurations, voiceWords }) => (
          <Composition
            key={spec.id}
            id={`Explainer-${spec.id}`}
            component={Explainer}
            durationInFrames={totalFrames(spec, voiceDurations)}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{ spec, voiceDurations, voiceWords }}
          />
        ))}
      </Folder>
    </>
  );
};
