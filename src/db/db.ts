import * as dotenv from "dotenv";
import * as mysql from "mysql2/promise";

dotenv.config();

const pool = mysql.createPool(process.env.TASK_DB_URI as string);

async function createTables() {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        item_name VARCHAR(10) UNIQUE
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS responses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        response_data JSON
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS combinations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        combination_id INT,
        item_combination JSON,
        FOREIGN KEY (combination_id) REFERENCES responses(id)
      );
    `);

    console.log("Tables created or already exist.");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    connection.release();
  }
}

createTables()
  .then(() => {
    console.log("Database setup complete.");
  })
  .catch((error) => {
    console.error("Failed to set up database:", error);
  });

export default pool;
