# CivicPulse -  Frontend

This is the citizen-facing React + Tailwind prototype for the CivicPulse hackathon. It intentionally contains no backend implementation.

## Included scope

- Citizen Home, Report Issue, My Reports, and Issue Details routes
- Responsive navigation, issue cards, badges, modal, loading and error states
- Mock-first report flow with seeded JSON
- A single API seam in `src/services/issuesApi.js`

## Run locally

1. Install Node.js 20 or later.
2. Open a terminal in this folder.
3. Run `npm install`.
4. Run `npm run dev` and open the URL Vite prints (usually `http://localhost:5173`).
5. For a production check, run `npm run build`.

## Email verification

Registration now creates an unverified account and sends a six-digit verification code. The code is hashed in the server's temporary cache, expires after 10 minutes, permits five attempts, and is removed after successful verification. A fresh code can be requested once per minute. Unverified accounts cannot sign in or access protected pages.

1. Copy `.env.example` to `.env` and fill in a Gmail address plus a Gmail App Password (or your SMTP provider settings).
2. Run `npm install`.
3. In one terminal run `npm run server`; in another run `npm run dev`.

The prototype uses an in-memory server cache because no database or Redis service exists in this repository. It intentionally does not persist OTPs to disk; for a multi-instance deployment, replace `pendingOtps` with Redis and replace the in-memory `users` map with the application's database.

## Backend handoff

Once the API contract is stable, replace the three methods in `src/services/issuesApi.js` (`list`, `getById`, `create`) with `fetch` calls. Preserve the returned issue shape used in `src/mock/issues.json`; all pages will then use the real API without component changes.

Suggested contract:

- `GET /issues` -> `Issue[]`
- `GET /issues/:id` -> `Issue`
- `POST /issues` -> created `Issue`

Required fields: `id`, `title`, `category`, `status`, `priority`, `createdAt`, `location`, `description`, `image`, `similarReports`, and `timeline`.
