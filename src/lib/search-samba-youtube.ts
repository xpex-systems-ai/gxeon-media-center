import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  query: z.string().trim().max(100).default(""),
  genre: z.enum(["todos", "samba", "pagode"]).default("todos"),
  pageToken: z.string().max(200).optional(),
});
const pagodeTerms = /pagode|samba|partido.alto|roda de samba|sambista|revela[cç][aã]o|sorriso maroto|menos [eé] mais|fundo de quintal|zeca pagodinho|thiaguinho|p[eé]ricles|exaltasamba|belo|ferrugem|pixote|art popular|turma do pagode|dilsinho|di prop[oó]sito|imaginasamba|ra[cç]a negra|s[oó] pra contrariar|mumuzinho|jorge arag[aã]o|alcione|beth carvalho|ar[líi]ndo cruz|martinho da vila/i;
const excludedTerms = /tutorial|aula de viol[aã]o|react|gameplay|pegadinha|not[ií]cias|entrevista|podcast|notici[aá]rio|cover de funk|sertanejo|trap|forr[oó]|gospel|shorts de humor/i;
type Video = { id: string; title: string; artist: string; thumbnail: string; publishedAt: string; genre: "samba" | "pagode" };
type YoutubeResponse = { videos: Video[]; nextPageToken?: string; configured: boolean; notice?: string };
const cache = new Map<string, { expires: number; data: YoutubeResponse }>();

export const searchSambaYoutube = createServerFn({ method: "GET" })
  .inputValidator(inputSchema)
  .handler(async ({ data }): Promise<YoutubeResponse> => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) return { videos: [], configured: false, notice: "Busca automática indisponível: configure YOUTUBE_API_KEY no servidor." };
    const query = data.query.replace(/[<>]/g, "").trim();
    const searchText = [data.genre === "todos" ? "samba pagode" : data.genre, query].filter(Boolean).join(" ");
    const cacheKey = JSON.stringify([searchText, data.pageToken ?? ""]);
    const cached = cache.get(cacheKey);
    if (cached && cached.expires > Date.now()) return cached.data;
    const params = new URLSearchParams({
      key: apiKey, part: "snippet", type: "video", maxResults: "30",
      q: searchText, regionCode: "BR", relevanceLanguage: "pt",
      videoEmbeddable: "true", videoSyndicated: "true", safeSearch: "moderate",
      videoCategoryId: "10",
    });
    if (data.pageToken) params.set("pageToken", data.pageToken);
    const response = await fetch("https://www.googleapis.com/youtube/v3/search?" + params, {
      signal: AbortSignal.timeout(9000),
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      // Never expose third-party errors that might include credentials.
      return { videos: [], configured: true, notice: response.status === 403 ? "Limite de consultas do YouTube atingido ou chave sem permissão." : "YouTube temporariamente indisponível." };
    }
    const payload = await response.json() as {
      nextPageToken?: string;
      items?: Array<{ id?: { videoId?: string }; snippet?: { title?: string; channelTitle?: string; description?: string; publishedAt?: string; thumbnails?: { medium?: { url?: string } } } }>;
    };
    const videos: Video[] = (payload.items ?? []).flatMap((item) => {
      const id = item.id?.videoId;
      const s = item.snippet;
      if (!id || !/^[\w-]{11}$/.test(id) || !s) return [];
      const text = [s.title, s.channelTitle, s.description].join(" ");
      if (!pagodeTerms.test(text) || excludedTerms.test([s.title, s.channelTitle].join(" "))) return [];
      const guess: "samba" | "pagode" = /pagode|menos [eé] mais|sorriso maroto|thiaguinho|p[eé]ricles|ferrugem|pixote|turma do pagode/i.test(text) ? "pagode" : "samba";
      if (data.genre !== "todos" && guess !== data.genre && !new RegExp(data.genre, "i").test(text)) return [];
      return [{ id, title: s.title ?? "Vídeo de samba e pagode", artist: s.channelTitle ?? "Canal do YouTube",
        thumbnail: s.thumbnails?.medium?.url ?? "", publishedAt: s.publishedAt ?? "", genre: guess }];
    });
    const result: YoutubeResponse = { videos, configured: true, nextPageToken: payload.nextPageToken,
      notice: videos.length === 0 ? "Nenhum resultado passou pela curadoria musical. Tente outra busca." : undefined };
    if (cache.size > 150) cache.clear();
    cache.set(cacheKey, { expires: Date.now() + 10 * 60_000, data: result });
    return result;
  });
