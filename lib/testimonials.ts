export interface Testimonial {
  quote: string;
  name: string; // first name + initial is fine, e.g. "Jordan M."
  role?: string; // optional, e.g. "Project Manager, Brisbane"
}

// Add REAL testimonials here as you collect them — e.g. from people who used a
// discount code in exchange for honest feedback. Keep them genuine (don't edit
// them to be more positive). The on-page section only renders when this array
// has entries, so nothing fake is ever shown.
export const TESTIMONIALS: Testimonial[] = [];
