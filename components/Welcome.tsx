
import React, { useState, useEffect } from 'react';
import { FOSIS_TIPS } from '../constants';
import type { User, Project } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';
import useLocalStorage from '../hooks/useLocalStorage';

// --- Helper function ---
const formatCurrency = (value: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);


// --- ProjectsCarousel Component defined within Welcome.tsx ---
const ProjectsCarousel: React.FC = () => {
    const [projects] = useLocalStorage<Project[]>('fosis_projects', []);
    const [currentIndex, setCurrentIndex] = useState(0);

    const recentProjects = [...projects]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5); // Show up to 5 recent projects

    const nextProject = () => {
        if (recentProjects.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex + 1) % recentProjects.length);
    };

    const prevProject = () => {
        if (recentProjects.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex - 1 + recentProjects.length) % recentProjects.length);
    };

    useEffect(() => {
        if (recentProjects.length <= 1) return;
        const timer = setInterval(() => {
            nextProject();
        }, 7000); // Change project every 7 seconds
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recentProjects.length]);

    if (projects.length === 0) {
        return null; // Don't show anything if there are no projects at all
    }

    return (
        <div className="w-full max-w-3xl mx-auto mt-12">
            <h2 className="text-2xl font-bold text-neutral-700 mb-4 text-center">Proyectos Recientes</h2>
            <div className="relative bg-white rounded-xl shadow-lg overflow-hidden border border-neutral-200">
                <div className="relative h-56 flex items-center justify-center transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                    {recentProjects.map((project) => {
                         const totalDisbursed = project.disbursements?.reduce((sum, d) => sum + d.amount, 0) || 0;
                         const totalRendered = project.renditions?.reduce((sum, r) => sum + r.approvedAmount, 0) || 0;
                         const percentageRendered = totalDisbursed > 0 ? (totalRendered / totalDisbursed) * 100 : 0;

                        return (
                        <div key={project.id} className="w-full flex-shrink-0 p-6 md:p-8 text-left box-border">
                            <p className="text-sm font-semibold text-fosis-blue">{project.code}</p>
                            <h3 className="text-xl font-bold text-fosis-blue-dark truncate" title={project.executorName}>{project.executorName}</h3>
                            <p className="mt-2 text-neutral-600"><strong>Monto:</strong> {formatCurrency(project.amount)}</p>
                            
                            <div className="mt-4">
                              <div className="flex justify-between mb-1 text-sm">
                                <span className="font-medium text-fosis-blue-dark">% Rendido</span>
                                <span className="font-medium text-fosis-blue-dark">{percentageRendered.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-neutral-200 rounded-full h-3">
                                <div className="bg-fosis-green h-3 rounded-full transition-all duration-500" style={{ width: `${percentageRendered > 100 ? 100 : percentageRendered}%` }}></div>
                              </div>
                            </div>
                        </div>
                    )})}
                </div>

                {recentProjects.length > 1 && (
                    <>
                        <button onClick={prevProject} className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/70 hover:bg-white backdrop-blur-sm rounded-full p-2 transition shadow-md hover:scale-110">
                            <ChevronLeftIcon className="w-6 h-6 text-fosis-blue" />
                        </button>
                        <button onClick={nextProject} className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/70 hover:bg-white backdrop-blur-sm rounded-full p-2 transition shadow-md hover:scale-110">
                            <ChevronRightIcon className="w-6 h-6 text-fosis-blue" />
                        </button>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                            {recentProjects.map((_, index) => (
                                <button key={index} aria-label={`Ir al proyecto ${index + 1}`} onClick={() => setCurrentIndex(index)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-fosis-blue scale-125' : 'bg-neutral-300 hover:bg-neutral-400'}`}></button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};


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
        <div className="relative w-full max-w-2xl mx-auto mt-10 bg-fosis-green/10 border border-fosis-green/30 rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-48 flex items-center justify-center transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {FOSIS_TIPS.map((tip) => (
                    <div key={tip.id} className="w-full flex-shrink-0 p-8 text-center">
                        <h3 className="text-xl font-bold text-fosis-green-dark">{tip.title}</h3>
                        <p className="mt-2 text-neutral-600">{tip.content}</p>
                    </div>
                ))}
            </div>

            <button onClick={prevTip} className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/70 hover:bg-white backdrop-blur-sm rounded-full p-2 transition shadow-md hover:scale-110">
                <ChevronLeftIcon className="w-6 h-6 text-fosis-green-dark" />
            </button>
            <button onClick={nextTip} className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/70 hover:bg-white backdrop-blur-sm rounded-full p-2 transition shadow-md hover:scale-110">
                <ChevronRightIcon className="w-6 h-6 text-fosis-green-dark" />
            </button>

             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {FOSIS_TIPS.map((_, index) => (
                    <button key={index} aria-label={`Ir al tip ${index + 1}`} onClick={() => setCurrentIndex(index)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-fosis-green-dark scale-125' : 'bg-fosis-green/30 hover:bg-fosis-green/50'}`}></button>
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
        <div className="w-full flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl w-full max-w-4xl mx-auto text-center border border-neutral-200">
                <img src="https://www.fosis.gob.cl/assets/img/logo_main.png" alt="Logo FOSIS" className="mx-auto h-20 mb-6"/>
                <h1 className="text-4xl md:text-5xl font-extrabold text-fosis-blue-dark tracking-tight">
                    Bienvenido al Gestor de Proyectos
                </h1>
                <p className="mt-4 text-2xl text-neutral-700">
                    Hola, <span className="font-semibold text-fosis-green-dark">{user.email}</span>
                </p>
                <p className="mt-2 text-lg text-neutral-500 max-w-2xl mx-auto">
                    Esta es tu plataforma centralizada para administrar, consultar y optimizar tus proyectos FOSIS.
                </p>
                
                <ProjectsCarousel />
                
                <TipsCarousel />
            </div>
        </div>
    );
};

export default Welcome;
