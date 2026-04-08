#!/usr/bin/env python3
"""
Material Library Manager for Pro Video Maker.

Manages the material library: add blocks, assets, styles, compositions;
search and list materials; rebuild the registry index.

Usage:
  python scripts/material-manager.py list [--type block|asset|style|composition]
  python scripts/material-manager.py search --query "tech dark" [--type block]
  python scripts/material-manager.py add-block --id my-block --category title --source path/to/Component.tsx
  python scripts/material-manager.py add-asset --file path/to/image.jpg --category backgrounds [--tags "dark,gradient"]
  python scripts/material-manager.py add-style --file path/to/style.json
  python scripts/material-manager.py add-composition --dir path/to/comp-dir
  python scripts/material-manager.py rebuild-index
  python scripts/material-manager.py stats
"""

import argparse
import json
import os
import shutil
import sys
from datetime import date
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
SKILL_DIR = SCRIPT_DIR.parent
LIBRARY_DIR = SKILL_DIR / "material-library"
INDEX_PATH = LIBRARY_DIR / "index.json"

BLOCK_CATEGORIES = [
    "title", "content", "data-viz", "cta", "quote", "transition",
    "list-reveal", "image-showcase", "code-block", "comparison", "custom",
]

ASSET_CATEGORIES = ["backgrounds", "overlays", "icons", "audio", "lottie"]


def load_index() -> dict:
    if INDEX_PATH.exists():
        with open(INDEX_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "version": "1.0.0",
        "lastUpdated": str(date.today()),
        "stats": {"blocks": 0, "assets": 0, "styles": 0, "compositions": 0},
        "blocks": [],
        "assets": [],
        "styles": [],
        "compositions": [],
    }


def save_index(index: dict):
    index["lastUpdated"] = str(date.today())
    index["stats"] = {
        "blocks": len(index["blocks"]),
        "assets": len(index["assets"]),
        "styles": len(index["styles"]),
        "compositions": len(index["compositions"]),
    }
    INDEX_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(INDEX_PATH, "w", encoding="utf-8") as f:
        json.dump(index, f, indent=2, ensure_ascii=False)
    print(f"Index saved: {INDEX_PATH}")


def cmd_list(args):
    index = load_index()
    type_filter = getattr(args, "type", None)

    sections = []
    if not type_filter or type_filter == "block":
        sections.append(("Blocks", index.get("blocks", [])))
    if not type_filter or type_filter == "asset":
        sections.append(("Assets", index.get("assets", [])))
    if not type_filter or type_filter == "style":
        sections.append(("Styles", index.get("styles", [])))
    if not type_filter or type_filter == "composition":
        sections.append(("Compositions", index.get("compositions", [])))

    for section_name, items in sections:
        print(f"\n{'='*50}")
        print(f" {section_name} ({len(items)})")
        print(f"{'='*50}")
        if not items:
            print("  (empty)")
            continue
        for item in items:
            tags = ", ".join(item.get("tags", []))
            cat = item.get("category", "")
            cat_str = f" [{cat}]" if cat else ""
            print(f"  - {item['id']}{cat_str}")
            if tags:
                print(f"    tags: {tags}")
            print(f"    path: {item.get('path', 'N/A')}")


