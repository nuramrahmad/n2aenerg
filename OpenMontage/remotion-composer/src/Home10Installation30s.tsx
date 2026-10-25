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
 * Illustrated (non-photoreal) walkthrough of the Home 10 cooking-gas concept:
 * outdoor cylinder shelter -> wall-mounted regulator cabinet -> kitchen
 * burner. Built to the project's hard compliance rules: no certification
 * language or marks, no clearance/vent-distance numbers, no regulator
 * pressures beyond the ones listed, no brand names, household never lifts
 * the cylinder, only outdoor equipment carries high/first-stage pressure.
 *
 * Structure (900 frames @ 30fps = 30s):
 * - Cut 1 (0-5s):   Home overview + concept label
 * - Cut 2 (5-12s):  Cylinder shelter, agent delivery, composite alt
 * - Cut 3 (12-19s): Regulator cabinet, door open, wall sleeve
 * - Cut 4 (19-26s): Kitchen, detector, two-burner cooker, pot
 * - Cut 5 (26-30s): Pull back + end card, concept label again
 */

const THEME = {
  sky: "#FDE9C8",
  skyDeep: "#FBCB7E",
  ground: "#C9A66B",
  house: "#E8D9C3",
  roof: "#8B5E34",
  shelter: "#9CA3AF",
  cylinderSteel: "#B0BEC5",
  cylinderComposite: "#60A5FA",
  cabinet: "#D1D5DB",
  flameOuter: "#F97316",
  flameInner: "#FBBF24",
  warn: "#DC2626",
  text: "#1F2937",
  caption: "#374151",
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
      <div style={{ fontSize: 30, fontWeight: 800, color: THEME.warn, letterSpacing: 1 }}>
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
      {lines.map((l, i) => (
        <div
          key={i}
          style={{ fontSize: 34, fontWeight: 700, color: THEME.caption, marginTop: i === 0 ? 0 : 6 }}
        >
          {l}
        </div>
      ))}
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
  const pushIn = spring({ frame, fps, config: { damping: 30 }, from: 1, to: 1.08 });
  const titleOpacity = spring({ frame, fps, config: { damping: 20 }, from: 0, to: 1 });

  return (
    <AbsoluteFill style={{ background: `linear-gradient(${THEME.sky}, ${THEME.skyDeep})` }}>
      {audioPath && <Audio src={audioPath} />}
      <div style={{ transform: `scale(${pushIn})`, width: "100%", height: "100%", position: "relative" }}>
        {/* ground */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "35%", background: THEME.ground }} />
        {/* house body */}
        <div
          style={{
            position: "absolute",
            bottom: "28%",
            left: "30%",
            width: 560,
            height: 260,
            background: THEME.house,
            borderRadius: 6,
          }}
        />
        {/* roof */}
        <div
          style={{
            position: "absolute",
            bottom: "28%",
            left: "28%",
            width: 600,
            height: 0,
            borderLeft: "300px solid transparent",
            borderRight: "300px solid transparent",
            borderBottom: `140px solid ${THEME.roof}`,
            transform: "translateY(-140px)",
          }}
        />
        {/* shelter block beside kitchen wall, hinting at cylinder + regulator cabinet */}
        <div
          style={{
            position: "absolute",
            bottom: "28%",
            left: "68%",
            width: 140,
            height: 170,
            background: THEME.shelter,
            borderRadius: 4,
            opacity: 0.9,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "28%",
            left: "68%",
            width: 140,
            height: 170,
            border: "4px dashed rgba(31,41,55,0.35)",
            borderRadius: 4,
          }}
        />
      </div>
      <ConceptLabel frame={frame} fps={fps} />
      <div
        style={{
          position: "absolute",
          top: "38%",
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleOpacity,
        }}
      >
        <div style={{ fontSize: 110, fontWeight: 900, color: THEME.text, letterSpacing: 2 }}>HOME 10</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Cut 2: Cylinder shelter
// ---------------------------------------------------------------------------
const Agent: React.FC<{ x: number }> = ({ x }) => (
  <g transform={`translate(${x},0)`}>
    {/* trolley */}
    <rect x={-10} y={120} width={70} height={10} rx={3} fill="#4B5563" />
    <circle cx={0} cy={140} r={10} fill="#374151" />
    <circle cx={55} cy={140} r={10} fill="#374151" />
    <rect x={5} y={60} width={50} height={62} rx={4} fill={THEME.cylinderSteel} stroke="#64748B" strokeWidth={2} />
    {/* agent figure */}
    <circle cx={-30} cy={40} r={14} fill="#F2C9A0" />
    <rect x={-44} y={54} width={28} height={60} rx={8} fill="#2563EB" />
    <rect x={-44} y={114} width={12} height={40} rx={4} fill="#1F2937" />
    <rect x={-20} y={114} width={12} height={40} rx={4} fill="#1F2937" />
  </g>
);

const Cut2_Cylinder: React.FC<SceneProps> = ({ audioPath }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneOpacity = spring({ frame, fps, config: { damping: 20 }, from: 0, to: 1 });

  // agent walks in during first ~2.5s then holds
  const walkFrame = Math.min(frame, 75);
  const agentX = -200 + (walkFrame / 75) * 520;

  // switch to composite alt after ~6s (frame 180 within this 210-frame cut)
  const showComposite = frame > 180;
  const altOpacity = spring({ frame: frame - 180, fps, config: { damping: 20 }, from: 0, to: 1 });

  return (
    <AbsoluteFill style={{ background: "#F3F4EC", opacity: sceneOpacity }}>
      {audioPath && <Audio src={audioPath} />}
      {!showComposite ? (
        <svg viewBox="0 0 800 450" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
          {/* shaded ventilated shelter */}
          <rect x={260} y={90} width={300} height={280} fill="#D1D5DB" rx={8} />
          <rect x={260} y={90} width={300} height={24} fill="#9CA3AF" />
          {/* louvres */}
          {[1, 2, 3].map((i) => (
            <rect key={i} x={280} y={120 + i * 18} width={260} height={6} fill="#9CA3AF" />
          ))}
          {/* upright steel cylinder with guard */}
          <rect x={370} y={160} width={90} height={190} rx={14} fill={THEME.cylinderSteel} stroke="#64748B" strokeWidth={3} />
          <circle cx={415} cy={158} r={28} fill="none" stroke="#475569" strokeWidth={6} />
          <rect x={400} y={140} width={30} height={20} rx={4} fill="#475569" />
          {/* firm base */}
          <rect x={300} y={360} width={220} height={16} fill="#8D7355" />
          <Agent x={agentX} />
        </svg>
      ) : (
        <svg
          viewBox="0 0 800 450"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          style={{ opacity: altOpacity }}
        >
          <rect x={260} y={90} width={300} height={280} fill="#D1D5DB" rx={8} />
          <rect x={370} y={150} width={90} height={190} rx={30} fill={THEME.cylinderComposite} stroke="#1D4ED8" strokeWidth={3} />
          <rect x={385} y={130} width={60} height={40} rx={10} fill="#1D4ED8" opacity={0.7} />
          <rect x={300} y={360} width={220} height={16} fill="#8D7355" />
        </svg>
      )}
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
  const doorOpenStart = 90;
  const doorAngle = spring({
    frame: frame - doorOpenStart,
    fps,
    config: { damping: 14, stiffness: 90 },
    from: 0,
    to: -75,
  });

  return (
    <AbsoluteFill style={{ background: "#EFF3F7" }}>
      {audioPath && <Audio src={audioPath} />}
      <svg viewBox="0 0 800 450" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        {/* wall */}
        <rect x={0} y={0} width={800} height={450} fill="#E7ECF1" />
        {/* cabinet */}
        <rect x={300} y={120} width={200} height={240} fill={THEME.cabinet} stroke="#6B7280" strokeWidth={3} rx={6} />
        {/* hood */}
        <rect x={290} y={95} width={220} height={28} fill="#9CA3AF" rx={4} />
        {/* vent cap above hood */}
        <rect x={385} y={70} width={30} height={25} fill="#6B7280" rx={4} />
        {/* louvres top/bottom */}
        {[0, 1].map((i) => (
          <rect key={i} x={315} y={135 + i * 10} width={170} height={5} fill="#9CA3AF" />
        ))}
        {[0, 1].map((i) => (
          <rect key={i} x={315} y={335 + i * 10} width={170} height={5} fill="#9CA3AF" />
        ))}
        {/* NATURAL GAS label */}
        <rect x={330} y={330 - 160} width={0} height={0} />
        <text x={400} y={170} textAnchor="middle" fontSize={14} fontWeight={700} fill={THEME.warn}>
          NATURAL GAS
        </text>
        {/* door (open on a hinge at x=500) */}
        <g transform={`translate(500,240) rotate(${doorAngle}) translate(-500,-240)`}>
          <rect x={400} y={185} width={100} height={200} fill="#B9C2CC" stroke="#6B7280" strokeWidth={2} />
        </g>
        {/* internals revealed behind the door, no labels/gauges/pressures */}
        {doorAngle < -10 && (
          <g opacity={Math.min(1, (-doorAngle - 10) / 40)}>
            <rect x={330} y={200} width={22} height={40} fill="#64748B" rx={3} />
            <circle cx={370} cy={220} r={14} fill="#94A3B8" />
            <rect x={395} y={205} width={28} height={30} fill="#60A5FA" rx={3} />
            <rect x={435} y={205} width={28} height={30} fill="#60A5FA" rx={3} />
            <rect x={330} y={260} width={120} height={16} fill="#475569" rx={3} />
          </g>
        )}
        {/* short pipe through sealed wall sleeve into the kitchen (off to the right) */}
        <rect x={500} y={280} width={120} height={10} fill="#475569" />
        <circle cx={620} cy={285} r={10} fill="#1F2937" />
      </svg>
      <Caption lines={["Pressure steps down in stages", "Only low-pressure gas enters the kitchen"]} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Cut 4: Kitchen + burner
// ---------------------------------------------------------------------------
const Flame: React.FC<{ x: number; size: number; frame: number }> = ({ x, size, frame }) => {
  const flicker = 1 + Math.sin(frame / 3 + x) * 0.08;
  return (
    <g transform={`translate(${x},0) scale(${flicker})`}>
      <path d={`M0,0 C${-size * 0.6},${-size * 0.6} ${-size * 0.3},${-size * 1.3} 0,${-size * 1.6} C${size * 0.3},${-size * 1.3} ${size * 0.6},${-size * 0.6} 0,0 Z`} fill={THEME.flameOuter} />
      <path d={`M0,0 C${-size * 0.3},${-size * 0.3} ${-size * 0.15},${-size * 0.8} 0,${-size * 1.0} C${size * 0.15},${-size * 0.8} ${size * 0.3},${-size * 0.3} 0,0 Z`} fill={THEME.flameInner} />
    </g>
  );
};

const Cut4_Kitchen: React.FC<SceneProps> = ({ audioPath }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = spring({ frame, fps, config: { damping: 20 }, from: 0, to: 1 });

  return (
    <AbsoluteFill style={{ background: "#FDF6EC", opacity }}>
      {audioPath && <Audio src={audioPath} />}
      <svg viewBox="0 0 800 450" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        {/* wall */}
        <rect x={0} y={0} width={800} height={300} fill="#F8ECD9" />
        {/* floor */}
        <rect x={0} y={300} width={800} height={150} fill="#E5D3B3" />
        {/* methane detector high on wall */}
        <rect x={120} y={40} width={50} height={30} rx={4} fill="#374151" />
        <circle cx={145} cy={55} r={4} fill="#22C55E" />
        {/* accessible isolation valve beside cooker */}
        <rect x={230} y={240} width={16} height={40} fill="#64748B" rx={3} />
        <circle cx={238} cy={238} r={10} fill="#475569" />
        {/* two-burner cooker */}
        <rect x={290} y={260} width={340} height={70} rx={6} fill="#D1D5DB" stroke="#9CA3AF" strokeWidth={2} />
        <circle cx={380} cy={260} r={34} fill="#9CA3AF" />
        <circle cx={520} cy={260} r={44} fill="#9CA3AF" />
        <Flame x={380} size={26} frame={frame} />
        <Flame x={520} size={34} frame={frame} />
        {/* pot on the larger (3kW) burner */}
        <rect x={480} y={205} width={80} height={45} rx={6} fill="#4B5563" />
        <rect x={472} y={200} width={96} height={10} rx={4} fill="#374151" />
        {/* steam */}
        {[0, 1, 2].map((i) => {
          const sOffset = (frame * 1.2 + i * 40) % 120;
          const sOpacity = 1 - sOffset / 120;
          return (
            <circle
              key={i}
              cx={500 + i * 20}
              cy={200 - sOffset}
              r={6 + sOffset / 20}
              fill="#FFFFFF"
              opacity={Math.max(0, sOpacity * 0.6)}
            />
          );
        })}
      </svg>
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
  const pullBack = spring({ frame, fps, config: { damping: 30 }, from: 1.08, to: 1 });
  const opacity = spring({ frame, fps, config: { damping: 20 }, from: 0, to: 1 });

  return (
    <AbsoluteFill style={{ background: `linear-gradient(${THEME.sky}, ${THEME.skyDeep})` }}>
      {audioPath && <Audio src={audioPath} />}
      <div style={{ transform: `scale(${pullBack})`, width: "100%", height: "100%", position: "relative" }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "35%", background: THEME.ground }} />
        <div
          style={{
            position: "absolute",
            bottom: "28%",
            left: "30%",
            width: 560,
            height: 260,
            background: THEME.house,
            borderRadius: 6,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "28%",
            left: "68%",
            width: 140,
            height: 170,
            background: THEME.shelter,
            borderRadius: 4,
          }}
        />
      </div>
      <ConceptLabel frame={frame} fps={fps} />
      <div style={{ position: "absolute", top: "38%", left: 0, right: 0, textAlign: "center", opacity }}>
        <div style={{ fontSize: 90, fontWeight: 900, color: THEME.text, letterSpacing: 2 }}>HOME 10</div>
        <div style={{ fontSize: 30, fontWeight: 700, color: THEME.caption, marginTop: 14 }}>
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
      <Audio src={`${audioBase}/home10_bgm.wav`} volume={1} />
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
