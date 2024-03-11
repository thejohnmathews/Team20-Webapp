DELIMITER //

CREATE TRIGGER InsertUserTrigger
AFTER INSERT ON UserInfo
FOR EACH ROW
BEGIN
    DECLARE userType VARCHAR(10);
    DECLARE newUserID INTEGER;

    -- Get the userType and new userID
    SELECT NEW.userType, NEW.userID INTO userType, newUserID;

    -- Insert into the appropriate user table based on userType
    IF userType = 'Driver' THEN
        INSERT INTO DriverUser (userID) VALUES (newUserID);
    ELSEIF userType = 'Sponsor' THEN
        INSERT INTO SponsorUser (userID) VALUES (newUserID);
    ELSEIF userType = 'Admin' THEN
        INSERT INTO AdminUser (userID) VALUES (newUserID);
    END IF;
END;
//

DELIMITER ;
