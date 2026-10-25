"""
Lists Azure Speech voices filtered to Hausa, so you can confirm the exact
voice name before running generate_home10_hausa_audio.py (Azure's catalog
changes over time, and this cloud session can't reach Azure's domain to
check for you -- confirmed blocked by a direct connectivity test).

RUN ON YOUR MAC:
    export AZURE_SPEECH_KEY="<your key>"
    export AZURE_SPEECH_REGION="<your resource region, e.g. eastus>"
    python3 list_azure_hausa_voices.py
"""
import os
import sys
import requests

KEY = os.environ.get("AZURE_SPEECH_KEY")
REGION = os.environ.get("AZURE_SPEECH_REGION")
if not KEY or not REGION:
    sys.exit("Set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION in your environment first")

url = f"https://{REGION}.tts.speech.microsoft.com/cognitiveservices/voices/list"
resp = requests.get(url, headers={"Ocp-Apim-Subscription-Key": KEY}, timeout=30)
resp.raise_for_status()
voices = resp.json()

hausa = [v for v in voices if v.get("Locale", "").lower().startswith("ha-")]
if not hausa:
    print("No Hausa (ha-*) voices found in this region's catalog.")
    print("Try a different AZURE_SPEECH_REGION, or check the Azure Speech docs")
    print("for which regions currently serve ha-NG voices.")
else:
    for v in hausa:
        print(f"{v['ShortName']}  ({v['Gender']}, {v['Locale']})")
