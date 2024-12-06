import React from 'react';

const QuestionCard = React.memo(({ question, onAnswerChange }) => {
    const handleOptionChange = (event) => {
        onAnswerChange(question._id, event.target.value);
    };

    return (
        <div className='border border-slate-600 bg-[#e0fbfc] w-full p-3 rounded-lg my-3 '>
            <h3 className='border-b pb-3 mb-3 border-slate-600 text-2xl text-center'>{question.questionText} </h3>
            <span className='flex flex-col md:flex-row gap-6'>
                {question.options.map((option) => (
                    <label key={option._id} className='flex gap-3 cursor-pointer items-center text-2xl'>
                        <input
                            type='radio'
                            name={question._id}
                            value={option._id}
                            onChange={handleOptionChange}
                        />
                        {option.text}
                    </label>
                ))}
            </span>
        </div>
    );
});

export default QuestionCard;
