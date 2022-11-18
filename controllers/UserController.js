const User = require('../models/UserModels')
const validator = require('validator')
const ObjectId = require('mongoose').Types.ObjectId
const bcrypt = require('bcrypt')

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
        const {name, email, password, confirmpassword } = req.body


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
            password : passwordHash
        })
        try{
            const newUser = user.save()
            res.status(200).json({message:'Usuario criado'})
        }catch(e){
            console.log(e)
        }
    }
    static async edit(req,res){
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
        const userUpdate = {name, email}
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
        res.json({message:'Usuario excluido com sucesso'})
    }
    static async login(req,res){
        const { email, password} = req.body
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
        console.log(password)
        const checkPassword = await bcrypt.compare(password,userExists.password)
        if(!checkPassword){
            res.json({message:"senha invalida."})
            return 
        }
        res.json({message:"Usuario logado"})
    }
}