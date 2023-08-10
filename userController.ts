import { Request, Response } from "express";
import { User } from "./user";
var jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Validator = require('validatorjs')
import redisClient from './redis';
const config = require('config');
// const { Sequelize } = require('sequelize');
const CryptoJS = require("crypto-js");
import sequelizeInstance from './sequlize';
import decryptData from './decryptData';
import encryptData from "./encryptData";
const baseController = require("./baseController");
// Define encryption and decryption keys and IV keys
const API_KEY_ENC = '35LQ9RLVKKBOJ9T9OSGIWCWKWS9R3BLY';
const API_KEY_DEC = 'XG5F9B24OTFE697P2F1G7B1U0ZQUPPGV';
const API_ENCRYPT_IV_KEY = '7OZNE9SKX6VD14AC';
const API_DECRYPT_IV_KEY = 'RWMV5ST7FVVMJO99';
const multer = require("multer");
import { fileStorage } from "./utils";
import { fileFilter } from "./utils";

async function register(req: Request, res: Response) {
    console.log('req.headers.env',req.headers.env);
    
    const t = await sequelizeInstance.transaction();
  try {
        const { name, email, password } = req.body;

        const data_validation = {
            name: name,
            email: email,
            password: password,
        }

        const rules = {
            name: 'required|string',
            email: 'required|string',
            password: 'required|string',
        }

        const validator = new Validator(data_validation, rules)
        if (validator.fails()) {
            let transformed:any = {}

            Object.keys(validator.errors.errors).forEach(function (key, val) {
                transformed[key] = validator.errors.errors[key][0]
            })

            const responseObject = {
                status: 'false',
                error: transformed,
            }
            return res.status(403).send(baseController.error(responseObject));
            // return res.status(403).send(responseObject)
            
        }
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const check_ = await User.findOne({ where: { email: email } })
        if (check_) {
          return res.status(422).send(baseController.error("User already exist"));
        }

        const data = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
            profile:req.body.profile
        })

        let user_id = data.id;
        const token = jwt.sign({ userId: user_id } , config.get('JWT_SECRET'),{expiresIn: '1h'});
        let response = {
            message:"User register successfully",
            token:token
        }
        // redisClient.set(user_id.toString(), token);
        
        await t.commit();
        let d = await baseController.success(req,res,response)
        return res.status(200).send(d);
        // return res.status(200).send(encData)
        
  } catch (error) {
    console.log('error',error);
    await t.rollback();
   
    return res.status(422).send(baseController.error(error)); 
  }
} 

async function getProfile(req: Request, res: Response) {
  // console.log('req',(req as any).user?.userId);
  try {
        let user_data = await User.findOne({raw:true, where:{id:(req as any).user.userId},attributes: ['id', 'email', 'profile']});
        delete user_data.password;
        let response = {
            message:"User get successfully",
            data:user_data
        }
        // console.log('1111',req.header('env'));
        
        let d = await baseController.success(req,res,response)
        return res.status(200).send(d);   
        
  } catch (error) {
    console.log('error',error);
    
    return res.status(422).send(baseController.error(error));   
  }
}

async function logout(req: Request, res: Response) {
    const token = req.headers.authorization?.split(' ')[1]
    // console.log('tokentokentoken',req.headers);
    
    if (token == undefined) return res.status(401).send(baseController.error('token required'));
      try {
        await redisClient.set(`blacklist:${token}`, 'true', 'EX', 3600);      
        // return res.status(401).send(baseController.error('token required'));  
        return res.status(200).send(baseController.success('User logout successfully'));   
      } catch (error) {
        // return res.status(403).send(error);   
        return res.status(403).send(baseController.error(error));   
      }
}

async function imageUpload(req: Request, res: Response) {

    try {
      
      const image_ = multer({
          storage: fileStorage,
          fileFilter: fileFilter,
      }).single("image");

     
      image_(req, res, async (err: any) => {
          // console.log('here err',err);

          if (err) return res.status(403).send(baseController.error(err));  
          if (!req.file) return res.status(403).send(baseController.error('select only image'));  
          let image_name = req.file.filename;
          console.log('image_name',image_name);
          let d = await baseController.success(req,res,{image:image_name})
        // return res.status(200).send(d);   
          return res.status(200).send(d);
      });

    } catch (error) {
      return res.status(403).send(baseController.error(error));   
    }
}

async function login(req: Request, res: Response) {
    // return res.status(200).send({data:'empty'});
      const { email, password } = req.body;
      var userD = await User.findOne({where:{email:email}});
      if(userD == null){
        // return res.status(401).send('User not exist');
        return res.status(401).send(baseController.error('User not exist'));
      }
      bcrypt.compare(password, userD.password, async(err:any, result:any) => {
        if (err) {
          // return res.status(401).send('Authentication failed');
          return res.status(401).send(baseController.error(err));
        }
        if (!result) {
          // return res.status(401).send('Authentication failed');
          return res.status(401).send(baseController.error('Authentication failed'));
        }
        var userId = userD.id;
        const token = jwt.sign({ userId: userId }, config.get('JWT_SECRET'), { expiresIn: '1h' });
        // console.log('token',token);
        let response = {
            message:"User login successfully",
            token:token
        }
        let d = await baseController.success(req,res,response)
        return res.status(200).send(d);
      });
  
}


export default {                                                                                    
    register,
    getProfile,
    logout,
    login,
    imageUpload
}