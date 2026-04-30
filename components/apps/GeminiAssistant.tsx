

import React, { useState, useRef, useEffect } from 'react';
import { ICONS } from '../../constants';
import type { GenerateContentResponse } from '@google/genai';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const GeminiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hello! I'm Javis, Consigliere's AI assistant. Feel free to ask me anything about his projects, skills, or experience!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        setMessages(prev => [...prev, { role: 'model', content: '' }]);
        const module = await import('../../services/geminiService');
        const stream = await module.streamAssistantResponse(input);
        for await (const chunk of stream) {
            const chunkText = chunk.text;
            setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage.role === 'model') {
                    return [...prev.slice(0, -1), { role: 'model', content: lastMessage.content + chunkText }];
                }
                return prev;
            });
        }
    } catch (error) {
        console.error(error);
        setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            // If there was an empty message bubble, replace it with the error. Otherwise, add a new one.
            if (lastMessage.role === 'model' && lastMessage.content === '') {
                 return [...prev.slice(0, -1), { role: 'model', content: "Sorry, I'm having trouble connecting right now." }];
            }
            return [...prev, { role: 'model', content: "Sorry, I'm having trouble connecting right now." }];
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-800 text-gray-200">
        <header className="flex-shrink-0 flex items-center gap-3 p-3 border-b border-gray-700/50 bg-gray-900/30">
            <div className="w-10 h-10 p-1.5 bg-blue-500 rounded-full text-white">{ICONS.JAVIS_AVATAR}</div>
            <div>
                <h3 className="font-bold">Javis</h3>
                <p className="text-xs text-green-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Online
                </p>
            </div>
        </header>

      <div className="flex-grow min-h-0 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
            msg.content ? (
                <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {msg.role === 'model' && (
                        <div className="w-8 h-8 rounded-full bg-gray-700 p-1.5 flex-shrink-0 text-blue-400">{ICONS.JAVIS_AVATAR}</div>
                    )}
                    <div className={`max-w-xs md:max-w-lg p-3 rounded-xl shadow-md ${
                        msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-gray-700 text-gray-200 rounded-bl-none'
                    }`}>
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>
                </div>
            ) : null
        ))}
        
        {isLoading && messages[messages.length - 1]?.content === '' && (
            <div className="flex items-end gap-2 flex-row animate-fade-in">
                 <div className="w-8 h-8 rounded-full bg-gray-700 p-1.5 flex-shrink-0 text-blue-400">{ICONS.JAVIS_AVATAR}</div>
                 <div className="max-w-xs md:max-w-md p-3 rounded-xl bg-gray-700 rounded-bl-none shadow-md">
                    <div className="flex items-center justify-center gap-1.5 h-5">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    </div>
                </div>
            </div>
        )}

        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-700/50 bg-gray-900/30">
        <div className="flex bg-gray-700/50 rounded-lg">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Javis..."
            disabled={isLoading}
            className="flex-grow bg-transparent p-2 text-sm focus:outline-none placeholder-gray-400"
          />
          <button type="submit" disabled={isLoading || !input.trim()} className="p-2 text-blue-400 hover:text-blue-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default GeminiAssistant;