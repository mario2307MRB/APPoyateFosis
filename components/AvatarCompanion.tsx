"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const motivationalMessages = [
    "¡Sigue adelante! Cada paso te acerca a tu meta.",
    "Tu esfuerzo de hoy es el éxito de mañana.",
    "¿Necesitas ayuda? Explora las secciones para encontrarla.",
    "Recuerda, cada gran proyecto comienza con un solo paso.",
    "¡Estás haciendo un gran trabajo! No te rindas.",
    "La perseverancia es la clave del éxito. ¡Tú puedes!",
    "Organiza tus tareas y verás qué fácil es avanzar."
];

const AvatarCompanion = () => {
    const [message, setMessage] = useState(motivationalMessages[0]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show the companion after a short delay
        const initialTimeout = setTimeout(() => {
            setIsVisible(true);
        }, 2000);

        // Cycle through messages
        const messageInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
            setMessage(motivationalMessages[randomIndex]);
        }, 10000); // Change message every 10 seconds

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(messageInterval);
        };
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3" aria-live="polite">
            <AnimatePresence>
                <motion.div
                    key={message}
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="bg-background p-3 rounded-lg shadow-xl border max-w-xs hidden sm:block"
                >
                    <p className="text-sm text-foreground">{message}</p>
                </motion.div>
            </AnimatePresence>

            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="bg-gradient-to-br from-fosis-blue-500 to-fosis-green-500 p-3.5 rounded-full shadow-lg cursor-pointer"
                aria-label="Asistente FOSIS"
            >
                <Sparkles className="h-7 w-7 text-white" />
            </motion.div>
        </div>
    );
};

export default AvatarCompanion;
