import React, { useState } from "react";
import { useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnector";
import { analyticsendpoints } from "../services/APIs";
import toast from "react-hot-toast";
import Papa from 'papaparse'; // Importing PapaParse


const UserSearchAndAnalytics = () => {
  const { token } = useSelector((state) => state.auth);
  const [keyword, setKeyword] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(state => state.auth);

  const handleSearch = async () => {
    if (!keyword.trim()) {
      toast.error("Please enter a username.");
      return;
    }
    const payload = {
      "username": keyword.trim()
    }
    setLoading(true);
    console.log(payload)
    
    try {
      console.log("api onanalytics")
      const response = await apiConnector(
        "POST",
        `${analyticsendpoints.SEARCH_USER}`,
        payload,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      console.log("response",response)
      setUserDetails(response.data.user);
      
    } catch (error) {
      toast.error("Failed to fetch user details.");
      setUserDetails(null);
    }
    setLoading(false);
  };

  const downloadData = () => {
    console.log("pressed");

    // Check if userDetails are available
    if (!userDetails) {
      toast.error("No data to download.");
      return;
    }

    // Prepare the data for CSV
    const data = userDetails.attemptedQuizzes?.map(quiz => ({
      Quiz: quiz.quizTitle,
      Score: quiz.score,
    })) || [];

    // Check if there are any quizzes
    if (data.length === 0) {
      toast.error("No quizzes data available.");
      return;
    }

    // Convert the data to CSV using PapaParse
    const csv = Papa.unparse(data);

    // Trigger the download with username as the file name
    downloadCSV(csv, `${userDetails.username}_data.csv`);
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      // Create a download link and trigger it
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };


  return (
    <div className="search-container p-6 bg-gray-900 text-white rounded-lg shadow-lg text-xl">
      <h2 className="text-2xl text-center text-blue-500 font-bold mb-6">
        Search User and View Analytics
      </h2>

      {/* Search Input */}
      <div className="search-bar flex items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter useremail..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full p-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Search
        </button>
      </div>

      {/* Loading Spinner */}
      {loading && <p className="text-center text-white">Loading...</p>}

      {/* User Details */}
      {userDetails && (
        <div className="user-details mt-6 text-xl">
          <div className="analytics-card bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold text-blue-400 mb-3">
              User Details
            </h3>
            <p><strong>Username:</strong> {userDetails.username}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Role:</strong> {userDetails.role}</p>
            <p><strong>Department:</strong> {userDetails.department}</p>
            <p><strong>Year:</strong> {userDetails.year}</p>
          </div>
          {user.role === "admin" || user.role === "trainer" ?(<>
             <h3 className="text-xl font-semibold text-blue-400 mb-3">
                user performace data
              </h3>
            <div className="analytics-card bg-gray-800 p-6 rounded-lg shadow-md mb-6 columns-3 row-span-5">
             
              <p><strong>class 10 marks:</strong> {userDetails.marks10}</p>
              <p><strong>class 12 marks:</strong> {userDetails.marks12}</p>
              <p><strong>admission type:</strong> {userDetails.admissionType}</p>
              <p><strong>hostel Status:</strong> {userDetails.hostelStatus}</p>
              <p><strong>lateralEntry:</strong> {userDetails.lateralEntry?"Yes":"No"}</p>
              
              <p><strong>Sem 1 GPA:</strong> {userDetails.cgpa[0]}</p>
              <p><strong>Sem 2 GPA:</strong> {userDetails.cgpa[1]}</p>
              <p><strong>Sem 3 GPA:</strong> {userDetails.cgpa[2]}</p>
              <p><strong>Sem 4 GPA:</strong> {userDetails.cgpa[3]}</p>
              <p><strong>Sem 5 GPA:</strong> {userDetails.cgpa[4]}</p>
              <p><strong>Sem 6 GPA:</strong> {userDetails.cgpa[5]}</p>
              <p><strong>Sem 7 GPA:</strong> {userDetails.cgpa[6]}</p>
              <p><strong>Sem 8 GPA:</strong> {userDetails.cgpa[7]}</p>

              </div>
              </>
          ) : 
          (<> </>)}

          <div className="analytics-card bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold text-blue-400 mb-3">
              Quizzes Attended
            </h3>
            {userDetails.attemptedQuizzes?.length > 0 ? (
              <div className="quiz-grid grid grid-cols-1 sm:grid-cols-2 gap-6">
                {userDetails.attemptedQuizzes.map((quiz, index) => (
                  <div
                    key={index}
                    className="quiz-card bg-gray-700 p-4 rounded-lg shadow-md"
                  >
                    <h4 className="text-lg font-semibold">{quiz.quizTitle}</h4>
                    <p><strong>Score:</strong> {quiz.score}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No quizzes attended yet.</p>
            )}
          </div>

          {/* Download CSV */}
          <button
            onClick={downloadData}
            className="text-white px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 transition-all duration-300"
          >
            Download CSV
          </button>



        </div>
      )}

      {/* No User Found */}
      {!loading && !userDetails && keyword && (
        <p className="text-center text-gray-400">No user found.</p>
      )}
    </div>
  );
};

export default UserSearchAndAnalytics;
