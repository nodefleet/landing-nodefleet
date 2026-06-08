// Space Motion primitives — reusable, GPU-only, slush.app-style animation building blocks.
// Rules baked in: only transform/opacity animate, reduced-motion respected, lazy bundle via LazyMotion.

import React, { useRef, useEffect } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  animate,
} from "framer-motion";
import { supportedChains } from "../supportChain";

// Expo-out easing — the calm, weighty "slush" curve.
const EASE_SPACE = [0.16, 1, 0.3, 1];

/**
 * MotionProvider — single LazyMotion boundary. Wrap the app (or an animated page)
 * once. Keeps framer-motion's initial payload tiny (~4.6kb) and loads features lazily.
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

/** Stagger + StaggerItem — orchestrate a group of children that cascade in. */
export function Stagger({ children, className, gap = 0.1, as = "div" }) {
  const Tag = m[as] || m.div;
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
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
 * FloatingOrb — a soft glowing orb for cosmic depth.
 * STATIC by design: a radial-gradient layer painted once (no `filter: blur`, no
 * infinite loop). Animating a blurred element re-rasterizes every frame and wrecks
 * performance, so this stays still — the gradient alone gives the soft glow.
 */
export function FloatingOrb({ size = 320, color = "rgba(153, 223, 175, 0.25)", className, style }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "9999px",
        background: `radial-gradient(circle at 50% 50%, ${color}, transparent 70%)`,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}

/** TiltCard — subtle 3D tilt toward the cursor with a soft spring back. */
export function TiltCard({ children, className, max = 6 }) {
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
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      whileHover={reduce ? undefined : { scale: 1.015 }}
      transition={{ type: "spring", stiffness: 220, damping: 28 }}
    >
      {children}
    </m.div>
  );
}

/**
 * Float — kept for API compatibility, but renders statically.
 * Continuous (infinite) motion runs every frame even while idle and is what
 * "eats performance", so this no longer animates. Use entrance/hover motion instead.
 */
export function Float({ children, className }) {
  return <div className={className}>{children}</div>;
}

/**
 * Planet — a big "Nodefleet planet" rendered in pure CSS (brand green→blue body,
 * green atmosphere glow, a tilted ring). Fully STATIC (no animation, no animated
 * shadow) → painted once, zero per-frame cost. Place it off a corner so it looms large.
 */
