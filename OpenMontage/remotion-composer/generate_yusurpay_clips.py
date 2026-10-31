"""
Generates the 5 live-action-style video clips for the Yusurpay "Coming Soon"
teaser via HiAPI's Seedance 2.0 model -- cinematic quality, native 9:16
support, and this project's own ai-video-gen skill already recommends
Seedance 2.0 as the top choice for cinematic/documentary-style work.

RUN ON YOUR MAC (this cloud session's network blocks api.hiapi.ai -- not
tested directly but consistent with every other video/image-gen domain
blocked so far in this session):

    cd ~/n2aenerg/OpenMontage/remotion-composer
    source .venv_imagegen/bin/activate   # or make a fresh venv
    pip install requests
    export HIAPI_API_KEY="<your key, from HiAPI's API Keys page>"
    python3 generate_yusurpay_clips.py

Hard spend cap for this pass: $25 (agreed with the project owner). Check
https://www.hiapi.ai/en/dashboard/usage after each run to track credit
spend against your balance (3,930 credits at last check). Re-run a single
scene instead of everything if one needs a redo:

    python3 generate_yusurpay_clips.py s2_cash

AUTH HEADER CAVEAT: the Seedance 2.0 docs page didn't show the exact auth
header format (that's usually on a separate "Authentication" page). This
script assumes `Authorization: Bearer <key>`, the most common convention.
If the first request 401s, check HiAPI's Authentication docs page for the
exact header name/format and adjust HEADERS below.

generate_audio is set to False deliberately -- this project composes its
own narration + background music track in Remotion, so model-generated
ambient audio in the clips themselves would just need to be muted anyway.
"""
import os
import sys
import time
import pathlib
import requests

API_KEY = os.environ.get("HIAPI_API_KEY")
if not API_KEY:
    sys.exit("Set HIAPI_API_KEY in your environment first")

BASE_URL = "https://api.hiapi.ai/v1/tasks"
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}

OUT_DIR = pathlib.Path("public/yusurpay_clips")
OUT_DIR.mkdir(parents=True, exist_ok=True)

DOC_STYLE = ", warm documentary color grade, natural light, vertical 9:16 framing"

# duration here matches each scene's actual slot length in the Remotion
# composition (150 frames = 5s, 180 frames = 6s at 30fps), so clips should
# land almost exactly on the cut points without needing the Freeze fallback.
SCENES = {
    "s1_market": {
        "prompt": (
            "Early morning at a busy grain market in Northern Nigeria. "
            "Trucks being loaded with sacks of maize. Traders in kaftans "
            "and caps. Golden sunlight, dust in the air, cinematic, "
            "handheld camera" + DOC_STYLE
        ),
        "duration": 5,
    },
    "s2_cash": {
        "prompt": (
            "Close-up of a trader's hands counting thick bundles of naira "
            "notes under pressure. He glances around nervously. Shallow "
            "depth of field" + DOC_STYLE
        ),
        "duration": 5,
    },
    "s3_road": {
        "prompt": (
            "A long, empty rural road stretching to the horizon. A lone "
            "motorcycle rider. Wide aerial drone shot, savanna landscape"
            + DOC_STYLE
        ),
        "duration": 5,
    },
    "s4_payment": {
        "prompt": (
            "A smiling farmer in a village market receives a payment on "
            "his smartphone. The screen glows green. A trader beside him "
            "nods. Warm, hopeful mood" + DOC_STYLE
        ),
        "duration": 6,
    },
    "s5_voice": {
        "prompt": (
            "An older man holds a phone close and speaks into it. The "
            "phone answers him with a soft green voice waveform on "
            "screen. Village shop in the background" + DOC_STYLE
        ),
        "duration": 5,
    },
}


def build_payload(prompt, duration):
    return {
        "model": "seedance-2.0",
        "route": "ext",  # 720p/1080p/4k tiers; standard route caps at 480p
        "input": {
            "prompt": prompt,
            "aspect_ratio": "9:16",
            "duration": duration,
            "resolution": "1080p",
            "generate_audio": False,
        },
    }


def unwrap(data):
    """HiAPI wraps responses as {"code":200,"data":{...},"message":"success"}."""
    if isinstance(data, dict) and "data" in data and isinstance(data["data"], dict):
        return data["data"]
    return data


def submit(prompt, duration):
    resp = requests.post(BASE_URL, headers=HEADERS, json=build_payload(prompt, duration), timeout=30)
    if resp.status_code >= 400:
        raise RuntimeError(f"HTTP {resp.status_code}: {resp.text[:500]}")
    body = unwrap(resp.json())
    task_id = body.get("taskId") or body.get("id") or body.get("task_id")
    if not task_id:
        raise RuntimeError(f"No task id in response: {resp.json()}")
    return task_id


def wait_for(task_id, max_wait_s=600, poll_s=10):
    url = f"{BASE_URL}/{task_id}"
    start = time.time()
    while time.time() - start < max_wait_s:
        resp = requests.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        body = unwrap(resp.json())
        status = (body.get("status") or "").lower()
        if status in ("completed", "succeeded", "success"):
            output = unwrap(body.get("output") or body)
            video_url = (
                output.get("video_url")
                or output.get("videoUrl")
                or (output.get("video") or {}).get("url")
            )
            if not video_url:
                raise RuntimeError(f"Completed but no video URL found: {body}")
            return video_url
        if status in ("failed", "error"):
            raise RuntimeError(f"Generation failed: {body}")
        time.sleep(poll_s)
    raise TimeoutError("timed out waiting for video generation")


def download(url, out_path):
    with requests.get(url, stream=True, timeout=120) as r:
        r.raise_for_status()
        with open(out_path, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)


def run_scene(name, spec):
    print(f"Submitting {name} (duration={spec['duration']}s)...")
    task_id = submit(spec["prompt"], spec["duration"])
    print(f"  task_id={task_id}, polling...")
    video_url = wait_for(task_id)
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
            print("  If this is a 401, check HiAPI's Authentication docs page for the exact")
            print("  header format and update HEADERS at the top of this file.")
            print("  If it's a 422, the field names above may not match -- compare against")
            print("  the Request Body Example on the Seedance 2.0 API Docs page.")
    print("\nDone. Check public/yusurpay_clips/ and preview each clip before rendering.")
