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

app.post('/adminInfoFromSub', (req, res) => {
    const sub = req.body.sub;
    var sql = 'SELECT userID, firstName, lastName, email, userUsername FROM UserInfo WHERE sub = ?';
    db.query(sql, sub, (err, result) => {
        if (err) {
            console.error('Error retrieving user info:', err);
            res.status(500).send('Error retrieving user info');
        } else {
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).send('No user found');
            }
        }
    });
});

app.post('/updateAdmin', (req, res) => {
    const { email, firstName, lastName, userUsername, sub } = req.body;
    const sql = 'UPDATE UserInfo SET email = ?, firstName = ?, lastName = ?, userUsername = ? WHERE sub = ?';
    const values = [email, firstName, lastName, userUsername, sub];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            res.status(500).send('Error updating user');
        } else {
            res.status(200).json("User updated successfully"); // Send the userID back to the frontend
        }
    });
});


app.post('/newDriver', (req, res) => {
    const { email, sponsorID, firstName, lastName, sub, username } = req.body;
    const sql1 = 'INSERT INTO UserInfo (email, userType, firstName, lastName, sub, userUsername) VALUES (?, ?, ?, ?, ?, ?)';
    const sql2 = 'INSERT INTO DriverUser (userID, sponsorOrgID) VALUES (?, ?)'; // Use placeholder for userID

    const values = [email, "Driver", firstName, lastName, sub, username];

    db.query(sql1, values, (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            res.status(500).send('Error inserting user');
        } else {
            const userID = result.insertId; // Get the ID of the newly inserted user

            db.query(sql2, [userID, sponsorID], (err, result) => { // Pass userID as a parameter
                if (err) {
                    console.error('Error inserting driver user:', err);
                    res.status(500).send('Error inserting driver user');
                } else {
                    res.status(200).json({ userID }); // Send the userID back to the frontend
                }
            });
        }
    });
});


app.post('/addAdmin', (req, res) => {
    const { email } = req.body;
    const sql1 = 'INSERT INTO UserInfo (email, userType) VALUES (?, ?)';
    const sql2 = 'INSERT INTO AdminUser (userID) VALUES (?)';

    const values = [email, "Admin"];

    db.query(sql1, values, (err, result) => {
        if (err) {
            console.error('Error inserting into user:', err);
            res.status(500).send('Error inserting into user');
        } else {
            const userID = result.insertId; // Get the ID of the newly inserted user
            db.query(sql2, userID, (err, result) => { 
                if (err) {
                    console.error('Error inserting into admin:', err);
                    res.status(500).send('Error inserting into admin');
                } else {
                    res.status(200).send('admin inserted successfully');
                }

            });
        }
    });
});


app.get('/adminList', (req, res) => {
    const sql = 'SELECT a.userID, u.sub, u.email, u.firstName, u.lastName FROM AdminUser AS a INNER JOIN UserInfo AS u ON a.userID = u.userID';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error retrieving admins:', err);
            res.status(500).send('Error retrieving admins');
        } else {
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                console.log('No admins found');
                res.status(404).send('No admins found');
            }
        }
    });
});

app.post('/sponsorList', (req, res) => {
    const orgID = req.body.orgID;
    var sql = 'SELECT s.userID, u.sub, u.email, u.lastName, u.firstName';
    if (orgID < 1){
        sql += ', o.SponsorOrgName'
    }
    sql += ' FROM SponsorUser AS s INNER JOIN UserInfo AS u ON s.userID = u.userID';

    if (orgID > 0) {
        sql += ' WHERE s.sponsorOrgID = ?'

        db.query(sql, orgID, (err, result) => {
            if (err) {
                console.error('Error retrieving sponsor:', err);
                res.status(500).send('Error retrieving sponsor');
            } else {
                if (result.length > 0) {
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
                    res.status(200).json(result);
                } else {
                    console.log('No sponsors found');
                    res.status(404).send('No sponsors found');
                }
            }
        });
    }
});

