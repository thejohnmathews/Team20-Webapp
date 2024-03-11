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
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

    const { firstName, lastName, username, email, sub } = req.body;
    const sql1 =' INSERT INTO UserInfo (firstName, lastName, userUsername, email, userType, sub) VALUES (?, ?, ?, ?, ?, ?)';
    const sql2 = 'INSERT INTO DriverUser (userID) VALUES (LAST_INSERT_ID());';

    const values = [firstName, lastName, username, email, "Driver", sub];
  
    db.query(sql1, values, (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        res.status(500).send('Error inserting user');
      } else {
        console.log('User inserted successfully');
        res.status(200).send('User inserted successfully');
        db.query(sql2, (err, result) => {
            if (err) {
                console.error('Error inserting driver user:', err);
                return;
            }
            console.log('User and driver user inserted successfully');
        });
      }
    });
});

app.post('/checkUser', (req, res) => {
    // Extract the sub from the request query
    const sub = req.body.sub;

    // Query the database to check if a user with the given sub exists
    const sql = 'SELECT COUNT(*) AS userCount FROM UserInfo WHERE sub = ?';
    
    db.query(sql, [sub], (err, result) => {
        if (err) {
            console.error('Error checking user:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        // Extract the user count from the query result
        const userCount = result[0].userCount;

        // If userCount is greater than 0, user exists; otherwise, user doesn't exist
        const userExists = userCount > 0;

        // Send the result back to the frontend
        res.json({ userExists });
    });
});

app.post('/userAttributes', (req, res) => {
    // Extract the sub from the request body
    const sub = req.body.sub;

    // Query the database to check if a user with the given sub exists
    const sql = 'SELECT * FROM UserInfo WHERE sub = ?';

    db.query(sql, [sub], (err, rows) => {
        if (err) {
            console.error('Error checking user:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        // If rows are returned, user exists; otherwise, user doesn't exist
        const userExists = rows.length > 0;

        // Send the result back to the frontend
        if (userExists) {
            // Extract user data from the first row (assuming only one user per sub)
            const userData = rows[0];
            res.json({ userExists, userData });
        } else {
            res.json({ userExists });
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