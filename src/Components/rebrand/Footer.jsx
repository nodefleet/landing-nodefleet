import React from "react";
import { StarField, Meteors } from "../motion/space-primitives";

const TELEGRAM = "https://t.me/nodefleet";

const COLUMNS = [
  {
    title: "Products",
    links: [
      { label: "Blockchain", href: "https://datanodes.nodefleet.net/" },
      { label: "Storage", href: "https://datahub.nodefleet.net" },
      { label: "AI", href: "https://aiviber.io/" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Staking", href: "https://fleetwallet.nodefleet.net/" },
      { label: "Consulting", href: "https://nodes.nodefleet.org/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Portfolio", href: "https://canva.link/nodefleet" },
      { label: "Support", href: TELEGRAM },
    ],
  },
];

// External links open in a new tab; in-page anchors (#) stay put.
const isExternal = (href) => href.startsWith("http");

const Footer = () => {
  return (
    <footer className="relative w-full overflow-hidden border-t border-white/10 bg-space py-16 text-white">
      {/* Starfield drifting right→left + falling meteors (no ships) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="bg-drift absolute inset-y-0 left-0 flex h-full"
          style={{ width: "200%", animationDuration: "90s" }}
        >
          <div className="relative h-full w-1/2 shrink-0">
            <StarField count={36} />
          </div>
          <div className="relative h-full w-1/2 shrink-0">
            <StarField count={36} />
          </div>
        </div>
      </div>
      <Meteors count={3} className="z-0 opacity-70" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-4 gap-10 px-8 max-sm:grid-cols-2 max-sm:px-6 lg:px-20">
        <div className="max-sm:col-span-2">
          <img
            src="/assets/icons/Logo_Nodefleet.svg"
            alt="Nodefleet"
            className="h-7 w-auto"
          />
          <p className="mt-4 text-sm text-gray-400">
            The future cloud infrastructure
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="font-semibold text-white">{col.title}</h4>
            <ul className="mt-4 space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(isExternal(link.href)
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="text-sm text-gray-400 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
