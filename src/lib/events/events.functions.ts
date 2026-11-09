import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { cleanEvents, rangeFor } from "./filter";
import type { VerifiedEvent } from "./types";

export const getVerifiedEvents = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ periodo: z.enum(["hoje", "semana", "proximos"]) }).parse(d))
  .handler(async ({ data }) => {
    const { ticketmasterAdapter } = await import("./ticketmaster.server");
    const adapters = [ticketmasterAdapter];
    const range = rangeFor(data.periodo);
    const active = adapters.filter((a) => a.isConfigured());
    const all: VerifiedEvent[] = [];
    for (const a of active) {
      try { all.push(...(await a.fetch(range))); } catch { /* fonte indisponível: ignora */ }
    }
    return { events: cleanEvents(all, range), sources: active.map((a) => a.name), checkedAt: new Date().toISOString() };
  });