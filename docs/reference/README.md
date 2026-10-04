# Old site reference (patnis.lv, Drupal 10)

Captured 2026-10-04 while the old site was live. This is the visual target for the 1:1 move.

- `desktop/` – full-page screenshots at 1280 px wide; `mobile/` – 390 px wide (touch device emulation).
  Pages were scrolled to the bottom first, so scroll-triggered animations are visible.
  File name = old URL path with `/` → `__` (`skola__steam.jpg` = `/skola/steam`).
- `/skola/pasākumi` is 77,610 px tall and is split into `skola__pas-kumi.jpg`, `-2`, `-3` (JPEG size limit).
- `/konference` is not included: it is a Canva website export that renders blank headless. Check it in a browser.
- `css/` – the Drupal theme stylesheets (`bootstrap_patnis`). Page-specific CSS of the designed pages lives in
  their `htmlBlock` sections in Sanity (and in `crawl/raw.tgz`).
