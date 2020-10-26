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

    const rs2 = await db.collection('clients').find({license: info.slug}).sort({_id: -1}).toArray()
    let clients = JSON.stringify(rs2)
    clients = JSON.parse(clients)
    console.log("PROJECTS", clients)
    return {
      props: { info, clients },
      revalidate: 3, // In seconds
    }
  } catch (error) {
    throw error
  }
}

//
export default function Settings({ info }) {
  const { user } = useUser({ redirecTo: "/login" })

  if(!info || !user || info.slug != user?.license) return NotFound

  return (
    <Layout bg="white" license={info} user={user} nav="settings">
      <div className="max-w-5xl mx-auto antialiased pt-10 px-4 sm:px-6">
        <div className="flex flex-row">
          <div className=" sm:w-32 md:w-48 hidden sm:block">
            <div className="flex flex-col text-gray-600 leading-base">
              <Link href="/[license]/settings/license" as={`/${info.slug}/settings/license`}>
                <a className="py-6 sm:py-3 border-b sm:border-0 text-gray-900 font-semibold hover:text-indigo-400">
                  License
                </a>
              </Link>
              <Link href="/[license]/settings/users" as={`/${info.slug}/settings/users`}>
                <a className="py-6 sm:py-3 border-b sm:border-0 hover:text-indigo-400">
                  Users
                </a>
              </Link>
              <Link href="/[license]/settings/billing" as={`/${info.slug}/settings/billing`}>
                <a className="py-6 sm:py-3 border-b sm:border-0 hover:text-indigo-400">
                  Billing
                </a>
              </Link>
            </div>
          </div>
          <div className="flex-grow bg-blues-100 sm:ml-6">
            <div className="BACKBOX">
              <Link href="/[license]/settings" as={`/${info.slug}/settings`}>
                <a className="block bg-white text-sm font-semibold border-b -mx-4 -mt-10 mb-8 px-4 py-6 sm:hidden">
                  <div className="">
                    <svg className="inline-block mr-2 stroke-current stroke-2" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" shape-rendering="geometricPrecision"><path d="M15 18l-6-6 6-6"></path></svg>
                    <span className="">Back to Setting</span>
                  </div>
                </a>
              </Link>
            </div>
            <div>
              <section className="SECTIONBOX rounded-md border mb-8">
                <div className="px-6 py-4 pb-6">
                  <h3 className="text-2xl font-semibold mb-3">License Slug</h3>
                  <p className="text-sm mb-4">This is your URL namespace wthin Aces</p>
                  <p className="leading-loose">
                    <span className="inline-block rounded-l border text-gray-500 bg-gray-100 px-3 py-1">aces.com/</span>
                    <span className="inline-block w-48 rounded-r border-t border-r border-b px-3 py-1">gaia-ng</span>
                  </p>
                </div>
                <div className="flex flex-row items-center text-sm px-6 py-4 bg-gray-100 border-t">
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
                <div className="flex flex-row items-center text-sm px-6 py-4 bg-gray-100 border-t">
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
                <div className="flex flex-row items-center text-sm px-6 py-4 bg-gray-100 border-t">
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