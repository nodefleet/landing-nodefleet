---
name: space-motion
description: Integrate smooth, spatial ("space"-themed) framer-motion animations into this React + Vite + Tailwind project, in the style of slush.app — parallax depth, floating orbs, aurora/nebula gradients, 3D tilt, scroll-linked reveals and staggered entrances. Use when the user asks to add, design, polish, or fix motion/animations, transitions, hover/scroll effects, or wants the UI to feel more alive without hurting performance. Enforces a strict 120fps / GPU-only performance budget.
model: sonnet
when_to_use: When adding or refining animations, motion, transitions, parallax, scroll effects, hover effects, reveals, or any "make it feel premium/alive" UI request in this codebase.
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
---

# Space Motion — slush.app-style animations for nodefleet

You add **smooth, spatial, premium** animations to this codebase using **framer-motion v12** (already installed). Aesthetic reference: https://slush.app — calm, deep, "floating in space" motion. This project is a dark, web3 / node-infrastructure landing site whose brand palette is purple (`morado: rgba(42,39,75,1)`, `morado2: #222037`) on slate/black. Lean into a **cosmic/nebula** feel: depth, parallax, soft glows, drifting orbs, aurora gradients.

## The two non-negotiable goals

1. **It must feel like slush.app**: soft, weighty, spatial. Nothing snappy or bouncy-cheap. Long eases, spring physics, depth and parallax.
2. **120fps, zero jank, no bundle bloat.** Animation must never degrade page speed, TTI, or scroll smoothness. The performance budget below is a hard contract — if a request would violate it, push back and propose the GPU-friendly equivalent.

---

## PERFORMANCE BUDGET (hard rules — never break these)

These are the difference between 120fps and jank. Follow them exactly.

1. **Animate ONLY compositor properties.** `transform` (translate/scale/rotate) and `opacity`. Also OK: `filter` sparingly. These run on the GPU compositor and never trigger layout/paint.
2. **NEVER animate layout properties.** Forbidden in animations: `width`, `height`, `top`, `left`, `right`, `bottom`, `margin`, `padding`, `border-width`. They force reflow on every frame and kill 120fps. Use `scale`/`translate` instead.
   - Need a size change? Animate `scaleX/scaleY` and counter-scale children, or use `transform: scale()`.
   - Need to move? Use `x`/`y` (translate), never `left`/`top`.
3. **Use `LazyMotion` + `m` instead of `motion`** to keep the bundle small. Import the `domAnimation` feature set lazily. Replace `<motion.div>` with `<m.div>` inside a `<LazyMotion features={domAnimation} strict>` boundary. This drops framer-motion's initial payload from ~34kb to ~4.6kb + ~21kb loaded lazily.
4. **Respect `prefers-reduced-motion`.** Always read `useReducedMotion()` and degrade to a simple opacity fade (or no motion) for users who opt out. This is both an a11y and a performance requirement.
5. **Trigger off-screen work lazily.** For entrance animations use `whileInView` with `viewport={{ once: true, margin: "-10% 0px" }}` so animations run once when visible — never animate things the user can't see.
6. **Springs over long durations for interactive motion.** Use `type: "spring"` with low `stiffness` (120–260) and higher `damping` (20–40) for that heavy, calm slush feel. Use tween eases only for scripted reveals.
7. **`will-change` is a scalpel, not a default.** framer-motion adds it during animation automatically. Do NOT set `will-change` permanently in CSS on many elements — it exhausts GPU memory and *causes* jank. Let framer-motion manage it.
8. **Keep animated subtrees cheap.** Animation re-renders should not cascade. Use `useTransform`/`useSpring` (motion values) for scroll/parallax so values update outside React's render loop. Never drive per-frame animation through `useState`.
9. **Parallax/scroll via `useScroll` + `useTransform` only.** Never attach a manual `scroll` listener that calls `setState`. Motion values bypass React re-renders → smooth 120fps.
10. **Cap the cost of decorative loops.** Prefer 3–6 large glow orbs over hundreds of particles. If many particles are needed, render them on one `<canvas>`, not the DOM.
11. **NEVER animate a blurred / shadowed / backdrop-filtered element.** Moving an element that has `filter: blur(...)`, a large `drop-shadow`/`box-shadow`, or `backdrop-blur` forces the GPU to re-rasterize the expensive effect EVERY frame — this is the #1 cause of "the animation eats performance". Glow orbs must be **static** radial-gradient layers (no `filter`, no loop); the gradient alone gives the soft look. Decorative aurora/glow = paint once, never animate.
12. **Avoid always-on infinite loops.** `repeat: Infinity` animations run every frame even while the user sits idle, draining battery/CPU. Default to **one-shot** entrance motion (`whileInView` once), **hover/scroll-triggered** motion (idle = zero cost), and **static** decoration. Only use an infinite loop for a single tiny compositor-only accent, never for large/blurred/shadowed nodes. When unsure, make it static.
13. **`backdrop-blur` is expensive — use sparingly.** Every `backdrop-filter` element recomposes whenever anything behind it changes. Don't put it on many cards, and never over an animated background. Prefer a semi-opaque solid fill (`bg-white/[0.04]`) for the "glass" look.

> Quick self-check before finishing any animation: *"Does every animated value resolve to `transform` or `opacity`? Does it respect reduced-motion? Does it animate only when on-screen?"* If any answer is no, fix it.

---

## Workflow when invoked

1. **Read before writing.** Inspect the target component(s) and how framer-motion is already used here (see existing usage in `src/Pages/*.jsx`). Match the project's JSX + Tailwind style — no TypeScript, functional components, default exports.
2. **Set up the motion layer once.** If not present, create the shared primitives from `references/space-primitives.jsx` into `src/Components/motion/` and wrap the app (or the animated page) in `<MotionProvider>` (a `LazyMotion` boundary). Reuse these primitives instead of sprinkling raw `motion.*` everywhere.
3. **Compose with primitives.** Build the requested effect from: `Reveal`, `Stagger` / `StaggerItem`, `ParallaxLayer`, `FloatingOrb`, `AuroraBackground`, `TiltCard`, `GlowPulse`. See `references/patterns.md` for ready snippets.
4. **Honor the palette.** Glows/auroras use the brand purples and slate; keep opacity low (`0.15`–`0.4`) and blur high for the soft cosmic look. Never neon-bright.
5. **Verify the budget.** Re-read your diff against the PERFORMANCE BUDGET. Confirm only `transform`/`opacity`/`filter` animate, reduced-motion is handled, and entrances are `whileInView once`.
6. **Build-check if you touched shared infra.** Run `npm run build` (Vite) when you add the provider or change many files, to confirm nothing breaks. For small additive edits a build is optional.
7. **Report** what you added, which files changed, and confirm the budget checklist — in Spanish, code/comments in English.

## Tuning the "slush" feel

- Entrances: `y: 24 → 0`, `opacity: 0 → 1`, `duration: 0.7–0.9`, `ease: [0.16, 1, 0.3, 1]` (expo-out). Stagger children by `0.08–0.12`.
- Hover (cards): spring `scale: 1.02`, subtle `rotateX/rotateY` ≤ 8° toward cursor, soft glow ramp. Always spring back.
- Ambient: orbs drift `±20–40px` over `12–24s` linear infinite; aurora hue/position shifts slowly. Keep it barely perceptible — depth, not distraction.
- Scroll parallax: background layers move slower than foreground (`useTransform(scrollYProgress, [0,1], [0, -80])` for far layers, smaller offsets for near).

See `references/patterns.md` for copy-paste recipes and `references/space-primitives.jsx` for the reusable component source.
