import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/sections/Hero';
import { Clients } from '../components/sections/Clients';
import { Story } from '../components/sections/Story';
import { Services } from '../components/sections/Services';
import { Workflows } from '../components/sections/Workflows';
import { Contact } from '../components/sections/Contact';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Clients />
        <Story />
        <Services />
        <Workflows />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
