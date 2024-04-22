// team20-PreAuth 
// Inserts an entry into LoginAttempt

// import statements
const mysql = require('mysql');

// global variables
const db = {
  
  host:'team20-rds-server.cobd8enwsupz.us-east-1.rds.amazonaws.com',
  user:'admin',
  password:'clemsoncampusispretty1!',
  database:'DriverApp'
};

exports.handler = async (event, context) => {
  
  // local constant variables
  const conn = mysql.createConnection(db);
  const {sub} = event.request.userAttributes;
  const query = 'INSERT INTO LoginSuccess (userName) SELECT userUsername FROM UserInfo WHERE sub LIKE CONCAT(?, \'%\')';
  const updateQuery = `
UPDATE LoginAttempt AS la
JOIN (
    SELECT userName, MAX(loginAttemptID) AS maxAttemptID
    FROM LoginAttempt
    GROUP BY userName
) AS maxAttempts ON la.userName = maxAttempts.userName AND la.loginAttemptID = maxAttempts.maxAttemptID
JOIN LoginSuccess AS ls ON la.userName = ls.userName
SET la.success = TRUE
WHERE la.success = FALSE
AND ls.loginAttemptDate >= DATE_SUB(la.loginAttemptDate, INTERVAL 3 SECOND);

`;
  
  // Return promise
  return new Promise((resolve, reject) => {
    
    // First RDS query
    conn.query(query, sub, (error1, results1) => {
      if (error1) {
        conn.end();
        reject(error1);
      } else {
        
        // Second RDS query
        conn.query(updateQuery, sub, (error2, results2) => {
          conn.end();
          if (error2) {
            reject(error2);
          } else {
            resolve({
              statusCode: 200,
              headers: {
                'Access-Control-Allow-Origin': "*",
                'Access-Control-Allow-Credentials': true
              },
              response: JSON.stringify({ results1, results2 }),
            });
            context.done(null, event);
          }
        });
      }
    });
  });
}