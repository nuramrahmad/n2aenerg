"""
Generates the 5 live-action-style video clips for the Yusurpay "Coming Soon"
teaser via fal.ai (Kling / MiniMax / VEO all available through one queue
API, FAL_KEY already configured in this project's .env).

RUN ON YOUR MAC (this cloud session's network blocks fal.run/queue.fal.run,
confirmed by a direct connectivity test):

    cd ~/n2aenerg/OpenMontage/remotion-composer
    source .venv_imagegen/bin/activate   # or make a fresh venv
    pip install requests
    export FAL_KEY="<your key, same one already in OpenMontage/.env>"
    python3 generate_yusurpay_clips.py

Hard spend cap for this pass: $25 (agreed with the project owner). Re-run
a single scene instead of everything if one needs a redo:

    python3 generate_yusurpay_clips.py s2_cash

MODEL ID CAVEAT: fal.ai renames/versions its model slugs over time, and I
could not verify this against their live API from this cloud session
(network blocked). The default below (fal-ai/kling-video/v1.6/standard/
text-to-video) is my best guess based on their documented naming pattern,
NOT a confirmed-working endpoint. Before running the full batch:

    1. Go to fal.ai/models, search "kling" (or "minimax" / "veo"),
       open a text-to-video model's page, click the API/"Run" tab.
    2. Copy the exact model id shown there (the path after fal.ai/models/).
    3. If it differs from MODEL_ID below, export FAL_MODEL_ID="<that id>"
       before running, or edit MODEL_ID directly.
    4. The page also shows the exact input schema (field names for prompt,
       aspect ratio, duration) -- if the request below 422s on an unknown
       field, adjust build_payload() to match what that page shows.
"""
import os
import sys
import time
import pathlib
import requests

API_KEY = os.environ.get("FAL_KEY")
if not API_KEY:
    sys.exit("Set FAL_KEY in your environment first (same key as OpenMontage/.env)")

MODEL_ID = os.environ.get("FAL_MODEL_ID", "fal-ai/kling-video/v1.6/standard/text-to-video")

SUBMIT_URL = f"https://queue.fal.run/{MODEL_ID}"
HEADERS = {"Authorization": f"Key {API_KEY}", "Content-Type": "application/json"}

OUT_DIR = pathlib.Path("public/yusurpay_clips")
OUT_DIR.mkdir(parents=True, exist_ok=True)

DOC_STYLE = ", warm documentary color grade, natural light, vertical 9:16 framing"

SCENES = {
    "s1_market": (
        "Early morning at a busy grain market in Northern Nigeria. "
        "Trucks being loaded with sacks of maize. Traders in kaftans "
        "and caps. Golden sunlight, dust in the air, cinematic, "
        "handheld camera" + DOC_STYLE
    ),
    "s2_cash": (
        "Close-up of a trader's hands counting thick bundles of naira "
        "notes under pressure. He glances around nervously. Shallow "
        "depth of field" + DOC_STYLE
    ),
    "s3_road": (
        "A long, empty rural road stretching to the horizon. A lone "
        "motorcycle rider. Wide aerial drone shot, savanna landscape"
        + DOC_STYLE
    ),
    "s4_payment": (
        "A smiling farmer in a village market receives a payment on "
        "his smartphone. The screen glows green. A trader beside him "
        "nods. Warm, hopeful mood" + DOC_STYLE
    ),
    "s5_voice": (
        "An older man holds a phone close and speaks into it. The "
        "phone answers him with a soft green voice waveform on "
        "screen. Village shop in the background" + DOC_STYLE
    ),
}


def build_payload(prompt):
    return {
        "prompt": prompt,
        "aspect_ratio": "9:16",
        "duration": "5",
    }


def submit(prompt):
    resp = requests.post(SUBMIT_URL, headers=HEADERS, json=build_payload(prompt), timeout=30)
    if resp.status_code >= 400:
        raise RuntimeError(f"HTTP {resp.status_code}: {resp.text[:500]}")
    data = resp.json()
    return data["status_url"], data["response_url"]


def wait_for(status_url, response_url, max_wait_s=300, poll_s=8):
    start = time.time()
    while time.time() - start < max_wait_s:
        resp = requests.get(status_url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        status = resp.json().get("status")
        if status == "COMPLETED":
            result = requests.get(response_url, headers=HEADERS, timeout=30)
            result.raise_for_status()
            data = result.json()
            video = data.get("video") or (data.get("videos") or [{}])[0]
            url = video.get("url")
            if not url:
                raise RuntimeError(f"Completed but no video URL found, keys={list(data.keys())}")
            return url
        if status in ("ERROR", "FAILED"):
            raise RuntimeError(f"Generation failed: {resp.text[:500]}")
        time.sleep(poll_s)
    raise TimeoutError("timed out waiting for video generation")


def download(url, out_path):
    with requests.get(url, stream=True, timeout=120) as r:
        r.raise_for_status()
        with open(out_path, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)


def run_scene(name, prompt):
    print(f"Submitting {name} (model={MODEL_ID})...")
    status_url, response_url = submit(prompt)
    print(f"  queued, polling {status_url} ...")
    video_url = wait_for(status_url, response_url)
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
            print("  If this is a 404/422, the model id or payload schema is wrong --")
            print("  check fal.ai/models for the exact id and input fields (see the")
            print("  MODEL ID CAVEAT comment at the top of this file).")
    print("\nDone. Check public/yusurpay_clips/ and preview each clip before rendering.")
