import { describe, it, expect } from "vitest";
import { sizedImageUrl } from "@/lib/media";

const OBJECT_URL =
  "https://abc.supabase.co/storage/v1/object/public/bw-media-library/1785-photo.jpg";

describe("sizedImageUrl", () => {
  it("rewrites a storage URL to the transform endpoint", () => {
    const url = new URL(sizedImageUrl(OBJECT_URL, 400));
    expect(url.pathname).toBe("/storage/v1/render/image/public/bw-media-library/1785-photo.jpg");
    expect(url.searchParams.get("width")).toBe("400");
    expect(url.searchParams.get("quality")).toBe("72");
  });

  it("honours an explicit quality", () => {
    const url = new URL(sizedImageUrl(OBJECT_URL, 800, 50));
    expect(url.searchParams.get("quality")).toBe("50");
    expect(url.searchParams.get("width")).toBe("800");
  });

  it("leaves bundled and third-party images alone", () => {
    // Vite asset imports and any external host must pass through untouched,
    // otherwise they would be pointed at a transform endpoint that has no
    // knowledge of them.
    expect(sizedImageUrl("/assets/gallery-1-abc123.jpg", 400)).toBe(
      "/assets/gallery-1-abc123.jpg",
    );
    expect(sizedImageUrl("https://images.example.com/x.jpg", 400)).toBe(
      "https://images.example.com/x.jpg",
    );
  });

  it("returns an empty string for missing values rather than throwing", () => {
    expect(sizedImageUrl(null, 400)).toBe("");
    expect(sizedImageUrl(undefined, 400)).toBe("");
  });

  it("does not lose an existing query string", () => {
    const url = new URL(sizedImageUrl(`${OBJECT_URL}?t=123`, 400));
    expect(url.searchParams.get("t")).toBe("123");
    expect(url.searchParams.get("width")).toBe("400");
  });
});
