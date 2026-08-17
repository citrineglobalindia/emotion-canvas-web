import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { RichText, Paragraphs } from "@/components/RichText";

describe("RichText", () => {
  it("turns *asterisks* into accent emphasis", () => {
    const { container } = render(<RichText text="a *Unique* take" />);
    expect(container.querySelector("em")?.textContent).toBe("Unique");
    expect(container.textContent).toBe("a Unique take");
  });

  it("turns newlines into line breaks", () => {
    const { container } = render(<RichText text={"one\ntwo\nthree"} />);
    expect(container.querySelectorAll("br")).toHaveLength(2);
  });

  it("never renders admin input as HTML", () => {
    const { container } = render(<RichText text="<script>alert(1)</script>" />);
    expect(container.querySelector("script")).toBeNull();
    expect(container.textContent).toBe("<script>alert(1)</script>");
  });

  it("renders nothing for empty copy", () => {
    const { container } = render(<RichText text={undefined} />);
    expect(container.textContent).toBe("");
  });
});

describe("Paragraphs", () => {
  it("splits on blank lines", () => {
    const { container } = render(<Paragraphs text={"first para\n\nsecond para"} />);
    const paras = container.querySelectorAll("p");
    expect(paras).toHaveLength(2);
    expect(paras[0].textContent).toBe("first para");
    expect(paras[1].textContent).toBe("second para");
  });

  it("keeps a single paragraph as one block", () => {
    const { container } = render(<Paragraphs text="just one" />);
    expect(container.querySelectorAll("p")).toHaveLength(1);
  });
});
