import jwt from "jsonwebtoken"
import {Request, Application, Response, NextFunction} from "express"


module.exports = function(req:Request, res:Response, next:NextFunction) {
  const token = req.header("token");
  if (!token) return res.status(401).json({ message: "Auth Error" });

  try {
    const decoded = jwt.verify(token, "getOut0fhere");
    //@ts-ignore
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Invalid Token" });
  }
};