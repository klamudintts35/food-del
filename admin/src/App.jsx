import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Order from './pages/Order/Order'
import { ToastContainer } from 'react-toastify';
import Edit from './pages/Edit/Edit'

const App = () => {
  const bestURL = 'https://food-del-backend-58xj.onrender.com/';
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
            <Route path="/add" element={<Add bestURL={bestURL}/>} />
            <Route path="/list" element={<List bestURL={bestURL}/>} />
            <Route path="/orders" element={<Order bestURL={bestURL}/>} />
            <Route path="/edit/:id" element={<Edit bestURL={bestURL} />} />
        </Routes>
      </div>
      
    </div>
  )
}

export default App


// 
