import { Request, Response } from "express";
import models from "../model/index"
import validateUrl from "../validations/url"
import { successResponse,errorResponse, handleError } from "../utils/response";
import config from "../config";
import { generateRandomId } from "../utils/shortUrl";
import  {generateQRCode} from "../utils/qrcode";

export const shortenUrl = async (req: Request, res: Response) =>{
    try {
        const {_id} = req.details;
        const {error, value } = validateUrl(req.body);
        if(error){
            return errorResponse(res, 409, error.message);
        }
        const {longUrl} = value;
        const shortCode = generateRandomId(4);
        const shortUrl =  `${config.HOST}/url/${shortCode}`;
        const qrCode = await generateQRCode(shortUrl, "qrcode.png");
        const user = await models.User.findById(_id);
        
        const newUrl = await models.Url.create({
            shortCode,
            longUrl,
            shortUrl,
            qrCode,
            user: _id
        })
        res.redirect(shortCode);
        return successResponse(res, 200, "Url shortning  successful", newUrl);

    } catch (error) {
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