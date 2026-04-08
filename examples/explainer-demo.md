# Explainer Video Demo

## Prompt

> "Create a 60-second YouTube explainer video about how blockchain works"

## Requirements

| Parameter | Value |
|-----------|-------|
| Platform | YouTube (16:9, 1920x1080) |
| Duration | 60 seconds |
| FPS | 30 |
| Style | Flat Explainer + Infographic Motion |
| Language | English |

## Script

```
TITLE: How Blockchain Works — Explained in 60 Seconds
DURATION: 60s
PLATFORM: YouTube
TONE: Professional, friendly

SCENE 1: Hook
Duration: 4s
Narration: "Everyone talks about blockchain, but how does it actually work?"
Text: "How Does Blockchain Work?"
Visual: Kinetic typography on gradient background

SCENE 2: The Problem
Duration: 8s
Narration: "Traditional transactions require a trusted middleman — a bank.
           This creates delays, fees, and a single point of failure."
Visual: Animated diagram: Person → Bank → Person with X marks

SCENE 3: The Solution
Duration: 8s
Narration: "Blockchain removes the middleman. Instead, every participant
           holds a copy of the same record."
Visual: Network diagram with nodes appearing one by one

SCENE 4: How Blocks Work
Duration: 10s
Narration: "Each block contains: transaction data, a timestamp,
           and a unique hash — like a digital fingerprint."
Visual: Animated block structure building up

SCENE 5: The Chain
Duration: 10s
Narration: "Each block also stores the hash of the previous block,
           creating an unbreakable chain. Change one block and every
           block after it becomes invalid."
Visual: Chain of blocks with draw-line connections

SCENE 6: Mining
Duration: 8s
Narration: "Miners compete to validate new blocks by solving complex
           math puzzles. The winner adds the block and earns a reward."
Visual: Counter animation + progress bar for difficulty

SCENE 7: Key Stats
Duration: 6s
Narration: "Today, Bitcoin processes over 300,000 transactions daily
           with a network of over 15,000 nodes worldwide."
Visual: Counter animations for stats + map highlight

SCENE 8: CTA
Duration: 6s
Narration: "Now you understand the basics. Subscribe for more
           tech explainers!"
Visual: CTA with subscribe button
```

## Design System Match

```
STYLE: Flat Explainer + Infographic Motion
PALETTE: Education Blue
  Primary: #2563EB
  Secondary: #7C3AED
  Accent: #F59E0B
  Background: #FFFFFF
  Text: #1E1B4B
TYPOGRAPHY: Friendly Rounded (Nunito / Nunito Sans)
MOTION TOKENS:
  Duration: normal
  Easing: power2.out
  Stagger: 0.06s
  Rhythm: calm
TRANSITIONS: slide-left, fade
EFFECTS: draw-line, icon-pop, counter, chart-build, step-number
```

## Scene Decomposition

| Scene | Time | Frames | Type | Key Effect |
|-------|------|--------|------|-----------|
| 1. Hook | 0-4s | 0-120 | title | split-text |
| 2. Problem | 4-12s | 120-360 | content | draw-line diagram |
| 3. Solution | 12-20s | 360-600 | content | stagger node pop-in |
| 4. Blocks | 20-30s | 600-900 | data | block build animation |
| 5. Chain | 30-40s | 900-1200 | data | draw-line chain |
| 6. Mining | 40-48s | 1200-1440 | data | counter + progress |
| 7. Stats | 48-54s | 1440-1620 | data | counter + map |
| 8. CTA | 54-60s | 1620-1800 | cta | bounce-in button |

## Render Command

```bash
npx remotion render src/index.ts VideoComposition out/blockchain-explainer.mp4 \
  --width 1920 --height 1080 --codec h264
```
