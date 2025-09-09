
import React from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { Task, Schedule, WeekSchedule } from '../types';
import { FOSIS_TASKS_POOL } from '../constants';
import { PlusCircleIcon } from './Icons';

const TaskManagerView: React.FC = () => {
    const [schedule, setSchedule] = useLocalStorage<Schedule | null>('fosis_schedule', null);

    const generateSchedule = () => {
        const TOTAL_TASKS = 35; // Generate a good number of tasks for a month
        const tasksToSchedule: Task[] = [];

        // 1. Generate a list of random tasks from the pool
        for (let i = 0; i < TOTAL_TASKS; i++) {
            const template = FOSIS_TASKS_POOL[Math.floor(Math.random() * FOSIS_TASKS_POOL.length)];
            tasksToSchedule.push({
                ...template,
                id: `${new Date().toISOString()}-${i}`
            });
        }
        
        // 2. Initialize the 4-week schedule structure
        const newSchedule: WeekSchedule[] = [];
        const dayNames = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
        const capacities = [9, 9, 9, 9, 8]; // Daily work hours

        for (let i = 1; i <= 4; i++) {
            const week: WeekSchedule = {
                weekNumber: i,
                days: dayNames.map((name, index) => ({
                    dayName: name,
                    capacity: capacities[index],
                    tasks: [],
                    usedHours: 0
                }))
            };
            newSchedule.push(week);
        }

        // 3. Fill the schedule with tasks following the rules
        let currentTaskIndex = 0;
        for (const week of newSchedule) {
            for (const day of week.days) {
                while (currentTaskIndex < tasksToSchedule.length) {
                    const currentTask = tasksToSchedule[currentTaskIndex];
                    if (day.usedHours + currentTask.durationHours <= day.capacity) {
                        day.tasks.push(currentTask);
                        day.usedHours += currentTask.durationHours;
                        currentTaskIndex++;
                    } else {
                        // Cannot fit, carry over to the next day
                        break;
                    }
                }
            }
        }
        
        // If tasks remain after 4 weeks, add them to the last day to show overflow
        if (currentTaskIndex < tasksToSchedule.length) {
            const remainingTasks = tasksToSchedule.slice(currentTaskIndex);
            const lastDay = newSchedule[3].days[4];
            lastDay.tasks.push(...remainingTasks);
            remainingTasks.forEach(task => { lastDay.usedHours += task.durationHours; });
        }

        setSchedule(newSchedule);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Planificador de Tareas Mensual</h1>
                <button
                    onClick={generateSchedule}
                    className="flex items-center gap-2 px-4 py-2 bg-fosis-blue text-white rounded-lg shadow-md hover:bg-fosis-blue-dark transition-colors"
                >
                    <PlusCircleIcon className="w-5 h-5"/>
                    <span>{schedule ? 'Regenerar Plan' : 'Generar Plan de Trabajo'}</span>
                </button>
            </div>
            
            {schedule ? (
                <div className="space-y-8">
                {schedule.map(week => (
                    <div key={week.weekNumber}>
                        <h2 className="text-2xl font-bold text-gray-700 mb-4 border-b-2 border-fosis-blue pb-2">Semana {week.weekNumber}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                            {week.days.map((day, dayIndex) => (
                                <div key={`${week.weekNumber}-${dayIndex}`} className="bg-white p-4 rounded-xl shadow-lg flex flex-col min-h-[250px]">
                                    <h3 className="font-bold text-lg text-fosis-blue-dark">{day.dayName}</h3>
                                    <div className="my-2">
                                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                                            <span>Uso de Horas</span>
                                            <span className={`font-semibold ${day.usedHours > day.capacity ? 'text-red-600' : 'text-gray-800'}`}>{day.usedHours}/{day.capacity}h</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                          <div className={`h-2.5 rounded-full ${day.usedHours > day.capacity ? 'bg-red-500' : 'bg-fosis-green'}`} style={{ width: `${Math.min(100, (day.usedHours / day.capacity) * 100)}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2 mt-2 pt-2 border-t flex-grow overflow-y-auto">
                                        {day.tasks.length > 0 ? day.tasks.map(task => (
                                            <div key={task.id} className="bg-slate-100 p-2 rounded-md text-sm transition-transform hover:scale-105 hover:shadow-md">
                                                <p className="font-medium text-gray-800">{task.title}</p>
                                                <p className="text-right text-xs text-gray-500 font-semibold">{task.durationHours}h</p>
                                            </div>
                                        )) : <p className="text-sm text-gray-400 text-center pt-8">Día libre</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                </div>
            ) : (
                 <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700">Aún no has generado tu plan de trabajo.</h2>
                    <p className="text-gray-500 mt-2 max-w-2xl mx-auto">Esta herramienta simula una carga de trabajo mensual. Haz clic en "Generar Plan de Trabajo" para crear un calendario de 4 semanas con tareas FOSIS, distribuidas según las horas laborales disponibles cada día.</p>
                </div>
            )}
        </div>
    );
};

export default TaskManagerView;
