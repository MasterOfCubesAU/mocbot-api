# Setup

 Create a `.env` file file the following env vars
```
HOST # The hostname to use for the web server
PORT # The port to use for the web server

DB_HOST # The hostname to use for the database
DB_USER # The user to use for the database
DB_PASS # The password to the user for the database
DB_NAME # The database name to use from the database server
```

Install project dependencies
```bash
npm i
```

Start the web server
```bash
npm run start:dev # for development
npm run start:prod # for production
```