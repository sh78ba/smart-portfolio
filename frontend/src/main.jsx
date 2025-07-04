import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router'
import { NewsProvider } from './components/NewsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <BrowserRouter>
    <NewsProvider>
    <App />
    </NewsProvider>
    </BrowserRouter>
   
  </StrictMode>
)
