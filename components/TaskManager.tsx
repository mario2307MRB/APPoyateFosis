import React, { useState, useMemo, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { Task, Schedule, TaskPriority } from '../types';
import { FOSIS_TASKS_POOL } from '../constants';
import { PlusCircleIcon, TrashIcon, XCircleIcon, CheckCircleIcon, ChevronLeftIcon } from './Icons';

// Constants
const DAY_NAMES = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const DAY_CAPACITIES = [9, 9, 9, 9, 8];
const TOTAL_TASKS_TO_GENERATE = 30;
const PRIORITIES: TaskPriority[] = ['Alta', 'Media', 'Baja'];

const createEmptySchedule = (): Schedule => {
    return Array.from({ length: 4 }, (_, i) => ({
        weekNumber: i + 1,
        days: DAY_NAMES.map((name, index) => ({
            dayName: name,
            capacity: DAY_CAPACITIES[index],
            tasks: [],
            usedHours: 0
        }))
    }));
};

const getPriorityClasses = (priority: TaskPriority) => {
    switch (priority) {
        case 'Alta': return 'border-l-red-500 bg-red-500/10 text-red-800 dark:text-red-300';
        case 'Media': return 'border-l-yellow-500 bg-yellow-500/10 text-yellow-800 dark:text-yellow-300';
        case 'Baja': return 'border-l-sky-500 bg-sky-500/10 text-sky-800 dark:text-sky-300';
        default: return 'border-l-slate-500 bg-slate-500/10 text-slate-800 dark:text-slate-300';
    }
};

interface TaskManagerProps {
    goBack: () => void;
}

const TaskManagerView: React.FC<TaskManagerProps> = ({ goBack }) => {
    const [pendingTasks, setPendingTasks] = useLocalStorage<Task[]>('fosis_pending_tasks', []);
    const [schedule, setSchedule] = useLocalStorage<Schedule>('fosis_schedule', createEmptySchedule());
    const [modalState, setModalState] = useState<{ weekIndex: number; dayIndex: number; } | null>(null);
    const [showSaveMessage, setShowSaveMessage] = useState(false);
    const [animateScore, setAnimateScore] = useState(false);

    const score = useMemo(() => {
        return schedule.reduce((totalScore, week) => {
            return totalScore + week.days.reduce((weekScore, day) => {
                return weekScore + day.tasks.reduce((dayScore, task) => {
                    let pointsPerHour = 1;
                    if (task.priority === 'Alta') pointsPerHour = 3;
                    else if (task.priority === 'Media') pointsPerHour = 2;
                    return dayScore + (task.durationHours * pointsPerHour);
                }, 0);
            }, 0);
        }, 0);
    }, [schedule]);

    useEffect(() => {
        setAnimateScore(true);
        const timer = setTimeout(() => setAnimateScore(false), 300);
        return () => clearTimeout(timer);
    }, [score]);

    const generateNewBoard = () => {
        const newTasks: Task[] = Array.from({ length: TOTAL_TASKS_TO_GENERATE }, (_, i) => {
            const template = FOSIS_TASKS_POOL[Math.floor(Math.random() * FOSIS_TASKS_POOL.length)];
            return {
                ...template,
                id: `${Date.now()}-${i}`,
                priority: PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)],
            };
        });
        setPendingTasks(newTasks.sort((a,b) => PRIORITIES.indexOf(a.priority) - PRIORITIES.indexOf(b.priority)));
        setSchedule(createEmptySchedule());
    };

    useEffect(() => {
        if(pendingTasks.length === 0 && schedule.every(w => w.days.every(d => d.tasks.length === 0))) {
            generateNewBoard();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const handleSaveGame = () => {
        setShowSaveMessage(true);
        setTimeout(() => setShowSaveMessage(false), 3000);
    };

    const handleAssignTask = (task: Task) => {
        if (!modalState) return;
        const { weekIndex, dayIndex } = modalState;

        const newSchedule = JSON.parse(JSON.stringify(schedule));
        const day = newSchedule[weekIndex].days[dayIndex];
        day.tasks.push(task);
        day.usedHours += task.durationHours;
        setSchedule(newSchedule);

        setPendingTasks(pendingTasks.filter(p => p.id !== task.id));
        setModalState(null);
    };
    
    const handleRemoveTask = (task: Task, weekIndex: number, dayIndex: number) => {
        const newSchedule = JSON.parse(JSON.stringify(schedule));
        const day = newSchedule[weekIndex].days[dayIndex];
        day.tasks = day.tasks.filter(t => t.id !== task.id);
        day.usedHours -= task.durationHours;
        setSchedule(newSchedule);

        setPendingTasks([...pendingTasks, task].sort((a,b) => PRIORITIES.indexOf(a.priority) - PRIORITIES.indexOf(b.priority)));
    };

    const availableTasksForModal = useMemo(() => {
        if (!modalState) return [];
        const day = schedule[modalState.weekIndex].days[modalState.dayIndex];
        const remainingHours = day.capacity - day.usedHours;
        return pendingTasks.filter(task => task.durationHours <= remainingHours);
    }, [modalState, pendingTasks, schedule]);

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in-up">
            <button onClick={goBack} className="flex items-center gap-2 px-4 py-2 mb-4 font-semibold text-fosis-blue-800 dark:text-fosis-blue-300 rounded-full hover:bg-fosis-blue-500/10 transition-colors">
                <ChevronLeftIcon className="w-5 h-5"/>
                Volver al Inicio
            </button>
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-fosis-blue-900 dark:text-white">Planificador de Tareas</h1>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">Asigna tareas pendientes y optimiza tu productividad.</p>
                </div>
                <div className="flex items-center gap-4">
                     <div className="text-right p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/20 dark:border-slate-700/50 shadow-soft">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Puntaje</span>
                        <p className={`text-3xl font-bold text-fosis-green-600 dark:text-fosis-green-400 transition-transform duration-300 ${animateScore ? 'scale-125' : ''}`}>{score}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button onClick={generateNewBoard} className="flex items-center justify-center gap-2 px-4 py-2 bg-fosis-blue-800 text-white font-semibold rounded-lg shadow-soft-md hover:bg-fosis-blue-900 transition-all">
                            <PlusCircleIcon className="w-5 h-5"/>
                            <span>Nuevo Tablero</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">Banco de Tareas Pendientes</h2>
                <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-4 rounded-2xl shadow-soft-lg border border-white/20 dark:border-slate-700/50 max-h-72 overflow-y-auto">
                    {pendingTasks.length > 0 ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {pendingTasks.map(task => (
                                <div key={task.id} className={`p-3 border-l-4 rounded-lg ${getPriorityClasses(task.priority)}`}>
                                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{task.title}</p>
                                    <div className="flex justify-between items-center mt-2 text-xs">
                                        <span className={`px-2 py-0.5 rounded-full font-medium`}>Prioridad {task.priority}</span>
                                        <span className="font-bold">{task.durationHours}h</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-slate-500 dark:text-slate-400 py-8 flex flex-col items-center justify-center">
                            <CheckCircleIcon className="w-16 h-16 text-fosis-green-500 mb-4"/>
                            <p className="font-semibold text-lg">¡Excelente! No hay tareas pendientes.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-8">
            {schedule.map((week, weekIndex) => (
                <div key={week.weekNumber}>
                    <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4 border-b-2 border-fosis-blue-700/20 pb-2">Semana {week.weekNumber}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {week.days.map((day, dayIndex) => {
                            const isOverloaded = day.usedHours > day.capacity;
                            const progressPercentage = (day.usedHours / day.capacity) * 100;
                            return (
                            <div key={dayIndex} className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-4 rounded-2xl shadow-soft-lg border border-white/20 dark:border-slate-700/50 flex flex-col min-h-[300px]">
                                <h3 className="font-bold text-lg text-fosis-blue-900 dark:text-fosis-blue-300">{day.dayName}</h3>
                                <div className="my-2">
                                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300 mb-1">
                                        <span>Horas Asignadas</span>
                                        <span className={`font-semibold ${isOverloaded ? 'text-red-500' : 'text-slate-800 dark:text-slate-100'}`}>{day.usedHours}/{day.capacity}h</span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                        <div 
                                            className={`h-2.5 rounded-full transition-all duration-300 ${isOverloaded ? 'bg-red-500 animate-pulse' : 'bg-fosis-green-500'}`} 
                                            style={{ width: `${Math.min(100, progressPercentage)}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="space-y-2 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 flex-grow overflow-y-auto min-h-[150px] -mx-2 px-2">
                                    {day.tasks.map(task => (
                                        <div key={task.id} className={`p-2 rounded-md text-sm border-l-4 ${getPriorityClasses(task.priority)} relative group animate-pop-in`}>
                                            <p className="font-medium pr-6 text-slate-800 dark:text-slate-100">{task.title} ({task.durationHours}h)</p>
                                            <button onClick={() => handleRemoveTask(task, weekIndex, dayIndex)} className="absolute top-1 right-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-700"><TrashIcon className="w-4 h-4"/></button>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => setModalState({ weekIndex, dayIndex })} className="mt-2 w-full flex items-center justify-center gap-2 text-sm p-2 bg-slate-200/70 dark:bg-slate-700/70 hover:bg-slate-300/70 dark:hover:bg-slate-600/70 rounded-lg text-fosis-blue-800 dark:text-fosis-blue-300 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    <PlusCircleIcon className="w-4 h-4"/> Añadir Tarea
                                </button>
                            </div>
                        )})}
                    </div>
                </div>
            ))}
            </div>

            {modalState && (
                <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-soft-xl w-full max-w-lg max-h-[80vh] flex flex-col animate-pop-in border border-white/10">
                         <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-fosis-blue-900 dark:text-fosis-blue-300">Seleccionar Tarea</h2>
                            <button onClick={() => setModalState(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><XCircleIcon className="w-7 h-7"/></button>
                        </div>
                        <div className="p-4 overflow-y-auto">
                            {availableTasksForModal.length > 0 ? (
                                <div className="space-y-3">
                                {availableTasksForModal.map(task => (
                                    <button key={task.id} onClick={() => handleAssignTask(task)} className={`w-full text-left p-3 border-l-4 rounded-lg transition-all hover:shadow-soft-md hover:scale-[1.02] ${getPriorityClasses(task.priority)}`}>
                                        <p className="font-semibold text-slate-800 dark:text-slate-100">{task.title}</p>
                                        <div className="flex justify-between items-center mt-2 text-sm">
                                            <span className={`px-2 py-0.5 rounded-full font-medium text-xs`}>Prioridad {task.priority}</span>
                                            <span className="font-bold">{task.durationHours}h</span>
                                        </div>
                                    </button>
                                ))}
                                </div>
                            ) : (
                                <p className="text-center text-slate-500 dark:text-slate-400 py-10">No hay tareas disponibles que se ajusten al tiempo restante para este día.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showSaveMessage && (
                <div className="fixed bottom-8 right-8 bg-slate-800 text-white py-3 px-5 rounded-lg shadow-soft-xl z-50 animate-fade-in-out">
                    <p><strong>¡Partida guardada!</strong> Tu progreso se guarda automáticamente.</p>
                </div>
            )}
        </div>
    );
};

export default TaskManagerView;