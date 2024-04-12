const express = require('express')
const mongoose = require('mongoose')

require('dotenv').config()

const app = express()
const listRoutes = require('./routes/listRoutes')
const userRoutes = require('./routes/user')
//Middleware
app.use(express.json())

app.get('/',(req,res,next)=>{
    console.log(req.path, req.method);
    next();
})

app.use('/api/lists',listRoutes)
app.use('/api/user',userRoutes)

mongoose.connect(process.env.MONGO_URI)
.then((req,res)=>
app.listen(process.env.PORT,()=>{
    console.log('Connected to DB and listening on port',process.env.PORT)
}))
.catch((err)=>console.log(err));


