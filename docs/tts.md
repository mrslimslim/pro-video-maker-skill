# TTS (Text-to-Speech) Integration

> **Status: TODO** — This module is planned but not yet fully implemented.
> The architecture and integration points are defined below.

## Overview

TTS converts the video script narration into audio files that sync with scenes.

## Planned Providers

### OpenAI TTS API

- High-quality neural voices
- Models: `tts-1` (fast) and `tts-1-hd` (high quality)
- Voices: alloy, echo, fable, onyx, nova, shimmer
- Output: MP3, OPUS, AAC, FLAC, WAV, PCM
- Cost: ~$0.015 per 1K characters (tts-1)

```bash
curl https://api.openai.com/v1/audio/speech \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "tts-1-hd",
    "input": "Scene 1 narration text here...",
    "voice": "nova",
    "response_format": "mp3",
    "speed": 1.0
  }' \
  --output scene1-narration.mp3
```

### Edge TTS (Free Alternative)

- Microsoft Edge's TTS engine, free to use
- Many voices and languages including Chinese
- Python package: `edge-tts`

```bash
pip install edge-tts

# List available voices
edge-tts --list-voices

# Generate speech
edge-tts --text "Your narration here" --voice "zh-CN-XiaoxiaoNeural" --write-media scene1.mp3 --write-subtitles scene1.vtt
```

Recommended voices:
| Language | Voice | Style |
|----------|-------|-------|
| Chinese (CN) | zh-CN-XiaoxiaoNeural | Natural, female |
| Chinese (CN) | zh-CN-YunxiNeural | Natural, male |
| English (US) | en-US-JennyNeural | Natural, female |
| English (US) | en-US-GuyNeural | Natural, male |

## Integration Architecture

```
Script Narration
      ↓
Per-scene text extraction
      ↓
TTS API call (per scene)
      ↓
Audio files → public/assets/audio/
      ↓
Duration measurement (ffprobe / Web Audio API)
      ↓
Scene duration adjustment (if audio longer than planned)
      ↓
Remotion <Audio> component insertion
```

## Remotion Audio Integration

```tsx
import { Audio, Sequence, staticFile } from "remotion";

// Per-scene audio
<Sequence from={sceneStartFrame} durationInFrames={sceneDuration}>
  <Audio src={staticFile("assets/audio/scene1.mp3")} volume={1.0} />
</Sequence>

// Background music (lower volume)
<Audio
  src={staticFile("assets/audio/bgm.mp3")}
  volume={0.15}
  loop
/>
```

## Timing Synchronization

The key challenge is syncing TTS audio duration with scene timing:

1. Generate TTS audio for each scene
2. Measure actual audio duration
3. If audio > planned scene duration: extend scene
4. If audio < planned scene duration: add padding or slow down
5. Update subtitle timing to match actual audio
6. Adjust total video duration

## TODO Items

- [ ] Create TTS generation script (`scripts/tts-generate.py`)
- [ ] Implement audio duration measurement
- [ ] Auto-adjust scene timing based on TTS output
- [ ] Support mixed language narration (CN + EN)
- [ ] Add voice selection per scene (different narrator voices)
- [ ] Background music mixing with ducking (lower BGM during narration)
