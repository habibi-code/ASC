
import { GoogleGenAI, Type } from "@google/genai";
import { MODEL_TEXT, SYSTEM_INSTRUCTIONS } from "../constants";
import { QuizQuestion, FileData } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStudyNotes = async (file: FileData, prompt: string = "Analyze this lecture material and create comprehensive study notes.") => {
  const ai = getAI();
  
  // Handle mimeType mapping for Gemini stability
  let mimeType = file.mimeType;
  if (file.name.endsWith('.docx')) mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if (file.name.endsWith('.doc')) mimeType = 'application/msword';
  if (file.name.endsWith('.txt')) mimeType = 'text/plain';

  const part = {
    inlineData: {
      data: file.base64,
      mimeType: mimeType,
    },
  };

  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: { parts: [part, { text: prompt }] },
    config: {
      systemInstruction: SYSTEM_INSTRUCTIONS.NOTES,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          notes: { type: Type.STRING },
          keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["notes", "keyConcepts"]
      }
    },
  });

  try {
    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse notes JSON", e);
    // Fallback if the AI returns plain text instead of structured JSON due to format issues
    return { 
      notes: response.text || "Failed to generate notes. Please check the file content.", 
      keyConcepts: ["Document Analysis"] 
    };
  }
};

export const enhanceNoteContent = async (content: string, mode: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: `Please enhance the following study notes using mode "${mode}":\n\n${content}`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTIONS.ENHANCE(mode),
    },
  });

  return response.text || content;
};

export const generateQuiz = async (notes: string, count: number = 5): Promise<QuizQuestion[]> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: MODEL_TEXT,
    contents: `Based on these notes, generate a quiz with ${count} questions: ${notes}`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTIONS.QUIZ(count),
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
          },
          required: ["id", "question", "options", "correctAnswer", "explanation"],
        },
      },
    },
  });

  try {
    const text = response.text;
    return text ? JSON.parse(text) : [];
  } catch (e) {
    console.error("Failed to parse quiz JSON", e);
    return [];
  }
};

export const chatWithAI = async (history: { role: 'user' | 'model', parts: { text: string }[] }[], message: string, contextNotes: string) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: MODEL_TEXT,
    history: history,
    config: {
      systemInstruction: `${SYSTEM_INSTRUCTIONS.ASSISTANT}\n\nContext Notes:\n${contextNotes}`,
    },
  });

  const response = await chat.sendMessage({ message });
  return response.text || "I'm sorry, I couldn't process that.";
};
