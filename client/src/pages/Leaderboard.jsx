import React, { useEffect, useState } from "react";
import { quizEndpoints } from "../services/APIs";
import { apiConnector } from "../services/apiConnector";
import { useSelector } from "react-redux";
import Navbar from '../components/Navbar'
import Lottie from 'react-lottie';
import animationdata2 from "../lottie/geting.json"
const defaultOption = {
  loop: true,
  autoplay: true,
  animationData: animationdata2,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};
export default function Leaderboard() {
  const [dashboardData, setDashboardData] = useState();
  const { user, token } = useSelector((state) => state.auth);

  const uri =
    user.role === "admin"
      ? `${quizEndpoints.GET_FOR_DASHBOARD}`
      : `${quizEndpoints.GET_FOR_DASHBOARD}?usid=${user.id}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiConnector("GET", uri, null, {
          Authorization: `Bearer ${token}`,
        });
        setDashboardData(response.data.data);
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };

    fetchData();
  }, [uri, token]);

  return (
    <div className="max-w-6xl mx-auto p-6">
            <Navbar />

      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Quiz Leaderboard</h1>
      {dashboardData ? (
        dashboardData.map((quiz, index) => (
          <div
            className="bg-[#0F3460] shadow-md rounded-lg p-6 mb-6 border border-gray-200"
            key={index}
          >
            <h2 className="text-xl font-bold text-[#F9F9F9] mb-2">{quiz.quizTitle}</h2>
            <p className="text-gray-500 mb-4">
              <span className="font-medium">Created At:</span>{" "}
              {new Date(quiz.createdAt).toLocaleString()}
            </p>
            <h3 className="text-lg font-medium text-[#F9F9F9] mb-3">Attempts:</h3>
            {quiz.attempts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table-auto w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <th className="py-2 px-4 text-black">Username</th>
                      <th className="py-2 px-4 text-black">Year</th>
                      <th className="py-2 px-4 text-black">Department</th>
                      <th className="py-2 px-4 text-black">Class</th>
                      <th className="py-2 px-4 text-black">Score</th>
                      <th className="py-2 px-4 text-black">Attempt Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quiz.attempts.map((attempt, attemptIndex) => (
                      <tr
                        key={attemptIndex}
                        className={`border-b last:border-none text-[#F9F9F9] ${
                          attempt.userId === user.id
                            ? "bg-green-100 text-green-700"
                            : "hover:bg-gray-50 hover:text-black"
                        }`}
                      >
                        <td className="py-2 px-4">{attempt.username}</td>
                        <td className="py-2 px-4">{attempt.year}</td>
                        <td className="py-2 px-4">{attempt.department}</td>
                        <td className="py-2 px-4">{attempt.class}</td>
                        <td className="py-2 px-4">{attempt.score}</td>
                        <td className="py-2 px-4">
                          {new Date(attempt.attemptDate).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-white-500 italic">No attempts for this quiz yet.</p>
            )}
          </div>
        ))
      ) : (
        <>
        <Lottie 
            options={defaultOption}
            height={500} // Larger height
            width={500}  // Larger width
          />
          
        <h3 className="text-black-500 text-center">Loading data...</h3>
        </>
      )}
    </div>
  );
}
