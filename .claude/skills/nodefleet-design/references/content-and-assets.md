# Nodefleet 2026 — exact copy & asset inventory

Use this text **verbatim** when implementing a section. Italic = `<span className="italic">` (often
also `.text-brand-gradient`). Image paths are under `public/` → reference as `/assets/...`.

---

## NAV
- Links: **Products** ▾ · **Services** · **Team**
- CTA pill (right): **Join the Future**
- Logo: `/assets/icons/Logo_Nodefleet.svg`

## HERO  — bg `/assets/setions/hero_setion.png` (full space scene with spaceship)
- H1: **The _future_ cloud _infrastructure_**  ("future" italic; "infrastructure" in green→blue gradient)
- Subtitle: **Unified infrastructure for Blockchains, Storage and AI. Build, scale and innovate without limits.**
- Buttons: **Join the Future** (primary green) · **Explore Products** (outline)
- Eyebrow: **Trusted by builders and companies worldwide**
- Trusted-by logos (two rows): `/assets/setions/hero_setion_logos_1.png` and `/assets/setions/hero_setion_logos_2.png` (DRPC, dYdX, ELLIPTIC, POKT, passage / Lava, 1k(x), Allium, CANOPY, NODE RIVER)
- Stats (4): **0.99%** Uptime SLA · **0+** Chains supported · **0M+** Requests / sec · **0+** Edge regions

## PRODUCTS
- Heading: **Products**
- Subtitle: **The Infrastructure gap _no one has filled_.**
- Tabs: **Blockchain** (active) · **Storage** · **Artificial Intelligence**

### Card — nodegate  (logo `/assets/icons/nodegate.svg`)
- Badge: **Deploy your chain like a fleet**
- Body: **Launching a protocol takes months. No complete launch platform exists today.**
  **Everything your chain needs, wired together. Five first-class services, one admin interface, one billing line. Turn any on or off from the panel — Nodegate handles the glue.**
- Checklist: **Faucet · Explorer · Snapshot service · RPC admin · Seed registry**
- Link: **Get Started →**

### Card — fleetwallet  (logo `/assets/icons/fleetwallet.svg`)
- Badge: **Deploy your chain like a fleet**
- Body: **Self-custody multi-chain wallet for builders and operators. EVM, Cosmos, Bitcoin and more — keys in your hands, signing audited by `trust-wallet-core`, UX built for people who deploy chains for a living.**
- Checklist: **Native EVM · Native Cosmos & IBC · Trust Wallet Core · Developermode · One seed, every chain**
- Link: **Get Started →**

### Card — DataNodes  (logo `/assets/icons/datanodes.svg`)
- Badge: **RPC Blockchain Data Nodes**
- Body: **Everything you need to deploy your app Reliable infrastructure, real-time performance insights, and multi-chain support — all in one powerful subscription.**
- Checklist: **Dedicated RPC Nodes · Real-Time Monitoring · Multi-Chain Support · Scalable Infrastructure**
- Chain icons row + **20+**: `/assets/setions/products_setion_datanodes_chains.png`

> Other available product/section icons in `/assets/icons/`: `nimbus_ecosystem.svg`,
> `pajamas_infrastructure-registry.svg`, `streamline-plump_industry-innovation-and-infrastructure.svg`.

## SERVICES  (4 cards on an aurora background)
- Heading: **_Fleet-Powered_ Services**  (gradient/italic)
- Subtitle: **When you need the team, _not just the platform_.**
- **Development Workshop** — Custom builds alongside your team — delivered on Nodefleet infrastructure.
- **White Glove Infrastructure** — Dedicated Nodefleet engineers, custom SLAs, proactive monitoring.
- **Infra / Blockchain Consulting** — Protocol launch strategy, architecture reviews, cost optimization.
- **Staking as a Service** — Validator operations + delegation strategy. Connects to NodeGate + poktpool.

## TEAM  (6 cards) — photos in `/assets/team/`
- Heading: **_Meet_ the Team**  (gradient)
- Subtitle: **The builders behind Nodefleet — protocol engineers, infrastructure architects, _and chain operators_.**

| Name | Role | Bio | Photo |
|------|------|-----|-------|
| Kael Abbott | Co-Founder & CEO | Has a wide experience working on python/django. | `/assets/team/kael.png` |
| Jonathan Maria | CTO | Ex-Ethereum Foundation. Specialist in cross-chain bridge architecture and EVM internals. | `/assets/team/jhonathan.jpg` |
| Carlos Peña | COO | Led DevOps at two blockchain unicorns. Obsessed with 99.99% uptime. | `/assets/team/carlos.jpg` |
| Juan Carlos Abreu | Lead Engineer | Built core consensus modules for Solana validators. Deep Rust + Go expertise. | `/assets/team/juancarlos.jpeg` |
| Katherine Andujar | Product Manager | Web3 UI/UX professional designer experienced in fintech startup products. | `/assets/team/katerine.png` |
| Lowell Abbott | Founder & Advisor | Former Devops Lead of Pocket Network and CEO of nodefleet.org. | `/assets/team/lowell.png` |

## CTA
- Heading: **Ready to _build?_**  ("build?" in blue/gradient)
- Subtitle: **Launch, scale, and operate with confidence using high-performance blockchain infrastructure.**
- Buttons: **Start Building** (primary green) · **Contact Us** (outline)

## FOOTER
- Logo `/assets/icons/Logo_Nodefleet.svg` + tagline: **The future cloud infrastructure**
- **Products**: Blockchain · Storage · AI
- **Services**: Staking · Consulting
- **Company**: Portfolio · Support

---

## Asset inventory (`public/assets/`)

```
icons/
  Logo_Nodefleet.svg                  # main logo (nav + footer)
  nodegate.svg                        # product logo
  fleetwallet.svg                     # product logo
  datanodes.svg                       # product logo
  nimbus_ecosystem.svg                # service/feature icon
  pajamas_infrastructure-registry.svg # service/feature icon
  streamline-plump_industry-innovation-and-infrastructure.svg # service/feature icon
setions/                              # (note: folder is spelled "setions")
  hero_setion.png                     # hero background space scene (large, 3.4MB)
  hero_setion_logos_1.png             # trusted-by logos row 1
  hero_setion_logos_2.png             # trusted-by logos row 2
  products_setion_datanodes_chains.png# DataNodes supported-chains icon strip
team/
  kael.png  jhonathan.jpg  carlos.jpg  juancarlos.jpeg  katerine.png  lowell.png
```

> The `setions` and `Developermode` spellings come from the source assets/mockups — keep
> asset paths exactly as on disk, but use correct English in user-facing copy.
