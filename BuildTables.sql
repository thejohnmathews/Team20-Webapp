-- Team20 "Bezos Bunch" CPSC 4910
-- DriverApp - BuildTables.sql
-- Script that views all tables in database

-- Create Schema
CREATE SCHEMA IF NOT EXISTS DriverApp;
USE DriverApp;

-- Create DriverApplication table
CREATE TABLE DriverApplication(

	applicationID			INTEGER PRIMARY KEY,
    dateOfApplication		DATE,
    applicationStatus		VARCHAR(20)			DEFAULT "In-Progress",
    statusReason			VARCHAR(50),
    driverID				INTEGER,
    FOREIGN KEY (driverID) REFERENCES Driver(driverID)
);

-- Create Driver tables
CREATE TABLE Driver(

	driverID				INTEGER,
    driverStartDate			DATE,
    driverEndDate			DATE DEFAULT NULL,
    driverNumTrips			INTEGER,
    driverMilesDriven		INTEGER
);

CREATE TABLE About (
	teamNum INT,
    teamName VARCHAR(20),
    versionNum FLOAT,
    releaseDate DATE,
    productName VARCHAR(50)
);