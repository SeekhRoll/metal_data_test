"""Hindi narration with AI4Bharat Indic Parler-TTS (Apache-2.0).

Voice (brief §4 + client): Ramkhelawan himself, a male village storyteller in his 40s-50s from the eastern UP
belt: warm, amused and animated, enjoying his own cleverness. Lines are written in the dehati register and "शेर" is
voiced as "सेर" (client). The catchphrase gets extra takes; one is chosen and reused every time. One take per line in src/film/vo.json -> assets/vo/<id>.wav.
Several seeds are generated per line (VO_TAKES, default 3); scripts/pick_vo.py keeps the cleanest take.
"""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DESCRIPTION = (
    "Rohit speaks in a warm, amused and animated voice, like a jovial middle-aged village storyteller, "
    "at a lively, conversational pace with very expressive, playful intonation. The recording is very clear and close-up, "
    "with no background noise."
)


def main():
    import soundfile as sf
    import torch
    from parler_tts import ParlerTTSForConditionalGeneration
    from transformers import AutoTokenizer

    name = "ai4bharat/indic-parler-tts"
    model = ParlerTTSForConditionalGeneration.from_pretrained(name).eval()
    tok, desc_tok = AutoTokenizer.from_pretrained(name), AutoTokenizer.from_pretrained(model.config.text_encoder._name_or_path)
    d = desc_tok(DESCRIPTION, return_tensors="pt")
    out_dir = os.path.join(ROOT, "assets/vo/takes")
    os.makedirs(out_dir, exist_ok=True)
    takes_default = int(os.environ.get("VO_TAKES", "3"))
    only = os.environ.get("VO_ONLY", "").split(",") if os.environ.get("VO_ONLY") else None
    for line in json.load(open(os.path.join(ROOT, "src/film/vo.json"), encoding="utf-8")):
        if only and line["id"] not in only:
            continue
        text = line.get("tts", line["text"]).replace("—", ",").replace("…", ",").replace('"', "")
        p = tok(text, return_tensors="pt")
        takes = line.get("takes", takes_default)
        for seed in range(takes):
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
    main()
