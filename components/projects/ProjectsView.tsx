import React, { useState } from 'react';
import type { Project } from '../../types';
import useLocalStorage from '../../hooks/useLocalStorage';
import { PlusCircleIcon } from '../Icons';
import ProjectCard from './ProjectCard';
import ProjectForm from './ProjectForm';

const ProjectsView: React.FC = () => {
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

        return searchTermMatch && startDateMatch && endDateMatch;
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
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Mis Proyectos</h1>
                <button
                    onClick={() => { setProjectToEdit(null); setIsFormOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-fosis-blue text-white rounded-lg shadow-md hover:bg-fosis-blue-dark transition-colors"
                >
                    <PlusCircleIcon className="w-5 h-5"/>
                    <span>Nuevo Proyecto</span>
                </button>
            </div>

            <div className="mb-6 bg-white p-4 rounded-lg shadow">
                <div className="flex flex-wrap items-end gap-4">
                    <div className="flex-grow min-w-[250px] sm:min-w-[300px]">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700">Buscar por Código o Ejecutor</label>
                        <input
                            type="text"
                            id="search"
                            placeholder="Escribe para buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            aria-label="Buscar proyectos"
                        />
                    </div>
                    <div className="flex-grow min-w-[150px]">
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Inicio Desde</label>
                        <input
                            type="date"
                            id="startDate"
                            value={dateFilters.start}
                            onChange={(e) => setDateFilters(prev => ({ ...prev, start: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            aria-label="Filtrar por fecha de inicio"
                        />
                    </div>
                    <div className="flex-grow min-w-[150px]">
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Término Hasta</label>
                        <input
                            type="date"
                            id="endDate"
                            value={dateFilters.end}
                            onChange={(e) => setDateFilters(prev => ({ ...prev, end: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            aria-label="Filtrar por fecha de término"
                        />
                    </div>
                    <div>
                        <button
                            onClick={handleClearFilters}
                            className="px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors w-full sm:w-auto"
                        >
                            Limpiar Filtros
                        </button>
                    </div>
                </div>
            </div>

            {projects.length > 0 ? (
                filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredProjects.map(p => (
                            <ProjectCard key={p.id} project={p} onEdit={handleEdit} onDelete={handleDelete} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-700">No se encontraron proyectos</h2>
                        <p className="text-gray-500 mt-2">Intenta ajustar tus filtros o términos de búsqueda.</p>
                    </div>
                )
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700">No hay proyectos ingresados</h2>
                    <p className="text-gray-500 mt-2">¡Comienza agregando tu primer proyecto!</p>
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
