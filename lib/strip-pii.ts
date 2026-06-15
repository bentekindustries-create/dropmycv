"use client";

/**
 * Strips identifiable contact details from CV text before it leaves the browser.
 * Skills, job titles, and experience are preserved — only contact info is removed.
 */
export function stripPii(text: string): string {
  return (
    text
      // Email addresses
      .replace(/[a-zA-Z0-9._%+'-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[email]")
      // URLs and LinkedIn profiles (before phone patterns to avoid port-number collisions)
      .replace(/https?:\/\/[^\s<>"']+/gi, "[link]")
      .replace(/www\.[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\s<>"']*/gi, "[link]")
      // International phone numbers  e.g. +61 412 345 678 / +44 7911 123456
      .replace(/\+\d[\d\s\-().]{6,17}\d/g, "[phone]")
      // Australian mobile  e.g. 0412 345 678 / 0412345678
      .replace(/0[45]\d{2}[\s.-]?\d{3}[\s.-]?\d{3}/g, "[phone]")
      // Australian landline  e.g. (02) 9123 4567
      .replace(/\(0\d\)[\s.-]?\d{4}[\s.-]?\d{4}/g, "[phone]")
      // US / CA  e.g. (555) 123-4567 / 555-123-4567
      .replace(/\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/g, "[phone]")
  );
}
