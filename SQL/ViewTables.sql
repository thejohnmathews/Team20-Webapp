-- Team20 "Bezos Bunch" CPSC 4910
-- DriverApp - ViewTables.sql
-- Script that views all tables in database

-- Use Schema
USE DriverApp;

-- Display all tables
SELECT su.*, so.*
FROM SponsorUser su
INNER JOIN SponsorOrganization so ON su.sponsorOrgID = so.sponsorOrgID;SELECT * FROM DriverUser;
SELECT * FROM PointChange;
SELECT * FROM About;
SELECT * FROM Reason;
SELECT * FROM UserInfo;
SELECT * FROM DriverOrganizations;
SELECT * FROM DriverApplication;
SELECT * FROM SponsorUser;
SELECT * FROM AdminUser;
SELECT * FROM PasswordChange;
SELECT * FROM LoginAttempt;
SELECT * FROM Purchase;
SELECT * FROM SponsorOrganization;
SELECT 
        PointChange.*, 
        UserInfo.firstName, 
        UserInfo.lastName, 
        SponsorOrganization.sponsorOrgName,
        DriverUser.driverPoints,
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

