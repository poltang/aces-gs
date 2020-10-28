import { connect } from 'lib/database'
import { ObjectID } from 'mongodb'

export default async (req, res) => {
  // const { licenses, license, projects, project } = req.query
  const { db } = await connect()

  try {
    /*
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
    */
    const rs = await db.collection("projects").aggregate([
      { $match: {license: 'sdi'}},
      // { $limit: 3 },
      { $lookup: {
        localField: 'license',
        from: 'licenses',
        foreignField: 'slug',
        as: 'licenseInfo'
      }},
      { $unwind: '$licenseInfo'},
      // { $project: { title: 1 }}
      { $project: {
        _id: 1,
        title: 1,
        license: 1,
        "licenseInfo.licenseName": 1,
      }}
    ]).toArray()
    // console.log(rs)
    // res.json(rs)
    if (rs.length > 0) {
      res.json(rs[0])
    } else {
      res.status(404).json({ message: 'Not found' })
    }
  } catch (error) {
    res.status(500).json({ message: "Server error." })
  }
}