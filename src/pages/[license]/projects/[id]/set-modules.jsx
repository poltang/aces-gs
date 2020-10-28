import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { connect } from 'lib/database'
import useUser from 'lib/useUser'
import fetchJson from 'lib/fetchJson'
import FormLayout from "components/FormLayout";
import NotFound from 'components/404';
import { ObjectID } from 'mongodb'

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
  // Here we are just providing raw but real all of ACES modules
  // to be selected as user's project modules.
  const { db } = await connect()
  try {
    const rs = await db.collection("projects").aggregate([
      { $match: { _id: ObjectID(params.id) }},
      { $lookup: {
        localField: 'license',
        from: 'licenses',
        foreignField: 'slug',
        as: 'licenseInfo'
      }},
      { $unwind: '$licenseInfo'},
      { $project: {
        _id: 1,
        title: 1,
        license: 1,
        "licenseInfo.licenseName": 1,
      }}
    ]).toArray()
    const project = JSON.parse( JSON.stringify(rs[0]) )
    const info = {
      projectId: project._id,
      projectTitle: project.title,
      licenseSlug: project.license,
      licenseName: project.licenseInfo.licenseName,
    }
    // console.log("INFOS", rs["licenseInfo"])
    console.log("INFO", info)
    // const info = {
    //   licenseSlug: json.license,
    //   // licenseName: json.licenseInfo.licenseName,
    //   projectId: json.id,
    // }
    return {
      props: { info, modules: [
        {
          // _id: ObjectID("5f6da077b244f3a86bc85ba1"),
          slug: 'gpq-1.0',
          type: 'gpq',
          version: '1.0',
          method: 'selftest',
          name: 'GPQ Untuk ASN',
          title: null,
          description: null,
          items: 30,
          maxTime: 5400000,
        },
        {
          // _id: ObjectID("5f6da0d6b244f3a86bc85ba2"),
          slug: 'aime-1.0',
          type: 'aime',
          version: '1.0',
          method: 'selftest',
          name: 'AIME for Professional',
          title: null,
          description: null,
          items: 48,
          maxTime: 8640000,
        },
        {
          // _id: ObjectID("5f6da0f5b244f3a86bc85ba3"),
          slug: 'interview-1.0',
          type: 'interview',
          version: '1.0',
          method: 'simulation',
          name: 'Wawancara',
          title: null,
          description: null,
          items: 16,
          maxTime: null,
        },
        {
          // _id: ObjectID("5f8b048c5f48fe0608868488"),
          slug: 'sjt-asn-1.0',
          type: 'sjt-asn',
          version: '1.0',
          method: 'selftest',
          name: 'SJT untuk ASN',
          title: 'SJT untuk ASN',
          description: 'Lorem ipsum dolor ASN',
          items: 27,
          maxTime: 4050000,
        },
        {
          // _id: ObjectID("5f90b0da2738ea069b6d7cf3"),
          slug: 'mate-1.0',
          type: 'mate',
          version: '1.0',
          method: 'selftest',
          name: 'MATE for Professional',
          title: null,
          description: null,
          items: 45,
          maxTime: 8100000,
        },
      ]}
    }
  } catch (error) {
    throw error
  }
}

export default function SetModules({ info, modules }) {
  const { user } = useUser({ redirecTo: "/login" })

  // if(!license || !user || license.slug != user?.license) return NotFound

  return (
    <FormLayout info={info}>
      <Form user={user} info={info} modules={modules} />
      {/* <pre className="pre">{JSON.stringify(info, null, 2)}</pre> */}
      {/* <pre className="pre">{JSON.stringify(modules, null, 2)}</pre> */}
    </FormLayout>
  )
}

const Form = ({ user, info, modules }) => {

  return (
    <div className="rounded-lg bg-blue-200 bg-opacity-0 hover:bg-opacity-50 p-1 -m-1">
      <div className="bg-white antialiased shadow rounded-md border border-gray-400 hover:border-blue-300">
        <div className="flex flex-row px-6 py-6 items-end border-b">
          <div className="flex-grow">
            <h1 className="text-gray-700 text-2xl font-semibold">Setup Project Modules</h1>
            <p className="text-gray-600 text-sm">Project: <span className="text-blue-600 font-bold">{info.projectTitle}</span></p>
          </div>
          <div className="flex-0">
            <Link href="/[license]/projects/[id]/modules" as={`/${info.licenseSlug}/projects/${info.projectId}/modules`}>
              <a className="rounded-md border text-sm text-gray-600 hover:border-gray-500 hover:text-gray-700 px-3 py-1">
                Cancel
              </a>
            </Link>
          </div>
        </div>
        {/*  */}
        <div className="px-6 pt-4 pb-4">
          <p className="text-sm text-red-500 text-center mb-8">
            Kustomisasi judul dan deskripsi modul dapat dilakukan
            setelah proses ini.
          </p>
          {modules.map((module, index) => (
            <div key={index} className="rounded border p-3 mb-4 hover:border-green-400">
              <div className="mod-title">
                <span className="text-gray-700 font-bold">{module.name}</span> -
                <span className="text-sm text-gray-600"></span>
              </div>
              <div className="mod-desc text-sm text-green-600 mb-4">{/*&#9654; */}Module ini bla-bla-bla</div>
              <div className="mod-versions border-t text-sm text-gray-600">
                <p className="border-b text-sm py-2 hover:bg-green-100">Vesion 1.0</p>
                <p className="border-b text-sm py-2 hover:bg-green-100">Vesion 1.1</p>
                <p className="border-b text-sm py-2 hover:bg-green-100">Vesion 1.1a</p>
              </div>
              <div className="text-sm text-center text-gray-700 font-semibolds pt-3 pb-1">
                Module subscribed:
              </div>
            </div>
          ))}
        </div>
        {/*  */}
        <form>
          <div className="flex flex-row items-center border-t border-gray-400 px-6 py-8">
            <div className="flex-grow">
              <Link href="/[license]/projects/[id]/modules" as={`/${info.licenseSlug}/projects/${info.projectId}/modules`}>
                <a className="inline-block rounded-md border text-gray-500 font-semibold hover:border-gray-500 hover:text-gray-700 px-4 py-2">
                  Cancel
                </a>
              </Link>
              {/* <button className="rounded-md border border-gray-400 text-gray-500 font-semibold px-4 py-2">Cancel</button> */}
            </div>
            <div className="flex-0">
              <button type="submit" disabled onClick={event => handleSubmit(event)} className="rounded-md border border-gray-400 text-gray-500 font-semibold hover:text-white hover:border-gray-600 hover:bg-gray-600 px-4 py-2">Save Client Data</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}