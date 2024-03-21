import { Request, Response } from "express";
import models from "../model/index"
import {validateUrl, validateShortenCode} from "../validations/url"
import { successResponse,errorResponse, handleError } from "../utils/response";
import config from "../config";
import { generateRandomId } from "../utils/shortUrl";
import qrCode from "qrcode"


export const shortenUrl = async (req: Request, res: Response) =>{
    try {
        const {_id} = req.details;
        const user = await models.User.findById(_id);
        if(!user){
            return res.status(409).render("createUrl")
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
        const qrCodeData = await qrCode.toDataURL (shortUrl);

        
        const newUrl = await models.Url.create({
            shortCode,
            longUrl,
            shortUrl,
            QRCode: qrCodeData,
            userId: _id
        })
        return res.status(200).render("viewOne");

    } catch (error) {
        console.log(error);
        return errorResponse(res, 500, "Server error",)
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
        const existingShortCode = await models.Url.findOne({shortCode});
        if (existingShortCode) {
			return errorResponse(res, 409, "Short code already in use, please try another")
		}
        const shortUrl =  `${config.HOST}/${shortCode}`;
        const qrCodeDataURL = await qrCode.toDataURL(shortUrl)
        const urlData = await models.Url.create({
            longUrl,
            shortCode,
            shortUrl,
            QRCode: qrCodeDataURL,
            userId : _id
        })
        return successResponse(res, 200, "Custom url created succesfully", urlData)
    } catch (error) {
        console.log(error)
        return errorResponse(res, 500, "Server error") 
    }
} 
export const getUrlById = async (req: Request, res: Response) => {
    try {
        const {userId} = req.params
        const url = await models.Url.find({userId});
        console.log(url)
        if(!url){
            return errorResponse(res, 404, "URL does not exist.");
        }
        return successResponse(res, 200, "Url fetched successfully", url);
    } catch (error) {
        console.log(error)
        return errorResponse(res, 500, "Server error")
    }
}
export const viewLinks = async (req: Request, res: Response) => {
	try {
		const { _id } = req.details;
		const user = await models.User.findById(_id);
		if(!user) {
			return errorResponse(res, 409, "Kindly Login")
		}
		const URLs = await models.Url.find({ userId: user._id });
		const shortURLs = URLs.map(url => ({ shortURL: url.shortUrl, longURL: url.longUrl }));
        return successResponse(res, 200, "List of all shortened URLs is generated successfully", shortURLs);
	} catch (error) {
		console.error(error);
		return errorResponse(res, 500, "Failed to fetch shortened URLs")
	}
};

export const viewLink = async (req: Request, res: Response) => {
	try {
		const { shortCode } = req.params;
        console.log(shortCode)
		const shortCodeCheck = await models.Url.findOne({ shortCode });
		if (!shortCodeCheck) {
			return errorResponse(res, 409, "Invalid shortened URL")
		}
		shortCodeCheck.clickCount += 1;
		const ipAddress = req.ip || "Unknown";
		const newClick = {
			timestamp: new Date(),
			ipAddress: ipAddress,
			userAgent: req.headers["user-agent"] || "Unknown"
		};
        console.log(newClick)
		shortCodeCheck.clicks.push(newClick);
		await shortCodeCheck.save();

		res.status(302).redirect(shortCodeCheck.longUrl);
	} catch (error) {
		console.error(error);
		return errorResponse(res, 500, "Failed to redirect to the original URL")
	}
};

export const getURLAnalytics = async (req: Request, res: Response) => {
	try {
		const { shortCode } = req.params;
		const shortCodeCheck = await models.Url.findOne({ shortCode }).select("-QRCode");
		if (!shortCodeCheck) {
			return errorResponse(res, 409, "Invalid shortened URL")
		}
		return successResponse(res, 200, "URL analytics fetched successfully", shortCodeCheck);
	} catch (error) {
        console.log(error);
		return errorResponse(res, 500, "Failed to fetch URL analytics")
	}
};