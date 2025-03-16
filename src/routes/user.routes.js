import express from "express";
import  User  from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const router = express.Router()

//register
router.post('/register', async(req,res) => {
    try{
        const { name, password, mail } = req.body
        const newUser = new User({ name, password, mail })
        await newUser.save()
        res.status(200).json({
            message: 'Se registro exitosamente'
        })
    }
    catch(error){
        res.status(500).json({ error: error.message })
    }
})

//login
router.post('/login', async(req,res) => {
    try{
        const { name, password } = req.body
        const user = await User.findOne({ name })
        if(!user) {
            return res.status(400).json({ message: 'El usuario no fue encontrado'})
        }
        
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return res.status(401).json({message: 'Contraseña Incorrecta'})
        }

        
        const token = jwt.sign({ id: user._id }, 'secreto', { expiresIn: '24h' });
        res.status(200).json({ message: 'Logueado correctamente', token });
        
    }
    catch(error){
        res.status(500).json({
            message: error.message
        })
    }
})

//ruta protegida
router.get('/perfil', async(req,res)=>{
    const token = req.headers.authorization;
    

    // Verificar que el token esté presente después de eliminar 'Bearer'.
    if (!token) {
        return res.status(401).json({ message: 'Token no válido' });
    }

    try {
        // Verificar y decodificar el token.
        const decoded = jwt.verify(token, 'secreto');
        console.log('Token decodificado:', decoded);
        const user = await User.findById(decoded.id).select('-password')
        res.json(user);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado' });
        }

        console.log('Error al verificar token:', error);
        return res.status(401).json({ message: 'Token inválido' });
    }
})

export default router