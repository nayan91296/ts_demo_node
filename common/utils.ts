import express, {NextFunction, Request, Response} from "express";
import multer, {FileFilterCallback} from 'multer'
type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void
const path = require('path')
const md5 = require("md5");

export const fileStorage = multer.diskStorage({
    destination: (request: Request, file: Express.Multer.File, callback: DestinationCallback): void => {
        callback(null, './uploads/images')
    },

    filename: (req: Request, file: Express.Multer.File, callback: FileNameCallback): void => {
        callback(null, md5(file.originalname) + '-' + Date.now() + path.extname(file.originalname))
    }
})

export const fileFilter = (request: Request,file: Express.Multer.File,callback: FileFilterCallback): void => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
        // file.mimetype === 'application/octet-stream'
    ) {
        callback(null, true)
    } else {
        callback(null, false)
    }
}