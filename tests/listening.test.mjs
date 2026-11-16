// Run with: npm test  (Node's built-in test runner; Node strips the TypeScript types)
import assert from "node:assert/strict";
import { test } from "node:test";
import { genreOf, groupGenres, parseTopArtists, parseTopTracks, parseTotal, pickImage } from "../lib/listening.ts";

const img = (size, url) => ({ size, "#text": url });
const placeholder = "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png";

test("pickImage prefers the largest real image", () => {
  assert.equal(pickImage([img("small", "s.jpg"), img("extralarge", "xl.jpg"), img("large", "l.jpg")]), "xl.jpg");
});

test("pickImage ignores Last.fm's placeholder and empty entries", () => {
  assert.equal(pickImage([img("extralarge", placeholder), img("large", ""), img("medium", "m.jpg")]), "m.jpg");
  assert.equal(pickImage([img("extralarge", placeholder)]), null);
  assert.equal(pickImage(undefined), null);
});

test("parseTopTracks reads tracks, ranks and play counts", () => {
  const json = {
    toptracks: {
      track: [
        { name: "Blue", playcount: "23", url: "u1", artist: { name: "yung kai" }, image: [img("extralarge", placeholder)], "@attr": { rank: "1" } },
        { name: "Isn't She Lovely", playcount: "9", url: "u2", artist: { name: "Stevie Wonder" }, "@attr": { rank: "2" } },
      ],
    },
  };
  assert.deepEqual(parseTopTracks(json), [
    { rank: 1, name: "Blue", artist: "yung kai", plays: 23, url: "u1", image: null },
    { rank: 2, name: "Isn't She Lovely", artist: "Stevie Wonder", plays: 9, url: "u2", image: null },
  ]);
});

test("parseTopTracks handles a single bare object, no tracks, and the limit", () => {
  const one = { toptracks: { track: { name: "A", playcount: "1", url: "u", artist: { name: "X" } } } };
  assert.equal(parseTopTracks(one).length, 1);
  assert.equal(parseTopTracks(one)[0].rank, 1);
  assert.deepEqual(parseTopTracks({ toptracks: { track: [] } }), []);
  assert.deepEqual(parseTopTracks({}), []);
  const many = { toptracks: { track: Array.from({ length: 8 }, (_, i) => ({ name: `T${i}`, playcount: "1", url: "u", artist: { name: "X" } })) } };
  assert.equal(parseTopTracks(many, 5).length, 5);
});

test("genreOf takes the highest-ranked tag that is a genre, ignoring junk tags", () => {
  const tags = (...n) => n.map((name) => ({ name }));
  assert.equal(genreOf(tags("seen live", "Chris Brown", "rnb", "Hip-Hop")), "R&B");
  assert.equal(genreOf(tags("Hip-Hop", "rap", "rnb")), "Hip-hop");
  // Justin Bieber's real tags: the troll tag ranks below "pop", so pop wins.
  assert.equal(genreOf(tags("pop", "black metal", "rnb")), "Pop");
  assert.equal(genreOf(tags(" R&B ")), "R&B");
  assert.equal(genreOf(tags("canadian", "male vocalists")), null);
  assert.equal(genreOf(undefined), null);
});

test("groupGenres weights by plays, keeps the top groups and folds the rest into Other", () => {
  const rows = groupGenres(
    [
      { name: "Chris Brown", plays: 11, genre: "R&B" },
      { name: "Drake", plays: 10, genre: "Hip-hop" },
      { name: "Bruno Mars", plays: 8, genre: "Pop" },
      { name: "Ella Mai", plays: 5, genre: "R&B" },
      { name: "Alicia Keys", plays: 1, genre: "Soul" },
      { name: "Unknown", plays: 2, genre: null },
      { name: "Silent", plays: 0, genre: "Jazz" },
    ],
    2,
  );
  assert.deepEqual(
    rows.map((r) => [r.genre, r.plays, r.artists]),
    [
      ["R&B", 16, ["Chris Brown", "Ella Mai"]],
      ["Hip-hop", 10, ["Drake"]],
      ["Other", 11, ["Bruno Mars", "Unknown", "Alicia Keys"]],
    ],
  );
  assert.equal(Math.round(rows.reduce((s, r) => s + r.share, 0) * 1000), 1000);
  assert.deepEqual(groupGenres([]), []);
});

test("groupGenres leaves out Other when nothing folds into it", () => {
  const rows = groupGenres([{ name: "A", plays: 3, genre: "Pop" }, { name: "B", plays: 1, genre: "Rock" }], 4);
  assert.deepEqual(rows.map((r) => r.genre), ["Pop", "Rock"]);
});

test("parseTopArtists and parseTotal read Last.fm's shapes", () => {
  const json = { topartists: { artist: [{ name: "Drake", playcount: "10", url: "u" }], "@attr": { total: "21" } } };
  assert.deepEqual(parseTopArtists(json), [{ name: "Drake", plays: 10, url: "u" }]);
  assert.equal(parseTotal(json, "topartists"), 21);
  assert.equal(parseTotal({}, "toptracks"), 0);
  assert.deepEqual(parseTopArtists({}), []);
});
