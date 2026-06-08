import React, { useState } from "react";
import { Reveal, TiltCard, FloatingOrb } from "../motion/space-primitives";

const TABS = ["Blockchain", "Storage", "Artificial Intelligence"];

// Blockchain products (the populated tab in the mockups).
const PRODUCTS = [
  {
    logo: "/assets/icons/nodegate.svg",
    name: "nodegate",
    badge: "Deploy your chain like a fleet",
    body: [
      "Launching a protocol takes months. No complete launch platform exists today.",
      "Everything your chain needs, wired together. Five first-class services, one admin interface, one billing line. Turn any on or off from the panel — Nodegate handles the glue.",
    ],
    features: ["Faucet", "Explorer", "Snapshot service", "RPC admin", "Seed registry"],
  },
  {
    logo: "/assets/icons/fleetwallet.svg",
    name: "fleetwallet",
    badge: "Deploy your chain like a fleet",
    body: [
      "Self-custody multi-chain wallet for builders and operators. EVM, Cosmos, Bitcoin and more — keys in your hands, signing audited by trust-wallet-core, UX built for people who deploy chains for a living.",
    ],
    features: [
      "Native EVM",
      "Native Cosmos & IBC",
      "Trust Wallet Core",
      "Developermode",
      "One seed, every chain",
    ],
  },
  {
    logo: "/assets/icons/datanodes.svg",
    name: "DataNodes",
    badge: "RPC Blockchain Data Nodes",
    body: [
      "Everything you need to deploy your app Reliable infrastructure, real-time performance insights, and multi-chain support — all in one powerful subscription.",
    ],
    features: [
      "Dedicated RPC Nodes",
      "Real-Time Monitoring",
      "Multi-Chain Support",
      "Scalable Infrastructure",
    ],
    chains: "/assets/setions/products_setion_datanodes_chains.png",
  },
];

const Check = () => (
  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-primary/40 text-sm text-primary">
    ✓
  </span>
);

const Products = () => {
  const [active, setActive] = useState(TABS[0]);

  return (
    <section
      id="products"
      className="relative w-full overflow-hidden bg-space-deep py-28 text-white max-sm:py-20"
    >
      <div className="stars pointer-events-none absolute inset-0 opacity-30" />
      <FloatingOrb
        size={460}
        color="rgba(153, 223, 175, 0.12)"
        style={{ top: 120, left: "-8%" }}
        duration={23}
      />
      <div className="relative mx-auto max-w-7xl px-8 max-sm:px-6">
        <Reveal as="h2" className="text-center text-5xl font-bold max-sm:text-4xl">
          Products
        </Reveal>
        <Reveal delay={0.1} className="mt-4 text-center text-lg text-gray-400">
          The Infrastructure gap <span className="italic">no one has filled</span>.
        </Reveal>

        {/* Tabs */}
        <Reveal delay={0.15} className="mt-10 flex justify-center">
          <div className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1 max-sm:flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActive(tab)}
                className={`rounded-full px-6 py-2 font-medium transition-colors max-sm:text-sm ${
                  active === tab
                    ? "bg-primary text-space-deep"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Cards (Blockchain populated; others reuse the same layout when ready) */}
        <div className="mt-12 flex flex-col gap-8">
          {active === "Blockchain" ? (
            PRODUCTS.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <TiltCard className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 max-sm:p-6">
                  <div className="grid grid-cols-2 gap-10 max-sm:grid-cols-1 max-sm:gap-6">
                    <div>
                      <img src={p.logo} alt={p.name} className="h-8 w-auto" />
                      <span className="mt-5 inline-block rounded-full border border-primary/40 px-4 py-1 text-sm text-primary">
                        {p.badge}
                      </span>
                      <div className="mt-5 space-y-4 text-gray-300">
                        {p.body.map((para, j) => (
                          <p key={j}>{para}</p>
                        ))}
                      </div>
                      {p.chains && (
                        <img
                          src={p.chains}
                          alt="Supported chains"
                          className="mt-6 h-12 w-auto"
                        />
                      )}
                      <a
                        href="#contact"
                        className="mt-8 inline-flex items-center gap-2 font-semibold text-white hover:text-primary"
                      >
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-space-deep">
                          →
                        </span>
                        Get Started
                      </a>
                    </div>
                    <ul className="flex flex-col justify-center gap-4">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-gray-200">
                          <Check />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </TiltCard>
              </Reveal>
            ))
          ) : (
            <Reveal>
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center text-gray-400">
                {active} products coming soon.
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
};

export default Products;
