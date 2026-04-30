

import { GoogleGenAI, Chat } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";


// Ensure the API key is available
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let chat: Chat | null = null;

const getChatInstance = () => {
    if (!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are Javis, a helpful AI assistant for a software developer's portfolio website. The developer's name is Consigliere. You should answer questions about his skills, projects, and experience based on the provided portfolio content. Be friendly, professional, and a little witty. Keep responses concise.",
            },
        });
    }
    return chat;
};


export const streamAssistantResponse = async (message: string): Promise<AsyncGenerator<GenerateContentResponse>> => {
    try {
        const chatInstance = getChatInstance();
        const result = await chatInstance.sendMessageStream({ message });
        return result;
    } catch (error) {
        console.error("Gemini API error:", error);
        throw new Error("Failed to get response from AI assistant.");
    }
};