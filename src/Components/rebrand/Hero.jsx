import React from "react";
import {
  Reveal,
  Stagger,
  StaggerItem,
  FloatingOrb,
  Meteors,
  StarField,
  CrossingShips,
  ScrollFade,
  CountUp,
  RocketFlyby,
} from "../motion/space-primitives";

// Hero metrics shown below the trusted-by logos (count up into view).
const STATS = [
  { to: 0.99, decimals: 2, suffix: "%", label: "Uptime SLA" },
  { to: 20, suffix: "+", label: "Chains supported" },
  { to: 3, suffix: "M+", label: "Requests / sec" },
  { to: 6, suffix: "+", label: "Edge regions" },
];

const handleNavigation = (e, hash) => {
  if (hash) {
    e.preventDefault();
    const target = document.querySelector(hash);
    if (target) {
      window.scrollTo({ top: target.offsetTop, behavior: "smooth" });
    }
  }
};

const Hero = () => {
  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-space-deep text-white"
    >
      {/* CSS nebula backdrop — replicates the photo sky (blue clouds) with pure
          gradients, so we drop the 6MB image. STATIC paint = zero per-frame cost. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 50% at 22% 28%, rgba(38,70,140,0.40), transparent 62%)," +
            "radial-gradient(50% 45% at 82% 18%, rgba(28,58,120,0.34), transparent 60%)," +
            "radial-gradient(55% 50% at 68% 72%, rgba(46,86,160,0.28), transparent 60%)," +
            "radial-gradient(45% 45% at 35% 88%, rgba(90,169,230,0.14), transparent 60%)," +
            "radial-gradient(40% 40% at 50% 50%, rgba(42,39,75,0.30), transparent 70%)",
        }}
      />
      {/* Dense star field that drifts slowly right→left. The track is 200% wide with
          two identical halves so the loop is seamless; CSS translateX = compositor 60fps,
          never janks. Each star also twinkles (opacity). */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="bg-drift absolute inset-y-0 left-0 flex h-full"
          style={{ width: "200%", animationDuration: "90s" }}
        >
          <div className="relative h-full w-1/2 shrink-0">
            <StarField count={110} />
          </div>
          <div className="relative h-full w-1/2 shrink-0">
            <StarField count={110} />
          </div>
        </div>
      </div>
      {/* Big falling meteors in the deep background (behind ship + content) */}
      <Meteors count={6} className="z-0 opacity-80" />
      {/* Cruisers flying across the hero, each carrying a supported-chain logo */}
      <CrossingShips count={6} className="z-0" />
      <FloatingOrb
        size={520}
        color="rgba(90, 169, 230, 0.16)"
        style={{ top: -120, right: "8%" }}
        duration={24}
      />
      <FloatingOrb
        size={380}
        color="rgba(153, 223, 175, 0.14)"
        style={{ bottom: 40, left: "-6%" }}
        duration={19}
      />

      {/* Spaceship — right-aligned, STATIC. The image is heavy (3.4MB), so it gets no
          scroll-parallax/float: moving it every frame is exactly what janked scrolling. */}
      <div className="pointer-events-none absolute right-0 bottom-0 z-20 w-[52%] max-w-[860px] -translate-y-1/2 max-lg:w-[60%] max-sm:w-[88%] max-sm:opacity-40 -translate-x-20">
        {/* station "lands / recreates" after the loader reveals the hero */}
        <div className="station-arrive">
          <img
            src="/assets/setions/hero_setion.png"
            alt="Nodefleet space fleet"
            className="h-auto w-full scale-[1.37] opacity-75"
          />
        </div>
      </div>

      {/* The launched rocket comes back: descends, loops over the scene, exits left.
          Runs once ~4.6s after load (post-loader). Hidden on mobile (path is desktop-sized). */}
      <RocketFlyby className="z-30 max-sm:hidden" />

      <ScrollFade className="relative z-20 w-full px-8 pb-24 pt-44 max-sm:px-6 max-sm:pt-32 lg:px-20">
        <div className="max-w-2xl">
          <Reveal
            as="h1"
            className="text-7xl font-bold leading-[1.05] max-lg:text-6xl max-sm:text-4xl"
          >
            The <span className="italic">future</span> cloud
            <br />
            <span className="text-brand-gradient italic">infrastructure</span>
          </Reveal>

          <Reveal
            delay={0.12}
            className="mt-6 max-w-xl text-2xl text-white/60 max-sm:text-base"
          >
            Unified infrastructure for Blockchains, Storage and AI. Build, scale
            and innovate without limits.
          </Reveal>

          <Reveal
            delay={0.2}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="https://t.me/nodefleet"
              className="rounded-full bg-primary px-7 py-3 font-semibold text-space-deep shadow-glow transition-colors hover:bg-primary-400"
            >
              Join the Future
            </a>
            <a
              href="#products"
              onClick={(e) => handleNavigation(e, "#products")}
              className="rounded-full border border-white/20 px-7 py-3 font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
            >
              Explore Products
            </a>
          </Reveal>

          <Reveal delay={0.3} className="mt-14">
            <p className="text-sm font-normal text-gray-400">
              Trusted by builders and companies worldwide
            </p>
            <div className="mt-5 flex flex-col items-start justify-start gap-2 opacity-80 scale-90 sm:-translate-x-10 -translate-x-4">
              <img
                src="/assets/setions/hero_setion_logos_1.png"
                alt="Trusted by DRPC, dYdX, Elliptic, POKT, Passage"
                className="h-auto w-auto max-sm:h-7"
              />
              <img
                src="/assets/setions/hero_setion_logos_2.png"
                alt="Trusted by Lava, 1kx, Allium, Canopy, Node River"
                className="h-auto w-auto max-sm:h-7"
              />
            </div>
          </Reveal>
        </div>

        {/* Stats */}
        <div className="w-full flex items-center justify-center ">
          <Stagger className="mt-20 grid grid-cols-4 gap-4 max-sm:grid-cols-2 w-full max-w-4xl">
            {STATS.map((s) => (
              <StaggerItem
                key={s.label}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.04] px-6 py-6 text-center"
              >
                <div className="text-4xl font-bold text-white max-sm:text-2xl">
                  <CountUp to={s.to} decimals={s.decimals} suffix={s.suffix} />
                </div>
                <div className="mt-1 text-sm text-gray-400">{s.label}</div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </ScrollFade>
    </section>
  );
};

export default Hero;
