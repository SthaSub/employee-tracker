DROP DATABASE IF EXISTS `employee_tracker`;

CREATE DATABASE `employee_tracker`;

USE `employee_tracker`;

CREATE TABLE `department` (
	`name` varchar(30) NOT NULL,
	`id` int NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (`id`)
);

CREATE TABLE `employee` (
	`id` int NOT NULL AUTO_INCREMENT,
	`first_name` varchar(30) NOT NULL,
	`last_name` varchar(30) NOT NULL,
	`role_id` int NOT NULL,
	`manager_id` int,
	PRIMARY KEY (`id`),
    FOREIGN KEY (`role_id`) REFERENCES `role`(`id`),
    FOREIGN KEY (`manager_id`) REFERENCES `employee`(`id`)
);

CREATE TABLE `role` (
	`title` varchar(30) NOT NULL,
	`salary` DECIMAL NOT NULL,
	`department_id` int NOT NULL,
	`id` int NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (`id`),
    FOREIGN KEY (`department_id`) REFERENCES `department`(`id`)
);