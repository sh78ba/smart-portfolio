import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../utils/const'

const LOCAL_KEY = 'selectedPortfolio'
const NEWS_CACHE_KEY = 'matchedNews'

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
      } catch (err) {
        console.error('AI Analysis failed:', err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()
  }, [portfolio])

  return (
    <div className="mt-10 max-w-5xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">🧠 AI Insights</h2>

      {loading ? (
        <div className="text-center text-gray-500 mt-10">⏳ Generating insights based on your portfolio...</div>
      ) : (
        <>
          {summary && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-6 py-4 rounded mb-6 shadow">
              <h3 className="font-semibold mb-2">📊 Market Summary</h3>
              <p>{summary}</p>
            </div>
          )}

          {insights.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {insights.map((insight, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg border p-4 shadow-sm ${getSentimentColor(insight.sentiment)}`}
                >
                  <p className="font-semibold mb-2">{insight.headline}</p>
                  <p className="text-sm mb-1">
                    Sentiment: <span className="font-bold capitalize">{insight.sentiment}</span>
                  </p>
                  <p className="text-xs italic">{insight.reason}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 italic mt-10">
              No relevant news found for your portfolio.
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AIInsights
