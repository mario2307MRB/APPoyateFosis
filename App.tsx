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
    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 relative ${
      isActive
        ? 'bg-fosis-blue-800 text-white shadow-sm'
        : 'text-slate-500 hover:text-fosis-blue-800 hover:bg-fosis-blue-100'
    }`}
  >
    {label}
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
        <div className="min-h-screen flex flex-col bg-slate-50">
            <header className="bg-white/90 backdrop-blur-lg shadow-sm sticky top-0 z-40 border-b border-slate-200">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center">
                            <img src="https://www.fosis.gob.cl/assets/img/logo_main.png" alt="FOSIS Logo" className="h-10"/>
                            <div className="hidden md:block ml-10">
                                <div className="flex items-baseline space-x-2 bg-slate-100 p-1 rounded-full border border-slate-200">
                                   <NavButton label="Bienvenida" isActive={currentView === 'welcome'} onClick={() => setCurrentView('welcome')} />
                                   <NavButton label="Mis Proyectos" isActive={currentView === 'projects'} onClick={() => setCurrentView('projects')} />
                                   <NavButton label="Quiz" isActive={currentView === 'quiz'} onClick={() => setCurrentView('quiz')} />
                                   <NavButton label="Gestor de Tareas" isActive={currentView === 'tasks'} onClick={() => setCurrentView('tasks')} />
                                   <NavButton label="Consulta en Línea" isActive={currentView === 'consultation'} onClick={() => setCurrentView('consultation')} />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                             <span className="text-slate-600 text-sm mr-2 hidden sm:block font-medium">{currentUser.email}</span>
                             <button onClick={handleLogout} className="p-2 rounded-full text-slate-500 hover:bg-red-100 hover:text-red-600 transition-colors">
                                <LogOutIcon className="w-6 h-6"/>
                             </button>
                        </div>
                    </div>
                </nav>
            </header>
            <main className="flex-grow">
               {renderView()}
            </main>
            <footer className="bg-slate-100 text-slate-500 border-t border-slate-200">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm">
                    <img src="https://www.fosis.gob.cl/assets/img/logo_main.png" alt="FOSIS Logo" className="h-8 mx-auto mb-4 opacity-70"/>
                    <p>&copy; {new Date().getFullYear()} Gestor de Proyectos FOSIS.</p>
                    <p className="text-xs text-slate-400 mt-1">Esta es una herramienta de apoyo no oficial.</p>
                    <p className="mt-3">
                        <a href="https://www.fosis.gob.cl/" target="_blank" rel="noopener noreferrer" className="font-semibold text-fosis-blue-800 hover:underline">
                            Visitar Sitio Oficial FOSIS
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default App;