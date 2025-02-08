import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Button from '../components/Button';
import { logout } from '../services/operations/AuthAPIs';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector(state => state.auth);
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Toggle the menu visibility on mobile
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <section className="min-h-screen ">
            <div className="flex justify-between items-center py-3 px-3 bg-[#010409] text-white rounded-lg border border-[#3D444D]-600 md:flex-row flex-col">
                {/* Logo or Brand Name */}
                <span className="text-xl font-bold text-[#3a506b] md:hidden">
                    Dashboard
                </span>

                {/* Desktop Navigation */}
                <div className="hidden md:flex py-3 justify-between items-center gap-x-5 text-sm">
                    <span className="space-x-1 md:space-x-3 text-sm md:text-base max-w-">
                        <NavLink to={"/"} className={`hover:bg-[#F78166] text-white transition-all duration-300 px-3 py-1 rounded-full ${location.pathname === "/dashboard" }`}>
                            Home
                        </NavLink>
                        <NavLink to={"/dashboard"} className={`hover:bg-[#F78166] transition-all duration-300 px-3 py-1 rounded-full ${location.pathname === "/dashboard" && "bg-[#F78166]"}`}>
                            Profile
                        </NavLink>
                        {
                            user.role === "admin" || user.role === "trainer" ? (
                                <>
                                    <Link to={"/dashboard/create-quiz"} className={`hover:bg-[#F78166] transition-all duration-300 px-3 py-1 rounded-full ${location.pathname.includes("create") && "bg-[#F78166]"}`}>
                                        Create
                                    </Link>
                                    <Link to={"/dashboard/quizes"} className={`hover:bg-[#F78166] transition-all duration-300 px-3 py-1 rounded-full ${location.pathname.includes("quizes") && "bg-[#F78166]"}`}>
                                        Quizzes
                                    </Link>
                                </>
                            ) : (
                                <Link to={"/dashboard/history"} className={`hover:bg-[#F78166] transition-all duration-300 px-3 py-1 rounded-full ${location.pathname.includes("history") && "bg-[#F78166]"}`}>
                                    History
                                </Link>
                            )
                        }
                    </span>

                    <span>
                        <Button active={false} onClick={() => logout(dispatch, navigate)}>
                            Logout
                        </Button>
                    </span>
                </div>

                {/* Hamburger Icon for Mobile */}
                <div className="md:hidden flex items-center">
                    <button onClick={toggleMenu} className="text-xl">
                        {isMenuOpen ? (
                            <span className="text-3xl">&times;</span>  // Close icon
                        ) : (
                            <span className="text-3xl">&#9776;</span>  // Hamburger icon
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation - Show when menu is open */}
            {isMenuOpen && (
                <div className="md:hidden flex flex-col py-3 bg-[#F78166] border border-slate-600">
                    <NavLink to={"/"} className={`hover:bg-[#F78166] transition-all duration-300 px-3 py-1 rounded-full ${location.pathname === "/dashboard" && "bg-[#F78166]"}`}>
                        Home
                    </NavLink>
                    <NavLink to={"/dashboard"} className={`hover:bg-[#F78166] transition-all duration-300 px-3 py-1 rounded-full ${location.pathname === "/dashboard" && "bg-[#F78166]"}`}>
                        Profile
                    </NavLink>
                    {
                        user.role === "admin" || user.role === "trainer" ? (
                            <>
                                <Link to={"/dashboard/create-quiz"} className={`hover:bg-[#F78166] transition-all duration-300 px-3 py-1 rounded-full ${location.pathname.includes("create") && "bg-[#F78166]"}`}>
                                    Create
                                </Link>
                                <Link to={"/dashboard/quizes"} className={`hover:bg-[#F78166] transition-all duration-300 px-3 py-1 rounded-full ${location.pathname.includes("quizes") && "bg-[#F78166]"}`}>
                                    Quizzes
                                </Link>
                            </>
                        ) : (
                            <Link to={"/dashboard/history"} className={`hover:bg-[#F78166] transition-all duration-300 px-3 py-1 rounded-full ${location.pathname.includes("history") && "bg-[#F78166]"}`}>
                                History
                            </Link>
                        )
                    }

                    <span className="px-3 py-1 mt-4">
                        <Button active={false} onClick={() => logout(dispatch, navigate)}>
                            Logout
                        </Button>
                    </span>
                </div>
            )}

            {/* Main Content */}
            <div className="px-3 py-5">{children}</div>
        </section>
    );
}

export default DashboardLayout;
