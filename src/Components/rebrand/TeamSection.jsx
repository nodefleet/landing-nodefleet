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
    bio: (
      <>
        Co-founder and CEO focused on building products with{" "}
        <span className="text-primary">Python</span> and{" "}
        <span className="text-primary">Django</span>, with a strong eye for
        product quality and execution.
      </>
    ),
    photo: "/assets/team/kael.png",
  },
  {
    name: "Jonathan Maria",
    role: "SRE",
    bio: (
      <>
        Software Developer and <span className="text-primary">DevOps</span>{" "}
        Engineer passionate about building reliable digital solutions,
        automating <span className="text-primary">infrastructure</span>, and
        supporting <span className="text-primary">blockchain</span> and{" "}
        <span className="text-primary">cloud-based systems</span>.
      </>
    ),
    photo: "/assets/team/jhonathan.jpg",
  },
  {
    name: "Carlos Peña",
    role: "COO",
    bio: (
      <>
        Strategic finance and analytics professional passionate about{" "}
        <span className="text-primary">blockchain infrastructure</span>,{" "}
        <span className="text-primary">decentralized technologies</span>, and
        sustainable value creation.
      </>
    ),
    photo: "/assets/team/carlos.jpg",
  },
  {
    name: "Juan Carlos Abreu",
    role: "Full-Stack Engineer",
    bio: (
      <>
        Builds modern digital products across{" "}
        <span className="text-primary">frontend</span>,{" "}
        <span className="text-primary">backend</span>,{" "}
        <span className="text-primary">AI</span>, and{" "}
        <span className="text-primary">blockchain systems</span>, with strong
        experience in <span className="text-primary">React</span>,{" "}
        <span className="text-primary">TypeScript</span>,{" "}
        <span className="text-primary">Node.js</span>,{" "}
        <span className="text-primary">Python</span>, and{" "}
        <span className="text-primary">Django</span>.
      </>
    ),
    photo: "/assets/team/juancarlos.jpeg",
  },
  {
    name: "Katherine Andujar",
    role: "Product Manager",
    bio: (
      <>
        Product manager and <span className="text-primary">Web3</span>{" "}
        <span className="text-primary">UI/UX</span> designer with experience
        shaping <span className="text-primary">fintech</span> products and clear
        user experiences.
      </>
    ),
    photo: "/assets/team/katerine.png",
  },
  {
    name: "Lowell Abbott",
    role: "Founder & Advisor",
    bio: (
      <>
        Former <span className="text-primary">DevOps</span> Lead at{" "}
        <span className="text-primary">Pocket Network</span> and CEO of{" "}
        <span className="text-primary">nodefleet.org</span>, with deep
        experience in infrastructure and operations.
      </>
    ),
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
          className="mx-auto mt-4 max-w-2xl text-center sm:text-lg text-md text-gray-400"
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
                    className="sm:h-14 sm:w-14 w-10 h-10 rounded-full object-cover object-center ring-2 ring-white/10"
                  />
                  <div>
                    <h3 className="font-semibold text-white">{m.name}</h3>
                    <p className="text-sm text-primary">{m.role}</p>
                  </div>
                </div>
                <p className="mt-5 text-gray-400 max-sm:text-sm">{m.bio}</p>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
};

export default TeamSection;
