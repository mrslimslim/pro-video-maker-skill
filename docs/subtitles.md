# Subtitles

Subtitle generation and styling system for video projects.

## Auto-generation from Script

Subtitles are derived from the script narration defined during pre-production.

### Timing Calculation

1. Get scene start time and duration from decomposition
2. Split narration into subtitle segments (1-2 sentences, max 15 words each)
3. Distribute timing evenly across the scene, or word-count-proportional
4. Add 0.5s buffer between segments

Format:

```json
{
  "subtitles": [
    { "id": 1, "start": 0.0, "end": 3.5, "text": "Did you know these 5 Python tips?" },
    { "id": 2, "start": 4.0, "end": 8.0, "text": "Tip 1: Use list comprehensions" },
    { "id": 3, "start": 8.5, "end": 13.0, "text": "They're faster and more readable" }
  ]
}
```

## Animation Styles

### Word-by-Word Reveal

Each word appears as the narration progresses. Current word highlighted.

```tsx
const WordByWord: React.FC<{ words: string[]; startFrame: number }> = ({
  words, startFrame
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const framesPerWord = 8; // ~0.27s per word at 30fps

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {words.map((word, i) => {
        const wordFrame = startFrame + i * framesPerWord;
        const isVisible = frame >= wordFrame;
        const isCurrent = frame >= wordFrame && frame < wordFrame + framesPerWord;
        return (
          <span key={i} style={{
            opacity: isVisible ? 1 : 0,
            color: isCurrent ? accentColor : textColor,
            fontWeight: isCurrent ? 700 : 400,
          }}>
            {word}
          </span>
        );
      })}
    </div>
  );
};
```

### Line-by-Line Pop

Each subtitle line pops in with spring animation.

```tsx
const SubtitleLine: React.FC<{ text: string; enterFrame: number }> = ({
  text, enterFrame
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    fps, frame: frame - enterFrame,
    config: { damping: 12, stiffness: 200 },
  });
  return (
    <div style={{
      opacity: progress,
      transform: `translateY(${(1 - progress) * 20}px) scale(${0.9 + progress * 0.1})`,
    }}>
      {text}
    </div>
  );
};
```

### Karaoke Highlight

Words highlight progressively like karaoke.

Implementation: Use `clipPath` or `background-clip` with `linear-gradient`
to sweep a highlight color across the text synced to timing.

### Typewriter

Characters appear one by one with blinking cursor.

## Subtitle Positioning

### Platform-specific defaults

| Platform | Position | Safe Zone |
|----------|----------|-----------|
| TikTok/Reels (9:16) | Center-bottom (75% from top) | 10% margin all sides |
| YouTube (16:9) | Bottom-center (85% from top) | 5% margin |
| Instagram (1:1) | Center or bottom-third | 8% margin |

### Position configuration

```tsx
const subtitlePosition = {
  bottom: "10%",        // distance from bottom
  left: "50%",
  transform: "translateX(-50%)",
  textAlign: "center",
  maxWidth: "80%",      // prevent edge-to-edge text
};
```

## Subtitle Styling

### Text styling rules

- Font size: >= 28px at 1080p (larger for vertical video)
- Font weight: 600 or 700 for readability
- Letter spacing: slight positive for clarity
- Line height: >= 1.4
- Max 2 lines visible at once
- Max 15 words per subtitle segment

### Background options

1. **Semi-transparent box**: `backgroundColor: rgba(0,0,0,0.6), padding: 8px 16px, borderRadius: 8px`
2. **Text shadow**: `textShadow: "0 2px 8px rgba(0,0,0,0.8)"`
3. **Outline**: `-webkit-text-stroke: 1px black` (use sparingly)
4. **Blurred backdrop**: `backdropFilter: blur(8px)`

Prefer semi-transparent box for busy backgrounds, text shadow for clean ones.

## Export Formats

### SRT Export

```
1
00:00:00,000 --> 00:00:03,500
Did you know these 5 Python tips?

2
00:00:04,000 --> 00:00:08,000
Tip 1: Use list comprehensions
```

### VTT Export

```
WEBVTT

00:00:00.000 --> 00:00:03.500
Did you know these 5 Python tips?

00:00:04.000 --> 00:00:08.000
Tip 1: Use list comprehensions
```

### Generation helper

The subtitle component should include a method to export timing data
as SRT or VTT format for external use (YouTube upload, accessibility).
