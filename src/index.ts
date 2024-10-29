import express from "express";
import bodyParser from "body-parser";
import * as dotenv from 'dotenv'

import generateRoute from "./routes/generate-routes";

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: false}));

const port = process.env.PORT;

app.use('/api',generateRoute)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});