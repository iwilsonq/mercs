require('dotenv').config();
const data = require('./data.json');
const { database, getSql } = require('database');
const tables = require('tables');

const sequencePromises = promises => {
  return promises.reduce((promise, promiseFunction) => {
    return promise.then(() => {
      return promiseFunction();
    });
  }, Promise.resolve());
};

const connectToDatabase = () => {
  return new Promise((resolve, reject) => {
    database.connect(err => {
      if (err) {
        reject(err);
      };
      
      resolve('Connected to MySQL database!');
    });
  })
}

const createDatabase = dbName => {
  return new Promise((resolve, reject) => {
    database.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, err => {
      if (err) {
        reject(err);
      }

      resolve(`Created database ${dbName}`)
    })
  })
}

const initializeDatabase = async () => {
  connectToDatabase()
    .catch(err => console.log('Error: ', err));
  
  const dbName = process.env.DB_NAME;
  await createDatabase(dbName);
  
  let promises = [tables.users].map(table => 
    () => getSql(table.create().toQuery())
  );
  
  return sequencePromises(promises);
};

const insertData = () => {
  let { users } = data;

  let queries = [
    tables.users.insert(users).toQuery(),
  ];

  let promises = queries.map((query) => {
    return () => getSql(query);
  });
  return sequencePromises(promises);
};

initializeDatabase().then(() => {
  return insertData();
}).then(() => {
  console.log({ done: true });
  process.exit();
});