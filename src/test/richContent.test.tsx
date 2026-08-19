import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import RichContent from "@/components/RichContent";

describe("RichContent", () => {
  it("renders HTML written in the visual editor", () => {
    const { container } = render(
      <RichContent content="<h2>A chapter</h2><p>Some <strong>bold</strong> copy.</p>" />,
    );
    expect(container.querySelector("h2")?.textContent).toBe("A chapter");
    expect(container.querySelector("strong")?.textContent).toBe("bold");
  });

  it("keeps images and video that the editor inserts", () => {
    const { container } = render(
      <RichContent content='<p><img src="https://cdn.test/a.jpg" alt="x"></p><video src="https://cdn.test/a.mp4"></video>' />,
    );
    expect(container.querySelector("img")?.getAttribute("src")).toBe("https://cdn.test/a.jpg");
    expect(container.querySelector("video")?.getAttribute("src")).toBe("https://cdn.test/a.mp4");
  });

  it("strips scripts and event handlers", () => {
    // Only admins can write this content, but an account compromise should not
    // turn every article into a script injection.
    const { container } = render(
      <RichContent content={'<p onclick="steal()">hi</p><script>alert(1)</script>'} />,
    );
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("p")?.getAttribute("onclick")).toBeNull();
    expect(container.textContent).toContain("hi");
  });

  it("blocks javascript: links", () => {
    const { container } = render(
      <RichContent content={'<a href="javascript:alert(1)">click</a>'} />,
    );
    // DOMPurify drops the attribute outright rather than rewriting it.
    const href = container.querySelector("a")?.getAttribute("href");
    expect(href ?? "").not.toContain("javascript:");
  });

  it("still renders posts written in markdown before the editor existed", () => {
    const { container } = render(<RichContent content={"## Old heading\n\nPlain paragraph."} />);
    expect(container.querySelector("h2")?.textContent).toBe("Old heading");
  });

  it("renders nothing when there is no content", () => {
    const { container } = render(<RichContent content={null} />);
    expect(container.textContent).toBe("");
  });
});
