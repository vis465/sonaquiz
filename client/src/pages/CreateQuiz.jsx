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

const CreateQuiz = () => {
  const [loading, setLoading] = useState(false);

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

  const submitHandler = async (data) => {
    console.log(data)
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
        className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md"
      >
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
            placeholder="Enter quiz description (optional)"
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
            id="attempts"
            placeholder="Enter number"
            min={1}
            max={60}
            className="w-full px-3 py-2 rounded bg-gray-700 text-white outline-none"
            {...register("attempts")}
          />
          {errors.timer && <RequiredError>{errors.timer.message}</RequiredError>}
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
      </form>
    </div>
  );
};

export default CreateQuiz;
