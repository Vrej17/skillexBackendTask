"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateController = void 0;
const db_1 = __importDefault(require("../db/db"));
const generate_service_1 = require("../services/generate-service");
class GenerateController {
    constructor() {
        this.combination = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { items, length } = req.body;
            const { combinations, itemNames } = generate_service_1.generateService.generateCombination(items, length);
            const connection = yield db_1.default.getConnection();
            try {
                yield connection.beginTransaction();
                if (!combinations.length || !itemNames.length) {
                    res
                        .status(400)
                        .json({
                        message: "Something Went Wrong, please try with another attributes",
                    });
                }
                for (const itemName of itemNames) {
                    yield connection.execute("INSERT IGNORE INTO items (item_name) VALUES (?)", [itemName]);
                }
                const [result] = (yield connection.execute("INSERT INTO responses (response_data) VALUES (?)", [JSON.stringify(combinations)]));
                const responseId = result.insertId;
                for (const combo of combinations) {
                    yield connection.execute("INSERT INTO combinations (combination_id, item_combination) VALUES (?, ?)", [responseId, JSON.stringify(combo)]);
                }
                yield connection.commit();
                res.status(200).json({
                    id: responseId,
                    combination: combinations,
                });
            }
            catch (error) {
                yield connection.rollback();
                console.error(error);
                res.status(500).json({ error: "Error Occured in Server" });
            }
            finally {
                connection.release();
            }
        });
    }
}
exports.generateController = new GenerateController();
