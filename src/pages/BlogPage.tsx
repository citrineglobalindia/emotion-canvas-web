import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilmGrain from "@/components/FilmGrain";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";
import blog4 from "@/assets/blog-4.jpg";
import blog5 from "@/assets/blog-5.jpg";
import blog6 from "@/assets/blog-6.jpg";

const blogPosts = [
  {
    image: blog1,
    title: "Behind the Lens: What Goes Into Filming a Cinematic Wedding",
    excerpt: "From equipment selection to creative decisions, discover the artistry and planning that transforms a wedding day into a cinematic masterpiece.",
    date: "March 10, 2026",
    readTime: "5 min read",
    category: "Behind the Scenes",
    featured: true,
  },
  {
    image: blog2,
    title: "The Art of Bridal Mehndi: Capturing Intricate Details",
    excerpt: "How we photograph the delicate beauty of henna art, preserving every curve and pattern in stunning detail.",
    date: "February 28, 2026",
    readTime: "4 min read",
    category: "Photography Tips",
  },
  {
    image: blog3,
    title: "Top 10 Destination Wedding Venues in India",
    excerpt: "From beachfront mandaps in Goa to royal palaces in Rajasthan — our favorite locations for unforgettable celebrations.",
    date: "February 15, 2026",
    readTime: "7 min read",
    category: "Inspiration",
  },
  {
    image: blog4,
    title: "Golden Hour Magic: Tips for Perfect Couple Portraits",
    excerpt: "Learn why we chase the golden hour and how the right light transforms ordinary moments into extraordinary memories.",
    date: "January 30, 2026",
    readTime: "4 min read",
    category: "Photography Tips",
  },
  {
    image: blog5,
    title: "From Raw Footage to Final Film: Our Editing Process",
    excerpt: "A deep dive into how we craft emotional wedding films — from color grading to soundtrack selection and pacing.",
    date: "January 18, 2026",
    readTime: "6 min read",
    category: "Behind the Scenes",
  },
  {
    image: blog6,
    title: "Planning Your Dream Reception: Décor Ideas That Shine on Camera",
    excerpt: "Wedding décor that looks amazing in person AND on film. Our top recommendations for couples who want it all.",
    date: "January 5, 2026",
    readTime: "5 min read",
    category: "Planning Tips",
  },
];

const categories = ["All", "Behind the Scenes", "Photography Tips", "Inspiration", "Planning Tips"];

const BlogPage = () => {
  const featured = blogPosts[0];
  const rest = blogPosts.slice(1);

  return (
    <PageTransition>
      <FilmGrain />
      <Header />
      <div className="min-h-screen pt-28 pb-0">
        {/* Header */}
        <div className="px-6 md:px-10 mb-12 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6">
            <BookOpen size={14} />
            <span className="font-body text-xs font-medium uppercase tracking-wider">Insights & Inspiration</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="font-display text-4xl md:text-6xl text-foreground mb-4">Our <em className="text-accent">Blog</em></motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="font-body text-muted-foreground max-w-xl mx-auto">
            Tips, stories, and behind-the-scenes from the world of cinematic wedding filmmaking.
          </motion.p>
        </div>

        {/* Category pills */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="flex flex-wrap justify-center gap-3 px-6 mb-16">
          {categories.map((cat, i) => (
            <button key={cat}
              className={`font-body text-sm px-5 py-2 rounded-full border transition-all duration-300 ${i === 0 ? "bg-accent text-accent-foreground border-accent" : "border-border text-muted-foreground hover:border-accent hover:text-accent"}`}>
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Featured post */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }}
          className="px-6 md:px-10 mb-20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 bg-card rounded-3xl overflow-hidden border border-border shadow-lg hover:shadow-xl transition-shadow duration-500 group cursor-pointer">
            <div className="relative overflow-hidden">
              <img src={featured.image} alt={featured.title}
                className="w-full h-full object-cover min-h-[300px] lg:min-h-[450px] group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground px-3 py-1.5 rounded-full font-body text-[10px] font-medium uppercase tracking-wider">
                  <Tag size={10} /> Featured
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
              <span className="inline-flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1.5 rounded-full w-fit mb-5 font-body text-[10px] font-medium uppercase tracking-wider">
                {featured.category}
              </span>
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground mb-4 leading-tight group-hover:text-accent transition-colors duration-300">
                {featured.title}
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed mb-6">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-muted-foreground font-body text-xs mb-8">
                <span className="flex items-center gap-1.5"><Calendar size={12} /> {featured.date}</span>
                <span className="flex items-center gap-1.5"><Clock size={12} /> {featured.readTime}</span>
              </div>
              <Button variant="accent" className="w-fit">Read Article <ArrowRight size={14} /></Button>
            </div>
          </div>
        </motion.div>

        {/* Blog grid */}
        <div className="px-6 md:px-10 mb-20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((post, i) => (
              <motion.article key={post.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg hover:border-accent/30 transition-all duration-500 group cursor-pointer">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img src={post.image} alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 bg-background/90 backdrop-blur-sm text-foreground px-2.5 py-1 rounded-full font-body text-[10px] font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-muted-foreground font-body text-[11px] mb-3">
                    <span className="flex items-center gap-1"><Calendar size={10} /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {post.readTime}</span>
                  </div>
                  <h3 className="font-display text-xl text-foreground mb-3 leading-snug group-hover:text-accent transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-3">{post.excerpt}</p>
                  <div className="mt-5 flex items-center gap-1 text-accent font-body text-sm font-medium group-hover:gap-2 transition-all duration-300">
                    Read More <ArrowRight size={14} />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-accent/5" />
          <div className="relative z-10 text-center px-6">
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-display text-3xl md:text-5xl text-foreground leading-tight mb-4">
              Want your story<br /><em className="text-accent">on our blog?</em>
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
              className="font-body text-muted-foreground max-w-md mx-auto mb-8">
              Let us capture your celebration and share the magic with the world.
            </motion.p>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
              <Link to="/#contact"><Button variant="accent">Get In Touch <ArrowRight size={16} /></Button></Link>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </PageTransition>
  );
};

export default BlogPage;
