import { connect } from 'lib/database'
import { ObjectID } from 'mongodb'
import withSession from 'lib/session'

/*
QUERIES
================================================
- create new client           /api/post?client
- create new contract         /api/post?contract
- create new user             /api/post?user
- create new project          /api/post?project
- create new project-member   /api/post?member
- create new project-expert   /api/post?expert
- create new project-persona  /api/post?persona

*/

const CLIENTS_DB    = "clients"
const CONTRACTS_DB  = "contracts"
const PROJECTS_DB   = "projects"
const USERS_DB      = "users"
const PERSONAS_DB   = "personas"
const MEMBERS_DB    = "project_members"


export default withSession(async (req, res) => {
  const {
    client,
    contract,
    user,
    project,
    member,
    expert,
    persona,
  } = req.query
  const body = JSON.parse(req.body)
  const { mongoClient, db } = await connect()

  try {
    // NEW CLIENT
    if (client != undefined) {
      const props = clientProps(body)
      const rs = await db.collection(CLIENTS_DB).insertOne(props)
      const ops = rs["ops"][0]
      const doc = {
        _id:       ops["_id"],
        license:   ops["license"],
        name:      ops["name"],
        address:   ops["address"],
        city:      ops["city"],
        phone:     ops["phone"],
        contacts:  ops["contacts"],
        createdAt: ops["createdAt"],
        updatedAt: ops["updatedAt"],
      }
      res.json(doc)
    }
    // NEW PROJECT
    else if (project != undefined) {
      const { clientType } = body
      if (clientType == "new") {
        // Step 1: Start a Client Session
        const session = mongoClient.startSession();

        // Step 2: Optional. Define options to use for the transaction
        const transactionOptions = {
          readPreference: 'primary',
          readConcern: { level: 'local' },
          writeConcern: { w: 'majority' }
        };

        // Step 3: Use withTransaction to start a transaction, execute the callback, and commit (or abort on error)
        // Note: The callback for withTransaction MUST be async and/or return a Promise.
        try {
          await session.withTransaction(async() => {
            const cProps = simpleClientProps(body)
            const rs1 = await db.collection(CLIENTS_DB).insertOne(cProps, { session })
            console.log("RS CLIENT:", rs1['ops'][0])
            // extract client's _id
            const cid = rs1['ops'][0]['_id']

            const pProps = projectProps(body, cid)
            const rs2 = await db.collection(PROJECTS_DB).insertOne(pProps, { session })
            console.log("RS PROJECT:", rs1['ops'][0])
            res.json( rs2['ops'][0] )
          }, transactionOptions)
        } finally {
          await session.endSession();
          await mongoClient.close();
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Server error." })
  }
})

function projectProps(body, newClientId = false) {
  const {
    license,
    clientId,
    path,
    title,
    description,
    startDate,
    endDate,
    status,
    contact,
    admin,
    createdBy } = body
  return {
    license: license,
    clientId: newClientId ? newClientId : clientId,
    path: path,
    title: title,
    description: description,
    startDate: startDate,
    endDate: endDate,
    status: status,
    contact: contact,
    admin: admin,
    modules: [],
    groups: [],
    settings: [],
    createdBy: createdBy,
    createdAt: new Date(),
    updatedAt: null,
  }
}

function simpleClientProps(body) {
  const { license, clientName, clientAddress, clientCity } = body
  return {
    license: license,
    name: clientName,
    address: clientAddress,
    city: clientCity,
    phone: '',
    contacts: [],
    createdAt: new Date(),
    updatedAt: null,
  }
}

function clientProps(body) {
  const { license, name, address, city, phone, contacts } = body
  return {
    license: license,
    name: name,
    address: address,
    city: city,
    phone: phone,
    contacts: contacts,
    createdAt: new Date(),
    updatedAt: null,
  }
}