import {
  Composition,
  Sequence,
  AbsoluteFill,
  Video,
  Audio,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { StatCard } from "./components/StatCard";
import { TextCard } from "./components/TextCard";
import { HeroTitle } from "./components/HeroTitle";
import { ComparisonCard } from "./components/ComparisonCard";

/**
 * AIExplainerAdoptionParadox
 *
 * 60-second video explaining the AI adoption paradox:
 * 88% of companies use AI, but only 6% are winning with it.
 *
 * Structure:
 * - Cut 1-2: Hook with 88% vs 6% stat cards (0-5s)
 * - Cut 3: Divergence animation (5-12s)
 * - Cut 4-6: Three barriers (12-27s)
 * - Cut 7-8: Climax - The 6% and differentiators (27-38s)
 * - Cut 9: Landing - Key takeaway (38-45s)
 * - Cut 10: Outro - Closing question (45-47s)
 */

interface SceneProps {
  audioPath?: string;
  duration: number;
}

// Color palette - clean-professional theme
const THEME = {
  primaryBlue: "#2563EB",
  accentTeal: "#14B8A6",
  accentOrange: "#F97316",
  accentRed: "#EF4444",
  white: "#FFFFFF",
  lightGray: "#F9FAFB",
  darkGray: "#1F2937",
};

/**
 * Cut 1: Hook - 88% Stat Card (0-3s)
 */
const Cut1_HookStat1: React.FC<SceneProps> = ({ audioPath, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numberScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 120 },
    from: 0,
    to: 1,
  });

  const subtitleOpacity = spring({
    frame: frame - 15,
    fps,
    config: { damping: 20 },
  });

  return (
    <AbsoluteFill style={{ background: THEME.lightGray }}>
      {audioPath && <Audio src={audioPath} />}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          fontSize: 160,
          fontWeight: 800,
          color: THEME.accentTeal,
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div style={{ transform: `scale(${numberScale})` }}>88%</div>
        <div
          style={{
            fontSize: 48,
            color: THEME.darkGray,
            marginTop: 24,
            opacity: subtitleOpacity,
            fontWeight: 400,
          }}
        >
          of companies use AI
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Cut 2: Hook - Contrast Pivot to 6% (3-5s)
 */
const Cut2_HookStat2: React.FC<SceneProps> = ({ audioPath, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftSlide = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
    from: 0,
    to: -400,
  });

  const rightScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 12, stiffness: 120 },
    from: 0,
    to: 1,
  });

  return (
    <AbsoluteFill style={{ background: THEME.lightGray }}>
      {audioPath && <Audio src={audioPath} />}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          gap: 100,
        }}
      >
        {/* Left stat: 88% */}
        <div
          style={{
            transform: `translateX(${leftSlide}px) scale(0.7)`,
            opacity: 0.6,
            fontSize: 100,
            fontWeight: 800,
            color: THEME.primaryBlue,
            fontFamily: "Inter, system-ui, sans-serif",
            textAlign: "center",
          }}
        >
          <div>88%</div>
          <div style={{ fontSize: 28, fontWeight: 400, color: THEME.darkGray, marginTop: 8 }}>
            use AI
          </div>
        </div>

        {/* Right stat: 6% */}
        <div
          style={{
            transform: `scale(${rightScale})`,
            fontSize: 140,
            fontWeight: 800,
            color: THEME.accentRed,
            fontFamily: "Inter, system-ui, sans-serif",
            textAlign: "center",
          }}
        >
          <div>6%</div>
          <div style={{ fontSize: 32, fontWeight: 400, color: THEME.darkGray, marginTop: 12 }}>
            winning with it
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Cut 3: Setup - Adoption vs Impact Divergence (5-12s)
 */
