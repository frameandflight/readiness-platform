# Frame & Flight — PLM Readiness Assessment Platform

A full-stack Next.js application for running PLM (Product Lifecycle Management) readiness assessments. Users complete a scored assessment across 9 capability areas, results are stored in Supabase, and a readiness dashboard + PDF report are generated.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts (radar + bar charts)
- **PDF Export**: jsPDF + jsPDF-AutoTable
- **Styling**: Tailwind CSS + custom CSS variables
- **Language**: TypeScript

## Assessment Structure

9 capability sections, 74 questions total, scored across 4 dimensions:

| Section | Questions |
|---|---|
| Supplier Management | 10 |
| Raw Material Specifications | 12 |
| Formula Creation | 14 |
| Formula Management | 6 |
| Trade Management | 7 |
| Claims Management | 7 |
| Mandatory Label Copy | 6 |
| Packaging Management | 7 |
| Artwork | 7 |

**Dimensions scored 1–5:**
- **Process** — standardization and consistency
- **Technology** — tools and system integration  
- **People** — skills and training
- **Data** — governance and availability

**Readiness levels:**
- 🟢 **Ready** — average > 4.0
- 🟡 **In Progress** — average 2.0–4.0
- 🔴 **Not Ready** — average < 2.0

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. In the SQL editor, run the contents of `supabase_schema.sql`
3. Copy your project URL and anon key from Settings → API

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Application Routes

| Route | Description |
|---|---|
| `/` | Landing page with overview |
| `/assess` | Multi-section assessment form |
| `/dashboard?id=<uuid>` | Readiness dashboard for a submission |

## Features

### Assessment Form (`/assess`)
- Respondent info collection (company, name, email, role)
- Section-by-section navigation with progress indicator
- Per-question 1–5 sliders for each of 4 dimensions
- Rubric tooltips showing what each score means
- Answers auto-saved to Supabase on submit

### Dashboard (`/dashboard`)
- Overall score cards for all 4 dimensions
- Radar chart of dimension averages
- Bar chart of section averages (color-coded by readiness)
- Expandable section cards with:
  - Radar chart per section
  - Dimension scores
  - Capability-level bar charts
- PDF export button

### PDF Report
- Cover page with overall score and company info
- Dimension summary table
- One page per section with capability-level scores

## Deployment

Deploy to Vercel:
```bash
npx vercel
```

Add the environment variables in the Vercel dashboard under Settings → Environment Variables.

## Customization

- **Questions**: Edit `src/lib/assessmentData.ts` — add/remove sections or questions
- **Scoring rubric**: Modify the `RUBRIC` object in the same file
- **Colors**: Update CSS variables in `src/app/globals.css`
- **PDF styling**: Modify `handlePDFDownload` in `src/app/dashboard/page.tsx`
