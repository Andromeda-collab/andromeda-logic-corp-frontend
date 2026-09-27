# Hero Redesign Plan

## Components to add/modify:
1. `SatelliteCanvas` - new component in Home/index.jsx
2. Hero JSX in `Home()` - add SatelliteCanvas, revamp animations
3. `Home.css` - entrance animations + satellite styling

## Satellite logic (canvas 2D):
- Draw geometric satellite: body rect + solar panel wings + antenna + dish
- Colors: cyan strokes + magenta accent
- Phase 1 (0-3s): large scale (3x), positioned bottom-left, CSS blur(8px), high opacity
- Phase 2 (3-6s): lerp scale 3x → 0.55x, move toward orbital ring center, blur 8px → 0px
- Phase 3 (6s+): hover gently on orbital ring, slow oscillation

## CSS entrance animations:
- .alc-hero-enter: all text starts opacity:0, translateY(30px)
- Each child staggers with animation-delay
- Eyebrow: 0.2s, H1 lines: 0.5s/0.65s/0.8s, copy: 1.0s, buttons: 1.2s, meta: 1.4s
