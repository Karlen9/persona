#!/usr/bin/env python3
"""Step 0 (optional): re-create the crawl that the other scripts read.

Usage:
    python3 scripts/fetch_crawl.py --out <crawl dir>

Fetches the 37 sitemap URLs (html/NN.html + html/manifest.tsv, same layout as the original audit) and the public
WordPress REST collections used for dates and media metadata (api/pages_1.json, areas_1.json, media_N.json).
Gentle by design: sequential GETs, generic UA, a pause between requests, nothing under /wp-admin and never the
custom /wp-json/persona-agent/* routes.
"""

from __future__ import annotations

import argparse
import json
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

SITE = 'https://personamodel.ru'
UA = 'Mozilla/5.0 (compatible; content-migration/1.0)'


def get(url: str) -> tuple[int, bytes, dict[str, str]]:
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            return r.status, r.read(), dict(r.headers)
    except urllib.error.HTTPError as e:  # noqa: PERF203
        return e.code, e.read(), dict(e.headers)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', required=True)
    args = ap.parse_args()
    out = Path(args.out)
    (out / 'html').mkdir(parents=True, exist_ok=True)
    (out / 'api').mkdir(parents=True, exist_ok=True)

    urls: list[str] = []
    for sm in ('page-sitemap.xml', 'areas-sitemap.xml'):
        _, body, _ = get(f'{SITE}/{sm}')
        urls += re.findall(r'<url>\s*<loc>(.*?)</loc>', body.decode('utf-8'))
        time.sleep(1)
    rows = []
    for i, url in enumerate(urls, start=1):
        status, body, _ = get(url)
        (out / 'html' / f'{i:02d}.html').write_bytes(body)
        rows.append('\t'.join([f'{i:02d}', str(status), str(len(body)), '0', '0', url, url]))
        time.sleep(1.5)
    (out / 'html' / 'manifest.tsv').write_text('\n'.join(rows) + '\n', encoding='utf-8')

    for name, route in (('pages', 'pages?per_page=100'), ('areas', 'areas?per_page=100')):
        _, body, _ = get(f'{SITE}/wp-json/wp/v2/{route}')
        (out / 'api' / f'{name}_1.json').write_bytes(body)
        time.sleep(1.5)
    page = 1
    while True:
        status, body, _ = get(f'{SITE}/wp-json/wp/v2/media?per_page=100&page={page}')
        if status != 200:
            break
        items = json.loads(body)
        if not items:
            break
        (out / 'api' / f'media_{page}.json').write_bytes(body)
        page += 1
        time.sleep(1.5)
    print('done:', len(urls), 'pages,', page - 1, 'media pages')


if __name__ == '__main__':
    main()
