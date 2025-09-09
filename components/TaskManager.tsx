
import React, { useState } from 'react';
import type { Task } from '../types';
import { TaskPriority, TaskStatus } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { PlusCircleIcon, EditIcon, TrashIcon, XCircleIcon, CheckCircleIcon } from './Icons';

const priorityStyles: Record<TaskPriority, { bg: string; text: string }> = {
    [TaskPriority.High]: { bg: 'bg-red-100', text: 'text-red-800' },
    [TaskPriority.Medium]: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    [TaskPriority.Low]: { bg: 'bg-green-100', text: 'text-green-800' },
};

// --- TaskForm Modal ---
interface TaskFormProps {
    onClose: () => void;
    onSave: (task: Task) => void;
    taskToEdit?: Task | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose, onSave, taskToEdit }) => {
    const [title, setTitle] = useState(taskToEdit?.title || '');
    const [priority, setPriority] = useState<TaskPriority>(taskToEdit?.priority || TaskPriority.Medium);
    const [deadlineDays, setDeadlineDays] = useState(taskToEdit?.deadlineDays || 7);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        const task: Task = {
            id: taskToEdit?.id || new Date().toISOString(),
            createdAt: taskToEdit?.createdAt || new Date().toISOString(),
            status: taskToEdit?.status || TaskStatus.ToDo,
            title,
            priority,
            deadlineDays,
        };
        onSave(task);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-fosis-blue-dark">{taskToEdit ? 'Editar' : 'Nueva'} Tarea</h2>
                    <button onClick={onClose}><XCircleIcon className="w-6 h-6 text-gray-500 hover:text-gray-800"/></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Título de la Tarea</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Prioridad</label>
                        <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                            {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Plazo (días)</label>
                        <input type="number" min="1" value={deadlineDays} onChange={(e) => setDeadlineDays(parseInt(e.target.value) || 1)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-fosis-blue text-white rounded-md">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- TaskCard Component ---
const TaskCard: React.FC<{ task: Task; onEdit: (task: Task) => void; onDelete: (id: string) => void; onStatusChange: (id: string, status: TaskStatus) => void; }> = ({ task, onEdit, onDelete, onStatusChange }) => {
    return (
        <div className={`p-4 bg-white rounded-lg shadow-sm border-l-4 ${task.status === TaskStatus.Done ? 'border-green-400 opacity-60' : 'border-fosis-blue'}`}>
            <div className="flex justify-between items-start">
                <p className={`font-semibold ${task.status === TaskStatus.Done ? 'line-through' : ''}`}>{task.title}</p>
                <div className="flex items-center space-x-2">
                     <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${priorityStyles[task.priority].bg} ${priorityStyles[task.priority].text}`}>
                        {task.priority}
                    </span>
                    <button onClick={() => onEdit(task)}><EditIcon className="w-4 h-4 text-gray-500 hover:text-blue-600"/></button>
                    <button onClick={() => onDelete(task.id)}><TrashIcon className="w-4 h-4 text-gray-500 hover:text-red-600"/></button>
                </div>
            </div>
            <div className="text-sm text-gray-500 mt-2">Plazo: {task.deadlineDays} días</div>
            <div className="mt-3">
                 <select value={task.status} onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)} className="text-xs p-1 rounded border-gray-300">
                    {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
            </div>
        </div>
    )
}

// --- TaskColumn Component ---
const TaskColumn: React.FC<{ title: string; tasks: Task[]; onEdit: (task: Task) => void; onDelete: (id: string) => void; onStatusChange: (id: string, status: TaskStatus) => void; }> = ({ title, tasks, ...rest }) => (
    <div className="bg-gray-100 rounded-lg p-4 w-full">
        <h3 className="font-bold text-lg text-gray-700 mb-4">{title} ({tasks.length})</h3>
        <div className="space-y-4">
            {tasks.length > 0 ? tasks.map(task => <TaskCard key={task.id} task={task} {...rest} />) : <p className="text-gray-500 text-sm">No hay tareas aquí.</p>}
        </div>
    </div>
)

// --- TaskManagerView (Main) Component ---
const TaskManagerView: React.FC = () => {
    const [tasks, setTasks] = useLocalStorage<Task[]>('fosis_tasks', []);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

    const handleSaveTask = (task: Task) => {
        const index = tasks.findIndex(t => t.id === task.id);
        if (index > -1) {
            const updatedTasks = [...tasks];
            updatedTasks[index] = task;
            setTasks(updatedTasks);
        } else {
            setTasks([...tasks, task]);
        }
        setIsFormOpen(false);
        setTaskToEdit(null);
    };
    
    const handleEdit = (task: Task) => {
        setTaskToEdit(task);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        if(window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
            setTasks(tasks.filter(t => t.id !== id));
        }
    };
    
    const handleStatusChange = (id: string, status: TaskStatus) => {
        setTasks(tasks.map(t => t.id === id ? {...t, status} : t));
    };

    const tasksByStatus = tasks.reduce((acc, task) => {
        acc[task.status] = [...(acc[task.status] || []), task];
        return acc;
    }, {} as Record<TaskStatus, Task[]>);

    return (
        <div className="p-4 sm:p-6 lg:p-8">
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestor de Tareas</h1>
                <button
                    onClick={() => { setTaskToEdit(null); setIsFormOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-fosis-blue text-white rounded-lg shadow-md hover:bg-fosis-blue-dark transition-colors"
                >
                    <PlusCircleIcon className="w-5 h-5"/>
                    <span>Nueva Tarea</span>
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TaskColumn title="Por Hacer" tasks={tasksByStatus[TaskStatus.ToDo] || []} onEdit={handleEdit} onDelete={handleDelete} onStatusChange={handleStatusChange} />
                <TaskColumn title="En Progreso" tasks={tasksByStatus[TaskStatus.InProgress] || []} onEdit={handleEdit} onDelete={handleDelete} onStatusChange={handleStatusChange} />
                <TaskColumn title="Hecho" tasks={tasksByStatus[TaskStatus.Done] || []} onEdit={handleEdit} onDelete={handleDelete} onStatusChange={handleStatusChange} />
            </div>

            {isFormOpen && <TaskForm onClose={() => setIsFormOpen(false)} onSave={handleSaveTask} taskToEdit={taskToEdit} />}
        </div>
    );
};

export default TaskManagerView;
