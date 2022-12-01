const jwt = require('jsonwebtoken')

function LoginRequired(req,res,next) {
    const AuthToken = req.headers.authorization

    if(!AuthToken){
        return res.status(401).json({message:"Token nao enviado"})
    }
    const token = AuthToken.split(' ')[1]
    try{
        const auth =  jwt.verify(token, process.env.SECRET_KEY)
        console.log(auth)
        req.userId = auth.id
        next()
    }catch(err){
        res.status(401).json({message: "Token invalido"})
    }

   

    
}

module.exports = LoginRequired