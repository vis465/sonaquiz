import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import SignUp from "./pages/SignUp"
import LogIn from "./pages/LogIn"
import LoggedInRoutes from "./components/LoggedInRoutes"
import Profile from "./pages/Profile"
import CreateQuiz from "./pages/CreateQuiz"
import DashboardLayout from "./components/DashboardLayout"
import CreateQuestions from "./pages/CreateQuestions"
import AdminQuizes from "./pages/AdminQuizes"
import AttemptQuiz from "./pages/AttemptQuiz"
import QuizResult from "./pages/QuizResult"
import { useSelector } from "react-redux"
import History from "./pages/History"
import buildingimg from './components/nirf-ranking-2024.png'
import BulkQuestionUpload from "./pages/BulkQuestionUpload"
import UserManagement from "./pages/UserManagement"
import UserSearchAndAnalytics from "./pages/UserSearchAndAnalytics"
import Leaderboard from "./pages/Leaderboard"
function App() {

  const { user } = useSelector(state => state.auth)

  return (
<div 
  className="bg-cover bg-center text-black min-h-screen"
  style={{ backgroundImage: `url(${buildingimg})` }}
>    <div className="w-full px-5 sm:px-3 mx-auto min-h-screen min-w-screen">
        <Routes>
          <Route path="/" element={<LoggedInRoutes><Home /></LoggedInRoutes>} />
          <Route path="/quiz/:id" element={<LoggedInRoutes><AttemptQuiz /></LoggedInRoutes>} />
          <Route path="/quiz-results" element={<LoggedInRoutes><QuizResult /></LoggedInRoutes>} />
          <Route path="/leaderboard" element={<LoggedInRoutes><Leaderboard /></LoggedInRoutes>} />

          <Route path="/login" element={<LogIn />} />
        
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard">
            <Route index element={<LoggedInRoutes><DashboardLayout><Profile /></DashboardLayout></LoggedInRoutes>} />
            <Route path="history" element={<LoggedInRoutes><DashboardLayout><History /></DashboardLayout ></LoggedInRoutes>} />
            <Route path="create-quiz" element={<LoggedInRoutes><DashboardLayout><CreateQuiz /></DashboardLayout ></LoggedInRoutes>} />
            <Route path="bulkupload" element={<LoggedInRoutes><DashboardLayout><BulkQuestionUpload /></DashboardLayout ></LoggedInRoutes>} />
            <Route path="usermanagemnt" element={<LoggedInRoutes><DashboardLayout><UserManagement /></DashboardLayout ></LoggedInRoutes>} />
            <Route path="userlookup" element={<LoggedInRoutes><DashboardLayout><UserSearchAndAnalytics/></DashboardLayout ></LoggedInRoutes>} />
            <Route path="create-quiz/:id" element={<LoggedInRoutes><DashboardLayout><CreateQuestions /></DashboardLayout ></LoggedInRoutes>} />
            <Route path="quizes" element={<LoggedInRoutes><DashboardLayout><AdminQuizes /></DashboardLayout></LoggedInRoutes>} />
            <Route path="edit-quiz/:id" element={<LoggedInRoutes><DashboardLayout><CreateQuiz /></DashboardLayout></LoggedInRoutes>} />
          </Route>
        </Routes>
      </div>
    </div>
  )
}

export default App
