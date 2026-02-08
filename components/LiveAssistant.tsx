import React, { useState, useEffect, useRef } from "react";
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { motion, AnimatePresence } from "framer-motion";

const LiveAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "connecting" | "listening" | "speaking"
  >("idle");
  const [transcript, setTranscript] = useState<
    { role: "user" | "model"; text: string }[]
  >([]);
  const [volume, setVolume] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const transcriptScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transcriptScrollRef.current) {
      transcriptScrollRef.current.scrollTo({
        top: transcriptScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [transcript]);

  // PCM Decoding Utilities
  function decode(base64: string) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  function encode(bytes: Uint8Array) {
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  const startSession = async () => {
    if (isActive) return;
    setStatus("connecting");
    // Creating instance right before call with process.env.API_KEY directly
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )({ sampleRate: 24000 });
      const inputCtx = new (
        window.AudioContext || (window as any).webkitAudioContext
      )({ sampleRate: 16000 });

      const sessionPromise = ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-12-2025",
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setStatus("listening");
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);

            const analyser = inputCtx.createAnalyser();
            analyser.fftSize = 256;
            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              analyser.getByteFrequencyData(dataArray);
              setVolume(dataArray.reduce((a, b) => a + b) / dataArray.length);

              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: "audio/pcm;rate=16000",
              };
              // Using sessionPromise.then to ensure data is sent only after connection
              sessionPromise.then((s) =>
                s.sendRealtimeInput({ media: pcmBlob }),
              );
            };

            source.connect(analyser);
            analyser.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              setTranscript((prev) => [
                ...prev,
                {
                  role: "model",
                  text: message.serverContent.outputTranscription.text,
                },
              ]);
            }
            if (message.serverContent?.inputTranscription) {
              setTranscript((prev) => [
                ...prev,
                {
                  role: "user",
                  text: message.serverContent.inputTranscription.text,
                },
              ]);
            }

            // Handle model interruptions
            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              for (const source of sourcesRef.current.values()) {
                source.stop();
                sourcesRef.current.delete(source);
              }
              nextStartTimeRef.current = 0;
            }

            const audioData =
              message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && audioContextRef.current) {
              setStatus("speaking");
              nextStartTimeRef.current = Math.max(
                nextStartTimeRef.current,
                audioContextRef.current.currentTime,
              );
              const buffer = await decodeAudioData(
                decode(audioData),
                audioContextRef.current,
                24000,
                1,
              );
              const source = audioContextRef.current.createBufferSource();
              source.buffer = buffer;
              source.connect(audioContextRef.current.destination);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setStatus("listening");
              };
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }
          },
          onclose: () => stopSession(),
          onerror: (e) => {
            console.error(e);
            stopSession();
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction:
            "You are ASC Live Assistant. Help the student study. Be concise, friendly, and academic.",
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        },
      });
      sessionRef.current = sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus("idle");
    }
  };

  const stopSession = () => {
    setIsActive(false);
    setStatus("idle");
    if (sessionRef.current) {
      sessionRef.current.then((s: any) => s.close());
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-4xl w-full flex flex-col items-center gap-12 relative z-10">
        <header className="text-center space-y-2">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-400 mb-4"
          >
            <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse"></span>
            Native Audio Integration
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
            Live Studio
          </h2>
          <p className="text-zinc-500 font-medium max-w-lg mx-auto">
            Instant voice interactions. Ask anything, anytime, in real-time.
          </p>
        </header>

        <div className="relative flex items-center justify-center">
          {/* Audio Waves Visualizer */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="flex gap-2 h-64 items-center">
                  {[...Array(16)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height:
                          status === "speaking" || status === "listening"
                            ? [12, 12 + volume * (1 + Math.random() * 2), 12]
                            : 12,
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.15 + i * 0.03,
                        ease: "easeInOut",
                      }}
                      className="w-2 md:w-4 bg-brand-500 rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Control Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isActive ? stopSession : startSession}
            className={`w-40 h-40 md:w-56 md:h-56 rounded-[3.5rem] flex flex-col items-center justify-center gap-4 transition-all relative z-10 shadow-2xl border-4 ${
              isActive
                ? "bg-red-500/10 border-red-500/50 text-red-500"
                : "bg-brand-600 border-brand-800 text-white shadow-brand-600/20"
            }`}
          >
            <div className="absolute inset-0 bg-white/5 rounded-[3.5rem]"></div>
            <i
              className={`fas ${isActive ? "fa-square" : "fa-microphone"} text-3xl md:text-5xl`}
            ></i>
            <span className="font-black text-xs md:text-sm uppercase tracking-[0.2em]">
              {status === "connecting"
                ? "SYNCING..."
                : isActive
                  ? "STOP"
                  : "CONNECT"}
            </span>
            {isActive && (
              <motion.div
                layoutId="status-dot"
                className="absolute -top-4 px-4 py-1.5 bg-red-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg"
              >
                {status}
              </motion.div>
            )}
          </motion.button>
        </div>

        {/* Live Transcript Area */}
        <div className="w-full max-w-2xl bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col h-[320px]">
          <div className="p-4 border-b border-zinc-800/50 flex justify-between items-center bg-zinc-900/50">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              Live Transcript
            </span>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
              <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
              <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
            </div>
          </div>
          <div
            ref={transcriptScrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 hide-scrollbar"
          >
            {transcript.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-700 space-y-3">
                <i className="fas fa-comment-slash text-2xl"></i>
                <p className="text-sm font-medium">
                  Session logs will appear here...
                </p>
              </div>
            ) : (
              transcript.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: t.role === "user" ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${t.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs font-medium leading-relaxed ${
                      t.role === "user"
                        ? "bg-brand-500/10 text-brand-400 border border-brand-500/20"
                        : "bg-zinc-800/80 text-zinc-300"
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 block mb-1">
                      {t.role === "user" ? "You" : "Assistant"}
                    </span>
                    {t.text}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveAssistant;
