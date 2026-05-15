import Homepage from './Components/Homepage'
import Product from './Components/Artisian/Artisian_Products/Product'
import Payments from './Components/Artisian/Artisian_payments/Payments'
import Login from './Components/Auth/login'
import Signup from './Components/Auth/signup'

import Dashboard from './Components/Dashboard/Dashboard'
import { Routes, Route } from 'react-router-dom'

import { MantineProvider } from '@mantine/core'
import "@mantine/core/styles.css";

import ProtectedRoute from '../Protected'

function App() {

  return (

    <MantineProvider>

      <Routes>

        <Route path="/" element={<Homepage />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path='/Product' element={<Product />} />

        <Route path='/login' element={<Login />} />

        <Route path='/signup' element={<Signup />} />

        <Route
          path='/Payments'
          element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          }
        />

      </Routes>

    </MantineProvider>
  )
}

export default App