import { Request, Response } from "express";
import pool from "../db/db";
import { generateService } from "../services/generate-service";
import { FieldPacket, ResultSetHeader } from "mysql2";

class GenerateController {
  combination = async (req: Request, res: Response) => {
    const { items, length }: { items: number[]; length: number } = req.body;

    const { combinations, itemNames } = generateService.generateCombination(
      items,
      length
    );

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      if (!combinations.length || !itemNames.length) {
        res
          .status(400)
          .json({
            message: "Something Went Wrong, please try with another attributes",
          });
      }

      for (const itemName of itemNames) {
        await connection.execute(
          "INSERT IGNORE INTO items (item_name) VALUES (?)",
          [itemName]
        );
      }

      const [result] = (await connection.execute(
        "INSERT INTO responses (response_data) VALUES (?)",
        [JSON.stringify(combinations)]
      )) as [ResultSetHeader, FieldPacket[]];

      const responseId = result.insertId;

      for (const combo of combinations) {
        await connection.execute(
          "INSERT INTO combinations (combination_id, item_combination) VALUES (?, ?)",
          [responseId, JSON.stringify(combo)]
        );
      }

      await connection.commit();

      res.status(200).json({
        id: responseId,
        combination: combinations,
      });
    } catch (error) {
      await connection.rollback();
      console.error(error);
      res.status(500).json({ error: "Error Occured in Server" });
    } finally {
      connection.release();
    }
  };
}
export const generateController = new GenerateController();
