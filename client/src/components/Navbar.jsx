import React, { useState } from 'react';
import { FaBars, FaTimes, FaHome, FaChartBar, FaTachometerAlt } from 'react-icons/fa';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/Button';
import { logout } from '../services/operations/AuthAPIs';
import { useDispatch, useSelector } from 'react-redux';
import soloLogo1 from './placementlogo.jpg';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth); // Assuming user role is stored in Redux state.

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="bg-[#1E4175] text-white w-full fixed top-0 left-0 z-50">
            <div className="max-w-[1200px] mx-auto px-5 sm:px-3 flex items-center justify-between py-3">
                {/* Logo and Title */}
                <div className="flex items-center gap-3">
                    <img src={soloLogo1} alt="Sona Placement Logo" className="h-10 w-10 rounded-full" />
                    <Link to="/" className="text-2xl font-bold font-mono">
                        Sona Placement Portal
                    </Link>
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex gap-5 items-center">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex items-center gap-2 ${isActive ? 'text-green-600' : 'text-white hover:text-gray-200'}`
                        }
                    >
                        <FaHome /> Home
                    </NavLink>
                    <NavLink
                        to="/leaderboard"
                        className={({ isActive }) =>
                            `flex items-center gap-2 ${isActive ? 'text-green-600' : 'text-white hover:text-gray-200'}`
                        }
                    >
                        <FaChartBar /> Leaderboard
                    </NavLink>
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `flex items-center gap-2 ${isActive ? 'text-green-600' : 'text-white hover:text-gray-200'}`
                        }
                    >
                        <FaTachometerAlt /> Dashboard
                    </NavLink>

                    {/* Role-Based Options */}
                    <div className="flex items-center gap-3  px-3 py-1 rounded-lg border border-slate-600">
                        <NavLink
                            to="/dashboard"
                            className={`hover:bg-slate-700 transition-all duration-300 px-3 py-1 rounded-full ${location.pathname === '/dashboard' && 'bg-green-500'}`}
                        >
                            Profile
                        </NavLink>
                        {user.role === 'admin' || user.role==='trainer' ? (
                            <>
                                <NavLink
                                    to="/dashboard/create-quiz"
                                    className={` transition-all duration-300 px-3 py-1 rounded ${
                                        location.pathname.includes('create') && 'bg-green-500'
                                    }`}
                                >
                                    Create
                                </NavLink>
                                <NavLink
                                    to="/dashboard/quizes"
                                    className={`transition-all duration-300 px-3 py-1 rounded ${
                                        location.pathname.includes('quizes') && 'bg-green-500'
                                    }`}
                                >
                                    Quizes
                                </NavLink>
                            </>
                        ) : (
                            <NavLink
                                to="/dashboard/history"
                                className={`hover:bg-slate-700 transition-all duration-300 px-3 py-1 rounded ${
                                    location.pathname.includes('history') && 'bg-green-500'
                                }`}
                            >
                                History
                            </NavLink>
                        )}
                    </div>

                    {/* Logout Button */}
                    <Button
                        active={false}
                        className="ml-5"
                        onClick={() => logout(dispatch, navigate)}
                    >
                        Logout
                    </Button>
                </div>

                {/* Hamburger Icon */}
                <button
                    className="block md:hidden text-white text-2xl"
                    onClick={toggleMenu}
                >
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-[#1E4175] shadow-lg">
                    <NavLink
                        to="/"
                        onClick={toggleMenu}
                        className={({ isActive }) =>
                            `block py-2 px-5 flex items-center gap-2 ${isActive ? 'text-green-600' : 'text-white'}`
                        }
                    >
                        <FaHome /> Home
                    </NavLink>
                    <NavLink
                        to="/Leaderboard"
                        onClick={toggleMenu}
                        className={({ isActive }) =>
                            `block py-2 px-5 flex items-center gap-2 ${isActive ? 'text-green-600' : 'text-white'}`
                        }
                    >
                        <FaChartBar /> Leaderboard
                    </NavLink>
                    <NavLink
                        to="/dashboard"
                        onClick={toggleMenu}
                        className={({ isActive }) =>
                            `block py-2 px-5 flex items-center gap-2 ${isActive ? 'text-green-600' : 'text-white'}`
                        }
                    >
                        <FaTachometerAlt /> Dashboard
                    </NavLink>

                    {/* Role-Based Options */}
                    <div className="py-2 px-5">
                        <NavLink
                            to="/dashboard"
                                className={`hover:bg-slate-700 transition-all duration-300 px-3 py-1 rounded ${
                                location.pathname === '/dashboard' && 'bg-[green]'
                            }`}
                            onClick={toggleMenu}
                        >
                            Profile
                        </NavLink>
                        {user.role === 'admin'||'trainer' ? (
                            <>
                                <NavLink
                                    to="/dashboard/create-quiz"
                                    className={`block hover:bg-slate-700 transition-all duration-300 px-3 py-1 rounded ${
                                        location.pathname.includes('create') && 'bg-[green]'
                                    }`}
                                    onClick={toggleMenu}
                                >
                                    Create
                                </NavLink>
                                <NavLink
                                    to="/dashboard/quizes"
                                    className={`block hover:bg-slate-700 transition-all duration-300 px-3 py-1 rounded ${
                                        location.pathname.includes('quizes') && 'bg-[green]'
                                    }`}
                                    onClick={toggleMenu}
                                >
                                    Quizes
                                </NavLink>
                            </>
                        ) : (
                            <NavLink
                                to="/dashboard/history"
                                className={`block hover:bg-slate-700 transition-all duration-300 px-3 py-1 rounded-full ${
                                    location.pathname.includes('history') && 'bg-[green]'
                                }`}
                                onClick={toggleMenu}
                            >
                                History
                            </NavLink>
                        )}
                    </div>

                    {/* Logout Button */}
                    <div className="px-5 py-2">
                        <Button active={false} onClick={() => logout(dispatch, navigate)}>
                            Logout
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
