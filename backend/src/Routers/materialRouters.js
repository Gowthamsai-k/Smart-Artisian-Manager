import express from 'express'
import { AddMaterial, GetMaterials, GetMaterialStats } from '../Controller/Materials/materialController.js'

const materialRouter = express.Router()

materialRouter.post('/', AddMaterial)
materialRouter.get('/all', GetMaterials)
materialRouter.get('/stats', GetMaterialStats)

export default materialRouter
