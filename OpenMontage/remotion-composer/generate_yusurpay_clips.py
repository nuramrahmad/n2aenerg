"""
Generates the 5 live-action-style video clips for the Yusurpay "Coming Soon"
teaser via OpenMontage's HeyGen gateway (which proxies VEO, Kling, Sora,
Runway, Seedance under one API).

RUN ON YOUR MAC (this cloud session's network blocks api.heygen.com,
confirmed by a direct connectivity test):

    cd ~/n2aenerg/OpenMontage/remotion-composer
    source .venv_imagegen/bin/activate   # or make a fresh venv
    pip install requests
    export HEYGEN_API_KEY="<your key>"
    python3 generate_yusurpay_clips.py

Hard spend cap for this pass: $25 (agreed with the project owner). This
script generates each scene ONCE per run -- if a clip has artifacts (hands/
fingers are the likely failure point on scene 2, the cash-counting close-up),
re-run just that one scene by passing its name as an argument, e.g.:

    python3 generate_yusurpay_clips.py s2_cash

rather than re-running everything and spending twice. Each scene lists an
ALT_PROVIDER as a fallback (Kling or Runway instead of VEO) to try if the
default provider's result isn't usable.
"""
import os
import sys
import time
import pathlib
import requests

API_KEY = os.environ.get("HEYGEN_API_KEY")
if not API_KEY:
    sys.exit("Set HEYGEN_API_KEY in your environment first")

BASE = "https://api.heygen.com/v1/workflows/executions"
HEADERS = {"X-Api-Key": API_KEY, "Content-Type": "application/json"}

OUT_DIR = pathlib.Path("public/yusurpay_clips")
OUT_DIR.mkdir(parents=True, exist_ok=True)

DOC_STYLE = ", warm documentary color grade, natural light, vertical 9:16 framing"

SCENES = {
    "s1_market": {
        "prompt": (
            "Early morning at a busy grain market in Northern Nigeria. "
            "Trucks being loaded with sacks of maize. Traders in kaftans "
            "and caps. Golden sunlight, dust in the air, cinematic, "
            "handheld camera" + DOC_STYLE
        ),
        "provider": "veo_3_1",
        "alt_provider": "kling_pro",
    },
    "s2_cash": {
        "prompt": (
            "Close-up of a trader's hands counting thick bundles of naira "
            "notes under pressure. He glances around nervously. Shallow "
            "depth of field" + DOC_STYLE
        ),
        "provider": "veo_3_1",
        "alt_provider": "runway_gen4",  # hands are a common AI-video failure point
    },
    "s3_road": {
        "prompt": (
            "A long, empty rural road stretching to the horizon. A lone "
            "motorcycle rider. Wide aerial drone shot, savanna landscape"
            + DOC_STYLE
        ),
        "provider": "veo_3_1",
        "alt_provider": "kling_pro",
    },
    "s4_payment": {
        "prompt": (
            "A smiling farmer in a village market receives a payment on "
            "his smartphone. The screen glows green. A trader beside him "
            "nods. Warm, hopeful mood" + DOC_STYLE
        ),
        "provider": "veo_3_1",
        "alt_provider": "kling_pro",
    },
    "s5_voice": {
        "prompt": (
            "An older man holds a phone close and speaks into it. The "
            "phone answers him with a soft green voice waveform on "
            "screen. Village shop in the background" + DOC_STYLE
        ),
        "provider": "veo_3_1",
        "alt_provider": "runway_gen4",
    },
}


def submit(prompt, provider):
    payload = {
        "workflow_type": "GenerateVideoNode",
        "input": {
            "prompt": prompt,
            "provider": provider,
            "aspect_ratio": "9:16",
        },
    }
    resp = requests.post(BASE, headers=HEADERS, json=payload, timeout=30)
    resp.raise_for_status()
    return resp.json()["data"]["execution_id"]


def wait_for(execution_id, max_wait_s=300, poll_s=10):
    start = time.time()
    while time.time() - start < max_wait_s:
        resp = requests.get(f"{BASE}/{execution_id}", headers=HEADERS, timeout=30)
        resp.raise_for_status()
        data = resp.json()["data"]
        status = data.get("status")
        if status == "completed":
            return data["output"]["video"]["video_url"]
        if status == "failed":
            raise RuntimeError(data.get("error", {}).get("message", "generation failed"))
        time.sleep(poll_s)
    raise TimeoutError("timed out waiting for video generation")


def download(url, out_path):
    with requests.get(url, stream=True, timeout=120) as r:
        r.raise_for_status()
        with open(out_path, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)


def run_scene(name, spec):
    print(f"Submitting {name} ({spec['provider']})...")
    execution_id = submit(spec["prompt"], spec["provider"])
    print(f"  execution_id={execution_id}, polling...")
    video_url = wait_for(execution_id)
    out_path = OUT_DIR / f"{name}.mp4"
    download(video_url, out_path)
    print(f"  Saved {out_path}")


if __name__ == "__main__":
    targets = sys.argv[1:] or list(SCENES.keys())
    for name in targets:
        if name not in SCENES:
            print(f"Unknown scene '{name}', skipping. Valid: {list(SCENES.keys())}")
            continue
        try:
            run_scene(name, SCENES[name])
        except Exception as e:
            print(f"FAILED {name}: {e}")
            print(f"  Try the fallback provider: edit SCENES['{name}']['provider'] "
                  f"to '{SCENES[name]['alt_provider']}' and re-run just this scene.")
    print("\nDone. Check public/yusurpay_clips/ and preview each clip before rendering.")
