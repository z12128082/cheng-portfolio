# Home Page Design Override

Use this page override together with `design-system/cheng-portfolio/MASTER.md`.

## Direction

- Keep the homepage as a cinematic spatial product stage, not a generic portfolio grid.
- Prioritize interactive product demo pacing: text enters first, then the project surface takes over the stage.
- Use dark cinematic layering, minimal chrome, and clear operator/product language.
- Avoid decorative UI that does not explain capability, status, workflow, or decision value.

## Applied Rules

- Motion must be user-controllable. Provide a visible Motion / Reduced motion toggle and respect system reduced-motion preference.
- Product showcases should expose compact metadata: input, state/signal, and output/surface.
- Scroll storytelling should keep a text-first reading phase before project demo chrome appears.
- Product demo cards should stay right-biased on desktop and keep the step rail readable; never compress or crop step content during scroll.
- A fixed left-side readability veil is allowed when 3D background geometry crosses text.
- Z-index layers should remain tokenized: stage, content, product, chrome, nav.
- Scroll-driven sections should have a mobile fallback where product showcase overlays are hidden and text remains readable.
- Interactive controls need visible focus states and non-layout-shifting hover states.

## Homepage Tokens

- Background: deep black/blue cinematic surface.
- Accent: cyan for spatial/digital-twin state, green for system health, warm amber for workflow utility.
- Radius: 8px for technical windows and metadata chips, 16px for elevated panels.
- Motion easing: `cubic-bezier(0.16, 1, 0.3, 1)` for UI transitions.

## QA Checklist

- Check 1280px desktop for centered showcase takeover.
- Check 820px and below for no horizontal scroll.
- Toggle reduced motion and verify chapter blur/translation and continuous WebGL drift stop.
- Keyboard-tab header controls and verify visible focus rings.
