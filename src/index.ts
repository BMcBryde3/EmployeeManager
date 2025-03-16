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
            const rolesSelections = await pool.query('SELECT id, title FROM role');
            const managersSelections = await pool.query('SELECT id, first_name, last_name FROM employee');

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
                    type: 'list',
                    name: 'roleId',
                    message: 'Select employee role:',
                    choices: rolesSelections.rows.map(role => ({ name: role.title, value: role.id }))
                },
                {
                    type: 'list',
                    name: 'managerId',
                    message: 'Select employee manager:',
                    choices: managersSelections.rows.map(manager => ({ name: `${manager.first_name} ${manager.last_name}`, value: manager.id }))
                }
            ]);
            const addEmployeeQuery = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`;
            await pool.query(addEmployeeQuery, [employeeAnswers.firstName, employeeAnswers.lastName, employeeAnswers.roleId, employeeAnswers.managerId]);
            console.log(`Added ${employeeAnswers.firstName} ${employeeAnswers.lastName} to employees.`);
            break;

        case 'Update employee role':
            const employees = await pool.query('SELECT id, first_name, last_name FROM employee');
            const rolesId = await pool.query('SELECT id, title FROM role');

            const updateRoleAnswers = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'employeeId',
                    message: 'Select employee:',
                    choices: employees.rows.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }))
                },
                {
                    type: 'list',
                    name: 'roleId',
                    message: 'Select new role:',
                    choices: rolesId.rows.map(role => ({ name: role.title, value: role.id }))
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
            const departmentsSelections = await pool.query('SELECT id, name FROM department');
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
                    type: 'list',
                    name: 'departmentId',
                    message: 'Select department:',
                    choices: departmentsSelections.rows.map(department => ({ name: department.name, value: department.id }))
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

