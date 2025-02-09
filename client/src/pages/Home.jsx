import { useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { apiConnector } from "../services/apiConnector"
import { quizEndpoints } from "../services/APIs/index"
import Lottie from 'react-lottie';
import animationData from '../lottie/nothingfound.json';
import animationdata2 from "../lottie/geting.json"
import QuizCard from '../components/core/Home/QuizCard'
import Navbar from '../components/Navbar'
const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};
const defaultOption = {
  loop: true,
  autoplay: true,
  animationData: animationdata2,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};
const Home = () => {

  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const { token, user } = useSelector(state => state.auth)

  const fetchQuizzes = async () => {
    setLoading(true)
    try {
      const response = await apiConnector("GET", `${quizEndpoints.GET_ALL_QUIZESS}/${user.id}`, null, {
        Authorization: `Bearer ${token}`
      })

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      console.log(response.data.data)
      const filteredQuizzes = response.data.data // Excludes the 0th index
      console.log(`spliced data `)
      console.log(filteredQuizzes)
      setQuizzes(filteredQuizzes);

    } catch (e) {
      console.log("COULDNT GET QUIZZES")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuizzes();
  }, [])

  return (
    <section className='min-h-[90vh]  border-t border-slate-600 py-5 mt-3 '>
      <Navbar />
      {
        loading ? <div className='text-center min-h-[90vh] flex items-center justify-center text-xl'>
          <Lottie 
            options={defaultOption}
            height={500} // Larger height
            width={500}  // Larger width
          />
          <h3>
          Loading your quizzes...</h3></div>
          : !loading && quizzes?.length > 0
            ? <div className='grid grid-cols-1 md:grid-cols-2 gap-3 lg:grid-cols-3 '>
              {
                quizzes.map((quiz, index) => {
                  console.log(`Rendering quiz at index ${index}:`);
                  return <QuizCard key={quiz._id} quiz={quiz} index={index} />;
                })
              }
            </div>
            : 
            <><Lottie 
            options={defaultOptions}
            height={500} // Larger height
            width={500}  // Larger width
          />
          <h2  className='text-center mt-7 flex items-center  justify-center text-xl'>You have all caught up!</h2>
          </>
      }
    </section>
  )
}

export default Home