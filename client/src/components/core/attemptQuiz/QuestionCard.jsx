import React from 'react';

const QuestionCard = React.memo(({ question, onAnswerChange }) => {
    const handleAnswerChange = (event) => {
        const { value } = event.target;

        let answer;
        if (question.questionType === 'FIB') {
            // For FIB, use the plain text answer
           
            answer = value.toLowerCase().trim();
        } else {
            // For MCQ, use the ID of the selected option
            answer = value;
        }

        // Pass the correct answer (plain text or ID) to parent
        onAnswerChange(answer, question.questionType);

        console.log(answer);
    };

    return (
        <div className="border border-slate-600 bg-[#e0fbfc] w-full p-3 rounded-lg my-3">
            <h3 className="border-b pb-3 mb-3 border-slate-600 text-2xl text-center">
                {question.questionText}
            </h3>
            {question.questionType === 'MCQ' ? (
                <span className="flex flex-col md:flex-row gap-6">
                    {question.options.map((option) => (
                        <label
                            key={option._id}
                            className="flex gap-3 cursor-pointer items-center text-2xl"
                        >
                            <input
                                type="radio"
                                name={question._id}
                                value={option._id}
                                onChange={handleAnswerChange}
                            />
                            {option.text}
                        </label>
                    ))}
                </span>
            ) : (
                <label className="text-2xl">
                    <input
                        type="text"
                        name={question._id}
                        placeholder="Enter your answer here"
                        className="w-full p-2 border rounded-md text-xl"
                        onChange={handleAnswerChange}
                    />
                </label>
            )}
        </div>
    );
});

export default QuestionCard;
