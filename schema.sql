DROP DATABASE IF EXISTS `employee_tracker`;

CREATE DATABASE `employee_tracker`;

USE `employee_tracker`;

CREATE TABLE `department` (
	`name` VARCHAR(30) NOT NULL,
	`id` INT NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (`id`)
);

CREATE TABLE `role` (
	`title` VARCHAR(30) NOT NULL,
	`salary` DECIMAL NOT NULL,
	`department_id` int NOT NULL,
	`id` int NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (`id`),
    FOREIGN KEY (`department_id`) REFERENCES `department`(`id`)
);

CREATE TABLE `employee` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`first_name` VARCHAR(30) NOT NULL,
	`last_name` VARCHAR(30) NOT NULL,
	`role_id` INT NOT NULL,
	`manager_id` INT NULL,
	PRIMARY KEY (`id`),
    FOREIGN KEY (`role_id`) REFERENCES `role`(`id`),
    FOREIGN KEY (`manager_id`) REFERENCES `employee`(`id`)
);