import { withIronSession } from 'next-iron-session'

export default function withSession(handler) {
  return withIronSession(handler, {
    password: "LZda07DhP7rDLRQKjRf63VsmPyZ2gHsjRE38",
    cookieName: "gaia/aces-gs",
    cookieOptions: {
      secure: process.env.NODE_ENV == 'production' ? true : false,
    },
  })
}