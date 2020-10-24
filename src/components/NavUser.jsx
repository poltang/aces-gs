import Link from 'next/link'
import fetchJson from 'lib/fetchJson'
import useUser from 'lib/useUser'

export default function NavUser({ user, licenseName }) {
  const { mutateUser} = useUser({ redirecTo: `${user?.license}` })

  return (
    <div className="bg-white">
      <div id="" className="bg-white max-w-5xl mx-auto py-3 px-4 sm:px-6">
        <div className="flex flex-row items-center">
          <div className="flex flex-grow items-center">
            <div id="ac-logo" className="h-8 w-16 mr-4 bg-pink-200"></div>
            <div className="flex-grow">
              <span className="text-gray-800 font-semibold">{licenseName}</span>
            </div>
          </div>
          <div className="flex flex-row flex-0 flex-end">
            <Link href="#">
              <a className="px-1 py-1 mr-3 text-sm text-gray-600 hover:text-gray-700">Support</a>
            </Link>
            <Link href="#">
              <a className="px-1 py-1 mr-4 text-sm text-gray-600 hover:text-gray-700">Docs</a>
            </Link>
            <Link href="/api/logout">
              <a onClick={async (e) => {
                e.preventDefault()
                await mutateUser(fetchJson('/api/logout'))
              }} className="rounded-md border px-3 py-1 text-sm text-gray-500 hover:text-gray-600 hover:border-gray-500">
                Logout
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}