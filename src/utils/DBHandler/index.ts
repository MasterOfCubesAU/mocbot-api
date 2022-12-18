import mysql2 from 'mysql2';

class DatabaseHandler {
  static pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  static async field(query: string, values?: any | any[] | { [param: string]: any }) {
    const [result, field] = await DatabaseHandler.pool.promise().query(query, values);
    return Array.isArray(result) && result.length > 0 ? result[0][field[0].name] : null;
  }

  static async record(query: string, values?: any | any[] | { [param: string]: any }) {
    const result = (await DatabaseHandler.pool.promise().query(query, values))[0];
    return Array.isArray(result) && result.length > 0 ? result[0] : {};
  }

  static async records(query: string, values?: any | any[] | { [param: string]: any }) {
    return (await DatabaseHandler.pool.promise().query(query, values))[0];
  }

  static async column(query: string, values?: any | any[] | { [param: string]: any }) {
    const [result, field] = await DatabaseHandler.pool.promise().query(query, values);
    return Array.isArray(result) ? result.map((row) => row[field[0].name]) : [];
  }

  static async execute(query: string, values?: any | any[] | { [param: string]: any }) {
    await DatabaseHandler.pool.promise().execute(query, values);
  }

  static close() {
    DatabaseHandler.pool.end((err) => {
      if (err) throw err;
    });
  }
}

export default DatabaseHandler;
