    import { useEffect, useState } from 'react'
    import React from 'react'
    import { apiConnector } from "../services/apiConnector"
    import { useParams } from 'react-router-dom'
    import { questionEndpoints, quizEndpoints } from '../services/APIs'
    import { useSelector } from 'react-redux'
    import { formatDistanceToNow } from 'date-fns'
    import QuizQuestions from '../components/core/attemptQuiz/QuizQuestions'

    const AttemptQuiz = () => {

        const [quizDetails, setQuizDetails] = useState(null);
        const [quizQuestions, setQuisQuestions] = useState(null);
        const [detailsLoading, setDetailsLoading] = useState(true);
        const [questionsLoading, setQuestionsLoading] = useState(true);

        const { token } = useSelector(state => state.auth)

        const { id: quizId } = useParams();

        const fetchQuizQuestions = async () => {
            setQuestionsLoading(true);
            try {
                const response = await apiConnector("GET", `${questionEndpoints.GET_QUIZ_QUESTIONS}/${quizId}`, null, {
                    Authorization: `Bearer ${token}`
                })

                

                setQuisQuestions(response?.data?.data);
                console.log("quizQuestions",quizQuestions)
            } catch (error) {
                console.log('Error fetching quiz details:', error);
            } finally {
                setQuestionsLoading(false);
            }
        };

        const fetchQuizDetails = async () => {
            try {
                setDetailsLoading(true);
                const response = await apiConnector("GET", `${quizEndpoints.GET_QUIZ_DETAILS}/${quizId}`, null, {
                    Authorization: `Bearer ${token}`
                })

                

                setQuizDetails(response?.data?.data);
                console.log("quizDetails",quizDetails)
            } catch (error) {
                console.log('Error fetching quiz details:', error);
            } finally {
                setDetailsLoading(false);
            }
        };

        useEffect(() => {
            fetchQuizDetails();
            fetchQuizQuestions();
        }, [quizId]);

        return (
            <section className=' min-h-[90vh] py-10'>
                <div className='border py-3 px-5 rounded-lg bg-[#e0fbfc] border-slate-600 mt-20'>
                    {
                        questionsLoading || detailsLoading ? <h1>Loading...</h1> :
                            <>
                                <span className='flex flex-col md:flex-row gap-x-5 gap-y-1 items-center justify-between font-thin mb-3'>
                                    <h3 className='text-base md:text-2xl font-semibold line-clamp-2'>{quizDetails?.title}</h3>
                                    <p className='text-black w-fit text-nowrap text-2xl'>Time : {quizDetails?.timer} minutes</p>
                                </span>
                                <span className='flex flex-col md:flex-row justify-between items-center gap-x-5 gap-y-1 '>
                                    <p className='font-thin mt-1 line-clamp-2 text-2xl'>{quizDetails?.description} </p>
                                    <p className='font-thin mt-1 line-clamp-2 text-2xl'>{quizDetails?.instructions} </p>
                                    <span className='flex gap-3 text-black w-fit text-nowrap'>
                                        <p>Created by - {quizDetails?.createdBy?.username}</p>
                                        <p>{formatDistanceToNow(new Date(quizDetails.createdAt), { addSuffix: true })}</p>
                                    </span>
                                </span>
                            </>
                    }
                </div>
                <div>
                    <QuizQuestions quizDetails={quizDetails} quizQuestions={quizQuestions} />
                </div>
            </section>
        )
    }

    export default AttemptQuiz