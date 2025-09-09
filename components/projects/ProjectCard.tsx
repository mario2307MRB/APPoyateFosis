import React from 'react';
import type { Project } from '../../types';
import { EditIcon, TrashIcon } from '../Icons';

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


const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
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

export default ProjectCard;
