import { describe, it, expect } from "vitest";
import { formatCurrency, formatDate } from "./index";

describe("formatCurrency", () => {
  it("formats numbers into USD currency format", () => {
    const result = formatCurrency(100);
    // Replace non-breaking spaces with standard space to prevent issues on different environments
    const normalizedResult = result.replace(/\u00a0/g, ' ');
    expect(normalizedResult).toBe("$100.00");
  });

  it("handles decimal values", () => {
    const result = formatCurrency(1234.56);
    const normalizedResult = result.replace(/\u00a0/g, ' ');
    expect(normalizedResult).toBe("$1,234.56");
  });
});

describe("formatDate", () => {
  it("formats Date objects correctly", () => {
    const date = new Date("2026-01-01T00:00:00Z");
    const result = formatDate(date);
    expect(result).toBe("Jan 1, 2026");
  });

  it("formats date strings correctly", () => {
    const result = formatDate("2026-12-25");
    expect(result).toBe("Dec 25, 2026");
  });
});
