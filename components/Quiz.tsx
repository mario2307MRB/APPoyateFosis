
import React, { useState, useEffect, useMemo } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import type { QuizQuestion } from '../types';
import { CheckCircleIcon, XCircleIcon } from './Icons';

const QuizView: React.FC = () => {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [showResults, setShowResults] = useState(false);

    const shuffleAndSelectQuestions = useMemo(() => {
        return [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 7);
    }, []);

    useEffect(() => {
        setQuestions(shuffleAndSelectQuestions);
    }, [shuffleAndSelectQuestions]);

    const handleAnswer = (answer: string) => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = answer;
        setUserAnswers(newAnswers);

        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                setShowResults(true);
            }
        }, 500); // Short delay to show selection
    };

    const restartQuiz = () => {
        setQuestions([...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 7));
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setShowResults(false);
    };

    const score = useMemo(() => {
        return questions.reduce((acc, question, index) => {
            return userAnswers[index] === question.correctAnswer ? acc + 1 : acc;
        }, 0);
    }, [questions, userAnswers]);

    if (questions.length === 0) {
        return <div>Cargando quiz...</div>;
    }

    if (showResults) {
        return (
            <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-2xl text-center">
                <h2 className="text-3xl font-bold text-fosis-blue-dark">Resultados del Quiz</h2>
                <p className="mt-4 text-xl text-gray-700">
                    Tu puntaje: <span className="font-bold text-fosis-green-dark">{score}</span> de {questions.length}
                </p>
                <div className="mt-6 text-left space-y-4">
                    {questions.map((q, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                            <p className="font-semibold">{index + 1}. {q.question}</p>
                            <div className="flex items-center mt-2">
                                {userAnswers[index] === q.correctAnswer ? (
                                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2"/>
                                ) : (
                                    <XCircleIcon className="w-5 h-5 text-red-500 mr-2"/>
                                )}
                                <p className={userAnswers[index] === q.correctAnswer ? 'text-green-600' : 'text-red-600'}>
                                    Tu respuesta: {userAnswers[index] || "No respondida"}
                                </p>
                            </div>
                            {userAnswers[index] !== q.correctAnswer && (
                                <p className="text-sm text-gray-600 mt-1">
                                    Respuesta correcta: <span className="font-medium">{q.correctAnswer}</span>
                                </p>
                            )}
                        </div>
                    ))}
                </div>
                <button
                    onClick={restartQuiz}
                    className="mt-8 px-6 py-3 bg-fosis-blue text-white rounded-lg shadow-md hover:bg-fosis-blue-dark transition-transform transform hover:scale-105"
                >
                    Intentar de Nuevo
                </button>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Quiz FOSIS</h1>
            <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-2xl">
                <div className="mb-4 text-center">
                    <p className="text-sm text-gray-500">Pregunta {currentQuestionIndex + 1} de {questions.length}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div className="bg-fosis-green h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
                    </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 text-center min-h-[6rem]">{currentQuestion.question}</h2>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(option)}
                            className={`block w-full text-left p-4 border-2 rounded-lg transition-colors duration-300
                                ${userAnswers[currentQuestionIndex] === option ? 
                                    (option === currentQuestion.correctAnswer ? 'border-green-500 bg-green-100' : 'border-red-500 bg-red-100')
                                    : 'border-gray-300 hover:border-fosis-blue hover:bg-fosis-blue/10'}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuizView;
