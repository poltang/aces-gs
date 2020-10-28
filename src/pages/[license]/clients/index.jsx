import Link from 'next/link'
import useUser from 'lib/useUser'
import Layout from "components/Layout";
import { connect } from 'lib/database'
import NotFound from 'components/404'

export async function getStaticPaths() {
  const { db } = await connect()
  try {
    const rs = await db.collection('licenses').find({}, {projection: {_id: 0, slug: 1}}).toArray()
    console.log(rs)
    const paths = rs.map((license) => ({
      params: { license: license.slug },
    }))

    return { paths, fallback: true }
  } catch (error) {
    throw error
  }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  const { db } = await connect()
  try {
    const rs = await db.collection('clients').find({license: params.license}).sort({_id: -1}).toArray()
    const clients = JSON.parse( JSON.stringify(rs) )

    return {
      props: { slug: params.license, clients },
      revalidate: 3, // In seconds
    }
  } catch (error) {
    throw error
  }
}

//
export default function Clients({ slug, clients }) {
  const { user } = useUser({ redirecTo: "/login" })

  if(!user || user.license != slug) return NotFound
  // href={`/[license]/[projectId]${href}`} as={`${prefix}${href}`}>

  return (
    <Layout user={user} nav="clients">
      <div className="bg-white pb-4 border-b border-gray-400">
        <div className="max-w-5xl mx-auto antialiased pt-6 px-4 sm:px-6">
          <div className="flex flex-col">
            <div className="text-center sm:text-left">
              <div className="text-4xl text-gray-800 leading-snug font-semibolds">
                Clients
              </div>
              <div className="text-sm text-gray-600 text-sm font-semibolds">
                Manage your clients and contracts
              </div>
            </div>
            <div className="flex justify-center sm:justify-end mt-8">
              <Link href="/[license]/clients/new" as={`/${slug}/clients/new`}>
                <a className={"rounded px-3 py-2 border border-gray-400 " +
                "hover:border-gray-700 text-sm text-gray-500 hover:text-gray-700"}>
                  Add New Client
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="max-w-5xl mx-auto antialiased pt-6 px-4 sm:px-6">
        <table className="client-table w-full mb-12">
          <thead>
            <tr className="text-sm text-gray-700">
              <th className="bg-indigo-100 border-t border-b font-light">#</th>
              <th className="bg-indigo-100 border-t border-b font-light">Perusahaan</th>
              <th className="bg-indigo-100 border-t border-b font-light">Alamat</th>
              <th className="bg-indigo-100 border-t border-b font-light">Kontak</th>
              <th className="bg-indigo-100 border-t border-b font-light">Kontrak</th>
            </tr>
          </thead>
          <tbody>
          {clients.map((client, index) => (
            <tr key={client._id} className="border-b text-sm text-gray-700">
              <td>{index}</td>
              <td>{client.name}</td>
              <td>{client.address}</td>
              <td>
                <div className="leading-loose">
                {client.contacts?.map((c, index) => (
                  <>
                  {index ? ", " : ""}
                  <span key={`contact${index}`}>{c.name}</span>
                  </>
                ))}
                </div>
              </td>
              <td></td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}