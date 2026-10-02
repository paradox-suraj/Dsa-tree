// check_leetcode_links.mjs  (Node 18+, no dependencies)
//
// Validates every LeetCode link in DSA_tree_pages_.html against LeetCode itself.
// For each problem number it asks LeetCode's GraphQL API about the slug and checks:
//   1. the slug exists
//   2. the slug really belongs to that problem number (not a different problem)
//   3. the slug is the canonical one (not an old, renamed alias)
//   4. the page's "*" (Premium) marker matches LeetCode's paid-only flag
//
// Usage:   node check_leetcode_links.mjs DSA_tree_pages_.html
// Exit code is 0 when every link is clean, 1 otherwise.

import { readFileSync } from 'node:fs';

const file = process.argv[2] || 'DSA_tree_pages_.html';
const base = process.env.LC_BASE || 'https://leetcode.com'; // overridable for testing
const DELAY_MS = Number(process.env.LC_DELAY_MS ?? 150); // be polite to LeetCode

// ---- read the page's own data tables (D = topics, L = number -> slug) ----
const lines = readFileSync(file, 'utf8').split('\n');
const grab = (name) => {
  const line = lines.find((l) => l.startsWith(`const ${name}=`));
  if (!line) throw new Error(`Could not find "const ${name}=" in ${file}`);
  return new Function(line.replace(/^const \w=/, 'return ').replace(/;$/, ';'))();
};
const D = grab('D');
const L = grab('L');

// problem number -> true if the page marks it with "*"
const used = new Map();
for (const topic of D.T)
  for (const row of topic[3])
    for (const tok of row[1].split(' ')) {
      const n = parseInt(tok, 10);
      used.set(n, used.get(n) || tok.includes('*'));
    }

// ---- ask LeetCode about one slug ----
const QUERY =
  'query q($s:String!){question(titleSlug:$s){questionFrontendId title titleSlug isPaidOnly}}';

async function lookup(slug, attempt = 1) {
  try {
    const res = await fetch(`${base}/graphql`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        referer: `${base}/problems/${slug}/`,
        'user-agent': 'Mozilla/5.0 (link-checker)',
      },
      body: JSON.stringify({ query: QUERY, variables: { s: slug } }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json?.data?.question ?? null;
  } catch (err) {
    if (attempt >= 3) throw err;
    await new Promise((r) => setTimeout(r, 600 * attempt));
    return lookup(slug, attempt + 1);
  }
}

// ---- check everything ----
const numbers = [...used.keys()].sort((a, b) => a - b);
const problems = [];
let ok = 0;

console.log(`Checking ${numbers.length} problems from ${file} ...`);
for (const n of numbers) {
  const slug = L[n];
  const starred = used.get(n);
  const url = `${base}/problems/${slug}/`;
  try {
    if (!slug) {
      problems.push(`#${n}: NO SLUG in the L table (renders as plain text)`);
      continue;
    }
    const q = await lookup(slug);
    if (!q) problems.push(`#${n}: NOT FOUND  ${url}`);
    else if (q.questionFrontendId !== String(n))
      problems.push(`#${n}: WRONG PROBLEM  ${url} is #${q.questionFrontendId} "${q.title}"`);
    else if (q.titleSlug !== slug)
      problems.push(`#${n}: OLD SLUG  use "${q.titleSlug}" instead of "${slug}"`);
    else if (q.isPaidOnly !== starred)
      problems.push(
        `#${n}: PREMIUM FLAG  page ${starred ? 'has' : 'lacks'} "*" but LeetCode says paid-only=${q.isPaidOnly}  (${q.title})`
      );
    else ok++;
  } catch (err) {
    problems.push(`#${n}: COULD NOT CHECK (${err.message})  ${url}`);
  }
  await new Promise((r) => setTimeout(r, DELAY_MS));
}

console.log(`\n${ok} of ${numbers.length} links verified clean.`);
if (problems.length) {
  console.log(`\n${problems.length} need attention:`);
  for (const p of problems) console.log('  - ' + p);
  process.exit(1);
}
console.log('No problems found.');
