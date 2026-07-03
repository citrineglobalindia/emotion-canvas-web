import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, FileText, Mail, Image as ImageIcon, Layout as LayoutIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";

type Counts = {
  stories: number | null;
  publishedStories: number | null;
  blog: number | null;
  publishedBlog: number | null;
  newContacts: number | null;
  totalContacts: number | null;
  media: number | null;
  siteContent: number | null;
};

const initial: Counts = {
  stories: null,
  publishedStories: null,
  blog: null,
  publishedBlog: null,
  newContacts: null,
  totalContacts: null,
  media: null,
  siteContent: null,
};

const DashboardPage = () => {
  const [counts, setCounts] = useState<Counts>(initial);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [stories, publishedStories, blog, publishedBlog, newContacts, totalContacts, media, siteContent] =
        await Promise.all([
          supabase.from("bw_stories").select("*", { count: "exact", head: true }),
          supabase.from("bw_stories").select("*", { count: "exact", head: true }).eq("published", true),
          supabase.from("bw_blog_posts").select("*", { count: "exact", head: true }),
          supabase.from("bw_blog_posts").select("*", { count: "exact", head: true }).eq("published", true),
          supabase.from("bw_contact_submissions").select("*", { count: "exact", head: true }).eq("status", "new"),
          supabase.from("bw_contact_submissions").select("*", { count: "exact", head: true }),
          supabase.from("bw_media_assets").select("*", { count: "exact", head: true }),
          supabase.from("bw_site_content").select("*", { count: "exact", head: true }),
        ]);
      setCounts({
        stories: stories.count ?? 0,
        publishedStories: publishedStories.count ?? 0,
        blog: blog.count ?? 0,
        publishedBlog: publishedBlog.count ?? 0,
        newContacts: newContacts.count ?? 0,
        totalContacts: totalContacts.count ?? 0,
        media: media.count ?? 0,
        siteContent: siteContent.count ?? 0,
      });
      setLoading(false);
    };
    void load();
  }, []);

  const cards = [
    {
      title: "Stories",
      icon: Film,
      to: "/admin/stories",
      primary: counts.stories,
      detail: `${counts.publishedStories ?? 0} published`,
    },
    {
      title: "Blog posts",
      icon: FileText,
      to: "/admin/blog",
      primary: counts.blog,
      detail: `${counts.publishedBlog ?? 0} published`,
    },
    {
      title: "New messages",
      icon: Mail,
      to: "/admin/contact",
      primary: counts.newContacts,
      detail: `${counts.totalContacts ?? 0} total`,
    },
    {
      title: "Media assets",
      icon: ImageIcon,
      to: "/admin/media",
      primary: counts.media,
      detail: "in media library",
    },
    {
      title: "Site sections",
      icon: LayoutIcon,
      to: "/admin/site-content",
      primary: counts.siteContent,
      detail: "configured blocks",
    },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of content and inbox activity." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.title} to={c.to} className="group">
              <Card className="transition-shadow group-hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{c.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="text-3xl font-semibold">{c.primary ?? 0}</div>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">{c.detail}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;
