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
  const { db } = await connect()

  try {
    if (client != undefined) {
      const props = buildClientProps(body)
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
  } catch (error) {
    res.status(500).json({ message: "Server error." })
  }
})

function buildClientProps(body) {
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