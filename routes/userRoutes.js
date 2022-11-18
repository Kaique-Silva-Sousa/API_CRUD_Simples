const router = require('express').Router()
const UserController = require('../controllers/UserController')
const User = require('../models/UserModels')

router.get('/',UserController.showUsers)
router.post('/create',UserController.create)
router.post('/edit/:id',UserController.edit)
router.post('/login',UserController.login)
router.post('/delete/:id',UserController.delete)
// router.post('/',UserController.Home)

module.exports = router