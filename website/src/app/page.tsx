import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/sections/Hero';
import { Problem } from '../components/sections/Problem';
import { Story } from '../components/sections/Story';
import { Services } from '../components/sections/Services';
import { Credibility } from '../components/sections/Credibility';
import { Workflows } from '../components/sections/Workflows';
import { FounderPreview } from '../components/sections/FounderPreview';
import { Contact } from '../components/sections/Contact';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Story />
        <Services />
        <Workflows />
        <Credibility />
        <FounderPreview />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
