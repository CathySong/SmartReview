# SmartReview

Customer review assistant for restaurants. Customers can scan a QR code, optionally add context about their meal, draft honest review text with AI assistance, and open the Google Maps review page where they choose their own rating and edit before posting.

## Why This Project Exists

Restaurants often lose reviews because the review flow is clunky, especially on mobile. SmartReview reduces friction without automating submissions, inventing customer experiences, or pre-filling positive ratings.

## Key Features

- QR/NFC-friendly customer entry point
- Optional dish/photo context for more specific draft text
- AI-generated review drafts that customers can edit
- Direct link to the Google Maps review page
- Customer-controlled rating and final submission
- Mobile-first flow for in-restaurant use

## Compliance Posture

This project is intentionally designed to avoid dark patterns:

- It does not submit reviews automatically.
- It does not offer incentives for reviews.
- It does not force or pre-fill a five-star rating.
- It asks customers to edit the final text so it reflects their actual experience.
- It opens Google Maps for the customer to choose their own rating and post manually.

## Tech Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- OpenAI SDK for optional draft generation
- Google Maps review URL routing
- Vercel-ready deployment

## Quick Start

```bash
git clone https://github.com/CathySong/SmartReview.git
cd SmartReview
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

```env
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_PLACE_ID=your_google_place_id_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

The app works with fallback draft prompts if `OPENAI_API_KEY` is not configured.

## Project Structure

```text
app/                  Next.js routes and page layout
components/           Review, QR, and photo upload UI
lib/ai-generator.ts   Review draft generation
lib/google-review.ts  Google review URL and compliance helpers
```

## Development Commands

```bash
npm run dev
npm run build
npm run lint
```

## Product Notes

The strongest next improvement would be a small admin configuration layer so each restaurant can set its own business name, Google Place ID, brand colors, and suggested dish categories without editing source code.
