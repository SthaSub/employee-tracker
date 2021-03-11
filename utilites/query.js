module.exports =  queries = {
    viewAllEMployee: `SELECT e.id,CONCAT(e.first_name,' ',e.last_name) AS name, r.title, r.salary, d.name AS department, CONCAT(m.first_name,' ',m.last_name) AS manager FROM employee e 
                     LEFT JOIN employee m ON e.manager_id = m.id 
                     INNER JOIN role r ON e.role_id = r.id 
                     INNER JOIN department d ON r.department_id = d.id`,
    viewallEmployeesbyDepartment: `SELECT e.id, e.first_name, e.last_name, r.title 
                                   FROM employee e LEFT JOIN role r ON e.role_id = r.id 
                                   INNER JOIN department d ON d.id = r.department_id WHERE d.name = ?`,
    viewallEmployeesbyManager: `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager
                                FROM employee e
                                LEFT JOIN employee m ON e.manager_id = m.id
                                INNER JOIN role ON e.role_id = role.id
                                INNER JOIN department ON role.department_id = department.id
                                WHERE e.manager_id = ?`,
    listOfManagers: `SELECT DISTINCT m.id, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e 
                    INNER JOIN employee m ON e.manager_id = m.id`,
    viewallDepartments: `SELECT * FROM department`,
    viewallRole: `SELECT id,title,salary 'salary($)' FROM role`,
    addDepartment: `INSERT INTO department (name) VALUES (?)`,
    addRole: `INSERT INTO role (title,salary,department_id) VALUES (?,?,?)`,
    addEmployee: `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`,
    getDepartmentId: `SELECT id FROM department WHERE name = ?`,
    getRoleId: `SELECT id, title FROM role WHERE department_id = ?`,
    getRoles:`SELECT id, title FROM role`,
    getmanagers: `SELECT id, CONCAT(first_name,' ',last_name) AS manager FROM employee WHERE manager_id IS NULL`,
    getNonManagerEmployee: `SELECT id, CONCAT(first_name,' ',last_name) AS employee FROM employee WHERE manager_id IS NOT NULL`,
    getAllEmployee: `SELECT id, CONCAT(first_name,' ',last_name) AS employee FROM employee`,
    updateEmployeeManager: `UPDATE employee SET manager_id = ? WHERE id = ?`,
    updateEmployeeRole:`UPDATE employee SET role_id = ? WHERE id = ?`,
    deleteEmployee:`DELETE FROM employee WHERE id = ?`
}
