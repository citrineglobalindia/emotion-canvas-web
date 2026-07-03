import FilmGrain from "@/components/FilmGrain";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BioSection from "@/components/BioSection";
import VideoGrid from "@/components/VideoGrid";
import DefinesUsSection from "@/components/DefinesUsSection";
import MagicSection from "@/components/MagicSection";
import PhotoGrid from "@/components/PhotoGrid";
import TestimonialsSection from "@/components/TestimonialsSection";
import InstagramFeed from "@/components/InstagramFeed";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import LeadPopup from "@/components/LeadPopup";

const Index = () => {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <FilmGrain />
      <Header />
      <HeroSection />
      <BioSection />
      <VideoGrid />
      <DefinesUsSection />
      <MagicSection />
      <PhotoGrid />
      <TestimonialsSection />
      <InstagramFeed />
      <ContactSection />
      <Footer />
      <FloatingButtons />
      <LeadPopup />
    </div>
  );
};

export default Index;
