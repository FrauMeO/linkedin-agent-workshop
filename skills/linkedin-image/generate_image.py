#!/usr/bin/env python3
"""Generate a LinkedIn post image via an image-generation API.

Provider is chosen by the IMAGE_PROVIDER env var ("openai" or "gemini",
default "openai"). API keys are read from env vars only — never hardcode
a key in this file or pass one on the command line.

Usage:
    python3 generate_image.py "<full image prompt>" --output posts/003-foo/images/post-image.png [--size 1024x1280]
"""

import argparse
import base64
import json
import os
import sys
import urllib.error
import urllib.request


def load_dotenv(path: str) -> None:
    if not os.path.exists(path):
        return
    with open(path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            os.environ.setdefault(key.strip(), value.strip())


load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))


def generate_openai(prompt: str, size: str) -> bytes:
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        sys.exit(
            "Missing OPENAI_API_KEY. Set it in your shell environment "
            "(e.g. `export OPENAI_API_KEY=sk-...`) or a .env file, then re-run.\n"
            "This is a placeholder until the key is added — no image was generated."
        )

    payload = {
        "model": "gpt-image-1",
        "prompt": prompt,
        "size": size,
        "n": 1,
    }
    req = urllib.request.Request(
        "https://api.openai.com/v1/images/generations",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req) as resp:
            body = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        sys.exit(f"OpenAI API error {e.code}: {e.read().decode('utf-8')}")
    return base64.b64decode(body["data"][0]["b64_json"])


def generate_gemini(prompt: str, size: str) -> bytes:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        sys.exit(
            "Missing GEMINI_API_KEY. Set it in your shell environment "
            "(e.g. `export GEMINI_API_KEY=...`) or a .env file, then re-run.\n"
            "This is a placeholder until the key is added — no image was generated."
        )

    model = "gemini-2.5-flash-image"
    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{model}:generateContent?key={api_key}"
    )
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req) as resp:
            body = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        sys.exit(f"Gemini API error {e.code}: {e.read().decode('utf-8')}")
    parts = body["candidates"][0]["content"]["parts"]
    image_part = next(p for p in parts if "inlineData" in p)
    return base64.b64decode(image_part["inlineData"]["data"])


PROVIDERS = {
    "openai": generate_openai,
    "gemini": generate_gemini,
}


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate a LinkedIn post image.")
    parser.add_argument("prompt", help="Full, final image generation prompt")
    parser.add_argument("--output", required=True, help="Output image file path")
    parser.add_argument(
        "--size",
        default="1024x1536",
        help="Image size. OpenAI gpt-image-1 supports: 1024x1024, 1024x1536, 1536x1024, auto.",
    )
    args = parser.parse_args()

    provider = os.environ.get("IMAGE_PROVIDER", "openai").lower()
    if provider not in PROVIDERS:
        sys.exit(f"Unknown IMAGE_PROVIDER '{provider}'. Use 'openai' or 'gemini'.")

    image_bytes = PROVIDERS[provider](args.prompt, args.size)

    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    with open(args.output, "wb") as f:
        f.write(image_bytes)

    print(f"Saved image to {args.output} (provider: {provider})")


if __name__ == "__main__":
    main()
