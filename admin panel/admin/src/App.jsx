import React from 'react'
import './index.css'
import Navbar from './components/navbar/navbar'
import Sidebar from './components/sidebar/sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './components/pages/add/add'
import List from './components/pages/list/list'
import Order from './components/pages/orders/order'
 import { ToastContainer} from 'react-toastify';
const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Navbar/>
      <hr/>
      <div className="app-content">
        <Sidebar/>
        <Routes>
          <Route path='/add' element={<Add/>}/>
          <Route path='/list' element={<List/>}/>
          <Route path='/order' element={<Order/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default App
