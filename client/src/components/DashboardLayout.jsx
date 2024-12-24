import { useLocation } from 'react-router-dom'
import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { logout } from '../services/operations/AuthAPIs'
import { useDispatch, useSelector } from 'react-redux'

const DashboardLayout = ({ children }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector(state => state.auth)

    return (
        <section className=''>
            <div className='flex py-3 px-3 justify-between items-center gap-y-5  my-3 text-lg bg-[#e0fbfc] rounded-lg border border-slate-600'>
                <span className='space-x-1 md:space-x-3 text-sm md:text-base'>
                <NavLink to={"/"} className={`hover:bg-slate-700 transition-all duration-300 px-3 py-1 rounded-full ${location.pathname === "/dashboard" && "bg-[#e0fbfc]"}`}>
                        Home
                    </NavLink>
                    <NavLink to={"/dashboard"} className={`hover:bg-slate-700 transition-all duration-300 px-3 py-1 rounded-full ${location.pathname === "/dashboard" && "bg-[#e0fbfc]"}`}>
                        Profile
                    </NavLink>
                    {
                        user.role === "admin" ? <>
                            <Link to={"/dashboard/create-quiz"} className={`hover:bg-slate-700 transition-all duration-300 px-3 py-1 rounded-full ${location.pathname.includes("create") && "bg-[#e0fbfc]"}`}>
                                Create
                            </Link>
                            <Link to={"/dashboard/quizes"} className={`hover:bg-slate-700 transition-all duration-300 px-3 py-1 rounded-full ${location.pathname.includes("quizes") && "bg-[#e0fbfc]"}`}>
                                Quizes
                            </Link>
                        </> : <>
                            <Link to={"/dashboard/history"} className={`hover:bg-slate-700 transition-all duration-300 px-3 py-1 rounded-full ${location.pathname.includes("history") && "bg-[#e0fbfc]"}`}>
                                History
                            </Link>

                        </>
                    }
                </span>
                <span>
                    <Button active={false} onClick={() => logout(dispatch, navigate)}>
                        Logout
                    </Button>
                </span>
            </div>
            {children}
        </section>
    )
}

export default DashboardLayout