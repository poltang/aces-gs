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
    const rs = await db.collection('licenses').findOne({ slug: params.license })
    let info = JSON.stringify(rs)
    info = JSON.parse(info)
    console.log(info)

    const rs2 = await db.collection('users').find({license: info.slug}).sort({_id: -1}).toArray()
    let users = JSON.stringify(rs2)
    users = JSON.parse(users)
    console.log("USERS", users)
    return {
      props: { licenseInfo: info, users },
      revalidate: 3, // In seconds
    }
  } catch (error) {
    throw error
  }
}

//
export default function Settings({ licenseInfo, users }) {
  const { user } = useUser({ redirecTo: "/login" })

  if(!licenseInfo || !user || licenseInfo.slug != user?.license) return NotFound

  return (
    <Layout bg="white" user={user} nav="settings">
      <div className="max-w-5xl mx-auto antialiased pt-10 px-4 sm:px-6">
        <div className="flex flex-row">
          <div className="w-32 flex-initial hidden sm:block md:w-48">
            <div className="flex flex-col text-gray-600 leading-base">
              <Link href="/[license]/settings/license" as={`/${user.license}/settings/license`}>
                <a className="py-6 sm:py-3 border-b sm:border-0 hover:text-indigo-400">
                  License
                </a>
              </Link>
              <Link href="/[license]/settings/users" as={`/${user.license}/settings/users`}>
                <a className="py-6 sm:py-3 border-b sm:border-0 text-gray-900 font-semibold hover:text-indigo-400">
                  Users
                </a>
              </Link>
              <Link href="/[license]/settings/billing" as={`/${user.license}/settings/billing`}>
                <a className="py-6 sm:py-3 border-b sm:border-0 hover:text-indigo-400">
                  Billing
                </a>
              </Link>
            </div>
          </div>
          <div className="flex-grow sm:ml-6">
            <div className="BACKBOX">
              <Link href="/[license]/settings" as={`/${user.license}/settings`}>
                <a className="block bg-white text-sm font-semibold border-b -mx-4 -mt-10 mb-8 px-4 py-6 sm:hidden">
                  <div className="">
                    <svg className="inline-block mr-2 stroke-current stroke-2" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" shape-rendering="geometricPrecision"><path d="M15 18l-6-6 6-6"></path></svg>
                    <span className="">Back to Setting</span>
                  </div>
                </a>
              </Link>
            </div>
            <div className="">
              <h3 className="text-2xl font-semibold -mt-2 mb-3">License Users</h3>
              <section className="PAGECONTENT w-full mb-10">
                <table class="w-full leading-snug text-sm text-gray-700">
                  <thead>
                    <tr className="border-b border-t">
                      <th className="font-normal">#</th>
                      <th className="font-normal">Nama</th>
                      <th className="font-normal">Username</th>
                      <th className="font-normal">License Admin</th>
                      <th className="font-normal">Project Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                  {users.map((u, i) => {
                    const licenseAdmin = u.roles.includes('license-admin')
                    const projectAdmin = u.roles.includes('project-admin')
                    return (
                      <tr className="border-b">
                        <td>{i + 1}</td>
                        <td>{u.name}</td>
                        <td>{u.username}</td>
                        <td>{licenseAdmin ? 'Ya' : 'Tidak'}</td>
                        <td>{projectAdmin ? 'Ya' : 'Tidak'}</td>
                      </tr>
                    )
                  })}
                  </tbody>
                </table>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}