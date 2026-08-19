import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

/**
 * These tests pin down the behaviour the site depends on: admin content wins,
 * but a missing or blank field must fall back to the design's own copy rather
 * than rendering an empty page.
 */

type Row = Record<string, unknown>;
let rows: Row[] = [];

vi.mock("@/integrations/supabase/client", () => {
  const build = () => {
    const chain: Record<string, unknown> = {};
    for (const method of ["select", "eq", "in", "order"]) {
      chain[method] = () => chain;
    }
    chain.then = (resolve: (v: { data: Row[]; error: null }) => unknown) =>
      resolve({ data: rows, error: null });
    return chain;
  };
  return {
    supabase: {
      from: () => build(),
      storage: { from: () => ({ getPublicUrl: (p: string) => ({ data: { publicUrl: `https://cdn.test/${p}` } }) }) },
    },
  };
});

const { useSection, useSectionList, metaString } = await import("@/lib/siteContent");
const { categoriesOf, toMediaItem } = await import("@/lib/media");

const wrapper = ({ children }: { children: ReactNode }) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

const Probe = () => {
  const s = useSection("home", "bio", {
    heading: "fallback heading",
    body: "fallback body",
    image: "fallback.jpg",
  });
  return (
    <div>
      <span data-testid="heading">{s.heading}</span>
      <span data-testid="body">{s.body}</span>
      <span data-testid="image">{s.image}</span>
      <span data-testid="managed">{String(s.managed)}</span>
      <span data-testid="meta">{metaString(s, "icon", "none")}</span>
    </div>
  );
};

beforeEach(() => {
  rows = [];
});

describe("useSection", () => {
  it("renders the design's copy when the database has no row", async () => {
    render(<Probe />, { wrapper });
    await waitFor(() => expect(screen.getByTestId("managed")).toHaveTextContent("false"));
    expect(screen.getByTestId("heading")).toHaveTextContent("fallback heading");
    expect(screen.getByTestId("body")).toHaveTextContent("fallback body");
  });

  it("prefers admin content when a row exists", async () => {
    rows = [
      {
        id: "1",
        page_key: "home",
        section_key: "bio",
        heading: "admin heading",
        subheading: null,
        body: null,
        image_url: "  ",
        cta_label: null,
        cta_href: null,
        metadata: { icon: "film" },
        published: true,
        sort_order: 0,
      },
    ];
    render(<Probe />, { wrapper });
    await waitFor(() => expect(screen.getByTestId("heading")).toHaveTextContent("admin heading"));

    // Null and whitespace-only fields must not blank out the section.
    expect(screen.getByTestId("body")).toHaveTextContent("fallback body");
    expect(screen.getByTestId("image")).toHaveTextContent("fallback.jpg");
    expect(screen.getByTestId("managed")).toHaveTextContent("true");
    expect(screen.getByTestId("meta")).toHaveTextContent("film");
  });
});

const ListProbe = () => {
  const { items, managed } = useSectionList<string>(
    "home",
    "film",
    ["built-in a", "built-in b"],
    (b) => String(b.heading),
  );
  return (
    <div>
      <span data-testid="items">{items.join(",")}</span>
      <span data-testid="managed">{String(managed)}</span>
    </div>
  );
};

describe("useSectionList", () => {
  it("keeps the built-in items when the admin has added none", async () => {
    render(<ListProbe />, { wrapper });
    await waitFor(() => expect(screen.getByTestId("managed")).toHaveTextContent("false"));
    expect(screen.getByTestId("items")).toHaveTextContent("built-in a,built-in b");
  });

  it("returns admin rows in sort_order", async () => {
    rows = [
      { id: "2", page_key: "home", section_key: "film", heading: "second", sort_order: 5, metadata: {}, published: true },
      { id: "1", page_key: "home", section_key: "film", heading: "first", sort_order: 1, metadata: {}, published: true },
    ];
    render(<ListProbe />, { wrapper });
    await waitFor(() => expect(screen.getByTestId("managed")).toHaveTextContent("true"));
    expect(screen.getByTestId("items")).toHaveTextContent("first,second");
  });
});

describe("media placement tags", () => {
  it("treats `gallery` as placement and every other tag as a filter category", () => {
    const items = [
      { id: "a", url: "", alt: "", caption: null, tags: ["gallery", "Weddings"] },
      { id: "b", url: "", alt: "", caption: null, tags: ["gallery", "Portraits"] },
      { id: "c", url: "", alt: "", caption: null, tags: ["gallery"] },
    ];
    expect(categoriesOf(items)).toEqual(["Portraits", "Weddings"]);
  });

  it("falls back to the filename when an asset has no alt text", () => {
    const item = toMediaItem({
      id: "x", bucket_id: "bw-media-library", file_name: "DSC01.jpg", file_path: "p/DSC01.jpg",
      alt_text: null, caption: null, mime_type: "image/jpeg", file_size: 1, tags: [],
      uploaded_by: null, is_public: true, created_at: "", updated_at: "",
    });
    expect(item.alt).toBe("DSC01.jpg");
    expect(item.url).toBe("https://cdn.test/p/DSC01.jpg");
  });
});

describe("demo content switch", () => {
  it("stops falling back to samples once demo content is hidden", async () => {
    // The samples live in code, not the database, so without this switch
    // deleting the last real item made them reappear.
    rows = [
      {
        id: "s",
        page_key: "site",
        section_key: "settings",
        metadata: { demo_content: "hidden" },
        sort_order: 0,
        published: true,
      },
    ];
    render(<ListProbe />, { wrapper });
    await waitFor(() => expect(screen.getByTestId("items")).toHaveTextContent(""));
    expect(screen.getByTestId("items").textContent).toBe("");
  });

  it("uses the samples while the switch is left alone", async () => {
    rows = [];
    render(<ListProbe />, { wrapper });
    await waitFor(() => expect(screen.getByTestId("items")).toHaveTextContent("built-in a"));
  });
});
