
import React, { useState, useEffect, useCallback } from 'react';
import type { Project, Disbursement, Rendition, SupervisedUser } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { PlusCircleIcon, EditIcon, TrashIcon, XCircleIcon } from './Icons';

// --- Helper Functions ---
const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    // Handles both date (YYYY-MM-DD) and month (YYYY-MM) inputs
    if (dateString.length === 7) return dateString;
    return new Date(dateString).toISOString().split('T')[0];
};

const addDays = (date: string, days: number): string => {
    if (!date) return '';
    const d = new Date(date);
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().split('T')[0];
};

const addMonths = (date: string, months: number): string => {
    if (!date || !months || months <= 0) return '';
    const d = new Date(date);
    d.setUTCMonth(d.getUTCMonth() + months);
    return d.toISOString().split('T')[0];
};

const formatCurrency = (value: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);

const formatMonthYear = (monthYearString?: string): string => {
    if (!monthYearString || monthYearString.length !== 7) return 'N/A';
    const [year, month] = monthYearString.split('-');
    // Create date as UTC to avoid timezone issues with toLocaleDateString.
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, 15));
    const formatted = date.toLocaleDateString('es-CL', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    // Capitalize first letter for consistency.
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};


// --- ProjectForm Component ---
interface ProjectFormProps {
    onClose: () => void;
    onSave: (project: Project) => void;
    projectToEdit: Project | null;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onClose, onSave, projectToEdit }) => {
    const initialFormState: Omit<Project, 'id' | 'createdAt'> = {
        code: '',
        executorName: '',
        startDate: '',
        durationInMonths: 0,
        endDate: '',
        contractEndDate: '',
        amount: 0,
        ufValue: 0,
        complianceGuaranteeAmountUF: 0,
        complianceGuaranteeDueDate: '',
        complianceGuaranteeActualDueDate: '',
        advanceGuaranteeAmountUF: 0,
        advanceGuaranteeEndDate: '',
        advanceGuaranteeActualDueDate: '',
        isFosisLaw: false,
        disbursements: [],
        renditions: [],
        supervisedUsers: [],
    };
    
    const [project, setProject] = useState(initialFormState);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (projectToEdit) {
            const projectData = {
                ...initialFormState,
                ...projectToEdit,
                disbursements: projectToEdit.disbursements?.map(d => ({...d, date: formatDateForInput(d.date)})) || [],
                renditions: projectToEdit.renditions?.map(r => ({...r, monthYear: formatDateForInput(r.monthYear)})) || [],
                supervisedUsers: projectToEdit.supervisedUsers?.map(u => ({...u, supervisionDate: formatDateForInput(u.supervisionDate)})) || [],
            };
            setProject({
                ...projectData,
                startDate: formatDateForInput(projectData.startDate),
                endDate: formatDateForInput(projectData.endDate),
                contractEndDate: formatDateForInput(projectData.contractEndDate),
                complianceGuaranteeDueDate: formatDateForInput(projectData.complianceGuaranteeDueDate),
                complianceGuaranteeActualDueDate: formatDateForInput(projectData.complianceGuaranteeActualDueDate),
                advanceGuaranteeEndDate: formatDateForInput(projectData.advanceGuaranteeEndDate),
                advanceGuaranteeActualDueDate: formatDateForInput(projectData.advanceGuaranteeActualDueDate),
            });
        } else {
            setProject(initialFormState);
        }
    }, [projectToEdit]);

    // Calculate endDate from startDate and duration
    useEffect(() => {
        if (project.startDate && project.durationInMonths > 0) {
            setProject(p => ({ ...p, endDate: addMonths(p.startDate, p.durationInMonths) }));
        } else {
            setProject(p => ({ ...p, endDate: '' }));
        }
    }, [project.startDate, project.durationInMonths]);

    // Calculate other dates based on endDate
    useEffect(() => {
        if (project.endDate) {
            setProject(p => ({
                ...p,
                contractEndDate: addDays(p.endDate, 90),
                complianceGuaranteeDueDate: addDays(p.endDate, 90),
                advanceGuaranteeEndDate: addDays(p.endDate, 60),
            }));
        } else {
            setProject(p => ({ 
                ...p, 
                contractEndDate: '',
                complianceGuaranteeDueDate: '',
                advanceGuaranteeEndDate: ''
            }));
        }
    }, [project.endDate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const isChecked = (e.target as HTMLInputElement).checked;
            setProject({ ...project, [name]: isChecked });
            if(isChecked){
                setProject(p => ({...p, advanceGuaranteeAmountUF: 0, advanceGuaranteeEndDate: '', advanceGuaranteeActualDueDate: ''}))
            }
        } else {
            setProject({ ...project, [name]: type === 'number' ? parseFloat(value) || 0 : value });
        }
    };
    
    // --- Handlers for dynamic lists ---
    const handleListChange = (listName: 'disbursements' | 'renditions' | 'supervisedUsers', index: number, field: keyof Disbursement | keyof Rendition | keyof SupervisedUser, value: string | number) => {
        setProject(prev => {
            const list = prev[listName] as (Disbursement[] | Rendition[] | SupervisedUser[]);
            const newList = [...list];
            const item = newList[index] as any;
            item[field] = value;
            return { ...prev, [listName]: newList };
        });
    };

    const addListItem = (listName: 'disbursements' | 'renditions' | 'supervisedUsers') => {
        if (listName === 'disbursements' && project.disbursements.length >= 3) return;

        setProject(prev => {
            if (listName === 'supervisedUsers') {
                const newItem: SupervisedUser = { id: new Date().toISOString(), supervisionDate: '', name: '', commune: '', observation: '' };
                return { ...prev, supervisedUsers: [...prev.supervisedUsers, newItem] };
            }
            if (listName === 'disbursements') {
                const newItem: Disbursement = { id: new Date().toISOString(), date: '', amount: 0 };
                return { ...prev, disbursements: [...prev.disbursements, newItem] };
            }
            // Must be renditions
            const newItem: Rendition = { id: new Date().toISOString(), monthYear: '', approvedAmount: 0 };
            return { ...prev, renditions: [...prev.renditions, newItem] };
        });
    };

    const removeListItem = (listName: 'disbursements' | 'renditions' | 'supervisedUsers', index: number) => {
        setProject(prev => ({
            ...prev,
            [listName]: (prev[listName] as any[]).filter((_, i) => i !== index)
        }));
    };
    
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!project.code.match(/^\d{2}-\d{6}-\d{5}-\d{2}$/)) {
            newErrors.code = "El código debe tener el formato XX-XXXXXX-XXXXX-XX";
        }
        if (!project.executorName) newErrors.executorName = "El nombre del ejecutor es requerido";
        if (!project.startDate) newErrors.startDate = "La fecha de inicio es requerida";
        if (project.durationInMonths <= 0) newErrors.durationInMonths = "La duración debe ser de al menos 1 mes";
        if (project.amount <= 0) newErrors.amount = "El monto debe ser mayor a cero";
        if (project.ufValue <= 0) newErrors.ufValue = "El valor de la UF es requerido";
        if (project.complianceGuaranteeAmountUF <= 0) newErrors.complianceGuaranteeAmountUF = "El monto de la garantía (UF) es requerido";
        if (!project.complianceGuaranteeActualDueDate) newErrors.complianceGuaranteeActualDueDate = "La fecha de vencimiento real es requerida";

        if (!project.isFosisLaw && (project.advanceGuaranteeAmountUF || 0) > 0 && !project.advanceGuaranteeActualDueDate) {
            newErrors.advanceGuaranteeActualDueDate = "La fecha de vencimiento real es requerida si hay monto de anticipo";
        }
        
        const totalDisbursed = project.disbursements.reduce((sum, d) => sum + d.amount, 0);
        if (totalDisbursed > project.amount) {
            newErrors.disbursements = `El total desembolsado (${formatCurrency(totalDisbursed)}) no puede exceder el monto total del proyecto (${formatCurrency(project.amount)}).`
        }

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
            disbursements: project.disbursements.filter(d => d.amount > 0 && d.date),
            renditions: project.renditions.filter(r => r.approvedAmount > 0 && r.monthYear),
            supervisedUsers: project.supervisedUsers.filter(u => u.name.trim() !== '' && u.supervisionDate),
        };
        onSave(finalProject);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-2xl font-bold text-fosis-blue-dark">{projectToEdit ? 'Editar' : 'Nuevo'} Proyecto</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XCircleIcon className="w-8 h-8"/>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {/* Column 1 */}
                        <div className="md:col-span-2"><h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-2">Información General</h3></div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Código del Proyecto</label>
                            <input type="text" name="code" value={project.code} onChange={handleChange} placeholder="XX-XXXXXX-XXXXX-XX" className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.code ? 'border-red-500' : 'border-gray-300'}`} required />
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
                            <label className="block text-sm font-medium text-gray-700">Duración (meses)</label>
                            <input type="number" name="durationInMonths" value={project.durationInMonths || ''} onChange={handleChange} min="1" className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.durationInMonths ? 'border-red-500' : 'border-gray-300'}`} required />
                             {errors.durationInMonths && <p className="text-red-500 text-xs mt-1">{errors.durationInMonths}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha Término</label>
                            <input type="date" name="endDate" value={project.endDate} disabled className="mt-1 block w-full border rounded-md shadow-sm p-2 bg-gray-100" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha Término Contrato</label>
                            <input type="date" name="contractEndDate" value={project.contractEndDate} disabled className="mt-1 block w-full border rounded-md shadow-sm p-2 bg-gray-100" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Monto Total Proyecto (CLP)</label>
                            <input type="number" name="amount" value={project.amount || ''} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.amount ? 'border-red-500' : 'border-gray-300'}`} required />
                            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                        </div>

                        {/* Guarantees Section */}
                        <div className="md:col-span-2 pt-4 mt-2"><h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-2">Garantías</h3></div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Valor UF del día</label>
                            <input type="number" step="0.01" name="ufValue" value={project.ufValue || ''} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.ufValue ? 'border-red-500' : 'border-gray-300'}`} required />
                            {errors.ufValue && <p className="text-red-500 text-xs mt-1">{errors.ufValue}</p>}
                        </div>
                        <div />

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Monto G. Fiel Cumplimiento (UF)</label>
                            <input type="number" step="0.01" name="complianceGuaranteeAmountUF" value={project.complianceGuaranteeAmountUF || ''} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.complianceGuaranteeAmountUF ? 'border-red-500' : 'border-gray-300'}`} required />
                            {project.ufValue > 0 && project.complianceGuaranteeAmountUF > 0 && <p className="text-sm text-gray-500 mt-1">CLP: {formatCurrency(project.ufValue * project.complianceGuaranteeAmountUF)}</p>}
                            {errors.complianceGuaranteeAmountUF && <p className="text-red-500 text-xs mt-1">{errors.complianceGuaranteeAmountUF}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Vencimiento Sugerido G. F. C.</label>
                            <input type="date" name="complianceGuaranteeDueDate" value={project.complianceGuaranteeDueDate} disabled className="mt-1 block w-full border rounded-md shadow-sm p-2 bg-gray-100" />
                        </div>
                         <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Vencimiento REAL G. Fiel Cumplimiento</label>
                            <input type="date" name="complianceGuaranteeActualDueDate" value={project.complianceGuaranteeActualDueDate} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.complianceGuaranteeActualDueDate ? 'border-red-500' : 'border-gray-300'}`} required />
                            {errors.complianceGuaranteeActualDueDate && <p className="text-red-500 text-xs mt-1">{errors.complianceGuaranteeActualDueDate}</p>}
                        </div>

                        <div className="md:col-span-2 flex items-center gap-4 pt-4 mt-2">
                             <label className="block text-sm font-medium text-gray-700">Aplica Ley FOSIS (reemplaza garantía anticipo)</label>
                             <input type="checkbox" name="isFosisLaw" checked={project.isFosisLaw} onChange={handleChange} className="h-5 w-5 text-fosis-blue rounded focus:ring-fosis-blue-light" />
                        </div>
                        {!project.isFosisLaw && (
                           <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Monto G. Anticipo (UF)</label>
                                <input type="number" step="0.01" name="advanceGuaranteeAmountUF" value={project.advanceGuaranteeAmountUF || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                {project.ufValue > 0 && (project.advanceGuaranteeAmountUF || 0) > 0 && <p className="text-sm text-gray-500 mt-1">CLP: {formatCurrency(project.ufValue * (project.advanceGuaranteeAmountUF || 0))}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Vencimiento Sugerido G. Anticipo</label>
                                <input type="date" name="advanceGuaranteeEndDate" value={project.advanceGuaranteeEndDate} disabled className="mt-1 block w-full border rounded-md shadow-sm p-2 bg-gray-100" />
                            </div>
                             <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Vencimiento REAL G. Anticipo</label>
                                <input type="date" name="advanceGuaranteeActualDueDate" value={project.advanceGuaranteeActualDueDate || ''} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.advanceGuaranteeActualDueDate ? 'border-red-500' : 'border-gray-300'}`} />
                                {errors.advanceGuaranteeActualDueDate && <p className="text-red-500 text-xs mt-1">{errors.advanceGuaranteeActualDueDate}</p>}
                            </div>
                           </>
                        )}
                        
                        {/* Financials Section */}
                        <div className="md:col-span-2 pt-4 mt-2"><h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-2">Gestión Financiera</h3></div>
                        
                        {/* Disbursements */}
                        <div className="md:col-span-2">
                            <h4 className="font-semibold text-gray-700">Desembolsos</h4>
                            {project.disbursements.map((d, i) => (
                                <div key={d.id} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center mt-2 p-2 border rounded-md">
                                    <input type="date" value={d.date} onChange={e => handleListChange('disbursements', i, 'date', e.target.value)} className="w-full border rounded-md shadow-sm p-2 border-gray-300" />
                                    <input type="number" placeholder="Monto CLP" value={d.amount || ''} onChange={e => handleListChange('disbursements', i, 'amount', parseFloat(e.target.value) || 0)} className="w-full border rounded-md shadow-sm p-2 border-gray-300" />
                                    <button type="button" onClick={() => removeListItem('disbursements', i)} className="text-red-500 hover:text-red-700 justify-self-end"><TrashIcon className="w-5 h-5"/></button>
                                </div>
                            ))}
                             {project.disbursements.length < 3 && <button type="button" onClick={() => addListItem('disbursements')} className="mt-2 text-sm text-fosis-blue hover:underline">+ Agregar Desembolso (Máx 3)</button>}
                             {errors.disbursements && <p className="text-red-500 text-xs mt-1">{errors.disbursements}</p>}
                        </div>

                        {/* Renditions */}
                        <div className="md:col-span-2">
                            <h4 className="font-semibold text-gray-700 mt-4">Rendiciones Aprobadas</h4>
                             {project.renditions.map((r, i) => (
                                <div key={r.id} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center mt-2 p-2 border rounded-md">
                                    <input type="month" placeholder="Mes/Año" value={r.monthYear} onChange={e => handleListChange('renditions', i, 'monthYear', e.target.value)} className="w-full border rounded-md shadow-sm p-2 border-gray-300" />
                                    <input type="number" placeholder="Monto Aprobado CLP" value={r.approvedAmount || ''} onChange={e => handleListChange('renditions', i, 'approvedAmount', parseFloat(e.target.value) || 0)} className="w-full border rounded-md shadow-sm p-2 border-gray-300" />
                                    <button type="button" onClick={() => removeListItem('renditions', i)} className="text-red-500 hover:text-red-700 justify-self-end"><TrashIcon className="w-5 h-5"/></button>
                                </div>
                            ))}
                            <button type="button" onClick={() => addListItem('renditions')} className="mt-2 text-sm text-fosis-blue hover:underline">+ Agregar Rendición</button>
                        </div>
                        
                        {/* Supervised Users Section */}
                        <div className="md:col-span-2 pt-4 mt-2"><h3 className="text-lg font-semibold text-gray-800 mb-2 border-b pb-2">Personas Usuarias Supervisadas</h3></div>
                        <div className="md:col-span-2 space-y-3">
                           {project.supervisedUsers.map((user, i) => (
                               <div key={user.id} className="p-3 border rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                                    <button type="button" onClick={() => removeListItem('supervisedUsers', i)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button>
                                   <div>
                                       <label className="block text-sm font-medium text-gray-700">Fecha Supervisión</label>
                                       <input type="date" value={user.supervisionDate} onChange={e => handleListChange('supervisedUsers', i, 'supervisionDate', e.target.value)} className="mt-1 block w-full border rounded-md shadow-sm p-2 border-gray-300"/>
                                   </div>
                                    <div>
                                       <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                                       <input type="text" placeholder="Nombre de la persona" value={user.name} onChange={e => handleListChange('supervisedUsers', i, 'name', e.target.value)} className="mt-1 block w-full border rounded-md shadow-sm p-2 border-gray-300"/>
                                   </div>
                                    <div>
                                       <label className="block text-sm font-medium text-gray-700">Comuna</label>
                                       <input type="text" placeholder="Comuna" value={user.commune} onChange={e => handleListChange('supervisedUsers', i, 'commune', e.target.value)} className="mt-1 block w-full border rounded-md shadow-sm p-2 border-gray-300"/>
                                   </div>
                                    <div className="sm:col-span-2">
                                       <label className="block text-sm font-medium text-gray-700">Observación</label>
                                       <textarea value={user.observation} onChange={e => handleListChange('supervisedUsers', i, 'observation', e.target.value)} rows={2} className="mt-1 block w-full border rounded-md shadow-sm p-2 border-gray-300"></textarea>
                                   </div>
                               </div>
                           ))}
                           <button type="button" onClick={() => addListItem('supervisedUsers')} className="mt-2 text-sm text-fosis-blue hover:underline">+ Agregar Persona</button>
                        </div>
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
    const formatDate = (dateString?: string) => dateString ? new Date(dateString).toLocaleDateString('es-CL', {timeZone: 'UTC'}) : 'N/A';

    const getDateStatusClass = (actualDateStr?: string, suggestedDateStr?: string): string => {
        if (!actualDateStr || !suggestedDateStr) return 'text-gray-600';
        const actualDate = new Date(actualDateStr);
        const suggestedDate = new Date(suggestedDateStr);
        actualDate.setUTCHours(0,0,0,0);
        suggestedDate.setUTCHours(0,0,0,0);

        if (actualDate > suggestedDate) return 'text-red-600 font-bold';
        return 'text-green-600';
    };
    
    // Financial calculations
    const totalDisbursed = project.disbursements?.reduce((sum, d) => sum + d.amount, 0) || 0;
    const totalRendered = project.renditions?.reduce((sum, r) => sum + r.approvedAmount, 0) || 0;
    const balance = totalDisbursed - totalRendered;
    const percentageRendered = totalDisbursed > 0 ? (totalRendered / totalDisbursed) * 100 : 0;
    const sortedRenditions = [...(project.renditions || [])].sort((a, b) => (a.monthYear || '').localeCompare(b.monthYear || ''));


    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="uppercase tracking-wide text-sm text-fosis-blue font-semibold">{project.code}</div>
                        <p className="block mt-1 text-lg leading-tight font-bold text-black">{project.executorName}</p>
                        <div className="mt-2"><strong>Monto Total:</strong> {formatCurrency(project.amount)}</div>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={() => onEdit(project)} className="text-gray-500 hover:text-fosis-blue-dark"><EditIcon className="w-5 h-5"/></button>
                        <button onClick={() => onDelete(project.id)} className="text-gray-500 hover:text-red-600"><TrashIcon className="w-5 h-5"/></button>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
                    <div><strong>Inicio:</strong> {formatDate(project.startDate)}</div>
                    <div><strong>Término:</strong> {formatDate(project.endDate)}</div>
                    <div><strong>Duración:</strong> {project.durationInMonths} meses</div>
                    <div><strong>Término Contrato:</strong> {formatDate(project.contractEndDate)}</div>
                </div>
            </div>

            {/* Financials Section */}
            <div className="p-6 border-t">
                <h4 className="font-bold text-md text-gray-800 mb-3">Resumen Financiero</h4>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span>Total Desembolsado:</span> <span className="font-semibold">{formatCurrency(totalDisbursed)}</span></div>
                    <div className="flex justify-between"><span>Total Rendido Aprobado:</span> <span className="font-semibold text-fosis-green-dark">{formatCurrency(totalRendered)}</span></div>
                    <div className="flex justify-between border-t pt-2 mt-2"><strong>Saldo por Rendir:</strong> <strong className="text-red-600">{formatCurrency(balance)}</strong></div>
                    
                    <div className="pt-2">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-fosis-blue-dark">% Rendido</span>
                        <span className="font-medium text-fosis-blue-dark">{percentageRendered.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-fosis-blue h-2.5 rounded-full" style={{ width: `${percentageRendered > 100 ? 100 : percentageRendered}%` }}></div>
                      </div>
                    </div>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                    <h4 className="font-bold text-md text-gray-800 mb-3">Historial de Rendiciones Aprobadas</h4>
                    {(sortedRenditions && sortedRenditions.length > 0) ? (
                        <div className="space-y-2 text-sm max-h-40 overflow-y-auto pr-2">
                            {sortedRenditions.map(rendition => (
                                <div key={rendition.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <span className="text-gray-700 capitalize">{formatMonthYear(rendition.monthYear)}</span>
                                    <span className="font-semibold text-fosis-green-dark">{formatCurrency(rendition.approvedAmount)}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No hay rendiciones aprobadas registradas.</p>
                    )}
                </div>
            </div>
            
            {/* Guarantees Section */}
            <div className="p-6 border-t bg-gray-50">
                 <h4 className="font-bold text-md text-gray-800 mb-3">Garantías</h4>
                 <div className="space-y-4 text-sm">
                     <div>
                        <p className="font-semibold text-fosis-blue-dark">Fiel Cumplimiento</p>
                        <div className="flex justify-between"><span>Monto UF:</span> <span>{project.complianceGuaranteeAmountUF.toLocaleString('es-CL')}</span></div>
                        <div className={`flex justify-between ${getDateStatusClass(project.complianceGuaranteeActualDueDate, project.complianceGuaranteeDueDate)}`}><span>Vencimiento Real:</span> <span>{formatDate(project.complianceGuaranteeActualDueDate)}</span></div>
                        <div className="text-xs text-gray-500"><span>(Sugerido: {formatDate(project.complianceGuaranteeDueDate)})</span></div>
                     </div>
                     <div>
                        {project.isFosisLaw ? (
                            <p className="text-fosis-green-dark font-medium">Aplica Ley FOSIS para anticipo.</p>
                        ) : (project.advanceGuaranteeAmountUF && project.advanceGuaranteeAmountUF > 0) ? (
                            <>
                               <p className="font-semibold text-fosis-blue-dark">Anticipo</p>
                               <div className="flex justify-between"><span>Monto UF:</span> <span>{(project.advanceGuaranteeAmountUF || 0).toLocaleString('es-CL')}</span></div>
                               {project.advanceGuaranteeActualDueDate && <div className={`flex justify-between ${getDateStatusClass(project.advanceGuaranteeActualDueDate, project.advanceGuaranteeEndDate)}`}><span>Vencimiento Real:</span> <span>{formatDate(project.advanceGuaranteeActualDueDate)}</span></div>}
                               {project.advanceGuaranteeEndDate && <div className="text-xs text-gray-500"><span>(Sugerido: {formatDate(project.advanceGuaranteeEndDate)})</span></div>}
                            </>
                        ) : <p className="text-gray-500">Sin garantía de anticipo.</p>}
                     </div>
                 </div>
            </div>

            {/* Supervised Users Section */}
             <div className="p-6 border-t mt-auto rounded-b-xl">
                <h4 className="font-bold text-md text-gray-800 mb-3">Personas Usuarias Supervisadas</h4>
                {(project.supervisedUsers && project.supervisedUsers.length > 0) ? (
                    <div className="space-y-3 text-sm max-h-48 overflow-y-auto pr-2">
                        {project.supervisedUsers.map(user => (
                            <div key={user.id} className="p-2 bg-gray-100 rounded">
                                <p><strong>{user.name}</strong> ({user.commune})</p>
                                <p className="text-xs text-gray-500">Supervisado: {formatDate(user.supervisionDate)}</p>
                                {user.observation && <p className="text-xs mt-1 italic">"{user.observation}"</p>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No hay personas usuarias registradas.</p>
                )}
            </div>
        </div>
    );
};

// --- ProjectsView (Main) Component ---
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
        const endDateMatch = !dateFilters.end || project.endDate <= dateFilters.end;

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
