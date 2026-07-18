import Link from "next/link";

// Guide bodies, keyed by slug. Plain styled prose (no MDX) so internal links are
// type-checked and content stays close to the rest of the marketing pages.

const h2 = "text-xl font-semibold text-navy pt-4";
const p = "leading-relaxed";
const ul = "list-disc pl-5 space-y-1.5";

function GhostJob() {
  return (
    <>
      <p className={p}>
        You find a role that fits, spend 40 minutes tailoring your application, hit send — and hear
        nothing. Sometimes that&apos;s just a competitive market. But a surprising share of job ads are
        &ldquo;ghost jobs&rdquo;: listings that are stale, perpetually re-posted, or were never really
        open. Learning to spot them saves you hours and a lot of demoralising silence.
      </p>

      <h2 className={h2}>What a ghost job actually is</h2>
      <p className={p}>Most fall into one of a few buckets:</p>
      <ul className={ul}>
        <li><strong>Already filled</strong> — the role closed but the ad was never taken down.</li>
        <li><strong>Evergreen / talent-pipelining</strong> — the company collects CVs year-round for roles that may open later.</li>
        <li><strong>Reposted to look active</strong> — an old listing refreshed to appear at the top of results.</li>
        <li><strong>Compliance or internal</strong> — posted publicly but earmarked for someone already lined up.</li>
      </ul>

      <h2 className={h2}>The signals to check</h2>
      <ul className={ul}>
        <li><strong>Posting age.</strong>{" "}The single best signal. A role open for 45+ days with no &ldquo;urgently hiring&rdquo; cues is far more likely to be filled or evergreen. Fresh listings (under a week or two) are the safest bet.</li>
        <li><strong>Vague, generic copy.</strong>{" "}Real, current roles usually name a team, a manager, or a specific project. Boilerplate that could describe any company is a flag.</li>
        <li><strong>The same ad, everywhere, for months.</strong>{" "}Search the exact job title + company. If it&apos;s been live continuously across multiple boards, treat it as a pipeline ad.</li>
        <li><strong>No salary and no detail.</strong>{" "}Not always a ghost job, but combined with the above it lowers the odds it&apos;s a live, funded role.</li>
      </ul>

      <h2 className={h2}>How to spend your time well</h2>
      <p className={p}>
        You can&apos;t always know, but you can weight your effort toward the listings most likely to be
        real: prioritise <strong>recently posted</strong>{" "}roles, ones with concrete detail, and ones
        where you&apos;re a genuinely strong match rather than a hopeful stretch.
      </p>
      <p className={p}>
        That last point is where matching beats scrolling. When you{" "}
        <Link href="/match-my-cv-to-jobs" className="text-teal-ink hover:underline">match your CV to live jobs</Link>{" "}
        with dropmycv, every result shows <strong>how recently it was posted</strong>{" "}and a match score
        with the reason it fits — so you can skip the stale, low-fit listings and put your energy into
        the ones worth a tailored application. It&apos;s free, and your CV is never stored.
      </p>
    </>
  );
}

