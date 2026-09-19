# Kindle highlights → BookOrbit

One-off tooling to move highlights made on a Kindle (pre-BookOrbit) into BookOrbit, so they show
up in its highlights hub and on binoy.co/highlights.

Amazon has no API for this, and BookOrbit has no highlight import, so it's two steps:

1. **Scrape** — `scrape-kindle-notebook.js`. Open https://read.amazon.com/notebook while signed
   in, paste the file into the DevTools console. It walks every book in the sidebar, follows the
   pagination tokens, and downloads `kindle-highlights.json` (asin, title, author, and per
   highlight: text, note, color, page, location). Amazon hides some highlights for books whose
   publisher export limit is exceeded; those never appear on the page.

2. **Import** — `import-kindle-highlights.mjs` (Node 22+, no dependencies). BookOrbit annotations
   must belong to a book, so for each Kindle book it builds a tiny EPUB that *contains the
   highlights* (title/author/ASIN in the OPF), uploads it to a library, then creates one annotation
   per highlight whose CFI points at that highlight's paragraph in the file. Kindle page/location
   become the annotation's chapter label (the API has no page field). Re-runnable: progress is
   saved in `data/import-state.json` and identical existing annotations are skipped.

```bash
# credentials stay out of the repo
cat > ~/.bookorbit-import.env <<'EOF'
BOOKORBIT_URL=https://books.binoy.co
BOOKORBIT_USERNAME=...
BOOKORBIT_PASSWORD=...
EOF

node scripts/kindle/import-kindle-highlights.mjs --env-file ~/.bookorbit-import.env --dry-run
node scripts/kindle/import-kindle-highlights.mjs --env-file ~/.bookorbit-import.env [--library Kindle] [--only B000FC1PWA]
```

`data/` is git-ignored (personal data). Once the real books are added to BookOrbit later (e.g. via
Shelfarr), the stub books can be deleted from the library and the highlights re-imported against
the real files if BookOrbit ever gains a re-matching feature; until then the stubs are the home.
