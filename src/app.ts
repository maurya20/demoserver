import express, {Request, Application, Response, NextFunction} from "express"
const userRuter = require("./routes/Users")
require('dotenv').config()
const PORT = process.env.PORT
const app: Application = express()

app.use("/",(req:Request, res:Response, next: NextFunction)=>{
    res.json({user: "Mike", age: "77"})
})


app.listen(PORT, ()=> console.log("server is running at port"))