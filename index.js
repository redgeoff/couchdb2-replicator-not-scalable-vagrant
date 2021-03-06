#!/usr/bin/env node

var nano = require('nano')('http://localhost:5984'),
  Promise = require('bluebird');

var createDB = Promise.promisify(nano.db.create, nano.db),
  replicator = nano.use('_replicator'),
  replicatorInsert = Promise.promisify(replicator.insert, replicator);

var NUM_REPLICATORS = 1000;

var dbNamePrefix = 'test_' + (new Date()).getTime();

var createReplicator = function (dbNameA, dbNameB) {
  return replicatorInsert({
    source: 'http://localhost:5984/' + dbNameA,
    target: 'http://localhost:5984/' + dbNameB,
    continuous: true
  });
};

var createDoc = function (dbName) {
  var dbNameNano = nano.use(dbName),
    dbNameInsert = Promise.promisify(dbNameNano.insert, dbNameNano);
  return dbNameInsert({
    foo: 'bar'
  });
};

var createReplicatorDatabases = function (i) {
  var dbNameA = dbNamePrefix + '_' + i + '_a',
    dbNameB = dbNamePrefix + '_' + i + '_b';
  return createDB(dbNameA).then(function () {
    return createDB(dbNameB);
  }).then(function () {
    return createReplicator(dbNameA, dbNameB);
  }).then(function () {
    return createDoc(dbNameA);
  });
};

var createReplicatorDatabasesFactory = function (i) {
  return function () {
    return createReplicatorDatabases(i);
  };
};

var createDatabases = function () {
  // Sequentially chain so that we don't exhaust CouchDB resources just setting up demo
  var chain = Promise.resolve();
  for (i = 0; i < NUM_REPLICATORS; i++) {
    chain = chain.then(createReplicatorDatabases(i));
  }
  return chain;
};

createDatabases();
