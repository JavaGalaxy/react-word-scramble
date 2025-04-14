import { containsBannedWord } from "../containsBannedWord";

describe("containsBannedWord", () => {
  const bannedWords = ["bad", "worse", "worst"];

  it("should return false when the bannedWords is null", () => {
    expect(containsBannedWord("test string", null)).toBe(false);
  });

  it("should return false when bannedWords is an empty array", () => {
    expect(containsBannedWord("test string", [])).toBe(false);
  });

  it("should return false when the string does not contain any banned words", () => {
    expect(containsBannedWord("good string", bannedWords)).toBe(false);
  });
  it("should return true when the string contains a banned word", () => {
    expect(containsBannedWord("bad string", bannedWords)).toBe(true);
  });
});
