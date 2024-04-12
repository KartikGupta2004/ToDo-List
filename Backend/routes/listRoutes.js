const express=require('express')

const router=express.Router()
const list = require('../models/listModel')
const {createList,getLists, getList, deleteList, updateList}=require('../controllers/listController')
const requireAuth = require('../middleware/requireAuth')

router.use(requireAuth)//require auth for all workout routes
router.get('/',getLists)//ALL
router.get('/:id',getList)//SINGLE
router.post('/',createList)//SINGLE
router.delete('/:id',deleteList)//SINGLE
router.patch('/:id',updateList)//SINGLE

module.exports = router