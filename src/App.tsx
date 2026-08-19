import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import { useState, useCallback, useEffect, lazy, Suspense } from "react";
import Lenis from "lenis";
import Loader from "@/components/Loader";
import Index from "./pages/Index.tsx";
import FilmsPage from "./pages/FilmsPage.tsx";
import GalleryPage from "./pages/GalleryPage.tsx";
import StoriesPage from "./pages/StoriesPage.tsx";
import StoryDetailPage from "./pages/StoryDetailPage.tsx";
import BlogPage from "./pages/BlogPage.tsx";
import BlogPostPage from "./pages/BlogPostPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import NotFound from "./pages/NotFound.tsx";


// The admin panel carries the rich-text editor and its dependencies. Loading it
// lazily keeps all of that out of the bundle visitors download.
const AdminLayout = lazy(() =>
  import("@/components/admin/AdminLayout").then((m) => ({ default: m.AdminLayout })),
);
const RequireAdmin = lazy(() =>
  import("@/components/admin/RequireAdmin").then((m) => ({ default: m.RequireAdmin })),
);
const LoginPage = lazy(() => import("./pages/admin/LoginPage.tsx"));
const DashboardPage = lazy(() => import("./pages/admin/DashboardPage.tsx"));
const StoriesListPage = lazy(() => import("./pages/admin/StoriesListPage.tsx"));
const StoryEditPage = lazy(() => import("./pages/admin/StoryEditPage.tsx"));
const BlogListPage = lazy(() => import("./pages/admin/BlogListPage.tsx"));
const BlogEditPage = lazy(() => import("./pages/admin/BlogEditPage.tsx"));
const SiteContentPage = lazy(() => import("./pages/admin/SiteContentPage.tsx"));
const ContactSubmissionsPage = lazy(() => import("./pages/admin/ContactSubmissionsPage.tsx"));
const MediaLibraryPage = lazy(() => import("./pages/admin/MediaLibraryPage.tsx"));
const UsersPage = lazy(() => import("./pages/admin/UsersPage.tsx"));
const TestimonialsListPage = lazy(() => import("./pages/admin/TestimonialsListPage.tsx"));
const InstagramManagePage = lazy(() => import("./pages/admin/InstagramManagePage.tsx"));
const HomeMediaPage = lazy(() => import("./pages/admin/HomeMediaPage.tsx"));
const GalleryManagePage = lazy(() => import("./pages/admin/GalleryManagePage.tsx"));
const FilmsManagePage = lazy(() => import("./pages/admin/FilmsManagePage.tsx"));

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
          </div>
        }
      >
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/films" element={<FilmsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/stories" element={<StoriesPage />} />
        <Route path="/stories/:slug" element={<StoryDetailPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
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
          <Route path="home-media" element={<HomeMediaPage />} />
          <Route path="gallery" element={<GalleryManagePage />} />
          <Route path="films" element={<FilmsManagePage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
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
