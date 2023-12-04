const express = require('express')
const router = express()

const {registerUser,loginUser, profilePage} = require('../controllers/userControllers')
const {createUser,getAllNewUsers, deleteSingleUser, updateSingleUser} = require('../controllers/newUserController')

const {protect} = require('../middleware/authMiddleware')

router.post('/',registerUser)
router.post('/login',loginUser)
router.get('/me',protect,profilePage)
router.post('/createUser',protect,createUser)
router.get('/newUsers',protect,getAllNewUsers)
router.delete('/:id',protect,deleteSingleUser)
router.put('/:id',protect,updateSingleUser)

module.exports = router