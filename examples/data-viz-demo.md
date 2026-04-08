# Data Visualization Video Demo

## Prompt

> "Create a 45-second Instagram video showing Q3 2025 SaaS metrics dashboard"

## Requirements

| Parameter | Value |
|-----------|-------|
| Platform | Instagram Feed (1:1, 1080x1080) |
| Duration | 45 seconds |
| FPS | 30 |
| Style | Data Story + Bento Grid Motion |
| Language | English |

## Script

```
TITLE: Q3 2025 SaaS Dashboard
DURATION: 45s
PLATFORM: Instagram
TONE: Professional

SCENE 1: Title
Duration: 4s
Text: "Q3 2025 Performance"
Subtitle: "Key Metrics Dashboard"
Visual: Title with gradient mesh background

SCENE 2: Revenue KPIs
Duration: 8s
Text: "Revenue Growth"
Data: ARR $12.5M (+34%), MRR $1.04M, NRR 112%
Visual: Stat grid with counter animations

SCENE 3: User Growth Chart
Duration: 8s
Text: "User Acquisition"
Data: Bar chart — Jan: 8K, Feb: 12K, Mar: 15K, Apr: 18K, May: 22K, Jun: 28K
Visual: D3 bar chart build animation

SCENE 4: Conversion Funnel
Duration: 8s
Text: "Conversion Funnel"
Data: Visitors 100K → Signups 15K → Trial 8K → Paid 2.4K
Visual: Horizontal funnel with progress bars

SCENE 5: Global Reach
Duration: 7s
Text: "Global Expansion"
Data: 42 countries, top: US 35%, EU 28%, APAC 22%
Visual: Map highlight with progress rings

SCENE 6: Key Takeaways
Duration: 5s
Bullets: ["ARR growing 34% YoY", "NRR above 110%", "APAC fastest growing"]
Visual: Stagger reveal list

SCENE 7: CTA
Duration: 5s
Text: "Full report at saas.io/q3"
Visual: CTA with link and QR code area
```

## Design System Match

```
STYLE: Data Story + Bento Grid Motion
PALETTE: Tech Light
  Primary: #2563EB
  Secondary: #3B82F6
  Accent: #06B6D4
  Background: #FFFFFF
  Surface: #F1F5F9
  Text: #0F172A
TYPOGRAPHY: Modern Sans (Inter)
MOTION TOKENS:
  Duration: normal
  Easing: power2.out
  Stagger: 0.08s
  Rhythm: calm
TRANSITIONS: fade, slide-up
EFFECTS: counter, chart-build, progress-bar, map-highlight, stagger-reveal
```

## Key D3 Visualizations

### Bar Chart (Scene 3)

```tsx
// Using BarChart component with D3 scales
<BarChart
  data={[
    { label: "Jan", value: 8000, color: "#93C5FD" },
    { label: "Feb", value: 12000, color: "#60A5FA" },
    { label: "Mar", value: 15000, color: "#3B82F6" },
    { label: "Apr", value: 18000, color: "#2563EB" },
    { label: "May", value: 22000, color: "#1D4ED8" },
    { label: "Jun", value: 28000, color: "#1E40AF" },
  ]}
  startFrame={15}
  buildDuration={45}
/>
```

### Progress Ring (Scene 5)

```tsx
// Three progress rings for regional distribution
<div style={{ display: "flex", gap: 40 }}>
  <ProgressRing percentage={35} label="US" color="#2563EB" />
  <ProgressRing percentage={28} label="EU" color="#06B6D4" />
  <ProgressRing percentage={22} label="APAC" color="#10B981" />
</div>
```

## Scene Decomposition

| Scene | Time | Frames | Type | Key Component |
|-------|------|--------|------|--------------|
| 1. Title | 0-4s | 0-120 | title | TitleScene |
| 2. KPIs | 4-12s | 120-360 | data (stat-grid) | Counter x3 |
| 3. Chart | 12-20s | 360-600 | data (bar-chart) | BarChart (D3) |
| 4. Funnel | 20-28s | 600-840 | data (progress-bar) | ProgressBar x4 |
| 5. Map | 28-35s | 840-1050 | data (progress-ring) | ProgressRing x3 |
| 6. Takeaways | 35-40s | 1050-1200 | content | Stagger list |
| 7. CTA | 40-45s | 1200-1350 | cta | CtaScene |

## Render Command

```bash
npx remotion render src/index.ts VideoComposition out/q3-dashboard.mp4 \
  --width 1080 --height 1080 --codec h264
```
