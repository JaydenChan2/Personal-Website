// Run with: npm test  (Node's built-in test runner; Node strips the TypeScript types)
import assert from "node:assert/strict";
import { test } from "node:test";
import { parseTopTracks, pickImage } from "../lib/listening.ts";

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
