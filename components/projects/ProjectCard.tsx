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
        <div className="border-t border-slate-200/80 dark:border-slate-700/80">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 text-left hover:bg-slate-500/5 transition-colors focus:outline-none focus-visible:bg-slate-500/10">
                <h4 className="font-bold text-md text-fosis-blue-900 dark:text-fosis-blue-300">{title}</h4>
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

interface ProjectCardProps {
    project: Project;
    onEdit: (project: Project) => void;
    onDelete: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = React.memo(({ project, onEdit, onDelete }) => {
    
    const getDateStatusInfo = (actualDateStr?: string, suggestedDateStr?: string): { className: string, dotClassName: string} => {
        if (!actualDateStr) return { className: 'text-slate-600 dark:text-slate-400', dotClassName: 'bg-slate-400'};
        
        const today = new Date();
        today.setUTCHours(0,0,0,0);

        const thirtyDaysFromNow = new Date(today);
        thirtyDaysFromNow.setUTCDate(today.getUTCDate() + 30);
        
        const actualDate = new Date(actualDateStr);
        actualDate.setUTCHours(0,0,0,0);

        if (actualDate < today) return { className: 'text-red-600 dark:text-red-400 font-bold', dotClassName: 'bg-red-500' };
        if (actualDate <= thirtyDaysFromNow) return { className: 'text-yellow-600 dark:text-yellow-400 font-semibold', dotClassName: 'bg-yellow-500' };

        if(suggestedDateStr){
            const suggestedDate = new Date(suggestedDateStr);
            suggestedDate.setUTCHours(0,0,0,0);
            if (actualDate > suggestedDate) return { className: 'text-yellow-600 dark:text-yellow-400 font-semibold', dotClassName: 'bg-yellow-500' };
        }
        
        return { className: 'text-green-600 dark:text-green-400 font-semibold', dotClassName: 'bg-green-500' };
    };
    
    const totalDisbursed = project.disbursements?.reduce((sum, d) => sum + d.amount, 0) || 0;
    const totalRendered = project.renditions?.reduce((sum, r) => sum + r.approvedAmount, 0) || 0;
    const balance = totalDisbursed - totalRendered;
    const percentageRendered = totalDisbursed > 0 ? (totalRendered / totalDisbursed) * 100 : 0;
    const sortedRenditions = [...(project.renditions || [])].sort((a, b) => (a.monthYear || '').localeCompare(b.monthYear || ''));

    const projectDurationDays = project.startDate && project.endDate ? (new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 3600 * 24) : 0;
    const daysFromStart = project.startDate ? (new Date().getTime() - new Date(project.startDate).getTime()) / (1000 * 3600 * 24) : 0;
    const timeProgressPercentage = projectDurationDays > 0 ? Math.max(0, Math.min(100, (daysFromStart / projectDurationDays) * 100)) : 0;

    return (
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-soft-lg hover:shadow-soft-xl transition-all duration-300 flex flex-col border border-white/20 dark:border-slate-700/50 overflow-hidden hover:-translate-y-1">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="uppercase tracking-wide text-sm text-fosis-blue-800 dark:text-fosis-blue-300 font-semibold">{project.code}</div>
                        <p className="block mt-1 text-lg leading-tight font-bold text-slate-800 dark:text-slate-100">{project.executorName}</p>
                    </div>
                    <div className="flex space-x-1 flex-shrink-0 ml-4">
                        <button onClick={() => onEdit(project)} className="text-slate-500 dark:text-slate-400 hover:text-fosis-blue-900 dark:hover:text-fosis-blue-300 transition-colors p-2 rounded-full hover:bg-fosis-blue-500/10"><EditIcon className="w-5 h-5"/></button>
                        <button onClick={() => onDelete(project.id)} className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2 rounded-full hover:bg-red-500/10"><TrashIcon className="w-5 h-5"/></button>
                    </div>
                </div>

                <div className="mt-4 text-slate-700 dark:text-slate-300"><strong>Monto Total:</strong> {formatCurrency(project.amount)}</div>

                <div className="mt-4">
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Línea de Tiempo</div>
                    <div className="relative w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full" title={`Progreso del tiempo: ${timeProgressPercentage.toFixed(0)}%`}>
                        <div className="absolute h-2 bg-fosis-blue-800 dark:bg-fosis-blue-400 rounded-full" style={{ width: `${timeProgressPercentage}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span>{formatDate(project.startDate)}</span>
                        <span>{formatDate(project.endDate)}</span>
                    </div>
                </div>
                 <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between mb-1 text-sm">
                        <span className="font-medium text-fosis-blue-900 dark:text-fosis-blue-300">% Rendido</span>
                        <span className="font-medium text-fosis-blue-900 dark:text-fosis-blue-300">{percentageRendered.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3.5">
                        <div className="bg-gradient-to-r from-fosis-green-500 to-fosis-green-400 h-3.5 rounded-full transition-all duration-500" style={{ width: `${percentageRendered > 100 ? 100 : percentageRendered}%` }}></div>
                    </div>
                </div>
            </div>

            <AccordionSection title="Resumen Financiero">
                 <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                    <div className="flex justify-between"><span>Total Desembolsado:</span> <span className="font-semibold text-slate-800 dark:text-slate-100">{formatCurrency(totalDisbursed)}</span></div>
                    <div className="flex justify-between"><span>Total Rendido Aprobado:</span> <span className="font-semibold text-fosis-green-600 dark:text-fosis-green-400">{formatCurrency(totalRendered)}</span></div>
                    <div className="flex justify-between border-t pt-2 mt-2 border-slate-200 dark:border-slate-700"><strong>Saldo por Rendir:</strong> <strong className="text-red-600 dark:text-red-400">{formatCurrency(balance)}</strong></div>
                    
                    {(sortedRenditions && sortedRenditions.length > 0) && (
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <h5 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Historial de Rendiciones</h5>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                {sortedRenditions.map(rendition => (
                                    <div key={rendition.id} className="flex justify-between items-center p-2 bg-slate-500/5 rounded-md">
                                        <span className="capitalize">{formatMonthYear(rendition.monthYear)}</span>
                                        <span className="font-semibold text-fosis-green-600 dark:text-fosis-green-400">{formatCurrency(rendition.approvedAmount)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </AccordionSection>
            
            <AccordionSection title="Garantías">
                 <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`w-2.5 h-2.5 rounded-full ${getDateStatusInfo(project.complianceGuaranteeActualDueDate, project.complianceGuaranteeDueDate).dotClassName}`}></span>
                            <p className="font-semibold text-fosis-blue-900 dark:text-fosis-blue-300">Fiel Cumplimiento</p>
                        </div>
                        <div className="flex justify-between pl-5"><span>Monto UF:</span> <span>{project.complianceGuaranteeAmountUF.toLocaleString('es-CL')}</span></div>
                        <div className={`flex justify-between pl-5`}><span>Vencimiento Real:</span> <span className={getDateStatusInfo(project.complianceGuaranteeActualDueDate, project.complianceGuaranteeDueDate).className}>{formatDate(project.complianceGuaranteeActualDueDate)}</span></div>
                     </div>
                     <div>
                        {project.isFosisLaw ? (
                            <p className="text-fosis-green-600 dark:text-fosis-green-400 font-medium p-2 bg-fosis-green-500/10 rounded-md">Aplica Ley FOSIS para anticipo.</p>
                        ) : (project.advanceGuaranteeAmountUF && project.advanceGuaranteeAmountUF > 0) ? (
                            <>
                               <div className="flex items-center gap-2 mb-1">
                                    <span className={`w-2.5 h-2.5 rounded-full ${getDateStatusInfo(project.advanceGuaranteeActualDueDate, project.advanceGuaranteeEndDate).dotClassName}`}></span>
                                    <p className="font-semibold text-fosis-blue-900 dark:text-fosis-blue-300">Anticipo</p>
                                </div>
                               <div className="flex justify-between pl-5"><span>Monto UF:</span> <span>{(project.advanceGuaranteeAmountUF || 0).toLocaleString('es-CL')}</span></div>
                               {project.advanceGuaranteeActualDueDate && <div className={`flex justify-between pl-5`}><span>Vencimiento Real:</span> <span className={getDateStatusInfo(project.advanceGuaranteeActualDueDate, project.advanceGuaranteeEndDate).className}>{formatDate(project.advanceGuaranteeActualDueDate)}</span></div>}
                            </>
                        ) : <p className="text-slate-500 dark:text-slate-400">Sin garantía de anticipo.</p>}
                     </div>
                 </div>
            </AccordionSection>

            <AccordionSection title="Personas Usuarias Supervisadas">
                {(project.supervisedUsers && project.supervisedUsers.length > 0) ? (
                    <div className="space-y-3 text-sm max-h-48 overflow-y-auto pr-2">
                        {project.supervisedUsers.map(user => (
                            <div key={user.id} className="p-3 bg-slate-500/5 rounded-lg border border-slate-500/10">
                                <p className="font-semibold text-slate-800 dark:text-slate-100">{user.name} <span className="text-slate-500 dark:text-slate-400 font-normal">({user.commune})</span></p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Supervisado: {formatDate(user.supervisionDate)}</p>
                                {user.observation && <p className="text-xs mt-1 pt-1 border-t border-slate-200 dark:border-slate-700 italic text-slate-600 dark:text-slate-300">"{user.observation}"</p>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">No hay personas usuarias registradas.</p>
                )}
            </AccordionSection>
        </div>
    );
});

export default ProjectCard;