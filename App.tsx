import React, { useState, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import type { User, AppView } from './types';
import Auth from './components/Auth';
import Welcome from './components/Welcome';
import ProjectsView from './components/projects/ProjectsView';
import QuizView from './components/Quiz';
import TaskManagerView from './components/TaskManager';
import ConsultationView from './components/Consultation';
import { LogOutIcon } from './components/Icons';
import DynamicBackground from './components/DynamicBackground';
import AvatarCompanion from './components/AvatarCompanion';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
    const [currentView, setCurrentView] = useState<AppView>('welcome');

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = (e: MediaQueryListEvent) => {
            if (e.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };
        
        mediaQuery.addEventListener('change', handleChange);

        // Setea el tema inicial al cargar el componente
        if (mediaQuery.matches) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    const handleLogout = () => {
        setCurrentUser(null);
        setCurrentView('welcome');
    };
    
    if (!currentUser) {
        return (
            <>
                <DynamicBackground />
                <Auth onLogin={setCurrentUser} />
            </>
        );
    }

    const goBack = () => setCurrentView('welcome');
    
    return (
        <div className="min-h-screen">
            <DynamicBackground />
            <div className="relative z-10 flex flex-col min-h-screen">
                <header className="sticky top-0 z-40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg border-b border-white/20 dark:border-white/10">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-20">
                            <div className="flex items-center">
                                <img src="https://www.fosis.gob.cl/assets/img/logo_main.png" alt="FOSIS Logo" className="h-10 dark:invert-[0.15] dark:brightness-200"/>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-slate-600 dark:text-slate-300 text-sm mr-2 hidden sm:block font-medium">{currentUser.email}</span>
                                <button 
                                    onClick={handleLogout} 
                                    className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                    aria-label="Cerrar sesión"
                                >
                                    <LogOutIcon className="w-6 h-6"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>
                
                <main className="flex-grow">
                    {currentView === 'welcome' && <Welcome user={currentUser} setView={setCurrentView} />}
                    {currentView === 'projects' && <ProjectsView goBack={goBack} />}
                    {currentView === 'quiz' && <QuizView goBack={goBack} />}
                    {currentView === 'tasks' && <TaskManagerView goBack={goBack} />}
                    {currentView === 'consultation' && <ConsultationView goBack={goBack} />}
                </main>
                
                <footer className="bg-transparent text-slate-500 dark:text-slate-400">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm">
                        <p>&copy; {new Date().getFullYear()} Gestor de Proyectos FOSIS. Herramienta de apoyo no oficial.</p>
                    </div>
                </footer>
                <AvatarCompanion />
            </div>
        </div>
    );
};

export default App;