const Cut3_DivergenceChart: React.FC<SceneProps> = ({ audioPath, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const drawProgress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
    from: 0,
    to: 1,
  });

  return (
    <AbsoluteFill style={{ background: THEME.lightGray }}>
      {audioPath && <Audio src={audioPath} />}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Adoption line (steep) */}
        <line
          x1="300"
          y1="700"
          x2={300 + drawProgress * 600}
          y2={700 - drawProgress * 400}
          stroke={THEME.accentTeal}
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Impact line (shallow) */}
        <line
          x1="300"
          y1="700"
          x2={300 + drawProgress * 600}
          y2={700 - drawProgress * 80}
          stroke={THEME.accentOrange}
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Labels - appear when lines complete */}
        {drawProgress > 0.8 && (
          <>
            <text
              x="900"
              y="280"
              fontSize="48"
              fontWeight="700"
              fill={THEME.accentTeal}
              fontFamily="Inter, system-ui, sans-serif"
              textAnchor="middle"
            >
              Adoption: 88%
            </text>
            <text
              x="900"
              y="650"
              fontSize="48"
              fontWeight="700"
              fill={THEME.accentOrange}
              fontFamily="Inter, system-ui, sans-serif"
              textAnchor="middle"
            >
              Impact: 6%
            </text>
          </>
        )}
      </svg>
    </AbsoluteFill>
  );
};

/**
 * Cut 4-6: Build - Three Barriers (12-27s)
 */
const Cut4_Barrier1: React.FC<SceneProps> = ({ audioPath, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numberPop = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 150 },
    from: 0,
    to: 1,
  });

  const textSlide = spring({
    frame: frame - 10,
    fps,
    config: { damping: 18, stiffness: 100 },
  });

  return (
    <AbsoluteFill style={{ background: THEME.lightGray }}>
      {audioPath && <Audio src={audioPath} />}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 60,
          paddingLeft: 200,
        }}
      >
        {/* Number circle */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: THEME.accentTeal,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 72,
            fontWeight: 700,
            color: THEME.white,
            fontFamily: "Inter, system-ui, sans-serif",
            transform: `scale(${numberPop})`,
            flexShrink: 0,
          }}
        >
          1
        </div>

        {/* Text */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 500,
            color: THEME.darkGray,
            fontFamily: "Inter, system-ui, sans-serif",
            opacity: textSlide,
            transform: `translateX(${textSlide * 50}px)`,
          }}
        >
          Tool without fundamentals
        </div>

        {/* Icon placeholder */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 8,
            background: THEME.accentTeal,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: THEME.white,
            fontSize: 48,
            opacity: textSlide,
            marginLeft: "auto",
            marginRight: 100,
            flexShrink: 0,
          }}
        >
          🔧
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Cut5_Barrier2: React.FC<SceneProps> = ({ audioPath, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numberPop = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 150 },
  });

  const textSlide = spring({
    frame: frame - 10,
    fps,
    config: { damping: 18, stiffness: 100 },
  });

  return (
    <AbsoluteFill style={{ background: THEME.lightGray }}>
      {audioPath && <Audio src={audioPath} />}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 60,
          paddingLeft: 200,
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: THEME.accentTeal,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 72,
            fontWeight: 700,
            color: THEME.white,
            fontFamily: "Inter, system-ui, sans-serif",
            transform: `scale(${numberPop})`,
            flexShrink: 0,
          }}
        >
          2
        </div>

        <div
          style={{
            fontSize: 48,
            fontWeight: 500,
            color: THEME.darkGray,
            fontFamily: "Inter, system-ui, sans-serif",
            opacity: textSlide,
            transform: `translateX(${textSlide * 50}px)`,
          }}
        >
          Missing in-house expertise
        </div>

        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 8,
            background: THEME.primaryBlue,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: THEME.white,
            fontSize: 48,
            opacity: textSlide,
            marginLeft: "auto",
            marginRight: 100,
            flexShrink: 0,
          }}
        >
          🤔
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Cut6_Barrier3: React.FC<SceneProps> = ({ audioPath, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numberPop = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 150 },
  });

  const textSlide = spring({
    frame: frame - 10,
    fps,
    config: { damping: 18, stiffness: 100 },
  });

  return (
    <AbsoluteFill style={{ background: THEME.lightGray }}>
      {audioPath && <Audio src={audioPath} />}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 60,
          paddingLeft: 200,
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: THEME.accentOrange,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 72,
            fontWeight: 700,
            color: THEME.white,
            fontFamily: "Inter, system-ui, sans-serif",
            transform: `scale(${numberPop})`,
            flexShrink: 0,
          }}
        >
          3
        </div>

        <div
          style={{
            fontSize: 48,
            fontWeight: 500,
            color: THEME.darkGray,
            fontFamily: "Inter, system-ui, sans-serif",
            opacity: textSlide,
            transform: `translateX(${textSlide * 50}px)`,
          }}
        >
          People resist change
        </div>

        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 8,
            background: THEME.accentOrange,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: THEME.white,
            fontSize: 48,
            opacity: textSlide,
            marginLeft: "auto",
            marginRight: 100,
            flexShrink: 0,
          }}
        >
          🚫
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Cut 7-8: Climax - The 6% and Differentiators (27-38s)
 */
