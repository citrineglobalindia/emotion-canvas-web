import { describe, it, expect } from "vitest";
import { isPlayableFile, toEmbedUrl } from "@/lib/videoEmbed";

describe("toEmbedUrl", () => {
  it("converts a normal YouTube watch link (the one admins actually paste)", () => {
    // Watch pages refuse to load in an iframe — visitors saw
    // "www.youtube.com refused to connect".
    const out = toEmbedUrl("https://www.youtube.com/watch?v=abc123XYZ_-", { autoplay: true });
    expect(out).toContain("youtube-nocookie.com/embed/abc123XYZ_-");
    expect(out).toContain("autoplay=1");
    expect(out).toContain("rel=0");
  });

  it("converts youtu.be short links and Shorts", () => {
    expect(toEmbedUrl("https://youtu.be/abc123")).toContain("/embed/abc123");
    expect(toEmbedUrl("https://www.youtube.com/shorts/xyz789")).toContain("/embed/xyz789");
  });

  it("keeps a start time from the pasted link", () => {
    const out = toEmbedUrl("https://www.youtube.com/watch?v=abc&t=90");
    expect(out).toContain("start=90");
  });

  it("leaves already-correct embed links working", () => {
    const out = toEmbedUrl("https://www.youtube.com/embed/abc123", { autoplay: true });
    expect(out).toContain("/embed/abc123");
    expect(out).toContain("autoplay=1");
  });

  it("converts vimeo page links to the player", () => {
    expect(toEmbedUrl("https://vimeo.com/76979871")).toBe("https://player.vimeo.com/video/76979871");
    expect(toEmbedUrl("https://player.vimeo.com/video/76979871")).toBe(
      "https://player.vimeo.com/video/76979871",
    );
  });

  it("appends options safely to unknown providers instead of blind ?autoplay", () => {
    const out = toEmbedUrl("https://example.com/player?id=5", { autoplay: true });
    expect(out).toBe("https://example.com/player?id=5&autoplay=1");
  });

  it("returns non-URLs untouched", () => {
    expect(toEmbedUrl("not a url")).toBe("not a url");
  });
});

describe("isPlayableFile", () => {
  it("recognises uploaded and local video files", () => {
    expect(isPlayableFile("/films/reel-1.mp4")).toBe(true);
    expect(isPlayableFile("https://x.supabase.co/storage/v1/object/public/b/film.mp4")).toBe(true);
    expect(isPlayableFile("https://www.youtube.com/watch?v=abc")).toBe(false);
  });
});
