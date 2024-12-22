import React, { useEffect, useState } from 'react'
import { quizEndpoints } from '../../../services/APIs'
import { apiConnector } from '../../../services/apiConnector'
import { useSelector } from 'react-redux'
import { formatDistanceToNow } from 'date-fns'
import { CSVLink } from 'react-csv' // Import from react-csv

const Score = ({ quiz }) => {
    const [scores, setScores] = useState([])
    const [csvData, setCsvData] = useState([]) // State for CSV data
    const [loading, setLoading] = useState(true)
    const [quizname, setQuizName] = useState("")
    const { token } = useSelector(state => state.auth)

    const dataprepforcsv = (scores) => {
        let csvdata = []
        scores.forEach((score, index) => {
            csvdata.push({
                serialNumber: index + 1,
                Username: score?.userId?.username || "N/A",
                Score: score.score,
                Time: formatDistanceToNow(new Date(score.createdAt), { addSuffix: true }),
            })
        })
        return csvdata
    }

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await apiConnector("GET", `${quizEndpoints.GET_SCORES}/${quiz._id}`, null, {
                    Authorization: `Bearer ${token}`,
                })
                const quizData = response?.data?.data.slice(0, -1)
                const quizName = response?.data?.data.slice(-1)[0] || "quiz_results"
                setQuizName(quizName)
                setScores(quizData)
            } catch (error) {
                console.error("error :", error)
            } finally {
                setLoading(false)
            }
        }

        fetchScores()
    }, [])

    useEffect(() => {
        if (scores.length > 0) {
            setCsvData(dataprepforcsv(scores))
        }
    }, [scores])

    return (
        <div className='bg-[#e0fbfc] z-[2] w-full rounded-lg py-5 flex flex-col gap-1 text-xl'>
            {loading ? (
                <div className='text-center'>Loading...</div>
            ) : scores.length > 0 ? (
                <div className='border rounded-lg border-slate-600 overflow-hidden'>
                    <h3 className='px-3 text-2xl bg-[#e0fbfc] py-2 text-center'>Results</h3>
                    <div className="flex justify-end items-center p-4">
                        <CSVLink
                            data={csvData}
                            filename={`${quizname}.csv`}
                            className="text-white text-4xl px-4 py-3 rounded-md bg-green-600 hover:bg-green-700 transition-all duration-300 border border-green-700 text-sm w-max"
                        >
                            Download CSV
                        </CSVLink>
                    </div>
                    <div className='flex justify-between px-5 py-3'>
                        <p className='text-green-600'>Username</p>
                        <p className='text-green-600'>Score</p>
                    </div>
                    {[...scores].reverse().map((score, index) => (
                        <div className='flex justify-between items-center py-3 border-t border-slate-600 px-5' key={index}>
                            <span className='flex flex-col md:flex-row gap-1 items-center'>
                                <p className='text-sm md:text-lg'>{score?.userId?.username}</p>
                                <p className='text-xs md:text-sm text-black-300'>
                                    - {formatDistanceToNow(new Date(score.createdAt), { addSuffix: true })}
                                </p>
                            </span>
                            <p>
                                <span className={`${score?.score / score.answers.length >= 0.4 ? "text-green-500" : "text-red-700"}`}>
                                    {score?.score}
                                </span> / {score.answers.length}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className='text-center'>No scores found</p>
            )}
        </div>
    )
}

export default Score
