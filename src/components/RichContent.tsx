import { useMemo } from "react";
import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";

/**
 * Renders article content written in the admin panel.
 *
 * Posts written before the visual editor existed are markdown; everything since
 * is HTML. Rather than migrate the old rows and risk mangling them, the format
 * is detected per post and rendered accordingly.
 *
 * The HTML is sanitised on the way out. Only admins can write it, but that is
 * an argument for defence in depth, not against it: an account compromise
 * should not turn every article into a script injection.
 */

const looksLikeHtml = (content: string) => /<\/?(p|h[1-6]|ul|ol|li|img|video|iframe|blockquote|strong|em|a|hr|br)\b/i.test(content);

const SANITISE_CONFIG = {
  ALLOWED_TAGS: [
    "p", "br", "hr", "strong", "em", "u", "s", "code", "pre", "blockquote",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li", "a", "img", "video", "source", "iframe", "figure", "figcaption",
    "div", "span",
  ],
  ALLOWED_ATTR: [
    "href", "target", "rel", "src", "alt", "title", "width", "height",
    "controls", "preload", "poster", "loading", "class", "style",
    "allow", "allowfullscreen", "frameborder",
  ],
  ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|\/|#)/i,
};

export const RichContent = ({
  content,
  className = "prose prose-lg dark:prose-invert max-w-none",
}: {
  content: string | null | undefined;
  className?: string;
}) => {
  const html = useMemo(() => {
    if (!content?.trim() || !looksLikeHtml(content)) return null;
    return DOMPurify.sanitize(content, SANITISE_CONFIG);
  }, [content]);

  if (!content?.trim()) return null;

  if (html !== null) {
    return (
      <div
        className={className}
        // Sanitised immediately above; markdown posts never reach this branch.
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div className={className}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default RichContent;
