import Joi from "joi";
import { IUser, ILogin } from "../utils/interface";


const options = {
	stripUnknown: true,
	abortEarly: false,
	errors: {
		wrap: {
			label: "",
		},
	},
};

export const validateUser = (user: IUser) =>{
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6).max(32)
    })
    return schema.validate(user, options)
};

export const validatelogin = (login: ILogin) =>{
    const schema  = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(6).max(32)
    })
    return schema.validate(login, options)
}
