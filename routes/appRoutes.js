import express from 'express'
import {
    inicio,
    categoria,
    noEncontrado,
    buscador
} from '../controllers/appController.js'
import identificarUsuario from '../middleware/identificarUsuario.js'

const router = express.Router()


// Página de Inicio
router.get('/', identificarUsuario, inicio)

// Categorías
router.get('/categorias/:id', identificarUsuario, categoria)

// Página de 404
router.get('/404', identificarUsuario, noEncontrado)

// Buscador
router.post('/buscador', identificarUsuario, buscador)

export default router