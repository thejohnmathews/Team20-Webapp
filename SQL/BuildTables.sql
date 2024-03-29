-- Team20 "Bezos Bunch" CPSC 4910
-- DriverApp - BuildTables.sql
-- Script that views all tables in database

-- Create Schema
CREATE SCHEMA IF NOT EXISTS DriverApp;
USE DriverApp;

-- Create User(Info) table
CREATE TABLE UserInfo(
    userID                  INTEGER                     PRIMARY KEY AUTO_INCREMENT,
    sub                     VARCHAR(255)                UNIQUE,
    firstName               VARCHAR(30),
    lastName                VARCHAR(50),
    email                   VARCHAR(75),
    userUsername            VARCHAR(50),
    userType                VARCHAR(10)
);

-- Create SponsorOrganization table
CREATE TABLE SponsorOrganization(
	
    sponsorOrgID			INTEGER						AUTO_INCREMENT PRIMARY KEY,
    sponsorOrgName			VARCHAR(75),
    sponsorOrgDescription   VARCHAR(500)
);

-- Create Driver(User) table
CREATE TABLE DriverUser(
	
    userID					INTEGER						PRIMARY KEY,
    driverStartDate			DATE,
    driverEndDate			DATE DEFAULT NULL,
    driverNumTrips			INTEGER,
    driverMilesDriven		INTEGER,
    driverPoints 			INTEGER, 
    sponsorOrgID			INTEGER,
    FOREIGN KEY (userID) REFERENCES UserInfo(userID)
);

-- Create DriverApplication table
CREATE TABLE DriverApplication(

	applicationID			INTEGER 					AUTO_INCREMENT PRIMARY KEY,
    dateOfApplication		DATE,
    applicationStatus		VARCHAR(20)					DEFAULT "Submitted",
    statusReason			VARCHAR(50)					DEFAULT "Under Review",
    userID					INTEGER,
    sponsorOrgID			INTEGER,
    FOREIGN KEY (userID) REFERENCES DriverUser(userID),
    FOREIGN KEY (sponsorOrgID) REFERENCES SponsorOrganization(sponsorOrgID)
);

-- Create Sponsor(User) table
CREATE TABLE SponsorUser(

	userID 					INTEGER 					PRIMARY KEY,
    sponsorOrgID			INTEGER,
    FOREIGN KEY (userID) REFERENCES UserInfo(userID)
);

-- Create Admin(User) table
CREATE TABLE AdminUser(
	
    userID					INTEGER						PRIMARY KEY,
    FOREIGN KEY (userID) REFERENCES UserInfo(userID)
);

-- Create Purchase table
CREATE TABLE Purchase(

	purchaseID				INTEGER						AUTO_INCREMENT PRIMARY KEY,
    purchaseDate			DATE,
    purchaseCost			NUMERIC(5,2),
    driverID				INTEGER,
    FOREIGN KEY (driverID) REFERENCES DriverUser(userID)
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
    changeDate DATE,
	changePointAmt INT,
    changeReasonID INT,
    FOREIGN KEY (driverID) REFERENCES DriverUser(userID),
    FOREIGN KEY (changeReasonID) REFERENCES Reason(reasonID),
    FOREIGN KEY (sponsorID) REFERENCES SponsorUser(userID)
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
    userName VARCHAR(40),
    loginAttemptDate DATE DEFAULT CURRENT_TIMESTAMP,
    loginSuccess BOOLEAN
);