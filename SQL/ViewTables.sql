-- Team20 "Bezos Bunch" CPSC 4910
-- DriverApp - ViewTables.sql
-- Script that views all tables in database

-- Use Schema
USE DriverApp;

-- Display all tables
SELECT * FROM DriverUser;
SELECT * FROM PointChange;
SELECT * FROM About;
SELECT * FROM Reason;
SELECT * FROM UserInfo;
-- SELECT * FROM DriverApplication;
SELECT * FROM SponsorUser;
-- SELECT * FROM AdminUser;
-- SELECT * FROM PasswordChange;
-- SELECT * FROM LoginAttempt;
-- SELECT * FROM Purchase;
SELECT * FROM SponsorOrganization;
-- UPDATE DriverUser SET driverPoints = driverPoints + 12 WHERE userID = 1;
-- INSERT INTO PointChange (driverID, changePointAmt, changeReasonID)
-- VALUES(1, 10, 1);
-- 'UPDATE DriverUser SET driverPoints = 2 WHERE userID = 1;'
-- SELECT * FROM DriverUser WHERE userID = 5;
-- SELECT * FROM DriverUser INNER JOIN UserInfo ON DriverUser.userID = UserInfo.userID
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

