import { useEffect, useRef, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: (e: any) => void;
  onend: () => void;
  onerror: (e: any) => void;
  start: () => void;
  stop: () => void;
};

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

/**
 * Thin wrapper over the Web Speech API. Falls back gracefully:
 * when the browser has no speech recognition, `supported` is false and the
 * UI simulates a dictation instead so the demo never dead-ends.
 */
export function useVoiceInput(onFinal: (text: string) => void) {
  const [supported] = useState(() => getRecognitionCtor() !== null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recogRef = useRef<SpeechRecognitionLike | null>(null);
  const onFinalRef = useRef(onFinal);
  onFinalRef.current = onFinal;

  useEffect(() => {
    return () => {
      try {
        recogRef.current?.stop();
      } catch {
        /* noop */
      }
    };
  }, []);

  const start = () => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      // Simulated dictation fallback
      setListening(true);
      const phrase = "rainy evening, something calm";
      let i = 0;
      const timer = window.setInterval(() => {
        i += 1;
        setTranscript(phrase.slice(0, Math.round((phrase.length * i) / 8)));
        if (i >= 8) {
          window.clearInterval(timer);
          setListening(false);
          onFinalRef.current(phrase);
          setTranscript("");
        }
      }, 180);
      return;
    }

    const recog = new Ctor();
    recog.lang = "en-IN";
    recog.interimResults = true;
    recog.continuous = false;
    recog.onresult = (e: any) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      setTranscript(text);
      if (e.results[e.results.length - 1].isFinal) {
        onFinalRef.current(text.trim());
      }
    };
    recog.onend = () => {
      setListening(false);
      setTranscript("");
    };
    recog.onerror = () => {
      setListening(false);
      setTranscript("");
    };
    recogRef.current = recog;
    setListening(true);
    recog.start();
  };

  const stop = () => {
    try {
      recogRef.current?.stop();
    } catch {
      /* noop */
    }
    setListening(false);
  };

  return { supported, listening, transcript, start, stop };
}
