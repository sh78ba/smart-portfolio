import React, { useState } from 'react'
// import NewsFeed from './components/FilteredNews'
import PortfolioInput from './components/PortfolioInput'
import AIInsights from './components/AIInsights'
import Header from './components/Header'
import  { Route,Routes } from 'react-router'
import GeneralNews from './components/GeneralNews'

const App = () => {
  const [portfolio, setPortfolio] = useState([])
  return (
  <div className="min-h-screen bg-gray-100">
    <Header/>
     <div className='pt-14'>
       <Routes>
        
         <Route path='/' element={<GeneralNews/>}/>

         {/* <Route path='/portfolio' element={<PortfolioInput onUpdate={setPortfolio}/>}/> */}
      <Route path='/portfolio' element={<PortfolioInput onUpdate={setPortfolio}/>}/>
        {/* <Route path='/portfolio' element={<NewsFeed portfolio={portfolio} />}/> */}
        <Route path='/insights' element={<AIInsights portfolio={portfolio} />}/>
       </Routes>

      
      
     </div>
    </div>
  )
}

export default App