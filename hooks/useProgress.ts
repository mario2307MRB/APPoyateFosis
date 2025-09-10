import { useMemo } from 'react';
import useLocalStorage from './useLocalStorage';
import type { Schedule, TaskPriority } from '../types';

const PRIORITIES: TaskPriority[] = ['Alta', 'Media', 'Baja'];

const useProgress = () => {
  const [schedule] = useLocalStorage<Schedule>('fosis_schedule', []);
  const [quizScore] = useLocalStorage<number>('fosis_quiz_score', 0);
  const [quizTotal] = useLocalStorage<number>('fosis_quiz_total', 7);

  const progressScore = useMemo(() => {
    // Puntuación basada en las tareas planificadas y su prioridad
    const taskScore = schedule.reduce((totalScore, week) => {
        return totalScore + week.days.reduce((weekScore, day) => {
            return weekScore + day.tasks.reduce((dayScore, task) => {
                let pointsPerHour = 1;
                if (task.priority === 'Alta') pointsPerHour = 3;
                else if (task.priority === 'Media') pointsPerHour = 2;
                return dayScore + (task.durationHours * pointsPerHour);
            }, 0);
        }, 0);
    }, 0);

    // Puntuación basada en el resultado del quiz, premiando un mejor desempeño
    const quizPercentage = quizTotal > 0 ? (quizScore / quizTotal) : 0;
    const quizPoints = Math.floor(quizPercentage * 100) * 5; // ej: 100% = 500 puntos, 80% = 400 puntos

    return taskScore + quizPoints;
  }, [schedule, quizScore, quizTotal]);

  return progressScore;
};

export default useProgress;
