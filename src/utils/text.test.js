import { shorten, shortTitle, formatDate } from "./text";

test("shortTitle drops subtitles and series tags and caps the length", () => {
  expect(shortTitle("How to Change Your Mind: What the New Science of Psychedelics Teaches Us")).toBe("How to Change Your Mind");
  expect(shortTitle("Death's End (The Three-Body Problem Series Book 3)")).toBe("Death's End");
  expect(shortTitle("Clean Code, 2nd Edition")).toBe("Clean Code");
  expect(shortTitle("")).toBe("Untitled");
  const long = shortTitle("A very long title that keeps going and going well past the limit");
  expect(long.endsWith("…")).toBe(true);
  expect(long.length).toBeLessThanOrEqual(45);
});

test("shorten leaves short text alone and cuts long text at a word", () => {
  expect(shorten("short text")).toEqual({ short: "short text", truncated: false });
  expect(shorten("")).toEqual({ short: "", truncated: false });
  const { short, truncated } = shorten("alpha beta gamma delta epsilon zeta eta theta", 20);
  expect(truncated).toBe(true);
  expect(short).toBe("alpha beta gamma…");
});

test("formatDate handles missing and invalid values", () => {
  expect(formatDate(null)).toBeNull();
  expect(formatDate("not a date")).toBeNull();
  expect(formatDate("2026-09-03T12:00:00Z", "long")).toMatch(/2026/);
});
