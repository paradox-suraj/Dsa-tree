# DSA Map

An interactive study map for data structures and algorithms. Instead of a flat problem list, it organises **433 LeetCode problems** into **111 question types** across **21 topics**, and every problem number links straight to LeetCode.

It is a single HTML file with no dependencies: open it from your desktop, use it offline, or host it anywhere, GitHub Pages included.

## Contents

- [Features](#features)
- [Quick start](#quick-start)
- [Topics covered](#topics-covered)
- [What a topic page looks like](#what-a-topic-page-looks-like)
- [Navigating](#navigating)
- [Hosting on GitHub Pages](#hosting-on-github-pages)
- [Customising the content](#customising-the-content)
- [Project structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Disclaimer](#disclaimer)

## Features

- **Topic pages as small trees.** Each page runs from topic to question types to LeetCode problems, so you see the pattern first and then the problems that drill it.
- **Every problem is a link.** Click a number to open the problem on LeetCode in a new tab, and hover to see its name. A `*` marks a Premium problem (253, 370 and 1135), which needs a LeetCode subscription to open.
- **Related topics.** Each topic page lists "Learn these first" and "Leads to", drawn from 34 links between topics.
- **Suggested study order.** The contents page lists all 21 topics in a sequence that builds on itself.
- **Clue to technique table.** Spot the clue in a problem statement ("sorted input", "next greater element", "n ≤ 20") and jump to the technique that fits.
- **Single file, no build.** Plain HTML, CSS and JavaScript. No framework, no package manager, and no network requests of its own.
- **Comfortable anywhere.** Responsive layout, automatic light and dark theme, keyboard navigation, and a print stylesheet that gives each page its own sheet.

## Quick start

Clone the repository or download `DSA_tree_pages.html`, then open it in any current browser (Chrome, Edge, Firefox or Safari). There is nothing to install or build.

```bash
open DSA_tree_pages.html        # macOS
xdg-open DSA_tree_pages.html    # Linux
start DSA_tree_pages.html       # Windows
```

Double-clicking the file works too.

## Topics covered

Topics fall into six groups. **Study order** is each topic's position in the suggested sequence on the contents page. Dynamic Programming sits after Greedy and Intervals & Sweep Line in that sequence, although its page comes before them.

| Group | Topic | Question types | Problems | Study order |
| --- | --- | ---: | ---: | ---: |
| Linear foundations | Arrays & Hashing | 6 | 29 | 1 |
|  | Strings | 6 | 29 | 2 |
|  | Two Pointers | 5 | 25 | 3 |
|  | Sliding Window | 5 | 22 | 4 |
|  | Prefix Sum & Difference Array | 4 | 17 | 5 |
|  | Binary Search | 5 | 24 | 6 |
|  | Sorting | 4 | 15 | 7 |
| Linear structures | Stack & Queue | 7 | 33 | 8 |
|  | Linked List | 6 | 26 | 9 |
| Recursive and hierarchical | Recursion & Backtracking | 6 | 26 | 10 |
|  | Trees | 7 | 35 | 11 |
|  | Heap / Priority Queue | 4 | 18 | 12 |
| Graphs | Graphs | 8 | 37 | 13 |
| Optimisation paradigms | Dynamic Programming | 12 | 55 | 16 |
|  | Greedy | 5 | 21 | 14 |
|  | Intervals & Sweep Line | 3 | 10 | 15 |
| Specialised | Trie | 3 | 12 | 17 |
|  | Bit Manipulation | 4 | 18 | 18 |
|  | Math & Number Theory | 5 | 20 | 19 |
|  | Segment Tree / BIT | 2 | 8 | 20 |
|  | Design | 4 | 15 | 21 |

*Problems* counts the distinct problems within a topic. Some problems appear under more than one topic (242 Valid Anagram is in both Arrays & Hashing and Strings, for example), so the per-topic counts add up to more than 433.

## What a topic page looks like

Here is the Trie page as plain text:

```text
Trie
prefix tree for words
├── Basic insert / search     208  14  648  720  1268
├── Wildcard / board          211  212  676  1032
└── Bitwise (XOR) trie        421  1707  1938

Learn these first   Strings (prefix search) · Bit Manipulation (XOR trie)
Leads to            Recursion & Backtracking (Word Search II)
```

On the page itself each number is a clickable chip that opens its LeetCode problem, and each related topic links to its own page.

## Navigating

| To do this | Use this |
| --- | --- |
| Go to the next or previous page | The **Next** and **Previous** buttons, or the → and ← keys |
| Return to the contents | The **Map** button |
| Open a topic | Click it on the contents page, or follow a link under "Learn these first" or "Leads to" |
| Open a problem | Click its number (it opens on LeetCode in a new tab) |
| Link to a specific page | Add `#p` and the page number to the URL |

Page numbers: `#p0` is the contents, `#p1` to `#p21` are the topics in the order of the table above, and `#p22` is the clue table. For example, `DSA_tree_pages.html#p14` opens Dynamic Programming.

To get a paper copy, print the page or save it as a PDF. Every page is included in order, each starting on a new sheet, and the navigation bar is hidden.

## Hosting on GitHub Pages

1. Push `DSA_tree_pages.html` and this README to a GitHub repository.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose your default branch and the `/ (root)` folder, then save.
4. After a minute or so the site is live at `https://<username>.github.io/<repository>/DSA_tree_pages.html`.

To serve the page at `https://<username>.github.io/<repository>/` without the file name, rename the file to `index.html` (and update the file name in this README). The page loads nothing from other files, so it works from any path.

## Customising the content

All content lives in two constants inside the `<script>` block, so you can edit the page without touching any markup. The pages are generated from this data when the page loads.

- `D` holds the data: `T` (topics), `E` (links between topics) and `K` (clue table rows).
- `L` maps a LeetCode problem number to its URL slug.

Both are stored as JSON on a few long lines. Search the file for `const D=` and `const L=` to find them. Shown below with the Trie topic as the example:

```js
// D.T: one entry per topic -> [group, name, tagline, question types]
["Specialised", "Trie", "prefix tree for words", [
  ["Basic insert / search", "208 14 648 720 1268"],
  ["Wildcard / board",      "211 212 676 1032"],
  ["Bitwise (XOR) trie",    "421 1707 1938"]
]]

// D.E: [from, to, reason], using topic positions in D.T counted from 0
[1, 16, "prefix search"]          // Strings leads to Trie

// D.K: [clue, technique]
["Prefix or dictionary of words", "Trie"]

// L: problem number -> URL slug
"208": "implement-trie-prefix-tree"
```

### Add a problem

1. Append its number to the right question type in `D.T`, separated by a space. Put a `*` after the number for a Premium problem, for example `370*`.
2. Add `"<number>": "<slug>"` to `L`. The slug is the last part of the problem's URL, so `https://leetcode.com/problems/two-sum/` becomes `two-sum`.

A number with no entry in `L` still appears, as a plain chip instead of a link.

### Add a topic

- Append the topic to the end of `D.T` rather than inserting it in the middle, because `D.E` and the suggested order refer to topics by position.
- Add its position to the `order` array (search for `const order=`) where it belongs in the suggested sequence.
- Add links to and from other topics in `D.E`.
- If the topic starts a new group, add a hue to the `H` array. It holds one number per group, in order of first appearance. A topic in an existing group takes that group's colour.

### Change the look

Colours are CSS custom properties at the top of the `<style>` block (`--bg`, `--fg`, `--mut`, `--card` and `--bd`). The page follows the system light or dark setting. To force one, add `data-theme="light"` or `data-theme="dark"` to the `<html>` element.

## Project structure

```text
.
├── DSA_tree_pages.html   # the whole app: markup, styles, script and data
└── README.md
```

## Contributing

Issues and pull requests are welcome, especially for:

- a problem filed under the wrong pattern, or a wrong problem number
- a missing question type or topic
- clearer names for patterns or clues

When you add problems, include each one's slug in `L` and click the link to confirm it opens the right problem.

## License

Released under the MIT License.

## Disclaimer

LeetCode is a trademark of its owner. DSA Map is an independent study aid and is not affiliated with or endorsed by LeetCode. It contains no problem statements, only problem numbers and links.
