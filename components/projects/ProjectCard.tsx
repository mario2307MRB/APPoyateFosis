import React, { useState } from 'react';
import type { Project } from '../../types';
import { EditIcon, TrashIcon, ChevronRightIcon } from '../Icons';
import { formatCurrency, formatDate } from '../../constants';

const formatMonthYear = (monthYearString?: string): string => {
    if (!monthYearString || monthYearString.length !== 7) return 'N/A';
    const [year, month] = monthYearString.split('-');
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, 15));
    const formatted = date.toLocaleDateString('es-CL', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

const AccordionSection: React.FC<{ title: string; children: React.ReactNode }> = React.memo(({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-t border-slate-200">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 text-left hover:bg-slate-100/50 transition-colors">
                <h4 className="font-bold text-md text-fosis-blue-900">{title}</h4>
                <ChevronRightIcon className={`w-5 h-5 transition-transform text-slate-500 ${isOpen ? 'rotate-90' : ''}`} />
            </button>
            <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <div className="p-4 pt-0">{children}</div>
                </div>
            </div>
        </div>
    )
});

// Fix: Defined the ProjectCardProps interface to resolve the "Cannot find name" error.
interface ProjectCardProps {
    project: Project;
    onEdit: (project: Project) => void;
    onDelete: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = React.memo(({ project, onEdit, onDelete }) => {
    
    const getDateStatusClass = (actualDateStr?: string, suggestedDateStr?: string): string => {
        if (!actualDateStr || !suggestedDateStr) return 'text-slate-600';
        const actualDate = new Date(actualDateStr);
        const suggestedDate = new Date(suggestedDateStr);
        actualDate.setUTCHours(0,0,0,0);
        suggestedDate.setUTCHours(0,0,0,0);

        if (actualDate > suggestedDate) return 'text-red-600 font-bold';
        return 'text-green-600 font-semibold';
    };
    
    const totalDisbursed = project.disbursements?.reduce((sum, d) => sum + d.amount, 0) || 0;
    const totalRendered = project.renditions?.reduce((sum, r) => sum + r.approvedAmount, 0) || 0;
    const balance = totalDisbursed - totalRendered;
    const percentageRendered = totalDisbursed > 0 ? (totalRendered / totalDisbursed) * 100 : 0;
    const sortedRenditions = [...(project.renditions || [])].sort((a, b) => (a.monthYear || '').localeCompare(b.monthYear || ''));

    return (
        <div className="bg-white rounded-2xl shadow-soft-lg hover:shadow-soft-xl transition-shadow duration-300 flex flex-col border border-slate-200 overflow-hidden">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="uppercase tracking-wide text-sm text-fosis-blue-800 font-semibold">{project.code}</div>
                        <p className="block mt-1 text-lg leading-tight font-bold text-slate-800">{project.executorName}</p>
                    </div>
                    <div className="flex space-x-1 flex-shrink-0 ml-4">
                        <button onClick={() => onEdit(project)} className="text-slate-500 hover:text-fosis-blue-900 transition-colors p-2 rounded-full hover:bg-fosis-blue-100"><EditIcon className="w-5 h-5"/></button>
                        <button onClick={() => onDelete(project.id)} className="text-slate-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-100"><TrashIcon className="w-5 h-5"/></button>
                    </div>
                </div>

                <div className="mt-4"><strong>Monto Total:</strong> {formatCurrency(project.amount)}</div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-600">
                    <div><strong>Inicio:</strong> {formatDate(project.startDate)}</div>
                    <div><strong>Término:</strong> {formatDate(project.endDate)}</div>
                </div>
                 <div className="pt-4 mt-4 border-t border-slate-200">
                    <div className="flex justify-between mb-1 text-sm">
                        <span className="font-medium text-fosis-blue-900">% Rendido</span>
                        <span className="font-medium text-fosis-blue-900">{percentageRendered.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3.5">
                        <div className="bg-gradient-to-r from-fosis-green-500 to-fosis-green-400 h-3.5 rounded-full transition-all duration-500" style={{ width: `${percentageRendered > 100 ? 100 : percentageRendered}%` }}></div>
                    </div>
                </div>
            </div>

            <AccordionSection title="Resumen Financiero">
                 <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span>Total Desembolsado:</span> <span className="font-semibold">{formatCurrency(totalDisbursed)}</span></div>
                    <div className="flex justify-between"><span>Total Rendido Aprobado:</span> <span className="font-semibold text-fosis-green-600">{formatCurrency(totalRendered)}</span></div>
                    <div className="flex justify-between border-t pt-2 mt-2 border-slate-200"><strong>Saldo por Rendir:</strong> <strong className="text-red-600">{formatCurrency(balance)}</strong></div>
                    
                    {(sortedRenditions && sortedRenditions.length > 0) ? (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                            <h5 className="font-semibold text-slate-700 mb-2">Historial de Rendiciones</h5>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                {sortedRenditions.map(rendition => (
                                    <div key={rendition.id} className="flex justify-between items-center p-2 bg-slate-100 rounded-md">
                                        <span className="text-slate-700 capitalize">{formatMonthYear(rendition.monthYear)}</span>
                                        <span className="font-semibold text-fosis-green-600">{formatCurrency(rendition.approvedAmount)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 mt-2">No hay rendiciones aprobadas registradas.</p>
                    )}
                </div>
            </AccordionSection>
            
            <AccordionSection title="Garantías">
                 <div className="space-y-4 text-sm">
                     <div>
                        <p className="font-semibold text-fosis-blue-900">Fiel Cumplimiento</p>
                        <div className="flex justify-between"><span>Monto UF:</span> <span>{project.complianceGuaranteeAmountUF.toLocaleString('es-CL')}</span></div>
                        <div className={`flex justify-between`}><span>Vencimiento Real:</span> <span className={getDateStatusClass(project.complianceGuaranteeActualDueDate, project.complianceGuaranteeDueDate)}>{formatDate(project.complianceGuaranteeActualDueDate)}</span></div>
                        <div className="text-xs text-slate-500 text-right"><span>(Sugerido: {formatDate(project.complianceGuaranteeDueDate)})</span></div>
                     </div>
                     <div>
                        {project.isFosisLaw ? (
                            <p className="text-fosis-green-600 font-medium p-2 bg-fosis-green-50 rounded-md">Aplica Ley FOSIS para anticipo.</p>
                        ) : (project.advanceGuaranteeAmountUF && project.advanceGuaranteeAmountUF > 0) ? (
                            <>
                               <p className="font-semibold text-fosis-blue-900">Anticipo</p>
                               <div className="flex justify-between"><span>Monto UF:</span> <span>{(project.advanceGuaranteeAmountUF || 0).toLocaleString('es-CL')}</span></div>
                               {project.advanceGuaranteeActualDueDate && <div className={`flex justify-between`}><span>Vencimiento Real:</span> <span className={getDateStatusClass(project.advanceGuaranteeActualDueDate, project.advanceGuaranteeEndDate)}>{formatDate(project.advanceGuaranteeActualDueDate)}</span></div>}
                               {project.advanceGuaranteeEndDate && <div className="text-xs text-slate-500 text-right"><span>(Sugerido: {formatDate(project.advanceGuaranteeEndDate)})</span></div>}
                            </>
                        ) : <p className="text-slate-500">Sin garantía de anticipo.</p>}
                     </div>
                 </div>
            </AccordionSection>

            <AccordionSection title="Personas Usuarias Supervisadas">
                {(project.supervisedUsers && project.supervisedUsers.length > 0) ? (
                    <div className="space-y-3 text-sm max-h-48 overflow-y-auto pr-2">
                        {project.supervisedUsers.map(user => (
                            <div key={user.id} className="p-3 bg-slate-100 rounded-lg border border-slate-200">
                                <p className="font-semibold text-slate-800">{user.name} <span className="text-slate-500 font-normal">({user.commune})</span></p>
                                <p className="text-xs text-slate-500">Supervisado: {formatDate(user.supervisionDate)}</p>
                                {user.observation && <p className="text-xs mt-1 pt-1 border-t border-slate-200 italic text-slate-600">"{user.observation}"</p>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500">No hay personas usuarias registradas.</p>
                )}
            </AccordionSection>
        </div>
    );
});

export default ProjectCard;