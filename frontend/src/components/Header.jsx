

import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Header = () => {
  const { pathname } = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { path: '/', label: 'News' },
    { path: '/portfolio', label: 'My Portfolio' },
    { path: '/insights', label: 'AI Insights' },
  ]

  return (
    <header className="bg-white shadow sticky top-0 z-50 px-6 py-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-blue-600 tracking-tight">
          📈 Smart-Portfolio
        </h1>

        {/* Hamburger Button (only on small screens) */}
        <button
          className="sm:hidden text-gray-700 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm sm:text-base font-medium transition-colors ${
                pathname === link.path
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="flex flex-col space-y-2 mt-4 sm:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)} // close menu on click
              className={`text-base font-medium transition-colors ${
                pathname === link.path
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}

export default Header