def cmd_search(args):
    index = load_index()
    query_terms = args.query.lower().split()
    type_filter = getattr(args, "type", None)

    results = []

    def match_item(item, section_type):
        if type_filter and section_type != type_filter:
            return False
        searchable = " ".join([
            item.get("id", ""),
            item.get("category", ""),
            " ".join(item.get("tags", [])),
            item.get("path", ""),
        ]).lower()
        return all(term in searchable for term in query_terms)

    for item in index.get("blocks", []):
        if match_item(item, "block"):
            results.append(("block", item))
    for item in index.get("assets", []):
        if match_item(item, "asset"):
            results.append(("asset", item))
    for item in index.get("styles", []):
        if match_item(item, "style"):
            results.append(("style", item))
    for item in index.get("compositions", []):
        if match_item(item, "composition"):
            results.append(("composition", item))

    print(f"\nSearch results for '{args.query}' ({len(results)} found):\n")
    for rtype, item in results:
        tags = ", ".join(item.get("tags", []))
        print(f"  [{rtype}] {item['id']}")
        if tags:
            print(f"    tags: {tags}")
        print(f"    path: {item.get('path', 'N/A')}")

        meta_path = LIBRARY_DIR / item.get("path", "") / "meta.json"
        if not meta_path.exists():
            meta_path = LIBRARY_DIR / item.get("path", "")
            if meta_path.suffix == ".json" and meta_path.exists():
                with open(meta_path, "r", encoding="utf-8") as f:
                    meta = json.load(f)
                desc = meta.get("description", meta.get("name", ""))
                if desc:
                    print(f"    desc: {desc}")
        elif meta_path.exists():
            with open(meta_path, "r", encoding="utf-8") as f:
                meta = json.load(f)
            desc = meta.get("description", "")
            if desc:
                print(f"    desc: {desc}")


def cmd_add_block(args):
    block_id = args.id
    category = args.category

    if category not in BLOCK_CATEGORIES:
        print(f"Error: Invalid category '{category}'. Must be one of: {', '.join(BLOCK_CATEGORIES)}")
        sys.exit(1)

    block_dir = LIBRARY_DIR / "blocks" / category / block_id
    if block_dir.exists():
        print(f"Error: Block '{block_id}' already exists at {block_dir}")
        sys.exit(1)

    block_dir.mkdir(parents=True, exist_ok=True)

    if args.source:
        source = Path(args.source)
        if source.is_file():
            shutil.copy2(source, block_dir / "Component.tsx")
            print(f"Copied component: {source} -> {block_dir / 'Component.tsx'}")
        elif source.is_dir():
            for f in source.iterdir():
                shutil.copy2(f, block_dir / f.name)
            print(f"Copied directory contents: {source} -> {block_dir}")

    tags = [t.strip() for t in (args.tags or "").split(",") if t.strip()]
    if not tags:
        tags = [category, block_id.replace("-", " ").split()[0] if "-" in block_id else block_id]

    meta = {
        "id": block_id,
        "name": args.name or block_id.replace("-", " ").title(),
        "version": "1.0.0",
        "type": "block",
        "category": category,
        "tags": tags,
        "description": args.description or f"Custom {category} block: {block_id}",
        "contextMatch": {"mood": [], "industry": [], "platform": [], "contentType": []},
        "props": {},
        "duration": {"minFrames": 90, "maxFrames": 240, "defaultFrames": 150},
        "component": "./Component.tsx",
        "schemaFile": "./schema.ts",
        "compatibleStyles": [],
        "compatibleTransitions": [],
        "createdAt": str(date.today()),
        "source": "user",
    }

    meta_path = block_dir / "meta.json"
    if not meta_path.exists():
        with open(meta_path, "w", encoding="utf-8") as f:
            json.dump(meta, f, indent=2, ensure_ascii=False)
        print(f"Created meta.json: {meta_path}")

    schema_path = block_dir / "schema.ts"
    if not schema_path.exists():
        class_name = "".join(w.capitalize() for w in block_id.split("-"))
        schema_content = f'''import {{ z }} from "zod";

export const {class_name[0].lower() + class_name[1:]}Schema = z.object({{
  // Add your props here
  backgroundColor: z.string().default("#0F172A"),
  textColor: z.string().default("#F8FAFC"),
  accentColor: z.string().default("#6366F1"),
  fontFamily: z.string().default("Inter"),
}});

export type {class_name}Props = z.infer<typeof {class_name[0].lower() + class_name[1:]}Schema>;
'''
        with open(schema_path, "w", encoding="utf-8") as f:
            f.write(schema_content)
        print(f"Created schema.ts: {schema_path}")

    index = load_index()
    existing_ids = {b["id"] for b in index["blocks"]}
    if block_id not in existing_ids:
        index["blocks"].append({
            "id": block_id,
            "category": category,
            "path": f"blocks/{category}/{block_id}",
            "tags": tags,
        })
        save_index(index)

    print(f"\nBlock '{block_id}' added to material library.")
    print(f"  Directory: {block_dir}")
    print(f"  Next steps:")
    print(f"    1. Edit Component.tsx with your component code")
    print(f"    2. Edit schema.ts with Zod prop definitions")
    print(f"    3. Edit meta.json to fill in contextMatch, props, etc.")


