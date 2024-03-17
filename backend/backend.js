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
    const sql1 = 'INSERT INTO UserInfo (firstName, lastName, userUsername, email, userType, sub) VALUES (?, ?, ?, ?, ?, ?)';
    const sql2 = 'INSERT INTO DriverUser (userID) VALUES (?)'; // Use placeholder for userID

    const values = [firstName, lastName, username, email, "Driver", sub];

    db.query(sql1, values, (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            res.status(500).send('Error inserting user');
        } else {
            console.log('User inserted successfully');
            const userID = result.insertId; // Get the ID of the newly inserted user

            db.query(sql2, [userID], (err, result) => { // Pass userID as a parameter
                if (err) {
                    console.error('Error inserting driver user:', err);
                    res.status(500).send('Error inserting driver user');
                } else {
                    console.log('User and driver user inserted successfully');
                    res.status(200).json({ userID }); // Send the userID back to the frontend
                }
            });
        }
    });
});


app.post('/addAdmin', (req, res) => {
    console.log("adding new admin ");

    const { email } = req.body;
    const sql1 = 'INSERT INTO UserInfo (email, userType) VALUES (?, ?)';
    const sql2 = 'INSERT INTO AdminUser (userID) VALUES (?)';

    const values = [email, "Admin"];

    db.query(sql1, values, (err, result) => {
        if (err) {
            console.error('Error inserting into user:', err);
            res.status(500).send('Error inserting into user');
        } else {
            console.log('user inserted successfully');

            const userID = result.insertId; // Get the ID of the newly inserted user
            db.query(sql2, userID, (err, result) => { 
                if (err) {
                    console.error('Error inserting into admin:', err);
                    res.status(500).send('Error inserting into admin');
                } else {
                    console.log('admin inserted successfully');
                    res.status(200).send('admin inserted successfully');
                }

            });
        }
    });
});

app.get('/adminList', (req, res) => {
    console.log("getting all admins ");
    const sql = 'SELECT a.userID, u.sub, u.email FROM AdminUser AS a INNER JOIN UserInfo AS u ON a.userID = u.userID';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error retrieving admins:', err);
            res.status(500).send('Error retrieving admins');
        } else {
            if (result.length > 0) {
                console.log('admins retrieved successfully');
                res.status(200).json(result);
            } else {
                console.log('No admins found');
                res.status(404).send('No admins found');
            }
        }
    });
});

app.post('/sponsorList', (req, res) => {
    console.log("getting all sponsors ");
    const orgID = req.body.orgID;
    var sql = 'SELECT s.userID, u.sub, u.email';
    if (orgID < 1){
        sql += ', o.SponsorOrgName'
    }
    sql += ' FROM SponsorUser AS s INNER JOIN UserInfo AS u ON s.userID = u.userID';

    if (orgID > 0) {
        sql += ' WHERE s.sponsorOrgID = ?'

        db.query(sql, [orgID], (err, result) => {
            if (err) {
                console.error('Error retrieving sponsor:', err);
                res.status(500).send('Error retrieving sponsor');
            } else {
                if (result.length > 0) {
                    console.log('Sponsor retrieved successfully');
                    res.status(200).json(result);
                } else {
                    console.log('No sponsors found');
                    res.status(404).send('No sponsors found');
                }
            }
        });
    } else {
        sql += ' INNER JOIN SponsorOrganization AS o ON s.sponsorOrgID = o.sponsorOrgID ';

        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error retrieving sponsor:', err);
                res.status(500).send('Error retrieving sponsor');
            } else {
                if (result.length > 0) {
                    console.log('Sponsor retrieved successfully');
                    res.status(200).json(result);
                } else {
                    console.log('No sponsors found');
                    res.status(404).send('No sponsors found');
                }
            }
        });
    }
});


app.post('/addSponsor', (req, res) => {
    console.log("adding new admin ");

    const { email, sponsorID } = req.body;
    const sql1 = 'INSERT INTO UserInfo (email, userType) VALUES (?, ?)';
    const sql2 = 'INSERT INTO SponsorUser (userID, sponsorOrgID) VALUES (?, ?)';

    const values = [email, "Sponsor"];

    db.query(sql1, values, (err, result) => {
        if (err) {
            console.error('Error inserting into user:', err);
            res.status(500).send('Error inserting into user');
        } else {
            console.log('user inserted successfully');

            const userID = result.insertId;
            const values2 = [userID, sponsorID]
            db.query(sql2, values2, (err, result) => { 
                if (err) {
                    console.error('Error inserting into admin:', err);
                    res.status(500).send('Error inserting into admin');
                } else {
                    console.log('admin inserted successfully');
                    res.status(200).send('admin inserted successfully');
                }

            });
        }
    });
});

