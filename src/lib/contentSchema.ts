/**
 * The catalogue of editable sections on the public site.
 *
 * This is the contract between the admin panel and the website. Admin → Site
 * content renders this schema (friendly labels, only the fields a section
 * actually uses, an image picker where an image is expected) instead of asking
 * an admin to invent `page_key` / `section_key` strings, and each public
 * component reads its section through the same keys. Adding a new editable
 * section means adding an entry here and calling `useSection` with it — the
 * admin UI updates itself.
 *
 * `defaults` holds the copy the site shipped with. It serves two purposes: it
 * is the fallback a component renders when the section has no row yet, and it
 * pre-fills the form when an admin creates that section, so they edit real
 * copy instead of an empty box.
 */
import type { SectionFallback } from "@/lib/siteContent";

export type FieldName = "heading" | "subheading" | "body" | "image_url" | "cta_label" | "cta_href";

export type FieldDef = {
  name: FieldName;
  label: string;
  /** `image` renders the media-library picker; `textarea` a multi-line box. */
  type?: "text" | "textarea" | "image" | "url";
  help?: string;
};

export type MetaFieldDef = {
  name: string;
  label: string;
  type?: "text" | "url";
  help?: string;
};

export type SectionDef = {
  key: string;
  label: string;
  help?: string;
  fields: FieldDef[];
  /** Extra values stored in the block's JSON `metadata` column. */
  meta?: MetaFieldDef[];
  /** A repeating section: many rows share this key, ordered by `sort_order`. */
  list?: boolean;
  defaults?: SectionFallback & { meta?: Record<string, string> };
};

export type PageDef = {
  key: string;
  label: string;
  help?: string;
  sections: SectionDef[];
};

const HEADING: FieldDef = { name: "heading", label: "Heading" };
const EYEBROW: FieldDef = {
  name: "subheading",
  label: "Eyebrow",
  help: "Small uppercase line above the heading.",
};
const BODY: FieldDef = {
  name: "body",
  label: "Body",
  type: "textarea",
  help: "Leave a blank line between paragraphs to split them.",
};
const IMAGE: FieldDef = { name: "image_url", label: "Image", type: "image" };
const CTA: FieldDef[] = [
  { name: "cta_label", label: "Button label" },
  { name: "cta_href", label: "Button link", type: "url" },
];

