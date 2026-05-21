import Header from "./components/Header";
import Hero from "./components/Hero";
import ProblemStatement from "./components/ProblemStatement";
import Services from "./components/Services";
import WhyWhatsApp from "./components/WhyWhatsApp";
import Pricing from "./components/Pricing";
import WaitlistForm from "./components/WaitlistForm";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProblemStatement />
        <Services />
        <WhyWhatsApp />
        <Pricing />
        <WaitlistForm />
      </main>
      <Footer />
    </>
  );
}
