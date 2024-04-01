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
('64b894f8-a0f1-7051-73a1-0e297f69d6fb', 'bransen', 'eppes', 'eppes.bransen@gmail.com', 'bransen', 'Admin'),
('c4b80428-d031-70fc-b7c7-bc83de23fa43', 'john', 'mathews', 'thejohnmathews@gmail.com', 'oCyphyr', 'Driver'),
('8418e448-00a1-70b9-ccfc-623a11e30df1', 'Liam', 'Gallagher', 'lmgalla@clemson.edu', 'lmgalla', 'Driver'),
('14183418-50a1-7058-baf0-e573db9f5b4a', 'Dev', 'Driver', 'driver@google.com', 'DevDriver', 'Driver'),
('54e81448-e0b1-704d-cb13-a76282121e1a', 'Sam', 'Sellers', 'sponsor@google.com', 'Sponsor_Username', 'Sponsor'),
('64d80438-f041-70e4-b2f2-83f501d83606', 'Adam', 'Anderson', 'admin@google.com', 'Admin_Username', 'Admin'),
('14083448-d061-708b-78c4-200c38880108', 'emma', 'scalabrino', 'emsca2002@gmail.com', 'emkand3','440-759-3656', 'Driver');

INSERT INTO DriverUser (UserID, driverPoints) VALUES
(2, 10),
(3, 100),
(4, 100);

INSERT INTO DriverOrganizations (driverID, sponsorOrgID) VALUES
	(3, 1),
    (2, 1),
    (2, 2),
    (2, 3),
    (4, 1),
    (4, 2),
    (4, 3);

-- INSERT INTO DriverApplication (userID, sponsorOrgID) VALUES 
-- (1, 1),
-- (3, 3);

INSERT INTO AdminUser (UserID) VALUES
(1),
(6);

INSERT INTO SponsorUser (UserID, sponsorOrgID) VALUES
(5, 1);

INSERT INTO Reason(reasonString, reasonType, sponsorOrgID) VALUES
("Wearing a seatbelt.", "good", 1),
("Following the speed limit.", "good", 1),
("Following school/work zone speed limits.", "good", 1),
("Arrived with all items in good condition.", "good", 2),
("Stopping for trains at railroad crossings.", "good", 2),
("Texting and driving.", "bad", 1),
("Speeding.", "bad", 1),
("Getting into a wreck.", "bad", 1),
("Running a red light/stop sign.", "bad", 2),
("Impaired driving.", "bad", 2),
("Off-roading.", "bad", 2);

INSERT INTO Reason(reasonString, reasonType, sponsorOrgID) VALUES
("Wearing a seatbelt.", "good", 1),
("Following the speed limit.", "good", 1),
("Following school/work zone speed limits.", "good", 1),
("Arrived with all items in good condition.", "good", 2),
("Stopping for trains at railroad crossings.", "good", 2),
("Texting and driving.", "bad", 1),
("Speeding.", "bad", 1),
("Getting into a wreck.", "bad", 1),
("Running a red light/stop sign.", "bad", 2),
("Impaired driving.", "bad", 2),
("Off-roading.", "bad", 2);

INSERT INTO PointChange(driverID, changeDate, changePointAmt, changeReasonID) VALUES
(2, '2024-03-25', 100, 1);