# Railway Runtime Report

## Deployment status

The repository is prepared for Railway-style container deployment using the existing Dockerfile. This report documents runtime assumptions only; it does not confirm a live Railway deployment or connect to Railway services.

## Docker entrypoint and port

The Dockerfile exposes port `7000`, installs runtime dependencies, copies the application into `/app`, creates `data`, `logs`, and cache directories, and starts the app through `/usr/local/bin/entrypoint.sh` with `uvicorn app:app --host 0.0.0.0 --port 7000`.

Railway should route traffic to container port `7000` or set compatible environment values that preserve the same app port expectation.

## Current degraded or optional services

Optional runtime services may be unavailable unless configured by the operator:

- ChromaDB/vector memory can be degraded if Chroma dependencies, persistence, or service availability are missing.
- Browser MCP can be degraded if Node/browser tooling is unavailable, disabled, or not configured.
- External model, email, calendar, webhook, and search integrations may be degraded when credentials or local services are absent.

This foundation mission does not add external API keys or connect new providers.

## Required environment variables and configuration areas

Minimum runtime assumptions:

- `APP_PORT=7000` unless the platform injects an equivalent port and startup command is updated safely.
- `AUTH_ENABLED=true` for protected deployments.
- `LOCALHOST_BYPASS=false` for network-exposed deployments.
- Persistent storage for `/app/data` and `/app/logs`.

Additional optional settings remain governed by existing Odysseus setup documentation and should be added only when the relevant module is intentionally enabled.

## Persistence requirements

- `/app/data` must persist auth state, user data, databases, uploads, generated media metadata, and other workspace state.
- `/app/logs` must persist operational logs when long-term diagnostics or audit trails are required.

## Next steps before integrations

Before adding Supabase, Stripe, or social integrations:

1. Validate Railway boot and health checks on port `7000`.
2. Confirm authentication remains enabled for protected workspace routes.
3. Configure persistent volumes for `/app/data` and `/app/logs`.
4. Complete source/license compliance review for deployed artifacts.
5. Define integration threat models, secret management, rate limits, approval controls, and rollback procedures.
