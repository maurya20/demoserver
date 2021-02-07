import express, {Request, Application, Response, NextFunction} from "express"
const userRuter = require("./routes/Users")
const productRouter = require("./routes/Products")
const authRouter = require("./routes/authRoute")
require('dotenv').config()
import mongoose from "mongoose"
const PORT = process.env.PORT
const app: Application = express()
//import cors from "cors"
const bodyParser = require('body-parser')
var path = require('path');

import * as debug from 'debug';
//debug('ts-express:server');


const db = 'mongodb://localhost:27017/demoserver'
mongoose.connect(db, { useUnifiedTopology: true, useCreateIndex:true, useNewUrlParser: true })
//mongoose.connection.on('error', err => debug(`MongoDB connection error: ${err}`));






app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())
//app.use(cors())

app.use("/api", authRouter);
app.use('/api', userRuter);
app.use("/api", productRouter);
// app.use('/api', signupRouter)
// app.use('/api', loginRouter)
// app.use('/api', loggedRouter)




app.listen(PORT, ()=> console.log("server is running at port"))