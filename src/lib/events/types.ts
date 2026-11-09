export type Periodo = "hoje" | "semana" | "proximos";

export interface VerifiedEvent {
  id: string;
  title: string;
  artists: string[];
  startISO: string; // ISO com fuso
  venue: string;
  city: string;
  url: string; // página pública do evento na fonte
  source: string; // nome da fonte auditável
}

export interface EventAdapter {
  name: string;
  isConfigured(): boolean;
  fetch(range: { start: Date; end: Date }): Promise<VerifiedEvent[]>;
}