import express, {Request,Response,NextFunction} from 'express';
import {ProductModel} from '../models/ProductsModel';
import multer from 'multer';
const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    
    filename: function (req: any, file: any, cb: any) {
        cb(null, file.originalname)
    }
});
const fileFilter = (req: any,file: any,cb: any) => {
    if(file.mimetype === "image/jpg"  || 
       file.mimetype ==="image/jpeg"  || 
       file.mimetype ===  "image/png"){cb(null, true); }
    else {cb(new Error("Image uploaded is not of type jpg/jpeg or png"),false)}
}
const upload = multer({storage: storage, fileFilter : fileFilter});
router.post('/product',upload.single('image'),async(req: Request,
            res:Response, next :NextFunction)=>{
      
       let newProduct = new ProductModel({
            name: req.body.name,
            price: req.body.price,
            images: req.files
       });
       await newProduct.save();
       res.json(newProduct);
});
export {router as ProductRoutes};