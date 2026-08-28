import Navbar from "@/components/Navbar";
import ScrollyCanvas from "@/components/ScrollyCanvas";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

export default function Home() {
  return (
    <main className="bg-[#0d0d0d] min-h-screen">
      <CustomCursor />
      <Navbar />
      <ScrollyCanvas />
      <div className="relative z-10">
        <Projects />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
