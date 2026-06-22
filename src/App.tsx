import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { TrustStrip } from "./components/TrustStrip";
import { Services } from "./components/Services";
import { AddOns } from "./components/AddOns";
import { HowItWorks } from "./components/HowItWorks";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";
import { BackToTop } from "./components/BackToTop";
import { BookingProvider } from "./components/BookingModal";
import { useSmoothScroll } from "./hooks/useSmoothScroll";

export default function App() {
  useSmoothScroll();

  return (
    <BookingProvider>
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
      <BackToTop />
    </BookingProvider>
  );
}
