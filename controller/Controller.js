
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

    addEmployee() {
        let departmentOption = new Array();
        this.connection.dbQuery(queries.viewallDepartments)
            .then((result) => {
                result.forEach(element => {
                    departmentOption.push(element.name);
                });
                inquirer.prompt([{
                    name: "department",
                    type: "list",
                    message: "choose department",
                    choices: departmentOption
                }])
                    .then((answer) => {
                        this.connection.dbQuery(queries.getDepartmentId, answer.department)
                            .then((result) => {
                                this.getEmployeeRoles(result);
                            });
                    })
            });
    }

    getEmployeeRoles(result) {
        let employeeRoles = new Array();
        this.connection.dbQuery(queries.getRoleId, result[0].id)
            .then((roles) => {
                roles.forEach(element => {
                    employeeRoles.push(element.id + " - " + element.title);
                });
                inquirer.prompt([{
                    name: "roles",
                    type: "list",
                    message: "select role for employee",
                    choices: employeeRoles
                }])
                    .then((answer) => {
                        let roleId = answer.roles.split(" - ")[0];
                        this.getManagers(roleId);
                    });
            });
    }

    getManagers(roleId) {
        this.connection.dbQuery(queries.getmanagers)
            .then((result) => {
                let managers = new Array();
                result.forEach(element => {
                    managers.push(element.id + " - " + element.manager);
                });
                managers.push("None");
                inquirer.prompt([{
                    name: "manager",
                    type: "list",
                    message: "select manager",
                    choices: managers
                }])
                    .then((answer) => {
                        let managerId = answer.manager == "None"? null:answer.manager.split(" - ")[0];
                        console.log(managerId);
                        this.saveEmployee(roleId, managerId);
                    })
            });
    }

    saveEmployee(roleId, managerId) {
        inquirer.prompt([{
            name: "firstName",
            message: "Enter your first name",
            type: "input"
        },
        {
            name: "lastName",
            message: "Enter your last name",
            type: "input"
        }])
            .then((answers) => {
                this.executeTheQuery(queries.addEmployee, [answers.firstName, answers.lastName, roleId, managerId], "insert");
            })
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


    updateEmployeeRole() {
        this.updateOperation("role");
    }

    updateOperation(operationType) {
        let employees = new Array();
        let query = (operationType == "manager") ? queries.getNonManagerEmployee : queries.getAllEmployee;
        this.connection.dbQuery(query)
            .then((result) => {
                result.forEach(element => {
                    employees.push(element.id + " - " + element.employee);
                });
                if (operationType == "manager") this.getEmployees(employees);
                else this.getRoles(employees);
            });
    }

    getRoles(employees) {
        inquirer.prompt({
            name: "employee",
            message: "Which employee's role you want to update?",
            type: "list",
            choices: employees
        }).then((answer) => {
            let staff = answer.employee.split(" - ")[0];
            let roles = new Array();
            this.connection.dbQuery(queries.getRoles)
                .then((result) => {
                    result.forEach(element => {
                        roles.push(element.id + " - " + element.title);
                    });
                    this.updateRole(staff,roles);
                });
        });

    }

    updateEmployeeManager() {
        this.updateOperation("manager");
    }

    updateRole(staffId, roles){
        inquirer.prompt([{
            name: "role",
            message: "Which role you want to assign?",
            type: "list",
            choices: roles
        }])
            .then((answer) => {
                let role_id = answer.role.split(" - ")[0];
                this.executeTheQuery(queries.updateEmployeeRole,[role_id, staffId],"update");
            });
    }

    getEmployees(employees) {
        inquirer.prompt({
            name: "employee",
            message: "Which employee's manager you want to update?",
            type: "list",
            choices: employees
        })
            .then(answer => {
                let staffId = answer.employee.split(" - ")[0];
                let managers = new Array();
                this.connection.dbQuery(queries.getmanagers)
                    .then((result) => {
                        result.forEach(element => {
                            managers.push(element.id + " - " + element.manager);
                        });
                        this.getStaffAsManager(staffId, managers);
                    });
            })
    }

    getStaffAsManager(staffId, managers) {
        inquirer.prompt([{
            name: "manager",
            type: "list",
            message: "Which manager you want to assign?",
            choices: managers
        }])
            .then((answer) => {
                let empManagerId = answer.manager.split(" - ")[0];
                this.executeTheQuery(queries.updateEmployeeManager, [empManagerId, staffId], "update");
            })
    }


  /**
   *  */
viewallDepartments() {
    this.executeTheQuery(queries.viewallDepartments);
}

viewallRole() {
    this.executeTheQuery(queries.viewallRole);
}

viewallEmployeesbyDepartment() {
    let departments = new Array();
    this.connection.dbQuery(queries.viewallDepartments)
    .then((result)=>{
        console.log(result);
        result.forEach(element=>{
            departments.push(element.name);
        });
        this.showEmployeeDepartment(departments);
    });
}

showEmployeeDepartment(departments){
    inquirer.prompt([{
        name:"department",
        type:"list",
        message:"Which department's employee you want to view?",
        choices:departments
    }])
    .then((answer)=>{
        this.executeTheQuery(queries.viewallEmployeesbyDepartment, answer.department);
    });
}

viewAllEMployee() {
    this.executeTheQuery(queries.viewAllEMployee);
}

viewallEmployeesbyManager() {
    let managers = new Array();
    this.connection.dbQuery(queries.listOfManagers).then((result) => {
        result.forEach(element => {
            managers.push(element.manager);
        });
        return result;
    }).then((managerResult) => {
        this.managerSelction(managers, managerResult);
    });

}

managerSelction(list, managerResult) {
    inquirer.prompt([{
        name: "role",
        type: "list",
        message: "Which manager's employees you want to view?",
        choices: list
    }]).then((select) => {
        let queryID;
        managerResult.forEach((res) => {
            if (select.role == res.manager) {
                queryID = res.id;
            }
        });
        return queryID;
    }
    ).then((id) => {
        this.executeTheQuery(queries.viewallEmployeesbyManager, id);
    });
}

async exit() {
    await this.connection.dbClose();
}

async executeTheQuery(query) {
    this.executeTheQuery(query, []);
}

async executeTheQuery(query, parameter) {
    this.executeTheQuery(query, parameter, "None");
}

async executeTheQuery(query, parameter, queryType) {
    try {
        let result;
        result = await this.connection.dbQuery(query, parameter);
        if (queryType == "insert" || queryType == "update" || queryType == "delete")
            console.log("OK!");
        else
            console.table(result);
        this.welcome();
    } catch (error) {
        console.log(error);
    }
}

}