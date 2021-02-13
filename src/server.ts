import mongoose from 'mongoose';
import app from './app';
mongoose.connect("mongodb://localhost:27017/Multer", {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
.then(() => console.log("Successfully connected to DataBase"))
.catch((err:Error) => {
   console.log(err);
});

mongoose.set('useFindAndModify', false);
const port  = process.env.PORT || 5000;
const server = app.listen(port, ()=> {
   console.log(`Server is running on port: ${port}`);
});
export  {server as server};