app.post('/newOrganization', (req, res) => {
    console.log("creating new organization ");

    const { sponsorOrgName, sponsorOrgDescription} = req.body;
    const sql1 = 'INSERT INTO SponsorOrganization (sponsorOrgName, sponsorOrgDescription) VALUES (?, ?)';

    const values = [sponsorOrgName, sponsorOrgDescription];

    db.query(sql1, values, (err, result) => {
        if (err) {
            console.error('Error inserting org:', err);
            res.status(500).send('Error inserting org');
        } else {
            console.log('Org inserted successfully');
            res.status(200).send('Org inserted successfully');
        }
    });
});

app.get('/getAllOrgs', (req, res) => {
    console.log("getting all orgs ");
    const sql = 'SELECT * FROM SponsorOrganization';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error retrieving organizations:', err);
            res.status(500).send('Error retrieving organizations');
        } else {
            if (result.length > 0) {
                console.log('Organizations retrieved successfully');
                res.status(200).json(result); // Send the organizations as JSON
            } else {
                console.log('No organizations found');
                res.status(404).send('No organizations found');
            }
        }
    });
});

app.post('/editOrg', (req, res) => {
    console.log("editting org ");
    const { sponsorOrgID, sponsorOrgName, sponsorOrgDescription} = req.body;
    console.log(sponsorOrgID);
    const sql = 'UPDATE SponsorOrganization SET sponsorOrgName = ?, sponsorOrgDescription = ? WHERE sponsorOrgID = ?';
    const values = [sponsorOrgName, sponsorOrgDescription, sponsorOrgID];
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating organization:', err);
            res.status(500).send('Error updating organization');
        } else {
            console.log('Organization updated successfully');
            res.status(200).send('Organization updated successfully');
        }
    });
});



app.post('/newApplication', (req, res) => {
    console.log("creating new application ");

    const { id } = req.body;
    const sql1 =' INSERT INTO DriverApplication (dateOfApplication, userID) VALUES (CURRENT_DATE, ?)';

    const values = [id];
  
    db.query(sql1, values, (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        res.status(500).send('Error inserting user');
      } else {
        console.log('User inserted successfully');
        res.status(200).send('User inserted successfully');
      }
    });
});

app.get('/checkDriverApplication/:userID', (req, res) => {
    const userID = req.params.userID;

    const sql = 'SELECT * FROM DriverApplication WHERE UserID = ?';

    db.query(sql, [userID], (err, result) => {
        if (err) {
            console.error('Error searching for driver application:', err);
            res.status(500).send('Error searching for driver application');
        } else {
            if (result.length > 0) {
                // Driver application found for the userID
                console.log('Driver application found:', result);
                res.status(200).json({ hasApplication: true, application: result });
            } else {
                // No driver application found for the userID
                console.log('No driver application found for userID:', userID);
                res.status(200).json({ hasApplication: false });
            }
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

app.get('/driverApplications', (req, res) => {
    const orgID = req.query.orgID;
    let sql = "SELECT DA.*, UI.sub FROM DriverApplication DA INNER JOIN UserInfo UI ON DA.UserID = UI.UserID";

    const values = [];
    if (orgID && orgID > 0) {
        sql += " WHERE DA.Organization = ?";
        values.push(orgID);
    }

    db.query(sql, values, (err, data) => {
        if (err) {
            return res.json(err);
        } else {
            return res.json(data);
        }
    });
});

app.post('/updateApplicationStatus', (req, res) => {
    console.log(req.body);
    const { appID, status } = req.body;
    console.log(appID);
    console.log(status);

    // Check if appID and status are provided
    if (!appID || !status) {
        return res.status(400).json({ error: 'Both appID and status are required parameters' });
    }

    // Update the application status in the DriverApplication table
    const sql = "UPDATE DriverApplication SET applicationStatus = ? WHERE applicationID = ?";
    db.query(sql, [status, appID], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update application status' });
        } else {
            return res.status(200).json({ message: 'Application status updated successfully' });
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