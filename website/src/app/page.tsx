import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/sections/Hero';
import { Story } from '../components/sections/Story';
import { Services } from '../components/sections/Services';
import { Credibility } from '../components/sections/Credibility';
import { Workflows } from '../components/sections/Workflows';
import { Contact } from '../components/sections/Contact';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Story />
        <Services />
        <Credibility />
        <Workflows />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
