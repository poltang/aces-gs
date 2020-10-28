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

    return {
      props: { licenseInfo: info },
      revalidate: 3, // In seconds
    }
  } catch (error) {
    throw error
  }
}

//
export default function Settings({ licenseInfo }) {
  const { user } = useUser({ redirecTo: "/login" })

  if(!licenseInfo || !user || licenseInfo.slug != user?.license) return NotFound

  return (
    <Layout bg="white" user={user} nav="settings">
      <div className="max-w-5xl mx-auto antialiased pt-10 px-4 sm:px-6">
        <div className="flex flex-row">
          <div className="w-full sm:w-32 md:w-48">
            <p className="bg-white border-b text-2xl font-semibold -mt-10 -mx-4 px-4 py-6 sm:hidden">
              License Settings
            </p>
            <div className="flex flex-col text-gray-600 leading-base">
              <Link href="/[license]/settings/license" as={`/${user.license}/settings/license`}>
                <a className="py-6 sm:py-3 border-b sm:border-0 text-gray-900 font-semibold hover:text-indigo-400">
                  License
                </a>
              </Link>
              <Link href="/[license]/settings/users" as={`/${user.license}/settings/users`}>
                <a className="py-6 sm:py-3 border-b sm:border-0 hover:text-indigo-400">
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
          <div className="hidden sm:block flex-grow sm:ml-6">
            <div className="sm:show">
              <section className="SECTIONBOX rounded-md border mb-8">
                <div className="px-6 pt-4 pb-6">
                  <h3 className="text-2xl font-semibold mb-3">License Slug</h3>
                  <p className="text-sm mb-4">This is your URL namespace wthin Aces</p>
                  <p className="leading-loose">
                    <span className="inline-block rounded-l border text-gray-500 bg-gray-100 px-3 py-1">aces.com/</span>
                    <span className="inline-block w-48 rounded-r border-t border-r border-b px-3 py-1">gaia-ng</span>
                  </p>
                </div>
                <div className="flex flex-row items-center text-sm px-6 pt-4 pb-4 bg-gray-100 border-t">
                  <span className="flex-grow">Maksimum 16 karakter</span>
                  <button className="flex-0 rounded-md bg-gray-700 border border-gray-700 hover:bg-white hover:text-gray-700 text-white px-8 py-1">Save</button>
                </div>
              </section>
              <section className="SECTIONBOX rounded-md border mb-8">
                <div className="px-6 pt-4 pb-6">
                  <h3 className="text-2xl font-semibold mb-3">License Name</h3>
                  <p className="text-sm mb-4">Your organization's name, or a display name...</p>
                  <p className="leading-loose">
                    <span className="inline-block w-64 rounded border px-3 py-1">PT Gaia New Generation</span>
                  </p>
                </div>
                <div className="flex flex-row items-center text-sm px-6 pt-4 pb-4 bg-gray-100 border-t">
                  <span className="flex-grow">Maksimum 32 karakter</span>
                  <button className="flex-0 rounded-md bg-gray-700 border border-gray-700 hover:bg-white hover:text-gray-700 text-white px-8 py-1">Save</button>
                </div>
              </section>
              <section className="SECTIONBOX rounded-md border mb-8">
                <div className="px-6 pt-4 pb-6">
                  <h3 className="text-2xl font-semibold mb-3">Footer Branding</h3>
                  <p className="text-sm mb-4">Your organization's name, or a display name...</p>
                  <p className="leading-loose">
                    <span className="inline-block w-full rounded border px-3 py-1">PT Gaia New Generation</span>
                  </p>
                </div>
                <div className="flex flex-row items-center text-sm px-6 pt-4 pb-4 bg-gray-100 border-t">
                  <span className="flex-grow">Maksimum 32 karakter</span>
                  <button className="flex-0 rounded-md bg-gray-700 border border-gray-700 hover:bg-white hover:text-gray-700 text-white px-8 py-1">Save</button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}