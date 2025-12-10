const express = require('express')
const router = express.Router()
const User = require("../modules/user.model")

//MIDDLEWARE
const getUser = async(req,res,next) => {
    let user;
    const { id } = req.params;

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        return res.status(404).json({
            message: 'El id no es valido'
        })
    }

    try{
        user = await User.findById(id)
        if(!user){
            return res.status(404).json({
                message: 'el libro no fue encontrado'
            })
        }
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
    res.user = user
    next()
}

//GET ALL
router.get('/',async (req, res) => {
    try{
        const users = await User.find()
        console.log('GET ALL',users)
        if(users.length == 0){
           return res.status(200).json([])
        }
        return res.json(users)
    }
    catch(error) {
        res.status(500).json({ message: error.message })
    }
})

//GET ONE
router.get('/:id', getUser,async (req, res) => {
    res.json(res.user)
})

//PUT
router.put('/:id', getUser,async (req, res) => {
    try{
        const user = res.user
        user.name = req.body.name || user.password
        user.password = req.body.password || user.password
        user.email = req.body.email || user.email
        user.roles = req.body.roles || user.roles
        let updateUser = await user.save()
        res.json(updateUser)
        
    } catch (error){
        res.status(400).json({ message: error.message })
    }
})

//POST
router.post('/', async (req, res) => {
    const { name, password, email, roles, createdAt } = req.body
    if(!name || !password || !email || !roles ){
        return res.status(400).json({
            message: 'todos los campos deben completarse'
        })
    }

    const user = new User(
        {
            name: name,
            password: password,
            email: email,
            roles: roles,
            createdAt: createdAt
        }
    )

    try{
        const newUser = await user.save()
        console.log("Usuario Creado", newUser)
        res.status(201).json(newUser)
    } catch(error){
        res.status(400).json({ message: error.message})
    }
})

//PATCH
router.patch('/:id', getUser,async (req, res) => {

    if(!req.body.name && !req.body.password && !req.body.email && !req.body.roles){
        res.status(404).json({ message: 'Alguno de los campos debe ser enviado'})
    }

    try{
        const user = res.user
        user.name = req.body.name || user.password
        user.password = req.body.password || user.password
        user.email = req.body.email || user.email
        user.roles = req.body.roles || user.roles
        let updateUser = await user.save()
        res.json(updateUser)
        
    } catch (error){
        res.status(400).json({ message: error.message })
    }
})

//DELETE
router.delete('/:id', getUser,async (req, res) => {
    try{

        const user = res.user
        await user.deleteOne({ _id: user._id })
        res.json({
            message: `El libro ${user.title} ha sido eliminado correctamente`
        })
    }
    catch (error){
        res.status(500).json({ message: error.message })
    }
})

module.exports = router
