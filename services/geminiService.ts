import type { GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY;

let chatInstancePromise: Promise<any> | null = null;

const getChatInstance = async () => {
    if (!apiKey) {
        throw new Error("Gemini API key is not configured.");
    }

    if (!chatInstancePromise) {
        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey });
        chatInstancePromise = Promise.resolve(ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are Javis, a helpful AI assistant for a software developer's portfolio website. The developer's name is Consigliere. You should answer questions about his skills, projects, and experience based on the provided portfolio content. Be friendly, professional, and a little witty. Keep responses concise.",
            },
        }));
    }

    return chatInstancePromise;
};

export const streamAssistantResponse = async (message: string): Promise<AsyncGenerator<GenerateContentResponse>> => {
    if (!apiKey) {
        async function* fallback() {
            yield { text: "Gemini assistant is unavailable because the API key is not configured." } as unknown as GenerateContentResponse;
        }
        return fallback();
    }

    try {
        const chat = await getChatInstance();
        const result = await chat.sendMessageStream({ message });
        return result;
    } catch (error) {
        console.error("Gemini API error:", error);
        async function* fallback() {
            yield { text: "Sorry, I couldn't connect to the Gemini API right now." } as unknown as GenerateContentResponse;
        }
        return fallback();
    }
};
