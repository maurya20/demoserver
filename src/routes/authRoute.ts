import express, {Request, Application, Response, NextFunction} from "express"
import { check, validationResult} from "express-validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const auth = require("../middleware/auth")
const router = express.Router();
import {User} from "../models/UserModel"
require('dotenv').config()
const secret: any = process.env.SECRET
/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

router.post("/signup",[
        check("username", "Please Enter a Valid Username")
        .not()
        .isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({min: 6 })
    ],
    async (req:Request, res:Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {username, email, password} = req.body;
        try {
            let user = await User.findOne({email});
            if (user) {
                return res.status(400).json({
                    msg: "Email Already Exists"
                });
            }

            user = new User({username, email, password});

            const salt = await bcrypt.genSalt(10);
           
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(payload, secret, {expiresIn: 10000},
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                      msg: "SignUp successfull, go ahead and login"
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).json({
              msg: "Something went wrong!"
            })
        }
    }
);


/**
 * @method - POST
 * @param - /login
 * @description - User SignIn
 */

router.post("/login",[ check("email", "Please enter a valid email").isEmail(),
                     check("password", "Please enter a valid password").isLength({min: 6})
                    ],
    async (req:Request, res:Response) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        
        });
      }
  
      const { email, password } = req.body;
      try {
        let user = await User.findOne({email});
        if (!user)
          return res.status(400).json({
            message: "User Not Exist"
          });
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({
            message: "Incorrect Password !"
          });
  
        const payload = {
          user: {
            id: user.id
          }
        };
  
        jwt.sign( payload, secret,
          {
            expiresIn: 3600
          },
          (err, token) => {
            if (err) throw err;
            res.status(200).json({
              token
            });
          }
        );
      } catch (e) {
        console.error(e);
        res.status(500).json({
          message: "Server Error"
        });
      }
    }
  );


/**
 * @method - GET
 * @description - Get LoggedIn User
 * @param - /api/logged
 */


router.get("/logged/user", auth, async (req: any, res: any) => {
    try {
      // request.user is getting fetched from Middleware after token authentication
      const user = await User.findById(req.user.id);
      //@ts-ignore
      res.json({"username":user.username,"id":user._id,"email":user.email});
    } catch (e) {
      res.send({ message: "Error in Fetching user" });
    }
  });


module.exports = router;