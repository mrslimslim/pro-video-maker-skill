#!/usr/bin/env python3
"""
Design System Search Engine for Pro Video Maker.

Searches across motion styles, palettes, typography, transitions, effects,
and reasoning rules to generate a complete Motion Design System recommendation.

Usage:
  python scripts/search.py "tech product launch" --design-system
  python scripts/search.py "beauty spa wellness" --design-system -p "Serenity Spa"
  python scripts/search.py "kinetic typography" --domain style
  python scripts/search.py "chart animation" --domain effect
"""

import argparse
import json
import re
import sys
from pathlib import Path


SCRIPT_DIR = Path(__file__).parent.resolve()
DATA_DIR = SCRIPT_DIR.parent / "data"


def load_json(filename: str) -> list:
    path = DATA_DIR / filename
    if not path.exists():
        print(f"Warning: {path} not found", file=sys.stderr)
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def tokenize(text: str) -> list[str]:
    text = text.lower()
    return re.findall(r"[a-z0-9\u4e00-\u9fff]+", text)


def bm25_score(
    query_tokens: list[str],
    doc_tokens: list[str],
    k1: float = 1.5,
    b: float = 0.75,
    avgdl: int = 20,
) -> float:
    dl = len(doc_tokens)
    score = 0.0
    for qt in query_tokens:
        tf = doc_tokens.count(qt)
        if tf == 0:
            continue
        idf = 1.0
        numerator = tf * (k1 + 1)
        denominator = tf + k1 * (1 - b + b * dl / avgdl)
        score += idf * numerator / denominator
    return score


def search_collection(query: str, items: list, text_fields: list[str], top_n: int = 3) -> list:
    query_tokens = tokenize(query)
    results = []
    for item in items:
        doc_text = " ".join(
            str(item.get(field, ""))
            if not isinstance(item.get(field), list)
            else " ".join(item.get(field, []))
            for field in text_fields
        )
        doc_tokens = tokenize(doc_text)
        score = bm25_score(query_tokens, doc_tokens)
        if score > 0:
            results.append((score, item))
    results.sort(key=lambda value: -value[0])
    return [result[1] for result in results[:top_n]]


def search_styles(query: str) -> list:
    styles = load_json("motion-styles.json")
    return search_collection(query, styles, ["name", "keywords", "bestFor", "category", "mood"], top_n=3)


def search_palettes(query: str) -> list:
    palettes = load_json("palettes.json")
    return search_collection(query, palettes, ["name", "industry", "mood"], top_n=3)


def search_typography(query: str) -> list:
    typography = load_json("typography.json")
    return search_collection(query, typography, ["name", "mood", "bestFor"], top_n=3)


def search_transitions(query: str) -> list:
    transitions = load_json("transitions.json")
    return search_collection(query, transitions, ["name", "bestFor", "mood", "category"], top_n=5)


def search_effects(query: str) -> list:
    effects = load_json("effects.json")
    return search_collection(query, effects, ["name", "bestFor", "mood", "category", "description"], top_n=5)


def search_reasoning_rules(query: str) -> list:
    rules = load_json("reasoning-rules.json")
    return search_collection(query, rules, ["industry", "keywords"], top_n=1)


def build_design_system(query: str, project_name: str = "My Video") -> dict:
    styles = search_styles(query)
    palettes = search_palettes(query)
    typography = search_typography(query)
    transitions = search_transitions(query)
    effects = search_effects(query)
    rules = search_reasoning_rules(query)

    style = styles[0] if styles else {
        "name": "Minimal Motion",
        "tokens": {
            "duration": "normal",
            "easing": "power2.out",
            "stagger": 0.08,
            "intensity": "moderate",
        },
    }
    palette = palettes[0] if palettes else {
        "name": "Tech Dark",
        "colors": {
            "primary": "#6366F1",
            "background": "#0F172A",
            "text": "#F8FAFC",
        },
    }
    typography_choice = typography[0] if typography else {
        "name": "Modern Sans",
        "heading": "Inter",
        "body": "Inter",
    }
    rule = rules[0] if rules else None
    checklist = [
        "Text contrast >= 4.5:1",
        "No emoji as icons (use SVG: Lucide)",
        "Animation duration 200-1200ms",
        "Max 3 simultaneous animations",
        "Safe zones respected (10% margin)",
        "Subtitle readable at target resolution",
    ]

    return {
        "projectName": project_name,
        "query": query,
        "style": style,
        "palette": palette,
        "typography": typography_choice,
        "transitions": transitions[:4],
        "effects": effects[:5],
        "reasoningRule": rule,
        "checklist": checklist,
    }


