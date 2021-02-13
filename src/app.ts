import express, {Request, Application, Response, NextFunction} from "express"
const userRuter = require("./routes/Users")
const productRouter = require("./routes/Products")
const authRouter = require("./routes/authRoute")
require('dotenv').config()
import mongoose from "mongoose"
const PORT = process.env.PORT
const app: Application = express()
import * as bodyParser from "body-parser";
//import * as helmet from "helmet";
//import * as cors from "cors";
var path = require('path');
const multer = require("multer")
import * as debug from 'debug';
//debug('ts-express:server');


const db = 'mongodb://localhost:27017/demoserver'
mongoose.connect(db, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
.then(() => console.log("Successfully connected to database"))
.catch((err:Error) => { console.log(err)});







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

const storage = multer.diskStorage({
    destination: './upload/images',
    //@ts-ignore
    filename: (req:Request, file, cb:any) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10
    }
})
app.use('/profile', express.static('upload/images'));
app.post("/upload", upload.single('profile'), (req: Request, res:Response) => {

    res.json({
        success: 1, 
        //@ts-ignore
        profile_url: `http://localhost:5000/profile/${req.file.filename}`
    })
})
//@ts-ignore
function errHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        res.json({
            success: 0,
            message: err.message
        })
    }
}
app.use(errHandler);

app.listen(PORT, ()=> console.log(`server is running at port:${PORT}`))