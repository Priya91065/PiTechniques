import { describe, it, expect } from "vitest";
import { pageInput } from "@/lib/validation/page";

describe("pageInput", () => {
  it("accepts a valid page", () => {
    const result = pageInput.safeParse({ title: "Home", slug: "home", status: "PUBLISHED" });
    expect(result.success).toBe(true);
  });

  it("defaults status to DRAFT", () => {
    const parsed = pageInput.parse({ title: "Home", slug: "home" });
    expect(parsed.status).toBe("DRAFT");
  });

  it("rejects an empty title", () => {
    expect(pageInput.safeParse({ title: "", slug: "home" }).success).toBe(false);
  });

  it("rejects an invalid slug", () => {
    expect(pageInput.safeParse({ title: "Home", slug: "Not A Slug" }).success).toBe(false);
  });

  it("rejects an invalid status", () => {
    expect(pageInput.safeParse({ title: "Home", slug: "home", status: "LIVE" }).success).toBe(false);
  });
});
