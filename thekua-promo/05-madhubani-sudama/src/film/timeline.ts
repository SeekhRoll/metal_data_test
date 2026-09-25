// 60 s at 24 fps (brief §1). Scene windows follow the brief's treatment; subtitle cues are the VO script.
// When the recorded/generated VO arrives, cue times are re-fitted to the audio (scripts/fit_vo.py).
export const FPS = 24;
export const W = 1080, H = 1920;
export const sec = (s: number) => Math.round(s * FPS);

export const SCENES = {
  title:   { from: 0,  to: 5 },
  hut:     { from: 5,  to: 13 },
  journey: { from: 13, to: 21 },
  embrace: { from: 21, to: 29 },
  potli:   { from: 29, to: 39 },
  ret:     { from: 39, to: 46 },
  moral:   { from: 46, to: 52 },
  endcard: { from: 52, to: 60 },
} as const;

export type Cue = { from: number; to: number; text: string };
export const CUES: Cue[] = [
  { from: 0.8, to: 4.6, text: 'बहुत पुराने समय की बात है…' },
  { from: 5.3, to: 8.3, text: 'सुदामा, श्रीकृष्ण के बचपन के मित्र थे… पर बहुत गरीब।' },
  { from: 8.4, to: 10.4, text: 'पत्नी ने कहा, मित्र से मिल आइए।' },
  { from: 10.5, to: 12.9, text: 'खाली हाथ कैसे जाते? पड़ोस से माँगकर, एक पोटली चिवड़ा बाँध दिया।' },
  { from: 14.0, to: 20.6, text: 'नंगे पाँव, मीलों चलकर… सुदामा पहुँचे द्वारका।' },
  { from: 22.0, to: 28.6, text: 'नाम सुनते ही, द्वारकाधीश खुद दौड़ते हुए आए।' },
  { from: 29.4, to: 33.0, text: 'सुदामा पोटली छुपाते रहे… राजा को चिवड़ा कैसे दें?' },
  { from: 33.1, to: 38.7, text: 'पर कृष्ण ने पोटली खींच ली, और मुट्ठी भर चिवड़ा ऐसे खाया, जैसे छप्पन भोग हो।' },
  { from: 39.5, to: 45.6, text: 'सुदामा ने कुछ माँगा नहीं… पर लौटे, तो कुटिया महल बन चुकी थी।' },
  { from: 49.2, to: 51.8, text: 'क्योंकि भगवान दाम नहीं देखते… भाव देखते हैं।' },
  { from: 52.4, to: 55.6, text: 'प्रेम से बनी हर चीज़ में, यही भाव होता है।' },
  { from: 55.7, to: 59.6, text: 'श्री देसी ठेकुआ — घर का बना, प्रेम से बना। अब आपकी द्वारका तक।' },
];
