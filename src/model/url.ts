import { Schema, model } from "mongoose";
import { IUrl } from "../utils/interface";

const urlSchema = new Schema ({
    longUrl : {
        type: String,
        required: true,
    },
    shortUrl : {
        type: String,
        required: true,
        unique: true,
    }, 
    shortCode : {
        type: String,
        unique: true
    },
    userId : {
        type: Schema.Types.ObjectId, ref: "User"
    },
    clickCount : {
        type : Number,
        default: 0
    },
    clicks: [{
        timestamp: {
            type: Date,
            default: Date.now
        },
        ipAddress: {
            type: String
        },
        userAgent: {
            type: String
        }
    }],
    QRCode :{
        type: String
    }
},
{ timestamps: true });

export default model<IUrl>("Url", urlSchema)