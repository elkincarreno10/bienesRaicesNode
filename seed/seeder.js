import { exit } from 'node:process'
import categorias from "./categorias.js";
import precios from './precios.js';
import usuarios from './usuarios.js';
import db from "../config/db.js";
import { Categoria, Precio, Usuario } from '../models/index.js'


const importarDatos = async () => {
    try {
        // Autenticar
        await db.authenticate()

        // Generar las Columnas
        await db.sync()

        // Insertar los datos
        const promises = [Categoria.bulkCreate(categorias), Precio.bulkCreate(precios), Usuario.bulkCreate(usuarios)]
        await Promise.all(promises)
        console.log('Datos Importados Correctamente')
        exit()
        
    } catch (error) {
        console.log(error)
        exit(1)
    }
}

const eliminarDatos = async () => {
    try {
        await db.sync({force: true})
        console.log('Datos Eliminados Correctamente');
        exit()
    } catch (error) {
        console.log(error)
        exit(1)
    }
}

if(process.argv[2] === '-i') {
    importarDatos()
}

if(process.argv[2] === '-e') {
    eliminarDatos()
}

