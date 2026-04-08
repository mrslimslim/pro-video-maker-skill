import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { useGsapTimeline } from "@/hooks/useGsapTimeline";
import { ContentTimelineVerticalProps } from "./schema";

export const ContentTimelineVertical: React.FC<ContentTimelineVerticalProps> = ({
  title,
  items,
  backgroundColor,
  textColor,
  accentColor,
  fontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineLength = useMemo(() => Math.max(320, items.length * 108 + 80), [items.length]);

  const lineDraw = interpolate(
    frame,
    [14, 14 + Math.min(100, items.length * 16)],
    [lineLength, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const titleSpring = spring({
    fps,
    frame,
    config: { damping: 16, stiffness: 140, mass: 0.6 },
  });

  const { scope } = useGsapTimeline((tl, el) => {
    for (let i = 0; i < items.length; i++) {
      const node = el.querySelector<HTMLElement>(`.timeline-node[data-index="${i}"]`);
      const label = el.querySelector<HTMLElement>(`.timeline-label[data-index="${i}"]`);

      if (node) {
        tl.from(node, {
          scale: 0,
          duration: 0.44,
          ease: "back.out(2)",
        });
      }
      if (label) {
        tl.from(
          label,
          {
            opacity: 0,
            y: 10,
            duration: 0.34,
            ease: "power2.out",
          },
          "+=0.06"
        );
      }
    }
  }, [items.length]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        padding: "7% 9%",
      }}
    >
      <div ref={scope} style={{ position: "relative", width: "100%", maxWidth: 920, margin: "0 auto" }}>
        {title && (
          <h2
            style={{
              fontSize: 46,
              fontWeight: 800,
              color: textColor,
              fontFamily,
              margin: 0,
              marginBottom: 40,
              textAlign: "center",
              opacity: titleSpring,
              transform: `translateY(${(1 - titleSpring) * 24}px)`,
            }}
          >
            {title}
          </h2>
        )}

        <div style={{ position: "relative", paddingTop: 8, paddingBottom: 16 }}>
          <svg
            width={4}
            height={lineLength}
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              transform: "translateX(-50%)",
              overflow: "visible",
            }}
            aria-hidden
          >
            <line
              x1={2}
              y1={0}
              x2={2}
              y2={lineLength}
              stroke={accentColor}
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray={lineLength}
              strokeDashoffset={lineDraw}
            />
          </svg>

          {items.map((item, i) => (
            <div
              key={`${item.label}-${i}`}
              style={{
                display: "flex",
                alignItems: "center",
                minHeight: 96,
                marginBottom: i === items.length - 1 ? 0 : 12,
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "flex-end",
                  paddingRight: 22,
                }}
              >
                {i % 2 === 0 ? (
                  <div
                    className="timeline-label"
                    data-index={i}
                    style={{
                      maxWidth: "44%",
                      textAlign: "right",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: textColor,
                        fontFamily,
                        marginBottom: 6,
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: 17,
                        fontWeight: 400,
                        color: textColor,
                        fontFamily,
                        lineHeight: 1.5,
                        opacity: 0.82,
                      }}
                    >
                      {item.description}
                    </div>
                  </div>
                ) : null}
              </div>

              <div
                style={{
                  width: 36,
                  flexShrink: 0,
                  display: "flex",
                  justifyContent: "center",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <div
                  className="timeline-node"
                  data-index={i}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    backgroundColor: accentColor,
                    border: `4px solid ${backgroundColor}`,
                    boxShadow: `0 0 0 2px ${accentColor}55`,
                    transform: "scale(1)",
                  }}
                />
              </div>

              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "flex-start",
                  paddingLeft: 22,
                }}
              >
                {i % 2 === 1 ? (
                  <div
                    className="timeline-label"
                    data-index={i}
                    style={{
                      maxWidth: "44%",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: textColor,
                        fontFamily,
                        marginBottom: 6,
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: 17,
                        fontWeight: 400,
                        color: textColor,
                        fontFamily,
                        lineHeight: 1.5,
                        opacity: 0.82,
                      }}
                    >
                      {item.description}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
