import { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'

const NewsContext = createContext()

export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([])

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/news')
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

export const useNews = () => useContext(NewsContext)
