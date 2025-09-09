
import React, { useState } from 'react';
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
        <div className="p-4 sm:p-6 lg:p-8 flex flex-col h-[calc(100vh-80px)] max-h-[calc(100vh-80px)]">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">Consulta en Línea</h1>
            <div className="flex-1 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
                <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-fosis-blue flex items-center justify-center text-white flex-shrink-0"><BotIcon className="w-5 h-5"/></div>}
                            <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'user' ? 'bg-fosis-blue text-white' : 'bg-gray-200 text-gray-800'}`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                            {msg.sender === 'user' && <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 flex-shrink-0"><UserIcon className="w-5 h-5"/></div>}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-3">
                             <div className="w-8 h-8 rounded-full bg-fosis-blue flex items-center justify-center text-white flex-shrink-0"><BotIcon className="w-5 h-5"/></div>
                             <div className="max-w-md p-3 rounded-lg bg-gray-200 text-gray-800 flex items-center gap-2">
                                <span className="animate-pulse">Escribiendo...</span>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                             </div>
                        </div>
                    )}
                </div>
                <div className="p-4 bg-gray-100 border-t">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Escribe tu pregunta aquí..."
                            className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-fosis-blue"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="p-3 bg-fosis-blue text-white rounded-full disabled:bg-gray-400 hover:bg-fosis-blue-dark transition-colors"
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
