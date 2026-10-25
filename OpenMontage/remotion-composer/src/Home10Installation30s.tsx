import {
  AbsoluteFill,
  Audio,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * Home10Installation30s
 *
 * CONCEPT VIDEO -- NOT CERTIFIED OR APPROVED.
 *
 * Photoreal walkthrough of the Home 10 cooking-gas concept: outdoor cylinder
 * shelter -> wall-mounted regulator cabinet -> kitchen burner. Built to the
 * project's hard compliance rules: no certification language or marks, no
 * clearance/vent-distance numbers, no regulator pressures beyond the ones
 * listed, no brand names, household never lifts the cylinder, only outdoor
 * equipment carries high/first-stage pressure.
 *
 * Photos are generated locally (NVIDIA NIM FLUX.1, see
 * generate_home10_images.py -- this cloud session's network blocks NVIDIA's
 * API) and placed in public/home10_images/. Cinematic motion (Ken
 * Burns-style push/pan + crossfades) is done entirely in Remotion, no video
 * generation needed.
 *
 * Structure (900 frames @ 30fps = 30s):
 * - Cut 1 (0-5s):   Home overview + concept label
 * - Cut 2 (5-12s):  Cylinder shelter -> close-up -> agent delivery -> composite alt
 * - Cut 3 (12-19s): Regulator cabinet closed -> open
 * - Cut 4 (19-26s): Kitchen, detector, two-burner cooker, pot
 * - Cut 5 (26-30s): Pull back + end card, concept label again
 */

const PhotoLayer: React.FC<{
  src: string;
  frame: number;
  activeFrom: number;
  activeUntil: number;
  fromScale?: number;
  toScale?: number;
  fadeFrames?: number;
  objectPosition?: string;
}> = ({
  src,
  frame,
  activeFrom,
  activeUntil,
  fromScale = 1.0,
  toScale = 1.1,
  fadeFrames = 15,
  objectPosition = "center",
}) => {
  const span = Math.max(1, activeUntil - activeFrom);
  const progress = Math.min(1, Math.max(0, (frame - activeFrom) / span));
  const scale = fromScale + (toScale - fromScale) * progress;

  let opacity = 1;
  if (frame < activeFrom - fadeFrames || frame > activeUntil + fadeFrames) {
    opacity = 0;
  } else if (frame < activeFrom) {
    opacity = (frame - (activeFrom - fadeFrames)) / fadeFrames;
  } else if (frame > activeUntil) {
    opacity = 1 - (frame - activeUntil) / fadeFrames;
  }
  opacity = Math.max(0, Math.min(1, opacity));

  if (opacity <= 0) return null;

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      src={src}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition,
        opacity,
        transform: `scale(${scale})`,
      }}
    />
  );
};

const THEME = {
  warn: "#FCA5A5",
};

const ConceptLabel: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const opacity = spring({ frame, fps, config: { damping: 20 }, from: 0, to: 1 });
  return (
    <div
      style={{
        position: "absolute",
        top: 40,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity,
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "8px 20px",
          background: "rgba(0,0,0,0.55)",
          borderRadius: 8,
          fontSize: 28,
          fontWeight: 800,
          color: THEME.warn,
          letterSpacing: 1,
        }}
      >
        CONCEPT. NOT CERTIFIED OR APPROVED.
      </div>
    </div>
  );
};

const Caption: React.FC<{ lines: string[]; frame: number; fps: number; from?: number }> = ({
  lines,
  frame,
  fps,
  from = 0,
}) => {
  const opacity = spring({ frame: frame - from, fps, config: { damping: 20 }, from: 0, to: 1 });
  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity,
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "14px 32px",
          background: "rgba(0,0,0,0.5)",
          borderRadius: 10,
        }}
      >
        {lines.map((l, i) => (
          <div
            key={i}
            style={{ fontSize: 34, fontWeight: 700, color: "#FFFFFF", marginTop: i === 0 ? 0 : 6 }}
          >
            {l}
          </div>
        ))}
      </div>
    </div>
  );
};

interface SceneProps {
  audioPath?: string;
}

// ---------------------------------------------------------------------------
// Cut 1: Home overview
// ---------------------------------------------------------------------------
const Cut1_Overview: React.FC<SceneProps> = ({ audioPath }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleIn = spring({ frame, fps, config: { damping: 20 }, from: 0, to: 1 });
  const titleOut = frame > 110 ? Math.max(0, 1 - (frame - 110) / 20) : 1;
  const titleOpacity = Math.min(titleIn, titleOut);
  const photoBase = staticFile("home10_images");

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {audioPath && <Audio src={audioPath} />}
      <PhotoLayer
        src={`${photoBase}/h_overview.png`}
        frame={frame}
        activeFrom={0}
        activeUntil={150}
        fromScale={1.0}
        toScale={1.12}
      />
      <ConceptLabel frame={frame} fps={fps} />
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleOpacity,
        }}
      >
        <div
          style={{
            fontSize: 110,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: 2,
            textShadow: "0 4px 24px rgba(0,0,0,0.6)",
          }}
        >
          HOME 10
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Cut 2: Cylinder shelter
// ---------------------------------------------------------------------------
const Cut2_Cylinder: React.FC<SceneProps> = ({ audioPath }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const photoBase = staticFile("home10_images");

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {audioPath && <Audio src={audioPath} />}
      {/* wide shelter shot, slow push-in */}
      <PhotoLayer
        src={`${photoBase}/h_cylinder_shelter.png`}
        frame={frame}
        activeFrom={0}
        activeUntil={70}
        fromScale={1.0}
        toScale={1.1}
      />
      {/* same shot, tight crop = "close-up of guard and valve" */}
      <PhotoLayer
        src={`${photoBase}/h_cylinder_shelter.png`}
        frame={frame}
        activeFrom={70}
        activeUntil={110}
        fromScale={1.6}
        toScale={1.8}
        objectPosition="center 30%"
      />
      {/* agent delivering replacement on a trolley */}
      <PhotoLayer
        src={`${photoBase}/h_agent_trolley.png`}
        frame={frame}
        activeFrom={110}
        activeUntil={160}
        fromScale={1.0}
        toScale={1.08}
      />
      {/* quick cut to the lighter composite alternative */}
      <PhotoLayer
        src={`${photoBase}/h_cylinder_composite.png`}
        frame={frame}
        activeFrom={160}
        activeUntil={210}
        fromScale={1.0}
        toScale={1.1}
      />
      <Caption lines={["45 L · 200 bar", "About 10.9 SCM (preliminary)"]} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Cut 3: Regulator box
// ---------------------------------------------------------------------------
const Cut3_Regulator: React.FC<SceneProps> = ({ audioPath }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const photoBase = staticFile("home10_images");

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {audioPath && <Audio src={audioPath} />}
      {/* cabinet closed, push-in */}
      <PhotoLayer
        src={`${photoBase}/h_regulator_closed.png`}
        frame={frame}
        activeFrom={0}
        activeUntil={100}
        fromScale={1.0}
        toScale={1.12}
      />
      {/* door open reveal -- crossfades in */}
      <PhotoLayer
        src={`${photoBase}/h_regulator_open.png`}
        frame={frame}
        activeFrom={100}
        activeUntil={210}
        fromScale={1.0}
        toScale={1.1}
      />
      <Caption lines={["Pressure steps down in stages", "Only low-pressure gas enters the kitchen"]} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Cut 4: Kitchen + burner
// ---------------------------------------------------------------------------
const Cut4_Kitchen: React.FC<SceneProps> = ({ audioPath }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const photoBase = staticFile("home10_images");

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {audioPath && <Audio src={audioPath} />}
      <PhotoLayer
        src={`${photoBase}/h_kitchen_cooker.png`}
        frame={frame}
        activeFrom={0}
        activeUntil={210}
        fromScale={1.0}
        toScale={1.15}
      />
      <Caption lines={["2 kW + 3 kW burners", "Flame-failure protection"]} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Cut 5: Close
// ---------------------------------------------------------------------------
const Cut5_Close: React.FC<SceneProps> = ({ audioPath }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = spring({ frame, fps, config: { damping: 20 }, from: 0, to: 1 });
  const photoBase = staticFile("home10_images");

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {audioPath && <Audio src={audioPath} />}
      {/* pull back = zoom OUT, inverse of the opening push-in */}
      <PhotoLayer
        src={`${photoBase}/h_overview.png`}
        frame={frame}
        activeFrom={0}
        activeUntil={120}
        fromScale={1.15}
        toScale={1.0}
      />
      <ConceptLabel frame={frame} fps={fps} />
      <div style={{ position: "absolute", top: "38%", left: 0, right: 0, textAlign: "center", opacity }}>
        <div
          style={{
            fontSize: 90,
            fontWeight: 900,
            color: "#FFFFFF",
            letterSpacing: 2,
            textShadow: "0 4px 24px rgba(0,0,0,0.6)",
          }}
        >
          HOME 10
        </div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: "#FFFFFF",
            marginTop: 14,
            textShadow: "0 2px 12px rgba(0,0,0,0.6)",
          }}
        >
          Concept in development. Not certified or approved.
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Home10Installation30s: React.FC = () => {
  const audioBase = staticFile("home10_audio");
  return (
    <AbsoluteFill>
      <Audio src={`${audioBase}/home10_bgm.wav`} volume={0.5} />
      <Sequence from={0} durationInFrames={150}>
        <Cut1_Overview audioPath={`${audioBase}/h1_overview.wav`} />
      </Sequence>
      <Sequence from={150} durationInFrames={210}>
        <Cut2_Cylinder audioPath={`${audioBase}/h2_cylinder.wav`} />
      </Sequence>
      <Sequence from={360} durationInFrames={210}>
        <Cut3_Regulator audioPath={`${audioBase}/h3_regulator.wav`} />
      </Sequence>
      <Sequence from={570} durationInFrames={210}>
        <Cut4_Kitchen audioPath={`${audioBase}/h4_kitchen.wav`} />
      </Sequence>
      <Sequence from={780} durationInFrames={120}>
        <Cut5_Close audioPath={`${audioBase}/h5_close.wav`} />
      </Sequence>
    </AbsoluteFill>
  );
};
