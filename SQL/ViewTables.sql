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