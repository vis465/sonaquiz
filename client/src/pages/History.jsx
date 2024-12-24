import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { apiConnector } from "../services/apiConnector";
import { quizEndpoints } from "../services/APIs";
import toast from "react-hot-toast";
import AttemptCard from "../components/core/History/AttemptCard";

const History = () => {
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempts] = useState([]);
  const { token } = useSelector((state) => state.auth);

  const fetchUserAttempts = async () => {
    setLoading(true);
    try {
      const response = await apiConnector("GET", quizEndpoints.GET_USER_ATTEMPS, null, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) {
        throw new Error(response.data.error);
      }
      setAttempts((response?.data?.data).reverse());
    } catch (e) {
      toast.error("Failed to get User Attempts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAttempts();
  }, []);

  return (
    <section className="py-8 px-6 md:px-12 h-screen bg-gray-900  text-white">
      {loading ? (
        <div className="text-2xl min-h-[70vh] w-full flex items-center justify-center font-bold">
          Loading...
        </div>
      ) : (
        <div className="w-full flex flex-col gap-8">
          <h1 className="text-3xl md:text-2xl  text-center mb-4">
            Your Quiz Attempts
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attempt.map((item, index) => (
              <AttemptCard key={item._id} item={item} index={index} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default History;
