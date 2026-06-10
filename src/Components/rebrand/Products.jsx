import React, { useState } from "react";
import { Reveal, TiltCard, FloatingOrb } from "../motion/space-primitives";

const TABS = ["Blockchain", "Storage", "Artificial Intelligence"];

const PRODUCTS_BY_TAB = {
  Blockchain: [
    {
      logo: "/assets/icons/nodegate.svg",
      name: "nodegate",
      href: "https://datanodes.nodefleet.net/",
      badge: "Deploy your chain like a fleet",
      body: [
        "Launching a protocol takes months. No complete launch platform exists today.",
        "Everything your chain needs, wired together. Five first-class services, one admin interface, one billing line. Turn any on or off from the panel - Nodegate handles the glue.",
      ],
      features: [
        "Faucet",
        "Explorer",
        "Snapshot service",
        "RPC admin",
        "Seed registry",
      ],
    },
    {
      logo: "/assets/icons/fleetwallet.svg",
      name: "fleetwallet",
      href: "https://fleetwallet.nodefleet.net/",
      badge: "Every chain in your fleet.",
      body: [
        "Self-custody multi-chain wallet for builders and operators. EVM, Cosmos, Bitcoin and more - keys in your hands, signing audited by trust-wallet-core, UX built for people who deploy chains for a living.",
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
      href: "https://datanodes.nodefleet.net/",
      badge: "RPC Blockchain Data Nodes",
      body: [
        "Everything you need to deploy your app. Reliable infrastructure, real-time performance insights, and multi-chain support - all in one powerful subscription.",
      ],
      features: [
        "Dedicated RPC Nodes",
        "Real-Time Monitoring",
        "Multi-Chain Support",
        "Scalable Infrastructure",
      ],
      chains: "/assets/setions/products_setion_datanodes_chains.png",
    },
  ],
  Storage: [
    {
      logoLabel: "DataHub",
      logoAccent: "Storage",
      logo: "/assets/icons/datahub.svg",
      name: "DataHub",
      href: "https://datahub.nodefleet.net",
      badge: "Own your files. Store without limits",
      body: [
        "Private storage designed for teams that need fast access, clean structure, and dependable delivery.",
        "A branded storage layer for Nodefleet products, built to keep your operational data organized and ready to ship.",
      ],
      features: [
        "Object storage",
        "Decentralized",
        "Fast Upload and Downloads",
        "Web3-Native Payments",
      ],
    },
  ],
  "Artificial Intelligence": [
    {
      logoLabel: "poktai",
      logoAccent: "AI",
      name: "POKTAI",
      href: "https://pokt.ai/",
      logo: "/assets/icons/poktai.png",
      badge: "Build the Future of Web3 Infrastructure",
      body: [
        "Build faster, scale better, and optimize costs with our intelligent RPC gateway built on top of Pocket Network Shannon + PATH.",
      ],
      features: [
        "Lighting Fast",
        "Enterprise Security",
        "Global Network",
        "Realtime Analytics",
        "Pay As You Go",
      ],
    },
    {
      logoLabel: "AIViber",
      logoAccent: "AI",
      name: "AIViber",
      logo: "/assets/icons/AIVIBER.svg",
      href: "https://aiviber.io/",
      badge: "Four layers. One context plane for agents.",
      body: [
        "AI-powered workflows for teams that want smarter product ops, faster decisions, and cleaner automation.",
        "Designed as a native Nodefleet companion with a bold brand presence and an operator-first mindset.",
      ],
      features: [
        "Persistent Memory for AI Agentss",
        "Shared Memory Across Projects",
        "Skillset and Agent Dispatch",
        "Token-Efficient Language",
        "Governed & Multi Tenant",
      ],
    },
    {
      logoVariant: "text",
      logoLabel: "BotFleet",
      logoAccent: "AI",
      name: "BotFleet",
      href: "https://botfleet.net/",
      badge: "Automation for modern ops",
      body: [
        "AI-powered automation for teams that want faster workflows, cleaner operations, and less repetitive work.",
        "A companion brand that fits naturally alongside the rest of the AI stack, with a clean identity and operator-first focus.",
      ],
      features: [
        "Workflow automation",
        "Task orchestration",
        "Smart assistants",
        "Operational efficiency",
      ],
    },
  ],
};

const Check = () => (
  <span className="sm:h-6 sm:w-6 w-5 h-5 flex items-center justify-center shrink-0 place-items-center rounded-full  bg-green-300/20 sm:text-sm text-xs text-primary">
    ✓
  </span>
);

const ProductLogo = ({ product }) => {
  if (product.logoVariant === "text") {
    const firstLetter = product.logoLabel?.[0] ?? "";
    const restLabel = product.logoLabel?.slice(1) ?? "";

    return (
      <p className="text-2xl font-black font-urbanist tracking-[0.18em] leading-3 uppercase max-sm:text-xl">
        <span className="text-primary">{firstLetter}</span>
        <span className="text-white">{restLabel}</span>
      </p>
    );
  }

  return (
    <img
      src={product.logo}
      alt={product.name}
      className={` ${product.name === "DataHub" ? "h-20 w-auto" : "h-8 w-auto"}`}
    />
  );
};

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
        <Reveal
          as="h2"
          className="text-center text-5xl font-bold max-sm:text-4xl"
        >
          Products
        </Reveal>
        <Reveal delay={0.1} className="mt-4 text-center text-lg text-gray-400">
          The Infrastructure gap{" "}
          <span className="italic">no one has filled</span>.
        </Reveal>

        {/* Tabs */}
        <Reveal delay={0.15} className="mt-10 flex justify-center">
          <div className="inline-flex rounded-full border border-white/10 bg-white/[0.03] sm:p-2 p-1 max-sm:flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActive(tab)}
                className={`rounded-full px-6 py-2 font-medium transition-colors max-sm:text-xs ${
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

        {/* Cards */}
        <div className="mt-12 flex flex-col gap-8">
          {(PRODUCTS_BY_TAB[active] ?? []).map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <TiltCard className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 max-sm:p-6">
                <div className="grid grid-cols-2 gap-10 max-sm:grid-cols-1 max-sm:gap-6">
                  <div>
                    <div className="flex flex-col gap-2 items-start">
                      <ProductLogo product={p} />
                      <p className="mt-5 inline-block rounded-full border border-primary/40 px-4 py-1 text-sm text-primary">
                        {p.badge}
                      </p>
                    </div>
                    <div className="mt-5 space-y-4 max-sm:text-md text-gray-300">
                      {p.body.map((para, j) => (
                        <p key={j}>{para}</p>
                      ))}
                    </div>
                    {p.chains && (
                      <img
                        src={p.chains}
                        alt="Supported chains"
                        className="mt-6 sm:h-12 w-auto"
                      />
                    )}
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-8 inline-flex items-center gap-2 font-semibold text-white hover:text-primary"
                    >
                      <div className="sm:h-6 sm:w-6 w-5 h-5 flex items-center justify-center rounded-full bg-white text-space-deep">
                        <span className="-translate-y-[1px]">→</span>
                      </div>
                      Get Started
                    </a>
                  </div>
                  <ul className="flex flex-col justify-center gap-4">
                    {p.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-3 max-sm:text-sm text-gray-200"
                      >
                        <Check />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
