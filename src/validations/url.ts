import Joi from "joi";
import { IUrl } from "../utils/interface";

const validateUrl = (url:IUrl) => {
    const schema = Joi.object({
        longUrl: Joi.string().required().uri()
        })
    return schema.validate(url)
}

export default validateUrl