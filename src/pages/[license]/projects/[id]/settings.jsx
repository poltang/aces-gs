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
export default function Settings({ slug, project }) {
  const { user } = useUser({ redirecTo: "/login" })

  if(!project || !user || project?.license != user?.license) return NotFound

  return (
    <LayoutProject user={user} project={project} nav="settings">
      <div className="bg-white pb-8 border-b border-gray-400">
        <div className="max-w-5xl mx-auto antialiased pt-6 px-4 sm:px-6">
          <div className="flex flex-col">
            <div className="text-center sm:text-left">
              <div className="text-4xl text-gray-800 leading-snug font-semibolds">
                Project Settings
              </div>
              <div className="text-sm text-gray-600 text-sm font-semibolds">
                Manage deployment and other project-related things
              </div>
              <div className="text-sm text-gray-600 text-sm font-semibolds">
                Other tidbits...
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto antialiased px-4 sm:px-6 py-8">
        <section className="flex flex-col md:flex-row mb-10">
          <div className="hidden md:flex md:flex-1 pr-8 mb-4">
            <h3 className="section-title w-48 text-xl text-gray-700 font-bold mt-2">
              Project Modules
            </h3>
          </div>
          <div className="flex-grow">
            <div className="rounded-md shadow-sm bg-white border border-gray-300 p-6">
              <h3 className="section-title border-b md:hidden text-center sm:text-left text-xl text-gray-700 font-semibold -mx-6 -mt-6 mb-4 px-6 pt-3 pb-2">
              Project Modules
              </h3>
              <p>
              Proin est justo urna euismod ridiculus mauris tristique nisl, eget varius
  turpis ullamcorper bibendum posuere hac venenatis, ligula maecenas donec
  integer feugiat et per sociosqu at, luctus porta magna cras lacus elementum
  mollis. Rutrum nisl hac massa est blandit urna vel vestibulum nibh, et quis
  magnis eleifend lacinia himenaeos quisque luctus varius, condimentum amet non
  consectetur odio vehicula placerat justo, mi commodo diam fusce eros
  consequat ipsum sodales.
              </p>
            </div>
          </div>
        </section>
      </div>
    </LayoutProject>
  )
}