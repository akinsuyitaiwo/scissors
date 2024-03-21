import Joi from "joi";
import { IUrl } from "../utils/interface";

const options = {
	stripUnknown: true,
	abortEarly: false,
	errors: {
		wrap: {
			label: "",
		},
	},
};

const validateUrl = (url:IUrl) => {
    const schema = Joi.object({
        longUrl: Joi.string().required().uri()
        })
    return schema.validate(url, options)
}

const validateShortenCode = (shortCode: string) => {
    const schema = Joi.object({
        longUrl: Joi.string().required().uri(),
        shortCode: Joi.string().min(1).max(4)
    })
    return schema.validate(shortCode, options)
}

export {validateUrl, validateShortenCode}