import React, { useState, useRef, useEffect } from 'react';
import { getFosisAnswer } from '../services/geminiService';
import { SendIcon, UserIcon, BotIcon, ChevronLeftIcon } from './Icons';

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

interface ConsultationViewProps {
    goBack: () => void;
}

const ConsultationView: React.FC<ConsultationViewProps> = ({ goBack }) => {
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
        <div className="p-4 sm:p-6 lg:p-8 flex flex-col h-[calc(100vh-100px)] items-center animate-fade-in-up">
            <div className="w-full max-w-4xl flex flex-col h-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-3xl shadow-soft-xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700/50 flex-shrink-0 text-center relative">
                     <button onClick={goBack} className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 px-3 py-1.5 font-semibold text-fosis-blue-800 dark:text-fosis-blue-300 rounded-full hover:bg-fosis-blue-500/10 transition-colors">
                        <ChevronLeftIcon className="w-5 h-5"/>
                        <span>Volver</span>
                    </button>
                    <h1 className="text-2xl font-bold text-fosis-blue-900 dark:text-white">Consulta en Línea con IA</h1>
                </div>
                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-4 animate-fade-in-up ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'bot' && <div className="w-10 h-10 rounded-full bg-fosis-blue-800 flex items-center justify-center text-white flex-shrink-0 shadow-soft-sm"><BotIcon className="w-6 h-6"/></div>}
                            <div className={`max-w-xl p-4 rounded-2xl shadow-soft-sm ${msg.sender === 'user' ? 'bg-fosis-blue-800 text-white rounded-br-lg' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-lg'}`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                            {msg.sender === 'user' && <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-200 flex-shrink-0 shadow-soft-sm"><UserIcon className="w-6 h-6"/></div>}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-4 animate-fade-in-up">
                                <div className="w-10 h-10 rounded-full bg-fosis-blue-800 flex items-center justify-center text-white flex-shrink-0 shadow-soft-sm"><BotIcon className="w-6 h-6"/></div>
                                <div className="max-w-md p-4 rounded-2xl shadow-soft-sm bg-slate-100 dark:bg-slate-700 text-slate-800 flex items-center gap-2">
                                <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce"></div>
                                </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 bg-white/50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Escribe tu pregunta aquí..."
                            className="flex-1 p-3 border border-slate-300 dark:border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-fosis-blue-700 transition-shadow bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
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