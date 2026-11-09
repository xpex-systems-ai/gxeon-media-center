import { useState } from "react";

const ID_RE = /^[A-Za-z0-9_-]{11}$/;

/** Aceita ID ou URL do YouTube; retorna ID válido ou null. */
export function parseYouTubeId(input: string): string | null {
  const s = input.trim();
  if (ID_RE.test(s)) return s;
  try {
    const u = new URL(s);
    const id = u.hostname.includes("youtu.be") ? u.pathname.slice(1) : u.searchParams.get("v") ?? u.pathname.split("/").pop() ?? "";
    return ID_RE.test(id) ? id : null;
  } catch { return null; }
}

/** Embed com consentimento: nada do YouTube carrega antes do clique. */
export function YouTubeEmbed({ video, title }: { video: string; title: string }) {
  const id = parseYouTubeId(video);
  const [ok, setOk] = useState(false);
  if (!id) return null;
  return (
    <div className="relative aspect-video overflow-hidden border bg-muted">
      {ok ? (
        <iframe className="absolute inset-0 h-full w-full" loading="lazy" title={title}
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
      ) : (
        <button onClick={() => setOk(true)} className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
          <span className="btn-brand !py-2 text-sm">▶ Carregar vídeo</span>
          <span className="text-xs text-muted-foreground">{title}<br />Ao carregar, o YouTube (modo privacidade) poderá coletar dados.</span>
        </button>
      )}
    </div>
  );
}