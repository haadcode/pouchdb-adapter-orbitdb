const PouchDB = require('pouchdb/lib/index.js')
const IPFS = require('../orbit-db/node_modules/ipfs')
const path = require('path')
const rmrf = require('rimraf')
const startIpfs = require('../orbit-db/test/start-ipfs')
const waitForPeers = require('../orbit-db/test/wait-for-peers')

PouchDB.plugin(require('./pouchdb-adapter-orbitdb'))

const orbitDbPath1 = './orbitdb/pouchdb/peer1'
const orbitDbPath2 = './orbitdb/pouchdb/peer2'
const ipfsPath1 = path.join(orbitDbPath1, '/ipfs')
const ipfsPath2 = path.join(orbitDbPath2, '/ipfs')

const ipfsConfig = {
  start: true,
  EXPERIMENTAL: {
    pubsub: true,
  },
  config: {
    Addresses: {
      API: '/ip4/127.0.0.1/tcp/0',
      Swarm: ['/ip4/0.0.0.0/tcp/0'],
      Gateway: '/ip4/0.0.0.0/tcp/0'
    },
    Bootstrap: [],
  }
}

const main = async () => {
  try {
    // Remove existing data, we want to start with a clean database
    rmrf.sync(orbitDbPath1)
    rmrf.sync(orbitDbPath2)

    console.log("Starting IPFS")
    ipfs1 = await startIpfs({ ...ipfsConfig, repo: ipfsPath1 })
    ipfs2 = await startIpfs({ ...ipfsConfig, repo: ipfsPath2 })

    console.log("Init databases")
    db = new PouchDB('hellodb', {
      adapter: 'orbitdb', 
      path: orbitDbPath1, 
      ipfs: ipfs1,
    })

    db.onReady = async () => {
      db2 = new PouchDB('hellodb', { 
        adapter: 'orbitdb', 
        ipfs: ipfs2, 
        path: orbitDbPath2, 
        address: db.orbitdb.address.toString() 
      })

      db2.onReady = async () => {
        console.log("Waiting for peers")
        await waitForPeers(ipfs1, [ipfs2._peerInfo.id._idB58String], db.orbitdb.address.toString())
        await waitForPeers(ipfs2, [ipfs1._peerInfo.id._idB58String], db.orbitdb.address.toString())
        console.log("Found peers")

        console.log("Listen for changes")
        db.changes({
          since: 'now',
          include_docs: true,
          live: true
        }).on('change', function (change) {
          console.log("CHANGE:", change)
        }).on('error', function (err) {
          console.error(err)
        });

        console.log("--INSERT--")
        let doc = await db.put({ _id: 'myNewDoc', stuff: [1, 2, 3], other: 'hello' })
        console.log("ADDED:\n", doc)

        console.log("--MODIFY--")
        doc = await db.put({ _id: 'myNewDoc', other: 'hello again', _rev: doc._rev })
        console.log("MODIFIED:\n", doc)

        // At this point the databases are not yet replicated, 
        // so db2 returns the first version of the document
        console.log("--NOT REPLICATED--")
        const result1 = await db2.get('myNewDoc')
        console.log("RESULT1:\n", result1)

        // Wait for a little bit so that the peers have the time to replicate
        setTimeout(async () => {
          // Query for the document again
          console.log("--REPLICATED--")
          const result2 = await db2.get('myNewDoc')
          console.log("RESULT2:\n", result2)

          console.log("--REMOVE--")
          await db.remove(doc)
          console.log("OPLOG:\n", JSON.stringify(db.orbitdb._oplog.values, null, 2))

          // Wait for replication to finish
          setTimeout(async () => {
            console.log("--DOCUMENT REMOVED--")
            const result3 = await db2.get('myNewDoc')
            console.log("RESULT3:", result3)

            try {
              // Test write-access (only peer1 can write, ie. db1)
              console.log("--WRITE-ACCESS--")
              console.log("We should see an error message next:")
              doc = await db2.put({ _id: 'myNewDoc', other: 'trying to modify the document', _rev: doc._rev });
              console.log("We shouldn't end here")
            } catch (e) {
              // We end up here as orbitdb throw 'Not allowed to write' error
              console.log(e.toString())
            }
            console.log("\nFinished successfully")
            process.exit(0)
          }, 500)
        }, 500)
      }
    }
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

main()
