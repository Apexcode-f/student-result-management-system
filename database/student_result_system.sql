USE master;
GO

CREATE DATABASE StudentDB;
GO
USE StudentDB;
GO

CREATE TABLE users (
    id INT PRIMARY KEY IDENTITY(1,1),
    username NVARCHAR(50) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    role NVARCHAR(20) NOT NULL
);
GO

CREATE TABLE results (
    id INT PRIMARY KEY IDENTITY(1,1),
    username NVARCHAR(50),
    course NVARCHAR(50),
    score INT,
    grade NVARCHAR(5)
);
GO

ALTER TABLE results ADD teacher NVARCHAR(50) NULL;

USE StudentDB;
SELECT * FROM users;

-- Rename the old table for backup
EXEC sp_rename 'results', 'results_backup';

-- Create the new upgraded table
CREATE TABLE Results (
    ResultID INT IDENTITY(1,1) PRIMARY KEY,
    StudentID INT NOT NULL,
    Subject NVARCHAR(100) NOT NULL,
    Score DECIMAL(5,2) NOT NULL,
    Grade NVARCHAR(5),
    Semester NVARCHAR(50)
);

-- (Optional) Copy relevant old data
INSERT INTO Results (StudentID, Subject, Score, Grade, Semester)
SELECT 
    0 AS StudentID,  -- placeholder since old table used username
    course AS Subject,
    score,
    grade,
    'Semester 1' AS Semester
FROM results_backup;

USE StudentDB;
GO

EXEC sp_rename 'results', 'results_backup';
GO

SELECT * FROM results_backup;

CREATE TABLE Results (
    ResultID INT IDENTITY(1,1) PRIMARY KEY,
    StudentID INT NOT NULL,
    Subject NVARCHAR(100) NOT NULL,
    Score DECIMAL(5,2) NOT NULL,
    Grade NVARCHAR(5),
    Semester NVARCHAR(50)
);
GO

INSERT INTO Results (StudentID, Subject, Score, Grade, Semester)
SELECT 
    u.id AS StudentID, 
    r.course AS Subject, 
    r.score, 
    r.grade, 
    'Semester 1' AS Semester
FROM results_backup r
JOIN users u ON r.username = u.username;

SELECT * FROM Results;
