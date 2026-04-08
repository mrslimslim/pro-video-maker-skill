#!/usr/bin/env python3
"""
Asset fetcher for Pro Video Maker.
Searches and downloads free assets from Pexels, Pixabay, and Unsplash.

Usage:
  python scripts/asset-fetch.py search --query "nature" --source pexels --type photo --count 5
  python scripts/asset-fetch.py download --url "https://..." --output public/assets/image.jpg
  python scripts/asset-fetch.py batch --query "abstract" --source pixabay --type photo --count 10 --output public/assets/
"""

import argparse
import json
import os
import sys
import urllib.request
import urllib.parse
import urllib.error
from pathlib import Path


def get_api_key(source: str) -> str:
    env_map = {
        "pexels": "PEXELS_API_KEY",
        "pixabay": "PIXABAY_API_KEY",
        "unsplash": "UNSPLASH_ACCESS_KEY",
    }
    key = os.environ.get(env_map.get(source, ""))
    if not key:
        print(f"Error: {env_map.get(source, source)} environment variable not set.")
        print(f"Get a free API key:")
        print(f"  Pexels:   https://www.pexels.com/api/new/")
        print(f"  Pixabay:  https://pixabay.com/api/docs/")
        print(f"  Unsplash: https://unsplash.com/developers")
        sys.exit(1)
    return key


def search_pexels(query: str, media_type: str, count: int) -> list:
    api_key = get_api_key("pexels")
    endpoint = "videos" if media_type == "video" else "v1"
    url = f"https://api.pexels.com/{endpoint}/search?query={urllib.parse.quote(query)}&per_page={count}"
    req = urllib.request.Request(url, headers={"Authorization": api_key})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())

    results = []
    items = data.get("videos" if media_type == "video" else "photos", [])
    for item in items:
        if media_type == "video":
            video_files = item.get("video_files", [])
            best = max(video_files, key=lambda v: v.get("width", 0)) if video_files else {}
            results.append({
                "id": item["id"],
                "url": best.get("link", ""),
                "width": best.get("width", 0),
                "height": best.get("height", 0),
                "source": "pexels",
                "sourceUrl": item.get("url", ""),
                "attribution": f"Video by {item.get('user', {}).get('name', 'Unknown')} on Pexels",
            })
        else:
            src = item.get("src", {})
            results.append({
                "id": item["id"],
                "url": src.get("original", src.get("large2x", "")),
                "width": item.get("width", 0),
                "height": item.get("height", 0),
                "source": "pexels",
                "sourceUrl": item.get("url", ""),
                "attribution": f"Photo by {item.get('photographer', 'Unknown')} on Pexels",
            })
    return results


def search_pixabay(query: str, media_type: str, count: int) -> list:
    api_key = get_api_key("pixabay")
    endpoint = "videos" if media_type == "video" else ""
    url = (
        f"https://pixabay.com/api/{endpoint}/?key={api_key}"
        f"&q={urllib.parse.quote(query)}&per_page={count}&safesearch=true"
    )
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())

    results = []
    for item in data.get("hits", []):
        if media_type == "video":
            videos = item.get("videos", {})
            best = videos.get("large", videos.get("medium", {}))
            results.append({
                "id": item["id"],
                "url": best.get("url", ""),
                "width": best.get("width", 0),
                "height": best.get("height", 0),
                "source": "pixabay",
                "sourceUrl": item.get("pageURL", ""),
                "attribution": f"By {item.get('user', 'Unknown')} on Pixabay",
            })
        else:
            results.append({
                "id": item["id"],
                "url": item.get("largeImageURL", ""),
                "width": item.get("imageWidth", 0),
                "height": item.get("imageHeight", 0),
                "source": "pixabay",
                "sourceUrl": item.get("pageURL", ""),
                "attribution": f"By {item.get('user', 'Unknown')} on Pixabay",
            })
    return results


def search_unsplash(query: str, media_type: str, count: int) -> list:
    if media_type == "video":
        print("Unsplash does not support video search. Use Pexels or Pixabay.")
        return []
    api_key = get_api_key("unsplash")
    url = f"https://api.unsplash.com/search/photos?query={urllib.parse.quote(query)}&per_page={count}"
    req = urllib.request.Request(url, headers={"Authorization": f"Client-ID {api_key}"})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())

    results = []
    for item in data.get("results", []):
        urls = item.get("urls", {})
        results.append({
            "id": item["id"],
            "url": urls.get("raw", urls.get("full", "")),
            "width": item.get("width", 0),
            "height": item.get("height", 0),
            "source": "unsplash",
            "sourceUrl": item.get("links", {}).get("html", ""),
            "attribution": f"Photo by {item.get('user', {}).get('name', 'Unknown')} on Unsplash",
        })
    return results


