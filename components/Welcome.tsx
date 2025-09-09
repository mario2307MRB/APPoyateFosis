
import React, { useState, useEffect } from 'react';
import { FOSIS_TIPS } from '../constants';
import type { User } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

// --- TipsCarousel Component defined within Welcome.tsx ---
const TipsCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextTip = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % FOSIS_TIPS.length);
    };

    const prevTip = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + FOSIS_TIPS.length) % FOSIS_TIPS.length);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            nextTip();
        }, 5000); // Change tip every 5 seconds
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="relative w-full max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="relative h-48 flex items-center justify-center transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {FOSIS_TIPS.map((tip, index) => (
                    <div key={tip.id} className="w-full flex-shrink-0 p-8 text-center">
                        <h3 className="text-xl font-bold text-fosis-blue-dark">{tip.title}</h3>
                        <p className="mt-2 text-gray-600">{tip.content}</p>
                    </div>
                ))}
            </div>

            <button onClick={prevTip} className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/50 hover:bg-white rounded-full p-2 transition">
                <ChevronLeftIcon className="w-6 h-6 text-fosis-blue" />
            </button>
            <button onClick={nextTip} className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/50 hover:bg-white rounded-full p-2 transition">
                <ChevronRightIcon className="w-6 h-6 text-fosis-blue" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {FOSIS_TIPS.map((_, index) => (
                    <button key={index} onClick={() => setCurrentIndex(index)} className={`w-3 h-3 rounded-full transition ${currentIndex === index ? 'bg-fosis-blue' : 'bg-gray-300'}`}></button>
                ))}
            </div>
        </div>
    );
};

// --- Main Welcome Component ---
interface WelcomeProps {
    user: User;
}

const Welcome: React.FC<WelcomeProps> = ({ user }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 text-center">
            <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-4xl mx-auto">
                <img src="https://www.fosis.gob.cl/assets/img/logo_main.png" alt="Logo FOSIS" className="mx-auto h-20 mb-6"/>
                <h1 className="text-4xl md:text-5xl font-extrabold text-fosis-blue-dark tracking-tight">
                    Bienvenido al Gestor de Proyectos
                </h1>
                <p className="mt-4 text-2xl text-gray-700">
                    Hola, <span className="font-semibold text-fosis-green-dark">{user.email}</span>
                </p>
                <p className="mt-2 text-lg text-gray-500 max-w-2xl mx-auto">
                    Esta es tu plataforma centralizada para administrar, consultar y optimizar tus proyectos FOSIS.
                </p>
                
                <TipsCarousel />
            </div>
        </div>
    );
};

export default Welcome;
