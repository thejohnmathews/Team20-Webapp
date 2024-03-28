-- Team20 "Bezos Bunch" CPSC 4910
-- DriverApp - DropTables.sql
-- Script that drops all tables in database

-- Use Schema
USE DriverApp;

-- Drop all tables
DROP TABLE IF EXISTS DriverApplication;
DROP TABLE IF EXISTS DriverOrganizations;
DROP TABLE IF EXISTS PointChange;
DROP TABLE IF EXISTS Purchase;
DROP TABLE IF EXISTS DriverUser;
DROP TABLE IF EXISTS About;
DROP TABLE IF EXISTS Reason;
DROP TABLE IF EXISTS SponsorUser;
DROP TABLE IF EXISTS AdminUser;
DROP TABLE IF EXISTS PasswordChange;
DROP TABLE IF EXISTS LoginAttempt;
DROP TABLE IF EXISTS UserInfo;
DROP TABLE IF EXISTS CatalogRules;
DROP TABLE IF EXISTS SponsorOrganization;

-- Drop Schema
DROP SCHEMA IF EXISTS DriverApp;