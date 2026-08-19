import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import { useState, useCallback, useEffect } from "react";
import Lenis from "lenis";
import Loader from "@/components/Loader";
import Index from "./pages/Index.tsx";
import FilmsPage from "./pages/FilmsPage.tsx";
import GalleryPage from "./pages/GalleryPage.tsx";
import StoriesPage from "./pages/StoriesPage.tsx";
import StoryDetailPage from "./pages/StoryDetailPage.tsx";
import BlogPage from "./pages/BlogPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import LoginPage from "./pages/admin/LoginPage.tsx";
import DashboardPage from "./pages/admin/DashboardPage.tsx";
import StoriesListPage from "./pages/admin/StoriesListPage.tsx";
import StoryEditPage from "./pages/admin/StoryEditPage.tsx";
import BlogListPage from "./pages/admin/BlogListPage.tsx";
import BlogEditPage from "./pages/admin/BlogEditPage.tsx";
import SiteContentPage from "./pages/admin/SiteContentPage.tsx";
import ContactSubmissionsPage from "./pages/admin/ContactSubmissionsPage.tsx";
import MediaLibraryPage from "./pages/admin/MediaLibraryPage.tsx";
import UsersPage from "./pages/admin/UsersPage.tsx";
import TestimonialsListPage from "./pages/admin/TestimonialsListPage.tsx";
import InstagramManagePage from "./pages/admin/InstagramManagePage.tsx";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/films" element={<FilmsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/stories" element={<StoriesPage />} />
        <Route path="/stories/:slug" element={<StoryDetailPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="stories" element={<StoriesListPage />} />
          <Route path="stories/:id" element={<StoryEditPage />} />
          <Route path="blog" element={<BlogListPage />} />
          <Route path="blog/:id" element={<BlogEditPage />} />
          <Route path="site-content" element={<SiteContentPage />} />
          <Route path="contact" element={<ContactSubmissionsPage />} />
          <Route path="media" element={<MediaLibraryPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="testimonials" element={<TestimonialsListPage />} />
          <Route path="instagram" element={<InstagramManagePage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [loading, setLoading] = useState(() => {
    const shown = sessionStorage.getItem("bw-loader-shown");
    return !shown;
  });

  useEffect(() => {
    // Honour the OS "reduce motion" preference: hijacking the scroll wheel is
    // exactly the kind of motion that setting asks us not to do.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Keep the handle so the loop can be cancelled. Without this the callback
    // kept rescheduling itself after teardown, leaving an orphaned rAF loop
    // calling into a destroyed Lenis instance on every frame.
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  const handleComplete = useCallback(() => {
    setLoading(false);
    sessionStorage.setItem("bw-loader-shown", "true");
  }, []);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {loading && <Loader onComplete={handleComplete} />}
          <BrowserRouter>
            <AuthProvider>
              <AnimatedRoutes />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
