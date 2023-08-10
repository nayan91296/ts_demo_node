import {NextFunction, Request, Response} from "express"
const crypto = require("crypto");

const API_KEY_DEC = 'XG5F9B24OTFE697P2F1G7B1U0ZQUPPGV';
const API_DECRYPT_IV_KEY = 'RWMV5ST7FVVMJO99';

async function DecryptData(req: Request, res: Response, next: NextFunction) {
    console.log('req.method',req.method);
    
    if (req.method === "GET") return next()

    if (req.headers.env && req.headers.env === "test") {
        next();
    } else {
        console.log('here');
        
        return DecryptedDataResponse(req, res, next);
    }
}

async function DecryptedDataResponse(req: Request, res: Response, next: NextFunction) {
    try {
        
        const decipher = await crypto.createDecipheriv("aes-256-cbc", API_KEY_DEC, API_DECRYPT_IV_KEY);
        console.log('first',req.body);
        
        if (req.body && req.body !== "") {
            let encryptedData = req.body.value;
            let decryptedData = decipher.update(encryptedData, "base64", "utf-8");
            decryptedData += decipher.final("utf-8");
            req.body = JSON.parse(decryptedData);
            // console.log('first 2',req.body);
            next();
        } else {
            return res.status(403).send({message: "DECRYPT_DATA_IS_REQUIRED"})
            // return commonUtils.sendError(req, res, {message: "DECRYPT_DATA_IS_REQUIRED"}, 400);
        }
    } catch (e) {
        console.log(e);
        
    }
}

export default {
    DecryptedData: DecryptData,
    // DecryptedDataRequest: DecryptedDataRequest
}