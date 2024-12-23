import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { createQuiz, updateQuiz } from '../services/operations/QuizAPIs';
import { setEdit, setQuiz } from '../slices/QuizSlice';
import Button from '../components/Button';
import RequiredError from '../components/RequiredError';
import toast from 'react-hot-toast';
import { IoMdArrowForward } from 'react-icons/io';

import departments from '../components/departments.json'
const CreateQuiz = () => {
  const [loading, setLoading] = useState(false);
  // const departments=departments.sort()
  // Redux and Routing Hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id: quizId } = useParams();

  // Redux State
  const { token } = useSelector((state) => state.auth);
  const { edit, quiz } = useSelector((state) => state.quiz);

  // React Hook Form
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  const year = [1, 2, 3, 4]
  const submitHandler = async (data) => {
    console.log("datasentfromFE",data)
    setLoading(true);
    try {
        // Ensure instructions are not empty
        data.instructions = data.instructions || "Attempt all the questions with caution. Once you submit, you cannot go back.";

        if (edit) {
            const response = await updateQuiz(data, token, quizId);
            if (response) {
                reset(); // Reset form on successful update
                toast.success("Quiz Updated Successfully");
                navigate(`/dashboard/create-quiz/${response._id}`);
            }
        } else {
            const response = await createQuiz(data, token);
            if (response) {
                reset(); // Reset form on successful creation
                dispatch(setQuiz(response));
                toast.success("Quiz Created Successfully");
                navigate(`/dashboard/create-quiz/${response._id}`);
            }
        }
    } catch (error) {
        console.error(error);
        toast.error("An error occurred while processing the quiz.");
    } finally {
        setLoading(false);
    }
  };

  // Populate form fields when editing
  useEffect(() => {
    if (edit && quiz) {
      setValue("title", quiz.title || "");
      setValue("description", quiz.description || "");
      setValue("timer", quiz.timer || "");
      setValue("instructions", quiz.instructions || "attempt all the questions with caution, once you submit question, you cannot come back ");
      setValue("attempts", quiz.maxAttempts)
      setValue("year",quiz.year)
      setValue("departmet",quiz.department)
      
    }

    // Reset form when navigating to the create-quiz route
    if (location.pathname === "/dashboard/create-quiz" && edit) {
      dispatch(setEdit(false));
      dispatch(setQuiz(null));
      reset();
    }
  }, [edit, quiz, setValue, location.pathname, dispatch, reset]);

  return (
    <div className="min-h-[70vh] flex justify-center items-center flex-col gap-8">
      <h1 className="text-4xl font-bold text-center text-white">Create Quiz</h1>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md "
      >
        <div>
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-white mb-1">Title</label>
            <input
              type="text"
              id="title"
              placeholder="Enter quiz title"
              className="w-full px-3 py-2 rounded bg-gray-700 text-white outline-none"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && <RequiredError>{errors.title.message}</RequiredError>}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-white mb-1">Description</label>
            <textarea
              id="description"
              placeholder="Enter quiz description (Required)"
              className="w-full px-3 py-2 rounded bg-gray-700 text-white outline-none resize-none"
              rows={4}
              {...register("description")}
            />
          </div>

          {/* Instructions */}
          <div className="mb-4">
            <label htmlFor="instructions" className="block text-white mb-1">Instructions</label>
            <textarea
              id="instructions"
              placeholder="Enter instructions (optional)"
              className="w-full px-3 py-2 rounded bg-gray-700 text-white outline-none resize-none"
              rows={4}
              {...register("instructions")}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="timer" className="block text-white mb-1">Total number of attempts (default 1)</label>
            <input
              type="number"
              id="maxAttempts"
              placeholder="Enter number"
              min={1}
              max={60}
              required
              className="w-full px-3 py-2 rounded bg-gray-700 text-white outline-none"
              {...register("maxAttempts")}
            />
            {errors.timer && <RequiredError>{errors.timer.message}</RequiredError>}
          </div>
          <div className='mb-4'>
            <label htmlFor="Year" className="block text-white mb-1">Year</label>
            <div className='flex flex-wrap '>
              {year.map((year) => (
                <label key={year} className='flex items-center mr-6 text-white'>
                  <input
                    type='checkbox'
                    value={year}
                    {...register("year", { required: "Year is required" })}
                    className='w-5 h-5 border-2 border-gray-300 rounded-sm checked:bg-green-500 checked:border-green-500 focus:ring-0 cursor-pointer text-white'
                  />
                  <span className='ml-2'>{year}</span>
                </label>
              ))}
            </div>
            {errors?.year && <RequiredError>{errors.year.message}</RequiredError>}
          </div>

          <div className='mb-4'>
            <label htmlFor="Department" className="block text-white mb-1">Department</label>
            <div className=' flex-wrap text-white'>
              {departments.departments.map((dept) => (
                <label key={dept.abbreviation} className='flex items-center mr-6'>
                  <input
                    type='checkbox'
                    value={dept.abbreviation}
                    {...register("department", { required: "Department is required" })}
                    className='w-5 h-5 border-2 border-gray-300 rounded-sm checked:bg-green-500 checked:border-green-500 focus:ring-0 cursor-pointer'
                  />
                  <span className='ml-2'>{dept.name}</span>
                </label>
              ))}
            </div>
            {errors?.department && <RequiredError>{errors.department.message}</RequiredError>}
          </div>

          {/* Timer */}
          <div className="mb-4">
            <label htmlFor="timer" className="block text-white mb-1">Total test duration (minutes)</label>
            <input
              type="number"
              id="timer"
              placeholder="Enter time in minutes"
              min={0}
              max={60}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white outline-none"
              {...register("timer", { required: "Timer is required" })}
            />
            {errors.timer && <RequiredError>{errors.timer.message}</RequiredError>}
          </div>

          {/* Submit Button */}
          <div className="flex justify-between items-center">
            <Button disabled={loading} type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              {edit ? "Update Quiz" : "Create Quiz"}
            </Button>
            {edit && (
              <button
                type="button"
                className="flex items-center text-blue-400 ml-6 mr-4 hover:bg-blue-900 p-3 rounded-sm"
                onClick={() => navigate(`/dashboard/create-quiz/${quiz._id}`)}
              >
                Skip <IoMdArrowForward className="ml-1" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;
