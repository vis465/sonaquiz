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
        // console.log(answer);
    };

    return (
        <div className="border border-slate-600 bg-[#e0fbfc] w-full p-3 rounded-lg my-3">
            {/* Render question text */}
            {question.questionText && (
                <h3 className="border-b pb-3 mb-3 border-slate-600 text-2xl text-center">
                    {question.questionText}
                </h3>
            )}
    
            {/* Render question image if present */}
            {question.questionFormat === 'IMAGE' && question.questionImage && (
                <div className="flex justify-center items-center mb-3">
                    <img
                        src={question.questionImage}
                        alt="Question"
                        className="max-w-[200px] max-h-[200px] object-contain rounded-md"
                    />
                </div>
            )}
    
            {/* Render options or input field based on question type */}
            {question.questionType === 'MCQ' ? (
                <div className="flex flex-col md:flex-row gap-6">
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
                                className="mr-2"
                            />
                            {option.imageUrl ? (
                                <img
                                    src={option.imageUrl}
                                    alt="Option"
                                    className="max-w-[100px] max-h-[100px] object-contain rounded-md"
                                />
                            ) : (
                                <span>{option.text}</span>
                            )}
                        </label>
                    ))}
                </div>
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
})    
export default QuestionCard;
