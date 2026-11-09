import { createFileRoute, Link } from "@tanstack/react-router";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";

// Adicione aqui apenas URLs/IDs reais de vídeos autorizados pelo grupo.
const YOUTUBE_VIDEOS: { url: string; title: string }[] = [];
// Catálogo selecionado: apenas samba e pagode, com URLs verificadas em canais dos artistas.
type SambaVideo = { url: string; title: string; artist: string; genre: "samba" | "pagode"; city?: string };
const SAMBA_YOUTUBE: SambaVideo[] = [
  { url: "https://www.youtube.com/watch?v=xV8oWY60eEs", title: "Virou Religião / Poder de Sedução / Só Pra Ver Você Sambar (Ao Vivo)", artist: "Grupo Revelação", genre: "samba" },
  { url: "https://www.youtube.com/watch?v=tKB-jiW-mBU", title: "Virou Religião / Poder de Sedução / Só Pra Ver Você Sambar — Áudio Oficial", artist: "Grupo Revelação", genre: "samba" },
  { url: "https://www.youtube.com/watch?v=qV70vh3goD4", title: "Lapada Dela (No Churrasquinho de Brasília)", artist: "Grupo Menos é Mais", genre: "pagode", city: "Brasília" },
  { url: "https://www.youtube.com/watch?v=0_Ib-23mKfw", title: "Sinais (Sorriso Maroto As Antigas)", artist: "Sorriso Maroto", genre: "pagode" },
];
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { z } from "zod";
import hero from "@/assets/hero-pandeiro.svg";
import palco from "@/assets/palco-instrumentos.svg";

const IG = "https://www.instagram.com/surradepagode/";
const IG_DM = "https://ig.me/m/surradepagode";
const JBR = "https://jornaldebrasilia.com.br/viva/eventos/novos-projetos-fazem-as-segundas-perderem-a-fama-de-pior-dia-da-semana/";
const REEL = "https://www.instagram.com/reel/DfVdwHJOp_n/";
const EMBED_REEL = "https://www.instagram.com/reel/C4l6QCdPV-J/";
const VIBE = "https://www.vibeindex.com.br/event/brasilia-df-tchau-e-benca-6-de-novembro-nov-07-2026";
// Preencher somente após o grupo informar o WhatsApp comercial oficial (apenas dígitos, com DDI).
const WHATSAPP_OFICIAL = "";

const TITLE = "Surra de Pagode — O samba encontra Brasília | Contratação de shows";
const DESC = "Samba e pagode ao vivo em Brasília. Solicite proposta de show para bares, casas de eventos, festas particulares e eventos corporativos no DF.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org", "@type": "MusicGroup", name: "Surra de Pagode",
        genre: ["Samba", "Pagode"], sameAs: [IG], location: { "@type": "Place", name: "Brasília, DF" },
      }),
    }],
  }),
  component: Index,
});

