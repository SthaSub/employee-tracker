
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


module.exports = class Controller{
    constructor() {
        this.welcome();
        this.connection = new Database();
    }
    welcome() {
        inquirer.prompt(question)
            .then((res) => {
                switch (res.selection) {
                    case "View all Employees":
                        this.viewAllEMployee();
                        break;
                    case "View all Employees by Department":
                        this.viewallEmployeesbyDepartment();
                        break;
                    case "View all Departments":
                        this.viewallDepartments();
                        break;
                    case "View all Employees by Manager":
                        this.viewallEmployeesbyManager();
                        break;
                    case "View all Roles":
                        this.viewallRole();
                        break;
                    case "Add Employee":
                        this.addEmployee();
                        break;
                    case "Add Department":
                        this.addDepartment();
                        break;
                    case "Add Role":
                        this.addRole();
                        break;
                    case "Update Employee Role":
                        this.updateEmployeeRole();
                        break;
                    case "Remove Employee":
                        this.removeEmployee();
                        break;
                    case "Update Employee Manager":
                        this.updateEmployeeManager();
                        break;
                    default:
                        this.exit();
                        break;
                }
            });

    }

    addRole() {
        let departments = new Array();
        this.connection.dbQuery(queries.viewallDepartments)
            .then((res) => {
                res.forEach(element => {
                    departments.push(element.name);
                });
                inquirer.prompt([
                    {
                        name: "departmentName",
                        type: "list",
                        message: "Enter department Name",
                        choices: departments
                    }, {
                        name: "roleName",
                        type: "input",
                        message: "Enter your role name."
                    }, {
                        name: "salary",
                        type: "input",
                        message: "Enter role salary"
                    }])
                    .then((answer) => {
                        this.connection.dbQuery(queries.getDepartmentId, answer.departmentName)
                            .then((res) => {
                                this.executeTheQuery(queries.addRole, [answer.roleName, answer.salary, res[0].id], "insert");
                            });
                    });
            })

    }

    addDepartment() {
        inquirer.prompt(departmentQues)
            .then((answer) => {
                this.executeTheQuery(queries.addDepartment, answer.department, "insert");
            });
    }
}