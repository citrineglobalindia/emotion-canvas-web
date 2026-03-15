import FilmGrain from "@/components/FilmGrain";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import VideoSection from "@/components/VideoSection";
import FeaturedFilms from "@/components/FeaturedFilms";
import GallerySection from "@/components/GallerySection";
import StorySection from "@/components/StorySection";
import ServicesSection from "@/components/ServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import FloatingButtons from "@/components/FloatingButtons";
import Footer from "@/components/Footer";
import LeadPopup from "@/components/LeadPopup";

const Index = () => {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <FilmGrain />
      <Header />
      <HeroSection />
      <AboutSection />
      <VideoSection videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ" />
      <FeaturedFilms />
      <GallerySection />
      <StorySection />
      <ServicesSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
      <FloatingButtons />
      <LeadPopup />
    </div>
  );
};

export default Index;
