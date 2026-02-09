const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const listRoutes = require('./routes/listRoutes')
const userRoutes = require('./routes/user')
const app = express()
const corsOptions = {
    origin: 'https://todo-list-frontend-flyu.onrender.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  
app.use(cors(corsOptions));

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


