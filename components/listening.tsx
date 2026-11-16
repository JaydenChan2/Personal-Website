import { SecHead } from "@/components/container";
import { TrackPlate } from "@/components/plate";
import { ProjectIndex, type IndexItem } from "@/components/project-index";
import type { Listening } from "@/lib/listening";

/** Home page "On repeat" section: top tracks of the last 7 days. */
export function ListeningSection({ data, label }: { data: Listening; label: string }) {
  const items: IndexItem[] = data.tracks.map((t) => ({
    key: `${t.rank}-${t.url}`,
    no: String(t.rank).padStart(2, "0"),
    title: t.name,
    summary: t.artist,
    kind: "",
    year: `${t.plays} ${t.plays === 1 ? "play" : "plays"}`,
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
          side="My five most-played songs over the last seven days, from Spotify via Last.fm. Updated hourly."
        >
          On repeat, <b>this week.</b>
        </SecHead>
        {items.length > 0 ? (
          <ProjectIndex items={items} aspect="1 / 1" />
        ) : (
          <p className="note border-t border-line-2 pt-6">Nothing played yet this week. Check back soon.</p>
        )}
      </div>
    </section>
  );
}
