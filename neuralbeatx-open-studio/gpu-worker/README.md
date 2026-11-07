# NeuralBeatX GPU Worker — ACE-Step 1.5

## Status (7 November 2026)
Worker **provisioning package**, not an active GPU deployment. The NeuralBeatX Vercel UI and `/api/ace` proxy are published; no GPU endpoint is configured or verified. Do not claim music-with-vocals works until the smoke test below succeeds.

## Architecture
- Vercel project: `neuralbeatx-open-studio` — UI, authentication and API orchestration.
- Public-source model: [ACE-Step 1.5](https://github.com/ace-step/ACE-Step-1.5), MIT licensed, cloned from official repository in the Docker build.
- **Your GPU server**: Docker Compose starts ACE-Step's official CUDA container and Caddy for HTTPS.
- Vercel secrets: `ACESTEP_BASE_URL`, `ACESTEP_API_KEY`, `NBX_OPERATOR_TOKEN`.
- `ACESTEP_API_KEY` must match the GPU worker key. Use a different high-entropy value for `NBX_OPERATOR_TOKEN`.

## Provisioning (requires an authorized GPU account/server)
1. Choose a server with NVIDIA CUDA GPU, ideally **at least 8 GB VRAM**, 10+ GB free disk and NVIDIA Container Toolkit. Official docs list ≥4 GB for DiT-only and ≥6 GB for DiT+LM, with performance/quality tradeoffs. Account for docker/image/model sizes and storage separately.
2. Point `NBX_GPU_DOMAIN` DNS A record to the GPU server IP; open TCP ports 80 and 443.
3. Copy this directory to the server, run `cp .env.example .env`, set domain and a random API key, and ensure `.env` is excluded from version control.
4. Install Docker/Compose and NVIDIA Container Toolkit on the GPU host; verify `docker run --rm --gpus all nvidia/cuda:12.8.1-runtime-ubuntu22.04 nvidia-smi` works (or use a compatible CUDA test image).
5. Execute `docker compose --env-file .env up -d --build`. Initial build and model download can take time; `docker compose logs -f acestep` for diagnosis.
6. Check `curl -fsS https://YOUR_GPU_DOMAIN/health`. Authentication may be required depending on the ACE-Step API version; use `-H "Authorization: Bearer $ACESTEP_API_KEY"` to test securely.
7. In the **existing Vercel** `neuralbeatx-open-studio` production settings configure secret env vars:
   - `ACESTEP_BASE_URL=https://YOUR_GPU_DOMAIN/`
   - `ACESTEP_API_KEY` to the private GPU worker API key
   - `NBX_OPERATOR_TOKEN` to another long private random operator key
8. Redeploy Vercel after setting env vars. Visit `https://neuralbeatx-open-studio.vercel.app/`, navigate to **Motor ACE-Step** and use the **Testar servidor GPU** control. Only after a successful check is vocal music generation enabled.
9. Test one short 15–30 s song with original lyrics and explicit approval; verify task ID, completion and MP3 download. Hosting/usage may incur expenses.

## API paths
The upstream official server exposes `GET /health`, `POST /release_task`, `POST /query_result`, and `GET /v1/audio?path=...`. The Vercel proxy implements `/api/ace?action=config|health|generate|status|download` and requires `Authorization: Bearer <NBX_OPERATOR_TOKEN>` for non-public operations.

## Safety and limits
- No secrets in browser source or GitHub.
- This is an **operator-only** first version; no user accounts, production billing ledger, per-account quotas or multi-tenant permissions. Do not open paid generation to the public without these controls.
- Prefer version-pinning the upstream ACE-Step commit SHA after first successful test; the `main` Git context can change between builds.
- Never expose the raw worker's API without API key enforcement, rate limits and HTTPS.
- A public demonstration Space is not a substitute for a production private endpoint.
- No streaming distribution to Spotify/Apple/Deezer is implied. Use authorized distributors and proper licensing.
