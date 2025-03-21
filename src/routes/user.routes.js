import express from "express";
import  User  from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const router = express.Router()

//register
router.post('/register', async(req,res) => {
    try{
        const { name, password, mail } = req.body

        if (!name || !password || !mail) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        // Verificar que el correo no sea nulo ni vacío
        if (!mail || mail.trim() === "") {
            return res.status(400).json({ error: "El correo electrónico no puede estar vacío" });
        }

        // Verificar si el correo ya está registrado
        const existingUser = await User.findOne({ mail });
        if (existingUser) {
            return res.status(400).json({ error: "El correo electrónico ya está registrado" });
        }

        const newUser = new User({ name, password, mail })
        await newUser.save()

        res.status(201).json({ message: "Usuario registrado exitosamente" });
        
    }
    catch(error){
        res.status(500).json({ error: error.message })
    }
})

//login
router.post('login', async(req,res) => {
    try{
        const { nombre, password } = req.body
        const user = await User.findOne({ nombre })
        if(!user) return res.json(400).json({ message: 'El usuario no fue encontrado'})
        
        const isMatch = bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(401).json({message: 'Contraseña Incorrecta'})

        const token = jwt.sign({ id: user._id }, 'secreto', { expiresIn: '24h' });
        res.json({ token });
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
    if (!token) return res.status(401).json({ message: 'No autorizado' });
    
    try{
        const decoded = jwt.verify(token,'secreto');
        const user = await User.findById(dedode.id).select('-password')
        res.json(user);
    } catch(error){
        res.status(401).json({ message: 'Token invalido' })
    }
})

export default router