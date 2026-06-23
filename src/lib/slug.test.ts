import { describe, it, expect } from "vitest";
import { slugify } from "@/lib/slug";

describe("slugify", () => {
  it("lowercases and hyphenates spaces", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips special characters", () => {
    expect(slugify("About Us!! (2024)")).toBe("about-us-2024");
  });

  it("trims leading/trailing hyphens and whitespace", () => {
    expect(slugify("  --Hi there--  ")).toBe("hi-there");
  });

  it("falls back to 'page' when nothing remains", () => {
    expect(slugify("!!!")).toBe("page");
  });

  it("collapses repeated separators", () => {
    expect(slugify("a   &   b")).toBe("a-b");
  });
});
