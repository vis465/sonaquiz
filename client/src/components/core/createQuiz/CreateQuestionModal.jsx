import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../Button";
import { createQuestion } from "../../../services/operations/questionAPIs";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const CreateQuestionModal = ({ quiz, setQuestions, setCreateQuestionModalData }) => {
  const [questionType, setQuestionType] = useState("MCQ"); // Default to MCQ
  const [options, setOptions] = useState([]); // Used for MCQs
  const [fibAnswers, setFibAnswers] = useState([]); // Used for FIBs
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isCurrentAnswerCorrect, setIsCurrentAnswerCorrect] = useState(false);
  const [currentOption, setCurrentOption] = useState("");
  const [isCurrentOptionCorrect, setIsCurrentOptionCorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { token } = useSelector((state) => state.auth);

  const addOption = () => {
    if (!currentOption.trim()) return;
    if (isCurrentOptionCorrect && options.some((option) => option.isCorrect)) {
      toast.error("Only one option can be marked as correct.");
      return;
    }
    setOptions([...options, { text: currentOption, isCorrect: isCurrentOptionCorrect }]);
    setCurrentOption("");
    setIsCurrentOptionCorrect(false);
  };

  const addFibAnswer = () => {
    if (!currentAnswer.trim()) return;
    setFibAnswers([...fibAnswers, { text: currentAnswer, isCorrect: isCurrentAnswerCorrect }]);
    setCurrentAnswer("");
    setIsCurrentAnswerCorrect(false);
  };

  const removeOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const removeFibAnswer = (index) => {
    setFibAnswers(fibAnswers.filter((_, i) => i !== index));
  };

  const submitHandler = async (data) => {
    if (questionType === "MCQ" && (!options.length || !options.some((opt) => opt.isCorrect))) {
      toast.error("MCQs must have at least one correct option.");
      return;
    }
  
    if (questionType === "FIB" && !fibAnswers.length) {
      toast.error("FIB questions must have at least one acceptable answer.");
      return;
    }
  
    const payload = {
      quizId: quiz._id,
      questionText: data.questionText,
      questionType,
      options: questionType === "MCQ" ? options : undefined,
      answers: questionType === "FIB" ? fibAnswers : undefined,
    };
    
    console.log("Payload being sent:", payload); // Debug payload
  
    try {
      setLoading(true);
      const response = await createQuestion(payload, token);
      if (response) {
        setQuestions((prev) => [...prev, response]);
        setCreateQuestionModalData(null);
        toast.success("Question created successfully!");
      }
    } catch (error) {
      console.error("Error creating question:", error.response?.data || error.message);
      toast.error("Failed to create question.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="absolute top-[50%] max-w-[480px] mx-auto translate-y-[-50%] flex flex-col p-5 gap-5 items-center bg-white shadow-lg rounded-lg inset-0">
      <h3 className="text-2xl font-semibold">Create a Question</h3>
      <form onSubmit={handleSubmit(submitHandler)} className="w-full flex flex-col gap-4">
        {/* Question Type */}
        <div className="flex gap-4 items-center">
          <label className="font-medium">Question Type:</label>
          <select
            className="p-2 border rounded"
            value={questionType}
            onChange={(e) => {
              setQuestionType(e.target.value);
              setOptions([]);
              setFibAnswers([]);
            }}
          >
            <option value="MCQ">Multiple Choice</option>
            <option value="FIB">Fill in the Blank</option>
          </select>
        </div>

        {/* Question Text */}
        <div className="flex flex-col">
          <label className="font-medium">Question:</label>
          <input
            type="text"
            placeholder="Enter the question"
            {...register("questionText", { required: "Question is required" })}
            className="p-2 border rounded"
          />
          {errors.questionText && <p className="text-red-500">{errors.questionText.message}</p>}
        </div>

        {/* Options (for MCQ) */}
        {questionType === "MCQ" && (
          <div className="flex flex-col">
            <label className="font-medium">Options:</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter option text"
                value={currentOption}
                onChange={(e) => setCurrentOption(e.target.value)}
                className="flex-1 p-2 border rounded"
              />
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={isCurrentOptionCorrect}
                  onChange={() => setIsCurrentOptionCorrect(!isCurrentOptionCorrect)}
                />
                Correct
              </label>
              <Button type="button" onClick={addOption} active>Add</Button>
            </div>
            <div className="flex flex-col mt-2 gap-1">
              {options.map((option, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span>{option.text}</span>
                  {option.isCorrect && <span className="text-green-500">(Correct)</span>}
                  <Button type="button" onClick={() => removeOption(index)} className="text-red-500">Remove</Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FIB Answers */}
        {questionType === "FIB" && (
          <div className="flex flex-col">
            <label className="font-medium">Acceptable Answers:</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter acceptable answer"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value.toLowerCase())}
                className="flex-1 p-2 border rounded"
              />
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={isCurrentAnswerCorrect}
                  onChange={() => setIsCurrentAnswerCorrect(!isCurrentAnswerCorrect)}
                />
                Correct
              </label>
              <Button type="button" onClick={addFibAnswer} active>Add</Button>
            </div>
            <div className="flex flex-col mt-2 gap-1">
              {fibAnswers.map((answer, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span>{answer.text}</span>
                  {answer.isCorrect && <span className="text-green-500">(Correct)</span>}
                  <Button type="button" onClick={() => removeFibAnswer(index)} className="text-red-500">Remove</Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit & Cancel */}
        <div className="flex justify-end gap-4">
          <Button type="button" onClick={() => setCreateQuestionModalData(null)} active={false}>Cancel</Button>
          <Button type="submit" active disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuestionModal;
