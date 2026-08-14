# CivicPulse - Shivank's Citizen Frontend

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

## Backend handoff

Once the API contract is stable, replace the three methods in `src/services/issuesApi.js` (`list`, `getById`, `create`) with `fetch` calls. Preserve the returned issue shape used in `src/mock/issues.json`; all pages will then use the real API without component changes.

Suggested contract:

- `GET /issues` -> `Issue[]`
- `GET /issues/:id` -> `Issue`
- `POST /issues` -> created `Issue`

Required fields: `id`, `title`, `category`, `status`, `priority`, `createdAt`, `location`, `description`, `image`, `similarReports`, and `timeline`.
