import crypto from "crypto";
import {Request, Response} from "express"

const API_KEY_ENC = '35LQ9RLVKKBOJ9T9OSGIWCWKWS9R3BLY';
const API_ENCRYPT_IV_KEY = '7OZNE9SKX6VD14AC';

async function encryptedDataResponse(data: any) {        
    const cipher = crypto.createCipheriv("aes-256-cbc", API_KEY_ENC, API_ENCRYPT_IV_KEY);
    const message = data ? JSON.stringify(data): "";
    let encryptedData = cipher.update(message, "utf-8", "base64");
    encryptedData += cipher.final("base64");

    const mac = crypto.createHmac('sha256', API_KEY_ENC)
        .update(Buffer.from(Buffer.from(API_ENCRYPT_IV_KEY).toString("base64") + encryptedData, "utf-8").toString())
        .digest('hex');

    return {
        'mac': mac,
        'value': encryptedData
    };
}

async function EncryptData(req: Request, res: Response, data: any) {
    if (req.headers.env && req.headers.env === "test") {
        return data;
    } else {
        return await encryptedDataResponse(data);
    }
}

export default {
    EncryptedData: EncryptData,
    encryptedDataResponse: encryptedDataResponse,
    // encryptedDataRequest: encryptedDataRequest
}