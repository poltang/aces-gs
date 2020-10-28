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
export default function Project({ slug, project }) {
  const { user } = useUser({ redirecTo: "/login" })

  if(!project || !user || project?.license != user?.license) return NotFound

  return (
    <LayoutProject user={user} project={project} nav="overview">
      <div className="bg-white pb-8 border-b border-gray-400">
        <div className="max-w-5xl mx-auto antialiased pt-6 px-4 sm:px-6">
          <div className="flex flex-col">
            <div className="text-center sm:text-left">
              <div className="text-4xl text-gray-800 leading-snug font-semibolds">
                {project.title}
              </div>
              <div className="text-sm text-gray-600 text-sm font-semibolds">
                {project.client.name}
              </div>
              <div className="text-sm text-gray-600 text-sm font-semibolds">
                {project.startDate}
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
            <h3 className="section-title w-48 lgs:w-48 text-xl text-gray-700 font-bold mt-2">
              Client & Contract
            </h3>
          </div>
          <div className="flex-grow">
            <div className="rounded-md shadow-sm bg-white border border-gray-300 p-6">
              <h3 className="section-title border-b md:hidden text-center sm:text-left text-xl text-gray-700 font-semibold -mx-6 -mt-6 mb-4 px-6 pt-3 pb-2">
              Client & Contract
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
        {/*  */}
        <section className="flex flex-col md:flex-row mb-10">
          <div className="hidden md:flex md:flex-1 pr-8 mb-4">
            <h3 className="section-title w-48 text-xl text-gray-700 font-bold mt-2">
              Project Team
            </h3>
          </div>
          <div className="flex-grow">
            <div className="rounded-md shadow-sm bg-white border border-gray-300 p-6">
              <h3 className="section-title border-b md:hidden text-center sm:text-left text-xl text-gray-700 font-semibold -mx-6 -mt-6 mb-4 px-6 pt-3 pb-2">
                Project Team
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
        {/*  */}
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

/*
Ultricies a morbi penatibus integer semper rhoncus
massa hendrerit class, non eget auctor tempor ridiculus vitae nascetur
consectetur maximus, senectus dui dictum phasellus amet suscipit metus
potenti, mi ullamcorper mauris placerat porta venenatis ex gravida. Posuere
rhoncus non velit ultricies nunc fermentum libero nisl netus, inceptos quam
dui tempor natoque praesent conubia massa odio, lacinia ligula pulvinar hac
amet aptent a facilisi nulla, euismod dis etiam at sodales litora varius
pretium. Vel ante facilisis potenti curabitur ex rhoncus quisque bibendum,
augue fringilla nostra arcu euismod non cras pellentesque, nullam montes
pharetra suspendisse ac est mattis eu faucibus, maximus tristique nam blandit
venenatis massa egestas. Convallis amet massa natoque quisque lacus augue
diam malesuada, faucibus pharetra taciti mattis nulla scelerisque neque odio,
euismod at vehicula vivamus sodales ad curabitur dis, nullam cursus purus
suspendisse id elit vulputate. Interdum congue eu mus suscipit ultrices
quisque eget scelerisque vestibulum, pharetra feugiat et sem urna neque enim
aliquet volutpat, curae tellus aliquam auctor cursus nam vivamus magna,
tristique lectus ac lacinia elementum aenean dignissim hendrerit. Magna
hendrerit adipiscing condimentum volutpat nec senectus suscipit id, ante a
accumsan libero aenean lacus elementum vitae, tristique cursus nibh metus
pharetra ornare risus aptent ultrices, ridiculus rhoncus non efficitur neque
primis tempor. Felis augue in ligula porttitor praesent ipsum suscipit enim,
at urna litora tempus condimentum nullam donec interdum elit, suspendisse
ultricies venenatis placerat morbi habitasse nisl lorem mollis, faucibus
parturient posuere torquent nostra dignissim cursus. Lorem iaculis sociosqu
sagittis dapibus fusce rhoncus ante accumsan ullamcorper dictum, est velit
ornare mattis cubilia dui suspendisse odio montes phasellus, enim neque
sollicitudin risus himenaeos dolor porttitor interdum congue, nec conubia ad
in vestibulum ultricies potenti mi tristique.

*/