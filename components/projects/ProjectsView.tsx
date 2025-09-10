import React, { useState } from 'react';
import type { Project } from '../../types';
import useLocalStorage from '../../hooks/useLocalStorage';
import { PlusCircleIcon, ChevronLeftIcon } from '../Icons';
import ProjectCard from './ProjectCard';
import ProjectForm from './ProjectForm';

interface ProjectsViewProps {
    goBack: () => void;
}

const ProjectsView: React.FC<ProjectsViewProps> = ({ goBack }) => {
    const [projects, setProjects] = useLocalStorage<Project[]>('fosis_projects', []);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilters, setDateFilters] = useState({ start: '', end: '' });

    const sortedProjects = [...projects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const filteredProjects = sortedProjects.filter(project => {
        const searchTermMatch = searchTerm.toLowerCase() === '' ||
            project.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.executorName.toLowerCase().includes(searchTerm.toLowerCase());
        
        const startDateMatch = !dateFilters.start || project.startDate >= dateFilters.start;
        const endDateMatch = !dateFilters.end || (project.endDate && project.endDate <= dateFilters.end);

        return searchTermMatch && startDateMatch;
    });

    const handleSaveProject = (project: Project) => {
        const index = projects.findIndex(p => p.id === project.id);
        if (index > -1) {
            const updatedProjects = [...projects];
            updatedProjects[index] = project;
            setProjects(updatedProjects);
        } else {
            setProjects([...projects, project]);
        }
        setIsFormOpen(false);
        setProjectToEdit(null);
    };
    
    const handleEdit = (project: Project) => {
        setProjectToEdit(project);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        if(window.confirm("¿Estás seguro de que quieres eliminar este proyecto?")) {
            setProjects(projects.filter(p => p.id !== id));
        }
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setDateFilters({ start: '', end: '' });
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in-up">
            <button onClick={goBack} className="flex items-center gap-2 px-4 py-2 mb-4 font-semibold text-fosis-blue-800 dark:text-fosis-blue-300 rounded-full hover:bg-fosis-blue-500/10 transition-colors">
                <ChevronLeftIcon className="w-5 h-5"/>
                Volver al Inicio
            </button>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-fosis-blue-900 dark:text-white">Mis Proyectos</h1>
                <button
                    onClick={() => { setProjectToEdit(null); setIsFormOpen(true); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-fosis-blue-800 text-white font-semibold rounded-lg shadow-soft-md hover:bg-fosis-blue-900 transition-all transform hover:scale-105"
                >
                    <PlusCircleIcon className="w-5 h-5"/>
                    <span>Nuevo Proyecto</span>
                </button>
            </div>

            <div className="mb-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-4 rounded-xl shadow-soft-lg border border-white/20 dark:border-slate-700/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 items-end gap-4">
                    <div className="sm:col-span-2">
                        <label htmlFor="search" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Buscar</label>
                        <input
                            type="text"
                            id="search"
                            placeholder="Código o Ejecutor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-soft-sm p-2 focus:ring-fosis-blue-700 focus:border-fosis-blue-700 bg-white/70 dark:bg-slate-700/70"
                            aria-label="Buscar proyectos"
                        />
                    </div>
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Inicio Desde</label>
                        <input
                            type="date"
                            id="startDate"
                            value={dateFilters.start}
                            onChange={(e) => setDateFilters(prev => ({ ...prev, start: e.target.value }))}
                            className="block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-soft-sm p-2 focus:ring-fosis-blue-700 focus:border-fosis-blue-700 bg-white/70 dark:bg-slate-700/70"
                            aria-label="Filtrar por fecha de inicio"
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Término Hasta</label>
                        <input
                            type="date"
                            id="endDate"
                            value={dateFilters.end}
                            onChange={(e) => setDateFilters(prev => ({ ...prev, end: e.target.value }))}
                            className="block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-soft-sm p-2 focus:ring-fosis-blue-700 focus:border-fosis-blue-700 bg-white/70 dark:bg-slate-700/70"
                            aria-label="Filtrar por fecha de término"
                        />
                    </div>
                    <div className="md:col-start-4">
                        <button
                            onClick={handleClearFilters}
                            className="px-4 py-2 bg-slate-500 text-white text-sm font-semibold rounded-lg hover:bg-slate-600 transition-colors w-full"
                        >
                            Limpiar Filtros
                        </button>
                    </div>
                </div>
            </div>

            {projects.length > 0 ? (
                filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredProjects.map((p, index) => (
                             <div key={p.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 75}ms`, opacity: 0 }}>
                                <ProjectCard project={p} onEdit={handleEdit} onDelete={handleDelete} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-soft-md border border-white/20 dark:border-slate-700/50">
                        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">No se encontraron proyectos</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Intenta ajustar tus filtros o términos de búsqueda.</p>
                    </div>
                )
            ) : (
                 <div className="text-center py-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-soft-md border border-white/20 dark:border-slate-700/50">
                    <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Aún no hay proyectos ingresados</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">¡Comienza agregando tu primer proyecto para verlo aquí!</p>
                </div>
            )}

            {isFormOpen && (
                <ProjectForm 
                    onClose={() => setIsFormOpen(false)}
                    onSave={handleSaveProject}
                    projectToEdit={projectToEdit}
                />
            )}
        </div>
    );
};

export default ProjectsView;