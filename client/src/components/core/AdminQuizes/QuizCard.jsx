import React, { useState } from 'react'
import Score from './Score';
import { IoIosArrowUp } from "react-icons/io";
import Button from '../../Button';
import { useDispatch } from 'react-redux';
import { setEdit, setQuiz } from '../../../slices/QuizSlice';
import { useNavigate } from 'react-router-dom';

const QuizCard = ({ quiz, handleDeleteQuiz }) => {
    console.log(quiz)

    const [showDetails, setShowDetails] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleEditQuiz = () => {
        dispatch(setQuiz(quiz))
        dispatch(setEdit(true))
        navigate(`/dashboard/edit-quiz/${quiz._id}`)
    }

    return (
        <>
            <div className='py-3 px-5 border border-slate-600 bg-[#e0fbfc] hover:border-slate-400 transition-all duration-300 rounded-lg relative'>
                <span onClick={() => setShowDetails(!showDetails)} className='border-b cursor-pointer pb-3 mb-2 flex justify-between items-center border-slate-600'>
                    <h1 className='text-4xl font-semibold '>{quiz.title}</h1>
                    <p className={`${!showDetails ? "rotate-180" : "rotate-0"} transition-all duration-300`}><IoIosArrowUp /></p>
                </span>
                <div className='flex flex-col md:flex-row gap-y-3 justify-between '>
                    <span>
                        <p className='font-thin text-2xl'>Description : {quiz.description}</p>
                        <p className='font-thin text-2xl'>Time : {quiz.timer} minutes</p>
                    </span>
                    <span className='flex gap-3 justify-end  items-center'>
                        <Button onClick={() => handleDeleteQuiz(quiz._id)} className='w-max' active={false} >Delete</Button>
                        <Button onClick={handleEditQuiz} className='w-max' active >Edit</Button>
                    </span>
                </div>
                {
                    showDetails &&
                    <Score quiz={quiz} />
                }
            </div>
        </>
    )
}

export default QuizCard