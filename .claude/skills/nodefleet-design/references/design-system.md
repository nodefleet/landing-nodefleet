# Nodefleet 2026 — visual design tokens & components

Extracted from the rebrand mockups. All tokens are wired into `tailwind.config.js`,
`src/index.css` and `public/index.html`. Prefer the Tailwind token over a raw hex.

## Color tokens

| Role | Hex | Tailwind |
|------|-----|----------|
| Primary green (brand) | `#99DFAF` | `primary` / `text-primary` / `bg-primary` / `primary-300` |
| Primary green hover | `#6FCB8E` | `primary-400` |
| Secondary blue accent | `#5AA9E6` | `accent` |
| Blue accent deep | `#3E8FD4` | `accent-500` |
| Body background | `#12111d` | `space` / `bg-space` |
| Deepest section bg | `#0A0A14` | `space-deep` |
| Card surface base | `#1A1922` | `space-card` |
| Primary text | `#FFFFFF` | `text-white` |
| Muted text | `~#9CA3AF` | `text-gray-400` / `text-stone-300/400` |
| Card border | `rgba(255,255,255,0.08)` | `border-white/10` |
| Card fill (glass) | `rgba(255,255,255,0.03)` | `bg-white/[0.03]` |

**Brand gradient** (green→blue), used on hero/section accent words and the "Meet"/"build?" headings:
`linear-gradient(90deg, #99DFAF 0%, #5AA9E6 100%)` → CSS helper `.text-brand-gradient`, Tailwind `bg-brand-gradient`, or `boxShadow`/`bg` via `bg-brand-gradient`.

## Typography — Urbanist (global)

- Family: **Urbanist** (`font-sans` is already Urbanist; `font-urbanist` also available). Loaded with weights 300–800 + italics.
- **H1 hero**: ~`text-6xl/7xl`, `font-bold`, tight leading. One word italic, one word in `.text-brand-gradient` (e.g. "The *future* cloud **infrastructure**").
- **Section H2**: `text-4xl/5xl`, `font-bold`. Often a gradient/italic accent ("*Fleet-Powered* Services", "*Meet* the Team", "Ready to *build?*").
- **Section subtitle**: `text-lg/xl`, `text-gray-400`, with an *italic* clause ("*no one has filled*", "*not just the platform*").
- **Body**: `text-base`, `text-gray-300/400`, `font-normal`.
- **Eyebrow/badge text**: `text-xs/sm`, often inside a pill.
- Italics carry meaning in this brand — replicate them where the mockup shows them.

## Components

### Primary button (green pill, glowing)
```jsx
<button className="rounded-full bg-primary px-7 py-3 font-semibold text-space-deep shadow-glow transition-colors hover:bg-primary-400">
  Join the Future
</button>
```

### Secondary button (outline pill)
```jsx
<button className="rounded-full border border-white/20 px-7 py-3 font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5">
  Explore Products
</button>
```

### Glass card
```jsx
<div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm">
  {/* content */}
</div>
```

### Pill badge / eyebrow
```jsx
<span className="inline-block rounded-full border border-primary/40 px-4 py-1 text-sm text-primary">
  Deploy your chain like a fleet
</span>
```

### Tab switcher (Blockchain / Storage / AI)
```jsx
<div className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
  <button className="rounded-full bg-primary px-6 py-2 font-medium text-space-deep">Blockchain</button>
  <button className="rounded-full px-6 py-2 font-medium text-gray-300 hover:text-white">Storage</button>
  <button className="rounded-full px-6 py-2 font-medium text-gray-300 hover:text-white">Artificial Intelligence</button>
</div>
```

### Checklist item (feature lists in product cards)
```jsx
<li className="flex items-center gap-3 text-gray-200">
  <span className="grid h-6 w-6 place-items-center rounded-full border border-primary/40 text-primary">✓</span>
  Faucet
</li>
```

### Gradient heading
```jsx
<h2 className="text-4xl font-bold text-white">
  <span className="italic text-brand-gradient">Fleet-Powered</span> Services
</h2>
```

### Stat block (hero metrics)
```jsx
<div className="rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-5 text-center">
  <div className="text-3xl font-bold text-white">0.99%</div>
  <div className="mt-1 text-sm text-gray-400">Uptime SLA</div>
</div>
```

## Layout & spacing

- Page order: **Nav → Hero → Products → Services → Team → CTA → Footer**.
- Sections: full-width, `relative overflow-hidden`, dark bg, generous vertical padding (`py-24`/`py-32`), centered content with `max-w-6xl/7xl mx-auto px-6`.
- Cards: large radii (`rounded-2xl`–`rounded-3xl`), `gap-6/8` grids, `backdrop-blur`.
- Starfield / aurora live as absolutely-positioned background layers behind `z-10` content.
- Mobile-first; collapse multi-column grids to 1–2 cols with `max-sm:` like existing components.
