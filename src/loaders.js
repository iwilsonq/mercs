const DataLoader = require('dataloader');
const tables = require('tables');
const { getSql } = require('database');

const createNodeLoader = table => {
  return new DataLoader(ids => {
    const query = table
      .select(table.star())
      .where(table.id.in(ids))
      .toQuery();

    return getSql(query).then(rows => {
      rows.forEach(row => {
        row.__tableName = table.getName();
      });
      return rows;
    });
  });
};

const nodeLoaders = {
  users: createNodeLoader(tables.users)
};

const getNodeById = nodeId => {
  const { tableName, dbId } = tables.splitNodeId(nodeId);
  console.log(`${tableName},${dbId}`)
  return nodeLoaders[tableName].load(dbId);
};

module.exports = {
  getNodeById
};