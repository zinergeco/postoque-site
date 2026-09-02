# postoque-site

Public site for postoque.com — landing page, demo login, and an authenticated
feature-preview dashboard showing the PostoQue module lineup.

## Stack

Node.js + Express + EJS views, session-based auth (`express-session`), single
demo account checked against a bcrypt hash. No database — this is a marketing
site with a gated preview, not the product itself.

## Environment variables

Set these in Coolify (never commit real values):

| Variable | Purpose |
|---|---|
| `PORT` | Port the server listens on (defaults to `3000`). |
| `SESSION_SECRET` | Long random string used to sign session cookies. |
| `DEMO_USER_EMAIL` | Email for the single demo account. |
| `DEMO_USER_PASSWORD_HASH` | bcrypt hash of the demo password. Generate with `node scripts/hash-password.js "the-password"`. |

## Local development

```bash
npm install
cp .env.example .env   # fill in SESSION_SECRET and DEMO_USER_PASSWORD_HASH
node scripts/hash-password.js "your-demo-password"   # paste the output into .env
npm start
```

Visit http://localhost:3000.

## Deployment

Built and run via the included `Dockerfile` (Coolify auto-detects it). The
container listens on `PORT` (default `3000`) — make sure Coolify's "Ports
exposes" matches, and the host port mapping points at whatever port your
reverse proxy expects.
