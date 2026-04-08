# Asset Library

Guide for sourcing and managing visual assets in video projects.

## Public Asset Sources

### Images + Video

| Source | API | Free Tier | License |
|--------|-----|-----------|---------|
| [Pexels](https://pexels.com) | REST (`api.pexels.com`) | Unlimited (with rate limits) | Free, attribution appreciated |
| [Pixabay](https://pixabay.com) | REST (`pixabay.com/api/`) | 100 req/min | Pixabay License (free commercial) |
| [Unsplash](https://unsplash.com) | REST (`api.unsplash.com`) | 50 req/hour | Unsplash License (free) |
| [Coverr](https://coverr.co) | REST (`api.coverr.co`) | 50 req/hour | Free commercial use |

### Music + Sound Effects

| Source | Type | License |
|--------|------|---------|
| [Mixkit](https://mixkit.co) | Music, SFX, templates | Free commercial |
| [Pixabay Music](https://pixabay.com/music/) | Background music | Pixabay License |
| [Freesound](https://freesound.org) | SFX | CC (varies per file) |

### Vector Animations

| Source | Type | Format |
|--------|------|--------|
| [LottieFiles](https://lottiefiles.com) | Animated vectors | JSON (Lottie) |
| [Lucide](https://lucide.dev) | Icons | SVG / React components |
| [Heroicons](https://heroicons.com) | Icons | SVG / React components |

### Fonts

| Source | Usage |
|--------|-------|
| [Google Fonts](https://fonts.google.com) | Web fonts via CSS import |
| System fonts | Helvetica Neue, SF Pro, PingFang SC |

## API Key Setup

API keys should be stored as environment variables:

```bash
PEXELS_API_KEY=your_key_here
PIXABAY_API_KEY=your_key_here
UNSPLASH_ACCESS_KEY=E_G37a1PB2NcdkceEr86lLqBbxQQ1RBUaX8WBnlBWeY
```

Get free API keys:
- Pexels: https://www.pexels.com/api/new/
- Pixabay: https://pixabay.com/api/docs/
- Unsplash: https://unsplash.com/developers

## Asset Fetching Script

Use `scripts/asset-fetch.py` to search and download assets:

```bash
# Search images
python scripts/asset-fetch.py search --query "technology office" --source pexels --type photo --count 5

# Search videos
python scripts/asset-fetch.py search --query "nature landscape" --source pexels --type video --count 3

# Download to project
python scripts/asset-fetch.py download --url "https://..." --output public/assets/bg-tech.jpg

# Batch download from search
python scripts/asset-fetch.py batch --query "abstract gradient" --source pixabay --type photo --count 10 --output public/assets/backgrounds/
```

## Asset Organization

Assets in the Remotion project go under `public/assets/`:

```
public/
└── assets/
    ├── images/        # Static images
    ├── videos/        # Background videos
    ├── audio/         # Music, SFX, TTS
    ├── lottie/        # Lottie JSON animations
    ├── icons/         # SVG icons
    └── manifest.json  # Asset registry
```

### manifest.json format

```json
{
  "assets": [
    {
      "id": "bg-gradient-1",
      "type": "image",
      "path": "assets/images/bg-gradient-1.jpg",
      "source": "pexels",
      "sourceUrl": "https://pexels.com/photo/12345",
      "attribution": "Photo by Author on Pexels",
      "width": 1920,
      "height": 1080
    }
  ]
}
```

## Usage in Remotion

```tsx
import { Img, Video, Audio, staticFile } from "remotion";

// Static image
<Img src={staticFile("assets/images/bg-tech.jpg")} />

// Background video
<Video src={staticFile("assets/videos/abstract.mp4")} />

// Audio
<Audio src={staticFile("assets/audio/bgm.mp3")} volume={0.3} />
```

## Asset Selection Guidelines

| Content Type | Recommended Assets |
|-------------|-------------------|
| Tech / SaaS | Abstract gradients, dark UI mockups, code screenshots |
| Food / Restaurant | High-quality food photography, warm lighting |
| Nature / Travel | Landscape photography, aerial footage |
| Education | Clean illustrations, icons, diagrams |
| Social / Lifestyle | Authentic people photos, vibrant colors |
| Data / Analytics | Minimal backgrounds, chart assets |

Rules:
- Always prefer assets that match the video's color palette
- Use high-resolution assets (>= target video resolution)
- Avoid watermarked content
- Credit sources in video description when required
- Prefer video-format assets for backgrounds (add motion)
