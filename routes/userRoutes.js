const router = require('express').Router()
const UserController = require('../controllers/UserController')
const User = require('../models/UserModels')
const LoginRequired = require('../middleware/LoginRequired')
const imageUpload = require('../middleware/ImagesUpload')

router.get('/',LoginRequired,UserController.showUsers)
router.post('/create',imageUpload.single('image'),UserController.create)
router.post('/edit/:id',imageUpload.single('image'),UserController.edit)
router.post('/login',UserController.login)
router.post('/delete/:id',UserController.delete)

module.exports = router