app.post('/driverList', (req, res) => {
    const orgID = req.body.orgID;
    var sql = 'SELECT d.userID, u.sub, u.email, u.lastName, u.firstName';
    if (orgID < 1 || orgID === undefined){
        sql += ', o.sponsorOrgName'
    }
    sql += ' FROM DriverUser AS d INNER JOIN UserInfo AS u ON d.userID = u.userID';

    if (orgID > 0) {
        sql += ' WHERE d.sponsorOrgID = ?'

        db.query(sql, [orgID], (err, result) => {
            if (err) {
                console.error('Error retrieving list:', err);
                res.status(500).send('Error retrieving list');
            } else {
                if (result.length > 0) {
                    res.status(200).json(result);
                } else {
                    res.status(404).send('No list found');
                }
            }
        });
    } else {
        sql += ' INNER JOIN SponsorOrganization AS o ON d.sponsorOrgID = o.sponsorOrgID';

        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error retrieving drivers:', err);
                res.status(500).send('Error retrieving drivers');
            } else {
                if (result.length > 0) {
                    res.status(200).json(result);
                } else {
                    res.status(404).send('No drivers found');
                }
            }
        });
    }
});

app.post('/associatedSponsor', (req, res) => {
    const sub = req.body.sub;
    var sql = 'SELECT s.sponsorOrgID, o.sponsorOrgName FROM SponsorUser s JOIN UserInfo u ON s.userID = u.userID JOIN SponsorOrganization o ON s.sponsorOrgID = o.sponsorOrgID WHERE u.sub = ?';

    db.query(sql, sub, (err, result) => {
            if (err) {
                console.error('Error retrieving associated sponsor:', err);
                res.status(500).send('Error retrieving associated sponsor');
            } else {
                if (result.length > 0) {
                    res.status(200).json(result);
                } else {
                    console.log('No sponsors found');
                    res.status(404).send('No sponsors found');
                }
            }
        });

});

app.post('/driverAssociatedSponsor', (req, res) => {
    const sub = req.body.sub;
    var sql = 'SELECT d.sponsorOrgID, o.sponsorOrgName FROM DriverUser d JOIN UserInfo u ON d.userID = u.userID JOIN SponsorOrganization o ON d.sponsorOrgID = o.sponsorOrgID WHERE u.sub = ?';

    db.query(sql, sub, (err, result) => {
            if (err) {
                console.error('Error retrieving associated sponsor:', err);
                res.status(500).send('Error retrieving associated sponsor');
            } else {
                if (result.length > 0) {
                    res.status(200).json(result);
                } else {
                    console.log('No sponsors found');
                    res.status(404).send('No sponsors found');
                }
            }
        });

});

app.post('/addSponsor', (req, res) => {
    const { email, sponsorID } = req.body;
    const sql1 = 'INSERT INTO UserInfo (email, userType) VALUES (?, ?)';
    const sql2 = 'INSERT INTO SponsorUser (userID, sponsorOrgID) VALUES (?, ?)';

    const values = [email, "Sponsor"];

    db.query(sql1, values, (err, result) => {
        if (err) {
            console.error('Error inserting into user:', err);
            res.status(500).send('Error inserting into user');
        } else {

            const userID = result.insertId;
            const values2 = [userID, sponsorID]
            db.query(sql2, values2, (err, result) => { 
                if (err) {
                    console.error('Error inserting into admin:', err);
                    res.status(500).send('Error inserting into admin');
                } else {
                    res.status(200).send('admin inserted successfully');
                }

            });
        }
    });
});

app.post('/newOrganization', (req, res) => {
    const { sponsorOrgName, sponsorOrgDescription} = req.body;
    const sql1 = 'INSERT INTO SponsorOrganization (sponsorOrgName, sponsorOrgDescription) VALUES (?, ?)';

    const values = [sponsorOrgName, sponsorOrgDescription];

    db.query(sql1, values, (err, result) => {
        if (err) {
            console.error('Error inserting org:', err);
            res.status(500).send('Error inserting org');
        } else {
            res.status(200).send('Org inserted successfully');
        }
    });
});

app.get('/getAllOrgs', (req, res) => {
    const sql = 'SELECT * FROM SponsorOrganization';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error retrieving organizations:', err);
            res.status(500).send('Error retrieving organizations');
        } else {
            if (result.length > 0) {
                res.status(200).json(result); // Send the organizations as JSON
            } else {
                console.log('No organizations found');
                res.status(404).send('No organizations found');
            }
        }
    });
});

