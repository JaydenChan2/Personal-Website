/**
 * "On repeat": my top tracks of the last 7 days, from Last.fm (which scrobbles
 * every Spotify play once the two accounts are connected). Server-only: the API
 * key has no NEXT_PUBLIC_ prefix, so it never reaches the browser.
 *
 * Keep this file free of path aliases and Next-only imports so the parser can be
 * unit-tested with plain `node --test`.
 */

export type Track = {
  rank: number;
  name: string;
  artist: string;
  plays: number;
  url: string;
  /** Album art, or null when Last.fm only has its grey placeholder. */
  image: string | null;
};

export type Listening = { tracks: Track[] };

const API = "https://ws.audioscrobbler.com/2.0/";
/** How many tracks to show, and how long the result is cached (seconds). */
export const listening = { limit: 5, revalidateSeconds: 3600 };

/** Last.fm's grey star image, returned when it has no real artwork. */
const PLACEHOLDER = "2a96cbd8b46e442fc41c2b86b821562f";

type LfmImage = { "#text": string; size: string };

/** The largest real image in a Last.fm image list, or null. */
export function pickImage(images: LfmImage[] | undefined): string | null {
  if (!images?.length) return null;
  const order = ["extralarge", "large", "medium", "small"];
  const sorted = [...images].sort((a, b) => order.indexOf(a.size) - order.indexOf(b.size));
  const hit = sorted.find((i) => i["#text"] && !i["#text"].includes(PLACEHOLDER));
  return hit ? hit["#text"] : null;
}

/** Turn a user.getTopTracks response into tracks (artwork filled in separately). */
export function parseTopTracks(json: unknown, limit = listening.limit): Track[] {
  const list = (json as { toptracks?: { track?: unknown } })?.toptracks?.track;
  // Last.fm returns a bare object instead of an array when there's exactly one result.
  const raw = (Array.isArray(list) ? list : list ? [list] : []) as {
    name: string;
    playcount: string;
    url: string;
    artist: { name?: string; "#text"?: string };
    image?: LfmImage[];
    "@attr"?: { rank?: string };
  }[];
  return raw.slice(0, limit).map((t, i) => ({
    rank: Number(t["@attr"]?.rank) || i + 1,
    name: t.name,
    artist: t.artist?.name ?? t.artist?.["#text"] ?? "",
    plays: Number(t.playcount) || 0,
    url: t.url,
    image: pickImage(t.image),
  }));
}

function config() {
  const key = process.env.LASTFM_API_KEY;
  const user = process.env.LASTFM_USERNAME;
  return key && user ? { key, user } : null;
}

export const isConfigured = () => config() !== null;

async function call(params: Record<string, string>, key: string) {
  const qs = new URLSearchParams({ ...params, api_key: key, format: "json" });
  const res = await fetch(`${API}?${qs}`, { next: { revalidate: listening.revalidateSeconds } } as RequestInit);
  if (!res.ok) throw new Error(`Last.fm ${params.method} failed: ${res.status}`);
  const json = await res.json();
  if (json?.error) throw new Error(`Last.fm ${params.method}: ${json.message}`);
  return json;
}

/**
 * Top tracks of the last 7 days. Returns null when Last.fm isn't configured
 * (local builds) so the section can hide itself; throws on API errors.
 */
export async function getListening(): Promise<Listening | null> {
  const c = config();
  if (!c) return null;
  const top = await call({ method: "user.gettoptracks", user: c.user, period: "7day", limit: String(listening.limit) }, c.key);
  const tracks = parseTopTracks(top);

  // Top-track images are almost always the placeholder; the album art lives on track.getInfo.
  await Promise.all(
    tracks.map(async (t) => {
      if (t.image) return;
      try {
        const info = await call({ method: "track.getinfo", artist: t.artist, track: t.name, autocorrect: "1" }, c.key);
        t.image = pickImage(info?.track?.album?.image);
      } catch {
        // No artwork is fine; the section falls back to a typeset plate.
      }
    }),
  );
  return { tracks };
}
