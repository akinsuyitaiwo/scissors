export interface IUser {
    _id?: string
    email: string
    password: string
    username?: string
    createdAt?: Date
    updatedAt?: Date
  }
  export interface CustomRequest {
    details: IUser
    file: object
    params: object
    query: object
    path: object
  }

export interface ILogin{
    email: string
    password: string
}
export interface IUrl{
  _id?: string
  longUrl: string;
  shortUrl: string;
}

export interface IQRCode{
  qrCode : string
}