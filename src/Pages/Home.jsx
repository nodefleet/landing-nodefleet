import React from "react";
import { MotionProvider } from "../Components/motion/space-primitives";
import Hero from "../Components/rebrand/Hero";
import Products from "../Components/rebrand/Products";
import Services from "../Components/rebrand/Services";
import TeamSection from "../Components/rebrand/TeamSection";
import CTA from "../Components/rebrand/CTA";
import Footer from "../Components/rebrand/Footer";

const Home = () => {
  return (
    <MotionProvider>
      <div className="flex flex-col bg-space">
        <Hero />
        <Products />
        <Services />
        {/* <TeamSection /> */}
        <CTA />
        <Footer />
      </div>
    </MotionProvider>
  );
};

export default Home;
