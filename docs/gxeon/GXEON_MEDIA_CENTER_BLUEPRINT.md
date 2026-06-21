# GXEON Media Center Blueprint

## Product vision

GXEON Media Center is an **AI Media Operations Center** for content creation, avatars, campaigns, CRM, approvals, and evidence-led publishing.

**Operating principle:** Create with AI. Approve with humans. Publish with evidence. Scale with control.

The product direction is to turn this Odysseus fork into a controlled media operations foundation where AI assists production while humans retain approval authority over public output.

## Fork origin and upstream relationship

GXEON Media Center is based on a fork of Odysseus. The protected Odysseus workspace remains the operational base for authenticated tools, local data, model workflows, notes, documents, tasks, and administration.

This fork will preserve upstream attribution, license notices, and security boundaries while adding GXEON-specific public identity, media-operation documentation, and future modules.

## Media Center modules

- **Command Deck:** Operator overview for active work, approvals, alerts, and run status.
- **Content Factory:** AI-assisted drafting, briefs, content packages, and editorial workflows.
- **Avatar Studio:** Authorized avatar, voice, and presentation workflows with consent controls.
- **Video Clipper:** Source-aware clipping, repurposing, captioning, and review queues.
- **Campaign OS:** Campaign planning, content calendars, distribution readiness, and evidence links.
- **CRM Inbox:** Inbound messages, lead context, customer records, and response preparation.
- **Approval Queue:** Human review, policy checks, sign-off records, and release decisions.
- **Analytics and Evidence:** Published-content evidence, performance tracking, source references, and audit trails.

## Safe transformation boundaries

This foundation mission does not add external API connections, social posting, Stripe, Supabase, mass direct-message automation, spam automation, or secrets. Authentication for protected workspace areas must remain enabled unless explicitly configured by an operator for a local-only development environment.

Protected Odysseus functionality should be wrapped safely rather than removed. Existing routes and APIs continue to serve authenticated workspace users.

## Public, protected, and future-roadmap surfaces

### Public

- GXEON Media Center architecture shell at the public entry route.
- Public documentation describing product identity, safety policy, compliance posture, runtime assumptions, and roadmap.

### Protected

- Original Odysseus workspace routes and APIs.
- User data, notes, documents, gallery, tasks, memory, email, settings, tools, admin functions, API-token operations, and generated media.

### Future roadmap

- Operator Command Deck.
- Media-specific workflow modules.
- Approval and evidence ledger.
- Carefully scoped integrations after security, compliance, persistence, and auth controls are validated.
