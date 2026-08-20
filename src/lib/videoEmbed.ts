/**
 * Normalise a video link into a form that actually plays on the site.
 *
 * Admins paste whatever the address bar shows — youtube.com/watch?v=…,
 * youtu.be/…, a Shorts link, vimeo.com/… — but YouTube and Vimeo forbid
 * embedding those page URLs in an iframe (the visitor sees "refused to
 * connect"). Only the dedicated embed endpoints work. Rather than requiring
 * admins to know that, every player converts the link at render time.
 */

/** A file we can play directly in a <video> tag. */
export const isPlayableFile = (href: string) =>
  href.startsWith("/") || /\.(mp4|webm|mov)(\?|$)/i.test(href);

const YOUTUBE_HOSTS = ["youtube.com", "www.youtube.com", "m.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"];

const youtubeId = (url: URL): string | null => {
  if (url.hostname === "youtu.be") return url.pathname.slice(1).split("/")[0] || null;
  if (!YOUTUBE_HOSTS.includes(url.hostname)) return null;
  if (url.pathname === "/watch") return url.searchParams.get("v");
  const m = url.pathname.match(/^\/(embed|shorts|live|v)\/([^/?]+)/);
  return m ? m[2] : null;
};

const vimeoId = (url: URL): string | null => {
  if (url.hostname === "player.vimeo.com") {
    const m = url.pathname.match(/^\/video\/(\d+)/);
    return m ? m[1] : null;
  }
  if (url.hostname === "vimeo.com" || url.hostname === "www.vimeo.com") {
    const m = url.pathname.match(/^\/(\d+)/);
    return m ? m[1] : null;
  }
  return null;
};

export type EmbedOptions = { autoplay?: boolean };

/**
 * The URL to put in the player iframe. YouTube and Vimeo links are converted
 * to their embed endpoints; anything else is returned with the requested
 * options appended safely (no more blind `?autoplay=1` on URLs that already
 * have a query string).
 */
export const toEmbedUrl = (href: string, options: EmbedOptions = {}): string => {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return href;
  }

  const yt = youtubeId(url);
  if (yt) {
    const out = new URL(`https://www.youtube-nocookie.com/embed/${yt}`);
    out.searchParams.set("rel", "0");
    if (options.autoplay) out.searchParams.set("autoplay", "1");
    // Keep a start time if the pasted link carried one.
    const t = url.searchParams.get("t") ?? url.searchParams.get("start");
    if (t) out.searchParams.set("start", String(parseInt(t, 10) || 0));
    return out.toString();
  }

  const vm = vimeoId(url);
  if (vm) {
    const out = new URL(`https://player.vimeo.com/video/${vm}`);
    if (options.autoplay) out.searchParams.set("autoplay", "1");
    return out.toString();
  }

  if (options.autoplay) url.searchParams.set("autoplay", "1");
  return url.toString();
};
