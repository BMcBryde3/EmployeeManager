import inquirer from "inquirer";
import {pool , connectToDb} from './connection.js';


pool.connect();
connectToDb();

async function promptUser() {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all employees',
                'Add employee',
                'Update employee role',
                'View all roles',
                'Add role',
                'View all departments',
                'Add department',
                'Quit'
            ]
        }
    ]);

    switch (answers.action) {
        case 'View all employees':
            const query = `SELECT * FROM employee`;
            const { rows } = await pool.query(query);
            console.table(rows);
            break;

        case 'Add employee':
            const employeeAnswers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'Enter employee first name:'
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'Enter employee last name:'
                },
                {
                    type: 'input',
                    name: 'roleId',
                    message: 'Enter employee role ID:'
                },
                {
                    type: 'input',
                    name: 'managerId',
                    message: 'Enter employee manager ID:'
                }
            ]);
            const addEmployeeQuery = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`;
            await pool.query(addEmployeeQuery, [employeeAnswers.firstName, employeeAnswers.lastName, employeeAnswers.roleId, employeeAnswers.managerId]);
            console.log(`Added ${employeeAnswers.firstName} ${employeeAnswers.lastName} to employees.`);
            break;

        case 'Update employee role':
            const updateRoleAnswers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'employeeId',
                    message: 'Enter employee ID:'
                },
                {
                    type: 'input',
                    name: 'roleId',
                    message: 'Enter new role ID:'
                }
            ]);
            const updateRoleQuery = `UPDATE employee SET role_id = $1 WHERE id = $2`;
            await pool.query(updateRoleQuery, [updateRoleAnswers.roleId, updateRoleAnswers.employeeId]);
            console.log(`Updated employee role.`);
            break;

        case 'View all roles':
            const rolesQuery = `SELECT * FROM role`;
            const { rows: roles } = await pool.query(rolesQuery);
            console.table(roles);
            break;

        case 'Add role':
            const roleAnswers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'Enter role title:'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Enter role salary:'
                },
                {
                    type: 'input',
                    name: 'departmentId',
                    message: 'Enter department ID:'
                }
            ]);
            const addRoleQuery = `INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)`;
            await pool.query(addRoleQuery, [roleAnswers.title, roleAnswers.salary, roleAnswers.departmentId]);
            console.log(`Added ${roleAnswers.title} to roles.`);
            break;

        case 'View all departments':
            const departmentsQuery = `SELECT * FROM department`;
            const { rows: departments } = await pool.query(departmentsQuery);
            console.table(departments);
            break;

        case 'Add department':
            const departmentAnswers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Enter department name:'
                }
            ]);
            const addDepartmentQuery = `INSERT INTO department (name) VALUES ($1)`;
            await pool.query(addDepartmentQuery, [departmentAnswers.name]);
            console.log(`Added ${departmentAnswers.name} to departments.`);
            break;

        case 'Quit':
            process.exit(0);
            break;
    }

    // Return to the main menu after each action
    promptUser();
}

// Start the prompt loop
promptUser();

