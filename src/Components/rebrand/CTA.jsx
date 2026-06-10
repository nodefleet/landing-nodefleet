import React from "react";
import {
  Reveal,
  FloatingOrb,
  StarField,
  CrossingShips,
  Meteors,
} from "../motion/space-primitives";

const CTA = () => {
  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden bg-space py-24 text-white max-sm:py-20"
    >
      <div className="mx-auto px-8 max-sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.02] px-10 py-28 text-center max-sm:px-6 max-sm:py-14">
          {/* Starfield drifting right→left (seamless 200% track) */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div
              className="bg-drift absolute inset-y-0 left-0 flex h-full"
              style={{ width: "200%", animationDuration: "80s" }}
            >
              <div className="relative h-full w-1/2 shrink-0">
                <StarField count={40} />
              </div>
              <div className="relative h-full w-1/2 shrink-0">
                <StarField count={40} />
              </div>
            </div>
          </div>
          {/* Falling meteors (instead of a planet) + cruisers */}
          <Meteors count={4} className="z-0 opacity-80" />
          <CrossingShips count={2} className="z-0" />
          <FloatingOrb
            size={420}
            color="rgba(90, 169, 230, 0.18)"
            style={{ top: -120, left: "20%" }}
            duration={20}
          />

          <div className="relative z-10">
            <Reveal as="h2" className="text-5xl font-bold max-sm:text-3xl">
              Ready to <span className="text-brand-gradient">build?</span>
            </Reveal>
            <Reveal
              delay={0.1}
              className="mx-auto mt-5 max-w-xl sm:text-lg text-md text-gray-400"
            >
              Launch, scale, and operate with confidence using high-performance
              blockchain infrastructure.
            </Reveal>
            <Reveal
              delay={0.2}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <a
                href="https://t.me/nodefleet"
                className="rounded-full bg-primary px-7 py-3 font-semibold text-space-deep shadow-glow transition-colors hover:bg-primary-400"
              >
                Start Building
              </a>
              <a
                href="https://t.me/nodefleet"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 px-7 py-3 font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
              >
                Contact Us
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
