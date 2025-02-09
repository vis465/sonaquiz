import React, { useState, useEffect, useCallback, useRef } from 'react';
import Button from '../../Button';
import QuestionCard from './QuestionCard';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiConnector } from '../../../services/apiConnector';
import { quizEndpoints } from '../../../services/APIs';
import { toast } from 'react-toastify';

const QuizQuestions = ({ quizDetails, quizQuestions }) => {
    const [quizStarted, setQuizStarted] = useState(false);
    const [sectionTimers, setSectionTimers] = useState({});
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const { token, user } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const timerRef = useRef(null);

    const sections = Object.keys(quizQuestions || {});
    const totalSections = sections.length;
    const sectionTime = quizDetails?.timer ? Math.floor((quizDetails.timer * 60) / totalSections) : 0;

    const moveToNextSection = useCallback(() => {
        clearInterval(timerRef.current);
        if (currentSectionIndex < totalSections - 1) {
            setCurrentSectionIndex(prev => prev + 1);
            setSectionTimers(prev => ({
                ...prev,
                [sections[currentSectionIndex + 1]]: prev[sections[currentSectionIndex + 1]] || sectionTime,
            }));
        } else {
            submitQuiz();
        }
    }, [currentSectionIndex, totalSections, sectionTime, sections]);

    const moveToPreviousSection = () => {
        if (currentSectionIndex > 0) {
            clearInterval(timerRef.current);
            setCurrentSectionIndex(prev => prev - 1);
        }
    };

    useEffect(() => {
        if (quizStarted && sectionTimers[sections[currentSectionIndex]] > 0) {
            timerRef.current = setInterval(() => {
                setSectionTimers(prev => {
                    if (prev[sections[currentSectionIndex]] <= 1) {
                        clearInterval(timerRef.current);
                        moveToNextSection();
                        return prev;
                    }
                    return {
                        ...prev,
                        [sections[currentSectionIndex]]: prev[sections[currentSectionIndex]] - 1,
                    };
                });
            }, 1000);
        }

        return () => clearInterval(timerRef.current);
    }, [quizStarted, currentSectionIndex, sectionTimers, sections, moveToNextSection]);

    const handleAnswerChange = (questionId, answer, questionType) => {
        setUserAnswers(prev => {
            const updated = prev.filter(ans => ans.questionId !== questionId);
            return [...updated, { questionId, answer }];
        });
    };

    const startQuiz = async () => {
        try {
            if (user.attemptedQuizzes?.includes(quizDetails._id)) {
                toast.error('You have already attempted this quiz!');
                return;
            }
            await apiConnector('POST', quizEndpoints.POST_USER_ATTEMPTS, { quizId: quizDetails._id, userID: user.id }, { Authorization: `Bearer ${token}` });
            document.documentElement.requestFullscreen?.();
            setQuizStarted(true);
            setSectionTimers({ [sections[0]]: sectionTime });
        } catch (error) {
            console.error('Error starting quiz:', error);
        }
    };

    const submitQuiz = async () => {
        try {

            let data={ quizId: quizDetails._id, answers: userAnswers }
            console.log(data)
            console.log(`${quizEndpoints.ATTEMP_QUIZ}/${quizDetails._id}/attempt`)
            await apiConnector('POST', `${quizEndpoints.ATTEMP_QUIZ}/${quizDetails._id}/attempt`, { quizId: quizDetails._id, answers: userAnswers }, { Authorization: `Bearer ${token}` });
            console.log("posted")

            navigate('/quiz-results');
        } catch (error) {
            console.error('Error submitting quiz:', error);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const getCurrentSectionAnswers = () => {
        const currentSectionQuestions = quizQuestions[sections[currentSectionIndex]];
        const answeredQuestions = userAnswers.filter(answer => 
            currentSectionQuestions.some(question => question._id === answer.questionId)
        );
        return answeredQuestions.length === currentSectionQuestions.length;
    };

    // Get previously submitted answer for a question
    const getSubmittedAnswer = (questionId) => {
        const answer = userAnswers.find(ans => ans.questionId === questionId);
        return answer ? answer.answer : null;
    };

    return (
        <div className='flex flex-col py-5 border min-h-[70vh] px-5 justify-center items-start mt-5 rounded-lg bg-slate-900 border-slate-600'>
            {!quizStarted ? (
                <Button className='w-max self-center' onClick={startQuiz}>Start Quiz</Button>
            ) : (
                <>
                    <div className='flex gap-2 mb-4'>
                        {sections.map((section, index) => (
                            <Button
                                key={index}
                                className={`px-4 py-2 rounded-md ${currentSectionIndex === index ? 'bg-blue-500 text-white' : 'bg-gray-500 text-gray-300'} `}
                                disabled={index !== currentSectionIndex}
                            >
                                {section}
                            </Button>
                        ))}
                    </div>
                    <h2 className='border border-slate-600 py-2 px-3 rounded-lg text-center md:text-end'>
                        Time Remaining: <span className='text-red-500 ml-2'>{formatTime(sectionTimers[sections[currentSectionIndex]] || 0)}</span>
                    </h2>
                    <h1 className='text-lg font-semibold text-white mb-2'>{sections[currentSectionIndex]}</h1>
                    <div className='min-h-[50vh]'>
                        {quizQuestions[sections[currentSectionIndex]].map((question) => (
                            <QuestionCard
                                key={question._id}
                                question={question}
                                onAnswerChange={(answer) => handleAnswerChange(question._id, answer, question.questionType)}
                                disabled={sectionTimers[sections[currentSectionIndex]] === 0}
                                submittedAnswer={getSubmittedAnswer(question._id)}
                            />
                        ))}
                    </div>
                    <div className='flex justify-between w-full mt-4'>
                        <Button 
                            className='w-max' 
                            onClick={moveToPreviousSection}
                            disabled={currentSectionIndex === 0}
                        >
                            Previous Section
                        </Button>

                        {currentSectionIndex === totalSections - 1 ? (
                            <Button 
                                className='w-max' 
                                onClick={submitQuiz} 
                             //  disabled={!getCurrentSectionAnswers()}
                            >
                                Submit
                            </Button>
                        ) : (
                            <Button 
                                className='w-max' 
                                onClick={moveToNextSection} 
                              //  disabled={!getCurrentSectionAnswers()}
                            >
                                Next Section
                            </Button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default QuizQuestions;