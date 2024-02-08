-- Team20 "Bezos Bunch" CPSC 4910
-- DriverApp - BuildTables.sql
-- Script that views all tables in database

-- Create Schema
CREATE SCHEMA IF NOT EXISTS DriverApp;
USE DriverApp;

-- Create User(Info) Tablw
CREATE TABLE UserInfo(

	userID 					INTEGER						PRIMARY KEY,
    firstName				VARCHAR(30),
    lastName				VARCHAR(50),
    email 					VARCHAR(75),
    userUsername			VARCHAR(50),
    userPassword			VARCHAR(50),
    userType				VARCHAR(10)
);

-- Create DriverApplication table
CREATE TABLE DriverApplication(

	applicationID			INTEGER 					AUTO_INCREMENT PRIMARY KEY,
    dateOfApplication		DATE,
    applicationStatus		VARCHAR(20)					DEFAULT "In-Progress",
    statusReason			VARCHAR(50),
    driverID				INTEGER,
    FOREIGN KEY (driverID) REFERENCES Driver(driverID)
);

-- Create Sponsor Table
CREATE TABLE Sponsor(

	sponsorID 				INTEGER 					AUTO_INCREMENT PRIMARY KEY,
    sponsorOrgID			INTEGER
);

-- Create Driver tables
CREATE TABLE Driver(

	driverID				INTEGER						AUTO_INCREMENT PRIMARY KEY,
    driverStartDate			DATE,
    driverEndDate			DATE DEFAULT NULL,
    driverNumTrips			INTEGER,
    driverMilesDriven		INTEGER
);

-- Create About table
CREATE TABLE About (
	teamNum INT,
    teamName VARCHAR(20),
    versionNum FLOAT,
    releaseDate DATE,
    productName VARCHAR(50)
);

-- Create Reason Table
CREATE TABLE Reason (
	reasonID INT PRIMARY KEY AUTO_INCREMENT,
    reasonString VARCHAR(200)
);

-- Create PointChange table (related to reason, driver, and sponsor)
CREATE TABLE PointChange(
	driverID INT,
    sponsorID INT,
    changeDate DATE DEFAULT CURRENT_TIMESTAMP,
	changePointAmt INT,
    changeReasonID INT,
    FOREIGN KEY (driverID) REFERENCES Driver(driverID),
    FOREIGN KEY (changeReasonID) REFERENCES Reason(reasonID),
    FOREIGN KEY (sponsorID) REFERENCES Sponsor(sponsorID)
);

-- Create Password Change table
CREATE TABLE PasswordChange(
    passwordChangeID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    FOREIGN KEY (userID) REFERENCES UserInfo(userID),
    changeDate DATE,
    oldPassword VARCHAR(200),
    newPassword VARCHAR(200)
);

-- Create Login Attempt table
CREATE TABLE LoginAttempt(
    loginAttemptID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    FOREIGN KEY (userID) REFERENCES UserInfo(userID),
    loginAttemptDate DATE,
    loginSuccess BOOLEAN
);