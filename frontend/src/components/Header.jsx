import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Header = () => {
  const { pathname } = useLocation()

  const navLinks = [
    { path: '/', label: 'General News' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/insights', label: 'AI Insights' },
  ]

  return (
    <header className="bg-white shadow sticky top-0 z-50 py-4 px-6 flex flex-wrap justify-between items-center">
      <h1 className="text-2xl font-extrabold text-blue-600 tracking-tight">📈 Smart-Portfolio</h1>

      <nav className="space-x-4 mt-2 sm:mt-0">
        {navLinks.map(link => (
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
    </header>
  )
}

export default Header
