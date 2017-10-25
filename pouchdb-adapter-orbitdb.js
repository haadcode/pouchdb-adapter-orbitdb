const utils = require('pouchdb-utils');
const adapterUtils = require('pouchdb-adapter-utils')
const parseDoc = adapterUtils.parseDoc
const OrbitDB = require('../orbit-db')
const merge = require('pouchdb-merge')

// Implements the PouchDB API for dealing with CouchDB instances over OrbitDB
async function OrbitDBPouch(opts, callback) {
  if (!opts.ipfs)
    throw new Error("IPFS is undefined")

  let orbitdb, db
  const api = this
  const ipfs = opts.ipfs

  console.log("> Init OrbitDB adapter")

    try {
      orbitdb = new OrbitDB(ipfs, opts.path || './orbitdb')
      db = await orbitdb.docstore(opts.address || opts.name)
      db.events.on('replicated', () => {
        // Get the _rev of whatever document is the last operation in the log
        const rev = db._oplog.values.slice(-1)[0].payload.value
          ? db._oplog.values.slice(-1)[0].payload.value._rev
          : "Document doesn't exist or was deleted"
        console.log("Database replicated, latest revision:", rev)
      })
      await db.load()
      api.orbitdb = db

      console.log("> OrbitDB ready")
      api.onReady(db)
    } catch (e) {
      console.error(e)
    }    

  api.replicate = async () => {
    // TODO: start orbitdb replication, currently automatically on
  }

  // Temp callbacks, replace with events
  api.onReady = () => null

  api._remote = true;
  /* istanbul ignore next */
  api.type = function () {
    return 'orbitdb';
  };

  api.id = (callback) => db.address.toString()

  api.request = (callback) => {
    callback(null, 'hellodb-request')
  }

  // Sends a POST request to the host calling the couchdb _compact function
  //    version: The version of CouchDB it is running
  api.compact = (callback) => {
    callback(null, 'hellodb-compact')
  }

  api.bulkGet = (callback) => {
    callback(null, 'hellodb-bulkGet')
  }

  // Calls GET on the host, which gets back a JSON string containing
  //    couchdb: A welcome string
  //    version: The version of CouchDB it is running
  api._info = (callback) => {
    callback(null, {
      db_name: 'hellodb-info',
    })
  }

  // Get the document with the given id from the database given by host.
  api._get = (id) => {
    const res = db.get(id)
    // console.log("get>", res)
    return Promise.resolve(res[0])
  }

  let lastChange = null

  api._bulkDocs = async (req, opts) => {
    // console.log("bulkDocs>", req)
    for (let doc of req.docs) {
      const parsed = parseDoc(doc, true)
      lastChange = Object.assign({ _rev: parsed.metadata.rev }, doc)
      delete lastChange._rev_tree
      const hash = await db.put(lastChange)
    }
    return lastChange
  }

  // Update/create document
  // api.put = async (doc, opts, callback) => {
  //   const parsed = parseDoc(doc, true)
  //   lastChange = Object.assign({ _rev: parsed.metadata.rev }, doc)
  //   delete lastChange._rev_tree
  //   // console.log("put>", orbitdb.id, lastChange)
  //   const hash = await db.put(lastChange)
  //   return lastChange
  // }

  // Delete the document given by doc from the database given by host.
  api.remove = async (doc, opts) => {
    await db.del(doc._id)
  }

  // api.allDocs = (callback) => {
  //   callback(null, 'hellodb-alldocs')
  // }

  api._destroy = async (opts, callback) => {
    await db.drop()
    callback(null, 'hellodb-destroy')
  }

  // Get a list of changes made to documents in the database given by host.
  // TODO According to the README, there should be two other methods here,
  // api.changes.addListener and api.changes.removeListener.
  api._changes = function (opts) {
    if (lastChange) {
      // const change = opts.processChange(lastChange, [], opts);
      opts.onChange(lastChange);
    }
  }

  // api.revsDiff = (callback) => {
  //   callback(null, 'hellodb-revsDiff')
  // }

  utils.nextTick(() => {
    callback(null, api);
  })
}

// OrbitDBPouch is a valid adapter.
OrbitDBPouch.valid = function () {
  return true;
};

module.exports = async function (PouchDB) {
  PouchDB.adapter('orbitdb', OrbitDBPouch, false);
}
