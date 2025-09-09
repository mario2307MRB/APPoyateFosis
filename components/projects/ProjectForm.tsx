
import React, { useState, useEffect } from 'react';
import type { Project, Disbursement, Rendition, SupervisedUser } from '../../types';
import { TrashIcon, XCircleIcon } from '../Icons';

// --- Helper Functions ---
const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    if (dateString.length === 7) return dateString; // Handles month (YYYY-MM)
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

// --- Component ---
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

    useEffect(() => {
        if (project.startDate && project.durationInMonths > 0) {
            setProject(p => ({ ...p, endDate: addMonths(p.startDate, p.durationInMonths) }));
        } else {
            setProject(p => ({ ...p, endDate: '' }));
        }
    }, [project.startDate, project.durationInMonths]);

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
    
    type ListName = 'disbursements' | 'renditions' | 'supervisedUsers';
    type ListItem = Disbursement | Rendition | SupervisedUser;

    interface ListMap {
        disbursements: Disbursement;
        renditions: Rendition;
        supervisedUsers: SupervisedUser;
    }

    const handleListChange = <K extends ListName, F extends keyof ListMap[K]>(listName: K, index: number, field: F, value: ListMap[K][F]) => {
        setProject(prev => {
            const list = prev[listName] as ListMap[K][];
            const newList = [...list];
            const item = { ...newList[index], [field]: value };
            newList[index] = item;
            return { ...prev, [listName]: newList };
        });
    };
    
    const addListItem = (listName: ListName) => {
        if (listName === 'disbursements' && project.disbursements.length >= 3) return;

        setProject(prev => {
            let newItem: ListItem;
            switch(listName) {
                case 'disbursements':
                    newItem = { id: crypto.randomUUID(), date: '', amount: 0 };
                    return { ...prev, disbursements: [...prev.disbursements, newItem] };
                case 'renditions':
                    newItem = { id: crypto.randomUUID(), monthYear: '', approvedAmount: 0 };
                    return { ...prev, renditions: [...prev.renditions, newItem] };
                case 'supervisedUsers':
                    newItem = { id: crypto.randomUUID(), supervisionDate: '', name: '', commune: '', observation: '' };
                     return { ...prev, supervisedUsers: [...prev.supervisedUsers, newItem] };
                default:
                    return prev;
            }
        });
    };

    const removeListItem = (listName: ListName, index: number) => {
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
            id: projectToEdit?.id || crypto.randomUUID(),
            createdAt: projectToEdit?.createdAt || new Date().toISOString(),
            ...project,
            disbursements: project.disbursements.filter(d => d.amount > 0 && d.date),
            renditions: project.renditions.filter(r => r.approvedAmount > 0 && r.monthYear),
            supervisedUsers: project.supervisedUsers.filter(u => u.name.trim() !== '' && u.supervisionDate),
        };
        onSave(finalProject);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-lg">
                    <h2 className="text-2xl font-bold text-fosis-blue-dark">{projectToEdit ? 'Editar' : 'Nuevo'} Proyecto</h2>
                    <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
                        <XCircleIcon className="w-8 h-8"/>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div className="md:col-span-2"><h3 className="text-lg font-semibold text-neutral-800 mb-2 border-b pb-2">Información General</h3></div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700">Código del Proyecto</label>
                            <input type="text" name="code" value={project.code} onChange={handleChange} placeholder="XX-XXXXXX-XXXXX-XX" className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.code ? 'border-red-500' : 'border-neutral-300'}`} required />
                            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700">Nombre Ejecutor</label>
                            <input type="text" name="executorName" value={project.executorName} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.executorName ? 'border-red-500' : 'border-neutral-300'}`} required />
                             {errors.executorName && <p className="text-red-500 text-xs mt-1">{errors.executorName}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700">Fecha Inicio</label>
                            <input type="date" name="startDate" value={project.startDate} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.startDate ? 'border-red-500' : 'border-neutral-300'}`} required />
                             {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-neutral-700">Duración (meses)</label>
                            <input type="number" name="durationInMonths" value={project.durationInMonths || ''} onChange={handleChange} min="1" className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.durationInMonths ? 'border-red-500' : 'border-neutral-300'}`} required />
                             {errors.durationInMonths && <p className="text-red-500 text-xs mt-1">{errors.durationInMonths}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700">Fecha Término</label>
                            <input type="date" name="endDate" value={project.endDate} disabled className="mt-1 block w-full border rounded-md shadow-sm p-2 bg-neutral-100" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700">Fecha Término Contrato</label>
                            <input type="date" name="contractEndDate" value={project.contractEndDate} disabled className="mt-1 block w-full border rounded-md shadow-sm p-2 bg-neutral-100" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-neutral-700">Monto Total Proyecto (CLP)</label>
                            <input type="number" name="amount" value={project.amount || ''} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.amount ? 'border-red-500' : 'border-neutral-300'}`} required />
                            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                        </div>

                        <div className="md:col-span-2 pt-4 mt-2"><h3 className="text-lg font-semibold text-neutral-800 mb-2 border-b pb-2">Garantías</h3></div>
                        
                        <div>
                            <label className="block text-sm font-medium text-neutral-700">Valor UF del día</label>
                            <input type="number" step="0.01" name="ufValue" value={project.ufValue || ''} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.ufValue ? 'border-red-500' : 'border-neutral-300'}`} required />
                            {errors.ufValue && <p className="text-red-500 text-xs mt-1">{errors.ufValue}</p>}
                        </div>
                        <div />

                        <div>
                            <label className="block text-sm font-medium text-neutral-700">Monto G. Fiel Cumplimiento (UF)</label>
                            <input type="number" step="0.01" name="complianceGuaranteeAmountUF" value={project.complianceGuaranteeAmountUF || ''} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.complianceGuaranteeAmountUF ? 'border-red-500' : 'border-neutral-300'}`} required />
                            {project.ufValue > 0 && project.complianceGuaranteeAmountUF > 0 && <p className="text-sm text-neutral-500 mt-1">CLP: {formatCurrency(project.ufValue * project.complianceGuaranteeAmountUF)}</p>}
                            {errors.complianceGuaranteeAmountUF && <p className="text-red-500 text-xs mt-1">{errors.complianceGuaranteeAmountUF}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700">Vencimiento Sugerido G. F. C.</label>
                            <input type="date" name="complianceGuaranteeDueDate" value={project.complianceGuaranteeDueDate} disabled className="mt-1 block w-full border rounded-md shadow-sm p-2 bg-neutral-100" />
                        </div>
                         <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-neutral-700">Vencimiento REAL G. Fiel Cumplimiento</label>
                            <input type="date" name="complianceGuaranteeActualDueDate" value={project.complianceGuaranteeActualDueDate} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.complianceGuaranteeActualDueDate ? 'border-red-500' : 'border-neutral-300'}`} required />
                            {errors.complianceGuaranteeActualDueDate && <p className="text-red-500 text-xs mt-1">{errors.complianceGuaranteeActualDueDate}</p>}
                        </div>

                        <div className="md:col-span-2 flex items-center gap-4 pt-4 mt-2">
                             <label className="block text-sm font-medium text-neutral-700">Aplica Ley FOSIS (reemplaza garantía anticipo)</label>
                             <input type="checkbox" name="isFosisLaw" checked={project.isFosisLaw} onChange={handleChange} className="h-5 w-5 text-fosis-blue rounded focus:ring-fosis-blue-light" />
                        </div>
                        {!project.isFosisLaw && (
                           <>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">Monto G. Anticipo (UF)</label>
                                <input type="number" step="0.01" name="advanceGuaranteeAmountUF" value={project.advanceGuaranteeAmountUF || ''} onChange={handleChange} className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm p-2" />
                                {project.ufValue > 0 && (project.advanceGuaranteeAmountUF || 0) > 0 && <p className="text-sm text-neutral-500 mt-1">CLP: {formatCurrency(project.ufValue * (project.advanceGuaranteeAmountUF || 0))}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">Vencimiento Sugerido G. Anticipo</label>
                                <input type="date" name="advanceGuaranteeEndDate" value={project.advanceGuaranteeEndDate} disabled className="mt-1 block w-full border rounded-md shadow-sm p-2 bg-neutral-100" />
                            </div>
                             <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-neutral-700">Vencimiento REAL G. Anticipo</label>
                                <input type="date" name="advanceGuaranteeActualDueDate" value={project.advanceGuaranteeActualDueDate || ''} onChange={handleChange} className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${errors.advanceGuaranteeActualDueDate ? 'border-red-500' : 'border-neutral-300'}`} />
                                {errors.advanceGuaranteeActualDueDate && <p className="text-red-500 text-xs mt-1">{errors.advanceGuaranteeActualDueDate}</p>}
                            </div>
                           </>
                        )}
                        
                        <div className="md:col-span-2 pt-4 mt-2"><h3 className="text-lg font-semibold text-neutral-800 mb-2 border-b pb-2">Gestión Financiera</h3></div>
                        
                        <div className="md:col-span-2">
                            <h4 className="font-semibold text-neutral-700">Desembolsos</h4>
                            {project.disbursements.map((d, i) => (
                                <div key={d.id} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center mt-2 p-2 border rounded-md">
                                    <input type="date" value={d.date} onChange={e => handleListChange('disbursements', i, 'date', e.target.value)} className="w-full border rounded-md shadow-sm p-2 border-neutral-300" />
                                    <input type="number" placeholder="Monto CLP" value={d.amount || ''} onChange={e => handleListChange('disbursements', i, 'amount', parseFloat(e.target.value) || 0)} className="w-full border rounded-md shadow-sm p-2 border-neutral-300" />
                                    <button type="button" onClick={() => removeListItem('disbursements', i)} className="text-red-500 hover:text-red-700 justify-self-end"><TrashIcon className="w-5 h-5"/></button>
                                </div>
                            ))}
                             {project.disbursements.length < 3 && <button type="button" onClick={() => addListItem('disbursements')} className="mt-2 text-sm text-fosis-blue hover:underline">+ Agregar Desembolso (Máx 3)</button>}
                             {errors.disbursements && <p className="text-red-500 text-xs mt-1">{errors.disbursements}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <h4 className="font-semibold text-neutral-700 mt-4">Rendiciones Aprobadas</h4>
                             {project.renditions.map((r, i) => (
                                <div key={r.id} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center mt-2 p-2 border rounded-md">
                                    <input type="month" placeholder="Mes/Año" value={r.monthYear} onChange={e => handleListChange('renditions', i, 'monthYear', e.target.value)} className="w-full border rounded-md shadow-sm p-2 border-neutral-300" />
                                    <input type="number" placeholder="Monto Aprobado CLP" value={r.approvedAmount || ''} onChange={e => handleListChange('renditions', i, 'approvedAmount', parseFloat(e.target.value) || 0)} className="w-full border rounded-md shadow-sm p-2 border-neutral-300" />
                                    <button type="button" onClick={() => removeListItem('renditions', i)} className="text-red-500 hover:text-red-700 justify-self-end"><TrashIcon className="w-5 h-5"/></button>
                                </div>
                            ))}
                            <button type="button" onClick={() => addListItem('renditions')} className="mt-2 text-sm text-fosis-blue hover:underline">+ Agregar Rendición</button>
                        </div>
                        
                        <div className="md:col-span-2 pt-4 mt-2"><h3 className="text-lg font-semibold text-neutral-800 mb-2 border-b pb-2">Personas Usuarias Supervisadas</h3></div>
                        <div className="md:col-span-2 space-y-3">
                           {project.supervisedUsers.map((user, i) => (
                               <div key={user.id} className="p-3 border rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-4 relative bg-neutral-50">
                                    <button type="button" onClick={() => removeListItem('supervisedUsers', i)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button>
                                   <div>
                                       <label className="block text-sm font-medium text-neutral-700">Fecha Supervisión</label>
                                       <input type="date" value={user.supervisionDate} onChange={e => handleListChange('supervisedUsers', i, 'supervisionDate', e.target.value)} className="mt-1 block w-full border rounded-md shadow-sm p-2 border-neutral-300"/>
                                   </div>
                                    <div>
                                       <label className="block text-sm font-medium text-neutral-700">Nombre Completo</label>
                                       <input type="text" placeholder="Nombre de la persona" value={user.name} onChange={e => handleListChange('supervisedUsers', i, 'name', e.target.value)} className="mt-1 block w-full border rounded-md shadow-sm p-2 border-neutral-300"/>
                                   </div>
                                    <div>
                                       <label className="block text-sm font-medium text-neutral-700">Comuna</label>
                                       <input type="text" placeholder="Comuna" value={user.commune} onChange={e => handleListChange('supervisedUsers', i, 'commune', e.target.value)} className="mt-1 block w-full border rounded-md shadow-sm p-2 border-neutral-300"/>
                                   </div>
                                    <div className="sm:col-span-2">
                                       <label className="block text-sm font-medium text-neutral-700">Observación</label>
                                       <textarea value={user.observation} onChange={e => handleListChange('supervisedUsers', i, 'observation', e.target.value)} rows={2} className="mt-1 block w-full border rounded-md shadow-sm p-2 border-neutral-300"></textarea>
                                   </div>
                               </div>
                           ))}
                           <button type="button" onClick={() => addListItem('supervisedUsers')} className="mt-2 text-sm text-fosis-blue hover:underline">+ Agregar Persona</button>
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-neutral-200 text-neutral-800 font-semibold rounded-lg hover:bg-neutral-300 transition-colors">Cancelar</button>
                        <button type="submit" className="px-6 py-2 bg-fosis-blue text-white font-semibold rounded-lg hover:bg-fosis-blue-dark shadow-md transition-all">Guardar Proyecto</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectForm;
