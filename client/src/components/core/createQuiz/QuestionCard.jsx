import React from 'react'
import Button from '../../Button';

const QuestionCard = ({ question, deleteQuestionHandler }) => {
function renderfib() {
  question.map(items=>
    console.log(items)
  )
}

  return (
    <div>
      <div className='space-y-3 border border-slate-600 bg-white px-5 py-3 rounded-lg'>
        <span className='flex justify-between gap-5 border-b pb-3 border-slate-600  '>
          <h4 className='text-xl line-clamp-1 font-semibold'>{question.questionText}</h4>
        </span>
        {question.questionType === "MCQ" ? (
          <div>
            {question.options.map(option => (
              <>
              {option.imageUrl?(
                <div
                className='border border-slate-600 bg-[#e0fbfc] mt-2 p-3 rounded-lg relative overflow-hidden '
                key={option._id}
                style={{ color: option.isCorrect ? "green" : "black", fontWeight: option.isCorrect ? "bold" : "normal" }}
              >
                <img
                        src={option.imageUrl}
                        alt="Question"
                        className="max-w-[200px] max-h-[200px] object-contain rounded-md"
                    /> {option.isCorrect && "(Correct)"}
              </div>
              ):(
                <div
                className='border border-slate-600 bg-[#e0fbfc] mt-2 p-3 rounded-lg relative overflow-hidden'
                key={option._id}
                style={{ color: option.isCorrect ? "green" : "black", fontWeight: option.isCorrect ? "bold" : "normal" }}
              >
                {option.text} {option.isCorrect && "(Correct)"}
              </div>
              )}
              
              </>
            ))}
          </div>
        ) : (
          <div>
            {
              question.answers.map(answers =>
                <div key={answers._id}>
                  <p                 
                  className='border border-slate-600 bg-[#e0fbfc] mt-2 p-3 rounded-lg relative overflow-hidden'
                  style={{ color: answers.isCorrect ? "green" : "black", fontWeight: answers.isCorrect ? "bold" :"normal"}}
                  >{answers.text} {answers.isCorrect && "(Correct)"}</p>
                  </div>
              )
            }
          </div>
        )}
        <div className='flex justify-end py-3'>
          <Button
            onClick={() => deleteQuestionHandler(question)}
            className='w-max h-max'
            active={false}
          >delete</Button>
        </div>
      </div>
    </div>
  )
}

export default QuestionCard