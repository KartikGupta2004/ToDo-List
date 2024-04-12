const mongoose = require('mongoose')
const List = require('../models/listModel')

const getLists = async (req,res)=>{
    const user_id = req.user._id
    const lists = await List.find({user_id}).sort({createdAt:-1})
    res.status(200).json(lists)
}

const getList = async(req,res)=>{
    const {id} =req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"No such list"})
    }
    const list = await List.findById(id)
    if(!list){
        return res.status(404).json({error:"No such list"})
    }
    res.status(200).json(list)
}

const createList = async (req,res)=>{
    const {title,dueDate,note} = req.body
    let emptyFields = []

    if(!title){
        emptyFields.push('Title')
    }
    if(!dueDate){
        emptyFields.push('Date')
    }
    if(!note){
        emptyFields.push('Note')
    }
    if(emptyFields.length > 0){
        return res.status(400).json({error: 'Please fill in all the fields',emptyFields})
    }
    //Add doc to DB
    try{
        const user_id = req.user._id
        const list = await List.create({title,dueDate,note,user_id, steps:[]})
        res.status(200).json(list)
    }
    catch(error){
        res.status(404).json({error:error.message})
    }
}

const deleteList = async(req,res)=>{
    const {id} =req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"No such list"})
    }
    const list = await List.findOneAndDelete({_id:id})
    if(!list){
        return res.status(404).json({error:"No such list"})
    }
    res.status(200).json(list)
}

const updateList = async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such list" });
    }
  
    const { title, dueDate, note, steps } = req.body;
  
    try {
      const updatedAt = new Date();
  
      const list = await List.findOneAndUpdate(
        { _id: id },
        { title, dueDate, note, steps, updatedAt },
        { new: true }
      );
  
      if (!list) {
        return res.status(404).json({ error: "No such list" });
      }
  
      res.status(200).json(list);
    } catch (error) {
      console.error("Error updating list:", error);
      res.status(500).json({ error: "Failed to update list" });
    }
  };
  
  

module.exports= {
    createList,
    getLists,
    getList,
    deleteList,
    updateList
}