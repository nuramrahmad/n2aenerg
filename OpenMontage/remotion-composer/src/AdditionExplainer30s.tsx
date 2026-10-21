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
 * AdditionExplainer30s
 *
 * 30-second explainer teaching basic addition.
 *
 * Structure:
 * - Cut 1: Hook - "What is Addition?" (0-4s)
 * - Cut 2: Example 1 - 2 apples + 3 apples, count to 5 (4-12s)
 * - Cut 3: Equation reveal - 2 + 3 = 5 (12-18s)
 * - Cut 4: Example 2 - 4 stars + 2 stars, count to 6, then equation (18-25s)
 * - Cut 5: Outro recap (25-30s)
 */

const THEME = {
  bg: "#FFF8E7",
  blue: "#2563EB",
  green: "#16A34A",
  orange: "#F97316",
  text: "#1F2937",
};

interface SceneProps {
  audioPath?: string;
}

const Cut1_Hook: React.FC<SceneProps> = ({ audioPath }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 120 },
    from: 0.6,
    to: 1,
  });
  const opacity = spring({ frame, fps, config: { damping: 20 }, from: 0, to: 1 });

  return (
    <AbsoluteFill
      style={{ background: THEME.bg, justifyContent: "center", alignItems: "center" }}
    >
      {audioPath && <Audio src={audioPath} />}
      <div style={{ transform: `scale(${scale})`, opacity, textAlign: "center" }}>
        <div style={{ fontSize: 100 }}>➕</div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: THEME.text,
            fontFamily: "Inter, sans-serif",
          }}
        >
          What is Addition?
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ObjectGroup: React.FC<{
  emoji: string;
  count: number;
  startFrame: number;
  color: string;
  label: string;
}> = ({ emoji, count, startFrame, color, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ display: "flex", gap: 10 }}>
        {Array.from({ length: count }).map((_, i) => {
          const itemFrame = frame - startFrame - i * 6;
          const s = spring({
            frame: itemFrame,
            fps,
            config: { damping: 10, stiffness: 150 },
            from: 0,
            to: 1,
          });
          return (
            <div key={i} style={{ fontSize: 70, transform: `scale(${Math.max(0, s)})` }}>
              {emoji}
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: 48, fontWeight: 700, color }}>{label}</div>
    </div>
  );
};

const Cut2_Example1: React.FC<SceneProps> = ({ audioPath }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const countStart = 90;
  const countFrame = frame - countStart;
  const countValue = Math.min(5, Math.max(0, Math.floor(countFrame / 10) + 1));
  const counterOpacity = spring({
    frame: countFrame,
    fps,
    config: { damping: 20 },
    from: 0,
    to: 1,
  });

  return (
    <AbsoluteFill
      style={{ background: THEME.bg, justifyContent: "center", alignItems: "center" }}
    >
      {audioPath && <Audio src={audioPath} />}
      <div style={{ display: "flex", gap: 60, alignItems: "center" }}>
        <ObjectGroup emoji="🍎" count={2} startFrame={0} color={THEME.blue} label="2" />
        <div style={{ fontSize: 60, fontWeight: 800, color: THEME.text }}>+</div>
        <ObjectGroup emoji="🍎" count={3} startFrame={30} color={THEME.green} label="3" />
      </div>
      {countFrame > 0 && (
        <div
          style={{
            marginTop: 50,
            opacity: counterOpacity,
            fontSize: 56,
            fontWeight: 800,
            color: THEME.orange,
          }}
        >
          Count them all: {countValue}
        </div>
      )}
    </AbsoluteFill>
  );
};

