"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generate_controller_1 = require("../controllers/generate-controller");
const generateRoute = (0, express_1.Router)();
generateRoute.post("/generate", generate_controller_1.generateController.combination);
exports.default = generateRoute;
