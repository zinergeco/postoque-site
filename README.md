# postoque.com — coming soon page

A single static page (`index.html`), containerised with `Dockerfile` (nginx:alpine), deployed the same way `realvian.co.uk` and TuringMinds already are: Coolify builds straight from this repo's `Dockerfile` on the target server — no GitHub Actions or GHCR in the loop.

## How it's actually wired (confirmed against the live Coolify instance)

- **Coolify control plane**: `164.5.249.70:8000` (separate box from the app server).
- **Target/app server**: `turingminds-live-p16g`, IP `94.72.141.68` — the same server already running `realvian-app` and the TuringMinds resources.
- **Git source**: the `turing-minds-uk` GitHub App connection already installed in Coolify (Sources → turing-minds-uk), granted access to this repo.
- **Build strategy**: `Dockerfile`, base directory `/`, Dockerfile location `/Dockerfile`, builder = deployment server (matches `realvian-app`'s config exactly).
- **Domain**: `postoque.com`, TLS via Coolify's Let's Encrypt integration.
- **Auto-deploy**: Coolify's GitHub webhook redeploys on every push to `main` — no manual GHCR push step.

## Deploy steps

1. Push this folder to `zinergeco/postoque-site` on GitHub (done).
2. In Coolify → Sources → `turing-minds-uk`, make sure `zinergeco/postoque-site` is in the GitHub App's repository access list.
3. Coolify → Projects → new project (or add to an existing one) → New Resource → Public/private Git repository via the `turing-minds-uk` source → pick `zinergeco/postoque-site`, branch `main`.
4. Set Build strategy to `Dockerfile` (base directory `/`, Dockerfile location `/Dockerfile`), server `turingminds-live-p16g`.
5. Add domain `postoque.com` under Domains; enable Let's Encrypt.
6. Deploy. Confirm the GitHub webhook is registered so future pushes auto-redeploy.
7. Visit `postoque.com` to confirm it's live.

This mirrors the deployment pattern documented in `postoque-app-development-guide.md` §10 in spirit (Docker container, Coolify-managed, same target server) — the one correction against that doc is that Coolify builds the Dockerfile directly rather than pulling a pre-built GHCR image, which is simpler and is what's actually running today for realvian.co.uk and TuringMinds.
