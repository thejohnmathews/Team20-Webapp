//get all required
const express = require("express")
const bodyParser = require("body-parser")
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
app.use(bodyParser.urlencoded({ extended: true }));

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

app.get('/goodReasons', (req, res) => {
    const sql = "SELECT * FROM Reason WHERE reasonID BETWEEN 1 AND 5"
    db.query(sql, (err, data) => {
        if(err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})

app.post('/newDriver', (req, res) => {
    console.log("creating new driver ");
    console.log(req.body);

    const { firstName, lastName, username, email } = req.body;
    const sql = 'INSERT INTO UserInfo (firstName, lastName, userUsername, email, userType) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [firstName, lastName, username, email, "Driver"];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        res.status(500).send('Error inserting user');
      } else {
        console.log('User inserted successfully');
        res.status(200).send('User inserted successfully');
      }
    });
  });

app.get('/badReasons', (req, res) => {
    const sql = "SELECT * FROM Reason WHERE reasonID >= 6"
    db.query(sql, (err, data) => {
        if(err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})

app.get('/sponsorOrg/:sponsorOrgID', (req, res) => {
    //NOTE: DEFINITELY NOT SAFE, WILL FIX THAT LATER
    const sql = "SELECT * FROM SponsorOrganization WHERE sponsorOrgID = " + req.params.sponsorOrgID;
    db.query(sql, (err, data) => {
        if(err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})

app.post('/accountManagement/sponsorOrgUpdate/:sponsorOrgID', (req, res) => {
    console.log(req.body)

    //also will fix this, this is super dangerous lol but more proof of concept than anything else
    const sql = 'UPDATE SponsorOrganization SET sponsorOrgName = "' + req.body.sponsorName + '", sponsorOrgDescription = "' + req.body.sponsorDescription + '" WHERE sponsorOrgID = ' + req.params.sponsorOrgID + ';'
    db.query(sql, (err, data) => {
        if(err) {
            return res.json(err);
        }
        else {
            res.redirect("http://localhost:3000/accountManagement")
        }
    })
})

app.listen(3000, ()=> {
    console.log("listening")
})