function CvKeywords() {
  return (
    <>
      <p className={p}>
        Most mid-to-large employers screen applications with software before a human ever reads them.
        That&apos;s led to a lot of bad advice — like cramming your CV with keywords or hiding white text
        in the margins. It doesn&apos;t work, and it reads as desperate to the human who sees it next.
        Here&apos;s what actually matters.
      </p>

      <h2 className={h2}>What the filters are really doing</h2>
      <p className={p}>
        Applicant tracking systems mostly look for evidence that you have the specific skills, tools and
        experience a role asks for — phrased the way the listing phrases them. If a job calls for
        &ldquo;stakeholder management&rdquo; and your CV says &ldquo;worked with lots of people,&rdquo;
        you may not register as a match even though you&apos;ve done exactly that.
      </p>

      <h2 className={h2}>How to find the keywords that count</h2>
      <ul className={ul}>
        <li><strong>Read the listings you&apos;re actually targeting</strong> — not generic lists. Pull 5–10 real ads for the role and note the skills, tools and phrases that repeat across them.</li>
        <li><strong>Mirror the exact wording</strong>{" "}for things you genuinely have. If three ads say &ldquo;GA4&rdquo; and you use Google Analytics, write &ldquo;GA4&rdquo;.</li>
        <li><strong>Prioritise the repeated ones.</strong>{" "}A keyword that appears in most listings for your role is a near-requirement; one that appears once is optional.</li>
        <li><strong>Never claim what you can&apos;t back up.</strong>{" "}Keywords get you read; the interview tests them. Padding with skills you don&apos;t have just moves the rejection later.</li>
      </ul>

      <h2 className={h2}>Put them where they count</h2>
      <p className={p}>
        Weave keywords into real achievement bullets, not a keyword-salad &ldquo;skills&rdquo; block.
        &ldquo;Cut p95 latency 40% by re-architecting our Node.js services&rdquo; carries the keyword{" "}
        <em>and</em>{" "}the proof. The filter sees the term; the human sees the result.
      </p>

      <h2 className={h2}>The shortcut</h2>
      <p className={p}>
        Doing this by hand across every application is slow. dropmycv does the comparison for you: it{" "}
        <Link href="/match-my-cv-to-jobs" className="text-teal-ink hover:underline">matches your CV to live roles</Link>{" "}
        first, then the optional{" "}
        <Link href="/cv-review" className="text-teal-ink hover:underline">A$9 CV review</Link>{" "}
        shows the exact keywords those <em>specific</em>{" "}live jobs ask for that your CV is missing —
        so you&apos;re optimising for real, current demand, not a generic checklist. Or start with a{" "}
        <Link href="/cv-checker" className="text-teal-ink hover:underline">free CV check</Link>.
      </p>
    </>
  );
}

function PrivateSearch() {
  return (
    <>
      <p className={p}>
        Job-hunting while you&apos;re still employed is the most common kind of job search — and the most
        stressful. A single slip can get back to your manager. The good news: with a few habits you can
        run a thorough search while keeping it genuinely private.
      </p>

      <h2 className={h2}>Where leaks actually happen</h2>
      <ul className={ul}>
        <li><strong>Your CV in a searchable database.</strong>{" "}Upload it to a big job board and recruiters — sometimes including ones who work with your employer — can find it.</li>
        <li><strong>LinkedIn signals.</strong>{" "}Suddenly going from sparse to a polished profile, or toggling &ldquo;open to work&rdquo; publicly, is visible to your network.</li>
        <li><strong>Activity at work.</strong>{" "}Job-searching on a work laptop, work Wi-Fi, or your work email is the classic mistake.</li>
        <li><strong>References given too early.</strong>{" "}Listing a current colleague before you&apos;re ready can out you.</li>
      </ul>

      <h2 className={h2}>How to keep it quiet</h2>
      <ul className={ul}>
        <li><strong>Use your own devices and a personal email</strong>{" "}created for the search.</li>
        <li><strong>Set LinkedIn&apos;s &ldquo;open to work&rdquo; to recruiters-only</strong>, and turn off activity broadcasts before you tidy your profile.</li>
        <li><strong>Be deliberate about where your CV goes.</strong>{" "}Every site that stores it is another place it can surface. Favour tools that don&apos;t keep it.</li>
        <li><strong>Hold references</strong>{" "}until you have real interest and have agreed discretion.</li>
      </ul>

      <h2 className={h2}>The CV-storage problem</h2>
      <p className={p}>
        The hardest part to control is your CV sitting in databases you can&apos;t see into. That&apos;s
        the specific problem dropmycv was built for: your CV is read{" "}
        <strong>in your browser</strong>, your email, phone and links are stripped before anything is
        sent, and <strong>nothing is stored</strong> — there&apos;s no account and no recruiter-searchable
        profile. You get a ranked shortlist of live roles without adding your CV to one more database.
      </p>
      <p className={p}>
        More on how that works:{" "}
        <Link href="/private-job-search" className="text-teal-ink hover:underline">private job search</Link>{" "}
        and{" "}
        <Link href="/" className="text-teal-ink hover:underline">match your CV privately</Link>.
      </p>
    </>
  );
}

export const GUIDE_BODIES: Record<string, () => React.ReactElement> = {
  "spot-a-ghost-job": GhostJob,
  "cv-keywords-that-get-past-filters": CvKeywords,
  "job-search-while-employed-privately": PrivateSearch,
};
