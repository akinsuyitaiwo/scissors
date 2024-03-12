import {model, Schema} from "mongoose"
import { IUser } from "../utils/interface"

const userSchema = new Schema ({
    username: {
        type : String , required : true},
    email: {
        type : String ,  unique : true ,
    },
    password : {
        type: String , unique : true
    }
}, {
    timestamps: true
});

export default model<IUser>("User", userSchema)