import express, {Request,Response,NextFunction} from 'express';
import {ProductModel} from '../models/ProductsModel';
const router = express.Router();
import {imageMiddleware} from "../middleware/imageMiddleware"



///GET api
router.get("/products", (req:Request, res:Response, next:NextFunction) => {
  ProductModel.find()
    .select("_id name price image")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            _id: doc._id,
            name: doc.name,
            price: doc.price,
            image: doc.image,
           
            request: {
              type: "GET",
              url: "http://localhost:5000/products/" + doc._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

///@Post  api
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