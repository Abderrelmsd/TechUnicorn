CREATE DATABASE TechUnicorn;
USE TechUnicorn;
#Creating the tables
CREATE TABLE Users(
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_type ENUM ('admin','doctor','patient') NOT NULL,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    pass VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender ENUM ('male', 'female') NOT NULL
);

CREATE TABLE Sessions(
    id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT NOT NULL,
    patient_id INT NOT NULL,
    session_start DATETIME NOT NULL,
    session_end DATETIME NOT NULL,
    status ENUM ('completed','delayed','in-session','cancelled') NOT NULL
);

CREATE TABLE Authentication (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(255) not NULL,
    user_type ENUM ('admin','doctor','patient') NOT NULL,
    access_token VARCHAR(255) not NULL,
    refresh_token VARCHAR(255) NOT NULL
);

CREATE USER 'techUnicorn'@'%' IDENTIFIED WITH mysql_native_password BY 'TechUnicorn';

GRANT ALL PRIVILEGES ON TechUnicorn.* to 'techUnicorn'@'%';

FLUSH PRIVILEGES;