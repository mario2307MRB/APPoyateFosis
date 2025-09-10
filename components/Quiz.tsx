import React, { useState, useEffect, useMemo } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import type { QuizQuestion } from '../types';
import { CheckCircleIcon, XCircleIcon, ChevronLeftIcon } from './Icons';
import useLocalStorage from '../hooks/useLocalStorage';

const Confetti: React.FC = React.memo(() => {
    const colors = ['bg-fosis-blue-500', 'bg-fosis-green-500', 'bg-yellow-400', 'bg-red-400', 'bg-sky-400'];
    const pieces = useMemo(() => Array.from({ length: 60 }).map((_, i) => {
        const style: React.CSSProperties = {
            left: `${Math.random() * 100}%`,
            animation: `fall ${2.5 + Math.random() * 3}s ${Math.random() * 2}s linear infinite`,
            transform: `rotate(${Math.random() * 360}deg)`,
            width: `${Math.random() > 0.5 ? '0.5rem' : '0.3rem'}`,
            height: `${Math.random() > 0.5 ? '0.75rem' : '0.5rem'}`,
        };
        const colorClass = colors[i % colors.length];
        return <div key={i} className={`absolute rounded-sm ${colorClass}`} style={style} />;
    }), []);

    return <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">{pieces}</div>;
});


const AnimatedScore: React.FC<{ targetScore: number }> = ({ targetScore }) => {
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (score === targetScore) return;
        const duration = 800;
        let start: number | null = null;
        
        const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const newScore = Math.floor(easedProgress * targetScore);
            
            setScore(newScore);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                 setScore(targetScore);
            }
        };
        requestAnimationFrame(step);
    }, [targetScore]);

    return <>{score}</>;
}

