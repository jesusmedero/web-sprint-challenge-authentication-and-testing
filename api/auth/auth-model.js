const db = require('../../data/dbConfig');

function find() {
  return db('users').select('id', 'username');
}

function findBy(filter) {
  return db('users').where(filter);
}

function findByUsername(username) {
  return db('users').where({ username }).first();
}

async function add(user) {
  const [id] = await db('users').insert(user);
  return findBy({ id }).first();
}

module.exports = {
  add,
  find,
  findBy,
  findByUsername,
};
