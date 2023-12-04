const express = require('express')
const connectDB = require('../backend/mongoDB/db');
const { errorHandler } = require('./middleware/errorMiddleware');
require('dotenv').config()
const PORT = 5000
connectDB()
let app = express()
app.use(express.json())


const cors = require('cors');
app.use(cors());


//app.get('/',(req,res) =>{
//    res.status(200).json({message:"Port is Running..."})
//})


//routes
app.use('/api/users', require('./routes/userRoutes'))



app.use(errorHandler)

app.listen(PORT, () => console.log(`Server Running on PORT ${PORT}`))