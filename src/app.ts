import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'
import db from "./config/database"

const app = express();

const port = 3000 || process.env.PORT;

app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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