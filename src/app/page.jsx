import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Experience from '../components/Experience';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Background3D from '../components/Background3D';

export default function Home() {
  return (
    <main className="relative min-h-screen text-[#ededed]">
      {/* 3D Autonomous WebGL Background (No cursor tracking, no filters) */}
      <Background3D />
      
      {/* Content Layer */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
