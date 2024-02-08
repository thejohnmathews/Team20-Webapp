-- Team20 "Bezos Bunch" CPSC 4910
-- DriverApp - DropTables.sql
-- Script that drops all tables in database

-- Use Schema
USE DriverApp;

-- Drop all tables
DROP TABLE IF EXISTS Driver;
DROP TABLE IF EXISTS PointChange;
DROP TABLE IF EXISTS About;
DROP TABLE IF EXISTS Reason;


DROP SCHEMA IF EXISTS DriverApp;