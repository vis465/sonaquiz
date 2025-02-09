import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { apiConnector } from '../services/apiConnector';
import { questionEndpoints } from '../services/APIs';
import Button from '../components/Button';
import CreateQuestionModal from '../components/core/createQuiz/CreateQuestionModal';
import QuestionCard from "../components/core/createQuiz/QuestionCard";
import { deleteQuestion } from '../services/operations/questionAPIs';
import { setQuiz, setEdit } from '../slices/QuizSlice';

const CreateQuestions = () => {
    const { quiz, edit } = useSelector(state => state.quiz);
    const { token } = useSelector(state => state.auth);
    const [questions, setQuestions] = useState([]);
    const [createQuestionModalData, setCreateQuestionModalData] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();

    const [sections,setSections] = useState([]);

    const finishHandler = () => {
        navigate("/dashboard/create-quiz");
        dispatch(setQuiz(null));
        dispatch(setEdit(false));
    };

    const handleBulkUpload = () => {
        navigate('/dashboard/bulkupload', { state: { id } });
    };

    const deleteQuestionHandler = async (question) => {
        try {
            const response = await deleteQuestion(question._id, token);
            if (response) {
                setQuestions(prev => prev.filter(q => q._id !== question._id));
            }
        } catch (e) {
            console.error("Error deleting question:", e);
        }
    };

    const fetchQuestions = async () => {
        if (!id || !token) {
            console.warn("Quiz ID or token is missing, skipping API call.");
            return;
        }

        setLoading(true);
        try {
            console.log("Fetching quiz questions for quiz:", id);
            const response = await apiConnector("GET", `${questionEndpoints.GET_QUIZ_QUESTIONS}/${id}`, null, {
                Authorization: `Bearer ${token}`
            });
            
            console.log("Fetched quizQuestions:", response?.data?.data);
            
            if (response?.data?.data) {
                setQuestions(response.data.data);
                const sections1 = Object.keys(questions);
                setSections(sections1);
                console.log("sections",Object.keys(questions));
            } else {
                console.warn("No questions found in API response.");
                setQuestions([]);
            }
        } catch (error) {
            console.error("Error fetching quiz questions:", error);
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (quiz === null) {
            navigate("/dashboard/create-quiz");
        }
    }, [quiz, navigate]);

    useEffect(() => {
        if (edit && id && token) {
            console.log("Fetching questions for quiz:", id);
            fetchQuestions();
        }
    }, [edit, id, token]);

    return (
        <div className="relative flex flex-col items-center gap-5 py-10">
            <h3 className="text-5xl text-center">Add Questions</h3>
            <section className="flex gap-y-3 w-full flex-col md:flex-row justify-between items-center bg-[#E0FBFC]">
                <div className="flex flex-col items-center md:items-start">
                    <span className="m-3">
                        <h2 className="text-2xl">{quiz?.title}</h2>
                        <p>{quiz?.description}</p>
                    </span>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={() => setCreateQuestionModalData({ ...quiz })}
                        className="text-4xl px-6 py-3 bg-blue-600 hover:bg-blue-700"
                    >
                        Create Question
                    </Button>
                    <Button
                        onClick={handleBulkUpload}
                        className="text-4xl px-6 py-3 bg-blue-600 hover:bg-blue-700"
                    >
                        Bulk Upload
                    </Button>
                </div>
            </section>
            <div className="w-full flex flex-col gap-5 rounded-lg min-h-[50vh]">
                {loading ? (
                    <div className="w-full text-lg text-black bg-[#E0FBFC] flex justify-center items-center min-h-[50vh]">
                        Loading questions...
                    </div>
                ) : sections.length === 0 ? (
                    <div className="w-full text-lg text-black bg-[#E0FBFC] flex justify-center items-center min-h-[50vh]">
                        No questions found
                    </div>
                ) : (
                    sections.map((sectionName,index) => (
                        <div key={index}>
                            <strong><h1>{sectionName}</h1></strong>
                            
                   { questions[sectionName].map((ques) => (
                        <div key={ques._id} className="flex flex-col gap-3 bg-white p-4 rounded shadow">
                            {ques.questionFormat === "IMAGE" ? (
                                <img
                                    src={ques.questionImage}
                                    alt="Question"
                                    className="max-w-[200px] max-h-[200px] object-contain rounded-md"
                                />
                            ) : (
                                <p className="text-xl">{ques.questionText}</p>
                            )}
                            <QuestionCard
                                deleteQuestionHandler={deleteQuestionHandler}
                                question={ques}
                                quiz={quiz}
                                setCreateQuestionModalData={setCreateQuestionModalData}
                                setQuestions={setQuestions}
                            />
                        </div>
                    ))
                 } </div>))
                )}
            </div>
            <Button onClick={finishHandler} className="self-end text-4xl px-6 py-3 bg-green-600">
                Finish
            </Button>
            {createQuestionModalData && (
                <CreateQuestionModal
                    quiz={createQuestionModalData}
                    setCreateQuestionModalData={setCreateQuestionModalData}
                    setQuestions={setQuestions}
                />
            )}
        </div>
    );
};

export default CreateQuestions;
