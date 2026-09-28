"""Hindi narration with AI4Bharat Indic Parler-TTS (Apache-2.0), several seeded takes per line.

Usage: python3 scripts/vo.py vo/pitru-ep1.json [vo/pitru-ep2.json ...]  -> assets/vo/takes/<id>-<seed>.wav
Voice per series (brief): Pitru Paksha = one calm, reverent storyteller for the whole trilogy, slow, with pauses.
A line may override the voice with "voice": "<key>" (see VOICES).
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICES = {
    "pitru": ("Rohit speaks in a calm, deep and reverent voice, like a devotional storyteller at a temple, "
              "at a slow, unhurried pace with gentle, measured intonation and soft pauses. "
              "The recording is very clear and close-up, with no background noise."),
}


def main(files):
    import soundfile as sf
    import torch
    from parler_tts import ParlerTTSForConditionalGeneration
    from transformers import AutoTokenizer

    torch.set_num_threads(4)
    name = "ai4bharat/indic-parler-tts"
    model = ParlerTTSForConditionalGeneration.from_pretrained(name).eval()
    tok, desc_tok = AutoTokenizer.from_pretrained(name), AutoTokenizer.from_pretrained(model.config.text_encoder._name_or_path)
    out_dir = os.path.join(ROOT, "assets/vo/takes")
    os.makedirs(out_dir, exist_ok=True)
    takes_default = int(os.environ.get("VO_TAKES", "3"))
    for f in files:
        voice = os.environ.get("VO_VOICE", "pitru")
        for line in json.load(open(f, encoding="utf-8")):
            d = desc_tok(VOICES[line.get("voice", voice)], return_tensors="pt")
            text = line.get("tts", line["text"]).replace("—", ",").replace("…", ",").replace('"', "")
            p = tok(text, return_tensors="pt")
            for seed in range(line.get("takes", takes_default)):
                out = os.path.join(out_dir, f"{line['id']}-{seed}.wav")
                if os.path.exists(out):
                    continue
                torch.manual_seed(seed * 101 + 7)
                with torch.no_grad():
                    audio = model.generate(input_ids=d.input_ids, attention_mask=d.attention_mask,
                                           prompt_input_ids=p.input_ids, prompt_attention_mask=p.attention_mask)
                sf.write(out, audio.cpu().numpy().squeeze(), model.config.sampling_rate)
                print("wrote", out, flush=True)


if __name__ == "__main__":
    main(sys.argv[1:])
