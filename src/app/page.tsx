import { Navigation } from "@/components/Navigation/Navigation";
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
    <>
      <Navigation />
      <main>
        <Hero />
        <SelectedWork />
        <Expertise />
        <Journey />
        <Lab />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
