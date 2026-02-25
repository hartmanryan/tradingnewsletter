# Automated Trading Newsletter

This project is a Next.js application that provides an automated workflow for growing a newsletter subscriber base and sending them daily AI-generated TradingView PineScript strategies.

## Architecture

*   **Frontend Landing Page**: Captures subscriber emails and submits them via API.
*   **Admin Dashboard**: Authenticated interface to input a daily trading idea (prompt) and a daily affiliate link.
*   **Gemini AI Integration**: Generates the valid TradingView PineScript based on the admin's prompt.
*   **Quentn API Integration**: 
    1.  Adds new subscribers to your Quentn CRM list.
    2.  Broadcasts the daily generated script and affiliate link HTML email to your audience.

## Prerequisites

1.  **Google Gemini API Key:** Get it from [Google AI Studio](https://aistudio.google.com/app/apikey)
2.  **Quentn API Key:** Generate your key from your Quentn System settings (API Info).

## Local Development Setup

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Set up environment variables:
    *   Rename `.env.example` to `.env.local`
    *   Fill in your actual API keys:
    ```env
    GEMINI_API_KEY="your-gemini-key"
    QUENTN_API_KEY="your-quentn-key"
    NEXT_PUBLIC_ADMIN_DEV_PASSWORD="your-secure-password"
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) for the landing page.
5.  Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin dashboard.

## Deployment to Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1.  Create a fresh repository on your GitHub account.
2.  Push this codebase to your new repository.
3.  Log into Vercel and click "Add New... -> Project".
4.  Import your new GitHub repository.
5.  **Crucial Step:** In the Vercel deployment settings, expand "Environment Variables" and add these keys:
    *   `GEMINI_API_KEY`
    *   `QUENTN_API_KEY`
    *   `NEXT_PUBLIC_ADMIN_DEV_PASSWORD`
6.  Click Deploy. Your app will be live on a production URL in minutes!

## Quentn API Details
You might need to adjust the specific payload structure inside `src/app/api/subscribe/route.ts` and `src/app/api/admin/broadcast/route.ts` depending on whether you are using Quentn's Contact tags or specific Campaign automation triggers. See the [Quentn API Docs](https://quentn.com/api).
