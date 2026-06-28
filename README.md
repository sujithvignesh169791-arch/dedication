# AI Resume Pro Coach

A production-ready Next.js 14 application for AI-powered resume analysis, mock interviews, and automated resume rebuilding.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js v5
- **AI Integration**: Google Gemini via AI Studio, Groq, or OpenAI (fully flexible via OpenAI compatibility SDK using structured JSON outputs)
- **Payments**: Stripe Subscriptions
- **File Processing**: pdf-parse, mammoth, Puppeteer (for PDF export)
- **Visualizations**: Recharts
- **Validation**: Zod

## Prerequisites
- Node.js 20+
- MongoDB instance (e.g., MongoDB Atlas)
- AI API Key (Google Gemini, Groq, or OpenAI)
- Stripe Account (with Secret and Publishable keys)

## Local Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd ai-resume-pro-coach
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Copy `.env.example` to `.env.local` and fill in your keys:
   ```bash
   cp .env.example .env.local
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Stripe Webhook Setup
To handle subscription events locally:
1. Install the Stripe CLI.
2. Run `stripe listen --forward-to localhost:3000/api/premium/webhook`
3. Copy the webhook signing secret (`whsec_...`) into your `.env.local` as `STRIPE_WEBHOOK_SECRET`.

## Deployment Guide (Vercel)
1. Push your code to GitHub.
2. Import the project into Vercel.
3. Configure all environment variables in the Vercel dashboard.
4. **Important**: Puppeteer does not run on Vercel's free tier due to function size limits. You must either configure a custom Docker deployment (a `Dockerfile` is provided) or replace Puppeteer with a service like Browserless.io.
5. Set `NEXTAUTH_URL` to your production domain.
6. Deploy!

## API Routes Documentation

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/register` | POST | Register a new user |
| `/api/resume/upload` | POST | Upload and extract text from a resume (PDF/DOCX) |
| `/api/resume/analyze` | POST | Generate AI analysis and ATS scoring |
| `/api/resume/rebuild` | POST | AI rewrites resume bullets and summary |
| `/api/resume/export` | POST | Generate PDF from JSON resume via Puppeteer |
| `/api/interview/generate` | POST | Create AI mock interview questions |
| `/api/interview/score` | POST | Score a specific interview answer |
| `/api/premium/checkout` | POST | Create Stripe subscription checkout session |
| `/api/premium/webhook` | POST | Handle Stripe async webhook events |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | Connection string for MongoDB |
| `NEXTAUTH_SECRET` | Random 32-byte string for NextAuth session encryption |
| `NEXTAUTH_URL` | Base URL of the application |
| `GEMINI_API_KEY` | Optional: Key for Google AI Studio (Gemini 1.5 Flash) |
| `GROQ_API_KEY` | Optional: Key for Groq (Llama 3 70B) |
| `OPENAI_API_KEY` | Optional: Secret key from OpenAI platform |
| `STRIPE_SECRET_KEY` | Secret key for Stripe API |
| `STRIPE_PUBLISHABLE_KEY` | Public key for Stripe Elements |
| `STRIPE_WEBHOOK_SECRET` | Secret for verifying Stripe webhook signatures |
| `STRIPE_MONTHLY_PRICE_ID` | Stripe Product Price ID for monthly plan |
| `STRIPE_ANNUAL_PRICE_ID` | Stripe Product Price ID for annual plan |
| `NEXT_PUBLIC_APP_URL` | Public-facing app URL |
