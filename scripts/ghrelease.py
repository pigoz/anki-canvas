#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""Build the deck locally and publish it as a v0.X GitHub Release.

Auto-increments the minor version past the latest existing v0.N release, asks
Claude to summarize commits since that tag, and publishes the deck.

Requires: `gh` (authenticated), `git`, `bun`, `claude`. Clean working tree, HEAD
pushed to origin/master.
"""
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DECK = ROOT / "scripts" / "deck.apkg"

CLAUDE_PROMPT = """\
You are writing release notes for anki-canvas, a small TypeScript widget that
adds a touch drawing canvas to Anki flashcards.

Below are the git commits since the previous release. Summarize them as 1-5
concise markdown bullet points, user-facing (describe what changed from the
user's perspective, not implementation details). Match this tone:

- Fixed a bug that caused an exception in Anki's card preview window
- Fix bug preventing user-defined AnkiCanvasOptions to be used

Output ONLY the bullets — no heading, no preamble, no sign-off.

Commits:
{commits}
"""


def run(cmd: list[str], **kw) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, cwd=ROOT, check=True, text=True, **kw)


def capture(cmd: list[str]) -> str:
    return subprocess.run(
        cmd, cwd=ROOT, check=True, text=True, capture_output=True
    ).stdout.strip()


def die(msg: str) -> None:
    print(f"error: {msg}", file=sys.stderr)
    sys.exit(1)


def latest_v0_tag() -> str | None:
    out = capture(
        ["gh", "release", "list", "--json", "tagName", "-q", ".[].tagName"]
    )
    tags = [t for t in out.splitlines() if re.fullmatch(r"v0\.\d+", t)]
    if not tags:
        return None
    tags.sort(key=lambda t: int(t.removeprefix("v0.")))
    return tags[-1]


def next_version(prev: str | None) -> str:
    if prev is None:
        return "v0.1"
    return f"v0.{int(prev.removeprefix('v0.')) + 1}"


def commits_since(prev: str | None) -> str:
    rev_range = f"{prev}..HEAD" if prev else "HEAD"
    return capture(["git", "log", rev_range, "--pretty=format:- %s (%h)"])


def summarize(commits: str) -> str:
    if shutil.which("claude") is None:
        print("warning: claude not on PATH, using raw commit list", file=sys.stderr)
        return commits
    try:
        result = subprocess.run(
            ["claude", "-p", CLAUDE_PROMPT.format(commits=commits)],
            cwd=ROOT,
            check=True,
            text=True,
            capture_output=True,
            timeout=180,
        )
        notes = result.stdout.strip()
        return notes or commits
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired) as e:
        print(f"warning: claude failed ({e}), using raw commit list", file=sys.stderr)
        return commits


def preflight(new_tag: str) -> str:
    for tool in ("gh", "git", "bun", "uv"):
        if shutil.which(tool) is None:
            die(f"{tool} not found in PATH")

    if capture(["git", "status", "--porcelain"]):
        die("working tree is dirty — commit or stash first")

    sha = capture(["git", "rev-parse", "HEAD"])

    try:
        run(
            ["git", "merge-base", "--is-ancestor", sha, "origin/master"],
            capture_output=True,
        )
    except subprocess.CalledProcessError:
        die("HEAD is not on origin/master — push first")

    existing = capture(
        [
            "gh",
            "release",
            "list",
            "--json",
            "tagName",
            "-q",
            f'.[] | select(.tagName=="{new_tag}") | .tagName',
        ]
    )
    if existing:
        die(f"release {new_tag} already exists")

    return sha


def main() -> None:
    prev = latest_v0_tag()
    new_tag = next_version(prev)
    sha = preflight(new_tag)

    commits = commits_since(prev)
    if not commits:
        die(f"no commits since {prev} — nothing to release")

    print(f"previous release: {prev or '(none)'}")
    print(f"new release:      {new_tag} -> {sha[:7]}")
    print(f"commits:\n{commits}\n")

    print("asking claude to summarize...")
    notes = summarize(commits)
    print(f"\n--- release notes ---\n{notes}\n---\n")

    print(f"building {new_tag}...")
    run(["bun", "run", "release"])
    if not DECK.exists():
        die(f"{DECK} missing after build")

    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".md", delete=False
    ) as f:
        f.write(notes)
        notes_path = f.name
    try:
        run(
            [
                "gh",
                "release",
                "create",
                new_tag,
                str(DECK),
                "--title",
                new_tag,
                "--notes-file",
                notes_path,
                "--target",
                sha,
            ]
        )
    finally:
        Path(notes_path).unlink(missing_ok=True)

    repo = capture(
        ["gh", "repo", "view", "--json", "nameWithOwner", "-q", ".nameWithOwner"]
    )
    print(f"done: https://github.com/{repo}/releases/tag/{new_tag}")


if __name__ == "__main__":
    main()
