import React, { useState } from 'react'
import { useNews } from '../components/NewsContext'

const truncateWords = (text, wordLimit = 20) => {
  if (!text) return ''
  const words = text.split(' ')
  return words.length <= wordLimit ? text : words.slice(0, wordLimit).join(' ') + '...'
}

const PAGE_SIZE = 6

const GeneralNews = () => {
  const { news } = useNews()
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(news.length / PAGE_SIZE)

  const startIndex = (currentPage - 1) * PAGE_SIZE
  const endIndex = startIndex + PAGE_SIZE
  const currentNews = news.slice(startIndex, endIndex)

  const goToPrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const goToNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  return (
    <div className="px-4">
      <h2 className="text-xl font-semibold mb-4 text-center">📰 General News</h2>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {currentNews.map((n, idx) => (
          <div
            key={idx}
            className="max-w-sm w-full mx-auto p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm"
          >
            <a href={n.link} target="_blank" rel="noreferrer">
              <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900">
                {n.title}
              </h5>
            </a>
            <p className="mb-3 text-sm text-gray-700">{truncateWords(n.description, 20)}</p>
            <a
              href={n.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
            >
              Read more
              <svg
                className="w-3.5 h-3.5 ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </a>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-4 items-center">
          <button
            onClick={goToPrevious}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={goToNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default GeneralNews
