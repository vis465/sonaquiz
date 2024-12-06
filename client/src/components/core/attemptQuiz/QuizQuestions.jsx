import React, { useState, useEffect, useCallback } from 'react';
import Button from '../../Button';
import QuestionCard from './QuestionCard';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiConnector } from '../../../services/apiConnector';
import { quizEndpoints } from "../../../services/APIs";
import { setUser } from "../../../slices/AuthSlice";
import { toast } from 'react-toastify';

const QuizQuestions = ({ quizDetails, quizQuestions }) => {
    const [quizStarted, setQuizStarted] = useState(false);
    const [remainingTime, setRemainingTime] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const { token, user } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    

    // Set timer based on quiz details
    useEffect(() => {
        if (quizDetails?.timer) {
            setRemainingTime(quizDetails.timer * 60); // Convert to seconds
        }
    }, [quizDetails]);

    useEffect(() => {
        let timer;
        if (quizStarted && remainingTime > 0) {
            timer = setInterval(() => {
                setRemainingTime(prevTime => prevTime - 1);
            }, 1000);
        } else if (quizStarted && remainingTime === 0) {
            clearInterval(timer);
            alert('Time is up!');
            submitQuiz();
        }
        return () => clearInterval(timer);
    }, [quizStarted, remainingTime]);

    // Handle answer change
    const handleAnswerChange = useCallback((questionId, selectedOption) => {
        setUserAnswers(prevAnswers => {
            const existingAnswerIndex = prevAnswers.findIndex(
                (answer) => answer.questionId === questionId
            );
            if (existingAnswerIndex >= 0) {
                prevAnswers[existingAnswerIndex].selectedOption = selectedOption;
            } else {
                prevAnswers.push({ questionId, selectedOption });
            }
            return [...prevAnswers];
        });
    }, []);

    // Start quiz function
    const startQuiz = () => {
        // Check if the user has already attempted the quiz
        if (user.attemptedQuizzes?.includes(quizDetails._id)) {
            toast.error('You have already attempted this quiz!');
            return;
        }

        // Request fullscreen on quiz start
        const element = document.documentElement;
        const fullscreenMethods = [
            'requestFullscreen',
            'mozRequestFullScreen',  // Firefox
            'webkitRequestFullscreen', // Chrome, Safari, Opera
            'msRequestFullscreen',  // IE/Edge
        ];

        // Attempt fullscreen request using the appropriate method for the browser
        for (const method of fullscreenMethods) {
            if (element[method]) {
                element[method]();
                break;
            }
        }

        setQuizStarted(true);
        // let postData
        // if (quizStarted){
        //     fetch("http://localhost:3000/api/submit", {
        //         method: "POST",
        //         headers: {
        //           "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify(postData),
        //       })
        //         .then((res) => {
        //           if (!res.ok) {
        //             throw new Error(`HTTP error! status: ${res.status}`);
        //           }
        //           return res.json();
        //         })
        //         .then((data) => {
        //           setResponse(data); // Set the response data
        //         })
        //         .catch((error) => {
        //           console.error("Error:", error);
        //         });
            
        // }
    };

    const submitQuiz = async () => {
        try {
            const response = await apiConnector(
                'POST',
                `${quizEndpoints.ATTEMMP_QUIZ}/${quizDetails._id}/attempt`,
                {
                    quizId: quizDetails._id,
                    answers: userAnswers,
                    
                },
                {
                    Authorization: `Bearer ${token}`,
                }
            );
            // dispatch(setUser({ ...user, attemptedQuizzes: [...(user.attemptedQuizzes || []), quizDetails._id] }));
            navigate('/quiz-results', { state: { score: response.data.score, total: quizQuestions?.length } });
        } catch (error) {
            console.error('Error submitting quiz:', error);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Logout function with full-screen exit
    const logout = () => {
        // Exit fullscreen when the user logs out
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
        toast.info('Logged out due to inactivity or tab switch.');
        // Clear user data and navigate to login
        // dispatch(setUser(null)); // Clear user data
        
        // navigate('/login'); // Redirect to login page
    };

    // Event listeners for tab switch and browser focus change
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                logout();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return (
        <div className='flex py-5 border min-h-[70vh] px-5 justify-center items-start mt-5 rounded-lg bg-slate-900 border-slate-600'>
            {!quizStarted ? (
                <Button className='w-max self-center' onClick={startQuiz}>Start Quiz</Button>
            ) : (
                <div className='w-full flex flex-col'>
                    <h2 className='border border-slate-600 py-2 px-3 rounded-lg text-center md:text-end'>Time Remaining: <span className='text-red-500 ml-2'>{formatTime(remainingTime)}</span></h2>
                    <div className='min-h-[50vh]'>
                        {quizQuestions && quizQuestions.map((ques) => (
                            <QuestionCard
                                key={ques._id}
                                question={ques}
                                onAnswerChange={handleAnswerChange}
                            />
                        ))}
                    </div>
                    <Button className='w-max self-end' onClick={submitQuiz}>Submit</Button>
                </div>
            )}
        </div>
    );
};
export default QuizQuestions;
