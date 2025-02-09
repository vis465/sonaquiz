import React, { useEffect, useState } from 'react';
import { quizEndpoints } from '../../../services/APIs';
import { apiConnector } from '../../../services/apiConnector';
import { useSelector } from 'react-redux';
import { CSVLink } from 'react-csv';
import toast from 'react-hot-toast';

const Score = ({ quiz }) => {
  const [scores, setScores] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizName, setQuizName] = useState('');
  const { token } = useSelector((state) => state.auth);
  const [notComplete, setNotComplete] = useState([]);

  const dataprepforcsv = (scores) =>
    scores.map((score, index) => ({
      serialNumber: index + 1,
      Username: score.username || 'N/A',
      Year: score.year,
      Department: score.department,
      Class: score.class,
      Score: score.score,
    }));

  const deleteAttempt = async (attemptId, userId, quizId) => {
    const postData = { attemptID: attemptId, userId, quizID: quizId };
    try {
      const response = await apiConnector('POST', quizEndpoints.DELETE_ATTEMPT, postData, {
        Authorization: `Bearer ${token}`,
      });
      toast.success(response.data.message);
      setScores((prev) => prev.filter((score) => score._id !== attemptId));
    } catch (error) {
      console.error('Error deleting attempt:', error);
      toast.error('Failed to delete attempt');
    }
  };

  useEffect(() => {
    const fetchNotComplete = async () => {
      try {
        const response = await apiConnector(
          'GET',
          `${quizEndpoints.attemptnotcomplete}/${quiz._id}`,
          null,
          { Authorization: `Bearer ${token}` }
        );
        setNotComplete(response.data.data);
      } catch (err) {
        console.error('Error fetching incomplete attempts:', err);
      }
    };
    fetchNotComplete();
  }, [quiz._id, token]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await apiConnector('GET', `${quizEndpoints.GET_SCORES}/${quiz._id}`, null, {
          Authorization: `Bearer ${token}`,
        });
        setQuizName(response?.data?.quizTitle || 'quiz_results');
        setScores(response?.data?.attempts || []);
      } catch (error) {
        console.error('Error fetching scores:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, [quiz._id, token]);

  useEffect(() => {
    if (scores.length > 0) {
      setCsvData(dataprepforcsv(scores));
    }
  }, [scores]);

  return (
    <div>
      {loading ? (
        <div className="text-center text-xl">Loading...</div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center bg-blue-600 text-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">{quizName} - Results</h2>
            <CSVLink
              data={csvData}
              filename={`${quizName}.csv`}
              className="bg-green-500 px-4 py-2 text-white rounded-lg hover:bg-green-600"
            >
              Download CSV
            </CSVLink>
          </div>

          {/* Side-by-Side Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attended Users */}
            <div className="bg-white border border-gray-300 rounded-lg shadow-md">
              <h3 className="bg-blue-600 text-white text-lg font-bold px-4 py-2 rounded-t-lg">
                Attempted Users
              </h3>
              <div className="p-4">
                {scores.length > 0 ? (
                  <div className="space-y-4">
                    {scores.map((score, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm"
                      >
                        <h4 className="text-lg font-semibold text-black">{score.username}</h4>
                        <p className="text-sm text-gray-600">Year: {score.year}</p>
                        <p className="text-sm text-gray-600">Department: {score.department}</p>
                        <p className="text-sm text-gray-600">Class: {score.class}</p>
                        <p className="text-sm font-bold text-gray-700">Score: {score.score}</p>
                        <button
                          className="mt-3 w-full bg-red-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-red-600"
                          onClick={() => deleteAttempt(score._id, score.userId, quiz._id)}
                        >
                          Delete Attempt
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600">No attempts found</p>
                )}
              </div>
            </div>

            {/* Not Attempted Users */}
            <div className="bg-white border border-gray-300 rounded-lg shadow-md">
              <h3 className="bg-red-600 text-white text-lg font-bold px-4 py-2 rounded-t-lg">
                Attempts Not Completed
              </h3>
              <div className="p-4">
                {notComplete.length > 0 ? (
                  <div className="space-y-4">
                    {notComplete.map((user, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm"
                      >
                        <h4 className="text-lg font-semibold text-black">{user.username}</h4>
                        <p className="text-m text-gray-600">Year: {user.year}</p>
                        <p className="text-m text-gray-600">Department: {user.dept}</p>
                        <p className="text-m text-gray-600">Class: {user.class}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600">No users found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Score;
