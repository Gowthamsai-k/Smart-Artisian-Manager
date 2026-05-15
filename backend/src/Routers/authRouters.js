import express from 'express'
import { Login, Signup, GetProfile } from '../auth/manageAuth.js'
import protect from '../middleware/authMiddle.js'

const ClientRouter = express.Router();

ClientRouter.post('/signup', Signup)
ClientRouter.post('/login', Login)
ClientRouter.get('/profile', protect, GetProfile)

export default ClientRouter