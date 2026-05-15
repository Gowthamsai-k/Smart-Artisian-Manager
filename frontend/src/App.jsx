import Homepage from './Components/Homepage'
import Product from './Components/Artisian/Artisian_Products/Product'
import Payments from './Components/Artisian/Artisian_payments/Payments'
import LandingPage from './Components/LandingPage'
import Login from './Components/Auth/login'
import Signup from './Components/Auth/signup'

import { Routes, Route } from 'react-router-dom'

import { MantineProvider } from '@mantine/core'
import "@mantine/core/styles.css";

import ProtectedRoute from '../Protected'

function App() {

  return (

    <MantineProvider>

      <Routes>

        <Route path="/" element={<LandingPage />} />

        <Route path="/Home" element={<Homepage />} />

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