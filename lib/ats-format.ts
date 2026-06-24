/**
 * Deterministic, client-side ATS "parse-ability" checks.
 *
 * These run in the browser on the already-PII-stripped CV text (see strip-pii.ts),
 * so nothing identifiable is needed or kept. They cover the mechanical things an
 * Applicant Tracking System cares about — can it read the file, find your sections,
 * your dates, your contact line — separate from the AI keyword analysis.
 *
 * stripPii() replaces emails/phones/links with the tokens [email] / [phone] / [link],
 * so we can detect that a contact detail *existed* without ever seeing it.
 */

export type AtsStatus = "pass" | "warn" | "fail";

export interface AtsCheck {
  id: string;
  label: string;
  status: AtsStatus;
  detail: string;
}

export interface AtsFormatResult {
  checks: AtsCheck[];
  score: number; // 0-100, deterministic format sub-score
}

function fileKind(fileName: string): "docx" | "pdf" | "txt" | "other" {
  const n = fileName.toLowerCase();
  if (n.endsWith(".docx")) return "docx";
  if (n.endsWith(".pdf")) return "pdf";
  if (n.endsWith(".txt")) return "txt";
  return "other";
}

export function analyseAtsFormat(text: string, fileName: string): AtsFormatResult {
  const checks: AtsCheck[] = [];
  const words = (text.match(/\b[\w’'-]+\b/g) ?? []).length;
  const lower = text.toLowerCase();

  // 1. File format ---------------------------------------------------------
  const kind = fileKind(fileName);
  checks.push(
    kind === "docx"
      ? { id: "format", label: "File format", status: "pass", detail: "Word (.docx) is the most reliably parsed format for ATS." }
      : kind === "pdf"
        ? { id: "format", label: "File format", status: "pass", detail: "Text-based PDF — readable by most modern ATS. (Image/scanned PDFs are not — yours parsed as text, so you're fine.)" }
        : kind === "txt"
          ? { id: "format", label: "File format", status: "warn", detail: "Plain text parses everywhere but loses all structure. A .docx is usually a safer bet for online applications." }
          : { id: "format", label: "File format", status: "warn", detail: "Unusual file type — stick to .docx or a text-based PDF for online applications." }
  );

  // 2. Contact line --------------------------------------------------------
  const hasEmail = text.includes("[email]");
  checks.push(
    hasEmail
      ? { id: "contact", label: "Contact details", status: "pass", detail: "A contact email was found in the body text where an ATS can read it." }
      : { id: "contact", label: "Contact details", status: "warn", detail: "No email detected in the body. Put your contact details in the main text — ATS frequently ignore headers and footers." }
  );

  // 3. Standard sections ---------------------------------------------------
  const hasExperience = /\b(experience|employment|work history|career history|professional background)\b/i.test(lower);
  const hasEducation = /\b(education|qualifications?|academic)\b/i.test(lower);
  const hasSkills = /\b(skills|competenc(?:e|ies)|technical proficienc)/i.test(lower);
  const present = [hasExperience, hasEducation, hasSkills].filter(Boolean).length;
  const missing = [
    !hasExperience && "Experience",
    !hasEducation && "Education",
    !hasSkills && "Skills",
  ].filter(Boolean);
  checks.push(
    present === 3
      ? { id: "sections", label: "Standard sections", status: "pass", detail: "Clear Experience, Education and Skills headings — ATS map your CV onto these." }
      : present === 2
        ? { id: "sections", label: "Standard sections", status: "warn", detail: `Add a clearly labelled “${missing.join(" / ")}” heading so the ATS can find it.` }
        : { id: "sections", label: "Standard sections", status: "fail", detail: `Missing standard headings (${missing.join(", ")}). ATS look for these exact section names — add them.` }
  );

  // 4. Length --------------------------------------------------------------
  checks.push(
    words < 200
      ? { id: "length", label: "Length", status: "fail", detail: `Only ~${words} words. That's too thin for an ATS to build a profile — most parse poorly under ~250 words.` }
      : words > 1300
        ? { id: "length", label: "Length", status: "warn", detail: `~${words} words is long. Recruiters and ATS favour concise CVs — trim toward 1–2 pages.` }
        : { id: "length", label: "Length", status: "pass", detail: `~${words} words — a healthy length for parsing.` }
  );

  // 5. Bullet points -------------------------------------------------------
  const hasBullets = /[•◦▪‣·]/.test(text) || /^[\s]*[-*]\s+\S/m.test(text);
  checks.push(
    hasBullets
      ? { id: "bullets", label: "Bullet points", status: "pass", detail: "Uses bullet points — these parse cleanly and keep achievements scannable." }
      : { id: "bullets", label: "Bullet points", status: "warn", detail: "No clear bullet points found. List achievements as short bullets, not dense paragraphs." }
  );

  // 6. Dated history -------------------------------------------------------
  const years = lower.match(/\b(19|20)\d{2}\b/g) ?? [];
  checks.push(
    years.length >= 2
      ? { id: "dates", label: "Dated work history", status: "pass", detail: "Dates detected — ATS use start/end dates to build your work timeline." }
      : { id: "dates", label: "Dated work history", status: "warn", detail: "Few or no dates found. Add start and end dates (e.g. “2021–2024”) to each role." }
  );

  // 7. Table / graphic artefacts ------------------------------------------
  // Box-drawing glyphs, pictographic emoji and stray tabs are tell-tale signs of
  // tables, columns or graphics — the formatting most likely to scramble in an ATS.
  const artefacts = /[│┃─━┌┐└┘├┤┬┴┼╔╗╚╝═║▌▐]|\t{2,}/.test(text);
  const emoji = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(text);
  checks.push(
    artefacts || emoji
      ? { id: "clean", label: "Tables & graphics", status: "warn", detail: "Signs of tables, columns or graphics detected — these often scramble in ATS. Use a single-column layout with plain text." }
      : { id: "clean", label: "Tables & graphics", status: "pass", detail: "No table or graphic artefacts detected in the extracted text." }
  );

  const penalty = checks.reduce((acc, c) => acc + (c.status === "fail" ? 25 : c.status === "warn" ? 9 : 0), 0);
  const score = Math.max(0, Math.min(100, 100 - penalty));

  return { checks, score };
}
