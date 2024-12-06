import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Navbar from '../components/Navbar.jsx'
const QuizResults = () => {
    const location = useLocation();
    const { score, total } = location.state || { score: 0 };
    const navigate = useNavigate();

    return (
        <>
        <Navbar />
        <div className='min-h-[80vh] flex flex-col gap-5 justify-center items-center '>
            <div className='flex flex-col gap-y-3 max-w-[480px] shadow-lg shadow-blue-300 border p-10 rounded-lg  bg-opacity-20 backdrop-blur-lg'>
                <h1 className='text-3xl border-b border-slate-600 pb-5'>Quiz Results</h1>
                <p className='text-2xl mt-4 flex items-center gap-3 font-thin'>Your Score: <span className='font-semibold'><span className={`${score / total >= 0.4 ? "text-green-700" : "text-red-700"} `}>{score}</span> / {total}</span> </p>
            </div>
            <Button className='w-max' onClick={() => navigate("/")}>Back to Home</Button>
        </div>
        </>
    );
};

export default QuizResults;
