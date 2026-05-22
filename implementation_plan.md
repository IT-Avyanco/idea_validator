# IdeaProof by Avyanco — Implementation Plan

A full-stack Next.js 14 (App Router) web application: an AI-powered UAE business idea validator branded for Avyanco Business Setup Consultancy. The app takes entrepreneur inputs, calls Google Gemini 2.0 Flash via a secure server-side API route, and returns a rich multi-section report with scoring, market analysis, competitor intelligence, license recommendations, and PDF export.

---

## Open Questions

> [!IMPORTANT]
> **Gemini API Key**: You'll need to provide your `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/). After the project is built, add it to `.env.local` as `GEMINI_API_KEY=your_key_here`.

> [!IMPORTANT]
> **Avyanco Logo**: No logo image asset was provided. I'll implement the logo as a styled text mark ("avyanco" in navy + "IDEAPROOF" in coral) as specified. Let me know if you have a real logo file to use instead.

---

## Proposed Changes

### Project Bootstrap

#### [NEW] `package.json` (via `npx create-next-app`)
- Next.js 14, Tailwind CSS, App Router
- Additional deps: `framer-motion`, `lucide-react`, `jspdf`, `jspdf-autotable`, `@google/generative-ai`

---

### Configuration Layer

#### [NEW] `tailwind.config.js`
- Custom color tokens: `avyanco-navy`, `avyanco-blue`, `avyanco-red`, `avyanco-light`, `avyanco-gray`, `avyanco-dark`, `avyanco-success`, `avyanco-warning`, `avyanco-danger`
- Poppins font family extension

#### [NEW] `next.config.js`
- Standard Next.js config

#### [NEW] `vercel.json`
- `maxDuration: 30` for API functions

#### [NEW] `.env.local`
- `GEMINI_API_KEY=YOUR_KEY_HERE`
- `NEXT_PUBLIC_SITE_URL=https://ideaproof.avyanco.com`

---

### App Shell

#### [NEW] `app/layout.js`
- Poppins font via `next/font/google` (weights 300–700)
- Full SEO metadata + Open Graph
- Global CSS import

#### [NEW] `app/globals.css`
- Tailwind base/components/utilities
- CSS custom properties (brand colors)
- Custom keyframe animations: `pulse-ring`, `count-up`, `score-draw`
- Scrollbar styling

#### [NEW] `app/page.js`
- Main page assembly: `<Navbar>`, `<HeroSection>`, `<ValidatorForm>`, `<ResultsSection>`, `<IdeaHistory>`, `<Footer>`
- State management: `formData`, `isLoading`, `results`, `loadingStep`, `showExitBar`

---

### API Routes

#### [NEW] `app/api/validate/route.js`
- POST handler
- Reads `GEMINI_API_KEY` from env (server-only)
- Builds full system prompt with user inputs
- Calls Gemini 2.0 Flash REST endpoint
- Parses and validates JSON response
- Returns structured result or `{error: true, message}`

#### [NEW] `app/api/improve/route.js`
- POST handler for "Improve My Score" second Gemini call
- Accepts `{businessIdea, score, ideaTitle}`
- Returns 3 improvement suggestions as JSON

---

### Components

#### [NEW] `components/Navbar.jsx`
- Sticky, white bg, shadow on scroll
- Text logo: "avyanco" (navy) + "IDEAPROOF" (coral)
- Right: "Book a Free Consultation" CTA button
- Mobile hamburger with slide-down menu

#### [NEW] `components/HeroSection.jsx`
- Full-width gradient: `linear-gradient(135deg, #2C3E7D 0%, #1A2456 60%, #4998CE 100%)`
- Framer Motion staggered fade-in for headline, subheadline, badges, arrow
- Trust badges: 3 white pills
- Validation counter: "Join 2,400+ entrepreneurs..."
- Scroll arrow animation

#### [NEW] `components/ValidatorForm.jsx`
- All 6 form fields fully controlled
- Character counter on textarea
- Pill-chip multi-select for category
- Styled radio buttons for budget
- 3 "Try an Example" quick-fill chips
- Inline validation errors on submit attempt
- Loading state: 4 sequential step reveals + animated progress bar
- Rate-limit counter (localStorage: max 3/day)

#### [NEW] `components/ResultsSection.jsx`
- Orchestrates all result sub-components
- Framer Motion stagger container
- Smooth scroll into view on results ready
- Sticky exit-intent bar at 80% scroll

#### [NEW] `components/ScoreGauge.jsx`
- SVG circular gauge, `strokeDasharray` animation (1.5s ease-out)
- Count-up number animation (1.2s)
- Dynamic color: green/amber/red thresholds
- Verdict badge

#### [NEW] `components/MetricsRow.jsx`
- 4 KPI cards: Market Size, Growth Rate, Target Audience, Setup Timeline
- Responsive: 4-col desktop → 2×2 mobile

#### [NEW] `components/CompetitorCards.jsx`
- 3 cards with coral-red left border
- Strength bar (visual progress)
- Weakness + "Their Gap" highlight
- Hover lift animation

#### [NEW] `components/LicenseCard.jsx`
- Primary license (large, bold)
- Alternative pills
- Avyanco best-match highlight
- Estimated cost + timeline chip
- Link to avyanco.com

#### [NEW] `components/OpportunitiesFlags.jsx`
- 2-column grid
- Opportunities: green card bg, checkmark icons
- Red Flags: severity badges (CRITICAL/HIGH/MEDIUM/LOW), colored left borders

#### [NEW] `components/AvyancoServices.jsx`
- Horizontal scroll chip row (navy pills with checkmarks)

#### [NEW] `components/NextStepsTimeline.jsx`
- Vertical 3-step timeline
- Navy circles + connecting line
- Bold step titles + 1-sentence descriptions

#### [NEW] `components/ActionButtons.jsx`
- PDF download (calls PDFGenerator)
- WhatsApp share (pre-filled message)
- Book Consultation CTA (pulsing animation)

#### [NEW] `components/ImproveScore.jsx`
- Accordion toggle
- Second Gemini API call on expand
- 3 improvement cards with before/after framing
- Framer Motion height animation

#### [NEW] `components/IdeaHistory.jsx`
- Reads/writes localStorage key `ideaproof_history`
- Last 5 validations: snippet, score badge, emirate, timestamp
- Click to restore result
- "Clear History" link

#### [NEW] `components/Footer.jsx`
- Avyanco address, phone, email, links
- Disclaimer text
- Copyright 2025

---

### Utilities

#### [NEW] `lib/gemini.js`
- `buildValidationPrompt(formData)` — constructs the full system prompt
- `callGemini(prompt)` — fetch wrapper for Gemini REST API
- JSON extraction + validation

#### [NEW] `lib/pdfExport.js`
- `generatePDF(results, formData)` — jsPDF + autotable
- Navy header bar, watermark, all sections
- Footer on each page

---

## Verification Plan

### Automated
- `npm run build` — TypeScript/build compilation check
- `npm run dev` — local dev server

### Browser Tests
- Submit form with each "Try an Example" chip → validate full results render
- Verify PDF downloads with correct content
- Verify WhatsApp share URL
- Verify localStorage history saves/restores
- Test mobile responsive breakpoints

### Manual
- Add real `GEMINI_API_KEY` to `.env.local` and test a live Gemini call
- Deploy to Vercel and verify API route runs within 30s
