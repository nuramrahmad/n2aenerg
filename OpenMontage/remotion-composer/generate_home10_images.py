"""
Generates the 7 realistic shots for the Home 10 concept video using NVIDIA's
NIM-hosted FLUX.1 image model.

RUN THIS ON YOUR MAC (this cloud session's network blocks NVIDIA's API
domains entirely, confirmed by a direct connectivity test), from inside the
remotion-composer/ directory:

    cd ~/n2aenerg/OpenMontage/remotion-composer
    export NVIDIA_API_KEY="<your key>"      # never paste the key in chat
    pip3 install requests
    python3 generate_home10_images.py

Compliance-sensitive by design: every prompt below avoids certification
language/marks, clearance/vent-distance numbers, regulator pressures beyond
"steps down in stages", and brand names. If a generated image accidentally
includes a logo, gauge number, or certification badge (models sometimes
hallucinate these), regenerate with a different seed or add
"no text, no numbers, no logos" more forcefully to the prompt.

NOTE ON THE API SHAPE: NVIDIA's NIM endpoints can vary slightly by model
version and change over time. If this script errors out, open the model's
page on build.nvidia.com, click "Try it" / "API", and copy the exact
invoke URL + payload shown there for your account's catalog access -- paste
that into INVOKE_URL / build_payload() below and re-run. The polling logic
for the 202/NVCF-POLL-URL pattern is included since many NIM endpoints use
it for longer-running generations.
"""
import os
import sys
import time
import base64
import pathlib

import requests

API_KEY = os.environ.get("NVIDIA_API_KEY")
if not API_KEY:
    sys.exit("Set NVIDIA_API_KEY in your environment first (export NVIDIA_API_KEY=...)")

# Adjust this if your account's catalog listing shows a different invoke URL
# for FLUX.1 (check build.nvidia.com -> black-forest-labs/flux.1-dev -> API tab).
INVOKE_URL = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev"

OUT_DIR = pathlib.Path("public/home10_images")
OUT_DIR.mkdir(parents=True, exist_ok=True)

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Accept": "application/json",
}

NEGATIVE_SUFFIX = (
    ", no text, no numbers, no gauges with readable numbers, no logos, "
    "no brand names, no certification badges or stamps, no watermark"
)

SHOTS = {
    "h_overview": {
        "prompt": (
            "Photorealistic architectural exterior photo of a modest modern "
            "West African family home in warm morning sunlight, plastered "
            "walls, a kitchen wall visible with a small plain lockable "
            "outdoor utility shelter beside it, clean composition, no "
            "people" + NEGATIVE_SUFFIX + ", natural lighting, 35mm lens "
            "look, real-estate photography style"
        ),
        "width": 1344,
        "height": 768,
    },
    "h_cylinder_shelter": {
        "prompt": (
            "Photorealistic photo of a plain unbranded upright steel gas "
            "cylinder inside a small shaded, ventilated, lockable outdoor "
            "metal shelter with louvered vents, the cylinder has a plain "
            "metal valve guard on top, firm concrete base, no people"
            + NEGATIVE_SUFFIX + ", soft daylight, professional product "
            "photography"
        ),
        "width": 1024,
        "height": 1024,
    },
    "h_agent_trolley": {
        "prompt": (
            "Photorealistic documentary photo of a delivery worker in a "
            "plain work uniform wheeling an upright gas cylinder secured "
            "on a hand trolley across a paved outdoor path toward a house, "
            "the cylinder is unbranded plain steel, daylight"
            + NEGATIVE_SUFFIX
        ),
        "width": 1024,
        "height": 1024,
    },
    "h_cylinder_composite": {
        "prompt": (
            "Photorealistic product photo of a modern lightweight "
            "composite gas cylinder with a protective plastic shroud and "
            "boot base, bluish composite material, unbranded, standing "
            "upright outdoors in a shaded shelter"
            + NEGATIVE_SUFFIX + ", soft daylight"
        ),
        "width": 1024,
        "height": 1024,
    },
    "h_regulator_closed": {
        "prompt": (
            "Photorealistic photo of a plain wall-mounted outdoor gas "
            "regulator cabinet, light grey metal, a small protective hood "
            "on top with a vent cap, louvered vents top and bottom, "
            "lockable door closed, mounted on an exterior house wall, "
            "daylight" + NEGATIVE_SUFFIX + ", professional product "
            "photography"
        ),
        "width": 1024,
        "height": 1024,
    },
    "h_regulator_open": {
        "prompt": (
            "Photorealistic photo of the inside of an open outdoor gas "
            "regulator cabinet showing generic unlabeled plumbing "
            "components: a shutoff valve, an inline filter, two small "
            "pressure-reducing regulator stages, and a solenoid shutoff "
            "valve, connected with short metal pipes" + NEGATIVE_SUFFIX
            + ", clean technical product photography, soft even lighting"
        ),
        "width": 1024,
        "height": 1024,
    },
    "h_kitchen_cooker": {
        "prompt": (
            "Photorealistic photo of a simple modern kitchen interior with "
            "a two-burner gas cooktop, blue flames burning under a pot of "
            "stew with gentle steam rising, a small plain gas detector box "
            "mounted high on the wall, warm interior lighting"
            + NEGATIVE_SUFFIX + ", professional interior photography"
        ),
        "width": 1024,
        "height": 1024,
    },
}


def build_payload(spec):
    return {
        "prompt": spec["prompt"],
        "mode": "base",
        "cfg_scale": 3.5,
        "width": spec["width"],
        "height": spec["height"],
        "seed": 0,
        "steps": 30,
    }


def extract_base64(data):
    if "image" in data:
        return data["image"]
    if "artifacts" in data and data["artifacts"]:
        return data["artifacts"][0].get("base64")
    if "data" in data and data["data"] and "b64_json" in data["data"][0]:
        return data["data"][0]["b64_json"]
    return None


def generate(name, spec):
    resp = requests.post(INVOKE_URL, headers=HEADERS, json=build_payload(spec), timeout=120)

    if resp.status_code == 202:
        poll_url = resp.headers.get("NVCF-POLL-URL") or resp.headers.get("nvcf-poll-url")
        if not poll_url:
            raise RuntimeError(f"{name}: got 202 but no poll URL in headers: {dict(resp.headers)}")
        for _ in range(60):
            time.sleep(3)
            poll = requests.get(poll_url, headers=HEADERS, timeout=60)
            if poll.status_code == 200:
                resp = poll
                break
        else:
            raise RuntimeError(f"{name}: timed out waiting on poll URL")

    resp.raise_for_status()
    data = resp.json()
    b64 = extract_base64(data)
    if not b64:
        raise RuntimeError(f"{name}: unexpected response shape, keys={list(data.keys())}")

    img_bytes = base64.b64decode(b64)
    out_path = OUT_DIR / f"{name}.png"
    out_path.write_bytes(img_bytes)
    print(f"Saved {out_path} ({len(img_bytes) / 1024:.0f} KB)")


if __name__ == "__main__":
    failures = []
    for name, spec in SHOTS.items():
        try:
            generate(name, spec)
        except Exception as e:
            print(f"FAILED {name}: {e}")
            failures.append(name)
    if failures:
        print(f"\n{len(failures)} shot(s) failed: {failures}")
        print("Check the error above against your model's actual API page on build.nvidia.com")
        sys.exit(1)
    print("\nAll 7 images generated into public/home10_images/")
