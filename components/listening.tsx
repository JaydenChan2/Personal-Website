import { SecHead } from "@/components/container";
import { TrackPlate } from "@/components/plate";
import { ProjectIndex, type IndexItem } from "@/components/project-index";
import { ArrowOut } from "@/components/text";
import type { Listening, ListeningStats } from "@/lib/listening";

const plays = (n: number) => `${n} ${n === 1 ? "play" : "plays"}`;
const pct = (share: number) => `${Math.round(share * 100)}%`;

/** "On repeat": top songs of the last 7 days, then who and what genres made up the week. */
export function ListeningSection({ data, label }: { data: Listening; label: string }) {
  const items: IndexItem[] = data.tracks.map((t) => ({
    key: `${t.rank}-${t.url}`,
    no: String(t.rank).padStart(2, "0"),
    title: t.name,
    summary: t.artist,
    kind: "",
    year: plays(t.plays),
    href: t.url,
    external: true,
    art: <TrackPlate name={t.name} artist={t.artist} image={t.image} className="ph-fill" />,
  }));

  return (
    <section id="listening" className="index-sec section" aria-labelledby="listening-h">
      <div className="wrap">
        <SecHead
          label={label}
          id="listening-h"
          side="My most-played songs and artists over the last seven days, from Spotify via Last.fm. Updated hourly."
        >
          On repeat, <b>this week.</b>
        </SecHead>
        {items.length > 0 ? (
          <>
            <ProjectIndex items={items} aspect="1 / 1" thumbs />
            {data.stats && data.stats.plays > 0 && <Stats stats={data.stats} />}
          </>
        ) : (
          <p className="note border-t border-line-2 pt-6">Nothing played yet this week. Check back soon.</p>
        )}
      </div>
    </section>
  );
}

function Stats({ stats }: { stats: ListeningStats }) {
  const max = stats.topArtists[0]?.plays || 1;
  return (
    <div className="listen-stats">
      <dl className="listen-kpis fx">
        {[
          ["Plays", stats.plays],
          ["Artists", stats.artists],
          ["Songs", stats.songs],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="mono">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>

      <div className="grid12 listen-grid">
        {/* Artists set as a type scale: the bigger the name, the more it was played.
            The bar under each name carries the exact proportion; the count is printed. */}
        <section className="listen-artists fx" aria-labelledby="top-artists">
          <h3 id="top-artists" className="mono">
            Top artists
          </h3>
          <ol>
            {stats.topArtists.map((a, i) => {
              const s = a.plays / max;
              return (
                <li key={a.name} style={{ "--s": Math.sqrt(s).toFixed(3) } as React.CSSProperties}>
                  <span className="no">{String(i + 1).padStart(2, "0")}</span>
                  <span className="who">
                    <a href={a.url} target="_blank" rel="noreferrer" className="name link">
                      {a.name}
                    </a>
                    <span className="bar" style={{ width: `${(s * 100).toFixed(1)}%` }} aria-hidden="true" />
                  </span>
                  <span className="n">{plays(a.plays)}</span>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Genres as one proportional strip, labelled in place where a block is wide
            enough (a container query hides labels that wouldn't fit), with the list
            below naming every part in the same order. */}
        {stats.genres.length > 0 && (
          <section className="listen-genres fx" aria-labelledby="by-genre">
            <h3 id="by-genre" className="mono">
              By genre
            </h3>
            <div
              className="genre-strip"
              role="img"
              aria-label={`Share of plays by genre: ${stats.genres.map((g) => `${g.genre} ${pct(g.share)}`).join(", ")}`}
            >
              {stats.genres.map((g) => (
                <span
                  key={g.genre}
                  className={g.genre === "Other" ? "seg seg--other" : "seg"}
                  style={{ flexGrow: g.plays }}
                  title={`${g.genre}: ${pct(g.share)} (${plays(g.plays)})`}
                >
                  <span
                    className={`seg-label seg-label--${g.genre.length > 7 ? "l" : g.genre.length > 4 ? "m" : "s"}`}
                    aria-hidden="true"
                  >
                    {g.genre}
                  </span>
                </span>
              ))}
            </div>
            <ol className="genre-list">
              {stats.genres.map((g) => (
                <li key={g.genre}>
                  <span className="g">{g.genre}</span>
                  <span className="pct">{pct(g.share)}</span>
                  <span className="who note">
                    {g.artists.slice(0, 3).join(", ")}
                    {g.artists.length > 3 && ` +${g.artists.length - 3}`}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
      <p className="note mt-8">
        Genres come from each artist&rsquo;s most-used{" "}
        <a href="https://www.last.fm" target="_blank" rel="noreferrer" className="link-u">
          Last.fm
          <ArrowOut />
        </a>{" "}
        tag.
      </p>
    </div>
  );
}
