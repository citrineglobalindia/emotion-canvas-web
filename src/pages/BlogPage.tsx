import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilmGrain from "@/components/FilmGrain";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";
import blog4 from "@/assets/blog-4.jpg";
import blog5 from "@/assets/blog-5.jpg";
import blog6 from "@/assets/blog-6.jpg";

const fallbackImages: Record<string, string> = {
  "behind-the-lens-cinematic-wedding": blog1,
  "art-of-bridal-mehndi": blog2,
  "top-10-destination-wedding-venues": blog3,
  "golden-hour-magic-couple-portraits": blog4,
  "raw-footage-to-final-film": blog5,
  "dream-reception-decor-ideas": blog6,
};
const defaultImage = blog1;

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  category: string;
  read_time: string | null;
  published_at: string | null;
}

const categories = ["All", "Behind the Scenes", "Photography Tips", "Inspiration", "Planning Tips"];

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("bw_blog_posts")
        .select("id, title, slug, excerpt, image_url, category, read_time, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (data) setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const getImage = (post: BlogPost) => post.image_url || fallbackImages[post.slug] || defaultImage;
  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "";

  const filtered = activeCategory === "All" ? posts : posts.filter(p => p.category === activeCategory);
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <PageTransition>
      <FilmGrain />
      <Header />
      <PageHero
        eyebrow="Insights &amp; Inspiration"
        title="Journal"
        tagline="Tips, stories, and behind-the-scenes from the world of cinematic wedding filmmaking."
        image={[blog3, blog4, blog6]}
      />
      <div className="min-h-screen pt-16 md:pt-24 pb-0">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 px-6 mb-16">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`font-body text-sm px-5 py-2 rounded-full border transition-all duration-300 ${activeCategory === cat ? "bg-accent text-accent-foreground border-accent" : "border-border text-muted-foreground hover:border-accent hover:text-accent"}`}>
              {cat}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center font-body text-muted-foreground py-20">No posts found.</p>
        ) : (
          <>
            {featured && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }}
                className="px-6 md:px-10 mb-20">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 bg-card rounded-3xl overflow-hidden border border-border shadow-lg hover:shadow-xl transition-shadow duration-500 group cursor-pointer">
                  <div className="relative overflow-hidden">
                    <img src={getImage(featured)} alt={featured.title}
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
                      <span className="flex items-center gap-1.5"><Calendar size={12} /> {formatDate(featured.published_at)}</span>
                      <span className="flex items-center gap-1.5"><Clock size={12} /> {featured.read_time}</span>
                    </div>
                    <Button variant="accent" className="w-fit">Read Article <ArrowRight size={14} /></Button>
                  </div>
                </div>
              </motion.div>
            )}

            {rest.length > 0 && (
              <div className="px-6 md:px-10 mb-20">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {rest.map((post, i) => (
                    <motion.article key={post.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                      className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg hover:border-accent/30 transition-all duration-500 group cursor-pointer">
                      <div className="relative overflow-hidden aspect-[4/3]">
                        <img src={getImage(post)} alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center gap-1 bg-background/90 backdrop-blur-sm text-foreground px-2.5 py-1 rounded-full font-body text-[10px] font-medium">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 text-muted-foreground font-body text-[11px] mb-3">
                          <span className="flex items-center gap-1"><Calendar size={10} /> {formatDate(post.published_at)}</span>
                          <span className="flex items-center gap-1"><Clock size={10} /> {post.read_time}</span>
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
            )}
          </>
        )}

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