interface QuizViewProps {
    goBack: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ goBack }) => {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showResults, setShowResults] = useState(false);
    
    // Store score for avatar progress
    const [, setLastScore] = useLocalStorage<number>('fosis_quiz_score', 0);
    const [, setTotalQuestions] = useLocalStorage<number>('fosis_quiz_total', 0);


    const shuffleAndSelectQuestions = useMemo(() => {
        return [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 7);
    }, []);

    useEffect(() => {
        setQuestions(shuffleAndSelectQuestions);
        setUserAnswers(new Array(shuffleAndSelectQuestions.length).fill(null));
    }, [shuffleAndSelectQuestions]);

    const handleAnswer = (answer: string) => {
        if (selectedOption) return;
        
        setSelectedOption(answer);
        
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = answer;
        setUserAnswers(newAnswers);

        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedOption(null);
            } else {
                setShowResults(true);
            }
        }, 1200);
    };

    const score = useMemo(() => {
        return questions.reduce((acc, question, index) => {
            return userAnswers[index] === question.correctAnswer ? acc + 1 : acc;
        }, 0);
    }, [questions, userAnswers]);
    
    useEffect(() => {
        if (showResults) {
            setLastScore(score);
            setTotalQuestions(questions.length);
        }
    }, [showResults, score, questions.length, setLastScore, setTotalQuestions]);


    const handleRestart = () => {
        const newQuestions = [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 7);
        setQuestions(newQuestions);
        setUserAnswers(new Array(newQuestions.length).fill(null));
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setShowResults(false);
    }
    

    if (questions.length === 0) {
        return <div className="p-8 text-center">Cargando quiz...</div>;
    }

    const renderResults = () => {
        const percentage = (score / questions.length) * 100;
        let resultMessage = { title: "", description: "" };
        if (percentage === 100) {
            resultMessage = { title: "¡Perfecto!", description: "¡Has dominado el conocimiento FOSIS! Excelente trabajo." };
        } else if (percentage >= 75) {
            resultMessage = { title: "¡Excelente!", description: "Tienes un gran conocimiento sobre el FOSIS. ¡Sigue así!" };
        } else if (percentage >= 50) {
            resultMessage = { title: "¡Buen Trabajo!", description: "Vas por buen camino. Un poco más de estudio y serás un experto." };
        } else {
            resultMessage = { title: "¡Sigue Aprendiendo!", description: "No te desanimes. Cada intento es una oportunidad para mejorar." };
        }


        return (
            <div className="w-full max-w-3xl mx-auto p-8 my-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-3xl shadow-soft-xl text-center border border-white/20 dark:border-slate-700/50 relative overflow-hidden animate-fade-in-up">
                {percentage >= 75 && <Confetti />}
                <div className="relative z-10">
                    <h2 className="text-4xl font-bold text-fosis-blue-900 dark:text-fosis-blue-300">{resultMessage.title}</h2>
                    <p className="text-slate-600 dark:text-slate-300 mt-2">{resultMessage.description}</p>
                    <div className="relative my-8 w-48 h-48 mx-auto">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle className="text-slate-200 dark:text-slate-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                            <circle
                                className="text-fosis-green-500"
                                strokeWidth="10"
                                strokeDasharray={2 * Math.PI * 45}
                                strokeDashoffset={(2 * Math.PI * 45) * (1 - percentage / 100)}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="45"
                                cx="50"
                                cy="50"
                                transform="rotate(-90 50 50)"
                                style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-fosis-green-600 dark:text-fosis-green-400"><AnimatedScore targetScore={score} /></span>
                            <span className="text-slate-500 dark:text-slate-400">de {questions.length}</span>
                        </div>
                    </div>
                    <div className="mt-8 text-left space-y-4">
                        {questions.map((q, index) => {
                            const userAnswer = userAnswers[index];
                            const isCorrect = userAnswer === q.correctAnswer;
                            return (
                                <div key={index} className={`p-4 border-l-4 rounded-lg ${isCorrect ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
                                    <p className="font-semibold text-slate-800 dark:text-slate-100">{index + 1}. {q.question}</p>
                                    <div className="flex items-center mt-2">
                                        {isCorrect ? (
                                            <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"/>
                                        ) : (
                                            <XCircleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0"/>
                                        )}
                                        <p className={isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                                            Tu respuesta: {userAnswer || "No respondida"}
                                        </p>
                                    </div>
                                    {!isCorrect && (
                                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 pl-7">
                                            Respuesta correcta: <span className="font-medium">{q.correctAnswer}</span>
                                        </p>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                    <button
                        onClick={handleRestart}
                        className="mt-10 px-8 py-3 bg-fosis-blue-800 text-white font-semibold rounded-xl shadow-soft-md hover:bg-fosis-blue-900 transition-all transform hover:scale-105"
                    >
                        Intentar de Nuevo
                    </button>
                </div>
            </div>
        );
    }
    
    const renderQuestion = () => {
        const currentQuestion = questions[currentQuestionIndex];
        return (
             <div className="w-full max-w-3xl mx-auto p-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-3xl shadow-soft-xl border border-white/20 dark:border-slate-700/50">
                <div className="mb-6 text-center">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pregunta {currentQuestionIndex + 1} de {questions.length}</p>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mt-2 overflow-hidden">
                        <div className="bg-gradient-to-r from-fosis-green-500 to-fosis-green-400 h-3 rounded-full transition-all duration-500" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
                    </div>
                </div>
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 text-center min-h-[6rem] flex items-center justify-center animate-fade-in-up" key={currentQuestionIndex}>{currentQuestion.question}</h2>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options.map((option, index) => {
                        const isSelected = selectedOption === option;
                        const isCorrect = option === currentQuestion.correctAnswer;
                        
                        let animationClass = '';
                        let buttonClass = 'border-slate-300 dark:border-slate-600 hover:border-fosis-blue-700 dark:hover:border-fosis-blue-400 hover:bg-fosis-blue-500/10';
                        if (isSelected) {
                             if (isCorrect) {
                                buttonClass = 'border-green-500 bg-green-500/20 ring-2 ring-green-400';
                                animationClass = 'animate-pop-in';
                            } else {
                                buttonClass = 'border-red-500 bg-red-500/20 ring-2 ring-red-400';
                                animationClass = 'animate-shake';
                            }
                        } else if (selectedOption) {
                            buttonClass = isCorrect ? 'border-green-500 bg-green-500/20' : 'border-slate-300 dark:border-slate-600 opacity-60';
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleAnswer(option)}
                                disabled={!!selectedOption}
                                className={`block w-full text-left p-5 border-2 rounded-xl transition-all duration-300 transform ${buttonClass} ${animationClass} ${!selectedOption && 'hover:scale-105'}`}
                            >
                                <span className="font-medium text-slate-700 dark:text-slate-200">{option}</span>
                            </button>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
             <div className="max-w-3xl mx-auto mb-8 text-center sm:text-left">
                <button onClick={goBack} className="flex items-center gap-2 px-4 py-2 mb-4 font-semibold text-fosis-blue-800 dark:text-fosis-blue-300 rounded-full hover:bg-fosis-blue-500/10 transition-colors">
                    <ChevronLeftIcon className="w-5 h-5"/>
                    Volver al Inicio
                </button>
                <h1 className="text-4xl font-bold text-fosis-blue-900 dark:text-white">Quiz FOSIS</h1>
                <p className="text-slate-600 dark:text-slate-300 mt-1">Evalúa tu conocimiento sobre la gestión de proyectos FOSIS.</p>
            </div>

            {showResults ? renderResults() : renderQuestion()}
        </div>
    );
};

export default QuizView;