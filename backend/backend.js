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

app.get('/loginAttempts', (req, res) => {
    const sql = "SELECT loginAttemptID, userName, loginAttemptDate, success FROM LoginAttempt\
    JOIN UserInfo ON LoginAttempt.userName = UserInfo.userUsername\
    JOIN DriverOrganizations DO on DO.driverID = UserInfo.userID\
    WHERE DO.sponsorOrgID =  ? ORDER BY loginAttemptDate ASC;"
    db.query(sql, req.query.sponsorOrgID, (err, data) => {
        if(err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})

app.get('/passwordChange', (req, res) => {
    const sql = "SELECT passwordChangeID, PasswordChange.userID, changeDate, oldPassword, newPassword FROM PasswordChange\
    JOIN UserInfo ON PasswordChange.userID = UserInfo.userID\
    JOIN DriverOrganizations ON UserInfo.userID = DriverOrganizations.driverID\
    WHERE DriverOrganizations.sponsorOrgID = ? ORDER BY changeDate ASC;"
    db.query(sql, req.query.sponsorOrgID, (err, data) => {
        if(err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})

app.get('/allLogins', (req, res) => {
    const sql = "SELECT * FROM LoginAttempt ORDER BY loginAttemptDate ASC;"
    db.query(sql, (err, data) => {
        if(err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})
app.get('/allPasswordChanges', (req, res) => {
    const sql = "SELECT u.userUsername, pc.userID, pc.changeDate FROM PasswordChange pc JOIN UserInfo u ON pc.userID = u.userID;"
    db.query(sql, (err, data) => {
        if(err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})
app.get('/allDriverApps', (req, res) => {
    const sql = "SELECT d.applicationID, d.dateOfApplication, d.applicationStatus, d.statusReason, d.userID, d.sponsorOrgID, u.userUsername \
    FROM DriverApplication d JOIN UserInfo u on d.userID = u.userID"
    db.query(sql, (err, data) => {
        if(err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})
app.get('/allPointChanges', (req, res) => {
    const sql = "SELECT * FROM PointChange;"
    db.query(sql, (err, data) => {
        if(err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})

app.post('/addCatalogRule', (req, res) => {
    const {sponsorOrgID, catalogRuleName} = req.body;
    const sql = "INSERT INTO CatalogRules(sponsorOrgID, catalogRuleName) VALUES (?, ?)"
    const values = [sponsorOrgID, catalogRuleName];
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error adding reason:', err);
            res.status(500).send('Error adding reason');
        } else {
            res.status(200).json("Reason added successfully");
        }
    });
})

app.post('/removeCatalogRule', (req, res) => {
    const {sponsorOrgID, catalogRuleName} = req.body;
    const sql = "DELETE FROM CatalogRules WHERE sponsorOrgID = ? AND catalogRuleName = ?"
    const values = [sponsorOrgID, catalogRuleName];
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error adding reason:', err);
            res.status(500).send('Error adding reason');
        } else {
            res.status(200).json("Reason added successfully");
        }
    });
})

app.get('/getSponsorRatio', (req, res) => {
    const sql = 'SELECT sponsorDollarPointRatio from SponsorOrganization WHERE sponsorOrgID = ?';
    db.query(sql, req.query.sponsorOrgID, (err, data) => {
        if(err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
});

app.get('/driverAppInfo', (req, res) => {
    const sql = "SELECT D.applicationID, D.dateOfApplication, D.applicationStatus, D.statusReason, UserInfo.userUsername FROM DriverApplication D\
    JOIN UserInfo ON D.userID = UserInfo.userID  WHERE sponsorOrgID = ? ORDER BY D.dateOfApplication ASC"
    db.query(sql, req.query.sponsorOrgID, (err, data) => {
        if(err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})

app.get('/sponsorCatalogRules', (req, res) => {
    const sql = "SELECT catalogRuleName FROM CatalogRules WHERE sponsorOrgID = ?"
    db.query(sql, req.query.sponsorOrgID, (err, data) => {
        if(err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})

app.get('/goodReasons', (req, res) => {
    const sql = "SELECT * FROM Reason WHERE reasonType = 'good' AND sponsorOrgID = ?"
    db.query(sql, req.query.sponsorOrgID, (err, data) => {
        if(err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})

app.post('/updateReason', (req, res) => {
    const {description, ID} = req.body;
    const sql = "UPDATE Reason SET reasonString = ? WHERE reasonID = ?"
    const values = [description, ID];
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating reason:', err);
            res.status(500).send('Error updating reason');
        } else {
            res.status(200).json("Reason updated successfully");
        }
    });
})

app.post('/addReason', (req, res) => {
    const {description, type, sponsorID} = req.body;
    const sql = "INSERT INTO Reason(reasonString, reasonType, sponsorOrgID) VALUES (?, ?, ?)"
    const values = [description, type, sponsorID];
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error adding reason:', err);
            res.status(500).send('Error adding reason');
        } else {
            res.status(200).json("Reason added successfully");
        }
    });
})


app.post('/driverInfoFromSub', (req, res) => {
    const sub = req.body.sub;
    var sql = 'SELECT u.userID, u.firstName, u.lastName, u.email, u.userUsername, u.userPhoneNumber, d.driverAddress FROM UserInfo u JOIN DriverUser d ON u.userID = d.userID WHERE sub = ?';
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

app.post('/sponsorInfoFromSub', (req, res) => {
    const sub = req.body.sub;
    var sql = 'SELECT u.userID, u.firstName, u.lastName, u.email, u.userUsername, u.userPhoneNumber FROM UserInfo u JOIN SponsorUser s ON u.userID = s.userID WHERE sub = ?';
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

app.post('/adminInfoFromSub', (req, res) => {
    const sub = req.body.sub;
    var sql = 'SELECT userID, firstName, lastName, email, userUsername, userPhoneNumber FROM UserInfo WHERE sub = ?';
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

// app.post('/updateDriver', (req, res) => {
//     const { email, firstName, lastName, userUsername, userPhoneNumber, driverAddress, sub } = req.body;
//     const sql = 'UPDATE UserInfo SET email = ?, firstName = ?, lastName = ?, userUsername = ?, userPhoneNumber = ? WHERE sub = ?';
//     const values = [email, firstName, lastName, userUsername, userPhoneNumber, sub];

//     db.query(sql, values, (err, data) => {
//         if (err) {
//             console.error('Error updating user:', err);
//             res.status(500).send('Error updating user');
//         } else {
//             const sql2 = 'UPDATE DriverUser SET driverAddress = ? WHERE sub = ?'
//             db.query(sql2, [driverAddress, sub], (err, result) => {
//                 if (err) {
//                     console.error('Error updating user:', err);
//                     res.status(500).send('Error updating user');
//                 }
//                 else{
//                     res.status(200).json("User updated successfully");
//                 }
//             });
//         }
//     });
// });

app.post('/updateDriver', (req, res) => {
    const { email, firstName, lastName, userUsername, userPhoneNumber, driverAddress, sub } = req.body;
        const sql1 = 'SELECT userID FROM UserInfo WHERE sub = ?';
    
    db.query(sql1, [sub], (err, result) => {
        if (err) {
            console.error('Error fetching userID:', err);
            res.status(500).send('Error updating user');
        } else {
            if (result.length > 0) {
                const userID = result[0].userID;
                
                const sql2 = 'UPDATE UserInfo SET email = ?, firstName = ?, lastName = ?, userUsername = ?, userPhoneNumber = ? WHERE sub = ?';
                const values = [email, firstName, lastName, userUsername, userPhoneNumber, sub];

                db.query(sql2, values, (err, data) => {
                    if (err) {
                        console.error('Error updating user:', err);
                        res.status(500).send('Error updating user');
                    } else {
                        // Update DriverUser table using userID
                        const sql3 = 'UPDATE DriverUser SET driverAddress = ? WHERE userID = ?';
                        db.query(sql3, [driverAddress, userID], (err, result) => {
                            if (err) {
                                console.error('Error updating driver:', err);
                                res.status(500).send('Error updating driver');
                            } else {
                                res.status(200).json("User updated successfully");
                            }
                        });
                    }
                });
            } else {
                res.status(404).send('User not found');
            }
        }
    });
});


app.post('/updateSponsor', (req, res) => {
    const { email, firstName, lastName, userUsername, userPhoneNumber, sub } = req.body;
    const sql = 'UPDATE UserInfo SET email = ?, firstName = ?, lastName = ?, userUsername = ?, userPhoneNumber = ? WHERE sub = ?';
    const values = [email, firstName, lastName, userUsername, userPhoneNumber, sub];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            res.status(500).send('Error updating user');
        } else {
            res.status(200).json("User updated successfully");
        }
    });
});

app.post('/updateAdmin', (req, res) => {
    const { email, firstName, lastName, userUsername, userPhoneNumber, sub } = req.body;
    const sql = 'UPDATE UserInfo SET email = ?, firstName = ?, lastName = ?, userUsername = ?, userPhoneNumber = ? WHERE sub = ?';
    const values = [email, firstName, lastName, userUsername, userPhoneNumber, sub];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            res.status(500).send('Error updating user');
        } else {
            res.status(200).json("User updated successfully");
        }
    });
});

app.post('/updateOrg', (req, res) => {
    const { name, description, ID, ratio } = req.body;
    const sql = 'UPDATE SponsorOrganization SET sponsorOrgName = ?, sponsorOrgDescription = ?, sponsorDollarPointRatio = ? WHERE sponsorOrgID = ?';
    const values = [name, description, ratio, ID];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating org:', err);
            res.status(500).send('Error updating org');
        } else {
            res.status(200).json("org updated succegssfully"); 
        }
    });
});

app.post('/addUserToDriverPool', (req, res) => {
    const { userID, sponsorID} = req.body;
    const sql1 = "UPDATE UserInfo SET userType = 'Driver' WHERE userID = ?";
    const sql2 = 'INSERT INTO DriverUser (userID) VALUES (?)';
    var sql3 = 'INSERT INTO DriverOrganizations (driverID, sponsorOrgID, driverOrgPoints) VALUES';
    var values = [];
    for(var i = 0; i < sponsorID.length; i++){
        values.push(userID)
        values.push(sponsorID[i])
        if (i === 0){
            sql3 += ' (?, ?, 0)';
        } else{
            sql3 += ', (?, ?, 0)';
        }
    }
    sql3 += ';'

    db.query(sql1, [userID], (err, result) => {
        if (err) {
            console.error('Error updating user type', err);
            res.status(500).send('Error updating user type');
        } else {
            db.query(sql2, [userID], (err, result) => { 
                if (err) {
                    console.error('Error inserting into driver:', err);
                    res.status(500).send('Error inserting into driver');
                } else {
                    db.query(sql3, values, (err, result) => { 
                        if (err) {
                            console.error('Error inserting into driverOrganizations:', err);
                            res.status(500).send('Error inserting into driverOrganizations');
                        } else {
                            res.status(200).send('driver added');
                        }
                    });
                }
            });
        }
    });
});


app.post('/newDriver', (req, res) => {
    const { email, sponsorID} = req.body;
    const sql1 = 'INSERT INTO UserInfo (email, userType) VALUES (?, ?)';
    const values1 = [email, 'Driver']

    db.query(sql1, values1, (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            res.status(500).send('Error inserting user');
        } else {
            const userID = result.insertId;
            const sql2 = 'INSERT INTO DriverUser (userID) VALUES (?)';
            db.query(sql2, [userID], (err, result) => {
                if (err) {
                    console.error('Error inserting into driver:', err);
                    res.status(500).send('Error inserting into driver');
                } else {
                    var sql3 = 'INSERT INTO DriverOrganizations (driverID, sponsorOrgID, driverOrgPoints) VALUES';
                    var values2 = [];
                    for(var i = 0; i < sponsorID.length; i++){
                        values2.push(userID)
                        values2.push(sponsorID[i])
                        if (i === 0){
                            sql3 += ' (?, ?, 0)';
                        } else{
                            sql3 += ', (?, ?, 0)';
                        }
                    }
                    sql3 += ';'
                    db.query(sql3, values2, (err, result) => {
                        if (err) {
                            console.error('Error inserting into driverOrganizations:', err);
                            res.status(500).send('Error inserting into driverOrganizations');
                        } else {
                            res.status(200).send('added driver and driver organizations successfully')
                        }
                    });
                }
            });
        }
    });
});

app.post('/newDriverFromApplication', (req, res) => {
    const {sub, driverAddress} = req.body;
    const values = [sub, driverAddress]
    console.log("address" + driverAddress);
    const sql1 = 'SELECT userID FROM UserInfo WHERE sub = ?'

    db.query(sql1, sub, (err, row) => {
        if(err){
            console.error('Error finding user in user table with sub', err);
            res.status(500).send('Error finding user in user table with sub');
        }
        else{
            const sql2 = 'UPDATE UserInfo SET userType = ? WHERE userID = ?';
            userID = row[0].userID
            console.log("userID: " + userID);
            console.log("address:" + driverAddress);
            db.query(sql2, ['Driver', userID], (err, result) => {
                if (err) {
                    console.error('Error adding user type', err);
                    res.status(500).send('Error adding user type');
                } else {
                    const sql3 = 'INSERT INTO DriverUser (userID, driverAddress) VALUES (?, ?)';
                    db.query(sql3, [userID, driverAddress], (err, result) => {
                        if (err) {
                            console.error('Error adding to driver table', err);
                            res.status(500).send('Error adding to driver table');
                        } else {
                            res.status(200).json({ userID })
                        }
                    });
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
        sql += ', GROUP_CONCAT(s.sponsorOrgName) AS organization_names'
    }
    sql += ' FROM DriverUser d JOIN UserInfo u ON d.userID = u.userID JOIN DriverOrganizations dorg ON dorg.driverID = d.userID';

    if (orgID > 0) {
        sql += ' WHERE dorg.sponsorOrgID = ?'

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
        sql += ' JOIN SponsorOrganization s ON dorg.sponsorOrgID = s.sponsorOrgID GROUP BY d.userID;';

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
    var sql = 'SELECT o.sponsorOrgID, o.sponsorOrgName FROM UserInfo u JOIN DriverOrganizations d ON u.userID = d.driverID JOIN SponsorOrganization o ON d.sponsorOrgID = o.sponsorOrgID  WHERE u.sub = ?';

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

app.post('/addUser', (req, res) => {
    const { sub, email, firstName, lastName, userUsername, userPhoneNumber} = req.body;
    console.log("body" + req.body);
    const sql1 = 'INSERT INTO UserInfo (sub, email, firstName, lastName, userUsername, userPhoneNumber) VALUES (?, ?, ?, ?, ?, ?)';

    const values = [sub, email, firstName, lastName, userUsername, userPhoneNumber];

    db.query(sql1, values, (err, result) => {
        if (err) {
            console.error('Error inserting into user:', err);
            res.status(500).send('Error inserting into user');
        } else {
            res.status(200).send("New user inserted");
        }
    });
});

app.post('/newCognitoExistingDB', (req, res) => {
    const {sub, id, firstName, lastName, userUsername} = req.body;
    const sql = 'UPDATE UserInfo SET sub = ?, firstName = ?, lastName = ?, userUsername = ? WHERE userID = ?'
    const values = [sub, firstName, lastName, userUsername, id]
    console.log(values);
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating user info:', err);
            res.status(500).send('Error updating user info');
        } else {
            res.status(200).send('User updated successfully');
        }
    })
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

app.post('/addUserToSponsorPool', (req, res) => {
    const {userID, sponsorID}  = req.body;
    const sql1 = "UPDATE UserInfo SET userType = 'Sponsor' WHERE userID = ?";
    const sql2 = 'INSERT INTO SponsorUser (userID, sponsorOrgID) VALUES (?, ?)';

    const values = [userID, sponsorID];

    db.query(sql1, [userID], (err, result) => {
        if (err) {
            console.error('Error updating user type', err);
            res.status(500).send('Error updating user type');
        } else {
            db.query(sql2, values, (err, result) => { 
                if (err) {
                    console.error('Error inserting into sponsor:', err);
                    res.status(500).send('Error inserting into sponsor');
                } else {
                    res.status(200).send('sponsor inserted successfully');
                }
            });
        }
    });
});

app.post('/addUserToAdminPool', (req, res) => {
    const userID = req.body.userID;
    const sql1 = "UPDATE UserInfo SET userType = 'Admin' WHERE userID = ?";
    const sql2 = 'INSERT INTO AdminUser (userID) VALUES (?)';

    db.query(sql1, [userID], (err, result) => {
        if (err) {
            console.error('Error updating user type', err);
            res.status(500).send('Error updating user type');
        } else {
            db.query(sql2, [userID], (err, result) => { 
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
    const { id, sponsorOrgIDs } = req.body;

    var values = [];
    var sql = 'INSERT INTO DriverApplication (dateOfApplication, userID, sponsorOrgID) VALUES';
    for(var i = 0; i < sponsorOrgIDs.length; i++){
        values.push(id)
        values.push(sponsorOrgIDs[i])
        if (i === 0){
            sql += ' (CURRENT_DATE, ?, ?)';
        } else{
            sql += ', (CURRENT_DATE, ?, ?)';
        }
    }
    sql += ';'
  
    db.query(sql, values, (err, result) => {
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

app.get('/driverHasOrg', (req, res) => {
    const userID = req.query.userID;
    console.log(userID)

    const sql = 'SELECT * FROM DriverOrganizations WHERE driverID = ?';

    db.query(sql, [userID], (err, result) => {
        if (err) {
            console.error('Error searching for driver application:', err);
            res.status(500).send('Error searching for driver application');
        } else {
            if (result.length > 0) {
                res.status(200).json({ hasOrg: true});
            } else {
                console.log('No org for driver found for userID:', userID);
                res.status(200).json({ hasOrg: false });
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

app.post('/userExistsFromEmail', (req, res) => {
    const email = req.body.email;
    const sql = 'SELECT * FROM UserInfo WHERE email = ?';

    db.query(sql, [email], (err, rows) => {
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

app.post('/loginAudit', (req, res) => {
    const sub = req.body.sub;
    const sql1 = 'INSERT INTO LoginAttempt(userName, loginSuccess) VALUES (\
        (SELECT userUsername FROM UserInfo WHERE sub = ?), ?)';

    const values = [sub, true];
    db.query(sql1, values, (err, result) => {
        if (err) {
            console.error('Error inserting login:', err);
            res.status(500).send('Error inserting login');
        } else {
            res.status(200).send('Login inserted successfully');
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

app.get('/singleDriverApplications', (req, res) => {
    const sub = req.query.sub;
    console.log(sub);
    let sql = "SELECT DA.*, UI.lastName, UI.firstName, SO.sponsorOrgName FROM DriverApplication DA INNER JOIN UserInfo UI ON DA.userID = UI.userID JOIN SponsorOrganization SO ON DA.sponsorOrgID = SO.sponsorOrgID WHERE UI.sub = ?";

    db.query(sql, sub, (err, data) => {
        if (err) {
            return res.json(err);
        } else {
            return res.json(data);
        }
    });
});

app.post('/updateApplicationStatus', (req, res) => {
    const { appID, status, userID, sponsorID, reason } = req.body;
    if (!appID || !status) {
        return res.status(400).json({ error: 'Both appID and status are required parameters' });
    }

    const sql = "UPDATE DriverApplication SET applicationStatus = ?, statusReason = ? WHERE applicationID = ?";
    if(status === 'Accepted'){
        var sql2 = "INSERT INTO DriverOrganizations (driverID, sponsorOrgID, driverOrgPoints) VALUES (?, ?, 0)"
    } else {
        var sql2 = "DELETE FROM DriverOrganizations WHERE driverID = ? AND sponsorOrgID = ?";
    }
    db.query(sql, [status, reason, appID], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update application status' });
        } else {
            db.query(sql2, [userID, sponsorID], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to change drivers organizations' });
                } else {
                    return res.status(200).json({ message: 'Application status updated successfully' });
                }
            })
        }
    })
});

app.get('/removeAdmin', (req, res) => {
    const userID = req.query.userID;
    
    const adminUserSql = "DELETE FROM AdminUser WHERE userID = ?";
    db.query(adminUserSql, userID, (err, adminUserResult) => {
        if (err) {
            return res.json(err);
        } else {
            const userInfoSql = "DELETE FROM UserInfo WHERE userID = ?";
            db.query(userInfoSql, userID, (err, userInfoResult) => {
                if (err) {
                    return res.json(err);
                } else {
                    return res.json({ message: 'User removed from AdminUser and UserInfo tables successfully' });
                }
            });
        }
    });
});

app.get('/removeSponsor', (req, res) => {
    const userID = req.query.userID;
    
    const sponsorUserSql = "DELETE FROM SponsorUser WHERE userID = ?";
    db.query(sponsorUserSql, userID, (err, adminUserResult) => {
        if (err) {
            return res.json(err);
        } else {
            const userInfoSql = "DELETE FROM UserInfo WHERE userID = ?";
            db.query(userInfoSql, userID, (err, userInfoResult) => {
                if (err) {
                    return res.json(err);
                } else {
                    return res.json({ message: 'User removed from SponsorUser and UserInfo tables successfully' });
                }
            });
        }
    });
});

app.get('/removeDriver', (req, res) => {
    const userID = req.query.userID;

    const driverOrgSql = "DELETE FROM DriverOrganizations WHERE driverID = ?";
    db.query(driverOrgSql, userID, (err, driverOrgResult) => {
        if (err) {
            return res.json(err);
        } else {
            const driverUserSql = "DELETE FROM DriverUser WHERE userID = ?";
            db.query(driverUserSql, userID, (err, driverUserResult) => {
                if (err) {
                    return res.json(err);
                } else {
                    const userInfoSql = "DELETE FROM UserInfo WHERE userID = ?";
                    db.query(userInfoSql, userID, (err, userInfoResult) => {
                        if (err) {
                            return res.json(err);
                        } else {
                            return res.json({ message: 'User removed from DriverOrganizations, DriverUser, and UserInfo tables successfully' });
                        }
                    });
                }
            });
        }
    });
});

app.get('/removeDriverFromSponsor', (req, res) => {
    const userID = req.query.userID;
    const sponsorOrgID = req.query.sponsorOrgID;

    const driverOrgSql = "DELETE FROM DriverOrganizations WHERE driverID = ? AND sponsorOrgID = ?";
    db.query(driverOrgSql, [userID, sponsorOrgID], (err, driverOrgResult) => {
        if (err) {
            return res.json(err);
        } else {
            return res.json({ message: 'User removed from DriverOrganizations successfully' });
        }
    });
});

app.get('/badReasons', (req, res) => {
    const sql = "SELECT * FROM Reason WHERE reasonType = 'bad' AND sponsorOrgID = ?"
    db.query(sql, req.query.sponsorOrgID, (err, data) => {
        if(err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})

app.get('/sponsorOrg', (req, res) => {
    const sql = "SELECT * FROM SponsorOrganization WHERE sponsorOrgID = ?";
    db.query(sql, req.query.sponsorOrgID, (err, data) => {
        if(err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})

app.get('/pointChanges', (req, res) => {

    let sql = `
    SELECT 
        pc.changeDate AS 'Date (M/D/Y)',
        CONCAT(ui.firstName, ' ', ui.lastName) AS 'Driver Name',
        so.sponsorOrgName AS 'Sponsor Name',
        pc.sponsorID AS 'Sponsor ID',
        r.reasonString AS 'Point Change Reason',
        pc.changePointAmt AS 'Points Added/Reduced',
        pc.changeCurrPointTotal AS 'Total Points',
        pc.changeType AS 'Change Type'
    FROM 
        PointChange pc
    JOIN 
        DriverUser du ON pc.driverID = du.userID
    JOIN 
        UserInfo ui ON du.userID = ui.userID
    JOIN 
        SponsorOrganization so ON pc.sponsorID = so.sponsorOrgID
    JOIN 
        Reason r ON pc.changeReasonID = r.reasonID;
    `;
    
    const queryParams = [];

    db.query(sql, queryParams, (err, data) => {
        if(err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    });
});


//returns active drivers in DB 
app.get('/activeDrivers', (req, res) => {
    const sql = "SELECT * FROM DriverUser INNER JOIN UserInfo ON DriverUser.userID = UserInfo.userID";
    db.query(sql, (err, data) => {
        if(err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})

//returns active drivers in DB 
app.get('/activeSponsors', (req, res) => {
    const sql = "SELECT * FROM SponsorUser INNER JOIN UserInfo ON SponsorUser.sponsorOrgID = SponsorOrganization.sponsorOrgID";
    db.query(sql, (err, data) => {
        if(err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})

app.post('/updatePointsGood', (req, res) => {
    // Extracting parameters from request body
    const { userID, reasonID, sponsorID, driverPoints, changeType} = req.body;
    // Perform validation on parameters if necessary
    console.log(req.body)
    if (!userID || !reasonID || !driverPoints || !changeType) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    // Convert driverPoints to integer
    const driverPointsInt = parseInt(driverPoints);
    const values = [driverPointsInt, userID]; 

    console.log(driverPointsInt);
    const data = {userID, driverPointsInt, reasonID, changeType, driverPointsInt, sponsorID}
    console.log(data)

    // Check if driverPointsInt is a valid integer
    if (isNaN(driverPointsInt)) {
        return res.status(400).json({ error: "Invalid driverPoints value" });
    }

    const sql1 = 'UPDATE DriverOrganizations SET driverOrgPoints = driverOrgPoints + ? WHERE driverID = ? AND sponsorOrgID = ?;'
    //const values = [driverPointsInt, userID]; 

    const sql2 = `
    INSERT INTO PointChange (driverID, sponsorID, changeDate, changePointAmt, changeReasonID, changeType, changeCurrPointTotal) 
        VALUES (
            (SELECT userID FROM DriverUser WHERE userID = ?), 
            ?,
            NOW(), 
            ?, 
            ?, 
            ?, 
            ((SELECT driverOrgPoints FROM DriverOrganizations WHERE driverID = ? AND sponsorOrgID = ?)+?)
        );
    `;

    db.query(sql2, [userID, sponsorID, driverPointsInt, reasonID, changeType, userID, sponsorID, driverPointsInt], (err, result2) => {
        if (err) {
            console.error('Error updating user:', err);
            res.status(500).json({ error: 'Error updating user' });
        } else {
            db.query(sql1, [driverPointsInt, userID, sponsorID], (err, result1) => {
                if (err) {
                    console.error('Error inserting point change:', err);
                    res.status(500).json({ error: 'Error inserting point change' });
                } else {
                    res.status(200).json("Points updated successfully");
                }
            });
        }
    });
});


app.post('/updatePointsBad', (req, res) => {
    const { userID, reasonID, sponsorID, driverPoints, changeType} = req.body;
    // Perform validation on parameters if necessary
    console.log(req.body)
    if (!userID || !reasonID || !driverPoints || !changeType) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    // Convert driverPoints to integer
    const driverPointsInt = parseInt(driverPoints);
    const values = [driverPointsInt, userID]; 

    console.log(driverPointsInt);
    const data = {userID, driverPointsInt, reasonID, changeType, driverPointsInt, sponsorID}
    console.log(data)

    // Check if driverPointsInt is a valid integer
    if (isNaN(driverPointsInt)) {
        return res.status(400).json({ error: "Invalid driverPoints value" });
    }

    const sql1 = 'UPDATE DriverOrganizations SET driverOrgPoints = driverOrgPoints + ? WHERE driverID = ? AND sponsorOrgID = ?;'
    //const values = [driverPointsInt, userID]; 

    const sql2 = `
    INSERT INTO PointChange (driverID, sponsorID, changeDate, changePointAmt, changeReasonID, changeType, changeCurrPointTotal) 
        VALUES (
            (SELECT userID FROM DriverUser WHERE userID = ?), 
            ?,
            NOW(), 
            ?, 
            ?, 
            ?, 
            ((SELECT driverOrgPoints FROM DriverOrganizations WHERE driverID = ? AND sponsorOrgID = ?)+?)
        );
    `;

    db.query(sql2, [userID, sponsorID, driverPointsInt, reasonID, changeType, userID, sponsorID, driverPointsInt], (err, result2) => {
        if (err) {
            console.error('Error updating user:', err);
            res.status(500).json({ error: 'Error updating user' });
        } else {
            db.query(sql1, [driverPointsInt, userID, sponsorID], (err, result1) => {
                if (err) {
                    console.error('Error inserting point change:', err);
                    res.status(500).json({ error: 'Error inserting point change' });
                } else {
                    res.status(200).json("Points updated successfully");
                }
            });
        }
    });
});

app.get('/driverInfo/:userID', (req, res) => {
    const userID = req.params.userID;
    const sql = "SELECT * FROM DriverUser WHERE userID = ?";
    db.query(sql, [userID], (err, data) => {
        if(err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})

// Get Purchase
// NEED TO UPDATE THIS SO IT ONLY GETS DATA FROM CURRENT USER ID!!
app.get('/getPurchase/:driverID', (req, res) => {
    const driverID = req.params.driverID;
    const sql = "SELECT * FROM Purchase WHERE driverID = ?";
    db.query(sql,[driverID],(err, data) => {
        if (err) {
            console.log("Backend.js: Error getting information from Purchase table in RDS.");
            return res.status(500).json({ error: "Error getting purchases from the database." });
        } else {
            return res.json(data);
        }
    });
});
app.get('/allPurchases', (req, res) => {
    const sql = "SELECT p.purchaseName, p.purchaseStatus, p.purchaseDate, \
    p.purchaseCost, p.purchaseOrderNum, u.userUsername, p.sponsorID, s.sponsorOrgName FROM Purchase p\
    JOIN UserInfo u ON p.driverID = u.userID\
    JOIN SponsorOrganization s ON p.sponsorID = s.sponsorOrgID;"
    db.query(sql, (err, data) => {
        if(err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})

// Get Max OrderNum -> helper RDS call for Driver Cart
app.get('/getMaxOrderNum', (req, res) => {
    const sql = "SELECT MAX(purchaseOrderNum) AS maxPurchaseOrderNum FROM Purchase";
    db.query(sql,(err, data) => {
        if (err) {
            console.log("Backend.js: Error getting MAX from Purchase table in RDS.");
            return res.status(500).json({ error: "Error getting MAX from the database." });
        } else {
            return res.json(data);
        }
    });
});

// Update Purchase
app.post('/updatePurchase', (req, res) => {

    const {driverID, sponsorID, purchaseName, purchaseCost, purchaseOrderNum} = req.body;
    const sql = 'INSERT INTO Purchase (driverID, sponsorID, purchaseName, purchaseDate, purchaseCost, purchaseOrderNum) VALUES (?, ?, ?, CURDATE(), ?, ?);';
    
    console.log(req.body)
    if (!driverID || !purchaseName || !purchaseCost) {
        return res.status(400).json({ error: "Missing parameters" });
    }
    
    // integer conversion
    const ordernumint = parseInt(purchaseOrderNum);
    const values = [driverID, sponsorID, purchaseName, purchaseCost, ordernumint];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting into Purchase', err);
            res.status(500).json({ error: 'Error inserting into Purchase' });
        } else {
            res.status(200).json("Purchase updated successfully");
        }
    });
}); 

// Remove Purchase
app.post('/removePurchase', (req, res) => {

    // Receive an array of purchaseIDs
    const { purchaseIDs } = req.body; 

    // Dynamically generate placeholders for each purchaseID
    const placeholders = purchaseIDs.map(() => '?').join(',');

    const sql = `DELETE FROM Purchase WHERE purchaseID IN (${placeholders})`;
    const values = purchaseIDs;
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error removing purchase:', err);
            res.status(500).send('Error removing purchase');
        } else {
            res.status(200).json("Purchase removed successfully");
        }
    });
});

// Remove Purchase
app.post('/removeItem', (req, res) => {

    // Receive an array of purchaseIDs
    const { purchaseIDs } = req.body; 

    // Dynamically generate placeholders for each purchaseID
    const sql = `DELETE FROM Purchase WHERE purchaseID IN (?)`;
    const values = purchaseIDs;
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error removing purchase:', err);
            res.status(500).send('Error removing purchase');
        } else {
            res.status(200).json("Purchase removed successfully");
        }
    });
});

// Update Password Change
app.post('/updatePasswordChange', (req, res) => {

    const {userID} = req.body;
    const sql = 'INSERT INTO PasswordChange (userID, changeDate) VALUES (?, CURRENT_TIMESTAMP());';
    
    db.query(sql, userID, (err, result) => {
        if (err) {
            console.error('Error inserting into PasswordChange', err);
            res.status(500).json({ error: 'Error inserting into PasswordChange' });
        } else {
            res.status(200).json("PasswordChange updated successfully");
        }
    });
}); 

// Get Password Change 
// CHANGE LATER TO RESTRICT BY sponsorID!
app.get('/getPasswordChange', (req, res) => {
    const sql = "SELECT * FROM PasswordChange;";
    db.query(sql,(err, data) => {
        if (err) {
            console.log("Error getting data from Password Change");
            return res.status(500).json({ error: "Error getting data from Password Change" });
        } else {
            return res.json(data);
        }
    });
});

// Listen on port number listed
app.listen(3000, ()=> {
    console.log("listening")
})