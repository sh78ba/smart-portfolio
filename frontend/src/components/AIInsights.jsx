import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNews } from './NewsContext'

const LOCAL_KEY = 'selectedPortfolio'

const AIInsights = () => {
  const { news } = useNews()
  const [insights, setInsights] = useState([])
  const [summary, setSummary] = useState('')
  const [portfolio, setPortfolio] = useState([])

  useEffect(() => {
    // Load portfolio from localStorage
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
        const res = await axios.post('http://localhost:5001/api/analyze', {
          headlines: topHeadlines,
          portfolio: portfolio.map(p => p.symbol)
        })
        console.log(res)
        const data = res.data || []
        console.log(data)

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
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">AI Insights</h2>

      {summary && (
        <div className="bg-green-100 p-4 rounded mb-6">
          <p className="font-medium">📊 <span className="font-semibold">Market Summary:</span> {summary}</p>
        </div>
      )}

      {insights.length > 0 ? (
        insights.map((insight, idx) => (
          <div key={idx} className="bg-yellow-100 p-4 mb-3 rounded">
            <p className="font-bold">{insight.headline}</p>
            <p className="text-sm">
              Sentiment: <span className="font-semibold">{insight.sentiment}</span>
            </p>
            <p className="text-xs italic mt-1">{insight.reason}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-600 italic">No relevant news found for your portfolio.</p>
      )}
    </div>
  )
}

export default AIInsights
