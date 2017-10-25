# OrbitDB adapter for PouchDB

OrbitDB backend for PouchDB

**Status:** *experiment*

## Install
```
git clone https://github.com/haadcode/pouchdb-adapter-couchdb
cd pouchdb-adapter-couchdb/
npm install
```

### Run
```
npm start
```

### Output

```
Starting IPFS
Swarm listening on /ip4/127.0.0.1/tcp/62682/ipfs/QmcHUWf1YemBYrezctp6cSyZpSAANz2deFb9As3EMZnuXf
Swarm listening on /ip4/192.168.0.101/tcp/62682/ipfs/QmcHUWf1YemBYrezctp6cSyZpSAANz2deFb9As3EMZnuXf
Swarm listening on /ip4/127.0.0.1/tcp/62684/ipfs/QmYJKyaLmp5G71t2iHcCVQGPe32oy275FrTVvCT1jJc5rw
Swarm listening on /ip4/192.168.0.101/tcp/62684/ipfs/QmYJKyaLmp5G71t2iHcCVQGPe32oy275FrTVvCT1jJc5rw
Init databases
> Init OrbitDB adapter
> OrbitDB ready
> Init OrbitDB adapter
> OrbitDB ready
Waiting for peers
Found peers
Listen for changes
--INSERT--
CHANGE: { _rev: '1-77fa57b2e3e74a349112fce5542fc998',
  _id: 'myNewDoc',
  stuff: [ 1, 2, 3 ],
  other: 'hello' }
ADDED:
 { _rev: '1-77fa57b2e3e74a349112fce5542fc998',
  _id: 'myNewDoc',
  stuff: [ 1, 2, 3 ],
  other: 'hello' }
--MODIFY--
Database replicated, latest revision: 1-77fa57b2e3e74a349112fce5542fc998
MODIFIED:
 { _rev: '2-bef2b460172d4b4a94596d87476e4796',
  _id: 'myNewDoc',
  other: 'hello again' }
--NOT REPLICATED--
RESULT1:
 { _rev: '1-77fa57b2e3e74a349112fce5542fc998',
  _id: 'myNewDoc',
  stuff: [ 1, 2, 3 ],
  other: 'hello' }
Database replicated, latest revision: 2-bef2b460172d4b4a94596d87476e4796
--REPLICATED--
RESULT2:
 { _rev: '2-bef2b460172d4b4a94596d87476e4796',
  _id: 'myNewDoc',
  other: 'hello again' }
--REMOVE--
OPLOG:
 [
  {
    "hash": "QmdTKzHDaNtwzr6Fk7uaFyJXVJXra9hoyuzQ3umc8KSPUr",
    "id": "QmcHUWf1YemBYrezctp6cSyZpSAANz2deFb9As3EMZnuXf",
    "payload": {
      "op": "PUT",
      "key": "myNewDoc",
      "value": {
        "_rev": "1-77fa57b2e3e74a349112fce5542fc998",
        "_id": "myNewDoc",
        "stuff": [
          1,
          2,
          3
        ],
        "other": "hello"
      }
    },
    "next": [],
    "v": 0,
    "clock": {
      "id": "QmcHUWf1YemBYrezctp6cSyZpSAANz2deFb9As3EMZnuXf",
      "time": 1
    },
    "sig": "304602210093dc0818815f62c62099c7f76bc96a297daf415f637e8395444cf6bd56e81490022100caa54a903a774bf276ac25a7d3e7225128e81ca8dbde463d7f2ffce560d26888",
    "key": "04aca527db7b67e0bf16439c8841c2b960d5fbeafbce1572e43aa41db62f29f66436aa58f6dcdb0edd44e179b2194bc016e96c362697fa11fbeb29833dd9a8753b"
  },
  {
    "hash": "QmV2KvJaQ7hT7R5QKD3F4WWDXxiN6BZZY1baZSMy1tFoQD",
    "id": "QmcHUWf1YemBYrezctp6cSyZpSAANz2deFb9As3EMZnuXf",
    "payload": {
      "op": "PUT",
      "key": "myNewDoc",
      "value": {
        "_rev": "2-bef2b460172d4b4a94596d87476e4796",
        "_id": "myNewDoc",
        "other": "hello again"
      }
    },
    "next": [
      "QmdTKzHDaNtwzr6Fk7uaFyJXVJXra9hoyuzQ3umc8KSPUr"
    ],
    "v": 0,
    "clock": {
      "id": "QmcHUWf1YemBYrezctp6cSyZpSAANz2deFb9As3EMZnuXf",
      "time": 2
    },
    "sig": "304602210093dc0818815f62c62099c7f76bc96a297daf415f637e8395444cf6bd56e81490022100caa54a903a774bf276ac25a7d3e7225128e81ca8dbde463d7f2ffce560d26888",
    "key": "04aca527db7b67e0bf16439c8841c2b960d5fbeafbce1572e43aa41db62f29f66436aa58f6dcdb0edd44e179b2194bc016e96c362697fa11fbeb29833dd9a8753b"
  },
  {
    "hash": "QmRtiwvfRrMBMgVXeMc9KcydEV9NfnBK8Bzdfz7SDvpngi",
    "id": "QmcHUWf1YemBYrezctp6cSyZpSAANz2deFb9As3EMZnuXf",
    "payload": {
      "op": "DEL",
      "key": "myNewDoc",
      "value": null
    },
    "next": [
      "QmV2KvJaQ7hT7R5QKD3F4WWDXxiN6BZZY1baZSMy1tFoQD"
    ],
    "v": 0,
    "clock": {
      "id": "QmcHUWf1YemBYrezctp6cSyZpSAANz2deFb9As3EMZnuXf",
      "time": 3
    },
    "sig": "304602210093dc0818815f62c62099c7f76bc96a297daf415f637e8395444cf6bd56e81490022100caa54a903a774bf276ac25a7d3e7225128e81ca8dbde463d7f2ffce560d26888",
    "key": "04aca527db7b67e0bf16439c8841c2b960d5fbeafbce1572e43aa41db62f29f66436aa58f6dcdb0edd44e179b2194bc016e96c362697fa11fbeb29833dd9a8753b"
  }
]
Database replicated, latest revision: Document doesn't exist or was deleted
--DOCUMENT REMOVED--
RESULT3: undefined
--WRITE-ACCESS--
We should see an error message next
Error: Not allowed to write

Finished successfully
```