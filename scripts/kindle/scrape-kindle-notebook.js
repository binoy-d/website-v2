/**
 * Scrape every highlight from https://read.amazon.com/notebook (Kindle "Your Notes and Highlights").
 *
 * How to use: open https://read.amazon.com/notebook in a browser where you're signed in, open the
 * DevTools console, paste this whole file, press Enter. It walks the book list in the sidebar,
 * fetches each book's annotation pages (same requests the page makes when you click a book), and
 * when done downloads `kindle-highlights.json`. Progress is in `window.__kindleScrape`.
 *
 * Output shape:
 *   { source, exportedAt, bookCount, highlightCount,
 *     books: [{ asin, title, author, cover, lastAnnotated, pages, truncated, highlights: [
 *       { id, type: "highlight"|"note", text, note, color, page, location, header } ] }],
 *     errors: [] }
 *
 * Amazon hides or truncates some highlights when a publisher's export limit is exceeded; those are
 * simply not present in the page (the `truncated` flag is a weak signal, the notice text appears on
 * every book page).
 */
(() => {
  window.__kindleScrape = { status: "running", done: 0, total: 0, books: [], errors: [], startedAt: new Date().toISOString() };
  const state = window.__kindleScrape;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const clean = (s) => (s || "").replace(/\s+/g, " ").trim();

  // Rows live in `.a-row.a-spacing-base` elements; the wrapper differs between the first page and
  // token-paginated pages, so select rows by their highlight/note spans instead of a container.
  const parseRows = (doc) =>
    [...doc.querySelectorAll(".a-row.a-spacing-base")]
      .filter((row) => row.querySelector("#highlight, #note"))
      .map((row) => {
        const hlDiv = row.querySelector(".kp-notebook-highlight");
        const hlHidden = !hlDiv || hlDiv.classList.contains("aok-hidden");
        const text = hlHidden ? "" : clean(row.querySelector("#highlight")?.textContent);
        const note = clean(row.querySelector("#note")?.textContent);
        const header =
          clean(row.querySelector("#annotationHighlightHeader")?.textContent) ||
          clean(row.querySelector("#annotationNoteHeader")?.textContent);
        const color = ([...(hlDiv?.classList || [])].find((c) => /^kp-notebook-highlight-/.test(c)) || "").replace("kp-notebook-highlight-", "") || null;
        const location = row.querySelector("#kp-annotation-location")?.value || null;
        const page = (header.match(/Page:\s*([\w,\-]+)/i) || [])[1] || null;
        const id = (hlDiv?.id || row.querySelector(".kp-notebook-note")?.id || "").replace(/^(highlight|note)-/, "") || null;
        return { id, type: text ? "highlight" : "note", text, note: note || null, color, page, location: location ? Number(location) : null, header };
      })
      .filter((a) => a.text || a.note);

  const download = () => {
    const payload = {
      source: "https://read.amazon.com/notebook",
      exportedAt: state.finishedAt,
      startedAt: state.startedAt,
      bookCount: state.books.length,
      highlightCount: state.books.reduce((n, b) => n + b.highlights.length, 0),
      books: state.books,
      errors: state.errors,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "kindle-highlights.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 2000);
    console.log(`kindle-highlights.json: ${payload.bookCount} books, ${payload.highlightCount} highlights`);
  };

  (async () => {
    const books = [...document.querySelectorAll(".kp-notebook-library-each-book")].map((e) => ({
      asin: e.id,
      title: clean(e.querySelector("h2")?.textContent),
      author: clean(e.querySelector("p")?.textContent).replace(/^By:\s*/i, ""),
      cover: e.querySelector("img")?.getAttribute("src") || null,
      lastAnnotated: e.querySelector('[id^="kp-notebook-annotated-date"]')?.value || null,
    }));
    state.total = books.length;
    for (const book of books) {
      const highlights = [];
      let token = "", limitState = "", pages = 0, truncated = false;
      try {
        while (true) {
          const url = token
            ? `https://read.amazon.com/notebook?asin=${book.asin}&token=${encodeURIComponent(token)}&contentLimitState=${encodeURIComponent(limitState)}&`
            : `https://read.amazon.com/notebook?asin=${book.asin}&contentLimitState=&`;
          const res = await fetch(url, { credentials: "include" });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const html = await res.text();
          const doc = new DOMParser().parseFromString(html, "text/html");
          pages++;
          truncated = truncated || /hidden or truncated/i.test(html);
          highlights.push(...parseRows(doc));
          const next = doc.querySelector(".kp-notebook-annotations-next-page-start")?.value || "";
          limitState = doc.querySelector(".kp-notebook-content-limit-state")?.value || "";
          if (!next || pages > 60) break;
          token = next;
          await sleep(400);
        }
      } catch (err) {
        state.errors.push({ asin: book.asin, title: book.title, error: String(err) });
      }
      state.books.push({ ...book, pages, truncated, highlights });
      state.done++;
      console.log(`${state.done}/${state.total} ${book.title}: ${highlights.length} highlights`);
      await sleep(300);
    }
    state.status = "done";
    state.finishedAt = new Date().toISOString();
    download();
  })().catch((err) => {
    state.status = "error";
    state.error = String(err);
    console.error(err);
  });
})();
