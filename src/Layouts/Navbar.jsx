import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [open, setOpen] = useState(false);

  // In-page sections (rebrand 2026 nav).
  const Menu = [
    { name: "Products", hash: "#products" },
    { name: "Services", hash: "#services" },
    { name: "Team", hash: "#team" },
  ];

  const handleNavigation = (e, hash) => {
    setOpen(false);
    if (isHome && hash) {
      e.preventDefault();
      const target = document.querySelector(hash);
      if (target) {
        window.scrollTo({ top: target.offsetTop, behavior: "smooth" });
      }
    }
  };

  return (
    <div>
      <div className="relative" id="Home">
        <header className="absolute left-0 top-0 z-50 w-full">
          <div className="flex w-full items-center justify-between px-8 py-7 max-sm:px-6 lg:px-20">
            <Link to="/" className="relative z-50" onClick={() => setOpen(false)}>
              <img
                src="/assets/icons/Logo_Nodefleet.svg"
                alt="Nodefleet"
                className="h-7 w-auto"
              />
            </Link>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className="z-50 hidden border-0 bg-transparent text-2xl text-white max-sm:block"
            >
              <i className={`fas ${open ? "fa-times" : "fa-bars"}`} />
            </button>

            {/* Links */}
            <nav
              className={`flex items-center gap-9 max-sm:absolute max-sm:right-0 max-sm:top-full max-sm:w-full max-sm:flex-col max-sm:items-end max-sm:gap-6 max-sm:bg-space-deep/95 max-sm:p-6 max-sm:backdrop-blur ${
                open ? "max-sm:flex" : "max-sm:hidden"
              }`}
            >
              {Menu.map(({ name, hash }) => (
                <Link
                  key={name}
                  to={isHome ? hash : `/${hash}`}
                  onClick={(e) => handleNavigation(e, hash)}
                  className="font-medium text-gray-200 no-underline transition-colors hover:text-white"
                >
                  {name}
                </Link>
              ))}
              <a
                href="https://t.me/nodefleet"
                className="rounded-full bg-primary px-6 py-2.5 font-semibold text-space-deep no-underline shadow-glow-sm transition-colors hover:bg-primary-400"
              >
                Join the Future
              </a>
            </nav>
          </div>
        </header>

        <section>
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default Navbar;
