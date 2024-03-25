import { Request, Response } from "express";
import bcrypt from "bcrypt"
import models from "../model";
import { validateUser, validatelogin } from "../validations/user";
import { successResponse, errorResponse, handleError } from "../utils/response";
import jwtHelper from "../utils/jwt";
const {generateToken} = jwtHelper;

export const createUser = async (req:Request, res : Response) =>{
    try {
        const {error, value } = validateUser(req.body);
        if(error){
            return errorResponse(res, 400, error.message)
        }
        const {username, email, password} = value
        const userExist = await models.User.findOne({email});
        if(userExist){
            return errorResponse(res, 409, "A user with this email alredy exists, use a different email")
        }
        const hashPassword = await bcrypt.hash(password, 10)
        await models.User.create({
            username ,
            email ,
            password: hashPassword
        });
        return res.status(201).render("login");
    } catch (error) {

        return errorResponse(res,500,"Error creating the user");
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const {error, value} = validatelogin(req.body)
        if (error) {
            return errorResponse(res, 400, error.message);
        }
        const {email, password} = value
        const user = await models.User.findOne({email})
        if(!user){
            return errorResponse(res,409, "User does not exist, try creating an account")
        }
        const ValidPass = await bcrypt.compare(password, user.password);
        if(!ValidPass){
            return errorResponse(res,409, "Incorrect password, please input correct password")
        }
        const token = await generateToken({_id: user._id, email});
        res.cookie("token", token, { httpOnly: true });
        return res.status(200).render(("dashboard"),
        {
            token
        })
    } catch (error) {
        return errorResponse(res, 500, "server error")
    }
};