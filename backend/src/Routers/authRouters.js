import express from 'express'
import { Login, Signup } from '../auth/manageAuth.js'

const ClientRouter = express.Router();

ClientRouter.post('/signup', Signup)
ClientRouter.post('/login', Login)

export default ClientRouter