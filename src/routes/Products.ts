import express, {Request, Application, Response, NextFunction} from "express"
const router = express.Router();
import {Product} from "../models/ProductsModel"




router.post("/postproduct", async (req, res) => {
  try {
    const {name, description, price} = req.body;
    const prod = new Product({name, description, price})
    await prod.save()
    res.json({"success":"A new Product added successfully"});
  } catch (e) {
    res.send({ message: "Error in adding new product" });
  }
});


module.exports = router;