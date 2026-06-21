import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { TrustStrip } from "./components/TrustStrip";
import { Services } from "./components/Services";
import { AddOns } from "./components/AddOns";
import { HowItWorks } from "./components/HowItWorks";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";
import { ScrollGate } from "./components/ScrollGate";
import { BackToTop } from "./components/BackToTop";
import { useSmoothScroll } from "./hooks/useSmoothScroll";

export default function App() {
  useSmoothScroll();

  return (
    <>
      <Navbar />
      <Hero />
      <TrustStrip />
      <main>
        <Services />
        <AddOns />
        <HowItWorks />
        <FinalCTA />
      </main>
      <ScrollGate />
      <Footer />
      <BackToTop />
    </>
  );
}
