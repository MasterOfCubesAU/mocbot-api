import mysql2 from 'mysql2';

class DatabaseHandler {

    static connection = mysql2.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });


    static connect() {
        DatabaseHandler.connection.connect((err) => {
            if (err) throw err;
        });
    }
}

export default DatabaseHandler;