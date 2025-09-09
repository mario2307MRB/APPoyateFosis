
import React, { useState, useMemo, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { Task, Schedule, TaskPriority } from '../types';
import { FOSIS_TASKS_POOL } from '../constants';
import { PlusCircleIcon, TrashIcon, XCircleIcon, CheckCircleIcon } from './Icons';

// Constants
const DAY_NAMES = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const DAY_CAPACITIES = [9, 9, 9, 9, 8];
const TOTAL_TASKS_TO_GENERATE = 30;
const PRIORITIES: TaskPriority[] = ['Alta', 'Media', 'Baja'];

const createEmptySchedule = (): Schedule => {
    const newSchedule = [];
    for (let i = 1; i <= 4; i++) {
        newSchedule.push({
            weekNumber: i,
            days: DAY_NAMES.map((name, index) => ({
                dayName: name,
                capacity: DAY_CAPACITIES[index],
                tasks: [],
                usedHours: 0
            }))
        });
    }
    return newSchedule;
};

const getPriorityClasses = (priority: TaskPriority) => {
    switch (priority) {
        case 'Alta': return 'bg-red-100 text-red-800 border-red-300';
        case 'Media': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'Baja': return 'bg-blue-100 text-blue-800 border-blue-300';
        default: return 'bg-neutral-100 text-neutral-800 border-neutral-300';
    }
};


const TaskManagerView: React.FC = () => {
    const [pendingTasks, setPendingTasks] = useLocalStorage<Task[]>('fosis_pending_tasks', []);
    const [schedule, setSchedule] = useLocalStorage<Schedule>('fosis_schedule', createEmptySchedule());
    const [modalState, setModalState] = useState<{ weekIndex: number; dayIndex: number; } | null>(null);
    const [showSaveMessage, setShowSaveMessage] = useState(false);

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


    const generateNewBoard = () => {
        const newTasks: Task[] = [];
        for (let i = 0; i < TOTAL_TASKS_TO_GENERATE; i++) {
            const template = FOSIS_TASKS_POOL[Math.floor(Math.random() * FOSIS_TASKS_POOL.length)];
            newTasks.push({
                ...template,
                id: `${Date.now()}-${i}`,
                priority: PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)],
            });
        }
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
        setTimeout(() => {
            setShowSaveMessage(false);
        }, 3000);
    };

    const handleOpenModal = (weekIndex: number, dayIndex: number) => setModalState({ weekIndex, dayIndex });
    const handleCloseModal = () => setModalState(null);

    const handleAssignTask = (task: Task) => {
        if (!modalState) return;
        const { weekIndex, dayIndex } = modalState;

        const newSchedule = JSON.parse(JSON.stringify(schedule));
        const day = newSchedule[weekIndex].days[dayIndex];
        day.tasks.push(task);
        day.usedHours += task.durationHours;
        setSchedule(newSchedule);

        setPendingTasks(pendingTasks.filter(p => p.id !== task.id));
        handleCloseModal();
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
        <div className="p-4 sm:p-6 lg:p-8">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-800">Planificador de Tareas</h1>
                    <p className="text-neutral-600 mt-1">Asigna tareas pendientes a tu calendario semanal y optimiza tu productividad.</p>
                </div>
                <div className="flex items-center gap-4">
                     <div className="text-right p-3 rounded-lg bg-white border">
                        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Puntaje</span>
                        <p className="text-3xl font-bold text-fosis-green-dark">{score}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button
                            onClick={handleSaveGame}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-fosis-green text-white font-semibold rounded-lg shadow-md hover:bg-fosis-green-dark transition-all"
                        >
                            <CheckCircleIcon className="w-5 h-5"/>
                            <span>Guardar</span>
                        </button>
                        <button
                            onClick={generateNewBoard}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-fosis-blue text-white font-semibold rounded-lg shadow-md hover:bg-fosis-blue-dark transition-all"
                        >
                            <PlusCircleIcon className="w-5 h-5"/>
                            <span>Nuevo Tablero</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-neutral-700 mb-4">Banco de Tareas Pendientes</h2>
                <div className="bg-white p-4 rounded-xl shadow-lg border max-h-72 overflow-y-auto">
                    {pendingTasks.length > 0 ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {pendingTasks.map(task => (
                                <div key={task.id} className={`p-3 border rounded-lg ${getPriorityClasses(task.priority)}`}>
                                    <p className="font-semibold text-sm">{task.title}</p>
                                    <div className="flex justify-between items-center mt-2 text-xs">
                                        <span className={`px-2 py-0.5 rounded-full font-medium ${getPriorityClasses(task.priority)} border`}>Prioridad {task.priority}</span>
                                        <span className="font-bold">{task.durationHours}h</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-neutral-500 py-8 flex flex-col items-center justify-center">
                            <CheckCircleIcon className="w-16 h-16 text-fosis-green mb-4"/>
                            <p className="font-semibold text-lg">¡Excelente! No hay tareas pendientes.</p>
                            <p>Puedes generar un nuevo tablero de tareas cuando quieras.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-8">
            {schedule.map((week, weekIndex) => (
                <div key={week.weekNumber}>
                    <h2 className="text-2xl font-bold text-neutral-700 mb-4 border-b-2 border-fosis-blue pb-2">Semana {week.weekNumber}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {week.days.map((day, dayIndex) => (
                            <div key={dayIndex} className="bg-white p-4 rounded-xl shadow-lg border flex flex-col min-h-[300px]">
                                <h3 className="font-bold text-lg text-fosis-blue-dark">{day.dayName}</h3>
                                <div className="my-2">
                                    <div className="flex justify-between text-sm text-neutral-600 mb-1">
                                        <span>Horas Asignadas</span>
                                        <span className={`font-semibold ${day.usedHours > day.capacity ? 'text-red-600' : 'text-neutral-800'}`}>{day.usedHours}/{day.capacity}h</span>
                                    </div>
                                    <div className="w-full bg-neutral-200 rounded-full h-2.5"><div className="bg-fosis-green h-2.5 rounded-full transition-all duration-300" style={{ width: `${(day.usedHours / day.capacity) * 100}%` }}></div></div>
                                </div>
                                <div className="space-y-2 mt-2 pt-2 border-t flex-grow overflow-y-auto min-h-[150px] -mx-2 px-2">
                                    {day.tasks.map(task => (
                                        <div key={task.id} className={`p-2 rounded-md text-sm border ${getPriorityClasses(task.priority)} relative group`}>
                                            <p className="font-medium pr-6">{task.title} ({task.durationHours}h)</p>
                                            <button onClick={() => handleRemoveTask(task, weekIndex, dayIndex)} className="absolute top-1 right-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-700"><TrashIcon className="w-4 h-4"/></button>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => handleOpenModal(weekIndex, dayIndex)} className="mt-2 w-full flex items-center justify-center gap-2 text-sm p-2 bg-neutral-100 hover:bg-neutral-200 rounded-md text-fosis-blue-dark font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-100" disabled={day.usedHours >= day.capacity}>
                                    <PlusCircleIcon className="w-4 h-4"/> Añadir Tarea
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            </div>

            {modalState && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
                         <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold text-fosis-blue-dark">Seleccionar Tarea</h2>
                            <button onClick={handleCloseModal} className="text-neutral-400 hover:text-neutral-600"><XCircleIcon className="w-7 h-7"/></button>
                        </div>
                        <div className="p-4 overflow-y-auto">
                            {availableTasksForModal.length > 0 ? (
                                <div className="space-y-3">
                                {availableTasksForModal.map(task => (
                                    <button key={task.id} onClick={() => handleAssignTask(task)} className={`w-full text-left p-3 border rounded-lg transition-all hover:shadow-md hover:border-fosis-blue ${getPriorityClasses(task.priority)}`}>
                                        <p className="font-semibold">{task.title}</p>
                                        <div className="flex justify-between items-center mt-2 text-sm">
                                            <span className={`px-2 py-0.5 rounded-full font-medium text-xs ${getPriorityClasses(task.priority)} border`}>Prioridad {task.priority}</span>
                                            <span className="font-bold">{task.durationHours}h</span>
                                        </div>
                                    </button>
                                ))}
                                </div>
                            ) : (
                                <p className="text-center text-neutral-500 py-10">No hay tareas disponibles que se ajusten al tiempo restante para este día.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showSaveMessage && (
                <div className="fixed bottom-8 right-8 bg-neutral-800 text-white py-3 px-5 rounded-lg shadow-xl z-50 animate-fade-in-out">
                    <p><strong>¡Partida guardada!</strong> Tu progreso se guarda automáticamente.</p>
                </div>
            )}
        </div>
    );
};

export default TaskManagerView;
