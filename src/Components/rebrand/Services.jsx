import React from "react";
import {
  Reveal,
  Stagger,
  StaggerItem,
  FloatingOrb,
  StarField,
  CrossingShips,
  Planet,
} from "../motion/space-primitives";

const SERVICES = [
  {
    icon: "/assets/icons/fluent_work-iq-32-regular.svg",
    title: "Development Workshop",
    body: "Custom builds alongside your team — delivered on Nodefleet infrastructure.",
  },
  {
    icon: "/assets/icons/streamline-plump_industry-innovation-and-infrastructure.svg",
    title: "White Glove Infrastructure",
    body: "Dedicated Nodefleet engineers, custom SLAs, proactive monitoring.",
  },
  {
    icon: "/assets/icons/pajamas_infrastructure-registry.svg",
    title: "Infra / Blockchain Consulting",
    body: "Protocol launch strategy, architecture reviews, cost optimization.",
  },
  {
    icon: "/assets/icons/nimbus_ecosystem.svg",
    title: "Staking as a Service",
    body: "Validator operations + delegation strategy. Connects to NodeGate + poktpool.",
  },
];

const Services = () => {
  return (
    <section
      id="services"
      className="relative w-full overflow-hidden bg-space py-28 text-white max-sm:py-20"
    >
      <div className=" px-8 max-sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.02] px-10 py-16 max-sm:px-6 max-sm:py-12">
          {/* Starfield drifting right→left (seamless 200% track) + cruisers */}
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
          {/* Big Nodefleet planet looming from the bottom-left corner */}
          <Planet
            size={480}
            className="z-0 max-sm:hidden"
            style={{ left: -170, bottom: -190 }}
          />
          <CrossingShips count={2} className="z-0" />
          <div className="max-w-5xl mx-auto">
            {/* Aurora glows */}
            <FloatingOrb
              size={460}
              color="rgba(90, 169, 230, 0.20)"
              style={{ top: -120, left: -100 }}
              duration={22}
            />
            <FloatingOrb
              size={360}
              color="rgba(153, 223, 175, 0.18)"
              style={{ bottom: -120, right: -60 }}
              duration={18}
            />

            <div className="relative z-10">
              <Reveal
                as="h2"
                className="text-center text-5xl font-bold max-sm:text-2xl"
              >
                <span className="text-green-300 italic">Fleet-Powered</span>{" "}
                Services
              </Reveal>
              <Reveal
                delay={0.1}
                className="mt-4 text-center sm:text-lg text-sm text-gray-400"
              >
                When you need the team,{" "}
                <span className="italic">not just the platform</span>.
              </Reveal>

              <Stagger className="mt-12 grid grid-cols-2 gap-6 max-sm:grid-cols-1">
                {SERVICES.map((s) => (
                  <StaggerItem
                    key={s.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 py-12 backdrop-blur-md max-sm:p-6"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={s.icon}
                        alt=""
                        aria-hidden="true"
                        className="sm:h-8 sm:w-8 w-5 h-5"
                      />
                      <h3 className="sm:text-xl text-md font-semibold text-white">
                        {s.title}
                      </h3>
                    </div>
                    <p className="mt-2 max-sm:text-sm text-gray-200">
                      {s.body}
                    </p>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
