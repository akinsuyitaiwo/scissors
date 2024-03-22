import db from "./config/database"
import createServer from "./utils/server";
import { CustomRequest } from "./utils/interface";

const app = createServer()
const port = process.env.PORT || 5000;

declare global {
  namespace Express {
    interface Request extends CustomRequest {}
  }
}

app.listen(port, async()=>{
    await db.connect()
    console.log(`Server is running on port ${port}`)
});

export default app;