const mysql = require('mysql');

const database = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);

const getSql = query => {
  return new Promise((resolve, reject) => {
    database.query(query.text, query.values, (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

module.exports = {
  database,
  getSql
};