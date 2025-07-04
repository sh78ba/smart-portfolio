import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNews } from './NewsContext'
import { BACKEND_URL } from '../utils/const'

const LOCAL_KEY = 'selectedPortfolio'

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
  const { news } = useNews()
  const [insights, setInsights] = useState([])
  const [summary, setSummary] = useState('')
  const [portfolio, setPortfolio] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setPortfolio(parsed)
      } catch (err) {
        console.error('Failed to parse saved portfolio:', err.message)
      }
    }
  }, [])

  useEffect(() => {
    const fetchInsights = async () => {
      if (!portfolio.length || !news.length) return

      const keywords = portfolio.flatMap(s => [s.symbol, s.name]).map(k => k.toLowerCase())

      const relevant = news.filter(article =>
        keywords.some(kw =>
          article.title?.toLowerCase().includes(kw) ||
          article.description?.toLowerCase().includes(kw)
        )
      )

      const topHeadlines = relevant.slice(0, 5).map(n => n.title)

      try {
        const res = await axios.post(`${BACKEND_URL}/api/analyze`, {
          headlines: topHeadlines,
          portfolio: portfolio.map(p => p.symbol)
        })

        const data = res.data || []
        const sentimentData = data.filter(item => item.headline)
        const summaryObj = data.find(item => item.summary)

        setInsights(sentimentData)
        setSummary(summaryObj?.summary || '')
      } catch (err) {
        console.error('AI Analysis failed:', err.message)
      }
    }

    fetchInsights()
  }, [portfolio, news])

  return (
    <div className="mt-10 max-w-5xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">🧠 AI Insights</h2>

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
                Sentiment:{' '}
                <span className="font-bold capitalize">{insight.sentiment}</span>
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
    </div>
  )
}

export default AIInsights
