import React, { useEffect, useState, useMemo } from 'react'
import { NIFTY_50 } from '../utils/nifty50'
import { useNews } from '../components/NewsContext'

const LOCAL_KEY = 'selectedPortfolio'
const STOCKS_PER_PAGE = 5
const NEWS_PER_PAGE = 6

const PortfolioInput = ({ onUpdate }) => {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [selected, setSelected] = useState([])
  const [portfolioPage, setPortfolioPage] = useState(1)

  const { news } = useNews()

  // Load portfolio from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      setSelected(parsed)
      const keywords = parsed.flatMap(s => [s.symbol, s.name])
      onUpdate(keywords)
    }
  }, [onUpdate])

  // Handle input changes
  const handleChange = (e) => {
    const value = e.target.value
    setInput(value)

    if (!value.trim()) return setSuggestions([])

    const query = value.toLowerCase()
    const matches = NIFTY_50.filter(stock =>
      stock.symbol.toLowerCase().includes(query) ||
      stock.name.toLowerCase().includes(query)
    ).slice(0, 5)

    setSuggestions(matches)
  }

  // Select stock
  const handleSelect = (stock) => {
    if (!selected.find(s => s.symbol === stock.symbol)) {
      const updated = [...selected, stock]
      setSelected(updated)
      setSuggestions([])
      setInput('')
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated))
      const keywords = updated.flatMap(s => [s.symbol, s.name])
      onUpdate(keywords)
    }
  }

  // Remove stock
  const handleRemove = (symbol) => {
    const updated = selected.filter(s => s.symbol !== symbol)
    setSelected(updated)
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated))
    const keywords = updated.flatMap(s => [s.symbol, s.name])
    onUpdate(keywords)
    if ((portfolioPage - 1) * STOCKS_PER_PAGE >= updated.length && portfolioPage > 1) {
      setPortfolioPage(portfolioPage - 1)
    }
  }

  // Truncate description
  const truncateWords = (text, wordLimit = 20) => {
    if (!text) return ''
    const words = text.split(' ')
    return words.length <= wordLimit ? text : words.slice(0, wordLimit).join(' ') + '...'
  }

  // Pagination logic
  const totalStockPages = Math.ceil(selected.length / STOCKS_PER_PAGE)
  const displayedStocks = selected.slice((portfolioPage - 1) * STOCKS_PER_PAGE, portfolioPage * STOCKS_PER_PAGE)

  // Compute keywords for current page
  const currentKeywords = displayedStocks.flatMap(s => [s.symbol, s.name])

  // Memoized filtered news
  const matchedNews = useMemo(() => {
    if (!news || news.length === 0) return []
    return news.filter(article =>
      currentKeywords.some(kw =>
        article.title?.toLowerCase().includes(kw.toLowerCase()) ||
        article.description?.toLowerCase().includes(kw.toLowerCase())
      )
    ).slice(0, NEWS_PER_PAGE)
  }, [news, currentKeywords])

  return (
    <div className="mb-6 max-w-5xl mx-auto px-4">
      {/* Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search and add NIFTY50 stocks"
          className="w-full px-4 py-2 rounded border"
          value={input}
          onChange={handleChange}
        />
        {suggestions.length > 0 && (
          <ul className="absolute bg-white border rounded mt-1 w-full z-10 max-h-48 overflow-y-auto">
            {suggestions.map(stock => (
              <li
                key={stock.symbol}
                onClick={() => handleSelect(stock)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {stock.name} ({stock.symbol})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Portfolio Table */}
      {selected.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-4">Your Portfolio</h4>
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-100 text-left text-sm text-gray-700">
                <tr>
                  <th className="px-4 py-2">Stock Name</th>
                  <th className="px-4 py-2">Symbol</th>
                  <th className="px-4 py-2">Qty</th>
                  <th className="px-4 py-2">Est. Value</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {displayedStocks.map((stock, idx) => {
                  const qty = 10
                  const estValue = (idx + 1) * 1500
                  return (
                    <tr key={stock.symbol} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{stock.name}</td>
                      <td className="px-4 py-2 font-semibold">{stock.symbol}</td>
                      <td className="px-4 py-2 text-center">{qty}</td>
                      <td className="px-4 py-2 text-green-600 text-center">₹{estValue}</td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleRemove(stock.symbol)}
                          className="text-red-500 hover:text-red-700"
                          title="Remove"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalStockPages > 1 && (
            <div className="mt-4 flex justify-center items-center gap-4">
              <button
                onClick={() => setPortfolioPage(p => Math.max(1, p - 1))}
                disabled={portfolioPage === 1}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm">
                Page {portfolioPage} of {totalStockPages}
              </span>
              <button
                onClick={() => setPortfolioPage(p => Math.min(totalStockPages, p + 1))}
                disabled={portfolioPage === totalStockPages}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* News Section */}
      {news.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">Fetching latest news...</p>
      ) : matchedNews.length > 0 ? (
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-4">📌 Matched News for current stocks</h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {matchedNews.map((n, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg shadow border">
                <a
                  href={n.link}
                  className="text-blue-700 font-bold"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {n.title}
                </a>
                <p className="text-sm text-gray-600 mt-2">
                  {truncateWords(n.description, 20)}
                </p>
                <p className="text-xs text-gray-400 mt-1">{n.pubDate}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">No news matched your selected stocks yet.</p>
      )}
    </div>
  )
}

export default PortfolioInput
