import type { EventAdapter, VerifiedEvent } from "./types";

// Docs: https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/
const iso = (d: Date) => d.toISOString().replace(/\.\d{3}Z$/, "Z");

export const ticketmasterAdapter: EventAdapter = {
  name: "Ticketmaster",
  isConfigured: () => Boolean(process.env["TICKETMASTER_API_KEY"]),
  async fetch({ start, end }) {
    const key = process.env["TICKETMASTER_API_KEY"];
    if (!key) return [];
    const out: VerifiedEvent[] = [];
    for (const keyword of ["pagode", "samba"]) {
      const q = new URLSearchParams({
        apikey: key, keyword, latlong: "-15.7939,-47.8828", radius: "60", unit: "km",
        startDateTime: iso(start), endDateTime: iso(end), size: "50", sort: "date,asc", locale: "*",
      });
      const res = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?${q}`);
      if (!res.ok) continue;
      const json = (await res.json()) as any;
      for (const ev of json?._embedded?.events ?? []) {
        const v = ev._embedded?.venues?.[0];
        const startISO = ev.dates?.start?.dateTime;
        if (!startISO || !ev.url) continue;
        out.push({
          id: `tm-${ev.id}`, title: ev.name, startISO, url: ev.url, source: "Ticketmaster",
          artists: (ev._embedded?.attractions ?? []).map((a: any) => a.name),
          venue: v?.name ?? "Local na página do evento", city: v?.city?.name ?? "",
        });
      }
    }
    return out;
  },
};