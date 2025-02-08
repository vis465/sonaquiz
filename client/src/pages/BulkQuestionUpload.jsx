import React, { useState,useEffect } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import {useNavigate, useLocation } from "react-router-dom";  // Import useLocation for state access
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { createQuestion } from "../services/operations/questionAPIs";

const BulkQuestionUpload = () => {
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Use useLocation to get state passed during navigation
  const location = useLocation();
  const { id: quizId } = location.state || {};  // Access quizId from state
  
  console.log("Quiz ID:", quizId);  // Log quizId for debugging
  useEffect(() => {
    console.log("Parsed Questions:", questions);
  }, [questions]);

  const handleFileChange = (e) => {
    setError(null);
    const selectedFile = e.target.files[0];
    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      setError("Please upload a valid CSV or Excel file.");
    }
  };

  const parseFile = () => {
    console.log("id", quizId);  // Log quizId for debugging

    if (!file) {
      setError("No file selected.");
      return;
    }

    const reader = new FileReader();

    if (file.type === "text/csv") {
      reader.onload = () => {
        Papa.parse(reader.result, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.data && results.data.length > 0) {
              setQuestions(results.data);
              console.log(questions)
              setError(null);
            } else {
              setError("No valid data found in the CSV file.");
            }
          },
        });
      };
      reader.readAsText(file);
    } else {
      reader.onload = () => {
        const workbook = XLSX.read(reader.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);
        if (data.length > 0) {
          setQuestions(data);
          console.log(questions)
          setError(null);
        } else {
          setError("No valid data found in the Excel file.");
        }
      };
      reader.readAsBinaryString(file);
    }
    
  };

  const handleSampleDownload = () => {
    const sampleData = [
      {
        questionText: "What is 2 + 2?",
        questionType: "MCQ",
        options: JSON.stringify([
          { text: "3", isCorrect: false },
          { text: "4", isCorrect: true },
        ]),
        answers: "",
      },
      {
        questionText: "The capital of France is ___.",
        questionType: "FIB",
        options: "",
        answers: JSON.stringify([{ text: "Paris", isCorrect: true }]),
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SampleQuestions");

    XLSX.writeFile(workbook, "SampleQuestions.xlsx");
  };

  const handleSubmit = async () => {
    if (!quizId || !token) {
      toast.error("Quiz ID or authentication token is missing.");
      return;
    }

    if (questions.length === 0) {
      setError("No questions to upload.");
      return;
    }

    setLoading(true);
    for (const data of questions) {
      const questionType = data.questionType;
      const payload = {
        quizId,
        questionText: data.questionText,
        questionType,
        options: questionType === "MCQ" ? JSON.parse(data.options || "[]") : undefined,
        answers: questionType === "FIB" ? JSON.parse(data.answers || "[]") : undefined,
      };

      console.log("Payload being sent:", payload); // Debug payload

      try {
        const response = await createQuestion(payload, token);
        if (response) {
          setQuestions((prev) => [...prev, response]);
          toast.success(`Question "${data.questionText}" created successfully!`);
        }
      } catch (error) {
        console.error("Error creating question:", error.response?.data || error.message);
        toast.error(`Failed to create question "${data.questionText}".`);
      }
    }
    setLoading(false);
    navigate(`/dashboard/create-quiz/${quizId}`)
  };

  return (
<div
  className="bulk-upload-container p-5 text-white bg-gray-900 rounded-lg shadow-lg transition-all duration-300"
  style={{ fontFamily: "'Montserrat', sans-serif" }}
>
  <h2 className="text-3xl mb-6 text-center text-blue-500 font-bold">
    Bulk Question Upload
  </h2>

  <div className="steps-container mb-6">
    <div className="step mb-4 flex items-start">
      <span className="step-number bg-blue-600 p-4 rounded-full text-white flex-shrink-0 text-lg font-bold">
        1
      </span>
      <div className="step-details ml-4">
        <h3 className="step-title text-xl font-semibold">Download Sample File</h3>
        <p className="step-description text-gray-400">Get the sample file format to know how the questions should be structured.</p>
      </div>
    </div>
    <div className="step mb-4 flex items-start">
      <span className="step-number bg-blue-600 p-4 rounded-full text-white flex-shrink-0 text-lg font-bold">
        2
      </span>
      <div className="step-details ml-4">
        <h3 className="step-title text-xl font-semibold">Upload CSV or Excel File</h3>
        <p className="step-description text-gray-400">Choose a CSV or Excel file with your questions for bulk upload.</p>
      </div>
    </div>
    <div className="step mb-4 flex items-start">
      <span className="step-number bg-blue-600 p-4 rounded-full text-white flex-shrink-0 text-lg font-bold">
        3
      </span>
      <div className="step-details ml-4">
        <h3 className="step-title text-xl font-semibold">Parse the File</h3>
        <p className="step-description text-gray-400">Process the uploaded file and check the parsed questions.</p>
      </div>
    </div>
    <div className="step mb-4 flex items-start">
      <span className="step-number bg-blue-600 p-4 rounded-full text-white flex-shrink-0 text-lg font-bold">
        4
      </span>
      <div className="step-details ml-4">
        <h3 className="step-title text-xl font-semibold">Upload Questions</h3>
        <p className="step-description text-gray-400">Upload parsed questions to the system for saving.</p>
      </div>
    </div>
  </div>

  <div className="action-buttons mb-6">
    <button
      onClick={handleSampleDownload}
      className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-md mb-4 transition-all duration-300"
    >
      Download Sample File
    </button>
    <input
      type="file"
      accept=".csv, .xls, .xlsx"
      onChange={handleFileChange}
      className="block mb-4 w-full p-3 bg-gray-700 text-white rounded-md border-2 border-blue-500"
    />
    <button
      onClick={parseFile}
      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md mr-2 transition-all duration-300"
      disabled={!file || loading}
    >
      Parse File
    </button>
    <button
      onClick={handleSubmit}
      className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md transition-all duration-300"
      disabled={questions.length === 0 || loading}
    >
      {loading ? "Uploading..." : "Upload Questions"}
    </button>
  </div>

  {error && (
    <p className="error-message text-red-500 mt-3 text-center font-semibold">
      {error}
    </p>
  )}

  {questions.length > 0 && (
    <div className="parsed-questions mt-6">
      <h3 className="text-xl mb-3 text-blue-400 font-semibold">Parsed Questions:</h3>
      <div className="question-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {questions.map((question, index) => (
          <div
            key={index}
            className="question-card p-4 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h4 className="question-text text-white text-lg font-semibold mb-2">
              {question.questionText}
            </h4>
            <div className="question-type text-gray-400 mb-2">
              <strong>Type:</strong> {question.questionType}
            </div>
            {question.questionType === "MCQ" ? (
              <div className="options">
                <strong>Options:</strong>
                <ul className="ml-4 text-gray-300">
                  {JSON.parse(question.options).map((option, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className={option.isCorrect ? "text-green-400" : "text-red-400"}>
                        {option.text} {option.isCorrect && "✔️"}
                      </span>
                    </li>
                  ))}
                  <p>Section: {question.section}</p>
                </ul>
              </div>
            ) : (
              <div className="answers">
                <strong>Answers:</strong>
                <ul className="ml-4 text-gray-300">
                  {JSON.parse(question.answers).map((answer, idx) => (
                    <li key={idx} className="text-green-400">{answer.text}</li>
                  ))}
                </ul>
                <p>Section: {question.section}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )}
</div>

  );
};

export default BulkQuestionUpload;
