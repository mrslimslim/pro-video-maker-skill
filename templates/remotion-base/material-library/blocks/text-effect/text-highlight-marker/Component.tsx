import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { TextHighlightMarkerProps } from "./schema";

function stripEdgePunctuation(s: string): string {
  return s.replace(/^[^a-zA-Z0-9\u4e00-\u9fff]+|[^a-zA-Z0-9\u4e00-\u9fff]+$/g, "");
}

type Hl = { word: string; color: string };

const HighlightSpan: React.FC<{
  token: string;
  hl: Hl;
  lineStart: number;
  hiOrder: number;
}> = ({ token, hl, lineStart, hiOrder }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hiProg = spring({
    fps,
    frame: frame - lineStart - 14 - hiOrder * 7,
    config: { damping: 14, stiffness: 200, mass: 0.45 },
  });

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        padding: "0 3px",
        margin: "0 1px",
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 0,
          bottom: 4,
          height: "52%",
          width: "100%",
          backgroundColor: hl.color,
          transformOrigin: "left center",
          transform: `scaleX(${hiProg})`,
          borderRadius: 3,
          opacity: 0.92,
          zIndex: 0,
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{token}</span>
    </span>
  );
};

const LineRow: React.FC<{
  line: { text: string; highlights?: Hl[] };
  lineIdx: number;
  textColor: string;
}> = ({ line, lineIdx, textColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lineStart = 10 + lineIdx * 18;
  const lineOp = spring({
    fps,
    frame: frame - lineStart,
    config: { damping: 16, stiffness: 130, mass: 0.65 },
  });
  const lineY = interpolate(lineOp, [0, 1], [22, 0]);

  const parts = line.text.split(/(\s+)/);
  let hiCursor = 0;

  return (
    <div
      style={{
        fontSize: 38,
        fontWeight: 700,
        color: textColor,
        lineHeight: 1.35,
        marginBottom: 20,
        opacity: lineOp,
        transform: `translateY(${lineY}px)`,
      }}
    >
      {parts.map((tok, ti) => {
        if (/^\s+$/.test(tok)) {
          return <span key={`sp-${lineIdx}-${ti}`}>{tok}</span>;
        }

        const clean = stripEdgePunctuation(tok);
        const hl = line.highlights?.find((h) => h.word === tok || h.word === clean);

        if (!hl) {
          return (
            <span key={`w-${lineIdx}-${ti}`} style={{ position: "relative" }}>
              {tok}
            </span>
          );
        }

        const order = hiCursor;
        hiCursor += 1;
        return <HighlightSpan key={`hl-${lineIdx}-${ti}`} token={tok} hl={hl} lineStart={lineStart} hiOrder={order} />;
      })}
    </div>
  );
};

export const TextHighlightMarker: React.FC<TextHighlightMarkerProps> = ({
  lines,
  backgroundColor,
  textColor,
  fontFamily,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "10% 12%",
        fontFamily,
      }}
    >
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        {lines.map((line, lineIdx) => (
          <LineRow key={`line-${lineIdx}`} line={line} lineIdx={lineIdx} textColor={textColor} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