export const CONTENT_SCHEMA: PageDef[] = [
  {
    key: "site",
    label: "Global",
    help: "Shown across every page — header, footer and contact blocks.",
    sections: [
      {
        key: "settings",
        label: "Demo content",
        help: "The design ships with sample photographs, stories and quotes that fill any section you have not populated yet. Set this to \u201chidden\u201d once you have added your own, so empty sections stay empty instead of showing samples.",
        fields: [],
        meta: [
          {
            name: "demo_content",
            label: "Sample content",
            help: 'Type "hidden" to switch the built-in samples off everywhere, or "shown" to allow them.',
          },
        ],
        defaults: { meta: { demo_content: "shown" } },
      },
      {
        key: "contact-details",
        label: "Contact details",
        help: "Studio email, phone and address used by the header, footer and contact page.",
        fields: [],
        meta: [
          { name: "email", label: "Email address" },
          { name: "phone_display", label: "Phone (as displayed)" },
          { name: "phone_href", label: "Phone (dial link)", help: "e.g. tel:+919686580152" },
          { name: "location_label", label: "Short location label" },
          { name: "address_full", label: "Full address" },
          { name: "maps_url", label: "Google Maps link", type: "url" },
          { name: "instagram_url", label: "Instagram URL", type: "url" },
          { name: "instagram_handle", label: "Instagram handle" },
        ],
      },
    ],
  },
  {
    key: "home",
    label: "Home page",
    sections: [
      {
        key: "hero",
        label: "Hero",
        help: "Full-screen video header. The video files themselves live in /public/films.",
        fields: [
          EYEBROW,
          { name: "body", label: "Stacked words", type: "textarea", help: "One word per line." },
        ],
        meta: [
          { name: "video_desktop", label: "Desktop video path" },
          { name: "video_mobile", label: "Mobile video path" },
          { name: "poster_desktop", label: "Desktop poster image" },
          { name: "poster_mobile", label: "Mobile poster image" },
        ],
        defaults: {
          subheading: "Cinematic Wedding Films",
          body: "stories\nmoments\nframes",
          meta: {
            video_desktop: "/films/reel-1.mp4",
            video_mobile: "/films/reel-mobile.mp4",
            poster_desktop: "/films/reel-1.jpg",
            poster_mobile: "/films/reel-mobile.jpg",
          },
        },
      },
      {
        key: "bio",
        label: "About strip",
        fields: [EYEBROW, HEADING, BODY],
        defaults: {
          subheading: "About Us",
          heading: "a *Unique* take on\nFine Art Documentary\nWedding Photography & Films",
          body: "At Black & White Films, we believe every love story deserves to be told with depth, artistry, and soul. We blend cinematic storytelling with fine art sensibility to create timeless visual narratives that you'll treasure for generations.",
        },
      },
      {
        key: "films-intro",
        label: "Films grid heading",
        fields: [EYEBROW, HEADING],
        defaults: {
          subheading: "Our Films",
          heading: "every frame tells a *story*",
        },
      },
      {
        key: "film",
        label: "Films grid items",
        help: "The video tiles on the home page. Manage these in Admin → Home page, where you can upload the video itself.",
        list: true,
        fields: [
          { name: "heading", label: "Title" },
          { name: "subheading", label: "Location" },
          IMAGE,
          {
            name: "cta_href",
            label: "Video",
            type: "url",
            help: "An uploaded video's address, or a YouTube/Vimeo embed link.",
          },
        ],
        meta: [{ name: "portrait", label: "Portrait reel? (true/false)" }],
      },
      {
        key: "photo",
        label: "Photo strip",
        help: "The full-width band of photographs below the parallax banner. Manage these in Admin → Home page.",
        list: true,
        fields: [IMAGE, { name: "heading", label: "Description (for screen readers)" }],
      },
      {
        key: "defines-us",
        label: "What defines us",
        fields: [HEADING, BODY],
        defaults: {
          heading: "What *defines* us ?",
          body: "Photographs are more than still frames—they're whispers of time, fragments of joy, love, and laughter etched in light. At the heart of what we do is a deep love for storytelling—honest, cinematic, soulful. We become part of your journey, part of your family.\n\nOur goal is to create wedding photos and films that feel *Artful, Real and Timeless* so that when you're sitting together years from now, you'll relive the magic all over again.",
        },
      },
      {
        key: "magic",
        label: "Parallax banner",
        fields: [HEADING, IMAGE],
        defaults: { heading: "this is where the\n*Magic* happens." },
      },
      {
        key: "testimonials-intro",
        label: "Testimonials heading",
        help: "The quotes themselves are managed in Admin → Testimonials.",
        fields: [EYEBROW, HEADING, BODY],
        defaults: {
          subheading: "Testimonials",
          heading: "Our Client's Say",
          body: "Every couple, every celebration — here's what they say about their films and frames.",
        },
      },
      {
        key: "instagram",
        label: "Instagram strip",
        help: "Managed from Admin → Instagram. Each row is one tile.",
        list: true,
        fields: [IMAGE, { name: "cta_href", label: "Post link", type: "url" }],
      },
      {
        key: "instagram-intro",
        label: "Instagram heading",
        fields: [EYEBROW, HEADING, { name: "cta_href", label: "Profile link", type: "url" }],
        defaults: {
          subheading: "Follow Along",
          heading: "@storiesby_black_and_white",
        },
      },
    ],
  },
  {
    key: "films",
    label: "Films page",
    sections: [
      {
        key: "hero",
        label: "Page hero",
        fields: [EYEBROW, HEADING, BODY],
        defaults: {
          subheading: "Visual Storytelling",
          heading: "Films",
          body: "Every film is a love letter — a cinematic journey through the most meaningful day of your life.",
        },
      },
      {
        key: "film",
        label: "Films",
        help: "Every film shown on the Films page. Category becomes a filter button.",
        list: true,
        fields: [
          { name: "heading", label: "Title" },
          { name: "subheading", label: "Subtitle" },
          IMAGE,
          { name: "cta_label", label: "Category" },
          { name: "cta_href", label: "Film link", type: "url" },
        ],
      },
    ],
  },
  {
    key: "gallery",
    label: "Gallery page",
    sections: [
      {
        key: "hero",
        label: "Page hero",
        fields: [EYEBROW, HEADING, BODY],
        defaults: {
          subheading: "Portfolio",
          heading: "Gallery",
          body: "A curated collection of our most treasured frames — each one a story frozen in time.",
        },
      },
    ],
  },
  {
    key: "stories",
    label: "Stories page",
    sections: [
      {
        key: "hero",
        label: "Page hero",
        fields: [EYEBROW, HEADING, BODY],
        defaults: {
          subheading: "Curated Wedding Stories",
          heading: "Stories",
          body: "Real couples. Real moments. Each chapter shaped by the people who lived it.",
        },
      },
    ],
  },
  {
    key: "blog",
    label: "Blog page",
    sections: [
      {
        key: "hero",
        label: "Page hero",
        fields: [EYEBROW, HEADING, BODY],
        defaults: {
          subheading: "Insights & Inspiration",
          heading: "Journal",
          body: "Tips, stories, and behind-the-scenes from the world of cinematic wedding filmmaking.",
        },
      },
    ],
  },
  {
    key: "about",
    label: "About page",
    sections: [
      {
        key: "hero",
        label: "Page hero",
        fields: [EYEBROW, HEADING, BODY],
        defaults: {
          subheading: "Who We Are",
          heading: "The Studio",
          body: "A small, devoted team of filmmakers and photographers crafting cinematic wedding stories.",
        },
      },
      {
        key: "story",
        label: "Our story",
        fields: [EYEBROW, HEADING, BODY, IMAGE],
        defaults: {
          subheading: "Our Story",
          heading: "We are storytellers *of emotion.*",
          body: "Stories by B&W was born from a simple belief: that love deserves to be captured in its most vibrant, authentic form.\n\nOur approach is rooted in cinematic storytelling — drawing from fine art, editorial fashion, and independent cinema. We craft visual narratives that resonate with the soul.\n\nFrom intimate elopements to grand celebrations across the globe, every project is treated as a masterpiece in the making.",
        },
      },
      {
        key: "stat",
        label: "Stat tiles",
        list: true,
        fields: [
          { name: "heading", label: "Value", help: "e.g. 200+" },
          { name: "subheading", label: "Label", help: "e.g. Films Crafted" },
        ],
        meta: [
          { name: "icon", label: "Icon", help: "One of: film, heart, globe, award" },
        ],
      },
      {
        key: "cta",
        label: "Closing banner",
        fields: [HEADING, IMAGE, ...CTA],
        defaults: {
          heading:
            "Each frame is crafted with intention.\n*Each story is told with authenticity.*",
          ctaLabel: "Work With Us",
          ctaHref: "/#contact",
        },
      },
    ],
  },
  {
    key: "contact",
    label: "Contact page",
    sections: [
      {
        key: "hero",
        label: "Page hero",
        fields: [EYEBROW, HEADING, BODY],
        defaults: {
          subheading: "Begin Your Story",
          heading: "Get in Touch",
          body: "Tell us a little about your day — the date, the place, the people. We'll take it from there.",
        },
      },
    ],
  },
];

const index = new Map<string, SectionDef>();
for (const page of CONTENT_SCHEMA) {
  for (const section of page.sections) index.set(`${page.key}.${section.key}`, section);
}

export const findSectionDef = (pageKey: string, sectionKey: string) =>
  index.get(`${pageKey}.${sectionKey}`);

/**
 * The site's original copy for a section, used as the render-time fallback.
 * Components pass this to `useSection` so the page looks identical until an
 * admin overrides it.
 */
export const defaultsFor = (pageKey: string, sectionKey: string): SectionFallback => {
  const def = index.get(`${pageKey}.${sectionKey}`);
  if (!def?.defaults) return {};
  const { meta: _meta, ...rest } = def.defaults;
  return rest;
};

export const metaDefaultsFor = (pageKey: string, sectionKey: string): Record<string, string> =>
  index.get(`${pageKey}.${sectionKey}`)?.defaults?.meta ?? {};

export const isListSection = (pageKey: string, sectionKey: string) =>
  Boolean(index.get(`${pageKey}.${sectionKey}`)?.list);
