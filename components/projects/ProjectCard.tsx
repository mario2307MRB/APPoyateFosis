
import React, { useState } from 'react';
import type { Project } from '../../types';
import { EditIcon, TrashIcon, ChevronRightIcon } from '../Icons';

interface ProjectCardProps {
    project: Project;
    onEdit: (p: Project) => void;
    onDelete: (id: string) => void;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);

const formatMonthYear = (monthYearString?: string): string => {
    if (!monthYearString || monthYearString.length !== 7) return 'N/A';
    const [year, month] = monthYearString.split('-');
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, 15));
    const formatted = date.toLocaleDateString('es-CL', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

const AccordionSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-t">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 text-left">
                <h4 className="font-bold text-md text-neutral-800">{title}</h4>
                <ChevronRightIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </button>
            {isOpen && <div className="p-4 pt-0">{children}</div>}
        </div>
    )
};


const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        // The date from the form is already YYYY-MM-DD, which new Date() interprets as UTC.
        // Adding timeZone: 'UTC' ensures consistency regardless of browser implementation.
        return new Date(dateString).toLocaleDateString('es-CL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC'
        });
    };

    const getDateStatusClass = (actualDateStr?: string, suggestedDateStr?: string): string => {
        if (!actualDateStr || !suggestedDateStr) return 'text-neutral-600';
        const actualDate = new Date(actualDateStr);
        const suggestedDate = new Date(suggestedDateStr);
        actualDate.setUTCHours(0,0,0,0);
        suggestedDate.setUTCHours(0,0,0,0);

        if (actualDate > suggestedDate) return 'text-red-600 font-bold';
        return 'text-green-600';
    };
    
    const totalDisbursed = project.disbursements?.reduce((sum, d) => sum + d.amount, 0) || 0;
    const totalRendered = project.renditions?.reduce((sum, r) => sum + r.approvedAmount, 0) || 0;
    const balance = totalDisbursed - totalRendered;
    const percentageRendered = totalDisbursed > 0 ? (totalRendered / totalDisbursed) * 100 : 0;
    const sortedRenditions = [...(project.renditions || [])].sort((a, b) => (a.monthYear || '').localeCompare(b.monthYear || ''));

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col border">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="uppercase tracking-wide text-sm text-fosis-blue font-semibold">{project.code}</div>
                        <p className="block mt-1 text-lg leading-tight font-bold text-black">{project.executorName}</p>
                    </div>
                    <div className="flex space-x-2 flex-shrink-0 ml-4">
                        <button onClick={() => onEdit(project)} className="text-neutral-500 hover:text-fosis-blue-dark transition-colors p-1 rounded-full hover:bg-neutral-100"><EditIcon className="w-5 h-5"/></button>
                        <button onClick={() => onDelete(project.id)} className="text-neutral-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-neutral-100"><TrashIcon className="w-5 h-5"/></button>
                    </div>
                </div>

                <div className="mt-4"><strong>Monto Total:</strong> {formatCurrency(project.amount)}</div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-neutral-600">
                    <div><strong>Inicio:</strong> {formatDate(project.startDate)}</div>
                    <div><strong>Término:</strong> {formatDate(project.endDate)}</div>
                </div>
                 <div className="pt-4 mt-4 border-t">
                    <div className="flex justify-between mb-1 text-sm">
                        <span className="font-medium text-fosis-blue-dark">% Rendido</span>
                        <span className="font-medium text-fosis-blue-dark">{percentageRendered.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-3">
                        <div className="bg-fosis-green h-3 rounded-full transition-all duration-500" style={{ width: `${percentageRendered > 100 ? 100 : percentageRendered}%` }}></div>
                    </div>
                </div>
            </div>

            <AccordionSection title="Resumen Financiero">
                 <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span>Total Desembolsado:</span> <span className="font-semibold">{formatCurrency(totalDisbursed)}</span></div>
                    <div className="flex justify-between"><span>Total Rendido Aprobado:</span> <span className="font-semibold text-fosis-green-dark">{formatCurrency(totalRendered)}</span></div>
                    <div className="flex justify-between border-t pt-2 mt-2"><strong>Saldo por Rendir:</strong> <strong className="text-red-600">{formatCurrency(balance)}</strong></div>
                    
                    {(sortedRenditions && sortedRenditions.length > 0) ? (
                        <div className="mt-4 pt-4 border-t">
                            <h5 className="font-semibold text-neutral-700 mb-2">Historial de Rendiciones</h5>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                {sortedRenditions.map(rendition => (
                                    <div key={rendition.id} className="flex justify-between items-center p-2 bg-neutral-100 rounded">
                                        <span className="text-neutral-700 capitalize">{formatMonthYear(rendition.monthYear)}</span>
                                        <span className="font-semibold text-fosis-green-dark">{formatCurrency(rendition.approvedAmount)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-neutral-500 mt-2">No hay rendiciones aprobadas registradas.</p>
                    )}
                </div>
            </AccordionSection>
            
            <AccordionSection title="Garantías">
                 <div className="space-y-4 text-sm">
                     <div>
                        <p className="font-semibold text-fosis-blue-dark">Fiel Cumplimiento</p>
                        <div className="flex justify-between"><span>Monto UF:</span> <span>{project.complianceGuaranteeAmountUF.toLocaleString('es-CL')}</span></div>
                        <div className={`flex justify-between ${getDateStatusClass(project.complianceGuaranteeActualDueDate, project.complianceGuaranteeDueDate)}`}><span>Vencimiento Real:</span> <span>{formatDate(project.complianceGuaranteeActualDueDate)}</span></div>
                        <div className="text-xs text-neutral-500 text-right"><span>(Sugerido: {formatDate(project.complianceGuaranteeDueDate)})</span></div>
                     </div>
                     <div>
                        {project.isFosisLaw ? (
                            <p className="text-fosis-green-dark font-medium p-2 bg-green-50 rounded-md">Aplica Ley FOSIS para anticipo.</p>
                        ) : (project.advanceGuaranteeAmountUF && project.advanceGuaranteeAmountUF > 0) ? (
                            <>
                               <p className="font-semibold text-fosis-blue-dark">Anticipo</p>
                               <div className="flex justify-between"><span>Monto UF:</span> <span>{(project.advanceGuaranteeAmountUF || 0).toLocaleString('es-CL')}</span></div>
                               {project.advanceGuaranteeActualDueDate && <div className={`flex justify-between ${getDateStatusClass(project.advanceGuaranteeActualDueDate, project.advanceGuaranteeEndDate)}`}><span>Vencimiento Real:</span> <span>{formatDate(project.advanceGuaranteeActualDueDate)}</span></div>}
                               {project.advanceGuaranteeEndDate && <div className="text-xs text-neutral-500 text-right"><span>(Sugerido: {formatDate(project.advanceGuaranteeEndDate)})</span></div>}
                            </>
                        ) : <p className="text-neutral-500">Sin garantía de anticipo.</p>}
                     </div>
                 </div>
            </AccordionSection>

            <AccordionSection title="Personas Usuarias Supervisadas">
                {(project.supervisedUsers && project.supervisedUsers.length > 0) ? (
                    <div className="space-y-3 text-sm max-h-48 overflow-y-auto pr-2">
                        {project.supervisedUsers.map(user => (
                            <div key={user.id} className="p-3 bg-neutral-100 rounded-md border">
                                <p className="font-semibold text-neutral-800">{user.name} <span className="text-neutral-500 font-normal">({user.commune})</span></p>
                                <p className="text-xs text-neutral-500">Supervisado: {formatDate(user.supervisionDate)}</p>
                                {user.observation && <p className="text-xs mt-1 pt-1 border-t border-neutral-200 italic text-neutral-600">"{user.observation}"</p>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-neutral-500">No hay personas usuarias registradas.</p>
                )}
            </AccordionSection>
        </div>
    );
};

export default ProjectCard;