def cmd_add_asset(args):
    source_file = Path(args.file)
    if not source_file.exists():
        print(f"Error: File not found: {source_file}")
        sys.exit(1)

    ext = source_file.suffix.lower()
    ext_category_map = {
        ".jpg": "backgrounds", ".jpeg": "backgrounds", ".png": "backgrounds",
        ".webp": "backgrounds", ".gif": "backgrounds",
        ".mp4": "backgrounds", ".webm": "backgrounds", ".mov": "backgrounds",
        ".mp3": "audio", ".wav": "audio", ".ogg": "audio", ".aac": "audio",
        ".svg": "icons",
        ".json": "lottie",
    }

    category = args.category or ext_category_map.get(ext, "backgrounds")
    if category not in ASSET_CATEGORIES:
        print(f"Error: Invalid category '{category}'. Must be one of: {', '.join(ASSET_CATEGORIES)}")
        sys.exit(1)

    asset_dir = LIBRARY_DIR / "assets" / category
    asset_dir.mkdir(parents=True, exist_ok=True)
    dest = asset_dir / source_file.name

    if dest.exists():
        print(f"Warning: Asset already exists at {dest}, overwriting.")

    shutil.copy2(source_file, dest)
    print(f"Copied: {source_file} -> {dest}")

    tags = [t.strip() for t in (args.tags or "").split(",") if t.strip()]
    if not tags:
        tags = [category, source_file.stem.replace("-", " ").replace("_", " ")]

    asset_id = source_file.stem

    meta = {
        "id": asset_id,
        "filename": source_file.name,
        "type": "asset",
        "category": category,
        "format": ext.lstrip("."),
        "tags": tags,
        "addedAt": str(date.today()),
        "source": "user",
    }

    meta_path = asset_dir / f"{asset_id}.meta.json"
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2, ensure_ascii=False)

    index = load_index()
    existing_ids = {a["id"] for a in index["assets"]}
    if asset_id not in existing_ids:
        index["assets"].append({
            "id": asset_id,
            "category": category,
            "path": f"assets/{category}/{source_file.name}",
            "tags": tags,
        })
        save_index(index)

    print(f"Asset '{asset_id}' added to material library.")


def cmd_add_style(args):
    source_file = Path(args.file)
    if not source_file.exists():
        print(f"Error: File not found: {source_file}")
        sys.exit(1)

    with open(source_file, "r", encoding="utf-8") as f:
        style_data = json.load(f)

    style_id = style_data.get("id")
    if not style_id:
        print("Error: Style JSON must have an 'id' field.")
        sys.exit(1)

    dest = LIBRARY_DIR / "styles" / f"{style_id}.json"
    shutil.copy2(source_file, dest)
    print(f"Copied: {source_file} -> {dest}")

    index = load_index()
    existing_ids = {s["id"] for s in index["styles"]}
    tags = list(style_data.get("contextMatch", {}).get("mood", []))
    tags += list(style_data.get("contextMatch", {}).get("industry", []))

    if style_id not in existing_ids:
        index["styles"].append({
            "id": style_id,
            "path": f"styles/{style_id}.json",
            "tags": tags[:8],
        })
        save_index(index)

    print(f"Style '{style_id}' added to material library.")


