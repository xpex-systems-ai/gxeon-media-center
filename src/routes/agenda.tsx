import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { getVerifiedEvents } from "@/lib/events/events.functions";
import { matchesRegiao, REGIOES } from "@/lib/events/filter";

const search = z.object({
  periodo: z.enum(["hoje", "semana", "proximos"]).catch("hoje"),
  regiao: z.string().max(40).catch(""),
});

const TITLE = "Onde tem pagode em Brasília hoje? | Surra de Pagode — Booking";
const DESC = "Agenda de samba e pagode em Brasília/DF com eventos verificados de fontes públicas, filtros por dia e região.";

export const Route = createFileRoute("/agenda")({
  validateSearch: (s) => search.parse(s),
  loaderDeps: ({ search }) => ({ periodo: search.periodo }),
  loader: ({ deps }) => getVerifiedEvents({ data: { periodo: deps.periodo } }),
  head: () => ({
    meta: [
      { title: TITLE }, { name: "description", content: DESC },
      { property: "og:title", content: TITLE }, { property: "og:description", content: DESC },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/agenda" }],
  }),
  component: Agenda,
});

const EXTERNAS = [
  ["Sympla — pagode em Brasília", "https://www.sympla.com.br/eventos/brasilia-df?s=pagode"],
  ["Sympla — samba em Brasília", "https://www.sympla.com.br/eventos/brasilia-df?s=samba"],
  ["Ticketmaster Brasil", "https://www.ticketmaster.com.br/"],
  ["Google — pagode hoje em Brasília", "https://www.google.com/search?q=pagode+hoje+bras%C3%ADlia"],
] as const;

const fmt = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", weekday: "short", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

function Agenda() {
  const { events, sources, checkedAt } = Route.useLoaderData();
  const { periodo, regiao } = Route.useSearch();
  const nav = useNavigate({ from: "/agenda" });
  const list = events.filter((e) => matchesRegiao(e, regiao));

  return (
    <>
      <div className="bg-secondary px-4 py-1.5 text-center text-[11px] text-muted-foreground">Prévia comercial em desenvolvimento — aguardando aprovação do grupo</div>
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
          <Link to="/" className="font-display text-lg">Surra <span className="italic text-brand">de</span> Pagode</Link>
          <Link to="/" hash="orcamento" className="btn-brand !px-3 !py-2 text-xs sm:text-sm">Contratar Surra de Pagode</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-14">
        <p className="eyebrow">Agenda cultural · Brasília/DF</p>
        <h1 className="mt-3 text-4xl md:text-6xl">Onde tem pagode em Brasília hoje?</h1>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground">Somente eventos verificados em fontes públicas. A listagem não indica participação do Surra de Pagode.</p>

        <div className="mt-8 flex flex-wrap items-center gap-2" role="group" aria-label="Período">
          {([["hoje", "Hoje"], ["semana", "Esta semana"], ["proximos", "Próximos eventos"]] as const).map(([v, l]) => (
            <button key={v} aria-pressed={periodo === v} onClick={() => nav({ search: { periodo: v, regiao } })}
              className={periodo === v ? "btn-brand !py-2 text-sm" : "btn-outline-brand !py-2 text-sm"}>{l}</button>
          ))}
          <label className="ml-auto text-sm">
            <span className="sr-only">Região</span>
            <select className="field !py-2" value={regiao} onChange={(e) => nav({ search: { periodo, regiao: e.target.value } })}>
              <option value="">Todas as regiões</option>
              {REGIOES.map((r) => <option key={r}>{r}</option>)}
            </select>
          </label>
        </div>

        {list.length > 0 ? (
          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {list.map((e) => (
              <li key={e.id} className="flex flex-col border bg-card p-6">
                <p className="eyebrow">{fmt.format(new Date(e.startISO))}</p>
                <h2 className="mt-2 text-xl">{e.title}</h2>
                {e.artists.length > 0 && <p className="mt-1 text-sm">{e.artists.join(", ")}</p>}
                <p className="mt-2 text-sm text-muted-foreground">{e.venue}{e.city && ` · ${e.city}`}</p>
                <p className="mt-3 text-xs text-muted-foreground">Fonte: {e.source}</p>
                <a href={e.url} target="_blank" rel="noopener noreferrer" className="btn-outline-brand mt-5 !py-2 text-sm">Ver evento ↗</a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 border border-dashed p-10 text-center">
            <h2 className="text-2xl">Nenhum evento confirmado para este filtro</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
              {sources.length ? `Consultamos: ${sources.join(", ")}.` : "Nenhuma fonte automática está ativa no momento."} Preferimos não listar nada a mostrar dados não verificados.
            </p>
          </div>
        )}

        <section className="mt-14" aria-labelledby="ext">
          <h2 id="ext" className="text-2xl">Abrir agenda externa</h2>
          <p className="mt-2 text-xs text-muted-foreground">Pesquisas públicas em sites de terceiros — resultados não verificados por este site.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {EXTERNAS.map(([l, u]) => <a key={u} href={u} target="_blank" rel="noopener noreferrer" className="btn-outline-brand !py-2 text-sm">{l} ↗</a>)}
          </div>
        </section>

        <aside className="mt-14 border-l-4 border-brand bg-card p-8">
          <p className="eyebrow">Para casas e produtores</p>
          <h2 className="mt-2 text-3xl">Quer pagode ao vivo no seu evento?</h2>
          <p className="mt-2 text-sm text-muted-foreground">Leve o Surra de Pagode para a sua casa, festa ou evento corporativo.</p>
          <Link to="/" hash="orcamento" className="btn-brand mt-5">Contratar Surra de Pagode</Link>
        </aside>
        <p className="mt-8 text-[11px] text-muted-foreground">Última verificação: {fmt.format(new Date(checkedAt))}</p>
      </main>
    </>
  );
}