import { ObjectID } from 'mongodb'
import withSession from 'lib/session'
import { connect } from 'lib/database'

const bcrypt = require('bcryptjs')

export default withSession(async (req, res) => {
  const { username, password } = await req.body

  try {
    const { db } = await connect()
    const person = await db.collection('users').findOne({ username: username })
    const verified = bcrypt.compareSync(password, person.hashed_password)

    if (verified) {
      const user = {
        isLoggedIn: true,
        license: person.license,
        username: person.username,
        email: person.email,
        name: person.name,
        roles: person.roles,
      }

      console.log(user)
      req.session.set('user', user)
      await req.session.save()
      res.json(user)
    } else {
      res.status(404)
      res.json({ message: "Username/password salah." })
    }
  } catch (error) {
    res.status(404)
    res.json({ message: "Username/password salah." })
  }
})