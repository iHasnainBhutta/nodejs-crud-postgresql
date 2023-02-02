const DBConnect = require("../config/dbConnection");

// create table (create)
const createTable = async () => {
  try {
    const quers = `CREATE TABLE IF NOT EXISTS customers (user_id numeric(10,0) NOT NULL,name character varying(50) COLLATE pg_catalog."default" NOT NULL,age numeric(3,0) NOT NULL,phone character varying(20) COLLATE pg_catalog."default",CONSTRAINT customers_pkey PRIMARY KEY (user_id));`;
    // console.log(DBConnect());
    const table = await DBConnect().query(quers);
    console.log("Table created successfully", table);
  } catch (error) {
    console.error(error.message);
  }
};
// insert row (create)
const insertRecord = async (data) => {
  try {
    const { user_id, name, age, phone } = data;
    const query_ =
      "INSERT INTO customers (user_id, name, age, phone) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [user_id, name, age, phone];
    const res = await DBConnect().query(query_, values);
    console.log("Customer record inserted successfully", res);
    return res;
  } catch (error) {
    console.error(error.message);
  } finally {
    await client.end();
  }
};

//update row
const updateRecord = async (id, name) => {
  try {
    const fetchAllIds = `SELECT user_id FROM customers WHERE user_id = ${id}`;
    const temp = await DBConnect().query(fetchAllIds);
    const id_ = temp.rows[0].user_id;

    if (id_ === id) {
      const query_ = `UPDATE customers SET name = '${name}' WHERE user_id = ${id}`;
      const res = await DBConnect().query(query_);
      return res;
    } else {
      return false;
    }
    // console.log(temp);
  } catch (error) {
    console.error(error.message);
  }
};

// View all records

const viewRecords = async () => {
  try {
    const query = "SELECT * FROM customers";

    const result = await DBConnect().query(query);
    // console.log(result.rows);
    return result ? result.rows : false;
  } catch (error) {
    console.error(error.message);
  }
};

//delete records
const deleteRecord = async (id) => {
  try {
    const query_ = `DELETE FROM customers WHERE user_id = ${id}`;
    const result = DBConnect().query(query_);
    return result ? true : false;
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = {
  createTable,
  insertRecord,
  updateRecord,
  viewRecords,
  deleteRecord,
};
