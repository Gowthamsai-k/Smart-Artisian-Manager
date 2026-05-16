import express from 'express'
import { AddMaterial, GetMaterials, GetMaterialStats, UpdateMaterial, DeleteMaterial } from '../Controller/Materials/materialController.js'
import protect from '../middleware/authMiddle.js'

const materialRouter = express.Router()

materialRouter.post('/', protect, AddMaterial)
materialRouter.get('/all', protect, GetMaterials)
materialRouter.get('/stats', protect, GetMaterialStats)
materialRouter.put('/:id', protect, UpdateMaterial)
materialRouter.delete('/:id', protect, DeleteMaterial)

export default materialRouter
