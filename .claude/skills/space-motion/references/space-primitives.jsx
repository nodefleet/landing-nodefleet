// Space Motion primitives — reusable, GPU-only, slush.app-style animation building blocks.
// Copy this file into src/Components/motion/space-primitives.jsx and import from there.
// Rules baked in: only transform/opacity animate, reduced-motion respected, lazy bundle via LazyMotion.

import React, { useRef } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";

// Expo-out easing — the calm, weighty "slush" curve.
const EASE_SPACE = [0.16, 1, 0.3, 1];

/**
 * MotionProvider — single LazyMotion boundary. Wrap the app (or an animated page)
 * once. Keeps framer-motion's initial payload tiny (~4.6kb) and loads features lazily.
 * `strict` forbids accidental use of the heavy `motion.*` API, enforcing `m.*`.
 */
export function MotionProvider({ children }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}

/**
 * Reveal — entrance animation that runs once when scrolled into view.
 * Animates only y (translate) + opacity. Degrades to a plain fade when reduced-motion.
 */
export function Reveal({ children, delay = 0, y = 24, className, as = "div" }) {
  const reduce = useReducedMotion();
  const Tag = m[as] || m.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, ease: EASE_SPACE, delay }}
    >
      {children}
    </Tag>
  );
}

/**
 * Stagger + StaggerItem — orchestrate a group of children that cascade in.
 * Use <Stagger> on a container and <StaggerItem> on each child.
 */
export function Stagger({ children, className, gap = 0.1, as = "div" }) {
  const Tag = m[as] || m.div;
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap } },
      }}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({ children, className, y = 20, as = "div" }) {
  const reduce = useReducedMotion();
  const Tag = m[as] || m.div;
  return (
    <Tag
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : y },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_SPACE } },
      }}
    >
      {children}
    </Tag>
  );
}

/**
 * ParallaxLayer — moves at a fraction of scroll speed using a motion value (no React
 * re-render per frame). `depth` < 1 = far/slow (background), closer to 1 = near/fast.
 */
export function ParallaxLayer({ children, depth = 0.3, className }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const range = 120 * depth; // px of travel across the viewport pass
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);
  const smoothY = useSpring(y, { stiffness: 120, damping: 30, mass: 0.6 });
  return (
    <m.div ref={ref} className={className} style={reduce ? undefined : { y: smoothY }}>
      {children}
    </m.div>
  );
}

/**
 * FloatingOrb — a single soft, blurred glowing orb that drifts forever.
 * Decorative depth. One DOM node, transform-only keyframes, linear loop.
 * Drop a few behind content with absolute positioning + the brand purples.
 */
export function FloatingOrb({
  size = 320,
  color = "rgba(42, 39, 75, 0.45)",
  drift = 30,
  duration = 18,
  className,
  style,
}) {
  const reduce = useReducedMotion();
  return (
    <m.div
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "9999px",
        background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`,
        filter: "blur(40px)",
        pointerEvents: "none",
        ...style,
      }}
      animate={
        reduce
          ? undefined
          : { x: [0, drift, -drift, 0], y: [0, -drift, drift, 0] }
      }
      transition={{ duration, ease: "linear", repeat: Infinity }}
    />
  );
}

/**
 * AuroraBackground — slow cosmic gradient wash. Animates opacity/scale only.
 * Place as the first child of a `relative overflow-hidden` section.
 */
export function AuroraBackground({ className }) {
  const reduce = useReducedMotion();
  return (
    <m.div
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(60% 50% at 50% 0%, rgba(42,39,75,0.6), transparent 70%), radial-gradient(40% 40% at 80% 30%, rgba(34,32,55,0.5), transparent 70%)",
        pointerEvents: "none",
      }}
      animate={reduce ? undefined : { opacity: [0.7, 1, 0.7], scale: [1, 1.05, 1] }}
      transition={{ duration: 14, ease: "easeInOut", repeat: Infinity }}
    />
  );
}

/**
 * TiltCard — subtle 3D tilt toward the cursor with a soft spring back.
 * Rotates on rotateX/rotateY only (transform). Disabled under reduced-motion.
 */
export function TiltCard({ children, className, max = 8 }) {
  const reduce = useReducedMotion();
  const rx = useSpring(0, { stiffness: 200, damping: 25 });
  const ry = useSpring(0, { stiffness: 200, damping: 25 });

  function handleMove(e) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * max * 2);
    rx.set(-py * max * 2);
  }
  function reset() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <m.div
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 800 }}
      whileHover={reduce ? undefined : { scale: 1.02 }}
      transition={{ type: "spring", stiffness: 220, damping: 28 }}
    >
      {children}
    </m.div>
  );
}

/**
 * GlowPulse — gentle breathing glow for accents/CTAs. Animates opacity/scale only.
 */
export function GlowPulse({ children, className }) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={className}
      animate={reduce ? undefined : { opacity: [0.85, 1, 0.85], scale: [1, 1.015, 1] }}
      transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity }}
    >
      {children}
    </m.div>
  );
}
