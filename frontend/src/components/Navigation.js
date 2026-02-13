import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useModal } from '../contexts/ModalContext';
import { Link, useLocation } from 'react-router-dom';
import { FiBarChart2, FiSearch, FiUpload, FiCheckSquare, FiSettings, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

export const Navigation = () => {
  const { user, logout } = useAuth();
  const { openLoginModal, openRegisterModal } = useModal();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) => `
    flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200
    ${isActive(path)
      ? 'bg-white/20 text-white font-semibold'
      : 'text-indigo-100 hover:text-white hover:bg-white/10'
    }
  `;

  return (
    <nav className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 text-white shadow-2xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition group">
            <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition">
              <img src="/urslogo.png" alt="URS Logo" className="h-8 w-8" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight">Thesis URS</span>
              <p className="text-xs text-indigo-200 -mt-1">University Thesis Repository</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {user &&(
              <>
                <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                  <FiBarChart2 className="w-5 h-5" /> Dashboard
                </Link>
                <Link to="/search" className={navLinkClass('/search')}>
                  <FiSearch className="w-5 h-5" /> Search
                </Link>
                {user.role === 'STUDENT' && (
                  <Link to="/submit" className={navLinkClass('/submit')}>
                    <FiUpload className="w-5 h-5" /> Submit
                  </Link>
                )}
                {user.role === 'REVIEWER' && (
                  <Link to="/review-dashboard" className={navLinkClass('/review-dashboard')}>
                    <FiCheckSquare className="w-5 h-5" /> Review
                  </Link>
                )}
                {user.role === 'ADMIN' && (
                  <Link to="/admin-dashboard" className={navLinkClass('/admin-dashboard')}>
                    <FiSettings className="w-5 h-5" /> Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-semibold">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{user.firstName}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-3 w-56 bg-white text-gray-800 rounded-xl z-50 overflow-hidden">
                      <div className="px-4 py-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
                        <p className="font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                          {user.role}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 font-medium transition flex items-center gap-2 border-t border-gray-200"
                      >
                        <FiLogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition"
            >
              {showMobileMenu ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden mt-4 pb-4 space-y-2 border-t border-white/20 pt-4">
            {user ? (
              <>
                <Link to="/dashboard" className="block px-4 py-2 rounded-lg text-indigo-100 hover:text-white hover:bg-white/10 transition">
                  Dashboard
                </Link>
                <Link to="/search" className="block px-4 py-2 rounded-lg text-indigo-100 hover:text-white hover:bg-white/10 transition">
                  Search
                </Link>
                {user.role === 'STUDENT' && (
                  <Link to="/submit" className="block px-4 py-2 rounded-lg text-indigo-100 hover:text-white hover:bg-white/10 transition">
                    Submit Thesis
                  </Link>
                )}
                {user.role === 'REVIEWER' && (
                  <Link to="/review-dashboard" className="block px-4 py-2 rounded-lg text-indigo-100 hover:text-white hover:bg-white/10 transition">
                    Review
                  </Link>
                )}
                {user.role === 'ADMIN' && (
                  <Link to="/admin-dashboard" className="block px-4 py-2 rounded-lg text-indigo-100 hover:text-white hover:bg-white/10 transition">
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/browse" className="block px-4 py-2 rounded-lg text-indigo-100 hover:text-white hover:bg-white/10 transition">
                  Browse
                </Link>
                <button
                  onClick={() => {
                    openLoginModal();
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 rounded-lg text-indigo-100 hover:text-white hover:bg-white/10 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    openRegisterModal();
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 rounded-lg bg-white text-indigo-700 hover:bg-indigo-50 transition font-semibold"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
