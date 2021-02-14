import express, {Request,Response,NextFunction} from 'express';
import {ProductModel} from '../models/ProductsModel';
const router = express.Router();
import {imageMiddleware} from "../middleware/imageMiddleware"



///GET api all producs
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

////GET single product
router.get("/product/:productId", (req, res, next) => {
  const id = req.params.productId;
  ProductModel.findById(id)
    .select('name price _id image')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
            product: doc,
            request: {
                type: 'GET',
                url: 'http://localhost:5000/api/products'
            }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
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


///Delete api

router.delete("/product/:productId", (req, res, next) => {
  const id = req.params.productId;
  ProductModel.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Product deleted'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//// PUT  api
router.patch("/product/:productId",imageMiddleware.single('image'), (req, res, next) => {
  const id = req.params.productId;
  const data = {name:req.body.name, price: req.body.price, image: `http://localhost:5000/${req.file.path}`}
  console.log("dataaaaa", data)
  ProductModel.findOneAndUpdate({ _id: id }, { "$set": data} )
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Product updated',
          request: {
              type: 'GET',
              url: 'http://localhost:5000/api/products/' + id
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