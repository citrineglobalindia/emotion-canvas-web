import story1 from "@/assets/story-1.jpg";
import story2 from "@/assets/story-2.jpg";
import film1 from "@/assets/film-1.jpg";
import film2 from "@/assets/film-2.jpg";
import film3 from "@/assets/film-3.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import photo1 from "@/assets/photo-1.jpg";
import photo2 from "@/assets/photo-2.jpg";
import photo3 from "@/assets/photo-3.jpg";
import photo4 from "@/assets/photo-4.jpg";
import photo5 from "@/assets/photo-5.jpg";
import photo6 from "@/assets/photo-6.jpg";

export const stories = [
  {
    slug: "the-palace-affair",
    image: story1,
    title: "The Palace Affair",
    couple: "Priya & Arjun",
    excerpt:
      "A royal love story set against the golden corridors of a Rajasthani palace. Every glance, every touch — preserved in cinematic glory.",
    location: "Udaipur, Rajasthan",
    year: "2024",
    duration: "7 minute film",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    intro:
      "A celebration steeped in heritage and candlelit romance, where every frame moved between quiet intimacy and grand architecture.",
    gallery: [story1, gallery1, photo1, gallery2, photo2, film2],
    moments: [
      {
        title: "The morning hush",
        body:
          "We began with stillness: embroidered details laid out by the window, handwritten vows, and the soft rhythm of preparation echoing through the suites.",
      },
      {
        title: "Ceremony in gold light",
        body:
          "As the sun lowered over the palace stone, the ceremony unfolded with warmth, texture, and a feeling of time stretching just enough for every emotion to land.",
      },
      {
        title: "A night that lingered",
        body:
          "The final sequences leaned into movement and atmosphere — music, laughter, and a dance floor that felt less like an event and more like a memory being written live.",
      },
    ],
  },
  {
    slug: "through-the-door",
    image: story2,
    title: "Through the Door",
    couple: "Sarah & Michael",
    excerpt:
      "Two souls stepping into a new chapter. A sunset wedding bathed in golden light, where time seemed to stand still.",
    location: "Tuscany, Italy",
    year: "2023",
    duration: "6 minute film",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    intro:
      "Set among cypress lines and stone villas, this story was built around gentle pacing, quiet anticipation, and the romance of place.",
    gallery: [story2, photo3, gallery3, film3, photo4, gallery4],
    moments: [
      {
        title: "Letters before first light",
        body:
          "There was an almost novel-like calm to the morning — reading letters apart, getting ready in separate rooms, and letting the day reveal itself slowly.",
      },
      {
        title: "A walk into forever",
        body:
          "The ceremony felt suspended in amber. Warm wind, long shadows, and an aisle that carried both of them into something tender and enduring.",
      },
      {
        title: "Dinner under the sky",
        body:
          "The closing chapter turned to atmosphere: table candles, layered speeches, and movement that felt almost painterly against the Tuscan evening.",
      },
    ],
  },
  {
    slug: "shores-of-forever",
    image: film1,
    title: "Shores of Forever",
    couple: "Aisha & Ravi",
    excerpt:
      "The traditions witnessed their vows. A colorful ceremony surrounded by love, where families became one.",
    location: "Kerala, India",
    year: "2024",
    duration: "8 minute film",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    intro:
      "Rooted in family, ritual, and coastal light, this wedding unfolded with rich color, layered sound, and deeply emotional exchanges.",
    gallery: [film1, gallery5, photo5, gallery6, photo6, film2],
    moments: [
      {
        title: "Tradition in motion",
        body:
          "From the first rituals onward, every scene was shaped by rhythm — gestures passed down through generations and a palpable sense of reverence.",
      },
      {
        title: "Family at the center",
        body:
          "The heart of this film lives in reactions: parents watching closely, cousins filling the edges of every frame, and joy spilling across every transition.",
      },
      {
        title: "Sea air and celebration",
        body:
          "We closed on softness and scale — shoreline portraits, layered fabrics in the breeze, and a final celebration that felt expansive and deeply personal.",
      },
    ],
  },
] as const;

export type Story = (typeof stories)[number];