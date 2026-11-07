# NeuralBeatX Open Music Studio — ACE-Step 1.5

Public Node.js connector to the [ACE-Step 1.5](https://github.com/ace-step/ACE-Step-1.5) open-source music generation API (MIT license).

## Features
- Structured master-handoff JSON to lyrics, style, BPM, musical key and duration.
- Server-side ACE-Step REST integration: `POST /release_task`, `POST /query_result`, and streamed audio downloads through `/v1/audio`.
- Explicit operator approval per generation, no provider secrets in browser JavaScript.
- Export MP3, WAV or FLAC when the connected GPU supports them.
- Audio model requires a separately hosted GPU. Vercel runs the UI and controller, **not** ACE-Step inference. Open-source model does not imply free GPU hosting.

## Deploy on Vercel

1. Put `ace-connector.js` at `api/ace.js` in your Vercel project.
2. Host the ACE-Step API with `uv run acestep-api` on a machine with CUDA GPU, configure `ACESTEP_API_KEY` in the inference server and TLS HTTPS in front of it. ACE-Step docs: https://github.com/ace-step/ACE-Step-1.5/blob/main/docs/en/API.md
3. Create Vercel secret environment variables:
   - `ACESTEP_BASE_URL=https://your-own-gpu-service.example/`
   - `ACESTEP_API_KEY=<the-gpu-api-token>`
   - `NBX_OPERATOR_TOKEN=<random-secret-at-least-24-characters>`
4. Deploy and test `GET /api/ace?action=config`; use an authorized operator token for `GET /api/ace?action=health`.
5. Submit to `POST /api/ace?action=generate`, passing `approved:true` and a valid briefing, then poll `GET /api/ace?action=status&task_id=...` and fetch `GET /api/ace?action=download&task_id=...&index=0` with bearer authorization.

**Security and cost:** restrict the inference server with a key, use TLS, do not deploy unauthenticated public inference. GPU hosting may be billable; authorize each generation. This starter has no user database, billing ledger or distributed rate limiter; add these before offering a public multiuser service. Preserve ACE-Step license and required notices.

## Status
Source connector published; Vercel controller deployed. **No GPU endpoint or real AI song generation has been verified** in this environment.
