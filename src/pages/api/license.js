import { connect } from 'lib/database'

export default async (req, res) => {
  console.log(req.url)


  try {
    const { db } = await connect()
    console.log(db)
    const response = await db.collection('licenses').find({}).toArray()
    console.log(response)
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({ message: "Server error." })
  }
}