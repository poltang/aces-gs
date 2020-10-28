import Link from 'next/link'
import useUser from 'lib/useUser'
import Layout from "components/Layout";
import { connect } from 'lib/database'
import ProjectCard from 'components/ProjectCard'
import NotFound from 'components/404'

export async function getStaticPaths() {
  console.log("getStaticPaths")
  const { db } = await connect()
  try {
    const rs = await db.collection('licenses').find(
      {}, {projection: {_id: 0, slug: 1}}
    ).toArray()
    console.log("rs", rs)
    const paths = rs.map((license) => ({
      params: { license: license.slug },
    }))
    console.log("paths", paths)
    return { paths, fallback: true }
  } catch (error) {
    throw error
  }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  console.log("getStaticProps")
  console.log("params", params)
  const { db } = await connect()
  try {
    const rs = await db.collection('licenses').findOne({ slug: params.license })
    let info = JSON.stringify(rs)
    info = JSON.parse(info)
    console.log(info)

    // const rs2 = await db.collection('projects').find(
    //   {license: params.license},
    //   {limit: 3},
    // ).sort({_id: -1}).toArray()
    const rs2 = await db.collection('projects').aggregate([
      { $match: {license: params.license}},
      { $sort: { _id: -1 }},
      { $limit: 10 },
      { $lookup: {
        localField: 'clientId',
        from: 'clients',
        foreignField: '_id',
        as: 'client'
      }},
      { $unwind: '$client' },
      // { $project: { modules: -1 }}
    ]).toArray()
    console.log("RS2", rs2)
    const projects = JSON.parse( JSON.stringify(rs2) )
    return {
      props: { info, projects },
      revalidate: 3,
    }
  } catch (error) {
    throw error
  }
}

export default function License({ info, projects }) {
  const { user } = useUser({ redirecTo: "/login" })

  // This includes setting the noindex header because static files always return
  // a status 200 but the rendered not found page page should obviously not be indexed
  if(!info || !user || info?.slug != user?.license) return NotFound

  return (
    // <Layout license={info} nav="license">
    <Layout user={user} nav="license">
    {/* HERO */}
      <div className="bg-white pb-16 border-b border-gray-300">
        <div className="max-w-5xl mx-auto antialiased py-3 px-4 sm:px-6">
          <div className="w-full grid grid-cols-7">
            <div className="col-span-7 md:col-span-5 py-6">
              <div className="flex flex-row items-center">
                <div className="flex-0 pr-4">
                  <div className="w-24 h-24 rounded-full bg-gray-200"></div>
                </div>
                <div className="flex-grow">
                  <div className="text-xs text-gray-600 leading-tight uppercase">
                    Aces Corporate License
                  </div>
                  <div className="text-3xl text-gray-800 leading-snug font-semibold">
                    {info.licenseName}
                  </div>
                  <div className="text-base text-gray-800 text-sm">
                    Jakarta
                  </div>
                </div>
              </div>
            </div>
            {/*  */}
            <div className="col-span-7 md:col-span-2 text-sm font-semibold md:text-right py-6">
              <div className="flex justify-center md:justify-end">
                <Link href="/[license]/projects/new" as={`/${info.slug}/projects/new`}>
                  <a className="rounded px-4 py-3 border border-gray-700 bg-gray-700 hover:bg-white text-white hover:text-gray-700">
                    Create New Project
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* CONTENT */}
      <div>
        <div className="relative max-w-5xl mx-auto antialiased py-6 px-4 sm:px-6">
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-5 md:col-span-3">
              <div className="-mt-20 pt-2 md:pr-6">
              {projects?.map(project => <ProjectCard key={project.license} slug="" project={project} />)}
              </div>
            </div>
            <div className="hidden md:block col-span-5 md:col-span-2">
              <h3 className="text-lg text-gray-600 tracking-wider font-bold md:-mt-16 mb-6 pt-1">
                Activities
              </h3>
              <p>Praesent et phasellus in himenaeos hac conubia dapibus neque,
              litora sagittis feugiat aptent mollis iaculis rhoncus platea dignissim,
              class maximus consectetur potenti odio eleifend pellentesque nulla sodales,
              penatibus suspendisse vulputate vivamus nostra nunc malesuada. Viverra
              justo euismod tempus eget sociosqu vehicula risus suscipit ridiculus
              penatibus, at elementum vulputate cras mauris nec curabitur consequat
              nisi, rutrum fusce velit semper proin volutpat feugiat neque efficitur,
              habitasse curae mi primis nascetur vivamus quisque ipsum erat.</p>
            </div>
          </div>
        </div>
      </div>
      {/* ALT ACTIVITIES */}
      <div className="md:hidden bg-white border-t border-gray-300 pt-6 pb-16 -mb-40">
        <div className="max-w-5xl mx-auto antialiased px-4 sm:px-6">
          <h3 className="text-lg text-gray-500 tracking-wider font-bold mb-6">
            Activities
          </h3>
          <p>Praesent et phasellus in himenaeos hac conubia dapibus neque,
              litora sagittis feugiat aptent mollis iaculis rhoncus platea dignissim,
              class maximus consectetur potenti odio eleifend pellentesque nulla sodales,
              penatibus suspendisse vulputate vivamus nostra nunc malesuada. Viverra
              justo euismod tempus eget sociosqu vehicula risus suscipit ridiculus
              penatibus, at elementum vulputate cras mauris nec curabitur consequat
              nisi, rutrum fusce velit semper proin volutpat feugiat neque efficitur,
              habitasse curae mi primis nascetur vivamus quisque ipsum erat.</p>
        </div>
      </div>

      {/* <pre className="pre">{JSON.stringify(projects, null, 2)}</pre> */}
    </Layout>
  )
}