def download_file(url: str, output_path: str) -> None:
    output = Path(output_path)
    output.parent.mkdir(parents=True, exist_ok=True)
    print(f"Downloading: {url}")
    print(f"       → {output}")
    try:
        urllib.request.urlretrieve(url, str(output))
        print(f"  Done ({output.stat().st_size / 1024:.1f} KB)")
    except urllib.error.URLError as e:
        print(f"  Error: {e}")


def update_manifest(assets: list, manifest_path: str) -> None:
    manifest = Path(manifest_path)
    existing = {"assets": []}
    if manifest.exists():
        with open(manifest, "r", encoding="utf-8") as f:
            existing = json.load(f)

    existing_ids = {a["id"] for a in existing["assets"]}
    for asset in assets:
        if asset["id"] not in existing_ids:
            existing["assets"].append(asset)

    manifest.parent.mkdir(parents=True, exist_ok=True)
    with open(manifest, "w", encoding="utf-8") as f:
        json.dump(existing, f, indent=2, ensure_ascii=False)
    print(f"Manifest updated: {manifest} ({len(existing['assets'])} assets)")


def cmd_search(args):
    search_fn = {
        "pexels": search_pexels,
        "pixabay": search_pixabay,
        "unsplash": search_unsplash,
    }
    fn = search_fn.get(args.source)
    if not fn:
        print(f"Unknown source: {args.source}. Use: pexels, pixabay, unsplash")
        sys.exit(1)

    results = fn(args.query, args.type, args.count)
    print(f"\nFound {len(results)} results for '{args.query}' on {args.source}:\n")
    for i, r in enumerate(results, 1):
        print(f"  {i}. [{r['width']}x{r['height']}] {r['url'][:80]}...")
        print(f"     {r['attribution']}")
    print(json.dumps(results, indent=2, ensure_ascii=False))


def cmd_download(args):
    download_file(args.url, args.output)


def cmd_batch(args):
    search_fn = {
        "pexels": search_pexels,
        "pixabay": search_pixabay,
        "unsplash": search_unsplash,
    }
    fn = search_fn.get(args.source)
    if not fn:
        print(f"Unknown source: {args.source}")
        sys.exit(1)

    results = fn(args.query, args.type, args.count)
    print(f"Found {len(results)} results. Downloading...")

    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)
    ext = ".mp4" if args.type == "video" else ".jpg"

    manifest_assets = []
    for i, r in enumerate(results):
        filename = f"{args.source}_{r['id']}{ext}"
        filepath = output_dir / filename
        download_file(r["url"], str(filepath))
        r["path"] = str(filepath)
        r["type"] = args.type
        manifest_assets.append(r)

    manifest_path = output_dir.parent / "manifest.json"
    update_manifest(manifest_assets, str(manifest_path))
    print(f"\nBatch download complete: {len(results)} files")


def main():
    parser = argparse.ArgumentParser(description="Asset fetcher for Pro Video Maker")
    sub = parser.add_subparsers(dest="command")

    p_search = sub.add_parser("search", help="Search for assets")
    p_search.add_argument("--query", "-q", required=True, help="Search keywords")
    p_search.add_argument("--source", "-s", default="pexels", choices=["pexels", "pixabay", "unsplash"])
    p_search.add_argument("--type", "-t", default="photo", choices=["photo", "video"])
    p_search.add_argument("--count", "-c", type=int, default=5)

    p_download = sub.add_parser("download", help="Download a single asset")
    p_download.add_argument("--url", "-u", required=True, help="Direct URL to download")
    p_download.add_argument("--output", "-o", required=True, help="Output file path")

    p_batch = sub.add_parser("batch", help="Search and download multiple assets")
    p_batch.add_argument("--query", "-q", required=True)
    p_batch.add_argument("--source", "-s", default="pexels", choices=["pexels", "pixabay", "unsplash"])
    p_batch.add_argument("--type", "-t", default="photo", choices=["photo", "video"])
    p_batch.add_argument("--count", "-c", type=int, default=5)
    p_batch.add_argument("--output", "-o", default="public/assets/", help="Output directory")

    args = parser.parse_args()

    if args.command == "search":
        cmd_search(args)
    elif args.command == "download":
        cmd_download(args)
    elif args.command == "batch":
        cmd_batch(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
