import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'
import db from "./config/database"
import config from './config';
import router from "./routes/index"
import rateLimit from "express-rate-limit";
import { CustomRequest } from "./utils/interface";
import path from "path"

const app = express();

const port = 5000 || config.PORT;


// const limiter = rateLimit({
// 	windowMs: 0.5 * 60 * 1000,
// 	max: 3, 
// 	standardHeaders: true,
// 	legacyHeaders: false,
// });
// app.use(limiter)
app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

declare global {
    namespace Express {
      interface Request extends CustomRequest {}
    }
  }

app.use('/', router)

app.get("/", (req, res) => {
    res.render("home")
});
app.get("/", (req, res) =>{
    res.render("error")
})

app.listen(port, async()=>{
    await db.connect()
    console.log(`Server is running on port ${port}`)
});

export default app;