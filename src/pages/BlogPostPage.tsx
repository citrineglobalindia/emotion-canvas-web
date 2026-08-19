import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilmGrain from "@/components/FilmGrain";
import SmartImage from "@/components/SmartImage";
import RichContent from "@/components/RichContent";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import NotFound from "./NotFound";

type Post = Tables<"bw_blog_posts">;

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })
    : "";

/**
 * Reading page for a Journal post.
 *
 * The Journal previously listed posts with no way to open one, so everything
 * written in the admin panel was invisible to visitors.
 */
const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [more, setMore] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      const { data } = await supabase
        .from("bw_blog_posts")
        .select("*")
        .eq("slug", slug!)
        .eq("published", true)
        .maybeSingle();
      if (!active) return;
      setPost(data ?? null);
      setLoading(false);

      if (data) {
        const { data: others } = await supabase
          .from("bw_blog_posts")
          .select("*")
          .eq("published", true)
          .neq("id", data.id)
          .order("published_at", { ascending: false })
          .limit(2);
        if (active) setMore(others ?? []);
      }
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <PageTransition>
        <FilmGrain />
        <Header />
        <main className="flex min-h-screen items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
        </main>
        <Footer />
      </PageTransition>
    );
  }

  if (!post) return <NotFound />;

  return (
    <PageTransition>
      <FilmGrain />
      <Header />
      <main className="min-h-screen bg-background pt-24">
        <article className="px-6 md:px-10 lg:px-16">
          <div className="mx-auto max-w-3xl">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.24em] text-muted-foreground transition-opacity hover:opacity-70"
            >
              <ArrowLeft size={14} /> Back to journal
            </Link>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mt-8 font-display text-4xl leading-tight text-foreground md:text-6xl"
            >
              {post.title}
            </motion.h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 font-body text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {post.category && (
                <span className="inline-flex items-center gap-1.5">
                  <Tag size={12} /> {post.category}
                </span>
              )}
              {post.published_at && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={12} /> {formatDate(post.published_at)}
                </span>
              )}
              {post.read_time && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={12} /> {post.read_time}
                </span>
              )}
            </div>

            {post.excerpt && (
              <p className="mt-6 font-body text-lg leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
            )}
          </div>

          {post.image_url && (
            <div className="mx-auto mt-10 max-w-5xl">
              <div className="aspect-[16/9] overflow-hidden rounded-2xl">
                <SmartImage
                  src={post.image_url}
                  alt={post.title}
                  width={1400}
                  sizes="(min-width: 1024px) 70vw, 100vw"
                  loading="eager"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="mx-auto mt-12 max-w-3xl pb-8">
            <RichContent
              content={post.content}
              className="prose prose-lg dark:prose-invert max-w-none font-body prose-headings:font-display prose-img:rounded-xl prose-video:rounded-xl"
            />
          </div>
        </article>

        {more.length > 0 && (
          <section className="border-t border-border/60 px-6 py-20 md:px-10 lg:px-16">
            <div className="mx-auto max-w-5xl">
              <h2 className="mb-10 font-display text-3xl text-foreground md:text-4xl">
                More from the journal
              </h2>
              <div className="grid gap-8 md:grid-cols-2">
                {more.map((entry) => (
                  <Link
                    key={entry.id}
                    to={`/blog/${entry.slug}`}
                    className="group border border-border/70 bg-card/30 p-3 transition-colors hover:bg-card/60"
                  >
                    {entry.image_url && (
                      <div className="aspect-[4/3] overflow-hidden">
                        <SmartImage
                          src={entry.image_url}
                          alt={entry.title}
                          width={700}
                          sizes="(min-width: 768px) 50vw, 100vw"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      </div>
                    )}
                    <div className="px-2 py-5">
                      <p className="font-body text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                        {entry.category}
                      </p>
                      <h3 className="mt-3 font-display text-2xl text-foreground">{entry.title}</h3>
                      {entry.excerpt && (
                        <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">
                          {entry.excerpt}
                        </p>
                      )}
                      <span className="mt-5 inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.24em] text-accent">
                        Read <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-14 text-center">
                <Link to="/#contact">
                  <Button variant="accent">
                    Tell Us Your Story <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </PageTransition>
  );
};

export default BlogPostPage;
