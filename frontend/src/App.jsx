import Homepage from './Components/Homepage'
import Product from './Components/Artisian/Artisian_Products/Product'
import Materials from './Components/Artisian/Artisian_Products/Materials'
import Payments from './Components/Artisian/Artisian_payments/Payments'
import Login from './Components/Auth/login'
import Signup from './Components/Auth/signup'
import Sales from './Components/Artisian/Sales'

import Dashboard from './Components/Dashboard/Dashboard'
import { Routes, Route, useLocation } from 'react-router-dom'

import { MantineProvider } from '@mantine/core'
import "@mantine/core/styles.css";
import './Components/Dashboard/Dashboard.css';

import ProtectedRoute from '../Protected'
import GuestRoute from '../GuestRoute'
import Navbar from './Components/Sidebar/Navbar'
import Profile from './Components/Auth/Profile'
import Chatbot from './Components/AI/Chatbot'

function App() {
  const location = useLocation();
  const isAuthPage = ['/', '/login', '/signup'].includes(location.pathname);

  return (
    <MantineProvider theme={{
      primaryColor: 'olive',
      colors: {
        olive: [
          '#f3f6e9', '#e6eeda', '#ccdcb6', '#b0c98f', '#97b96e', '#84ad56', '#79a449', '#678f3c', '#5a7f34', '#556B2F'
        ],
      },
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div className={isAuthPage ? "" : "main-content-top"}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path='/Product' element={
              <ProtectedRoute>
                <Product />
              </ProtectedRoute>
            } />

            <Route path='/materials' element={
              <ProtectedRoute>
                <Materials />
              </ProtectedRoute>
            } />

            <Route path='/sales' element={
              <ProtectedRoute>
                <Sales />
              </ProtectedRoute>
            } />

            <Route path='/profile' element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            <Route path='/login' element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            } />

            <Route path='/signup' element={
              <GuestRoute>
                <Signup />
              </GuestRoute>
            } />

            <Route path='/Payments' element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </MantineProvider>
  )
}

export default App