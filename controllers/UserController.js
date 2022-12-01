const User = require('../models/UserModels')
const validator = require('validator')
const ObjectId = require('mongoose').Types.ObjectId
const bcrypt = require('bcrypt')
const createToken = require('../helpers/createToken')
const multer = require('multer')
const imageUpload = require('../middleware/ImagesUpload')


module.exports = class UserController{
    static async showUsers(req,res){
        try{
            const Users = await User.find()// .select('-_id')
            res.json(Users)
        }catch(err){
            console.log(err)
        }
    }
    static async create(req,res){
        if(req.imageNotFormatValid){
            return res.status(401).json({message:'Imagem com  formato invalido'})
        }
        const {name, email, password, confirmpassword } = req.body
        const image = req.file
        console.log(image)
        if(!email){
            res.json({message:'Email nao enviado'})
            return
        }

        if(!name){
            res.json({message:'name nao enviado'})
            return
        }
        if(!validator.isEmail(email)){
            res.json({message:'error'})
            return
        }
        if(!password){
            res.json({message:'error, senha nao enviada'})
            return
        }
        if(!confirmpassword){
            res.json({message:'Erro Confirmacao de senha nao enviado'})
            return
        }
        if(password !== confirmpassword){
            res.json({message:'as senhas nao são iguais'})
            return
        }
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password.toString(),salt)

        const userExists = await User.findOne({email:email})
        if(userExists){
            res.json({message:'Já existe um usuario com este email'})
            return
        }
        const user =  new User({
            name,
            email,
            password : passwordHash,
            image : image.filename

        })
        try{
            const newUser = user.save()
            createToken(user,req,res)
            
        }catch(e){
            console.log(e)
        }
    }
    static async edit(req,res){
        if(req.imageNotFormatValid){
            return res.status(401).json({message:'Imagem com  formato invalido'})
        }
        const image = req.file.filename
        console.log(image)
        const {name, email } = req.body
        const id = req.params.id
        if(!ObjectId.isValid(id)){
            res.json({message:'Id Invalido'})
        }
        const user = await User.findById(id)

        if(!user){
            res.json({message:'Usuario nao encontrado'})
        }
        if(!email){
            res.json({message:'Email nao enviado'})
            return
        }
        if(!name){
            res.json({message:'name nao enviado'})
            return
        }
        if(!validator.isEmail(email)){
            res.json({message:'error'})
            return
        }  
        if(user.email === email){
            res.json({message:'Digite um email diferente'})
            return
        }
        const userUpdate = {name, email, image}
        await User.updateOne({_id:id,},userUpdate)
        res.json({message:'Usuario atualizado'})
    }
    static async delete(req,res){
        const id = req.params.id
        if(!ObjectId.isValid(id)){
            res.json({message:'id invalido'})
        }
        const user = User.findById(id)
        if(!user){
            res.json({message:'Usuario nao encontrado'})
        }
        await User.findByIdAndDelete(id)
        // await User.deleteMany()
        res.json({message:'Usuario excluido com sucesso'})
    }
    static async login(req,res){
        const { email, password} = req.body
        const user = User.findOne({email:email})
        if(!password){
            res.json({message:'Senha nao enviada'})
        }
        if(!email){
            res.json({message:'Email nao enviado'})
            return
        }
        const userExists = await User.findOne({email: email})
        if(!userExists){
            res.json({message:'Usuario nao encontrado'})
        }
        const checkPassword = await bcrypt.compare(password,userExists.password)
        if(!checkPassword){
            res.json({message:"senha invalida."})
            return 
        }
        createToken(user,req,res)
    }
}