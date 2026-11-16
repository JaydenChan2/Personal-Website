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

export type ArtistStat = { name: string; plays: number; url: string };

export type GenreStat = {
  genre: string;
  plays: number;
  /** 0–1 share of all plays this week. */
  share: number;
  /** Artists counted in this genre, most-played first. */
  artists: string[];
};

export type ListeningStats = {
  /** Total plays, distinct artists and distinct songs in the last 7 days. */
  plays: number;
  artists: number;
  songs: number;
  topArtists: ArtistStat[];
  genres: GenreStat[];
};

export type Listening = {
  tracks: Track[];
  /** null when the stats calls fail; the track list still shows. */
  stats: ListeningStats | null;
};

const API = "https://ws.audioscrobbler.com/2.0/";
/** How many tracks/artists to show, and how long results are cached (seconds). */
export const listening = {
  limit: 5,
  artistLimit: 5,
  /** Artists whose tags are looked up for the genre breakdown; the rest count as "Other". */
  taggedArtists: 30,
  /** Genres shown before the tail folds into "Other". */
  genreGroups: 4,
  revalidateSeconds: 3600,
};

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

/** The `@attr.total` count Last.fm puts on top-list responses. */
export function parseTotal(json: unknown, list: "toptracks" | "topartists"): number {
  const attr = (json as Record<string, { "@attr"?: { total?: string } }>)?.[list]?.["@attr"];
  return Number(attr?.total) || 0;
}

/** Turn a user.getTopArtists response into artists, most-played first. */
export function parseTopArtists(json: unknown): ArtistStat[] {
  const list = (json as { topartists?: { artist?: unknown } })?.topartists?.artist;
  const raw = (Array.isArray(list) ? list : list ? [list] : []) as { name: string; playcount: string; url: string }[];
  return raw.map((a) => ({ name: a.name, plays: Number(a.playcount) || 0, url: a.url }));
}

/**
 * Last.fm tags are crowd-sourced and noisy ("seen live", artist names, joke tags), so
 * each artist gets the first of its tags, in Last.fm's own ranking, that names a genre
 * on this list. Keys are lower-cased tags; values are the label shown.
 */
const GENRES: Record<string, string> = {
  rnb: "R&B", "r&b": "R&B", "r and b": "R&B", "rhythm and blues": "R&B", "contemporary r&b": "R&B",
  "alternative r&b": "R&B", "slow jams": "R&B",
  "hip-hop": "Hip-hop", "hip hop": "Hip-hop", hiphop: "Hip-hop", rap: "Hip-hop", trap: "Hip-hop",
  drill: "Hip-hop", "underground hip-hop": "Hip-hop", "east coast rap": "Hip-hop", "west coast rap": "Hip-hop",
  pop: "Pop", "dance-pop": "Pop", "dance pop": "Pop", electropop: "Pop", synthpop: "Pop", "teen pop": "Pop",
  "k-pop": "Pop", kpop: "Pop", "pop rap": "Pop",
  soul: "Soul", "neo-soul": "Soul", "neo soul": "Soul", funk: "Soul", motown: "Soul",
  rock: "Rock", "pop rock": "Rock", "alternative rock": "Rock", "classic rock": "Rock", "indie rock": "Rock",
  alternative: "Rock", punk: "Rock", "pop punk": "Rock", grunge: "Rock",
  indie: "Indie", "indie pop": "Indie", "bedroom pop": "Indie", "lo-fi": "Indie",
  electronic: "Electronic", edm: "Electronic", house: "Electronic", techno: "Electronic", dubstep: "Electronic",
  electronica: "Electronic", "drum and bass": "Electronic",
  country: "Country", jazz: "Jazz", classical: "Classical", soundtrack: "Soundtrack",
  latin: "Latin", reggaeton: "Latin", afrobeats: "Afrobeats", afrobeat: "Afrobeats", reggae: "Reggae",
  folk: "Folk", acoustic: "Folk", "singer-songwriter": "Folk",
  metal: "Metal", "heavy metal": "Metal",
};

/** The genre for one artist from its ranked tags, or null if none is a known genre. */
export function genreOf(tags: { name: string }[] | undefined): string | null {
  for (const t of tags ?? []) {
    const g = GENRES[t.name.trim().toLowerCase()];
    if (g) return g;
  }
  return null;
}

/**
 * Weight each artist's genre by its plays. The top `groups` genres are kept; the tail
 * and artists with no known genre fold into "Other", which always comes last.
 */
export function groupGenres(
  artists: { name: string; plays: number; genre: string | null }[],
  groups = listening.genreGroups,
): GenreStat[] {
  const total = artists.reduce((s, a) => s + a.plays, 0);
  if (!total) return [];
  const by = new Map<string, { plays: number; artists: { name: string; plays: number }[] }>();
  for (const a of artists) {
    if (a.plays <= 0) continue;
    const key = a.genre ?? "";
    const g = by.get(key) ?? { plays: 0, artists: [] };
    g.plays += a.plays;
    g.artists.push({ name: a.name, plays: a.plays });
    by.set(key, g);
  }
  const named = [...by.entries()].filter(([k]) => k).sort((a, b) => b[1].plays - a[1].plays || a[0].localeCompare(b[0]));
  const kept = named.slice(0, groups);
  const other = [...named.slice(groups).map(([, g]) => g), ...(by.has("") ? [by.get("")!] : [])];
  const rows = kept.map(([genre, g]) => ({ genre, ...g }));
  if (other.length) {
    rows.push({ genre: "Other", plays: other.reduce((s, g) => s + g.plays, 0), artists: other.flatMap((g) => g.artists) });
  }
  return rows.map((r) => ({
    genre: r.genre,
    plays: r.plays,
    share: r.plays / total,
    artists: [...r.artists].sort((a, b) => b.plays - a.plays).map((a) => a.name),
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
  const json = await res.json().catch(() => null);
  // Last.fm puts the reason in the body even on 4xx ("Invalid API key", "User not found").
  if (!res.ok || json?.error) {
    throw new Error(`Last.fm ${params.method} failed: ${res.status}${json?.message ? ` (${json.message})` : ""}`);
  }
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

  let stats: ListeningStats | null = null;
  try {
    stats = await getStats(c, parseTotal(top, "toptracks"));
  } catch (err) {
    // The songs still show without the stats.
    console.error("[listening] stats", err);
  }
  return { tracks, stats };
}

async function getStats(c: { key: string; user: string }, songs: number): Promise<ListeningStats> {
  const json = await call({ method: "user.gettopartists", user: c.user, period: "7day", limit: "200" }, c.key);
  const artists = parseTopArtists(json);
  const tagged = await Promise.all(
    artists.map(async (a, i) => {
      if (i >= listening.taggedArtists) return { ...a, genre: null };
      try {
        const t = await call({ method: "artist.gettoptags", artist: a.name, autocorrect: "1" }, c.key);
        return { ...a, genre: genreOf(t?.toptags?.tag) };
      } catch {
        return { ...a, genre: null };
      }
    }),
  );
  return {
    plays: artists.reduce((s, a) => s + a.plays, 0),
    artists: parseTotal(json, "topartists") || artists.length,
    songs,
    topArtists: artists.slice(0, listening.artistLimit),
    genres: groupGenres(tagged),
  };
}
