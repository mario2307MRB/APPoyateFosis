
import React, { useState, useEffect, useCallback } from 'react';
import type { Project } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { PlusCircleIcon, EditIcon, TrashIcon, XCircleIcon } from './Icons';

// --- Helper Functions ---
const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
};

const addDays = (date: string, days: number): string => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0];
};

// --- ProjectForm Component ---
interface ProjectFormProps {
    onClose: () => void;
    onSave: (project: Project) => void;
    projectToEdit: Project | null;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onClose, onSave, projectToEdit }) => {
    const [project, setProject] = useState<Omit<Project, 'id' | 'createdAt'>>({
        code: '',
        executorName: '',
        startDate: '',
        endDate: '',
        contractEndDate: '',
        amount: 0,
        complianceGuaranteeAmount: 0,
        complianceGuaranteeDueDate: '',
        advanceGuaranteeAmount: 0,
        advanceGuaranteeEndDate: '',
        isFosisLaw: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (projectToEdit) {
            setProject({
                ...projectToEdit,
                startDate: formatDateForInput(projectToEdit.startDate),
                endDate: formatDateForInput(projectToEdit.endDate),
                contractEndDate: formatDateForInput(projectToEdit.contractEndDate),
                complianceGuaranteeDueDate: formatDateForInput(projectToEdit.complianceGuaranteeDueDate),
                advanceGuaranteeEndDate: projectToEdit.advanceGuaranteeEndDate ? formatDateForInput(projectToEdit.advanceGuaranteeEndDate) : '',
            });
        }
    }, [projectToEdit]);

    useEffect(() => {
        if (project.endDate) {
            setProject(p => ({ ...p, contractEndDate: addDays(p.endDate, 90) }));
        }
    }, [project.endDate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const isChecked = (e.target as HTMLInputElement).checked;
            setProject({ ...project, [name]: isChecked });
            if(isChecked){
                setProject(p => ({...p, advanceGuaranteeAmount: 0, advanceGuaranteeEndDate: ''}))
            }
        } else {
            setProject({ ...project, [name]: type === 'number' ? parseFloat(value) || 0 : value });
        }
    };
    
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!project.code.match(/^\d{2}-\d{5}-\d{5}-\d{2}$/)) {
            newErrors.code = "El código debe tener el formato XX-XXXXX-XXXXX-XX";
        }
        if (!project.executorName) newErrors.executorName = "El nombre del ejecutor es requerido";
        if (!project.startDate) newErrors.startDate = "La fecha de inicio es requerida";
        if (!project.endDate) newErrors.endDate = "La fecha de término es requerida";
        if (project.startDate && project.endDate && project.startDate > project.endDate) {
            newErrors.endDate = "La fecha de término no puede ser anterior a la de inicio";
        }
        if (project.amount <= 0) newErrors.amount = "El monto debe ser mayor a cero";
        if (project.complianceGuaranteeAmount <= 0) newErrors.complianceGuaranteeAmount = "El monto de la garantía es requerido";
        if (!project.complianceGuaranteeDueDate) newErrors.complianceGuaranteeDueDate = "La fecha de vencimiento es requerida";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!validate()) return;

        const finalProject: Project = {
            id: projectToEdit ? projectToEdit.id : new Date().toISOString(),
            createdAt: projectToEdit ? projectToEdit.createdAt : new Date().toISOString(),
            ...project,
        };
        onSave(finalProject);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-fosis-blue-dark">{projectToEdit ? 'Editar' : 'Nuevo'} Proyecto</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XCircleIcon className="w-8 h-8"/>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Column 1 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Código del Proyecto</label>
                            <input type="text" name="code" value={project.code} onChange={handleChange} placeholder="XX-XXXXX-XXXXX-XX" className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.code ? 'border-red-500' : 'border-gray-300'}`} required />
                            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre Ejecutor</label>
                            <input type="text" name="executorName" value={project.executorName} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.executorName ? 'border-red-500' : 'border-gray-300'}`} required />
                             {errors.executorName && <p className="text-red-500 text-xs mt-1">{errors.executorName}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha Inicio</label>
                            <input type="date" name="startDate" value={project.startDate} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`} required />
                             {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha Término</label>
                            <input type="date" name="endDate" value={project.endDate} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`} required />
                             {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha Término Contrato</label>
                            <input type="date" name="contractEndDate" value={project.contractEndDate} disabled className="mt-1 block w-full border rounded-md shadow-sm p-2 bg-gray-100" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Monto Proyecto (CLP)</label>
                            <input type="number" name="amount" value={project.amount} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.amount ? 'border-red-500' : 'border-gray-300'}`} required />
                            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                        </div>

                        {/* Column 2 */}
                        <div className="md:col-span-2 border-t pt-4 mt-2">
                             <h3 className="text-lg font-semibold text-gray-800 mb-2">Garantías</h3>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Monto Garantía Fiel Cumplimiento</label>
                            <input type="number" name="complianceGuaranteeAmount" value={project.complianceGuaranteeAmount} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.complianceGuaranteeAmount ? 'border-red-500' : 'border-gray-300'}`} required />
                             {errors.complianceGuaranteeAmount && <p className="text-red-500 text-xs mt-1">{errors.complianceGuaranteeAmount}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Vencimiento Garantía Fiel Cumplimiento</label>
                            <input type="date" name="complianceGuaranteeDueDate" value={project.complianceGuaranteeDueDate} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.complianceGuaranteeDueDate ? 'border-red-500' : 'border-gray-300'}`} required />
                            {errors.complianceGuaranteeDueDate && <p className="text-red-500 text-xs mt-1">{errors.complianceGuaranteeDueDate}</p>}
                        </div>
                        <div className="md:col-span-2 flex items-center gap-4">
                             <label className="block text-sm font-medium text-gray-700">Aplica Ley FOSIS (reemplaza garantía anticipo)</label>
                             <input type="checkbox" name="isFosisLaw" checked={project.isFosisLaw} onChange={handleChange} className="h-5 w-5 text-fosis-blue rounded focus:ring-fosis-blue-light" />
                        </div>
                        {!project.isFosisLaw && (
                           <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Monto Garantía Anticipo</label>
                                <input type="number" name="advanceGuaranteeAmount" value={project.advanceGuaranteeAmount} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Término Garantía Anticipo</label>
                                <input type="date" name="advanceGuaranteeEndDate" value={project.advanceGuaranteeEndDate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                           </>
                        )}
                    </div>
                    <div className="mt-8 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-fosis-blue text-white rounded-lg hover:bg-fosis-blue-dark shadow-md">Guardar Proyecto</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- ProjectCard Component ---
const ProjectCard: React.FC<{ project: Project; onEdit: (p: Project) => void; onDelete: (id: string) => void }> = ({ project, onEdit, onDelete }) => {
    const formatCurrency = (value: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
    
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="uppercase tracking-wide text-sm text-fosis-blue font-semibold">{project.code}</div>
                        <p className="block mt-1 text-lg leading-tight font-bold text-black">{project.executorName}</p>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={() => onEdit(project)} className="text-gray-500 hover:text-fosis-blue-dark"><EditIcon className="w-5 h-5"/></button>
                        <button onClick={() => onDelete(project.id)} className="text-gray-500 hover:text-red-600"><TrashIcon className="w-5 h-5"/></button>
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div><strong>Monto:</strong> {formatCurrency(project.amount)}</div>
                    <div><strong>Inicio:</strong> {new Date(project.startDate).toLocaleDateString('es-CL')}</div>
                    <div><strong>Término:</strong> {new Date(project.endDate).toLocaleDateString('es-CL')}</div>
                    <div className="lg:col-span-3"><strong>Término Contrato:</strong> {new Date(project.contractEndDate).toLocaleDateString('es-CL')}</div>
                    <div className="md:col-span-2 lg:col-span-3 border-t pt-2 mt-2 font-semibold text-gray-800">Garantías</div>
                    <div><strong>Fiel Cumplimiento:</strong> {formatCurrency(project.complianceGuaranteeAmount)}</div>
                    <div className="col-span-2"><strong>Vencimiento F.C.:</strong> {new Date(project.complianceGuaranteeDueDate).toLocaleDateString('es-CL')}</div>

                    {project.isFosisLaw ? (
                        <div className="col-span-3 text-fosis-green-dark font-medium">Aplica Ley FOSIS para anticipo.</div>
                    ) : (
                        <>
                         <div><strong>Anticipo:</strong> {formatCurrency(project.advanceGuaranteeAmount || 0)}</div>
                         {project.advanceGuaranteeEndDate && <div className="col-span-2"><strong>Vencimiento Anticipo:</strong> {new Date(project.advanceGuaranteeEndDate).toLocaleDateString('es-CL')}</div>}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- ProjectsView (Main) Component ---
const ProjectsView: React.FC = () => {
    const [projects, setProjects] = useLocalStorage<Project[]>('fosis_projects', []);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

    const sortedProjects = [...projects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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

            {sortedProjects.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {sortedProjects.map(p => (
                        <ProjectCard key={p.id} project={p} onEdit={handleEdit} onDelete={handleDelete} />
                    ))}
                </div>
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
