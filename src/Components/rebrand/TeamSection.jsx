import React from "react";
import {
  Reveal,
  Stagger,
  StaggerItem,
  TiltCard,
  FloatingOrb,
} from "../motion/space-primitives";

const MEMBERS = [
  {
    name: "Kael Abbott",
    role: "Co-Founder & CEO",
    bio: "Has a wide experience working on python/django.",
    photo: "/assets/team/kael.png",
  },
  {
    name: "Jonathan Maria",
    role: "SRE",
    bio: "Ex-Ethereum Foundation. Specialist in cross-chain bridge architecture and EVM internals.",
    photo: "/assets/team/jhonathan.jpg",
  },
  {
    name: "Carlos Peña",
    role: "COO",
    bio: "Led DevOps at two blockchain unicorns. Obsessed with 99.99% uptime.",
    photo: "/assets/team/carlos.jpg",
  },
  {
    name: "Juan Carlos Abreu",
    role: "Lead Engineer",
    bio: "Built core consensus modules for Solana validators. Deep Rust + Go expertise.",
    photo: "/assets/team/juancarlos.jpeg",
  },
  {
    name: "Katherine Andujar",
    role: "Product Manager",
    bio: "Web3 UI/UX professional designer experienced in fintech startup products.",
    photo: "/assets/team/katerine.png",
  },
  {
    name: "Lowell Abbott",
    role: "Founder & Advisor",
    bio: "Former Devops Lead of Pocket Network and CEO of nodefleet.org.",
    photo: "/assets/team/lowell.png",
  },
];

const TeamSection = () => {
  return (
    <section
      id="team"
      className="relative w-full overflow-hidden bg-space-deep py-28 text-white max-sm:py-20"
    >
      <div className="stars pointer-events-none absolute inset-0 opacity-30" />
      <FloatingOrb
        size={440}
        color="rgba(90, 169, 230, 0.12)"
        style={{ bottom: 60, right: "-6%" }}
        duration={21}
      />
      <div className="relative mx-auto max-w-[100rem] px-8 max-sm:px-6">
        <Reveal
          as="h2"
          className="text-center text-5xl font-bold max-sm:text-3xl"
        >
          <span className="text-brand-gradient italic">Meet</span> the Team
        </Reveal>
        <Reveal
          delay={0.1}
          className="mx-auto mt-4 max-w-2xl text-center text-lg text-gray-400"
        >
          The builders behind Nodefleet — protocol engineers, infrastructure
          architects, <span className="italic">and chain operators</span>.
        </Reveal>

        <Stagger className="mt-14 grid lg:grid-cols-3 gap-6 max-sm:grid-cols-1 md:grid-cols-2">
          {MEMBERS.map((m) => (
            <StaggerItem key={m.name}>
              <TiltCard className="w-full h-full rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-8 transition-colors hover:border-primary/30">
                <div className="flex items-center gap-4">
                  <img
                    src={m.photo}
                    alt={m.name}
                    loading="lazy"
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-white/10"
                  />
                  <div>
                    <h3 className="font-semibold text-white">{m.name}</h3>
                    <p className="text-sm text-primary">{m.role}</p>
                  </div>
                </div>
                <p className="mt-5 text-gray-400">{m.bio}</p>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
};

export default TeamSection;
