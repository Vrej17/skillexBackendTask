"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const mysql = __importStar(require("mysql2/promise"));
dotenv.config();
const pool = mysql.createPool(process.env.TASK_DB_URI);
function createTables() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield pool.getConnection();
        try {
            yield connection.query(`
      CREATE TABLE IF NOT EXISTS items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        item_name VARCHAR(10) UNIQUE
      );
    `);
            yield connection.query(`
      CREATE TABLE IF NOT EXISTS responses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        response_data JSON
      );
    `);
            yield connection.query(`
      CREATE TABLE IF NOT EXISTS combinations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        combination_id INT,
        item_combination JSON,
        FOREIGN KEY (combination_id) REFERENCES responses(id)
      );
    `);
            console.log("Tables created or already exist.");
        }
        catch (error) {
            console.error("Error creating tables:", error);
        }
        finally {
            connection.release();
        }
    });
}
createTables()
    .then(() => {
    console.log("Database setup complete.");
})
    .catch((error) => {
    console.error("Failed to set up database:", error);
});
exports.default = pool;