def generate_design_system(query: str, project_name: str = "My Video") -> str:
    system = build_design_system(query, project_name)
    style = system["style"]
    palette = system["palette"]
    typography_choice = system["typography"]
    rule = system["reasoningRule"]

    width = 78

    def border() -> str:
        return "+" + ("-" * width) + "+"

    def row(label: str = "", value: str = "") -> str:
        if not label and not value:
            content = ""
        elif value:
            content = f" {label}: {value}"
        else:
            content = f" {label}"
        return f"|{content[:width].ljust(width)}|"

    lines = [
        border(),
        row("TARGET", f"{project_name} - RECOMMENDED MOTION DESIGN SYSTEM"),
        border(),
        row(),
        row("STYLE", style["name"]),
    ]

    if "mood" in style:
        lines.append(row("  Mood", str(style["mood"])))

    tokens = style.get("tokens", {})
    tokens_str = (
        f"Duration: {tokens.get('duration', 'normal')}, "
        f"Easing: {tokens.get('easing', 'power2.out')}, "
        f"Stagger: {tokens.get('stagger', 0.08)}"
    )
    lines.append(row("  Tokens", tokens_str))
    lines.append(row())

    lines.append(row("PALETTE", palette["name"]))
    colors = palette.get("colors", {})
    for key in ["primary", "secondary", "accent", "background", "text"]:
        if key in colors:
            lines.append(row(f"  {key.title()}", str(colors[key])))
    lines.append(row())

    lines.append(
        row(
            "TYPOGRAPHY",
            f"{typography_choice.get('heading', '')} / {typography_choice.get('body', '')}",
        )
    )
    if "mood" in typography_choice:
        lines.append(row("  Mood", str(typography_choice["mood"])))
    if typography_choice.get("googleFonts"):
        lines.append(row("  Fonts", str(typography_choice["googleFonts"])))
    lines.append(row())

    transitions = system["transitions"]
    if transitions:
        lines.append(row("TRANSITIONS", ", ".join(item["name"] for item in transitions)))

    effects = system["effects"]
    if effects:
        lines.append(row("EFFECTS", ", ".join(item["name"] for item in effects)))
    lines.append(row())

    if rule:
        anti_patterns = rule.get("antiPatterns", [])
        if anti_patterns:
            lines.append(row("AVOID", " + ".join(anti_patterns[:4])))
        scene_flow = rule.get("sceneFlow", [])
        if scene_flow:
            lines.append(row("SCENE FLOW", " -> ".join(scene_flow)))
    elif style.get("avoid"):
        lines.append(row("AVOID", ", ".join(style["avoid"])))

    lines.append(row())
    lines.append(row("PRE-DELIVERY CHECKLIST"))
    for item in system["checklist"]:
        lines.append(row(f"  [ ] {item}"))
    lines.append(row())
    lines.append(border())

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="Pro Video Maker Design System Search")
    parser.add_argument("query", help="Search keywords")
    parser.add_argument("--design-system", action="store_true", help="Generate full design system")
    parser.add_argument("-p", "--project-name", default="My Video", help="Project name for design system")
    parser.add_argument(
        "--domain",
        choices=["style", "palette", "typography", "transition", "effect", "rule"],
        help="Search a specific domain only",
    )
    parser.add_argument("-f", "--format", choices=["ascii", "json"], default="ascii", help="Output format")

    args = parser.parse_args()

    if args.design_system:
        if args.format == "json":
            print(json.dumps(build_design_system(args.query, args.project_name), indent=2, ensure_ascii=False))
        else:
            print(generate_design_system(args.query, args.project_name))
        return

    search_fns = {
        "style": ("motion-styles.json", ["name", "keywords", "bestFor", "category", "mood"]),
        "palette": ("palettes.json", ["name", "industry", "mood"]),
        "typography": ("typography.json", ["name", "mood", "bestFor"]),
        "transition": ("transitions.json", ["name", "bestFor", "mood", "category"]),
        "effect": ("effects.json", ["name", "bestFor", "mood", "category", "description"]),
        "rule": ("reasoning-rules.json", ["industry", "keywords"]),
    }

    if args.domain:
        filename, fields = search_fns[args.domain]
        items = load_json(filename)
        results = search_collection(args.query, items, fields, top_n=5)
    else:
        results = {}
        for domain, (filename, fields) in search_fns.items():
            items = load_json(filename)
            results[domain] = search_collection(args.query, items, fields, top_n=3)

    if args.format == "json":
        print(json.dumps(results, indent=2, ensure_ascii=False))
    elif isinstance(results, dict):
        for domain, items in results.items():
            print(f"\n=== {domain.upper()} ===")
            for index, item in enumerate(items, 1):
                name = item.get("name", item.get("industry", item.get("id", "?")))
                print(f"  {index}. {name}")
    else:
        for index, item in enumerate(results, 1):
            name = item.get("name", item.get("industry", item.get("id", "?")))
            print(f"  {index}. {name}")
            if "keywords" in item:
                print(f"     Keywords: {', '.join(item['keywords'][:8])}")


if __name__ == "__main__":
    main()
