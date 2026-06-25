import  { useState } from 'react'
import Navbar from './components/navbar/navbar'
import Footer from './components/footer/footer'
import Home from './home'
import LoginPopup from './components/login/login'
import { Routes, Route } from 'react-router-dom'
import Cart from './components/cart/cart'
import OrderPage from './components/orderPage/orderPage'
import Orders from './components/orders/orders' 
import SearchPage from './components/search/search'
import Verify from './components/verify/verify'

const App = () => {
  
  const [login, setLogin] = useState(false)
  const [searchQuery, setSearchQuery] = useState("") 

  return (
    <>
      {login ? <LoginPopup setLogin={setLogin} /> : null}
      
      <div className='app'>
        <Navbar 
          setLogin={setLogin}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery} 
        />
        
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<OrderPage />} />    
          <Route path="/myorders" element={<Orders />} />
          <Route path="/verify" element={<Verify />} />
          <Route
            path='/search'
            element={
              <SearchPage
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            }
          />
        </Routes>
      </div>

      <Footer />
    </>
  )
}

export default App