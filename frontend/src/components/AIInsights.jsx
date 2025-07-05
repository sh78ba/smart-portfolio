import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../utils/const'

const LOCAL_KEY = 'selectedPortfolio'
const NEWS_CACHE_KEY = 'matchedNews'
const ITEMS_PER_PAGE = 6 // 6 cards per page

const getSentimentColor = (sentiment) => {
  switch (sentiment.toLowerCase()) {
    case 'positive':
      return 'bg-green-100 text-green-800 border-green-300'
    case 'negative':
      return 'bg-red-100 text-red-800 border-red-300'
    default:
      return 'bg-yellow-100 text-yellow-800 border-yellow-300'
  }
}



const AIInsights = () => {
  const [insights, setInsights] = useState([])
  const [summary, setSummary] = useState('')
  const [portfolio, setPortfolio] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const savedPortfolio = localStorage.getItem(LOCAL_KEY)
    if (savedPortfolio) {
      try {
        setPortfolio(JSON.parse(savedPortfolio))
      } catch (err) {
        console.error('Failed to parse saved portfolio:', err.message)
      }
    }
  }, [])

  useEffect(() => {
    const fetchInsights = async () => {
      if (!portfolio.length) return

      const matchedNewsRaw = localStorage.getItem(NEWS_CACHE_KEY)
      if (!matchedNewsRaw) return

      const matchedNews = JSON.parse(matchedNewsRaw)
      const topHeadlines = matchedNews.slice(0, 5).map(n => n.title)
      if (topHeadlines.length === 0) return

      try {
        setLoading(true)
        const res = await axios.post(`${BACKEND_URL}/api/analyze`, {
          headlines: topHeadlines,
          portfolio: portfolio.map(p => p.symbol)
        })

        const data = res.data || []
        setInsights(data.filter(item => item.headline))
        setSummary(data.find(item => item.summary)?.summary || '')
        setCurrentPage(1) // Reset to first page when data updates
      } catch (err) {
        console.error('AI Analysis failed:', err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()
  }, [portfolio])

  // Pagination Logic
  const totalPages = Math.ceil(insights.length / ITEMS_PER_PAGE)
  const paginatedInsights = insights.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="my-5 max-w-5xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">🧠 AI Insights</h2>

      {loading ? (
        <div className="text-center text-gray-500 mt-10">
          ⏳ Generating insights based on your portfolio...
        </div>
      ) : (
        <>
          {summary && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-6 py-4 rounded mb-6 shadow">
              <h3 className="font-semibold mb-2">📊 Market Summary</h3>
              <p>{summary}</p>
            </div>
          )}

          {insights.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedInsights.map((insight, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-4 p-4 border rounded-md shadow-sm hover:scale-105 hover:shadow-blue-400 hover:shadow-md transition duration-500 ease-in-out bg-gray-50 ${getSentimentColor(insight.sentiment)}`}
                  >
                    <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        width="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-blue-600"
                      >
                        <path d="M12 2L15 8H9L12 2ZM2 12L8 15V9L2 12ZM12 22L9 16H15L12 22ZM22 12L16 9V15L22 12Z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 mb-1">{insight.headline}</p>
                      {insight.stock && (
                        <p className="text-sm text-gray-600 mb-0.5">
                          <span className="font-medium">Stock:</span>{" "}
                          <span className="capitalize font-semibold">{insight.stock}</span>
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mb-0.5">
                        <span className="font-medium">Sentiment:</span>{" "}
                        <span className="capitalize font-semibold">{insight.sentiment}</span>
                      </p>
                      <p className="text-sm text-gray-600 mb-0.5">
                        <span className="font-medium">Confidence:</span>{" "}
                        <span className="capitalize font-semibold">{insight.confidence}</span>
                      </p>
                      <p className="text-xs text-gray-500 italic mt-1">{insight.reason}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Buttons */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    ◀ Prev
                  </button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Next ▶
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500 italic mt-10">
              No relevant news found for your portfolio.
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AIInsights