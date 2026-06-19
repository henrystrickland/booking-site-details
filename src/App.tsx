import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { TrustStrip } from "./components/TrustStrip";
import { Services } from "./components/Services";
import { AddOns } from "./components/AddOns";
import { HowItWorks } from "./components/HowItWorks";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";

export default function App() {
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
      <Footer />
    </>
  );
}
