import React, { useState } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import type { User, AppView } from './types';
import Auth from './components/Auth';
import Welcome from './components/Welcome';
import ProjectsView from './components/projects/ProjectsView';
import QuizView from './components/Quiz';
import TaskManagerView from './components/TaskManager';
import ConsultationView from './components/Consultation';
import { LogOutIcon } from './components/Icons';

const NavButton = React.memo<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}>(({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out relative ${
      isActive
        ? 'text-white'
        : 'text-neutral-300 hover:text-white'
    }`}
  >
    {label}
    {isActive && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-fosis-green rounded-full"></span>}
  </button>
));


const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
    const [currentView, setCurrentView] = useState<AppView>('welcome');

    const handleLogout = () => {
        setCurrentUser(null);
        setCurrentView('welcome');
    };
    
    if (!currentUser) {
        return <Auth onLogin={setCurrentUser} />;
    }

    const renderView = () => {
        switch (currentView) {
            case 'welcome':
                return <Welcome user={currentUser}/>;
            case 'projects':
                return <ProjectsView />;
            case 'quiz':
                return <QuizView />;
            case 'tasks':
                return <TaskManagerView />;
            case 'consultation':
                return <ConsultationView />;
            default:
                return <Welcome user={currentUser}/>;
        }
    };
    
    return (
        <div className="min-h-screen flex flex-col bg-neutral-100">
            <header className="bg-fosis-blue shadow-lg sticky top-0 z-40">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center">
                            <img src="https://www.fosis.gob.cl/assets/img/logo_header.png" alt="FOSIS Logo" className="h-12"/>
                            <div className="hidden md:block ml-10">
                                <div className="flex items-baseline space-x-2">
                                   <NavButton label="Bienvenida" isActive={currentView === 'welcome'} onClick={() => setCurrentView('welcome')} />
                                   <NavButton label="Mis Proyectos" isActive={currentView === 'projects'} onClick={() => setCurrentView('projects')} />
                                   <NavButton label="Quiz" isActive={currentView === 'quiz'} onClick={() => setCurrentView('quiz')} />
                                   <NavButton label="Gestor de Tareas" isActive={currentView === 'tasks'} onClick={() => setCurrentView('tasks')} />
                                   <NavButton label="Consulta en Línea" isActive={currentView === 'consultation'} onClick={() => setCurrentView('consultation')} />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center">
                             <span className="text-white text-sm mr-4 hidden sm:block font-medium">{currentUser.email}</span>
                             <button onClick={handleLogout} className="p-2 rounded-full text-neutral-300 hover:bg-fosis-blue-dark hover:text-white transition-colors">
                                <LogOutIcon className="w-6 h-6"/>
                             </button>
                        </div>
                    </div>
                </nav>
            </header>
            <main className="flex-grow">
               {renderView()}
            </main>
            <footer className="bg-fosis-blue-dark text-neutral-300 shadow-inner mt-auto">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm">
                    <img src="https://www.fosis.gob.cl/assets/img/logo_header.png" alt="FOSIS Logo" className="h-10 mx-auto mb-4 opacity-80"/>
                    <p>&copy; {new Date().getFullYear()} Gestor de Proyectos FOSIS.</p>
                    <p className="text-xs text-neutral-400 mt-1">Esta es una herramienta de apoyo no oficial.</p>
                    <p className="mt-3">
                        <a href="https://www.fosis.gob.cl/" target="_blank" rel="noopener noreferrer" className="font-semibold text-white hover:underline">
                            Visitar Sitio Oficial FOSIS
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default App;