import { Navigation } from "@/components/Navigation/Navigation";
import { MobileFloatingCta } from "@/components/Navigation/MobileFloatingCta";
import { Hero } from "@/components/Hero/Hero";
import { SelectedWork } from "@/components/SelectedWork/SelectedWork";
import { Expertise } from "@/components/Expertise/Expertise";
import { Journey } from "@/components/Journey/Journey";
import { Lab } from "@/components/Lab/Lab";
import { About } from "@/components/About/About";
import { Contact } from "@/components/Contact/Contact";
import { Footer } from "@/components/Footer/Footer";

export default function Home() {
  return (
    <div className="relative w-full max-w-full overflow-x-hidden min-h-screen">
      <Navigation />
      <MobileFloatingCta />
      <main className="relative w-full max-w-full overflow-x-hidden">
        <Hero />
        <SelectedWork />
        <Expertise />
        <Journey />
        <Lab />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
