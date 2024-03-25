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
            return res.status(409).render("register")
        }
        const {error, value } = validateUrl(req.body);
        if(error){
            return errorResponse(res, 400, error.message);
        }
        const {longUrl} = value;
        const shortCode = generateRandomId(4);
        const existCode = await models.Url.findOne({shortCode})
        if(existCode){
            return errorResponse(res,409, "Short code already exist")
        }
        const shortUrl =  `${config.HOST}/url/${shortCode}`;
        const qrCodeData = await qrCode.toDataURL(shortUrl);
        const newUrl = await models.Url.create({
            shortCode,
            longUrl,
            shortUrl,
            QRCode: qrCodeData,
            userId: _id
        });
        return res.status(201).render(("result"), {
             newUrl
        });

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
            return errorResponse(res, 400, error.message);
        }
        const {longUrl,shortCode} = value
        const existingShortCode = await models.Url.findOne({shortCode});
        if (existingShortCode) {
			return errorResponse(res, 409, "Short code already in use, please try another")
		}
        const shortUrl =  `${config.HOST}/url/${shortCode}`;
        const qrCodeDataURL = await qrCode.toDataURL(shortUrl)
        const urlData = await models.Url.create({
            longUrl,
            shortCode,
            shortUrl,
            QRCode: qrCodeDataURL,
            userId : _id
        })
        return res.status(201).render(("result"),{
             newUrl: urlData
        })
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
		const URLs = await models.Url.find({ userId: _id });
        if(!URLs){
            return errorResponse(res, 404, "Not found");
        }
		const shortURLs = URLs.map(url => ({ shortUrl: url.shortUrl, longUrl: url.longUrl, shortCode: url.shortCode}));
        return res.status(200).render(("viewlinks"),{
            shortURLs
        });
	} catch (error) {
		console.error(error);
		return errorResponse(res, 500, "Failed to fetch shortened URLs")
	}
};

export const viewLink = async (req: Request, res: Response) => {
	try {
		const { shortCode } = req.params;
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
		return res.status(200).render(("analytics"), {shortCodeCheck});
	} catch (error) {
        console.log(error);
		return errorResponse(res, 500, "Failed to fetch URL analytics")
	}
};