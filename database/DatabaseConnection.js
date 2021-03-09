const mysql = require("mysql");
require("dotenv").config();

const config = {
    host:process.env.DB_HOST,
    database:process.env.DB_NAME,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    port:process.env.DB_PORT
}

module.exports = class Database{
    constructor(){
        this.connection = mysql.createConnection(config);
        this.connection.connect((err)=>{
            if (err) throw err;
            // else console.log("connect");
        });
    }

    /**
     * executes the query pass the resolve promise
     */
    dbQuery(statement, parameter){
        return new Promise((resolve,reject)=>{
            this.connection.query(statement, parameter, (err, res)=>{
                if(err) reject(err);
                else resolve(res);
            });
        })
    }

    /**
     * close the database connection
     */
    dbClose(){
        return new Promise((resolve, reject)=>{
            resolve(this.connection.end());
        });
    }
}