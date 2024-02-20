const Pool = require("pg").Pool;

const pool = new Pool({
    user: "", 
    password: "", 
    host: "localhost", 
    port: 5432,
    database: "todoapp"

});

module.exports = pool;