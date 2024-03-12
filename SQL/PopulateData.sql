-- Team20 "Bezos Bunch" CPSC 4910
-- DriverApp - DropTables.sql
-- Script that inserts data into tables, where needed

-- Use Schema
USE DriverApp;

-- Begin inserting data
INSERT INTO About
VALUES 
	(20, "Bezo's Bunch", 0.1, "2024-04-30" ,"DriveTrack");
    
INSERT INTO UserInfo (sub, firstName, lastName, email, userUsername, userType) VALUES
('04883448-50d1-7011-f35f-0d5e75242a0e', 'bransen', 'eppes', 'beppes@clemson.edu', 'beppes', 'Driver'), 
('64b894f8-a0f1-7051-73a1-0e297f69d6fb', 'bransen', 'eppes', 'eppes.bransen@gmail.com', 'bransen', 'Admin');

INSERT INTO Reason(reasonString) VALUES
("Wearing a seatbelt."),
("Following the speed limit."),
("Following school/work zone speed limits."),
("Arrived with all items in good condition."),
("Stopping for trains at railroad crossings."),
("Texting and driving."),
("Speeding."),
("Getting into a wreck."),
("Running a red light/stop sign."),
("Impaired driving."),
("Off-roading.");