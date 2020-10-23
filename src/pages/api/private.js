import { connect } from 'lib/database'
import { ObjectID } from 'mongodb'

export default async (req, res) => {
  const { licenses, license, projects, project } = req.query
  const { db } = await connect()

  try {
    if (projects != undefined) {
      const rs = await db.collection('projects').find({}, {projection: {_id: 1}}).toArray()
      console.log(rs)
      res.json(rs)
    }
    else if (licenses != undefined) {
      const rs = await db.collection('licenses').find({}, {projection: {_id: 0, slug: 1}}).toArray()
      console.log(rs)
      res.json(rs)
    }
    else if (license != undefined && license) {
      const rs = await db.collection('licenses').findOne({slug: license})
      console.log(rs)
      res.json(rs)
    }
  } catch (error) {
    res.status(500).json({ message: "Server error." })
  }
}