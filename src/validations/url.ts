import Joi from "joi";
import { IUrl } from "../utils/interface";

const validateUrl = (url:IUrl) => {
    const schema = Joi.object({
        longURL: { type: String, required: true },
        shortURL: { type: String, required: true, unique: true },
    })
    return schema.validate(url)
}

export default validateUrl