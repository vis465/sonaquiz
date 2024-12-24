import React, { useState } from "react";
import { useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnector";
import { analyticsendpoints } from "../services/APIs";
import toast from "react-hot-toast";
import { CSVLink } from "react-csv";

const UserSearchAndAnalytics = () => {
  const { token } = useSelector((state) => state.auth);
  const [keyword, setKeyword] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim()) {
      toast.error("Please enter a username.");
      return;
    }
    const payload={
      "username": keyword.trim()
    }
    setLoading(true);
    try {
      const response = await apiConnector(
        "POST",
        `${analyticsendpoints.SEARCH_USER}`,
        payload,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      
      setUserDetails(response.data.user);
    } catch (error) {
      toast.error("Failed to fetch user details.");
      setUserDetails(null);
    }
    setLoading(false);
  };

  const downloadData = () => {
    console.log("pressed")
    if (!userDetails) {
      toast.error("No data to download.");
      return;
    }
    const data={
      Username: userDetails.username,
      Email: userDetails.email,
      Role: userDetails.role,
      Department: userDetails.department,
      Year: userDetails.year,
      Quizzes: userDetails.attemptedQuizzes?.map(
        (quiz) => `${quiz.quizTitle} - ${quiz.score}`
      ).join(", "),
    }
    
    const quizscoredata=data.Quizzes
    const quizscore=quizscoredata[quizscoredata.length-1]
    console.log(quizscore)
    // return [
    //   ,
    // ];
  };

  return (
    <div className="search-container p-6 bg-gray-900 text-white rounded-lg shadow-lg">
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
        <div className="user-details mt-6">
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
          {/* <CSVLink
            data={downloadData()}
            filename={`${userDetails.username}_details.csv`}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Download CSV
          </CSVLink> */}
          {/* <button onClick={downloadData}>clickme</button> */}
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
