import React, { useState, useRef, useEffect } from 'react';
import { getFosisAnswer } from '../services/geminiService';
import { SendIcon, UserIcon, BotIcon } from './Icons';

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

const ConsultationView: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'bot', text: 'Hola, soy el asistente virtual FOSIS. ¿En qué puedo ayudarte hoy?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const botResponse = await getFosisAnswer(input);
            const botMessage: Message = { sender: 'bot', text: botResponse };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage: Message = { sender: 'bot', text: 'Lo siento, ha ocurrido un error. Inténtalo de nuevo.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 flex flex-col h-[calc(100vh-80px)] max-h-[calc(100vh-80px)] items-center">
            <div className="w-full max-w-4xl flex flex-col h-full bg-white rounded-2xl shadow-soft-xl border border-slate-200">
                <h1 className="text-3xl font-bold text-fosis-blue-900 text-center p-4 border-b border-slate-200 flex-shrink-0">Consulta en Línea con IA</h1>
                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'bot' && <div className="w-10 h-10 rounded-full bg-fosis-blue-800 flex items-center justify-center text-white flex-shrink-0 shadow-soft-sm"><BotIcon className="w-6 h-6"/></div>}
                            <div className={`max-w-xl p-4 rounded-2xl shadow-soft-sm ${msg.sender === 'user' ? 'bg-fosis-blue-800 text-white rounded-br-lg' : 'bg-slate-100 text-slate-800 rounded-bl-lg'}`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                            {msg.sender === 'user' && <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 flex-shrink-0 shadow-soft-sm"><UserIcon className="w-6 h-6"/></div>}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-fosis-blue-800 flex items-center justify-center text-white flex-shrink-0 shadow-soft-sm"><BotIcon className="w-6 h-6"/></div>
                                <div className="max-w-md p-4 rounded-2xl shadow-soft-sm bg-slate-100 text-slate-800 flex items-center gap-2">
                                <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce"></div>
                                </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 bg-white border-t border-slate-200">
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Escribe tu pregunta aquí..."
                            className="flex-1 p-3 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-fosis-blue-700 transition-shadow bg-slate-50"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="p-3 bg-fosis-blue-800 text-white rounded-full disabled:bg-slate-400 hover:bg-fosis-blue-900 transition-all transform hover:scale-110 shadow-soft-md"
                            aria-label="Enviar mensaje"
                        >
                            <SendIcon className="w-6 h-6"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsultationView;