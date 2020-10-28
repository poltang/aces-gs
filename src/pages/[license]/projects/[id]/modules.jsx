import Link from 'next/link'
import { ObjectID } from 'mongodb'
import useUser from 'lib/useUser'
import LayoutProject from "components/LayoutProject";
import { connect } from 'lib/database'
import ProjectGrid from 'components/ProjectGrid'
import NotFound from 'components/404'

export async function getStaticPaths() {
  const { db } = await connect()
  try {
    // const rs = await db.collection('licenses').find({}, {projection: {_id: 0, slug: 1}}).toArray()
    const rs = await db.collection('projects').find({},
      {projection: {_id: 1, license: 1}}).toArray()
    console.log("RS", rs)
    const paths = rs.map((project) => ({
      params: { license: project.license, id: project._id.toString() },
    }))
    console.log("PATHS", paths)
    return { paths, fallback: true }
  } catch (error) {
    throw error
  }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  const { db } = await connect()
  try {
    const rs = await db.collection('projects').aggregate([
      { $match: { _id: ObjectID(params.id) }},
      { $lookup: {
        localField: 'clientId',
        from: 'clients',
        foreignField: '_id',
        as: 'client'
      }},
      { $unwind: '$client' },
    ]).toArray()
    console.log("RS", rs.length)
    const project = JSON.parse( JSON.stringify(rs[0]) )
    console.log("project", project)
    // project = JSON.parse( project )
    console.log(project)

    return {
      props: { slug: params.license, project },
      revalidate: 3, // In seconds
    }
  } catch (error) {
    throw error
  }
}

//
export default function Modules({ slug, project }) {
  const { user } = useUser({ redirecTo: "/login" })

  if(!project || !user || project?.license != user?.license) return NotFound

  return (
    <LayoutProject user={user} project={project} nav="modules">
      <div className="bg-white pb-8 border-b border-gray-400">
        <div className="max-w-5xl mx-auto antialiased pt-6 px-4 sm:px-6">
          <div className="flex flex-col">
            <div className="text-center sm:text-left">
              <div className="text-4xl text-gray-800 leading-snug font-semibolds">
                Project Modules
              </div>
              <div className="text-sm text-gray-600 text-sm font-semibolds">
                For: {project.title}
              </div>
              <div className="text-sm text-gray-600 text-sm font-semibolds">
                Status: <span className="text-red-500">Not set</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto antialiased px-4 sm:px-6 py-8">
        <section className="max-w-sm mx-auto text-center mt-8">
          <p className="text-sm text-red-600 mb-6">
            This project hasn't subscribed to any ACES Modules.
          </p>
          <p>
            <Link href="/[license]/projects/[id]/set-modules" as={`/${project.license}/projects/${project._id}/set-modules`}>
              <a className="rounded px-4 py-3 border border-gray-700 bg-gray-700 hover:bg-white text-white hover:text-gray-700">
                Set up ACES Modules
              </a>
            </Link>
          </p>
        </section>
      </div>
    </LayoutProject>
  )
}