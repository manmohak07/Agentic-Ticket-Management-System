import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Ticket from './pages/ticket.jsx'
import Tickets from './pages/tickets.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CheckAuth from './components/check-auth.jsx'
import './index.css'
import Signup from './pages/signup.jsx'
import Admin from './pages/admin.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <CheckAuth protected={true}>
            <Tickets></Tickets>
          </CheckAuth>
        } />
        <Route path='/tickets/:id' element={
          <CheckAuth protected={true}>
            <Ticket />
          </CheckAuth>
        } />
        <Route path='/login' element={
          <CheckAuth protected={false}>
            <Login />
          </CheckAuth>
        } />
        <Route path='/signup' element={
          <CheckAuth protected={false}>
            <Signup />
          </CheckAuth>
        }
        />
        <Route path='/admin' element={
          <CheckAuth protected={true}>
            <Admin />
          </CheckAuth>
        }

        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
