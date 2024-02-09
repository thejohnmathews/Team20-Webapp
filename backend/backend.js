//get all required
const express = require("express")
const mysql = require("mysql")
const cors = require("cors")

//set up .env variables
require("dotenv").config();
const dbUser = process.env.DB_USERNAME
const dbPass = process.env.DB_PASSWORD
const dbHost = process.env.DB_HOST
const dbName = process.env.DB_NAME

const app = express()
app.use(cors())

const db = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPass,
    database: dbName
})

app.get('/About', (req, res) => {
    const sql = "SELECT * FROM About"
    db.query(sql, (err, data) => {
        if(err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})

app.listen(8081, ()=> {
    console.log("listening")
})