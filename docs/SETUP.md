# Setup

 Create a `.env` file with the following env vars
```
HOST # The hostname to use for the web server
PORT # The port to use for the web server

DB_HOST # The hostname to use for the database
DB_USER # The user to use for the database
DB_PASS # The password to the user for the database
DB_NAME # The database name to use from the database server

# For unit testing
API_KEY # The API key to use so jest can use the API
```

Install project dependencies
```bash
npm ci --include=dev
```

Start the web server
```bash
# for development
npm run start:dev 

# for production
npm run build
npm run start
```
