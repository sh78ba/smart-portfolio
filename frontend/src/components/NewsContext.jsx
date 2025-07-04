// src/components/NewsContext.jsx
import { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../utils/const'

// Create context
const NewsContext = createContext(null)

// Hook
export const useNews = () => useContext(NewsContext)

// Provider component
export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([])

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/news`)
        setNews(res.data)
      } catch (err) {
        console.error('News fetch failed:', err.message)
      }
    }

    fetchNews()
  }, [])

  return (
    <NewsContext.Provider value={{ news, setNews }}>
      {children}
    </NewsContext.Provider>
  )
}
