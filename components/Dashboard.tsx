import React, { useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { Project } from '../types';
import { formatCurrency } from '../constants';
import { ArchiveIcon, DollarSignIcon, TrendingUpIcon } from './Icons';

// --- Reusable Components ---

const KpiCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = React.memo(({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-2xl shadow-soft-lg border border-slate-200 flex items-center gap-5">
        <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-fosis-blue-100 text-fosis-blue-800">
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
));

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = React.memo(({ title, children }) => (
    <div className="bg-white p-6 rounded-2xl shadow-soft-lg border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">{title}</h3>
        {children}
    </div>
));

const FinancialDonutChart: React.FC<{ data: { rendered: number; toRender: number; toDisburse: number; total: number } }> = React.memo(({ data }) => {
    const { rendered, toRender, toDisburse, total } = data;
    if (total === 0) return <p className="text-slate-500 text-center py-10">No hay datos financieros para mostrar.</p>;

    const radius = 80;
    const strokeWidth = 25;
    const innerRadius = radius - strokeWidth / 2;
    const circumference = 2 * Math.PI * innerRadius;

    const renderedPercent = (rendered / total);
    const toRenderPercent = (toRender / total);
    
    const renderedStroke = renderedPercent * circumference;
    const toRenderStroke = toRenderPercent * circumference;
    
    const renderedOffset = 0;
    const toRenderOffset = -renderedStroke;

    const legendData = [
        { label: 'Rendido Aprobado', value: rendered, color: 'text-fosis-green-600', bg: 'bg-fosis-green-500' },
        { label: 'Saldo por Rendir', value: toRender, color: 'text-yellow-500', bg: 'bg-yellow-500' },
        { label: 'Saldo por Desembolsar', value: toDisburse, color: 'text-slate-400', bg: 'bg-slate-400' },
    ];

    return (
        <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-48 h-48 flex-shrink-0">
                <svg viewBox="0 0 200 200" className="-rotate-90">
                    <circle cx="100" cy="100" r={innerRadius} fill="transparent" strokeWidth={strokeWidth} className="text-slate-200" stroke="currentColor" />
                    <circle cx="100" cy="100" r={innerRadius} fill="transparent" strokeWidth={strokeWidth} className="text-fosis-green-500" stroke="currentColor" strokeDasharray={`${renderedStroke} ${circumference}`} strokeDashoffset={renderedOffset} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.5s' }}><title>Rendido: {formatCurrency(rendered)}</title></circle>
                    <circle cx="100" cy="100" r={innerRadius} fill="transparent" strokeWidth={strokeWidth} className="text-yellow-500" stroke="currentColor" strokeDasharray={`${toRenderStroke} ${circumference}`} strokeDashoffset={toRenderOffset} strokeLinecap="round" style={{ transition: 'all 0.5s' }}><title>Por Rendir: {formatCurrency(toRender)}</title></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xs text-slate-500">Total</span>
                    <span className="text-2xl font-bold text-slate-800">{formatCurrency(total).replace(' CLP', '')}</span>
                </div>
            </div>
            <div className="w-full text-sm space-y-3">
                {legendData.map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${item.bg}`}></div>
                            <span className="text-slate-600">{item.label}</span>
                        </div>
                        <span className={`font-bold ${item.color}`}>{formatCurrency(item.value)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
});


const ProjectStatusBarChart: React.FC<{ data: { onTime: number; atRisk: number; overdue: number } }> = React.memo(({ data }) => {
    const { onTime, atRisk, overdue } = data;
    const total = onTime + atRisk + overdue;
    if (total === 0) return <p className="text-slate-500 text-center py-10">No hay garantías para analizar.</p>;

    const chartData = [
        { label: 'A Tiempo', value: onTime, color: 'fill-fosis-green-500', text: 'text-fosis-green-600' },
        { label: 'En Riesgo', value: atRisk, color: 'fill-yellow-500', text: 'text-yellow-500' },
        { label: 'Vencidas', value: overdue, color: 'fill-red-500', text: 'text-red-500' },
    ];

    const maxValue = Math.max(...chartData.map(d => d.value), 1);

    return (
        <div className="space-y-4">
            {chartData.map(item => (
                <div key={item.label} className="grid grid-cols-4 items-center gap-4 text-sm">
                    <span className="text-slate-600 col-span-1">{item.label}</span>
                    <div className="col-span-3 flex items-center gap-2">
                        <div className="w-full bg-slate-100 rounded-full h-6">
                            <div
                                className={`${item.color} h-6 rounded-full transition-all duration-500`}
                                style={{ width: `${(item.value / maxValue) * 100}%` }}
                            ></div>
                        </div>
                        <span className={`font-bold w-8 text-right ${item.text}`}>{item.value}</span>
                    </div>
                </div>
            ))}
        </div>
    );
});


// --- Main Dashboard Component ---

const Dashboard: React.FC = () => {
    const [projects] = useLocalStorage<Project[]>('fosis_projects', []);

    const dashboardData = useMemo(() => {
        const totalAmount = projects.reduce((sum, p) => sum + p.amount, 0);
        const totalDisbursed = projects.reduce((sum, p) => sum + (p.disbursements?.reduce((s, d) => s + d.amount, 0) || 0), 0);
        const totalRendered = projects.reduce((sum, p) => sum + (p.renditions?.reduce((s, r) => s + r.approvedAmount, 0) || 0), 0);
        const renditionPercentage = totalDisbursed > 0 ? (totalRendered / totalDisbursed) * 100 : 0;
        
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const thirtyDaysFromNow = new Date(today);
        thirtyDaysFromNow.setUTCDate(today.getUTCDate() + 30);
        
        let onTime = 0, atRisk = 0, overdue = 0;
        
        projects.forEach(p => {
            if (p.complianceGuaranteeActualDueDate) {
                const dueDate = new Date(p.complianceGuaranteeActualDueDate);
                 dueDate.setUTCHours(0, 0, 0, 0);

                if (dueDate < today) {
                    overdue++;
                } else if (dueDate <= thirtyDaysFromNow) {
                    atRisk++;
                } else {
                    onTime++;
                }
            }
        });

        return {
            projectCount: projects.length,
            totalAmount,
            renditionPercentage,
            financials: {
                rendered: totalRendered,
                toRender: totalDisbursed - totalRendered,
                toDisburse: totalAmount - totalDisbursed,
                total: totalAmount
            },
            statuses: { onTime, atRisk, overdue }
        };
    }, [projects]);

    if (projects.length === 0) {
        return (
            <div className="mt-8 text-center p-8 bg-fosis-blue-100 rounded-2xl border-2 border-dashed border-fosis-blue-800/30">
                <h2 className="text-xl font-semibold text-fosis-blue-900">¡Bienvenido a tu Panel de Control!</h2>
                <p className="text-slate-600 mt-2">Agrega tu primer proyecto para ver tus estadísticas y gráficos aquí.</p>
            </div>
        );
    }

    return (
        <div className="mt-10 text-left">
            <h2 className="text-2xl font-bold text-fosis-blue-900 mb-4 text-center">Panel de Control Global</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard title="Total de Proyectos" value={dashboardData.projectCount.toString()} icon={<ArchiveIcon className="w-6 h-6"/>} />
                <KpiCard title="Monto Total Gestionado" value={formatCurrency(dashboardData.totalAmount)} icon={<DollarSignIcon className="w-6 h-6"/>} />
                <KpiCard title="% Rendición Global" value={`${dashboardData.renditionPercentage.toFixed(1)}%`} icon={<TrendingUpIcon className="w-6 h-6"/>} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                 <ChartCard title="Resumen Financiero Global">
                    <FinancialDonutChart data={dashboardData.financials} />
                </ChartCard>
                 <ChartCard title="Estado de Garantías (F. Cumplimiento)">
                    <ProjectStatusBarChart data={dashboardData.statuses} />
                </ChartCard>
            </div>
        </div>
    );
};

export default Dashboard;