import { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../utils/const'

const NewsContext = createContext()

export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/news`)
        console.log('✅ News fetched:', res.data)
        setNews(res.data)
      } catch (err) {
        console.error('❌ News fetch failed:', err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  return (
    <NewsContext.Provider value={{ news, setNews, loading }}>
      {children}
    </NewsContext.Provider>
  )
}

export const useNews = () => useContext(NewsContext)