const nav = [
  ["sobre", "Sobre"], ["shows", "Shows"], ["repertorio", "Repertório"], ["acao", "Em ação"], ["portfolio", "Portfólio"], ["sambayoutube", "Samba no YouTube"], ["presenca", "Redes sociais"], ["proposta", "Para casas"],
  ["agenda", "Agenda"], ["kit", "Press kit"], ["orcamento", "Orçamento"],
] as const;

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-t`} className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 md:py-28">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={`${id}-t`} className="mt-3 max-w-3xl text-4xl leading-tight md:text-5xl">{title}</h2>
      <div className="mt-10">{children}</div>
    </section>
  );
}


function InstagramReelEmbed({ url, label }: { url: string; label: string }) {
  useEffect(() => {
    const processEmbeds = () => {
      const instagram = (window as Window & { instgrm?: { Embeds?: { process?: () => void } } }).instgrm;
      instagram?.Embeds?.process?.();
    };
    const existing = document.querySelector('script[data-sdp-instagram-embed="true"]') as HTMLScriptElement | null;
    if (existing) {
      if ((window as Window & { instgrm?: unknown }).instgrm) processEmbeds();
      else existing.addEventListener("load", processEmbeds, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.dataset.sdpInstagramEmbed = "true";
    script.addEventListener("load", processEmbeds, { once: true });
    document.body.appendChild(script);
  }, []);

  return (
    <div className="flex min-w-0 flex-col items-center gap-3 overflow-hidden rounded-lg border border-brand/30 bg-card p-3">
      <div className="w-full max-w-[540px]">
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={url}
          data-instgrm-version="14"
          data-instgrm-captioned
          style={{ background: "#fff", border: 0, borderRadius: 3, margin: "1px auto", minWidth: 0, width: "100%", maxWidth: 540, padding: 0 }}
        >
          <div style={{ padding: 24, textAlign: "center", color: "#161616" }}>
            <p style={{ fontSize: 15, fontWeight: 700 }}>{label}</p>
            <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "#c91521", fontWeight: 700 }}>
              Ver este Reel no Instagram
            </a>
          </div>
        </blockquote>
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer" className="btn-outline-brand !px-3 !py-2 text-xs">
        Abrir vídeo no Instagram ↗
      </a>
    </div>
  );
}


type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
function PwaInstallButton({ large = false }: { large?: boolean }) {
  const [evt, setEvt] = useState<InstallEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    setInstalled(standalone);
    const capture = (e: Event) => { e.preventDefault(); setEvt(e as InstallEvent); };
    const onInstalled = () => { setInstalled(true); setEvt(null); };
    window.addEventListener("beforeinstallprompt", capture);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", capture);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);
  if (installed) return null;
  const click = async () => {
    if (evt) {
      await evt.prompt();
      try { if ((await evt.userChoice).outcome === "accepted") setEvt(null); } catch {}
      return;
    }
    setShowInstructions((v) => !v);
  };
  return <div className={large ? "relative" : "relative hidden sm:block"}>
    <button type="button" onClick={click} className={large ? "btn-brand" : "btn-outline-brand !px-3 !py-2 text-xs"}>📱 Instalar app</button>
    {showInstructions && <div role="status" className="absolute right-0 top-full z-50 mt-2 w-72 rounded-md border border-brand/50 bg-background p-4 text-sm shadow-xl">
      <strong>Instalar Surra de Pagode</strong>
      <p className="mt-2 text-muted-foreground">No Android com Chrome: menu ⋮ → Adicionar à tela inicial ou Instalar app. No iPhone com Safari: Compartilhar → Adicionar à Tela de Início.</p>
      <button type="button" className="mt-3 text-brand underline" onClick={() => setShowInstructions(false)}>Fechar</button>
    </div>}
  </div>;
}


function SambaYoutubeLibrary() {
  const [genre, setGenre] = useState<"todos" | "samba" | "pagode">("todos");
  const [artist, setArtist] = useState("todos");
  const [query, setQuery] = useState("");
  const [onlyBrasilia, setOnlyBrasilia] = useState(false);
  const artists = [...new Set(SAMBA_YOUTUBE.map((v) => v.artist))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  const normalize = (value: string) => value.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLocaleLowerCase("pt-BR");
  const q = normalize(query.trim());
  const videos = SAMBA_YOUTUBE.filter((v) =>
    (genre === "todos" || v.genre === genre) &&
    (artist === "todos" || v.artist === artist) &&
    (!onlyBrasilia || v.city === "Brasília") &&
    (!q || normalize(`${v.title} ${v.artist} ${v.genre} ${v.city ?? ""}`).includes(q))
  );
  return <div className="mt-8">
    <div className="grid gap-3 rounded-lg border border-brand/30 bg-card p-5 md:grid-cols-[1fr_auto]">
      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-brand">Buscar música ou artista</span>
        <input className="field" type="search" placeholder="Ex.: Revelação, Menos é Mais, Sinais..." value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Buscar vídeos de samba e pagode" />
      </label>
      <div className="flex items-end gap-2" aria-label="Filtrar estilo musical">
        {(["todos", "samba", "pagode"] as const).map((option) =>
          <button key={option} type="button" aria-pressed={genre === option} onClick={() => setGenre(option)}
            className={genre === option ? "btn-brand !px-3 !py-3 text-xs" : "btn-outline-brand !px-3 !py-3 text-xs"}>
            {option === "todos" ? "Todos" : option === "samba" ? "Samba" : "Pagode"}
          </button>
        )}
      </div>
      <label className="block text-xs font-semibold uppercase tracking-widest text-brand">
        Artista
        <select className="field mt-2" value={artist} onChange={(e) => setArtist(e.target.value)}>
          <option value="todos">Todos os artistas</option>
          {artists.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
      </label>
      <div className="flex items-end justify-between gap-4">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={onlyBrasilia} onChange={(e) => setOnlyBrasilia(e.target.checked)} />
          Gravado em Brasília
        </label>
        <button type="button" onClick={() => { setGenre("todos"); setArtist("todos"); setQuery(""); setOnlyBrasilia(false); }} className="text-xs text-brand underline">Limpar filtros</button>
      </div>
    </div>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground" role="status">{videos.length} {videos.length === 1 ? "vídeo encontrado" : "vídeos encontrados"} · catálogo selecionado de samba e pagode</p>
      <span className="text-xs text-muted-foreground">Player oficial YouTube · sem copiar arquivos</span>
    </div>
    {videos.length ? <div className="mt-5 grid gap-6 md:grid-cols-2">
      {videos.map((v) => <article key={v.url} className="overflow-hidden rounded-lg border border-brand/30 bg-card">
        <YouTubeEmbed video={v.url} title={v.title} />
        <div className="p-5">
          <p className="eyebrow">{v.genre === "samba" ? "Samba" : "Pagode"} · {v.city ?? "Brasil"}</p>
          <h3 className="mt-2 font-display text-xl">{v.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{v.artist} · canal do artista</p>
          <a className="btn-outline-brand mt-4 !py-2 text-xs" target="_blank" rel="noopener noreferrer" href={v.url}>Abrir no YouTube ↗</a>
        </div>
      </article>)}
    </div> : <div className="mt-6 rounded-lg border border-dashed border-brand/30 p-8 text-center">
      <h3 className="text-xl">Nenhum vídeo corresponde aos filtros</h3>
      <p className="mt-2 text-sm text-muted-foreground">Escolha outro estilo ou artista, ou limpe a busca. O catálogo é selecionado, não uma pesquisa irrestrita no YouTube.</p>
    </div>}
    <p className="mt-5 text-xs text-muted-foreground">Reprodução depende de o YouTube permitir a incorporação e de conexão à internet. Resultados limitados ao catálogo selecionado; pesquisa automática na plataforma exige integração da YouTube Data API.</p>
  </div>;
}

function Index() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 btn-brand">Pular para o conteúdo</a>
      <div className="bg-secondary px-4 py-1.5 text-center text-[11px] tracking-wide text-muted-foreground">
        Prévia comercial em desenvolvimento — aguardando aprovação do grupo
      </div>
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <a href="#topo" className="logo-surra"><img src="/surra-logo.svg" alt="" /> <span>SURRA <span className="text-brand">DE</span> PAGODE</span></a>
          <nav aria-label="Principal" className="hidden gap-6 text-sm lg:flex">
            {nav.map(([id, l]) => <a key={id} href={`#${id}`} className="text-muted-foreground hover:text-brand">{l}</a>)}
            <Link to="/agenda" search={{ periodo: "hoje", regiao: "" }} className="font-semibold text-brand">Pagode hoje</Link>
          </nav>
          <div className="flex items-center gap-2">
            <a href={IG} target="_blank" rel="noopener noreferrer" aria-label="Instagram @surradepagode" className="btn-outline-brand hidden !px-3 !py-2 text-sm sm:inline-flex">Instagram</a>
            <PwaInstallButton />
            <a href="#orcamento" className="btn-brand !px-3 !py-2 text-xs sm:text-sm">Contratar show</a>
            <button className="btn-outline-brand !px-3 !py-2 text-sm lg:hidden" aria-expanded={open} aria-controls="menu-m" onClick={() => setOpen(!open)}>Menu</button>
          </div>
        </div>
        {open && (
          <nav id="menu-m" aria-label="Menu móvel" className="border-t px-5 py-3 lg:hidden">
            {nav.map(([id, l]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="block py-2 text-muted-foreground">{l}</a>)}
            <Link to="/agenda" search={{ periodo: "hoje", regiao: "" }} className="block py-2 font-semibold text-brand">Onde tem pagode hoje?</Link>
          </nav>
        )}
      </header>

      <main id="conteudo">
        <section id="topo" className="relative isolate flex min-h-[88vh] items-end overflow-hidden">
          <img src={hero} alt="Pandeiro com platinelas douradas sobre fundo escuro (imagem ilustrativa)" width={1600} height={1008} fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover" />
          <div className="hero-overlay absolute inset-0 -z-10" />
          <div className="mx-auto w-full max-w-6xl px-5 pb-16 md:pb-24">
            <p className="eyebrow">Samba & pagode ao vivo · Distrito Federal</p>
            <h1 className="mt-4 text-5xl leading-[1.02] md:text-8xl">SURRA DE PAGODE</h1>
            <p className="mt-3 font-display text-2xl italic text-brand md:text-4xl">O samba encontra Brasília</p>
            <p className="mt-6 max-w-xl text-muted-foreground">Roda de samba e pagode para bares, casas de eventos, festas e produtores no DF.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#orcamento" className="btn-brand text-lg">Contratar show</a>
              <a href="#orcamento" className="btn-outline-brand">Solicitar proposta de show</a>
              <a href={IG} target="_blank" rel="noopener noreferrer" className="btn-outline-brand">Ver Instagram @surradepagode</a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-brand/30 bg-card p-5">
            <div><p className="eyebrow">Seu pagode na palma da mão</p><h2 className="mt-2 font-display text-2xl">Surra de Pagode App</h2><p className="mt-2 max-w-xl text-sm text-muted-foreground">Acompanhe os vídeos, descubra o pagode em Brasília e consulte shows pelo celular.</p></div>
            <PwaInstallButton large />
          </div>
        </section>
        <Section id="sobre" eyebrow="Sobre / história" title="Um projeto de samba que ocupa a cidade.">
          <div className="grid gap-10 md:grid-cols-2">
            <div className="space-y-5 leading-relaxed text-muted-foreground">
              <p>Segundo reportagem do <strong className="text-foreground">Jornal de Brasília</strong> publicada em 18/08/2023, o Surra de Pagode foi idealizado por <strong className="text-foreground">João Guilherme e Alexandre Martins</strong>, com apresentações em regiões como Sobradinho, Planaltina e Ceilândia.</p>
              <p>Essas apresentações fazem parte da história do projeto — não representam agenda atual.</p>
              <a href={JBR} target="_blank" rel="noopener noreferrer" className="inline-block text-brand underline underline-offset-4">Ler reportagem (Jornal de Brasília, 18/08/2023)</a>
            </div>
            <img src={palco} alt="Cavaquinho, surdo e tantã em palco com luzes douradas (imagem ilustrativa)" loading="lazy" width={1408} height={1008} className="aspect-[4/3] w-full rounded object-cover" />
          </div>
          <p className="mt-6 text-xs text-muted-foreground">Imagens deste site são ilustrativas — não retratam os integrantes do grupo. Não confundir com o projeto “Surra de Modão”.</p>
        </Section>

        <Section id="shows" eyebrow="Shows e formatos" title="Formatos de contratação">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["Bares e casas", "Programação recorrente ou datas especiais para casas de samba, bares e casas de show."],
              ["Eventos particulares", "Aniversários, casamentos, confraternizações e festas com roda de pagode ao vivo."],
              ["Eventos corporativos", "Happy hours, festas de fim de ano e ativações de marca com música brasileira."],
            ].map(([t, d]) => (
              <article key={t} className="border bg-card p-7">
                <h3 className="text-2xl">{t}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{d}</p>
                <p className="mt-5 text-xs uppercase tracking-widest text-brand">Formato e duração sob consulta</p>
              </article>
            ))}
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="border-l-2 border-brand pl-5">
              <h3 className="text-xl">Música ao vivo</h3>
              <p className="mt-2 text-sm text-muted-foreground">Samba e pagode tocados ao vivo, com instrumentação de roda.</p>
            </div>
            <div className="border-l-2 border-brand pl-5">
              <h3 className="text-xl">Experiência de palco</h3>
              <p className="mt-2 text-sm text-muted-foreground">Histórico público de apresentações no DF (<a className="text-brand underline" href={JBR} target="_blank" rel="noopener noreferrer">Jornal de Brasília, 2023</a>) e presença no line-up do evento Tchau e Bença, no Complexo Fora do Eixo, em 06/11/2026 (<a className="text-brand underline" href={VIBE} target="_blank" rel="noopener noreferrer">fonte</a>).</p>
            </div>
          </div>
        </Section>

        <Section id="repertorio" eyebrow="Repertório" title="Gêneros que conduzem a roda">
          <ul className="flex flex-wrap gap-3">
            {["Samba", "Pagode", "Samba de raiz", "Pagode anos 90", "Partido-alto", "Samba-enredo"].map((g) => (
              <li key={g} className="border px-5 py-2.5 font-display text-lg">{g}</li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">Setlist detalhado a confirmar com a produção, conforme o perfil do evento.</p>
        </Section>

        <Section id="acao" eyebrow="Vídeos públicos no Instagram" title="Veja a banda em ação">
          <div className="grid gap-6 md:grid-cols-2">
            <InstagramReelEmbed url={REEL} label="Surra de Pagode — Reel em destaque" />
            <InstagramReelEmbed url={EMBED_REEL} label="Surra de Pagode — Apresentação" />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Os dois vídeos são incorporados do Instagram oficial por meio do player autorizado pela plataforma. Se a reprodução for bloqueada no navegador, use os botões para abrir as publicações originais.</p>
        </Section>

        <Section id="portfolio" eyebrow="Portfólio e vídeos" title="Galeria em atualização">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {YOUTUBE_VIDEOS.map((v) => <YouTubeEmbed key={v.url} video={v.url} title={v.title} />)}
            {YOUTUBE_VIDEOS.length === 0 && [1, 2, 3].map((n) => (
              <div key={n} role="img" className="flex aspect-video flex-col items-center justify-center border border-dashed bg-muted text-center" aria-label={`Espaço para vídeo ${n}, em atualização`}>
                <span className="eyebrow">Em atualização</span>
                <span className="mt-2 text-xs text-muted-foreground">Vídeo {n} — aguardando conteúdo autorizado</span>
              </div>
            ))}
          </div>
          <a href={IG} target="_blank" rel="noopener noreferrer" className="btn-outline-brand mt-8">Ver vídeos no Instagram</a>
        </Section>

        <Section id="sambayoutube" eyebrow="Videoteca · YouTube oficial" title="Samba & Pagode — Assista aqui">
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Videoteca com seleção exclusiva de samba e pagode, reproduzidos no player incorporado do YouTube.
            Filtre por estilo, artista ou nome da música. Os vídeos são de terceiros e permanecem vinculados aos canais de origem.
          </p>
          <SambaYoutubeLibrary />
          <div className="mt-8 flex flex-wrap items-center gap-3 rounded border border-brand/20 bg-card p-5">
            <p className="flex-1 text-sm text-muted-foreground">É do Surra de Pagode e tem um vídeo no YouTube? Envie o link oficial para entrar na seleção da banda.</p>
            <a href={IG_DM} target="_blank" rel="noopener noreferrer" className="btn-brand !py-2 text-xs">Indicar vídeo</a>
          </div>
        </Section>

        <Section id="presenca" eyebrow="Presença digital" title="O pagode continua nas redes">
          <div className="grid items-center gap-10 rounded-lg border border-brand/40 bg-card p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:p-10">
            <div className="mx-auto w-full max-w-sm overflow-hidden rounded-xl border border-white/10 bg-[#0b0e12] shadow-2xl">
              <a href={IG} target="_blank" rel="noopener noreferrer" aria-label="Abrir Instagram do Surra de Pagode">
                <img src="/instagram-surradepagode.webp" alt="Captura real do Instagram @surradepagode mostrando perfil e publicações musicais, imagem ilustrativa do perfil em novembro de 2026" loading="lazy" width="172" height="290" className="block w-full" />
              </a>
              <p className="px-4 py-3 text-center text-xs text-muted-foreground">Captura do perfil em 09/11/2026. Dados sujeitos a mudanças.</p>
            </div>
            <div>
              <p className="eyebrow">@surradepagode · Brasília, DF</p>
              <h3 className="mt-4 font-display text-3xl md:text-4xl">Acompanhe o Surra de Pagode</h3>
              <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">Veja os vídeos, as rodas de samba, bastidores e novidades divulgadas no perfil do grupo. Acompanhe as publicações diretamente na fonte oficial.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href={IG} target="_blank" rel="noopener noreferrer" className="btn-brand">Ver Instagram oficial ↗</a>
                <a href={REEL} target="_blank" rel="noopener noreferrer" className="btn-outline-brand">Assistir Reel em destaque ↗</a>
              </div>
              <p className="mt-5 text-xs text-muted-foreground">Prévia comercial em desenvolvimento — aguardando aprovação da banda.</p>
            </div>
          </div>
        </Section>

        <Section id="proposta" eyebrow="Apoio operacional" title="Nossa proposta comercial para casas de show">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["EPK", "Kit de imprensa com release, fotos oficiais e vídeos autorizados — em montagem com o grupo."],
              ["Agenda", "Datas fixas, residência semanal ou eventos pontuais. Disponibilidade confirmada pela produção."],
              ["Operação", "Ficha técnica, duração, formação e condições comerciais sob consulta."],
            ].map(([t, d]) => (
              <article key={t} className="border-t-4 border-brand bg-card p-7">
                <h3 className="text-2xl">{t}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{d}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#orcamento" className="btn-brand">Contratar show</a>
            <a href="#kit" className="btn-outline-brand">Ver ficha técnica</a>
          </div>
        </Section>

        <section className="mx-auto max-w-6xl px-5">
          <Link to="/agenda" search={{ periodo: "hoje", regiao: "" }} className="block border-2 border-brand bg-card p-8 transition hover:bg-muted md:flex md:items-center md:justify-between">
            <span><span className="eyebrow">Agenda cultural</span><span className="mt-2 block font-display text-3xl">Onde tem pagode em Brasília hoje?</span></span>
            <span className="btn-brand mt-5 md:mt-0">Ver agenda verificada →</span>
          </Link>
        </section>

        <Section id="agenda" eyebrow="Agenda" title="Consulte disponibilidade">
          <div className="border bg-card p-8 md:flex md:items-center md:justify-between">
            <p className="max-w-xl text-muted-foreground">As datas são confirmadas diretamente com a produção. Envie a data do seu evento para verificarmos a disponibilidade.</p>
            <a href="#orcamento" className="btn-brand mt-6 md:mt-0">Consultar data</a>
          </div>
        </Section>

        <Section id="kit" eyebrow="Kit de contratação" title="Press kit & ficha técnica">
          <dl className="grid gap-px border bg-border sm:grid-cols-2">
            {[
              ["Formação", "A confirmar com produção"], ["Duração do show", "A confirmar com produção"],
              ["Rider técnico / som", "A confirmar com produção"], ["Camarim e logística", "A confirmar com produção"],
              ["Release e fotos oficiais", "Em atualização"], ["Área de atuação", "Distrito Federal e entorno (sob consulta)"],
            ].map(([k, v]) => (
              <div key={k} className="bg-background p-6"><dt className="eyebrow">{k}</dt><dd className="mt-2 text-muted-foreground">{v}</dd></div>
            ))}
          </dl>
          <div className="mt-12 border border-brand/40 p-8">
            <h3 className="text-2xl">Para contratantes</h3>
            <ul className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
              <li><strong className="text-foreground">Escopo:</strong> definido conforme o tipo de evento.</li>
              <li><strong className="text-foreground">Duração:</strong> sob consulta.</li>
              <li><strong className="text-foreground">Formação:</strong> sob consulta.</li>
            </ul>
          </div>
        </Section>

        <Section id="orcamento" eyebrow="Orçamento" title="Solicitar proposta de show">
          <QuoteForm />
        </Section>
      </main>

      <footer className="border-t pb-20 md:pb-0">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 text-sm text-muted-foreground md:flex-row md:justify-between">
          <p><span className="font-display text-lg text-foreground">Surra de Pagode</span> · Brasília, DF</p>
          <p>Prévia comercial não oficial — aguardando aprovação do grupo.</p>
          <a href={IG} target="_blank" rel="noopener noreferrer" className="text-brand">@surradepagode</a>
        </div>
      </footer>

      <a href="#orcamento" className="btn-brand fixed bottom-4 right-4 z-40 shadow-lg md:hidden">Contratar show</a>
    </>
  );
}

const schema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(100),
  local: z.string().trim().min(2, "Informe o local").max(150),
  data: z.string().min(1, "Informe a data"),
  tipo: z.string().min(1, "Escolha o tipo"),
  telefone: z.string().trim().regex(/^[0-9()+\-\s]{8,20}$/, "Telefone inválido"),
  mensagem: z.string().trim().max(1000).optional(),
});

function QuoteForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState(false);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const r = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    setErrors({});
    const d = r.data;
    const text = `Olá, Surra de Pagode! Gostaria de uma proposta de show.\nNome: ${d.nome}\nLocal: ${d.local}\nData: ${d.data.split("-").reverse().join("/")}\nTipo: ${d.tipo}\nTelefone: ${d.telefone}${d.mensagem ? `\nDetalhes: ${d.mensagem}` : ""}`;
    setMsg(text);
    setCopied(false);
    navigator.clipboard?.writeText(text).then(() => setCopied(true)).catch(() => {});
  }

  const f = (name: string, label: string, el: ReactNode) => (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium">{label}</span>
      {el}
      {errors[name] && <span role="alert" className="mt-1 block text-xs text-destructive">{errors[name]}</span>}
    </label>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
        {f("nome", "Nome", <input name="nome" className="field" autoComplete="name" maxLength={100} />)}
        {f("telefone", "Telefone", <input name="telefone" type="tel" className="field" autoComplete="tel" maxLength={20} />)}
        {f("local", "Local do evento", <input name="local" className="field" maxLength={150} />)}
        {f("data", "Data", <input name="data" type="date" className="field" />)}
        <div className="sm:col-span-2">{f("tipo", "Tipo de evento", (
          <select name="tipo" className="field" defaultValue="">
            <option value="" disabled>Selecione</option>
            <option>Bar / casa de show</option><option>Evento particular</option><option>Evento corporativo</option><option>Outro</option>
          </select>))}</div>
        <div className="sm:col-span-2">{f("mensagem", "Detalhes (opcional)", <textarea name="mensagem" rows={4} className="field" maxLength={1000} />)}</div>
        <button type="submit" className="btn-brand sm:col-span-2">Montar mensagem de proposta</button>
      </form>
      <aside className="border bg-card p-7" aria-live="polite">
        <h3 className="text-2xl">Contato comercial</h3>
        <p className="mt-3 text-sm text-muted-foreground">Por enquanto, o contato comercial é feito por mensagem direta no Instagram. Preencha o formulário: a mensagem é copiada e você cola na DM.</p>
        {msg && (
          <div className="mt-5">
            <pre className="whitespace-pre-wrap border bg-muted p-4 text-xs">{msg}</pre>
            <p className="mt-2 text-xs text-brand">{copied ? "Mensagem copiada!" : "Copie a mensagem acima."}</p>
          </div>
        )}
        <div className="mt-6 flex flex-col gap-3">
          <a href={IG_DM} target="_blank" rel="noopener noreferrer" className="btn-brand">Enviar DM no Instagram</a>
          {WHATSAPP_OFICIAL && msg && (
            <a href={`https://wa.me/${WHATSAPP_OFICIAL}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener noreferrer" className="btn-outline-brand">Enviar por WhatsApp</a>
          )}
        </div>
      </aside>
    </div>
  );
}