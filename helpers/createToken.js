const jwt = require('jsonwebtoken')

function createToken(user,req,res) {
    const token = jwt.sign({
        name: user.name,
        id : user._id
    }, process.env.SECRET_KEY)

    res.status(200).json({
       message: "Logado",
       token: token
   })
}

module.exports = createToken