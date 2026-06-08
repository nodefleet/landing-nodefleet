import React, { useEffect, useState } from "react";
import { StarField, RocketShape } from "../motion/space-primitives";

/**
 * LaunchLoader — full-screen intro: ignition (shake + flame + smoke) → lift-off
 * (rocket flies up) → the overlay fades out, revealing the hero.
 * All motion is CSS transform/opacity (compositor thread → 60fps). Self-unmounts.
 */
export default function LaunchLoader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Respect reduced-motion: skip the whole intro.
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      setDone(true);
      return;
    }
    document.body.style.overflow = "hidden"; // no scrolling behind the loader
    const t = setTimeout(() => {
      document.body.style.overflow = ""; // restore scroll BEFORE unmount-render
      setDone(true);
    }, 3500);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div className="launch-loader fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-space-deep">
      {/* Stars falling top→bottom (sells the rocket climbing upward). A 200%-tall
          track with two identical halves loops seamlessly; CSS translateY = compositor. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="star-fall absolute inset-x-0 top-0 h-[200%]">
          <div className="relative h-1/2 w-full">
            <StarField count={70} />
          </div>
          <div className="relative h-1/2 w-full">
            <StarField count={70} />
          </div>
        </div>
      </div>

      {/* scale wrapper — makes the whole rocket bigger without recalibrating
          the flame/smoke offsets (they stay relative inside) */}
      <div className="relative flex scale-150 flex-col items-center max-sm:scale-110">
        <div className="rocket-rise relative">
          <div className="rocket-shake relative">
            <RocketShape uid="loader" />
            {/* engine flame (grows on ignition, flickers) */}
            <div className="flame-wrap pointer-events-none absolute left-1/2 top-[150px] -translate-x-1/2">
              <div className="flame" />
            </div>
          </div>
          {/* launch smoke at the pad */}
          <div className="smoke smoke--1 pointer-events-none absolute left-1/2 top-[170px] -translate-x-1/2" />
          <div className="smoke smoke--2 pointer-events-none absolute left-1/2 top-[176px] -translate-x-1/2" />
        </div>
      </div>

      <p className="loader-caption text-brand-gradient mt-24 text-3xl font-bold tracking-wide max-sm:text-2xl">
        Preparing for launch…
      </p>
    </div>
  );
}
