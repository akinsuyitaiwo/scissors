import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response";
import models from "../model";
import config from "../config";

/**
 * @class Authentication
 * @description authenticate token and roles
 * @exports Authentication
 */
export default class Authentication {
   static async verifyToken(req: Request, res: Response, next: NextFunction)  {
    try {
      let token;
  
      if (req.headers && req.headers.authorization) {
        const parts = req.headers.authorization.split(" ");
        if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
          token = parts[1];
        } else {
          return res.status(401).send({
            status: false,
            message: "Invalid authorization format"
          });
        }
      } else if (req.headers && req.headers.cookie) {
        const cookies = req.headers.cookie.split("; ");
        const tokenCookie = cookies.find(cookie => cookie.startsWith("token="));
      
        if (tokenCookie) {
          token = tokenCookie.split("=")[1];
        } else {
          return res.status(401).send({
            status: false,
            message: "Token cookie not found"
          });
        }
      }
  
      if (!token) {
        return res.status(403).send({
          status: false,
          message: "Authorization not found"
        });
      }
      const decoded: any = await jwt.verify(token, config.JWT_KEY as string);
      const user = await models.User.findById(decoded._id);
      console.log(user)
      if (!user) {
        return res.status(404).send({
          status: false,
          message: "User account not found"
        });
      }
  
      req.details = user;
      return next();
    } catch (error) {
      console.error(error as Error);
      return res.status(500).send({
        status: false,
        message: "Internal server error"
      });
    }
  };
}