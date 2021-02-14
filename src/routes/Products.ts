import express, {Request,Response,NextFunction} from 'express';
import {ProductModel} from '../models/ProductsModel';
const router = express.Router();
import {imageMiddleware} from "../middleware/imageMiddleware"
///
router.post("/product", imageMiddleware.single('image'), (req, res, next) => {
  const newproduct = new ProductModel({
    name: req.body.name,
    price: req.body.price,
    image: `http://localhost:5000/${req.file.path}`
  });
  console.log(req.file)
  newproduct
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
            name: result.name,
            price: result.price,
            _id: result._id,
            request: {
                type: 'GET',
                url: "http://localhost:5000/products/" + result._id
            }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


export {router as ProductRoutes};