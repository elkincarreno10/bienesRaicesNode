import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import Usuario from "../models/Usuario.js"
import { generarId, generarJWT } from '../helpers/tokens.js'
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js'

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken()
    })
}

const autenticar = async (req, res) => {
    // Validación
    await check('email').isEmail().withMessage('El email es obligatorio').run(req)
    await check('password').notEmpty().withMessage('El password es obligatorio').run(req)

    let resultado = validationResult(req)

    // Verificar que el resultado está vacio
    if(!resultado.isEmpty()) {
        // ERRORES
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    const { email, password } = req.body
    // Comprobar si el usuario existe
    const usuario = await Usuario.findOne({ where: {email} })
    if(!usuario) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El Usuario no Existe'}]
        })
    }

    // Comprobar si el usuario está confirmado
    if(!usuario.confirmado) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Tu Cuenta no ha sido Confirmada'}]
        })
    }

    // Revisar el password
    if(!usuario.verificarPassword(password)) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El password es incorrecto'}]
        })
    }

    // Autenticar el usuario
    const token = generarJWT({ id: usuario.id, nombre: usuario.nombre })

    // Almacenar en un cookie
    return res.cookie('_token', token, {
        httpOnly: true,
        // secure: true,
        // sameSite: true
    }).redirect('/mis-propiedades')
}

const cerrarSesion = (req, res) => {
    return res.clearCookie('_token').status(200).redirect('/auth/login')
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    })
}

const registrar = async (req, res) => {

    // Validación
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacio').run(req)
    await check('email').isEmail().withMessage('Eso no parece un email').run(req)
    await check('password').isLength({ min: 6}).withMessage('El password debe ser de al menos 6 caracteres').run(req)
    await check('repetir_password').equals('password').withMessage('Los passwords no son iguales').run(req)

    let resultado = validationResult(req)

    // Verificar que el resultado está vacio
    if(!resultado.isEmpty()) {
        // ERRORES
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    // Extraer los datos
    const { nombre, email, password } = req.body

    // Verificar que el usuario no esté duplicado
    const existeUsuario = await Usuario.findOne({ where: { email } })

    if(existeUsuario) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario ya está registrado'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    // Almacenar un usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })

    // Envia email de confirmación
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    // Mostrar un mensaje de confirmación
    res.render('templates/mensaje', {
        pagina: 'Cuenta Creada Correctamente',
        mensaje: 'Hemos Enviado un Email de Confirmación, presiona el enlace'
    })
}

// Función que comprueba una cuenta
const confirmar = async (req, res) => {
    const { token } = req.params

    // Verificar si el token válido
    const usuario = await Usuario.findOne({ where: {token} })
    if(!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al Confirmar tu Cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
            error: true
        })
    }

    // Confirmar la cuenta
    console.log('TODO BIEN')
    usuario.token = null
    usuario.confirmado = true
    console.log(usuario)
    await usuario.save()

    res.render('auth/confirmar-cuenta', {
        pagina: 'Cuenta Confirmada',
        mensaje: 'La cuenta se confirmó correctamente'
    })
}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a bienes racies',
        csrfToken: req.csrfToken(),
    })
}

const resetPassword = async (req, res) => {
    // Validación
    await check('email').isEmail().withMessage('Eso no parece un email').run(req)

    let resultado = validationResult(req)

    // Verificar que el resultado está vacio
    if(!resultado.isEmpty()) {
        // ERRORES
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a bienes racies',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    // Extraer los datos
    const { email } = req.body

    // Buscar el usuario
    const usuario = await Usuario.findOne({ email })

    if(!usuario) {
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a bienes racies',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El email no pertenece a ningún usuario'}]
        })
    }

    // Generar un token y enviar el email
    usuario.token = generarId()
    await usuario.save()

    // Enviar el email
    emailOlvidePassword({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    // Renderizar una vista
    res.render('templates/mensaje', {
        pagina: 'Reestablce tu Password',
        mensaje: 'Hemos Enviado un Email con las Instrucciones'
    })
}

const comprobarToken = async (req, res) => {
    const { token } = req.params

    const usuario = await Usuario.findOne({ token })

    if(!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Reestablcee tu Password',
            mensaje: 'Hubo un error al validar tu información, intenta de nuevo',
            error: true
        })
    }

    // Mostrar formulario para modificar el password
    res.render('auth/reset-password', {
        pagina: 'Reestablece tu Password',
        csrfToken: req.csrfToken()
    })
}

const nuevoPassword = async (req, res) => {
    // Validar el password
    await check('password').isLength({ min: 6}).withMessage('El password debe ser de al menos 6 caracteres').run(req)

    let resultado = validationResult(req)

    // Verificar que el resultado está vacio
    if(!resultado.isEmpty()) {
        // ERRORES
        return res.render('auth/reset-password', {
            pagina: 'Reestablece tu Password',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    const { token } = req.params
    const { password } = req.body

    // Identificar el usuario
    const usuario = await Usuario.findOne({ token })

    // Hashear el password
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt)
    usuario.token = null
    await usuario.save()

    res.render('auth/confirmar-cuenta', {
        pagina: 'password Reestablecido',
        mensaje: 'El Password se Guardó Correctamente'
    })
}

export {
    formularioLogin,
    autenticar,
    cerrarSesion,
    formularioRegistro,
    formularioOlvidePassword,
    confirmar,
    registrar,
    resetPassword,
    comprobarToken,
    nuevoPassword
}