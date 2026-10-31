import {
  AbsoluteFill,
  Audio,
  Freeze,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * YusurpayComingSoon30s
 *
 * 30-second vertical (9:16) "Coming Soon" teaser.
 *
 * Scenes 1-5 are AI-generated live-action clips (generate_yusurpay_clips.py,
 * via the HeyGen gateway -- VEO/Kling/Runway). Scene 6 is a plain brand-color
 * logo card, built natively here (not AI-generated, to avoid logo
 * distortion). Each video clip is held on its last frame (via Remotion's
 * <Freeze>) if the generated clip is shorter than its scene's slot, so
 * timing always lands exactly on the script's cut points.
 *
 * Structure (900 frames @ 30fps = 30s):
 * - Scene 1 (0-5s):   The market
 * - Scene 2 (5-10s):  The problem (cash)
 * - Scene 3 (10-15s): The bank is far
 * - Scene 4 (15-21s): Yusurpay (payment)
 * - Scene 5 (21-26s): The AI banker (Hausa voice)
 * - Scene 6 (26-30s): Logo close
 */

const BRAND = {
  green: "#1E6B4E",
  cream: "#F3ECE2",
};

interface SceneProps {
  audioPath?: string;
}

const VideoClip: React.FC<{ src: string; clipFrames: number }> = ({ src, clipFrames }) => {
  const frame = useCurrentFrame();
  if (frame < clipFrames) {
    return <OffthreadVideo src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  }
  // Hold the clip's last frame for the remainder of the scene's slot.
  return (
    <Freeze frame={clipFrames - 1}>
      <OffthreadVideo src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Freeze>
  );
};

const OnScreenText: React.FC<{ text: string; frame: number; fps: number; from?: number }> = ({
  text,
  frame,
  fps,
  from = 10,
}) => {
  const opacity = spring({ frame: frame - from, fps, config: { damping: 20 }, from: 0, to: 1 });
  return (
    <div
      style={{
        position: "absolute",
        bottom: 90,
        left: 40,
        right: 40,
        textAlign: "center",
        opacity,
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "14px 26px",
          background: "rgba(0,0,0,0.45)",
          borderRadius: 10,
          fontSize: 38,
          fontWeight: 800,
          color: BRAND.cream,
          lineHeight: 1.25,
        }}
      >
        {text}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Scene 1: The market (0-5s, 150 frames)
// ---------------------------------------------------------------------------
const Scene1_Market: React.FC<SceneProps> = ({ audioPath }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {audioPath && <Audio src={audioPath} />}
      <VideoClip src={staticFile("yusurpay_clips/s1_market.mp4")} clipFrames={150} />
      <OnScreenText text="Market day." frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 2: The problem (5-10s, 150 frames)
// ---------------------------------------------------------------------------
const Scene2_Cash: React.FC<SceneProps> = ({ audioPath }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {audioPath && <Audio src={audioPath} />}
      <VideoClip src={staticFile("yusurpay_clips/s2_cash.mp4")} clipFrames={150} />
      <OnScreenText text="Cash. Risk. No record." frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 3: The bank is far (10-15s, 150 frames)
// ---------------------------------------------------------------------------
const Scene3_Road: React.FC<SceneProps> = ({ audioPath }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {audioPath && <Audio src={audioPath} />}
      <VideoClip src={staticFile("yusurpay_clips/s3_road.mp4")} clipFrames={150} />
      <OnScreenText text="Hours from the nearest bank." frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 4: Yusurpay / payment (15-21s, 180 frames)
// ---------------------------------------------------------------------------
const Scene4_Payment: React.FC<SceneProps> = ({ audioPath }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {audioPath && <Audio src={audioPath} />}
      <VideoClip src={staticFile("yusurpay_clips/s4_payment.mp4")} clipFrames={150} />
      <OnScreenText text="Paid in seconds. No riba." frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 5: The AI banker / Hausa voice (21-26s, 150 frames)
// ---------------------------------------------------------------------------
const Scene5_Voice: React.FC<SceneProps> = ({ audioPath }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {audioPath && <Audio src={audioPath} />}
      <VideoClip src={staticFile("yusurpay_clips/s5_voice.mp4")} clipFrames={150} />
      <OnScreenText text="Talk to it in Hausa." frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 6: Logo close (26-30s, 120 frames)
// ---------------------------------------------------------------------------
interface Scene6Props extends SceneProps {
  logoSrc: string;
  handle: string;
}

const Scene6_Logo: React.FC<Scene6Props> = ({ audioPath, logoSrc, handle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoScale = spring({ frame, fps, config: { damping: 14, stiffness: 90 }, from: 0.85, to: 1 });
  const logoOpacity = spring({ frame, fps, config: { damping: 20 }, from: 0, to: 1 });
  const footerOpacity = spring({ frame: frame - 45, fps, config: { damping: 20 }, from: 0, to: 1 });

  return (
    <AbsoluteFill
      style={{
        background: BRAND.green,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {audioPath && <Audio src={audioPath} />}
      {/* The lockup is a dark-on-light logo (#141414 icon/text, grey tagline),
          not designed for direct placement on the solid brand green -- give
          it a cream card to sit on so it stays legible, per the "contrast"
          implied by its own color choices. */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          background: BRAND.cream,
          borderRadius: 20,
          padding: "36px 44px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
        }}
      >
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={logoSrc} style={{ width: 420, height: "auto", display: "block" }} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 28,
          fontWeight: 700,
          color: BRAND.cream,
          opacity: footerOpacity,
        }}
      >
        Coming soon · Kano · {handle}
      </div>
    </AbsoluteFill>
  );
};

interface YusurpayProps {
  logoSrc?: string;
  handle?: string;
}

export const YusurpayComingSoon30s: React.FC<YusurpayProps> = ({
  logoSrc = staticFile("yusurpay_brand/yusurpay-lockup-en.svg"),
  handle = "@yusurpay",
}) => {
  const audioBase = staticFile("yusurpay_audio");
  return (
    <AbsoluteFill>
      <Audio src={`${audioBase}/yusurpay_bgm.wav`} volume={0.3} />
      <Sequence from={0} durationInFrames={150}>
        <Scene1_Market audioPath={`${audioBase}/s1_market.wav`} />
      </Sequence>
      <Sequence from={150} durationInFrames={150}>
        <Scene2_Cash audioPath={`${audioBase}/s2_cash.wav`} />
      </Sequence>
      <Sequence from={300} durationInFrames={150}>
        <Scene3_Road audioPath={`${audioBase}/s3_road.wav`} />
      </Sequence>
      <Sequence from={450} durationInFrames={180}>
        <Scene4_Payment audioPath={`${audioBase}/s4_payment.wav`} />
      </Sequence>
      <Sequence from={630} durationInFrames={150}>
        <Scene5_Voice audioPath={`${audioBase}/s5_voice.wav`} />
      </Sequence>
      <Sequence from={780} durationInFrames={120}>
        <Scene6_Logo audioPath={`${audioBase}/s6_close.wav`} logoSrc={logoSrc} handle={handle} />
      </Sequence>
    </AbsoluteFill>
  );
};
