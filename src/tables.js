const sql = require('sql')

sql.setDialect('mysql');

const users = sql.define({
  name: 'users',
  columns: [{
    name: 'id',
    dataType: 'INTEGER',
    primaryKey: true
  }, {
    name: 'name',
    dataType: 'text'
  }, {
    name: 'about',
    dataType: 'text'
  }]
});

const dbIdToNodeId = (dbId, tableName) => {
  return `${tableName}:${dbId}`;
};

const splitNodeId = nodeId => {
  console.log('splitNodeId')
  const [tableName, dbId] = nodeId.split(':');
  return { tableName, dbId };
};

module.exports = {
  users,
  dbIdToNodeId,
  splitNodeId
};