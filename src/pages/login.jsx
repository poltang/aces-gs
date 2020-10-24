import { useState } from 'react'
import useUser from 'lib/useUser'
import fetchJson from 'lib/fetchJson'

export default function LoginPage() {
  const { user } = useUser({ redirecTo: false })
  const [errorMsg, setErrorMsg] = useState('')
  const { mutateUser } = useUser({ redirecTo: user?.license, redirectIfFound: true })

  async function handleSubmit(e) {
    e.preventDefault()

    const body = {
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value,
    }

    try {
      await mutateUser(
        fetchJson('/api/login', {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(body),
        })
      )
    } catch (error) {
      console.error('An unexpected error happened:', error)
      setErrorMsg(error.data.message)
    }
  }

  const btn = "bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
  const input = "appearance-none border border-blue-300 rounded w-full py-2 px-3 text-xl focus:text-indigo-600 leading-tight focus:outline-none focus:border-purple-500"

  return (
    <div className="max-w-sm mx-auto mt-12 px-10">
      <form onSubmit={handleSubmit}>
        <p className="mb-6 text-xl leading-snugs font-light">
          <span className="font-semibold mr-1">Kode Akses diterima.</span><br/>
          Untuk melanjutkan, silakan masukkan username dan password.
        </p>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input type="text" id="username" name="username" required autoFocus autoComplete="off"
          className={input} />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input type="password" id="password" name="password" required
          className={input} />
        </div>
        {errorMsg && <p className="text-red-500 my-3">{errorMsg}</p>}
        <div className="flex items-center justify-between">
        <button className={btn} type="submit">
          Sign In
        </button>
      </div>
    </form>
  </div>
  )
}