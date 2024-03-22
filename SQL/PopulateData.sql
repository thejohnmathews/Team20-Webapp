-- Team20 "Bezos Bunch" CPSC 4910
-- DriverApp - DropTables.sql
-- Script that inserts data into tables, where needed

-- Use Schema
USE DriverApp;

-- Begin inserting data
INSERT INTO About
VALUES 
	(20, "Bezo's Bunch", 0.1, "2024-04-30" ,"DriveTrack");
    
INSERT INTO SponsorOrganization (sponsorOrgName, sponsorOrgDescription) VALUES
("Amazon", "This is amazon"),
("Fedex", "Fedex description"),
("Very real sponsor","This is definitly real");
    
INSERT INTO UserInfo (sub, firstName, lastName, email, userUsername, userType) VALUES
('04883448-50d1-7011-f35f-0d5e75242a0e', 'bransen', 'eppes', 'beppes@clemson.edu', 'beppes', 'Driver'), 
('64b894f8-a0f1-7051-73a1-0e297f69d6fb', 'bransen', 'eppes', 'eppes.bransen@gmail.com', 'bransen', 'Admin'),
('c4b80428-d031-70fc-b7c7-bc83de23fa43', 'john', 'mathews', 'thejohnmathews@gmail.com', 'oCyphyr', 'Driver'),
('8448a408-6041-708e-33d8-e527c48e94b4', 'dev', 'user', 'dev@google.com', 'devUser', 'Sponsor');

INSERT INTO DriverUser (UserID, sponsorOrgID) VALUES
(1, 1),
(3, 3);

INSERT INTO AdminUser (UserID) VALUES
(2);

INSERT INTO SponsorUser (UserID, sponsorOrgID) VALUES
(4, 1);

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