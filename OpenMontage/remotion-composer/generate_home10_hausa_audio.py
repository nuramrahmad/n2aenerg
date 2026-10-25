"""
Generates the 5 Hausa narration clips for the Home 10 video using Azure AI
Speech's REST TTS endpoint.

RUN ON YOUR MAC (this cloud session's network blocks Azure's TTS domain,
confirmed by a direct connectivity test):

    cd ~/n2aenerg/OpenMontage/remotion-composer
    export AZURE_SPEECH_KEY="<your key>"
    export AZURE_SPEECH_REGION="<your resource region, e.g. eastus>"
    # optional: override the voice if list_azure_hausa_voices.py found a
    # different exact name for your region's catalog
    # export AZURE_TTS_VOICE="ha-NG-AminaNeural"
    pip3 install requests   # inside your venv if you made one earlier
    python3 generate_home10_hausa_audio.py

Run list_azure_hausa_voices.py first to confirm the exact voice name --
Azure's catalog can change, and this script's default (ha-NG-AminaNeural) is
a best guess based on Azure's documented Nigerian-language expansion, not
something I could verify live from this session.
"""
import os
import sys
import pathlib
import requests

KEY = os.environ.get("AZURE_SPEECH_KEY")
REGION = os.environ.get("AZURE_SPEECH_REGION")
VOICE = os.environ.get("AZURE_TTS_VOICE", "ha-NG-AminaNeural")

if not KEY or not REGION:
    sys.exit("Set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION in your environment first")

OUT_DIR = pathlib.Path("public/home10_audio_ha")
OUT_DIR.mkdir(parents=True, exist_ok=True)

ENDPOINT = f"https://{REGION}.tts.speech.microsoft.com/cognitiveservices/v1"
HEADERS = {
    "Ocp-Apim-Subscription-Key": KEY,
    "Content-Type": "application/ssml+xml",
    "X-Microsoft-OutputFormat": "riff-44100hz-16bit-mono-pcm",
    "User-Agent": "openmontage-home10",
}

# Final Hausa script, incorporating the owner's corrections to lines 1, 3, 5.
LINES = {
    "h1_overview": "Girki da iskar Gas na CNG a gida",
    "h2_cylinder": (
        "Silinda mai lita 45 na ɗauke da iskar gas a matsin bar 200, "
        "a wajen gida, cikin rumfa mai inuwa da iska."
    ),
    "h3_regulator": "Na'urar dai-daita karfin gas bango",
    "h4_kitchen": (
        "A ciki, akwai murhun gas mai wuta biyu, kilowatt 2 da kilowatt 3, "
        "tare da na'urar kariya da za ta kashe iskar gas idan wuta ta mutu."
    ),
    "h5_close": "Home 10. Shirin yana chikin binchike",
}


def ssml_for(text):
    return (
        "<speak version='1.0' xml:lang='ha-NG'>"
        f"<voice name='{VOICE}'>{text}</voice>"
        "</speak>"
    )


def generate(name, text):
    resp = requests.post(ENDPOINT, headers=HEADERS, data=ssml_for(text).encode("utf-8"), timeout=60)
    if resp.status_code != 200:
        raise RuntimeError(f"{name}: HTTP {resp.status_code}: {resp.text[:300]}")
    out_path = OUT_DIR / f"{name}.wav"
    out_path.write_bytes(resp.content)
    print(f"Saved {out_path} ({len(resp.content) / 1024:.0f} KB)")


if __name__ == "__main__":
    failures = []
    for name, text in LINES.items():
        try:
            generate(name, text)
        except Exception as e:
            print(f"FAILED {name}: {e}")
            failures.append(name)
    if failures:
        print(f"\n{len(failures)} clip(s) failed: {failures}")
        print("If the error mentions the voice name, run list_azure_hausa_voices.py")
        print("to find the exact ha-* voice available in your region, then set")
        print("AZURE_TTS_VOICE to that name and re-run.")
        sys.exit(1)
    print("\nAll 5 Hausa narration clips generated into public/home10_audio_ha/")
