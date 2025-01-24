import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import SignUp from "./pages/SignUp"
import LogIn from "./pages/LogIn"
import LoggedInRoutes from "./components/LoggedInRoutes"
import Adminroutes from "./components/Adminroutes"
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
import ListManager from "./pages/ListManager"
import DepartmentManagement from "./pages/departmentmanagement"
import ListDetails from "./pages/ListDetails"
import Fourzerofour from "./pages/fourzerofour"
import Unauth from "./pages/unauth"
function App() {

  const { user } = useSelector(state => state.auth)

  return (
    <div
      className="bg-cover bg-center text-black min-h-screen"
      style={{ backgroundColor: 'white' }}
    >    <div className="w-full px-5 sm:px-3 mx-auto min-h-screen min-w-screen">
        <Routes>
          <Route path="/" element={<LoggedInRoutes><Home /></LoggedInRoutes>}/>
          <Route path="/quiz/:id" element={<LoggedInRoutes><AttemptQuiz /></LoggedInRoutes>} />
          <Route path="/quiz-results" element={<LoggedInRoutes><QuizResult /></LoggedInRoutes>} />
          <Route path="/leaderboard" element={<LoggedInRoutes><Leaderboard /></LoggedInRoutes>} />
          
          <Route path="/login" element={<LogIn />} />

          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard">
            <Route index element={<LoggedInRoutes><DashboardLayout><Profile /></DashboardLayout></LoggedInRoutes>} />
            <Route path="history" element={<LoggedInRoutes><DashboardLayout><History /></DashboardLayout ></LoggedInRoutes>} />
            <Route path="create-quiz" element={<LoggedInRoutes> <Adminroutes> <DashboardLayout><CreateQuiz /></DashboardLayout ></Adminroutes></LoggedInRoutes>} />
            <Route path="bulkupload" element={<LoggedInRoutes><Adminroutes> <DashboardLayout><BulkQuestionUpload /></DashboardLayout ></Adminroutes></LoggedInRoutes>} />
            <Route path="usermanagemnt" element={<LoggedInRoutes><Adminroutes><DashboardLayout><UserManagement /></DashboardLayout > </Adminroutes></LoggedInRoutes>} />
            <Route path="dept" element={<LoggedInRoutes><Adminroutes><DashboardLayout><DepartmentManagement/></DashboardLayout > </Adminroutes></LoggedInRoutes>} />
            <Route path="userlookup" element={<LoggedInRoutes><DashboardLayout><UserSearchAndAnalytics /></DashboardLayout ></LoggedInRoutes>} />
            <Route path="create-quiz/:id" element={<LoggedInRoutes><Adminroutes><DashboardLayout><CreateQuestions /></DashboardLayout ></Adminroutes></LoggedInRoutes>} />
            <Route path="quizes" element={<LoggedInRoutes><Adminroutes><DashboardLayout><AdminQuizes /></DashboardLayout></Adminroutes></LoggedInRoutes>} />
            <Route path="edit-quiz/:id" element={<LoggedInRoutes><Adminroutes><DashboardLayout><CreateQuiz /></DashboardLayout></Adminroutes></LoggedInRoutes>} />
            <Route path="ListManager" element={<LoggedInRoutes><DashboardLayout><ListManager /></DashboardLayout></LoggedInRoutes>} />
            <Route path="listdetails/:listId" element={<LoggedInRoutes><DashboardLayout><ListDetails /></DashboardLayout></LoggedInRoutes>} />
          </Route>
          <Route path="*" element={<Fourzerofour />} />
          <Route path="/unauthorized" element={<Unauth />} />

        </Routes>
      </div>
    </div>
  )
}

export default App
