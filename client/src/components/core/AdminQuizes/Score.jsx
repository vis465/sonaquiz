import React, { useEffect, useState } from 'react';
import { quizEndpoints } from '../../../services/APIs';
import { apiConnector } from '../../../services/apiConnector';
import { useSelector } from 'react-redux';
import { CSVLink } from 'react-csv'; // Import from react-csv
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Score = ({ quiz }) => {
    const [scores, setScores] = useState([]);
    const [csvData, setCsvData] = useState([]); // State for CSV data
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [quizname, setQuizName] = useState('');
    const { token } = useSelector((state) => state.auth);

    const dataprepforcsv = (scores) => {
        return scores.map((score, index) => ({
            serialNumber: index + 1,
            Username: score.username || 'N/A',
            Year: score.year,
            Department: score.department,
            Class: score.class,
            Score: score.score, // Add score to CSV
        }));
    };

    const deleteAttempt = async (attemptId, userId, quizId) => {
        console.log("delete called", userId)
        const postData = {
            attemptID: attemptId,
            userId: userId,
            quizID: quizId,
        };
        try {
            const response = await apiConnector('POST', quizEndpoints.DELETE_ATTEMPT, postData, {
                Authorization: `Bearer ${token}`,
            });
            toast.success(response.data.message);


            // Refresh the page after 2 seconds
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            setScores((prev) => prev.filter((score) => score._id !== attemptId)); // Remove from state
        } catch (error) {
            console.error('Error deleting attempt:', error);
            toast.error('Failed to delete attempt');
        }
    };

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await apiConnector('GET', `${quizEndpoints.GET_SCORES}/${quiz._id}`, null, {
                    Authorization: `Bearer ${token}`,
                });
                const quizName = response?.data?.quizTitle || 'quiz_results';
                const quizData = response?.data?.attempts || [];
                setQuizName(quizName);
                setScores(quizData);
                console.log("quizdata", response?.data?.attempts)
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
        <div className="bg-[#e0fbfc] z-[2] w-full rounded-lg py-5 flex flex-col gap-5">
            {loading ? (
                <div className="text-center text-xl">Loading...</div>
            ) : scores.length > 0 ? (
                <div className="space-y-5">
                    {/* Header */}
                    <div className="border border-slate-600 rounded-lg overflow-hidden shadow-md">
                        <h3 className="px-3 text-2xl bg-[#3a506b] text-white py-3 text-center rounded-t-lg">
                            Results
                        </h3>
                        <div className="flex justify-end items-center p-4 bg-[#e0fbfc]">
                            <CSVLink
                                data={csvData}
                                filename={`${quizname}.csv`}
                                className="text-white px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 transition-all duration-300 border border-green-700 text-base"
                            >
                                Download CSV
                            </CSVLink>
                        </div>
                    </div>

                    {/* Cards for each score */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {scores.map((score, index) => (
                            <div
                                className="relative bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-[#3a506b] transform hover:scale-105 transition-all duration-300"
                                key={index}
                            >
                                {/* Header Badge */}


                                {/* Content */}
                                <div className="p-6 pt-10 space-y-4">

                                    {/* Username */}
                                    <h4 className="text-center text-xl font-semibold text-gray-800 uppercase tracking-wide">
                                        {score.username}
                                    </h4>


                                    {/* Divider */}
                                    <div className="border-b border-gray-300"></div>

                                    {/* Details */}
                                    <div className="text-gray-700 space-y-2">
                                    </div>
                                    <div className="absolute right-2 transform -translate-x-1/2 bg-green-600 text-white font-extrabold p-1.5 w-30 h-10 flex items-center justify-center shadow-md border-4 border-white z-10">
                                        Score:  {score.score}
                                    </div>
                                    <p>
                                        <span className="font-medium text-gray-900">Year:</span> {score.year}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-900">Department:</span> {score.department}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-900">Class:</span> {score.class}
                                    </p>

                                </div>

                                {/* Action Button */}
                                <div className="bg-gradient-to-r from-red-500 to-red-700 p-3">
                                    <button
                                        className="w-full text-white font-bold text-lg py-2 rounded-lg shadow-lg hover:shadow-xl hover:brightness-90 transition-all"
                                        onClick={() => deleteAttempt(score.attemptid, score.userId, quiz._id)}
                                    >
                                        Delete Attempt
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            ) : (
                <p className="text-center text-xl">No scores found</p>
            )}
        </div>
    );
};

export default Score;
