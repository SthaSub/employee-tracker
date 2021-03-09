
const inquirer = require("inquirer");
require("console.table"); // console.table for SQL
const Database = require("../database/DatabaseConnection");
const queries = require("../utilites/query");

const question = [{
    type: "list",
    name: "selection",
    message: "Please select the option as like",
    choices: [
        "View all Employees",
        "View all Employees by Department",
        "View all Employees by Manager",
        "View all Departments",
        "View all Roles",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Update Employee Role",
        "Update Employee Manager",
        "Remove Employee",
        "Exit"
    ]
}];

const departmentQues = [{
    name: "department",
    type: "input",
    message: "Enter your department name."
}];

const employeeQues = [{
    name: "firstName",
    type: "input",
    message: "Enter your first name"
},
{
    name: "firstName",
    type: "input",
    message: "Enter your first name"
}];


