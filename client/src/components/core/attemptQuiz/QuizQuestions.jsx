import React, { useState, useEffect, useCallback } from 'react';
import Button from '../../Button';
import QuestionCard from './QuestionCard';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiConnector } from '../../../services/apiConnector';
import { quizEndpoints } from "../../../services/APIs";
import { toast } from 'react-toastify';

const QuizQuestions = ({ quizDetails, quizQuestions }) => {
    const [quizStarted, setQuizStarted] = useState(false);
    const [remainingTime, setRemainingTime] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const { token, user } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (quizDetails?.timer) {
            setRemainingTime(quizDetails.timer * 60);
        }
    }, [quizDetails]);

    useEffect(() => {
        let timer;
        if (quizStarted && remainingTime > 0) {
            timer = setInterval(() => setRemainingTime((prev) => prev - 1), 1000);
        } else if (quizStarted && remainingTime === 0) {
            clearInterval(timer);
            alert('Time is up!');
            submitQuiz();
        }
        return () => clearInterval(timer);
    }, [quizStarted, remainingTime]);

    const handleAnswerChange = useCallback((questionId, selectedOption) => {
        setUserAnswers((prevAnswers) =>
            prevAnswers.map((answer) =>
                answer.questionId === questionId
                    ? { ...answer, selectedOption }
                    : answer
            )
        );
    }, []);

    const startQuiz = async () => {
        try {
            const postData = {
                quizId: quizDetails._id,
                userID: user.id,
            };
            await apiConnector('POST', quizEndpoints.POST_USER_ATTEMPTS, postData, {
                Authorization: `Bearer ${token}`,
            });

            if (user.attemptedQuizzes?.includes(quizDetails._id)) {
                toast.error('You have already attempted this quiz!');
                return;
            }

            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            }
            setQuizStarted(true);
        } catch (error) {
            console.error('Error starting quiz:', error);
        }
    };

    const submitQuiz = async () => {
        try {
            const response = await apiConnector(
                'POST',
                `${quizEndpoints.ATTEMMP_QUIZ}/${quizDetails._id}/attempt`,
                { quizId: quizDetails._id, answers: userAnswers },
                { Authorization: `Bearer ${token}` }
            );
            navigate('/quiz-results', {
                state: { score: response.data.score, total: quizQuestions?.length },
            });
        } catch (error) {
            console.error('Error submitting quiz:', error);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const previousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    return (
        <div className='flex py-5 border min-h-[70vh] px-5 justify-center items-start mt-5 rounded-lg bg-slate-900 border-slate-600'>
            {!quizStarted ? (
                <Button className='w-max self-center' onClick={startQuiz}>
                    Start Quiz
                </Button>
            ) : (
                <div className='w-full flex flex-col'>
                    <h2 className='border border-slate-600 py-2 px-3 rounded-lg text-center md:text-end'>
                        Time Remaining: <span className='text-red-500 ml-2'>{formatTime(remainingTime)}</span>
                    </h2>
                    <div className='min-h-[50vh]'>
                        {quizQuestions && quizQuestions.length > 0 && (
                            <QuestionCard
                                key={quizQuestions[currentQuestionIndex]._id}
                                question={quizQuestions[currentQuestionIndex]}
                                onAnswerChange={(option) =>
                                    handleAnswerChange(quizQuestions[currentQuestionIndex]._id, option)
                                }
                            />
                        )}
                    </div>
                    <div className='flex justify-between mt-4'>
                        <Button
                            className='w-max'
                            onClick={previousQuestion}
                            disabled={currentQuestionIndex === 0}
                        >
                            Previous
                        </Button>
                        {currentQuestionIndex < quizQuestions.length - 1 && (
                            <Button
                                className='w-max'
                                onClick={nextQuestion}
                            >
                                Next
                            </Button>
                        )}
                    </div>
                    <Button className='w-max self-end mt-4' onClick={submitQuiz}>
                        Submit
                    </Button>
                </div>
            )}
        </div>
    );
};

export default QuizQuestions;
