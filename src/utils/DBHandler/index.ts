import mysql2 from 'mysql2';

class DatabaseHandler {
  static pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    supportBigNumbers: true,
    bigNumberStrings: true,
  });

  /**
   * Fetches a single value from the database
   * @param query SQL Query
   * @param values Array of values to be substituted into SQL Query
   * @returns {any | null}
   */
  static async field(query: string, values?: any | any[] | { [param: string]: any }): Promise<any> {
    const [result, field] = await DatabaseHandler.pool.promise().query(query, values);
    return Array.isArray(result) && result.length > 0 ? result[0][field[0].name] : null;
  }

  /**
   * Fetches a single row from the database
   * @param query SQL Query
   * @param values Array of values to be substituted into SQL Query
   * @returns {}
   */
  static async record(query: string, values?: any | any[] | { [param: string]: any }): Promise<any> {
    const result = (await DatabaseHandler.pool.promise().query(query, values))[0];
    return Array.isArray(result) && result.length > 0 ? result[0] : {};
  }

  /**
   * Fetches a multiple rows from the database
   * @param query SQL Query
   * @param values Array of values to be substituted into SQL Query
   * @returns {object[]}
   */
  static async records(query: string, values?: any | any[] | { [param: string]: any }): Promise<any> {
    return (await DatabaseHandler.pool.promise().query(query, values))[0];
  }

  /**
   * Fetches columns from the database
   * @param query SQL Query
   * @param values Array of values to be substituted into SQL Query
   * @returns {any[]}
   */
  static async column(query: string, values?: any | any[] | { [param: string]: any }): Promise<any> {
    const [result, field] = await DatabaseHandler.pool.promise().query(query, values);
    return Array.isArray(result) ? result.map((row) => row[field[0].name]) : [];
  }

  /**
   * Fetches a single value from the database
   * @param query SQL Query
   * @param values Array of values to be substituted into SQL Query
   * @returns {void}
   */
  static async execute(query: string, values?: any | any[] | { [param: string]: any }, multiple = false): Promise<any> {
    if (multiple) {
      await DatabaseHandler.pool.promise().query(query, values);
    } else {
      await DatabaseHandler.pool.promise().execute(query, values);
    }
  }

  /**
   * Allows remaining queries to execute then closes the connection pool
   */
  static close() {
    DatabaseHandler.pool.end((err) => {
      if (err) throw err;
    });
  }
}

export default DatabaseHandler;
