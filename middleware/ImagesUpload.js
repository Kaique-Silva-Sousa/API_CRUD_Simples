const multer = require('multer')
const {extname, resolve} = require('path')


const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null,resolve(__dirname,'..','uploads','images'))
    },

    filename: (req,file,cb) =>{
        cb(null, `${Date.now()}_${extname(file.originalname)}`)
    }
    
})

const imageUpload = multer({
    storage,
    fileFilter: (req,file,cb)=>{
        if(file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg'){
            req.imageNotFormatValid = true
            return cb(null,false,req.imageNotFormatValid)
        }
        return cb(null,true)
    },
})



module.exports = imageUpload