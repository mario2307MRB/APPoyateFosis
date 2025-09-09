
import React, { useState, useEffect, useMemo } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import type { QuizQuestion } from '../types';
import { CheckCircleIcon, XCircleIcon } from './Icons';

const QuizView: React.FC = () => {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const shuffleAndSelectQuestions = useMemo(() => {
        return [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 7);
    }, []);

    useEffect(() => {
        setQuestions(shuffleAndSelectQuestions);
        setUserAnswers(new Array(shuffleAndSelectQuestions.length).fill(null));
    }, [shuffleAndSelectQuestions]);

    const handleAnswer = (answer: string) => {
        setSelectedOption(answer);
        
        setTimeout(() => {
            const newAnswers = [...userAnswers];
            newAnswers[currentQuestionIndex] = answer;
            setUserAnswers(newAnswers);

            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedOption(null);
            }
        }, 800);
    };

    const score = useMemo(() => {
        return questions.reduce((acc, question, index) => {
            return userAnswers[index] === question.correctAnswer ? acc + 1 : acc;
        }, 0);
    }, [questions, userAnswers]);
    
    const showResults = currentQuestionIndex === questions.length - 1 && selectedOption !== null;

    if (questions.length === 0) {
        return <div className="p-8 text-center">Cargando quiz...</div>;
    }

    if (showResults) {
        return (
            <div className="w-full max-w-3xl mx-auto p-8 my-8 bg-white rounded-2xl shadow-xl text-center border">
                <h2 className="text-4xl font-bold text-fosis-blue-dark">Resultados del Quiz</h2>
                <p className="mt-4 text-2xl text-neutral-700">
                    Tu puntaje: <span className="font-bold text-fosis-green-dark">{score}</span> de {questions.length}
                </p>
                 <div className="mt-8 text-left space-y-4">
                    {questions.map((q, index) => {
                        const userAnswer = userAnswers[index];
                        const isCorrect = userAnswer === q.correctAnswer;
                        return (
                            <div key={index} className={`p-4 border-l-4 rounded-lg ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                                <p className="font-semibold text-neutral-800">{index + 1}. {q.question}</p>
                                <div className="flex items-center mt-2">
                                    {isCorrect ? (
                                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"/>
                                    ) : (
                                        <XCircleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0"/>
                                    )}
                                    <p className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                                        Tu respuesta: {userAnswer || "No respondida"}
                                    </p>
                                </div>
                                {!isCorrect && (
                                    <p className="text-sm text-neutral-600 mt-1 pl-7">
                                        Respuesta correcta: <span className="font-medium">{q.correctAnswer}</span>
                                    </p>
                                )}
                            </div>
                        )
                    })}
                </div>
                <button
                    onClick={() => window.location.reload()} // Simple restart
                    className="mt-10 px-8 py-3 bg-fosis-blue text-white font-semibold rounded-lg shadow-md hover:bg-fosis-blue-dark transition-all transform hover:scale-105"
                >
                    Intentar de Nuevo
                </button>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-4xl font-bold text-neutral-800 text-center mb-8">Quiz FOSIS</h1>
            <div className="w-full max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-xl border">
                <div className="mb-6 text-center">
                    <p className="text-sm font-medium text-neutral-500">Pregunta {currentQuestionIndex + 1} de {questions.length}</p>
                    <div className="w-full bg-neutral-200 rounded-full h-3 mt-2 overflow-hidden">
                        <div className="bg-fosis-green h-3 rounded-full transition-all duration-500" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
                    </div>
                </div>
                <h2 className="text-2xl font-semibold text-neutral-800 text-center min-h-[6rem] flex items-center justify-center">{currentQuestion.question}</h2>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options.map((option, index) => {
                        const isSelected = selectedOption === option;
                        const isCorrect = option === currentQuestion.correctAnswer;
                        
                        let buttonClass = 'border-neutral-300 hover:border-fosis-blue hover:bg-fosis-blue/10';
                        if (isSelected) {
                            buttonClass = isCorrect ? 'border-green-500 bg-green-100 ring-2 ring-green-400' : 'border-red-500 bg-red-100 ring-2 ring-red-400';
                        } else if (selectedOption) {
                            buttonClass = isCorrect ? 'border-green-500 bg-green-100' : 'border-neutral-300';
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleAnswer(option)}
                                disabled={!!selectedOption}
                                className={`block w-full text-left p-4 border-2 rounded-lg transition-all duration-300 transform ${buttonClass} ${!selectedOption && 'hover:scale-105'}`}
                            >
                                <span className="font-medium text-neutral-700">{option}</span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default QuizView;