def cmd_add_composition(args):
    source_dir = Path(args.dir)
    if not source_dir.is_dir():
        print(f"Error: Directory not found: {source_dir}")
        sys.exit(1)

    meta_file = source_dir / "meta.json"
    comp_file = source_dir / "composition.json"

    if not meta_file.exists() or not comp_file.exists():
        print(f"Error: Composition directory must contain meta.json and composition.json")
        sys.exit(1)

    with open(meta_file, "r", encoding="utf-8") as f:
        meta = json.load(f)

    comp_id = meta.get("id")
    if not comp_id:
        print("Error: meta.json must have an 'id' field.")
        sys.exit(1)

    dest_dir = LIBRARY_DIR / "compositions" / comp_id
    if dest_dir.exists():
        print(f"Warning: Composition '{comp_id}' already exists, overwriting.")
        shutil.rmtree(dest_dir)

    shutil.copytree(source_dir, dest_dir)
    print(f"Copied: {source_dir} -> {dest_dir}")

    index = load_index()
    existing_ids = {c["id"] for c in index["compositions"]}
    tags = meta.get("tags", [])

    if comp_id not in existing_ids:
        index["compositions"].append({
            "id": comp_id,
            "path": f"compositions/{comp_id}",
            "tags": tags,
        })
        save_index(index)

    print(f"Composition '{comp_id}' added to material library.")


def cmd_rebuild_index(args):
    """Scan the library directory and rebuild index.json from disk."""
    index = {
        "version": "1.0.0",
        "lastUpdated": str(date.today()),
        "stats": {},
        "blocks": [],
        "assets": [],
        "styles": [],
        "compositions": [],
    }

    blocks_dir = LIBRARY_DIR / "blocks"
    if blocks_dir.exists():
        for category_dir in sorted(blocks_dir.iterdir()):
            if not category_dir.is_dir():
                continue
            for block_dir in sorted(category_dir.iterdir()):
                if not block_dir.is_dir():
                    continue
                meta_path = block_dir / "meta.json"
                if meta_path.exists():
                    with open(meta_path, "r", encoding="utf-8") as f:
                        meta = json.load(f)
                    index["blocks"].append({
                        "id": meta.get("id", block_dir.name),
                        "category": meta.get("category", category_dir.name),
                        "path": f"blocks/{category_dir.name}/{block_dir.name}",
                        "tags": meta.get("tags", []),
                    })

    assets_dir = LIBRARY_DIR / "assets"
    if assets_dir.exists():
        for cat_dir in sorted(assets_dir.iterdir()):
            if not cat_dir.is_dir():
                continue
            for asset_file in sorted(cat_dir.iterdir()):
                if asset_file.suffix == ".json" and asset_file.name.endswith(".meta.json"):
                    with open(asset_file, "r", encoding="utf-8") as f:
                        meta = json.load(f)
                    index["assets"].append({
                        "id": meta.get("id", asset_file.stem.replace(".meta", "")),
                        "category": meta.get("category", cat_dir.name),
                        "path": f"assets/{cat_dir.name}/{meta.get('filename', '')}",
                        "tags": meta.get("tags", []),
                    })

    styles_dir = LIBRARY_DIR / "styles"
    if styles_dir.exists():
        for style_file in sorted(styles_dir.glob("*.json")):
            with open(style_file, "r", encoding="utf-8") as f:
                style_data = json.load(f)
            tags = list(style_data.get("contextMatch", {}).get("mood", []))
            tags += list(style_data.get("contextMatch", {}).get("industry", []))[:5]
            index["styles"].append({
                "id": style_data.get("id", style_file.stem),
                "path": f"styles/{style_file.name}",
                "tags": tags[:8],
            })

    comps_dir = LIBRARY_DIR / "compositions"
    if comps_dir.exists():
        for comp_dir in sorted(comps_dir.iterdir()):
            if not comp_dir.is_dir():
                continue
            meta_path = comp_dir / "meta.json"
            if meta_path.exists():
                with open(meta_path, "r", encoding="utf-8") as f:
                    meta = json.load(f)
                index["compositions"].append({
                    "id": meta.get("id", comp_dir.name),
                    "path": f"compositions/{comp_dir.name}",
                    "tags": meta.get("tags", []),
                })

    save_index(index)
    print(f"\nRebuilt index from disk:")
    print(f"  Blocks: {len(index['blocks'])}")
    print(f"  Assets: {len(index['assets'])}")
    print(f"  Styles: {len(index['styles'])}")
    print(f"  Compositions: {len(index['compositions'])}")