const Cut3_Equation: React.FC<SceneProps> = ({ audioPath }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 100 },
    from: 0,
    to: 1,
  });
  const glow = Math.sin(frame / 6) * 0.15 + 1;

  return (
    <AbsoluteFill
      style={{ background: THEME.bg, justifyContent: "center", alignItems: "center" }}
    >
      {audioPath && <Audio src={audioPath} />}
      <div style={{ transform: `scale(${scale})`, fontSize: 120, fontWeight: 800, display: "flex", gap: 20 }}>
        <span style={{ color: THEME.blue }}>2</span>
        <span style={{ color: THEME.text }}>+</span>
        <span style={{ color: THEME.green }}>3</span>
        <span style={{ color: THEME.text }}>=</span>
        <span style={{ color: THEME.orange, transform: `scale(${glow})`, display: "inline-block" }}>5</span>
      </div>
    </AbsoluteFill>
  );
};

const Cut4_Example2: React.FC<SceneProps> = ({ audioPath }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const countStart = 90;
  const countFrame = frame - countStart;
  const countValue = Math.min(6, Math.max(0, Math.floor(countFrame / 10) + 1));
  const counterOpacity = spring({
    frame: countFrame,
    fps,
    config: { damping: 20 },
    from: 0,
    to: 1,
  });
  const eqStart = 150;
  const eqFrame = frame - eqStart;
  const eqScale = spring({
    frame: eqFrame,
    fps,
    config: { damping: 10, stiffness: 100 },
    from: 0,
    to: 1,
  });

  return (
    <AbsoluteFill
      style={{ background: THEME.bg, justifyContent: "center", alignItems: "center" }}
    >
      {audioPath && <Audio src={audioPath} />}
      {eqFrame <= 0 ? (
        <>
          <div style={{ display: "flex", gap: 60, alignItems: "center" }}>
            <ObjectGroup emoji="⭐" count={4} startFrame={0} color={THEME.blue} label="4" />
            <div style={{ fontSize: 60, fontWeight: 800, color: THEME.text }}>+</div>
            <ObjectGroup emoji="⭐" count={2} startFrame={30} color={THEME.green} label="2" />
          </div>
          {countFrame > 0 && (
            <div
              style={{
                marginTop: 50,
                opacity: counterOpacity,
                fontSize: 56,
                fontWeight: 800,
                color: THEME.orange,
              }}
            >
              Count up: {countValue}
            </div>
          )}
        </>
      ) : (
        <div style={{ transform: `scale(${eqScale})`, fontSize: 120, fontWeight: 800, display: "flex", gap: 20 }}>
          <span style={{ color: THEME.blue }}>4</span>
          <span style={{ color: THEME.text }}>+</span>
          <span style={{ color: THEME.green }}>2</span>
          <span style={{ color: THEME.text }}>=</span>
          <span style={{ color: THEME.orange }}>6</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

const Cut5_Outro: React.FC<SceneProps> = ({ audioPath }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = spring({ frame, fps, config: { damping: 20 }, from: 0, to: 1 });

  return (
    <AbsoluteFill
      style={{ background: THEME.bg, justifyContent: "center", alignItems: "center" }}
    >
      {audioPath && <Audio src={audioPath} />}
      <div style={{ opacity, textAlign: "center" }}>
        <div style={{ fontSize: 56, fontWeight: 800, color: THEME.text, marginBottom: 20 }}>
          Combine numbers → Bigger total!
        </div>
        <div style={{ fontSize: 90 }}>✅</div>
      </div>
    </AbsoluteFill>
  );
};

export const AdditionExplainer30s: React.FC = () => {
  const audioBase = staticFile("addition_explainer_audio");
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={120}>
        <Cut1_Hook audioPath={`${audioBase}/a1_hook.wav`} />
      </Sequence>
      <Sequence from={120} durationInFrames={240}>
        <Cut2_Example1 audioPath={`${audioBase}/a2_example1.wav`} />
      </Sequence>
      <Sequence from={360} durationInFrames={180}>
        <Cut3_Equation audioPath={`${audioBase}/a3_equation.wav`} />
      </Sequence>
      <Sequence from={540} durationInFrames={210}>
        <Cut4_Example2 audioPath={`${audioBase}/a4_example2.wav`} />
      </Sequence>
      <Sequence from={750} durationInFrames={150}>
        <Cut5_Outro audioPath={`${audioBase}/a5_outro.wav`} />
      </Sequence>
    </AbsoluteFill>
  );
};
