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
  const query = 'INSERT INTO LoginAttempt (userName) SELECT userUsername FROM UserInfo WHERE sub LIKE CONCAT(?, \'%\')';
  
  // Return promise
  return new Promise((resolve, reject) => {
    
    // Start RDS query
    conn.query(query, sub, (error, results) =>{
      conn.end();
      if (error){
        
        reject(error);
      }
      else{
        
        resolve({
          
          statusCode: 200,
          headers: {
            
            'Access-Control-Allow-Origin': "*",
            'Access-Control-Allow-Credentials': true
          },
          response: JSON.stringify({results}),
        });
        context.done(null, event);
      }
    });
  });
}