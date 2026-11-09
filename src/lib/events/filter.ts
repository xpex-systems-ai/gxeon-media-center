import type { Periodo, VerifiedEvent } from "./types";

const TZ_OFFSET_H = -3; // Brasília (sem horário de verão)

export function rangeFor(periodo: Periodo, now = new Date()) {
  const local = new Date(now.getTime() + TZ_OFFSET_H * 3600_000);
  const endOfDay = new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), 23, 59, 59) - TZ_OFFSET_H * 3600_000);
  const days = periodo === "hoje" ? 0 : periodo === "semana" ? 6 : 89;
  return { start: now, end: new Date(endOfDay.getTime() + days * 86400_000) };
}

/** Remove eventos expirados, fora do período, sem link ou sem fonte. */
export function cleanEvents(events: VerifiedEvent[], range: { start: Date; end: Date }) {
  const seen = new Set<string>();
  return events
    .filter((e) => {
      const t = new Date(e.startISO).getTime();
      if (!e.url?.startsWith("https://") || !e.source || Number.isNaN(t)) return false;
      if (t < range.start.getTime() - 3 * 3600_000 || t > range.end.getTime()) return false;
      if (seen.has(e.id)) return false;
      seen.add(e.id);
      return true;
    })
    .sort((a, b) => a.startISO.localeCompare(b.startISO));
}

export const REGIOES = [
  "Plano Piloto", "Asa Sul", "Asa Norte", "Lago Sul", "Lago Norte", "Sudoeste", "Guará", "Águas Claras",
  "Taguatinga", "Ceilândia", "Samambaia", "Sobradinho", "Planaltina", "Gama", "Santa Maria", "Núcleo Bandeirante", "Vicente Pires",
];

export function matchesRegiao(e: VerifiedEvent, regiao: string) {
  if (!regiao) return true;
  const n = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  return n(`${e.venue} ${e.city}`).includes(n(regiao));
}