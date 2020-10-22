import Link from 'next/link'
import { useRouter } from 'next/router'
import useUser from 'lib/useUser'
import fetchJson from 'lib/fetchJson'
import useSWR from 'swr'

export default function Dashboard() {
  const { user } = useUser({ redirecTo: '/login' })
  const { mutateUser } = useUser({ redirectTo: '/login' })
  const router = useRouter()

  if (!user) return <div></div>

  return (
    <div>
      <h1 className="text-6xl text-center font-light antialiased">Welcome.</h1>

      <p className="text-center">
        <Link href="/api/logout">
          <a onClick={async (e) => {
              e.preventDefault()
              await mutateUser(fetchJson('/api/logout'))
              router.push('/login')
            }} className="inline-block bg-gray-100 border border-gray-300 rounded px-4 py-2 text-gray-500 hover:border-gray-400 hover:bg-gray-200 hover:text-gray-700">Logout</a>
        </Link>
      </p>

      <pre className="max-w-xl mx-auto text-xs font-mono">{JSON.stringify(user, null, 2)}</pre>
    </div>
  )
}
