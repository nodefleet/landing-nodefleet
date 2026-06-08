---
name: nodefleet-design
description: The Nodefleet 2026 rebrand design system — reproduce the new "future cloud infrastructure" space-themed landing design (Urbanist font, primary green #99DFAF, green→blue gradients, glass cards, glowing CTAs) pixel-faithfully. Use whenever the user says "implementa/implement" a section, page, component, or asks to build/restyle/rebrand any part of the nodefleet landing site, or to apply the brand colors, typography, copy, or assets from the reference mockups.
when_to_use: When implementing or restyling any section/component of the nodefleet landing site to match the 2026 rebrand mockups — hero, products, services, team, CTA, footer, nav — or when applying brand colors/fonts/copy/assets.
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
---

# Nodefleet 2026 Rebrand — design system

You implement the Nodefleet landing site to match the **2026 rebrand mockups**. The reference design is fully specified in `references/design-system.md` (visual tokens + component recipes) and `references/content-and-assets.md` (the exact copy/text and the image asset inventory). When the user says **"implementa <section>"** (or build / restyle / rebrand), reproduce that section from the mockups **faithfully**: same layout, same colors, same copy, same assets.

## Brand in one screen

- **Theme**: dark cosmic / outer-space. Deep navy-black background (`#12111d`), starfields, a hero spaceship scene, soft aurora glows. Calm, premium, "the future".
- **Font**: **Urbanist** (already loaded globally via Google Fonts + Tailwind `font-sans`). Headings are bold/extrabold; key words are *italic* ("The *future* cloud", "*no one has filled*", "*not just the platform*").
- **Primary color**: green **`#99DFAF`** → Tailwind `text-primary` / `bg-primary` / `border-primary`.
- **Secondary accent**: blue **`#5AA9E6`** → Tailwind `accent`. Headlines often use a **green→blue gradient** (`.text-brand-gradient` or `bg-brand-gradient`).
- **Buttons**: solid green pill with soft glow (primary, `shadow-glow`) + outline pill (secondary).
- **Cards**: large rounded glass panels (`rounded-2xl`/`rounded-3xl`), faint white border, dark translucent fill, subtle backdrop blur.

## How to implement when asked

1. **Read the references first** — open `references/design-system.md` and `references/content-and-assets.md` before writing any JSX. Don't reconstruct the design from memory.
2. **Use the global theme, never hardcode.** Colors come from Tailwind tokens (`primary`, `accent`, `space`, `shadow-glow`, `bg-brand-gradient`); the font is already global (`Urbanist`). If you find a hardcoded hex that has a token, use the token.
3. **Use the real copy and assets.** Pull the exact section text from `references/content-and-assets.md` (don't paraphrase) and wire the images from `public/assets/...` (icons, sections, team) per the inventory there.
4. **Match structure to the mockup**: nav → hero (spaceship + stats) → products (tabbed cards) → services (4 cards on aurora) → team (6 cards) → CTA → footer. Build the requested piece to slot into that order.
5. **Stay responsive & accessible**: mobile-first Tailwind, `max-sm:` overrides like the existing code, `alt` text on every image, sufficient contrast.
6. **Animations**: this project also has the `space-motion` skill for framer-motion. For entrance/scroll/hover motion, follow its 120fps GPU-only budget (transform/opacity, `whileInView` once, `useReducedMotion`). Keep the brand feel: calm and spatial.
7. **Verify**: after a substantial change run `npm run build` to confirm it compiles. Report what you built, which assets/copy you used, and confirm it matches the mockup.

## Hard rules

- **Never** invent brand colors or fonts outside the tokens in `references/design-system.md`.
- **Never** paraphrase mockup copy when the exact text is available in `references/content-and-assets.md` — copy it verbatim.
- Keep code style consistent with the repo: React 18 functional components, default exports, JSX (no TypeScript), Tailwind classes. Comments in English.
- Respond to the user in Spanish.
