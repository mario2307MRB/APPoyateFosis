import React from 'react';
import type { User, AppView } from '../types';
import { ProjectIcon, QuizIcon, TaskIcon, ConsultIcon, ChevronRightIcon } from './Icons';
import useProgress from '../hooks/useProgress';

interface WelcomeProps {
    user: User;
    setView: (view: AppView) => void;
}

interface NavCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    colorClasses: string;
}

const NavCard: React.FC<NavCardProps> = React.memo(({ icon, title, description, onClick, colorClasses }) => (
    <button
        onClick={onClick}
        className={`group relative text-left p-6 rounded-3xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl focus:outline-none focus-visible:ring-4 ring-offset-2 dark:ring-offset-slate-900 ${colorClasses}`}
        aria-label={`Ir a ${title}`}
    >
        <div className="relative z-10">
            <div className="mb-4 p-3 bg-white/30 rounded-full w-max">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-white drop-shadow-sm">{title}</h3>
            <p className="mt-1 text-white/80 drop-shadow-sm">{description}</p>
        </div>
        <div className="absolute bottom-4 right-4 text-white/50 group-hover:text-white group-hover:scale-125 transition-all duration-300">
            <ChevronRightIcon className="w-8 h-8"/>
        </div>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
    </button>
));


const Welcome: React.FC<WelcomeProps> = ({ user, setView }) => {
    const progress = useProgress();

    return (
        <div className="w-full flex flex-col items-center p-4 sm:p-6 lg:p-8 animate-fade-in-up">
            <div className="w-full max-w-6xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                    Bienvenido, <span className="text-fosis-blue-800 dark:text-fosis-blue-400">{user.email.split('@')[0]}</span>
                </h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                    Tu centro de mando para la gestión de proyectos FOSIS. Selecciona un módulo para comenzar.
                </p>
                <div className="mt-4 text-lg font-bold text-fosis-green-600 dark:text-fosis-green-400">
                    Puntaje de Progreso: {progress}
                </div>
            </div>

             <div className="w-full max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                <NavCard 
                    title="Mis Proyectos"
                    description="Gestiona y supervisa tus convenios."
                    icon={<ProjectIcon className="w-8 h-8 text-white"/>}
                    onClick={() => setView('projects')}
                    colorClasses="bg-gradient-to-br from-fosis-blue-700 to-sky-500 ring-fosis-blue-500"
                />
                 <NavCard 
                    title="Quiz FOSIS"
                    description="Pon a prueba tus conocimientos."
                    icon={<QuizIcon className="w-8 h-8 text-white"/>}
                    onClick={() => setView('quiz')}
                    colorClasses="bg-gradient-to-br from-fosis-green-600 to-emerald-400 ring-fosis-green-500"
                />
                 <NavCard 
                    title="Gestor de Tareas"
                    description="Organiza tu semana y optimiza tu tiempo."
                    icon={<TaskIcon className="w-8 h-8 text-white"/>}
                    onClick={() => setView('tasks')}
                    colorClasses="bg-gradient-to-br from-amber-500 to-orange-500 ring-amber-500"
                />
                 <NavCard 
                    title="Consulta en Línea"
                    description="Resuelve tus dudas con el asistente IA."
                    icon={<ConsultIcon className="w-8 h-8 text-white"/>}
                    onClick={() => setView('consultation')}
                    colorClasses="bg-gradient-to-br from-purple-600 to-indigo-500 ring-purple-500"
                />
            </div>

        </div>
    );
};

export default Welcome;