def cmd_stats(args):
    index = load_index()
    print(f"\nMaterial Library Stats")
    print(f"{'='*40}")
    print(f"  Version:      {index.get('version', 'N/A')}")
    print(f"  Last Updated: {index.get('lastUpdated', 'N/A')}")
    print(f"  Blocks:       {len(index.get('blocks', []))}")
    print(f"  Assets:       {len(index.get('assets', []))}")
    print(f"  Styles:       {len(index.get('styles', []))}")
    print(f"  Compositions: {len(index.get('compositions', []))}")

    block_cats = {}
    for b in index.get("blocks", []):
        cat = b.get("category", "unknown")
        block_cats[cat] = block_cats.get(cat, 0) + 1
    if block_cats:
        print(f"\n  Blocks by Category:")
        for cat, count in sorted(block_cats.items()):
            print(f"    {cat}: {count}")


def main():
    parser = argparse.ArgumentParser(
        description="Material Library Manager for Pro Video Maker"
    )
    sub = parser.add_subparsers(dest="command")

    p_list = sub.add_parser("list", help="List all materials")
    p_list.add_argument("--type", choices=["block", "asset", "style", "composition"])

    p_search = sub.add_parser("search", help="Search materials")
    p_search.add_argument("--query", "-q", required=True, help="Search keywords")
    p_search.add_argument("--type", choices=["block", "asset", "style", "composition"])

    p_add_block = sub.add_parser("add-block", help="Add a new block")
    p_add_block.add_argument("--id", required=True, help="Block ID (e.g. title-gradient-bold)")
    p_add_block.add_argument("--category", required=True, choices=BLOCK_CATEGORIES)
    p_add_block.add_argument("--source", help="Source .tsx file or directory to copy")
    p_add_block.add_argument("--name", help="Human-readable name")
    p_add_block.add_argument("--description", help="Block description")
    p_add_block.add_argument("--tags", help="Comma-separated tags")

    p_add_asset = sub.add_parser("add-asset", help="Add a media asset")
    p_add_asset.add_argument("--file", required=True, help="Path to asset file")
    p_add_asset.add_argument("--category", choices=ASSET_CATEGORIES, help="Asset category (auto-detected if omitted)")
    p_add_asset.add_argument("--tags", help="Comma-separated tags")

    p_add_style = sub.add_parser("add-style", help="Add a style preset")
    p_add_style.add_argument("--file", required=True, help="Path to style JSON file")

    p_add_comp = sub.add_parser("add-composition", help="Add a composition template")
    p_add_comp.add_argument("--dir", required=True, help="Path to composition directory (must contain meta.json + composition.json)")

    sub.add_parser("rebuild-index", help="Rebuild index.json from disk contents")
    sub.add_parser("stats", help="Show library statistics")

    args = parser.parse_args()

    commands = {
        "list": cmd_list,
        "search": cmd_search,
        "add-block": cmd_add_block,
        "add-asset": cmd_add_asset,
        "add-style": cmd_add_style,
        "add-composition": cmd_add_composition,
        "rebuild-index": cmd_rebuild_index,
        "stats": cmd_stats,
    }

    fn = commands.get(args.command)
    if fn:
        fn(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
