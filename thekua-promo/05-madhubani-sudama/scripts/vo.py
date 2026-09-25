"""Hindi narration with AI4Bharat Indic Parler-TTS (Apache-2.0, fine for commercial use).

Voice: a woman's voice, soothing, comforting and erudite (per the client), dadi-style storyteller.
Needs network access to huggingface.co for the first run (the model is ~2 GB) and:
    pip install parler-tts transformers torch soundfile
Then:
    python3 scripts/vo.py          # writes assets/vo/cue-NN.wav, one per subtitle cue
    python3 scripts/mix.py         # places, ducks and muxes
"""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DESCRIPTION = (
    "Divya speaks in a calm, warm, soothing and cultured voice, like a gentle grandmother telling a story, "
    "at a slow and unhurried pace with soft, expressive intonation. The recording is very clear and close-up, "
    "with no background noise."
)


def cues():
    src = open(os.path.join(ROOT, "src/film/timeline.ts"), encoding="utf-8").read()
    return [t for _, _, t in re.findall(r"\{ from: ([\d.]+), to: ([\d.]+), text: '([^']+)' \}", src)]


def main():
    import soundfile as sf
    import torch
    from parler_tts import ParlerTTSForConditionalGeneration
    from transformers import AutoTokenizer

    torch.manual_seed(7)
    name = "ai4bharat/indic-parler-tts"
    model = ParlerTTSForConditionalGeneration.from_pretrained(name).eval()
    tok, desc_tok = AutoTokenizer.from_pretrained(name), AutoTokenizer.from_pretrained(model.config.text_encoder._name_or_path)
    d = desc_tok(DESCRIPTION, return_tensors="pt")
    os.makedirs(os.path.join(ROOT, "assets/vo"), exist_ok=True)
    for i, text in enumerate(cues()):
        text = text.replace("—", ",").replace("…", ",")
        p = tok(text, return_tensors="pt")
        with torch.no_grad():
            audio = model.generate(input_ids=d.input_ids, attention_mask=d.attention_mask,
                                   prompt_input_ids=p.input_ids, prompt_attention_mask=p.attention_mask)
        out = os.path.join(ROOT, f"assets/vo/cue-{i:02d}.wav")
        sf.write(out, audio.cpu().numpy().squeeze(), model.config.sampling_rate)
        print("wrote", out)


if __name__ == "__main__":
    main()
