import { HashRouter, Route, Routes } from "react-router-dom";
import Navbar from "./Layouts/Navbar";
import Home from "./Pages/Home";
import { Toaster } from "react-hot-toast";
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { useEffect } from "react";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import Contact from "./Components/Contac2";
import LaunchLoader from "./Components/rebrand/LaunchLoader";

const firebaseConfig = {
  apiKey: "AIzaSyCrJTk0-eePPJxOogYYjguHikambSKspIw",
  authDomain: "landing-nodefleet.firebaseapp.com",
  projectId: "landing-nodefleet",
  storageBucket: "landing-nodefleet.appspot.com",
  messagingSenderId: "73192320150",
  appId: "1:73192320150:web:b396bd8457ebb9d863e6b7",
  measurementId: "G-EK7E6FH5DX"
};

export let analytics;

if (typeof window !== "undefined") {
  const app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
}

function App() {
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, "page_view");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const root = document.documentElement;
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        root.dataset.scrollDirection = "down";
      } else if (currentScrollY < lastScrollY) {
        root.dataset.scrollDirection = "up";
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    root.dataset.scrollDirection = "down";
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      delete root.dataset.scrollDirection;
    };
  }, []);

  return (
    <div className="App">
      <LaunchLoader />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navbar />}>
            <Route index element={<Home />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/nodes" element={<Contact />} />
          </Route>
        </Routes>
      </HashRouter>
      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
}

export default App;
