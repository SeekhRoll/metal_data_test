"""Hindi narration with AI4Bharat Indic Parler-TTS (Apache-2.0, fine for commercial use).

Voice (brief): a warm female narrator, a gentle storyteller at a flowing pace. Several takes per line (VO_TAKES, default 3) go to assets/vo/takes/; then
    python3 scripts/pick_vo.py      # keeps the take whose Whisper transcript best matches the script
    python3 scripts/subs.py         # subtitle cards timed to the chosen takes
    python3 scripts/mix.py
Needs HF_TOKEN (the model is gated) and network access to huggingface.co and *.hf.co.
"""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DESCRIPTION = (
    "Divya speaks in a warm, bright and gentle voice, like a storyteller telling a folk tale to a family, "
    "at a moderate, flowing pace with soft, expressive intonation. The recording is very clear and close-up, "
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
    takes = int(os.environ.get("VO_TAKES", "3"))
    only = os.environ.get("VO_ONLY", "").split(",") if os.environ.get("VO_ONLY") else None
    for line in json.load(open(os.path.join(ROOT, "src/film/vo.json"), encoding="utf-8")):
        if only and line["id"] not in only:
            continue
        text = line.get("tts", line["text"]).replace("—", ",").replace("…", ",").replace("?", ",").replace('"', "")
        p = tok(text, return_tensors="pt")
        for seed in range(takes):
            out = os.path.join(out_dir, f"{line['id']}-{seed}.wav")
            if os.path.exists(out):
                continue
            torch.manual_seed(seed * 101 + 11)
            with torch.no_grad():
                audio = model.generate(input_ids=d.input_ids, attention_mask=d.attention_mask,
                                       prompt_input_ids=p.input_ids, prompt_attention_mask=p.attention_mask)
            sf.write(out, audio.cpu().numpy().squeeze(), model.config.sampling_rate)
            print("wrote", out, flush=True)


if __name__ == "__main__":
    main()
