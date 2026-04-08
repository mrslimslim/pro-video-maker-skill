# Social Short Video Demo

## Prompt

> "Make a 30-second TikTok video about 5 Python productivity tips"

## Requirements

| Parameter | Value |
|-----------|-------|
| Platform | TikTok (9:16, 1080x1920) |
| Duration | 30 seconds |
| FPS | 30 |
| Style | Kinetic Typography |
| Language | English |

## Script

```
TITLE: 5 Python Tips That 10x Your Speed
DURATION: 30s
PLATFORM: TikTok
TONE: Energetic

SCENE 1: Hook
Duration: 3s
Text: "Stop writing Python like a beginner 🔥"
Visual: Bold text zoom-in on dark background

SCENE 2: Tip 1
Duration: 5s
Text: "1. List Comprehensions"
Code: "[x**2 for x in range(10)]"
Visual: Code typewriter with syntax highlight

SCENE 3: Tip 2
Duration: 5s
Text: "2. F-strings > format()"
Code: 'f"Hello {name}, age {age}"'
Visual: Split comparison old vs new

SCENE 4: Tip 3
Duration: 5s
Text: "3. enumerate() always"
Code: "for i, val in enumerate(items):"
Visual: Code typewriter

SCENE 5: Tip 4
Duration: 5s
Text: "4. Walrus operator :="
Code: "if (n := len(data)) > 10:"
Visual: Code with highlight box on :=

SCENE 6: Tip 5
Duration: 4s
Text: "5. * unpacking magic"
Code: "first, *rest = [1, 2, 3, 4]"
Visual: Code typewriter

SCENE 7: CTA
Duration: 3s
Text: "Follow for more Python tips!"
Visual: Bounce-in text with arrow icon
```

## Design System Match

```
STYLE: Kinetic Typography
PALETTE: Tech Dark
  Primary: #6366F1 (Indigo)
  Background: #0F172A (Dark Navy)
  Text: #F8FAFC (White)
  Accent: #22D3EE (Cyan)
TYPOGRAPHY: Developer (JetBrains Mono / Inter)
MOTION TOKENS:
  Duration: fast
  Easing: power2.out
  Stagger: 0.04s
  Rhythm: upbeat
TRANSITIONS: slide-up between tips, fade for CTA
EFFECTS: typewriter, bounce-in, split-text, syntax-highlight
```

## Scene Decomposition

| Scene | Frames | Type | Effect | Transition Out |
|-------|--------|------|--------|---------------|
| 1. Hook | 0-90 | title | zoom-in + shake | slide-up |
| 2. Tip 1 | 90-240 | code-block | typewriter | slide-up |
| 3. Tip 2 | 240-390 | comparison | split-reveal | slide-up |
| 4. Tip 3 | 390-540 | code-block | typewriter | slide-up |
| 5. Tip 4 | 540-690 | code-block | typewriter + highlight | slide-up |
| 6. Tip 5 | 690-810 | code-block | typewriter | fade |
| 7. CTA | 810-900 | cta | bounce-in | — |

## Generated Remotion Structure

```
src/
├── Root.tsx
├── Video.tsx        # 900 frames, 1080x1920, 30fps
├── scenes/
│   ├── Scene1Hook.tsx
│   ├── Scene2Tip1.tsx
│   ├── Scene3Tip2.tsx
│   ├── Scene4Tip3.tsx
│   ├── Scene5Tip4.tsx
│   ├── Scene6Tip5.tsx
│   └── Scene7CTA.tsx
├── components/      # from templates
├── hooks/           # useGsapTimeline
├── transitions/     # slide, fade
└── styles/
    └── motion-tokens.ts  # Tech Dark palette, fast tokens
```

## Render Command

```bash
npx remotion render src/index.ts VideoComposition out/python-tips.mp4 \
  --width 1080 --height 1920 --codec h264
```
