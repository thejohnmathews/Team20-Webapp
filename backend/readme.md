# steps to initializing backend folder (make sure you are in the backend directory when running these commands!)
## i.e. how to get it set up on your local machine

0. npm init
    as long as you have package.json in the backend folder, you don't need to do this! 
    
1. npm instal express mysql cors nodemon
    this will install all the frameworks we need to interact with react

    - express: framework for nodejs to make working with react easy!
    - mysql: how we can interact with a mysql database
    - cors: "cross-origin resource sharing", so that web apps can interact with other apps
    - nodemon: automatically refreshes server when changes are made

    after doing this, a node_modules package should appear in your directory. this should be the only thing in your .gitignore in this file so far.

2. go to package.json, and make sure the line 
    "start": "nodemon backend.js"
    is present under the scripts object. if it is not, add it!

### with these steps, the backend should be up and running! the next thing is to connect the database!

3. run "npm install dotenv"
    this will allow us to use environment variables so that we are not storing our database information within our actual program

4. create a file named '.env' in your backend folder, and copy paste the text i sent in teams into that file. make sure that .env is also in your .gitignore file (so that we do not upload our .env file to our repo).

### in theory, this should allow us to work with the database! now, to get this working fully together, here are the steps:

5. go into the backend folder and run "npm start". you SHOULD get some nodemon messages, and then a message that says "listening". if you get the "listening" message, that means its working! make sure to keep this terminal open.

6. open a NEW terminal (without closing the old terminal) and open the driver folder. run "npm start" and start the react app. if you go to the about page on the react app, you SHOULD be able to see the info from our database!!!

NOTE 1: release date and product name are empty for now because those are john's tickets, and i want to make sure at least one other person can get this working, so i'm leaving those for john to fill in. if you follow the format of team number and version, you should be able to fill those in relatively easily :D to get the release date and product name specifically, the syntax is:
        `{data.[columnName]}`

NOTE 2: this is PURELY developmental, so like the backend doesnt REALLY exist yet because we have to be running the node/express server from our machine (and that is why we are calling localhost in AboutPage for now). theoretically node.js should work with amplify if we are still going that route, so i can try to get that fully set up probbbbbbably next sprint lol