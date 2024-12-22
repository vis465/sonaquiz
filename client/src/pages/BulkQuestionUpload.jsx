import React, { useState } from 'react';
import Papa from 'papaparse'; // For CSV parsing
import * as XLSX from 'xlsx'; // For Excel parsing
import axios from 'axios';
import { createQuestion } from '../services/operations/questionAPIs';
import toast from "react-hot-toast";


const BulkQuestionUpload = ({ uploadEndpoint }) => {
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setError(null);
    const selectedFile = e.target.files[0];
    const allowedTypes = ["text/csv", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
    
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      setError("Please upload a valid CSV or Excel file.");
    }
  };

  const parseFile = () => {
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
          setError(null);
        } else {
          setError("No valid data found in the Excel file.");
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleSubmit = async () => {
    if (questions.length === 0) {
      setError("No questions to upload.");
      return;
    }
    questions.map(payload =>{
      console.log("Payload being sent:", payload); // Debug payload
  
    try {
      const response = createQuestion(payload, token);
      if (response) {
        setQuestions((prev) => [...prev, response]);
        setCreateQuestionModalData(null);
        toast.success("Question created successfully!");
      }
    } catch (error) {
      console.error("Error creating question:", error.response?.data || error.message);
      toast.error("Failed to create question.");
    } 
    })

    // try {
    //   const response = await axios.post(uploadEndpoint, { questions });
    //   if (response.data.success) {
    //     alert("Questions uploaded successfully.");
    //     setFile(null);
    //     setQuestions([]);
    //   } else {
    //     setError("Failed to upload questions.");
    //   }
    // } catch (err) {
    //   console.error(err);
    //   setError("An error occurred while uploading questions.");
    // }
  };

  return (
    <div className="bulk-upload-container p-5">
      <h2 className="text-2xl mb-4">Bulk Question Upload</h2>
      <input
        type="file"
        accept=".csv, .xls, .xlsx"
        onChange={handleFileChange}
        className="block mb-4"
      />
      <button
        onClick={parseFile}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
      >
        Parse File
      </button>
      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded"
        disabled={questions.length === 0}
      >
        Upload Questions
      </button>
      {error && <p className="text-red-500 mt-3">{error}</p>}
      {questions.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl">Parsed Questions:</h3>
          <pre className="bg-gray-100 p-3 rounded">{JSON.stringify(questions, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default BulkQuestionUpload;
