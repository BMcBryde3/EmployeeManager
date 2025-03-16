import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool();

pool.connect()
    .then(() => console.log('Connected to the database.'))
    .catch(err => {
        console.error('Error connecting to database:', err);
        process.exit(1);
    });

const viewRoles = async () => {
    const query = `SELECT * FROM role`;
    const { rows } = await pool.query(query);
    console.table(rows);
}

const viewDepartments = async () => {
    const query = `SELECT * FROM department`;
    const { rows } = await pool.query(query);
    console.table(rows);
};

const viewEmployees = async () => {
    const query = `SELECT * FROM employee`;
    const { rows } = await pool.query(query);
    console.table(rows);
}

const addNewDepartment = async (name: string) => {
    const query = `INSERT INTO department (name) VALUES ($1)`;
    await pool.query(query, [name]);
    console.log(`Added ${name} to departments.`);
}

const addNewRole = async (roleName:string,roleSalary:number,roleDepartmentId:number) => {
    const query = `INSERT INTO role (title,salary,department_id) VALUES ($1,$2,$3)`;
    await pool.query(query,[roleName,roleSalary,roleDepartmentId]);
    console.log(`Added ${roleName} to roles.`);
}

const addNewEmployee = async (firstName: string, lastName: string, employeeRoleId: number, employeeManagerId: number) => { 
    const query = `INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ($1,$2,$3,$4)`;
    await pool.query(query,[firstName,lastName,employeeRoleId,employeeManagerId]);
    console.log(`Added ${firstName} ${lastName} to employees.`);
}

const getRoleId = async (roleName: string) => {
    const query = `SELECT id FROM role WHERE title = $1`;
    const { rows } = await pool.query(query, [roleName]);
    return rows[0].id;
}

const getManagerId = async (first_name:string,last_Name: string) => {
    const query = `SELECT id FROM employee WHERE first_name = $1 and last_name = $2`;
    const { rows } = await pool.query(query, [first_name, last_Name]);
    return rows[0].id;
}

const updateEmployeeRole = async (employeeId: number, roleId: number) => {
    const query = `UPDATE employee SET role_id = $1 WHERE id = $2`;
    await pool.query(query, [roleId, employeeId]);
    console.log(`Updated employee role.`);
}

const getDepeartmentId = async (departmentName: string) => {
    const query = `SELECT id FROM department WHERE name = $1`;
    const { rows } = await pool.query(query, [departmentName]);
    return rows[0].id;
}

const getListOfManagers = async () => {
    const query = `SELECT id,first_name, last_name FROM employee`;
    const { rows } = await pool.query(query);
    console.table(rows);
    return rows;
}

const getListOfRoles = async () => {
    const query = `SELECT title FROM role`;
    const { rows } = await pool.query(query);
    console.table(rows);
    return rows;
}
const getListOfDepartments = async () => {
    const query = `SELECT name FROM department`;
    const { rows } = await pool.query(query);
    console.table(rows);
    return rows;
}

export { getListOfDepartments, getListOfManagers,getListOfRoles, getDepeartmentId, viewRoles, viewDepartments, viewEmployees, addNewDepartment, addNewRole, addNewEmployee, getRoleId, getManagerId, updateEmployeeRole };