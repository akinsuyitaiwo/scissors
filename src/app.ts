import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'
import db from "./config/database"
import config from './config';
import router from "./routes/index"
import { CustomRequest } from "./utils/interface";

const app = express();

const port = 5000 || config.PORT;

app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

declare global {
    namespace Express {
      interface Request extends CustomRequest { }
    }
  }

app.use('/', router)

app.get("/", (req, res) => {
    return res.status(200).send({
        message : "Welcome to SCISSORS. The best url shortening web-application"
    })
});
app.get("/", (req, res) =>{
        return res.status(404).send({
        message : "Not found"
    })
})

app.listen(port, async()=>{
    await db.connect()
    console.log(`Server is running on port ${port}`)
});

export default app;