app.post('/editOrg', (req, res) => {
    const { sponsorOrgID, sponsorOrgName, sponsorOrgDescription} = req.body;
    const sql = 'UPDATE SponsorOrganization SET sponsorOrgName = ?, sponsorOrgDescription = ? WHERE sponsorOrgID = ?';
    const values = [sponsorOrgName, sponsorOrgDescription, sponsorOrgID];
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating organization:', err);
            res.status(500).send('Error updating organization');
        } else {
            res.status(200).send('Organization updated successfully');
        }
    });
});



app.post('/newApplication', (req, res) => {
    const { id, sponsorOrgID } = req.body;
    const sql1 =' INSERT INTO DriverApplication (dateOfApplication, userID, sponsorOrgID) VALUES (CURRENT_DATE, ?, ?)';

    const values = [id, sponsorOrgID];
  
    db.query(sql1, values, (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        res.status(500).send('Error inserting user');
      } else {
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
                res.status(200).json({ hasApplication: true, application: result });
            } else {
                console.log('No driver application found for userID:', userID);
                res.status(200).json({ hasApplication: false });
            }
        }
    });
});


app.post('/checkUser', (req, res) => {
    const sub = req.body.sub;
    const sql = 'SELECT COUNT(*) AS userCount FROM UserInfo WHERE sub = ?';
    
    db.query(sql, [sub], (err, result) => {
        if (err) {
            console.error('Error checking user:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        const userCount = result[0].userCount;
        const userExists = userCount > 0;
        res.json({ userExists });
    });
});

app.post('/userAttributes', (req, res) => {
    const sub = req.body.sub;
    const sql = 'SELECT * FROM UserInfo WHERE sub = ?';

    db.query(sql, [sub], (err, rows) => {
        if (err) {
            console.error('Error checking user:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        const userExists = rows.length > 0;

        if (userExists) {
            const userData = rows[0];
            res.json({ userExists, userData });
        } else {
            res.json({ userExists });
        }
    });
});

app.post('/driverApplications', (req, res) => {
    const orgID = req.body.orgID;

    console.log(orgID);
    let sql = "SELECT DA.*, UI.sub, UI.lastName, UI.firstName, SO.sponsorOrgName FROM DriverApplication DA INNER JOIN UserInfo UI ON DA.userID = UI.userID JOIN SponsorOrganization SO ON DA.sponsorOrgID = SO.sponsorOrgID";

    const values = [];
    if (orgID && orgID > 0) {
        sql += " WHERE DA.sponsorOrgID = ?";
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
    const { appID, status } = req.body;
    if (!appID || !status) {
        return res.status(400).json({ error: 'Both appID and status are required parameters' });
    }

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

// John - I changed the link in this to 3001 for testing!!
app.post('/accountManagement/sponsorOrgUpdate/:sponsorOrgID', (req, res) => {
    console.log(req.body)

    //also will fix this, this is super dangerous lol but more proof of concept than anything else
    const sql = 'UPDATE SponsorOrganization SET sponsorOrgName = "' + req.body.sponsorName + '", sponsorOrgDescription = "' + req.body.sponsorDescription + '" WHERE sponsorOrgID = ' + req.params.sponsorOrgID + ';'
    db.query(sql, (err, data) => {
        if(err) {
            return res.json(err);
        }
        else {
            res.redirect("http://localhost:8080/accountManagement")
        }
    })
})

app.get('/pointChanges', (req, res) => {
    const sql = `

    SELECT 
        PointChange.*, 
        UserInfo.firstName, 
        UserInfo.lastName, 
        SponsorOrganization.sponsorOrgName,
        Reason.reasonString
    FROM 
        PointChange 
    JOIN 
        UserInfo ON PointChange.driverID = UserInfo.userID 
    JOIN 
        DriverUser ON UserInfo.userID = DriverUser.userID 
    JOIN 
        SponsorOrganization ON DriverUser.sponsorOrgID = SponsorOrganization.sponsorOrgID
    JOIN 
        Reason ON PointChange.changeReasonID = Reason.reasonID;
    `;
    
    db.query(sql, (err, data) => {
        if(err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})

// John - I changed this to 3001 for testing!!
app.listen(8080, ()=> {
    console.log("listening")
})