const Cut7_Climax6Percent: React.FC<SceneProps> = ({ audioPath, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideDown = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
    from: -300,
    to: 0,
  });

  const glow = Math.sin(frame * 0.05) * 15 + 40;

  return (
    <AbsoluteFill
      style={{
        background: THEME.lightGray,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {audioPath && <Audio src={audioPath} />}
      <div style={{ transform: `translateY(${slideDown}px)`, textAlign: "center" }}>
        <div
          style={{
            fontSize: 180,
            fontWeight: 800,
            color: THEME.accentRed,
            fontFamily: "Inter, system-ui, sans-serif",
            textShadow: `0 0 ${glow}px ${THEME.accentRed}`,
          }}
        >
          6%
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 600,
            color: THEME.darkGray,
            marginTop: 24,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          The winners
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Cut8_Differentiators: React.FC<SceneProps> = ({ audioPath, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const item1Slide = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 18, stiffness: 100 },
  });

  const item2Slide = spring({
    frame: Math.max(0, frame - 75),
    fps,
    config: { damping: 18, stiffness: 100 },
  });

  const item3Slide = spring({
    frame: Math.max(0, frame - 120),
    fps,
    config: { damping: 18, stiffness: 100 },
  });

  return (
    <AbsoluteFill style={{ background: THEME.lightGray }}>
      {audioPath && <Audio src={audioPath} />}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          gap: 60,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: THEME.accentRed,
            marginBottom: 40,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          6% Know:
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            opacity: item1Slide,
            transform: `translateX(${item1Slide * 50}px)`,
          }}
        >
          <div style={{ fontSize: 48 }}>👥</div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 500,
              color: THEME.darkGray,
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            Invest in people, not just tech
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            opacity: item2Slide,
            transform: `translateX(${item2Slide * 50}px)`,
          }}
        >
          <div style={{ fontSize: 48 }}>⚙️</div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 500,
              color: THEME.darkGray,
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            Change initiative, not tool deployment
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            opacity: item3Slide,
            transform: `translateX(${item3Slide * 50}px)`,
          }}
        >
          <div style={{ fontSize: 48 }}>📚</div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 500,
              color: THEME.darkGray,
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            Continuous learning culture
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            opacity: Math.max(0, item3Slide - 0.3),
            marginTop: 20,
          }}
        >
          <div style={{ fontSize: 48 }}>✅</div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: "#10B981",
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            Getting results
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Cut 9: Landing - Key Takeaway (38-45s)
 */
