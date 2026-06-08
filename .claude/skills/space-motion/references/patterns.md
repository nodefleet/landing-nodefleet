# Space Motion — copy-paste patterns

All snippets assume the page/app is wrapped in `<MotionProvider>` and import primitives
from `src/Components/motion/space-primitives.jsx`. Every snippet is GPU-only
(transform/opacity), reduced-motion aware, and viewport-lazy.

## 0. One-time setup

Wrap the app root once (e.g. in `src/App.jsx`):

```jsx
import { MotionProvider } from "./Components/motion/space-primitives";

export default function App() {
  return (
    <MotionProvider>
      {/* routes / layout */}
    </MotionProvider>
  );
}
```

## 1. Hero with cosmic background + reveal

```jsx
import {
  AuroraBackground,
  FloatingOrb,
  Reveal,
} from "../Components/motion/space-primitives";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-morado2 text-white">
      <AuroraBackground />
      <FloatingOrb size={420} style={{ top: -80, left: -60 }} duration={22} />
      <FloatingOrb size={300} color="rgba(34,32,55,0.5)" style={{ bottom: -40, right: 40 }} duration={16} />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-32 text-center">
        <Reveal as="h1" className="text-5xl font-semibold">
          Truly decentralized infrastructure
        </Reveal>
        <Reveal delay={0.12} className="mt-6 text-lg text-stone-300">
          High-performance nodes on bare metal, across regions.
        </Reveal>
      </div>
    </section>
  );
}
```

## 2. Staggered stats / feature grid

```jsx
import { Stagger, StaggerItem } from "../Components/motion/space-primitives";

function Stats({ items }) {
  return (
    <Stagger className="grid grid-cols-4 gap-2 max-sm:grid-cols-2">
      {items.map(({ name, text }) => (
        <StaggerItem key={text} className="text-center">
          <h4 className="text-4xl font-semibold">{name}</h4>
          <span className="text-sm text-stone-300">{text}</span>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
```

## 3. Tilt card with glow (services / pricing)

```jsx
import { TiltCard, GlowPulse } from "../Components/motion/space-primitives";

function ServiceCard({ title, children }) {
  return (
    <TiltCard className="rounded-2xl bg-morado/60 p-8 backdrop-blur">
      <GlowPulse className="inline-block">
        <span className="text-purple-300">●</span>
      </GlowPulse>
      <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-stone-300">{children}</p>
    </TiltCard>
  );
}
```

## 4. Scroll parallax depth layers

```jsx
import { ParallaxLayer } from "../Components/motion/space-primitives";

function ParallaxSection() {
  return (
    <section className="relative overflow-hidden">
      {/* far layer moves slowly */}
      <ParallaxLayer depth={0.2} className="absolute inset-0">
        <img src="/images/stars-far.svg" alt="" aria-hidden />
      </ParallaxLayer>
      {/* near layer moves more */}
      <ParallaxLayer depth={0.6} className="relative z-10">
        <ContentBlock />
      </ParallaxLayer>
    </section>
  );
}
```

## 5. Page transition wrapper (react-router)

Animate route changes with `AnimatePresence`. Only opacity/translate.

```jsx
import { AnimatePresence } from "framer-motion";
import { m } from "framer-motion"; // inside MotionProvider, m is available
import { useLocation, useOutlet } from "react-router-dom";

function AnimatedOutlet() {
  const location = useLocation();
  const outlet = useOutlet();
  return (
    <AnimatePresence mode="wait">
      <m.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {outlet}
      </m.div>
    </AnimatePresence>
  );
}
```

## Anti-patterns (do NOT ship)

```jsx
// ❌ animates layout props -> reflow every frame, kills 120fps
<motion.div animate={{ width: 300, marginTop: 40 }} />
// ✅ use transform instead
<m.div animate={{ scaleX: 1.5, y: 40 }} />

// ❌ per-frame setState scroll handler -> React re-render storm
window.addEventListener("scroll", () => setY(window.scrollY));
// ✅ motion values
const { scrollYProgress } = useScroll();
const y = useTransform(scrollYProgress, [0, 1], [0, -80]);

// ❌ permanent will-change on many nodes -> GPU memory exhaustion
.card { will-change: transform; } /* on 100 cards */
// ✅ let framer-motion add/remove will-change during animation only

// ❌ heavy motion bundle everywhere
import { motion } from "framer-motion"; <motion.div/>
// ✅ lazy features + small API
import { m } from "framer-motion"; // inside <LazyMotion features={domAnimation}>
```