export function Planet({ size = 460, className, style }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute ${className || ""}`}
      style={{ width: size, height: size, ...style }}
    >
      {/* tilted ring (behind) */}
      <div
        className="absolute left-1/2 top-1/2 rounded-[50%]"
        style={{
          width: size * 1.55,
          height: size * 0.4,
          transform: "translate(-50%, -50%) rotate(-22deg)",
          border: `${Math.round(size * 0.014)}px solid rgba(153, 223, 175, 0.30)`,
          boxShadow: "0 0 24px rgba(90, 169, 230, 0.25)",
        }}
      />
      {/* atmosphere glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow:
            "0 0 90px 10px rgba(153, 223, 175, 0.22), inset 0 0 70px rgba(90, 169, 230, 0.25)",
        }}
      />
      {/* planet body (lit from upper-left → dark terminator) */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 34% 30%, #cdeedb 0%, #99dfaf 22%, #5aa9e6 50%, #2a3f6b 74%, #0d1326 100%)",
        }}
      />
      {/* subtle surface mottling */}
      <div
        className="absolute inset-0 rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(38% 16% at 60% 38%, rgba(13,19,38,0.45), transparent 60%)," +
            "radial-gradient(28% 13% at 36% 60%, rgba(13,19,38,0.40), transparent 60%)," +
            "radial-gradient(22% 11% at 70% 68%, rgba(205,238,219,0.30), transparent 60%)",
        }}
      />
    </div>
  );
}

/**
 * StarField — a DENSE field of real stars that replicates a photo starry sky.
 * Each star is a tiny dot that twinkles independently (per-star CSS `opacity`
 * animation = compositor thread, off the main thread → never janks). A small
 * static box-shadow gives the glow; since stars never move, the shadow is
 * rasterized once and only the layer alpha changes per frame — cheap.
 * Positions/sizes/timings are deterministic (sine hash, no Math.random).
 */
export function StarField({ count = 70, className }) {
  const hash = (n) => {
    const x = Math.sin(n * 12.9898) * 43758.5453;
    return x - Math.floor(x); // pseudo-random in [0,1), stable across renders
  };
  const stars = Array.from({ length: count }, (_, i) => {
    const c = hash(i + 11.5);
    const color = c > 0.86 ? "#99dfaf" : c > 0.72 ? "#5aa9e6" : "#ffffff";
    const size = 1 + hash(i + 3.1) * 2.2; // 1–3.2px
    return {
      i,
      left: hash(i + 1) * 100,
      top: hash(i + 7.3) * 100,
      size,
      color,
      delay: hash(i + 5.7) * 6, // 0–6s
      duration: 3 + hash(i + 9.2) * 4, // 3–7s
    };
  });

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className || ""}`}
    >
      {stars.map((s) => (
        <span
          key={s.i}
          className="star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            background: s.color,
            boxShadow: `0 0 ${s.size * 2.5}px ${s.color}`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * CountUp — animates a number from 0 to `to` once it scrolls into view.
 * Writes to the node's textContent directly via framer-motion's `animate` (rAF),
 * so there is NO React re-render per frame — cheap and smooth. Stops at the target.
 */
export function CountUp({ to, decimals = 0, suffix = "", prefix = "", duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const format = (v) => `${prefix}${v.toFixed(decimals)}${suffix}`;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduce) {
      node.textContent = format(to);
      return;
    }
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = format(v);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, to, decimals, suffix, prefix, duration, reduce]);

  return <span ref={ref}>{format(0)}</span>;
}

/** A tiny stylised cruiser SVG (faces left, glowing trail). Flat fills only — no SVG
 *  filters — so it stays cheap to move on the compositor. */
function Cruiser() {
  return (
    <svg width="120" height="40" viewBox="0 0 120 40" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="ship-trail" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#99dfaf" stopOpacity="0" />
          <stop offset="1" stopColor="#99dfaf" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <rect x="55" y="18" width="65" height="3" rx="1.5" fill="url(#ship-trail)" />
      <ellipse cx="32" cy="20" rx="30" ry="9" fill="#2a2740" stroke="#5aa9e6" strokeWidth="1" />
      <ellipse cx="20" cy="20" rx="8" ry="3.5" fill="#99dfaf" fillOpacity="0.85" />
      <circle cx="60" cy="20" r="3" fill="#99dfaf" />
      <path d="M40 13 L52 8 L50 13 Z" fill="#2a2740" stroke="#5aa9e6" strokeWidth="0.75" />
      <path d="M40 27 L52 32 L50 27 Z" fill="#2a2740" stroke="#5aa9e6" strokeWidth="0.75" />
    </svg>
  );
}

/**
 * CrossingShips — small cruisers that fly across the hero, right → left.
 * Movement is a CSS translateX keyframe (compositor thread → smooth, never janks);
 * per-ship scale lives on an inner wrapper so it doesn't fight the animated transform.
 * Deterministic timings (sine hash, no Math.random).
 */
export function CrossingShips({ count = 3, className }) {
  const hash = (n) => {
    const x = Math.sin(n * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  const ships = Array.from({ length: count }, (_, i) => {
    const duration = 22 + hash(i + 2.2) * 16; // 22–38s (slow)
    return {
      i,
      top: 8 + hash(i + 1) * 60, // 8%–68%
      duration,
      delay: -(hash(i + 4.4) * duration), // negative → different phases on load
      scale: 0.6 + hash(i + 6.6) * 0.4, // 0.6–1.0 (bigger so the chain logo reads)
      chain: supportedChains[i % supportedChains.length], // each ship carries a chain
    };
  });

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className || ""}`}
    >
      {ships.map((s) => (
        <div
          key={s.i}
          className="ship-cross"
          style={{
            top: `${s.top}%`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        >
          <div className="relative" style={{ transform: `scale(${s.scale})` }}>
            <Cruiser />
            {/* chain logo riding in the center of the ship */}
            {s.chain && (
              <img
                src={s.chain.icon}
                alt={s.chain.name}
                loading="lazy"
                className="absolute rounded-full bg-space-deep object-contain ring-2 ring-[#99dfaf]/70"
                style={{ width: 26, height: 26, left: 19, top: 7 }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * RocketShape — the Nodefleet rocket SVG (green→blue body, green window).
 * `uid` makes the gradient ids unique so multiple instances can coexist.
 * `flame` adds a small engine flame (used by the fly-by, not the loader).
 */
export function RocketShape({ uid = "r", flame = false, width = 120, height = 210 }) {
  const b = `${uid}-body`;
  const f = `${uid}-fin`;
  const fl = `${uid}-flame`;
  return (
    <svg width={width} height={height} viewBox="0 0 120 210" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={b} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#99dfaf" />
          <stop offset="0.55" stopColor="#6fc6c0" />
          <stop offset="1" stopColor="#5aa9e6" />
        </linearGradient>
        <linearGradient id={f} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5aa9e6" />
          <stop offset="1" stopColor="#3e8fd4" />
        </linearGradient>
        {flame && (
          <linearGradient id={fl} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.35" stopColor="#ffd56a" />
            <stop offset="1" stopColor="#ff7a00" stopOpacity="0" />
          </linearGradient>
        )}
      </defs>
      {flame && <path d="M49 168 L71 168 L60 212 Z" fill={`url(#${fl})`} />}
      <path
        d="M60 6 C 82 36, 86 72, 86 122 L86 150 Q60 166 34 150 L34 122 C34 72, 38 36, 60 6 Z"
        fill={`url(#${b})`}
        stroke="#bfeecd"
        strokeWidth="1.5"
      />
      <path
        d="M60 8 C 47 28, 41 52, 39 80 L39 145 Q47 156 50 156 L50 80 C52 52, 55 28, 60 8 Z"
        fill="#ffffff"
        fillOpacity="0.18"
      />
      <circle cx="60" cy="96" r="15" fill="#0a0a14" />
      <circle cx="60" cy="96" r="11.5" fill="#99dfaf" />
      <circle cx="55" cy="91" r="4" fill="#ffffff" fillOpacity="0.8" />
      <path d="M34 122 L14 168 L34 153 Z" fill={`url(#${f})`} />
      <path d="M86 122 L106 168 L86 153 Z" fill={`url(#${f})`} />
      <path d="M44 150 L76 150 L70 170 L50 170 Z" fill="#cdd7e6" />
    </svg>
  );
}

// Three fly-by paths: each descends, loops over the scene, then exits a different way
// (left / up / down). Coordinates are tuned for a ~1440px-wide hero.
// Same cycle length for all three (so their phases never drift into each other) with
// delays spread evenly by cycle/3 — guarantees they never appear at the same time.
const FLYBY_CYCLE = 36; // s — long cycle → each ship appears only occasionally
const FLYBY = [
  {
    // exit LEFT
    path: "M 1120 -150 C 1200 80, 1170 260, 1000 310 C 870 350, 770 250, 880 160 C 975 80, 1080 130, 1010 280 C 820 440, 360 390, -300 300",
    delay: 7,
  },
  {
    // exit UP
    path: "M 1250 520 C 1120 430, 1010 430, 960 380 C 880 300, 800 380, 860 470 C 910 545, 1010 520, 1000 400 C 985 230, 880 40, 820 -260",
    delay: 19,
  },
  {
    // exit DOWN
    path: "M 820 -220 C 900 40, 1030 120, 1020 260 C 1012 370, 890 410, 835 330 C 780 255, 870 195, 955 255 C 1075 340, 1130 620, 1120 980",
    delay: 31,
  },
];

/**
 * RocketFlyby — the launch rocket keeps coming back, now and then: it descends, loops
 * once over the scene, and exits a different direction each pass (left / up / down).
 * Follows CSS Motion Paths (`offset-path`); `offset-rotate` orients it along the curve.
 * Each ship is visible only a fraction of its cycle, so it appears occasionally.
 * Compositor-only; idle (hidden) frames cost ~nothing.
 */
export function RocketFlyby({ className }) {
  return (
    <div
      aria-hidden="true"
      className={`rocket-flyby pointer-events-none absolute inset-0 overflow-hidden ${className || ""}`}
    >
      {FLYBY.map((f, i) => (
        <div
          key={i}
          className="rocket-flyby-ship"
          style={{
            offsetPath: `path("${f.path}")`,
            animationDuration: `${FLYBY_CYCLE}s`,
            animationDelay: `${f.delay}s`,
          }}
        >
          <RocketShape uid={`flyby-${i}`} flame width={62} height={108} />
        </div>
      ))}
    </div>
  );
}

/**
 * ScrollFade — drifts its children up and fades them out as the user scrolls past.
 * Compositor-only (transform + opacity) on light content → smooth scroll animation
 * without jank. Use on the hero text block, not on heavy images.
 */
export function ScrollFade({ children, className, distance = 100 }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, distance]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  return (
    <m.div ref={ref} className={className} style={reduce ? undefined : { y, opacity }}>
      {children}
    </m.div>
  );
}

/**
 * Meteors — big falling meteors for a deep-space backdrop.
 * Pure CSS keyframes (see `.meteor` in index.css) animating only transform + opacity,
 * so they run on the compositor thread (off the main thread) and never jank scrolling.
 * Tails are gradients (move with the layer, no per-frame re-raster); no box-shadow/filter.
 * Positions/timings are derived from the index — deterministic, no Math.random.
 */
export function Meteors({ count = 6, className }) {
  const items = Array.from({ length: count }, (_, i) => {
    const left = (i * 27 + 6) % 100; // spread across the width
    const top = ((i * 17) % 45) - 12; // start near/above the top edge
    const delay = (i * 1.6) % 9; // staggered so they don't fall together
    const duration = 6 + (i % 4) * 1.8; // 6s–11.4s
    const length = 220 + (i % 3) * 120; // 220–460px — big tails
    return { i, left, top, delay, duration, length };
  });

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className || ""}`}
    >
      {items.map(({ i, left, top, delay, duration, length }) => (
        <span
          key={i}
          className="meteor"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: length,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * ParallaxLayer — moves at a fraction of scroll speed using a motion value.
 * Compositor-only (translateY) and only does work WHILE scrolling — idle = zero cost.
 * No spring: avoids an extra rAF settling loop.
 */
export function ParallaxLayer({ children, depth = 0.3, className }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const range = 80 * depth;
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);
  return (
    <m.div ref={ref} className={className} style={reduce ? undefined : { y }}>
      {children}
    </m.div>
  );
}