const Cut9_Landing: React.FC<SceneProps> = ({ audioPath, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1Slide = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const line2Slide = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const line3Slide = spring({
    frame: Math.max(0, frame - 60),
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  return (
    <AbsoluteFill style={{ background: THEME.lightGray }}>
      {audioPath && <Audio src={audioPath} />}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          gap: 40,
          padding: "0 100px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 600,
            color: THEME.darkGray,
            fontFamily: "Inter, system-ui, sans-serif",
            opacity: line1Slide,
            transform: `translateY(${(1 - line1Slide) * 30}px)`,
          }}
        >
          AI adoption is easy.
        </div>

        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: THEME.accentRed,
            fontFamily: "Inter, system-ui, sans-serif",
            opacity: line2Slide,
            transform: `translateY(${(1 - line2Slide) * 30}px)`,
          }}
        >
          Winning with AI is a choice.
        </div>

        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: THEME.darkGray,
            fontFamily: "Inter, system-ui, sans-serif",
            opacity: line3Slide,
            transform: `translateY(${(1 - line3Slide) * 30}px)`,
          }}
        >
          <span style={{ color: THEME.primaryBlue }}>Strategy</span> +{" "}
          <span style={{ color: THEME.accentTeal }}>People</span> +{" "}
          <span style={{ color: THEME.accentOrange }}>Change</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Cut 10: Outro - Closing Question (45-47s)
 */
const Cut10_Outro: React.FC<SceneProps> = ({ audioPath, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = spring({
    frame,
    fps,
    config: { damping: 25, stiffness: 60 },
  });

  return (
    <AbsoluteFill style={{ background: THEME.lightGray }}>
      {audioPath && <Audio src={audioPath} />}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          padding: "0 100px",
          textAlign: "center",
          opacity: fadeIn,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: THEME.darkGray,
            fontFamily: "Inter, system-ui, sans-serif",
            lineHeight: 1.4,
          }}
        >
          Which category will <span style={{ color: THEME.accentOrange }}>YOUR</span> organization
          choose?
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Main Composition
 */
export const AIExplainerAdoptionParadox: React.FC = () => {
  const audioBasePath = "/projects/ai_explainer_60s/assets/audio";

  return (
    <>
      {/* Cut 1: Hook - 88% (0-3s) */}
      <Sequence from={0} durationInFrames={90}>
        <Cut1_HookStat1 audioPath={`${audioBasePath}/s1_hook.wav`} duration={3} />
      </Sequence>

      {/* Cut 2: Contrast - 6% (3-5s) */}
      <Sequence from={90} durationInFrames={60}>
        <Cut2_HookStat2 audioPath={`${audioBasePath}/s1_hook.wav`} duration={2} />
      </Sequence>

      {/* Cut 3: Divergence (5-12s) */}
      <Sequence from={150} durationInFrames={210}>
        <Cut3_DivergenceChart audioPath={`${audioBasePath}/s2_setup.wav`} duration={7} />
      </Sequence>

      {/* Cut 4: Barrier 1 (12-17s) */}
      <Sequence from={360} durationInFrames={150}>
        <Cut4_Barrier1 audioPath={`${audioBasePath}/s3_build_part1.wav`} duration={5} />
      </Sequence>

      {/* Cut 5: Barrier 2 (17-22s) */}
      <Sequence from={510} durationInFrames={150}>
        <Cut5_Barrier2 audioPath={`${audioBasePath}/s3_build_part1.wav`} duration={5} />
      </Sequence>

      {/* Cut 6: Barrier 3 (22-27s) */}
      <Sequence from={660} durationInFrames={150}>
        <Cut6_Barrier3 audioPath={`${audioBasePath}/s3_build_part1.wav`} duration={5} />
      </Sequence>

      {/* Cut 7: Climax - 6% (27-32s) */}
      <Sequence from={810} durationInFrames={150}>
        <Cut7_Climax6Percent audioPath={`${audioBasePath}/s4_climax.wav`} duration={5} />
      </Sequence>

      {/* Cut 8: Differentiators (32-38s) */}
      <Sequence from={960} durationInFrames={180}>
        <Cut8_Differentiators audioPath={`${audioBasePath}/s4_climax.wav`} duration={6} />
      </Sequence>

      {/* Cut 9: Landing (38-45s) */}
      <Sequence from={1140} durationInFrames={210}>
        <Cut9_Landing audioPath={`${audioBasePath}/s5_landing.wav`} duration={7} />
      </Sequence>

      {/* Cut 10: Outro (45-47s) */}
      <Sequence from={1350} durationInFrames={60}>
        <Cut10_Outro audioPath={`${audioBasePath}/s6_outro.wav`} duration={2} />
      </Sequence>
    </>
  );
};
