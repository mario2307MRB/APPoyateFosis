import React, { useState } from 'react';

const backgrounds = [
  'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
  'bg-gradient-to-br from-sky-400 via-teal-400 to-green-500',
  'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600',
  'bg-gradient-to-br from-fosis-blue-700 via-cyan-600 to-fosis-green-500',
  'bg-gradient-to-br from-rose-500 via-fuchsia-500 to-indigo-600'
];

const DynamicBackground: React.FC = () => {
    // Selecciona una clase de fondo aleatoria en el montaje inicial y la mantiene.
    const [backgroundClass] = useState(() => backgrounds[Math.floor(Math.random() * backgrounds.length)]);

    return (
        <div className="fixed inset-0 -z-10 h-full w-full">
            {/* El gradiente animado que se mueve */}
            <div 
                className={`absolute inset-0 -z-20 ${backgroundClass} bg-[length:400%_400%] animate-gradient-pan`}
                aria-hidden="true"
            ></div>
            {/* La capa de desenfoque que crea el efecto de vidrio */}
            <div 
                className="absolute inset-0 -z-10 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-3xl"
                aria-hidden="true"
            ></div>
        </div>
    );
};

export default React.memo(DynamicBackground);
