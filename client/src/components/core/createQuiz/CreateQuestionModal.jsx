import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../Button";
import { createQuestion } from "../../../services/operations/questionAPIs";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const CreateQuestionModal = ({ quiz, setQuestions, setCreateQuestionModalData }) => {
  const [questionType, setQuestionType] = useState("MCQ"); // Default to MCQ
  const [options, setOptions] = useState([]); // Used for MCQs
  const [questionImage, setQuestionImage] = useState(null); // Question image
  const [currentOption, setCurrentOption] = useState({ text: "", isCorrect: false, imageUrl: null });
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { token } = useSelector((state) => state.auth);
  const [section, setSection] = useState("Quantitative Aptitude");

  // Handle image uploads
  const handleImageUpload = (file, callback) => {
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result);
    reader.readAsDataURL(file);
  };

  // Add option
  const addOption = () => {
    if (!currentOption.text.trim() && !currentOption.imageUrl) return;
    setOptions([...options, currentOption]);
    setCurrentOption({ text: "", isCorrect: false, imageUrl: null });
  };

  let questionFormat = questionImage ? "IMAGE" : "TEXT";

  const submitHandler = async (data) => {
    const payload = {
      quizId: quiz._id,
      questionText: data.questionText,
      questionImage,
      questionType,
      options: questionType === "MCQ" ? options : undefined,
      questionFormat,
      section,
    };

    try {
      setLoading(true);
      console.log("Payload:", payload);

      const response = await createQuestion(payload, token);
      if (response) {
        setQuestions((prev) => [...prev, response]);
        setCreateQuestionModalData(null);
        toast.success("Question created successfully!");
      }
    } catch (error) {
      toast.error("Failed to create question.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-[50%] max-w-[1000px] h-full mx-auto translate-y-[-50%] flex flex-col p-5 gap-5 items-center bg-white shadow-lg rounded-lg inset-0">
      <h3 className="text-2xl font-semibold">Create a Question</h3>
      <form onSubmit={handleSubmit(submitHandler)} className="w-full flex flex-col gap-4">
        {/* Question Type */}
        <div className="flex gap-4 items-center">
          <label className="font-medium">Question Type:</label>
          <select
            className="p-2 border rounded"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
          >
            <option value="MCQ">Multiple Choice</option>
            <option value="FIB">Fill in the Blank</option>
          </select>
        </div>

        {/* Section Selection */}
        <div className="flex gap-4 items-center">
          <label className="font-medium">Section:</label>
          <select
            className="p-2 border rounded"
            value={section}
            onChange={(e) => setSection(e.target.value)}
          >
            <option value="Quantitative Aptitude">Quantitative Aptitude</option>
            <option value="Reasoning">Reasoning</option>
            <option value="Verbal Aptitude">Verbal Aptitude</option>
            <option value="Technical MCQs">Technical MCQs</option>
            <option value="Core MCQs">Core MCQs</option>
          </select>
        </div>

        {/* Question Text */}
        <div className="flex flex-col">
          <label className="font-medium">Question:</label>
          <input
            type="text"
            placeholder="Enter the question"
            {...register("questionText")}
            className="p-2 border rounded"
          />
        </div>

        {/* Question Image */}
        <div className="flex flex-col">
          <label className="font-medium">Question Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files[0], setQuestionImage)}
            className="p-2 border rounded"
          />
          {questionImage && <img src={questionImage} alt="Preview" className="w-20 h-20 mt-2" />}
        </div>

        {/* Options (for MCQ) */}
        {questionType === "MCQ" && (
          <div className="flex flex-col">
            <label className="font-medium">Options:</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Option text"
                value={currentOption.text}
                onChange={(e) => setCurrentOption({ ...currentOption, text: e.target.value })}
                className="flex-1 p-2 border rounded"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0], (imageUrl) => setCurrentOption({ ...currentOption, imageUrl }))}
                className="p-2 border rounded"
              />
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={currentOption.isCorrect}
                  onChange={() => setCurrentOption({ ...currentOption, isCorrect: !currentOption.isCorrect })}
                />
                Correct
              </label>
              <Button type="button" onClick={addOption} active>Add</Button>
            </div>
            <div className="mt-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span>{option.text || <img src={option.imageUrl} alt="Option" className="w-10 h-10" />}</span>
                  {option.isCorrect && <span className="text-green-500">(Correct)</span>}
                  <Button type="button" onClick={() => setOptions(options.filter((_, i) => i !== index))} className="text-red-500">Remove</Button>
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
