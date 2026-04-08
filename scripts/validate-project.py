#!/usr/bin/env python3
"""
Project validator for Pro Video Maker.

Checks a generated Remotion project for common issues:
- Aesthetic violations
- Accessibility problems
- Missing assets
- Configuration errors

Usage:
  python scripts/validate-project.py /path/to/remotion-project
  python scripts/validate-project.py .  # current directory
"""

import argparse
import json
import re
import sys
from pathlib import Path


class ValidationResult:
    def __init__(self):
        self.errors: list[str] = []
        self.warnings: list[str] = []
        self.passed: list[str] = []

    def error(self, msg: str):
        self.errors.append(msg)

    def warn(self, msg: str):
        self.warnings.append(msg)

    def ok(self, msg: str):
        self.passed.append(msg)

    def report(self) -> str:
        lines = ["\n=== PRO VIDEO MAKER - PROJECT VALIDATION ===\n"]

        if self.passed:
            lines.append(f"PASSED ({len(self.passed)}):")
            for item in self.passed:
                lines.append(f"  [OK] {item}")

        if self.warnings:
            lines.append(f"\nWARNINGS ({len(self.warnings)}):")
            for item in self.warnings:
                lines.append(f"  [!!] {item}")

        if self.errors:
            lines.append(f"\nERRORS ({len(self.errors)}):")
            for item in self.errors:
                lines.append(f"  [XX] {item}")

        total = len(self.passed) + len(self.warnings) + len(self.errors)
        lines.append(
            f"\nSummary: {len(self.passed)}/{total} passed, "
            f"{len(self.warnings)} warnings, {len(self.errors)} errors"
        )

        if not self.errors:
            lines.append("\nResult: PASS")
        else:
            lines.append("\nResult: FAIL - fix errors before rendering")

        return "\n".join(lines)


def check_project_structure(project_dir: Path, result: ValidationResult):
    required_files = [
        "package.json",
        "tsconfig.json",
        "src/Root.tsx",
        "src/index.ts",
    ]
    for filename in required_files:
        if (project_dir / filename).exists():
            result.ok(f"Required file exists: {filename}")
        else:
            result.error(f"Missing required file: {filename}")

    if (project_dir / "src/Video.tsx").exists():
        result.ok("Main Video composition found")
    else:
        result.warn("No Video.tsx found - ensure a main composition exists")


def check_package_json(project_dir: Path, result: ValidationResult):
    pkg_path = project_dir / "package.json"
    if not pkg_path.exists():
        return

    with open(pkg_path, "r", encoding="utf-8") as f:
        pkg = json.load(f)

    deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}

    required_deps = ["remotion", "react", "react-dom"]
    for dep in required_deps:
        if dep in deps:
            result.ok(f"Required dependency: {dep}")
        else:
            result.error(f"Missing required dependency: {dep}")

    optional_deps = ["gsap", "d3", "@remotion/transitions", "zod"]
    for dep in optional_deps:
        if dep in deps:
            result.ok(f"Optional dependency installed: {dep}")

    zod_version = deps.get("zod")
    if zod_version:
        normalized = zod_version.lstrip("^~<>=").split(".")[0]
        if normalized and normalized != "4":
            result.warn(
                f"zod version '{zod_version}' may be incompatible with Remotion 4; prefer zod 4.x"
            )


def check_hardcoded_colors(project_dir: Path, result: ValidationResult):
    src_dir = project_dir / "src"
    if not src_dir.exists():
        return

    hex_pattern = re.compile(r'["\']#[0-9a-fA-F]{3,8}["\']')
    violations = []

    for tsx_file in src_dir.rglob("*.tsx"):
        if "motion-tokens" in tsx_file.name or "styles" in str(tsx_file):
            continue
        content = tsx_file.read_text(encoding="utf-8", errors="ignore")
        matches = hex_pattern.findall(content)
        if len(matches) > 5:
            violations.append(f"{tsx_file.relative_to(project_dir)}: {len(matches)} hardcoded colors")

    if violations:
        for violation in violations:
            result.warn(f"Hardcoded colors found in {violation} - use palette from motion-tokens")
    else:
        result.ok("No excessive hardcoded colors detected")


def check_text_size(project_dir: Path, result: ValidationResult):
    src_dir = project_dir / "src"
    if not src_dir.exists():
        return

    small_font_pattern = re.compile(r"fontSize:\s*(\d+)")
    issues = []

    for tsx_file in src_dir.rglob("*.tsx"):
        content = tsx_file.read_text(encoding="utf-8", errors="ignore")
        for match in small_font_pattern.finditer(content):
            size = int(match.group(1))
            if size < 18:
                issues.append(f"{tsx_file.relative_to(project_dir)}: fontSize {size} (< 18px)")

    if issues:
        for issue in issues:
            result.warn(f"Small text: {issue} - may be unreadable in video")
    else:
        result.ok("All text sizes >= 18px")


def check_animation_duration(project_dir: Path, result: ValidationResult):
    src_dir = project_dir / "src"
    if not src_dir.exists():
        return

    duration_pattern = re.compile(r"durationInFrames:\s*(\d+)")
    issues = []

    for tsx_file in src_dir.rglob("*.tsx"):
        content = tsx_file.read_text(encoding="utf-8", errors="ignore")
        for match in duration_pattern.finditer(content):
            frames = int(match.group(1))
            if frames < 15:
                issues.append(f"{tsx_file.relative_to(project_dir)}: {frames} frames (< 0.5s at 30fps)")

    if issues:
        for issue in issues:
            result.warn(f"Very short duration: {issue}")
    else:
        result.ok("All durations seem reasonable")


def check_assets(project_dir: Path, result: ValidationResult):
    public_dir = project_dir / "public"
    assets_dir = public_dir / "assets"

    if not public_dir.exists():
        result.warn("No public/ directory - assets may be missing")
        return

    if assets_dir.exists():
        asset_count = sum(1 for path in assets_dir.rglob("*") if path.is_file())
        if asset_count > 0:
            result.ok(f"Assets directory has {asset_count} files")
        else:
            result.warn("Assets directory is empty")

    manifest = assets_dir / "manifest.json" if assets_dir.exists() else None
    if manifest and manifest.exists():
        result.ok("Asset manifest.json found")
    else:
        result.warn("No manifest.json - consider tracking assets")


def check_accessibility(project_dir: Path, result: ValidationResult):
    src_dir = project_dir / "src"
    if not src_dir.exists():
        return

    found_reduced_motion = False
    for tsx_file in src_dir.rglob("*.tsx"):
        content = tsx_file.read_text(encoding="utf-8", errors="ignore")
        if "prefers-reduced-motion" in content or "reducedMotion" in content:
            found_reduced_motion = True
            break

    if found_reduced_motion:
        result.ok("Reduced motion support detected")
    else:
        result.warn("No prefers-reduced-motion support found")


def main():
    parser = argparse.ArgumentParser(description="Validate Pro Video Maker Remotion project")
    parser.add_argument("project_dir", nargs="?", default=".", help="Path to Remotion project")
    args = parser.parse_args()

    project_dir = Path(args.project_dir).resolve()
    if not project_dir.exists():
        print(f"Error: {project_dir} does not exist")
        sys.exit(1)

    result = ValidationResult()

    check_project_structure(project_dir, result)
    check_package_json(project_dir, result)
    check_hardcoded_colors(project_dir, result)
    check_text_size(project_dir, result)
    check_animation_duration(project_dir, result)
    check_assets(project_dir, result)
    check_accessibility(project_dir, result)

    print(result.report())
    sys.exit(1 if result.errors else 0)


if __name__ == "__main__":
    main()
