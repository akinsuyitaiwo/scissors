import { Request, Response } from "express";
import models from "../model/index"
import {validateUrl, validateShortenCode} from "../validations/url"
import { successResponse,errorResponse, handleError } from "../utils/response";
import config from "../config";
import { generateRandomId } from "../utils/shortUrl";
import  {generateQRCode} from "../utils/qrcode";
import url from "../model/url";

export const shortenUrl = async (req: Request, res: Response) =>{
    try {
        const {_id} = req.details;
        const user = await models.User.findById(_id);
        if(!user){
            return errorResponse(res,403, "User not found")
        }
        const {error, value } = validateUrl(req.body);
        if(error){
            return errorResponse(res, 409, error.message);
        }
        const {longUrl} = value;
        const shortCode = generateRandomId(4);
        const existCode = await models.Url.findOne({shortCode})
        if(existCode){
            return errorResponse(res,409, "Short code already exist")
        }
        const shortUrl =  `${config.HOST}/${shortCode}`;
        // const qrCode = await generateQRCode(shortUrl, "qrcode.png");

        
        const newUrl = await models.Url.create({
            shortCode,
            longUrl,
            shortUrl,
            // qrCode,
            user: _id
        })
        return successResponse(res, 200, "Url shortning  successful", newUrl);

    } catch (error) {
        console.log(error);
        return errorResponse(res, 500, "Server error",)
    }
}
export const verifyUrl = async(req: Request, res: Response) =>{
    try {
        const {shortCode} = req.params
        const data = await models.Url.findOne({shortCode});
        if(!data){
            return errorResponse(res, 403, "Invalid short code")
        }
        const url = data.longUrl
        res.redirect(url)
    } catch (error) {
        console.log(error)
        return errorResponse(res, 500, "Server error")   
    }
}
export const customiseUrl = async( req: Request, res: Response)=>{
    try {
        const {_id} = req.details;
        const user = await models.User.findById(_id);
        if(!user){
            return errorResponse(res,403, "User not found")
        }
        const {error, value } = validateShortenCode(req.body);
        if(error){
            return errorResponse(res, 409, error.message);
        }
        const {longUrl,shortCode} = value
        const existShortCode = await models.Url.findOne({shortCode});
        const shortUrl =  `${config.HOST}/${shortCode}`;
        if(existShortCode){
            return errorResponse(res, 409, "Short code exist already")
        };
        const urlData = await models.Url.create({
            longUrl,
            shortCode,
            shortUrl,
            user : _id
        })
        return successResponse(res, 200, "Custom url created succesfully", urlData)
    } catch (error) {
        console.log(error)
        return errorResponse(res, 500, "Server error") 
    }
} 
export const getUrlById = async (req: Request, res: Response) => {
    try {
        const {_id} = req.params
        const url = await models.Url.findById({_id});
        if(!url){
            return errorResponse(res, 404, "URL does not exist.");
        }
        return url;
    } catch (error) {
        return errorResponse(res, 500, "Server error")
    }
}