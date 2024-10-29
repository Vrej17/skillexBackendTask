import { Router } from "express";
import { generateController } from "../controllers/generate-controller";

const generateRoute = Router();

generateRoute.post("/generate", generateController.combination);

export default generateRoute;
