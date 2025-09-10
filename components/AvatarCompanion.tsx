import React, { useState, useEffect } from 'react';
import useProgress from '../hooks/useProgress';

const Sapling: React.FC = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
        <path d="M50 85 C 45 70, 45 50, 50 40" stroke="#8B5A2B" fill="none" strokeWidth="5" strokeLinecap="round"/>
        <path d="M50 55 C 60 50, 65 40, 70 35" stroke="#4CAF50" fill="none" strokeWidth="6" strokeLinecap="round"/>
        <path d="M50 55 C 40 50, 35 40, 30 35" stroke="#4CAF50" fill="none" strokeWidth="6" strokeLinecap="round"/>
    </svg>
);

const YoungTree: React.FC = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
        <path d="M50 90 V 40" stroke="#8B5A2B" strokeWidth="8" strokeLinecap="round"/>
        <path d="M50 60 L 30 45" stroke="#8B5A2B" strokeWidth="6" strokeLinecap="round"/>
        <path d="M50 60 L 70 45" stroke="#8B5A2B" strokeWidth="6" strokeLinecap="round"/>
        <circle cx="50" cy="30" r="20" fill="#4CAF50"/>
        <circle cx="35" cy="40" r="15" fill="#81C784"/>
        <circle cx="65" cy="40" r="15" fill="#81C784"/>
    </svg>
);

const MatureTree: React.FC = () => (
     <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
        <path d="M50 95 V 40" stroke="#6D4C41" strokeWidth="12" strokeLinecap="round"/>
        <path d="M50 70 L 25 50" stroke="#6D4C41" strokeWidth="8" strokeLinecap="round"/>
        <path d="M50 70 L 75 50" stroke="#6D4C41" strokeWidth="8" strokeLinecap="round"/>
        <path d="M50 55 L 40 35" stroke="#6D4C41" strokeWidth="6" strokeLinecap="round"/>
        <path d="M50 55 L 60 35" stroke="#6D4C41" strokeWidth="6" strokeLinecap="round"/>
        <circle cx="50" cy="30" r="28" fill="#388E3C"/>
        <circle cx="30" cy="45" r="22" fill="#4CAF50"/>
        <circle cx="70" cy="45" r="22" fill="#4CAF50"/>
        <circle cx="50" cy="45" r="20" fill="#66BB6A"/>
    </svg>
);


const tips = [
    "Recuerda revisar las fechas de vencimiento de las garantías.",
    "Una buena planificación de tareas te dará más puntos de progreso.",
    "¡Sigue aprendiendo con el Quiz FOSIS para mejorar tu puntaje!",
    "La comunicación fluida con tu contraparte FOSIS es clave.",
    "Documenta todo tu trabajo. ¡Es la mejor forma de respaldo!"
];

const AvatarCompanion: React.FC = () => {
    const progress = useProgress();
    const [tip, setTip] = useState(tips[0]);
    const [showBubble, setShowBubble] = useState(false);
    const [key, setKey] = useState(0);

    useEffect(() => {
        const tipInterval = setInterval(() => {
            setTip(tips[Math.floor(Math.random() * tips.length)]);
        }, 20000);
        
        const bubbleInterval = setInterval(() => {
            setShowBubble(true);
            setKey(prev => prev + 1); // Rerender bubble to re-trigger animation
            setTimeout(() => setShowBubble(false), 8000);
        }, 30000);

        // Show bubble once on first load
        const initialTimeout = setTimeout(() => {
             setShowBubble(true);
             setKey(prev => prev + 1);
             setTimeout(() => setShowBubble(false), 8000);
        }, 3000)

        return () => {
            clearInterval(tipInterval);
            clearInterval(bubbleInterval);
            clearTimeout(initialTimeout);
        };
    }, []);

    const getLevel = () => {
        if (progress < 500) return { component: <Sapling />, label: "Aprendiz FOSIS" };
        if (progress < 1500) return { component: <YoungTree />, label: "Gestor Avanzado" };
        return { component: <MatureTree />, label: "Maestro de Proyectos" };
    };

    const { component, label } = getLevel();

    return (
        <div className="fixed bottom-4 right-4 z-50 flex items-end gap-3" aria-live="polite">
            {showBubble && (
                <div key={key} className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-2xl rounded-br-none shadow-soft-xl max-w-xs text-sm text-slate-700 dark:text-slate-200 animate-bubble-pop border border-white/20 dark:border-slate-700 backdrop-blur-md" role="status">
                    <p>{tip}</p>
                </div>
            )}
            <div className="relative group">
                <div className="w-24 h-24 animate-float cursor-pointer">
                   {component}
                </div>
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {label} ({progress} pts)
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
                </div>
            </div>
        </div>
    );
};

export default AvatarCompanion;
