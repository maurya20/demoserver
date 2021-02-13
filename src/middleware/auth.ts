import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
require('dotenv').config()
const secret: any = process.env.SECRET

module.exports = function(req:Request, res:Response, next:NextFunction) {
  const token:any = req.header("token");
  console.log(token)
  if (!token) return res.status(401).json({ message: "Auth Error" });

  try {
    const decoded:any = jwt.verify(token, secret);
  //@ts-ignore
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Invalid Token" });
  }
};