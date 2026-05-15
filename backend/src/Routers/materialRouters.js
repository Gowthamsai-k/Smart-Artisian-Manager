import express from 'express'
import { AddMaterial, GetMaterials, GetMaterialStats, UpdateMaterial, DeleteMaterial } from '../Controller/Materials/materialController.js'

const materialRouter = express.Router()

materialRouter.post('/', AddMaterial)
materialRouter.get('/all', GetMaterials)
materialRouter.get('/stats', GetMaterialStats)
materialRouter.put('/:id', UpdateMaterial)
materialRouter.delete('/:id', DeleteMaterial)

export default materialRouter
