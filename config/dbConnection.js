const { Client } = require("pg");

const DBConnect = () => {
  const client = new Client({
    host: "localhost",
    port: 5432,
    database: "mydb",
    user: "postgres",
    password: "1234",
  });

  client.connect((err) => {
    if (err) {
      console.error("Error: Connection Failed.", err.stack);
    } else {
      console.log("Database Connected!");
    }
  });
  return client;
};

module.exports = DBConnect;
