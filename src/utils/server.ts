import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'
import config from '../config';
import router from "../routes/index"
import rateLimit from "express-rate-limit";
import path from "path"

const createServer = () => {
const app = express();

const limiter = rateLimit({
	windowMs: 0.5 * 60 * 1000,
	max: 20, 
	standardHeaders: true,
	legacyHeaders: false,
});
app.use(limiter)
app.set('views', path.join(__dirname, '../../public/views'));
app.set('view engine', 'ejs');

app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/', router)

app.get("/", (req, res) => {
    res.render("home")
});
app.get("/", (req, res) =>{
    res.render("error")
})

return app;
}
export default createServer;