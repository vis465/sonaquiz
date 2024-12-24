import { useNavigate } from "react-router-dom";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import Button from "../../Button";

const AttemptCard = ({ item }) => {
  const navigate = useNavigate();

  // Calculate score percentage
  const scorePercentage = (item?.score / item?.answers?.length) * 100 || 0;

  return (
    <div className="relative bg-blue-600 p-6 rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300">
      {/* Quiz Info */}
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-white line-clamp-2">
          {item?.quizId?.title || "Quiz Title Unavailable"}
        </h3>
        <p className="text-sm text-gray-200 line-clamp-2">
          {item?.quizId?.description || "Description not available."}
        </p>
      </div>

      {/* Date and Score */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs text-gray-100">
          {item?.createdAt
            ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })
            : "Date unavailable"}
        </span>
        <span
          className={`text-xl font-bold ${
            scorePercentage >= 50 ? "text-green-300" : "text-red-600"
          }`}
        >
          {item?.score || 0} / {item?.answers?.length || "N/A"}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
        <div
          className={`absolute top-0 left-0 h-full ${
            scorePercentage >= 50 ? "bg-green-400" : "bg-red-400"
          }`}
          style={{ width: `${scorePercentage}%` }}
        />
      </div>

      {/* Button */}
      <Button
        onClick={() => navigate(`/`)}
        className="w-full text-center text-indigo-600 bg-white hover:bg-gray-200 py-2 rounded-md font-semibold"
        aria-label="Reattempt Quiz"
      >
        Attempt Again
      </Button>
    </div>
  );
};

export default AttemptCard;
