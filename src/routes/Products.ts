import express, {Request,Response,NextFunction} from 'express';
import {ProductModel} from '../models/ProductsModel';
import multer from 'multer';
const router = express.Router();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
//@ts-ignore
const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

///
router.post("/product", upload.single('photo'), (req, res, next) => {
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