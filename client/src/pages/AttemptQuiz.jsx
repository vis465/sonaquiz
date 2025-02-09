import { useEffect, useState } from 'react';
import React from 'react';
import { apiConnector } from '../services/apiConnector';
import { useParams } from 'react-router-dom';
import { questionEndpoints, quizEndpoints } from '../services/APIs';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import QuizQuestions from '../components/core/attemptQuiz/QuizQuestions';

const AttemptQuiz = () => {
    const [quizDetails, setQuizDetails] = useState(null);
    const [quizQuestions, setQuizQuestions] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useSelector(state => state.auth);
    const { id: quizId } = useParams();

    // Fetch Quiz Questions
    const fetchQuizQuestions = async () => {
        let data={role:'student'}
        try {
            const response = await apiConnector("POST", `${questionEndpoints.GET_QUIZ_QUESTIONS}/${quizId}`, data, {
                Authorization: `Bearer ${token}`
            });

            console.log("Fetched quizQuestions:", response?.data?.data);
            setQuizQuestions(response?.data?.data);
        } catch (error) {
            console.error('Error fetching quiz questions:', error);
        }
    };

    // Fetch Quiz Details
    const fetchQuizDetails = async () => {
        try {
            const response = await apiConnector("GET", `${quizEndpoints.GET_QUIZ_DETAILS}/${quizId}`, null, {
                Authorization: `Bearer ${token}`
            });

            console.log("Fetched quizDetails:", response?.data?.data);
            setQuizDetails(response?.data?.data);
        } catch (error) {
            console.error('Error fetching quiz details:', error);
        }
    };

    useEffect(() => {
        (async () => {
            await fetchQuizDetails();
            await fetchQuizQuestions();
            setLoading(false);
        })();
    }, [quizId]);

    if (loading) return <h1>Loading...</h1>;

    return (
        <section className='min-h-[90vh] py-10'>
            <div className='border py-3 px-5 rounded-lg bg-[#e0fbfc] border-slate-600 mt-20'>
                <span className='flex flex-col md:flex-row gap-x-5 gap-y-1 items-center justify-between font-thin mb-3'>
                    <h3 className='text-base md:text-2xl font-semibold'>{quizDetails?.title}</h3>
                    <p className='text-black text-2xl'>Time: {quizDetails?.timer} minutes</p>
                </span>
                <span className='flex flex-col md:flex-row justify-between items-center gap-x-5 gap-y-1 '>
                    <p className='text-2xl'>{quizDetails?.description}</p>
                    <p className='text-2xl'>{quizDetails?.instructions}</p>
                    <span className='flex gap-3 text-black'>
                        <p>Created by - {quizDetails?.createdBy?.username}</p>
                        <p>{formatDistanceToNow(new Date(quizDetails.createdAt), { addSuffix: true })}</p>
                    </span>
                </span>
            </div>
            <QuizQuestions quizDetails={quizDetails} quizQuestions={quizQuestions} />
        </section>
    );
};

export default AttemptQuiz;
