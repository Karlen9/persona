#!/usr/bin/env bash
# Resumable download of the PDFs listed in content_config.DOCS (the origin throttles large files to ~15 KB/s,
# so plain urllib reads time out). Usage: bash scripts/fetch_docs.sh   (run from the repo root)
set -u
UA='Mozilla/5.0 (compatible; content-migration/1.0)'
fetch() { # <old path> <public path>
  mkdir -p "$(dirname "public$2")"
  for i in $(seq 1 60); do
    curl -sS -f -A "$UA" -C - --max-time 240 -o "public$2.part" "https://personamodel.ru$1" && { mv "public$2.part" "public$2"; return 0; }
    sleep 2
  done
  return 1
}
[ -s public/docs/abonentskij-dogovor.pdf ] || fetch /wp-content/uploads/2026/01/abonentskij-dogovor.pdf /docs/abonentskij-dogovor.pdf
[ -s public/docs/pravila-povedeniya.pdf ] || fetch /wp-content/uploads/2026/01/pravila-povedeniya.pdf /docs/pravila-povedeniya.pdf
[ -s public/docs/politika-personalnyh-dannyh.pdf ] || fetch /wp-content/uploads/2026/01/politika-personalnyh-dannyh.pdf /docs/politika-personalnyh-dannyh.pdf
[ -s public/docs/festivals/stars-international-2026-polozhenie.pdf ] || fetch /wp-content/uploads/2026/08/stars_international_2026_polozhenie.pdf /docs/festivals/stars-international-2026-polozhenie.pdf
[ -s public/docs/festivals/malenkie-miss-i-mister-rossiya-2026.pdf ] || fetch /wp-content/uploads/2026/03/malenkie_miss_i_mister_rossiya_2026.pdf /docs/festivals/malenkie-miss-i-mister-rossiya-2026.pdf
[ -s public/docs/festivals/fashion-kitchen-2026.pdf ] || fetch /wp-content/uploads/2026/03/fashion-kitchen.pdf /docs/festivals/fashion-kitchen-2026.pdf
