import { createContext, memo, useContext, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import useUser from 'lib/useUser'
import fetchJson from 'lib/fetchJson'
import Layout from "components/Layout";
import NavLicense from 'components/NavLicense'
import useSWR, { mutate } from 'swr';
import { connect } from 'lib/database'
import user from 'pages/api/user';
import DefaultErrorPage from 'next/error'
import ProjectCard from 'components/ProjectCard'
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
    return { props: { info } }
  } catch (error) {
    throw error
  }
}

//
export default function License({ info }) {
  const { user } = useUser({ redirecTo: "/login" })

  // This includes setting the noindex header because static files always return
  // a status 200 but the rendered not found page page should obviously not be indexed
  if(!info || !user || info.slug != user?.license) return NotFound

  return (
    <LicenseProvider user={user} info={info}>
      <PageContent user={user} info={info} />
    </LicenseProvider>
  )
}

const PageContent = memo(({info}) => {
  return (
    <Layout license={info} nav="license">
      <Content />
    </Layout>
  )
})

const LicenseContext = createContext()

function LicenseProvider({ user, info, children }) {
  const licenseInfo = info
  const baseUrl = `/api/license?id=${user.license}`
  const swrOptions = { revalidateOnFocus: false }
  const { data: license } = useSWR(`${baseUrl}&info`, fetchJson, swrOptions)
  const { data: projects } = useSWR(`${baseUrl}&projects`, fetchJson, swrOptions)

  return (
    <LicenseContext.Provider value={{ user, license, licenseInfo, projects, }}>
      {children}
    </LicenseContext.Provider>
  )
}

function Content() {
  const { user, license, licenseInfo, projects } = useContext(LicenseContext)

  return (
    <>
    <div className="bg-white pb-16 border-b border-gray-300">
      <div className="max-w-5xl mx-auto antialiased py-3 px-4 sm:px-6">
        <div className="w-full grid grid-cols-7">
          <div className="col-span-7 md:col-span-5 py-6">
            <div className="flex flex-row items-centers">
              <div className="flex-0 pr-6">
                <div className="w-24 h-24 rounded-full bg-orange-200"></div>
              </div>
              <div className="flex-grow">
                <div className="text-xs text-gray-600 leading-tight uppercase">
                  Aces Corporate License
                </div>
                <div className="text-3xl text-gray-800 leading-snug font-bold">
                  {license?.licenseName}
                </div>
                <div className="text-base text-gray-800 text-sm font-semibolds">
                  Jakarta
                </div>
              </div>
            </div>
          </div>
          {/*  */}
          <div className="col-span-7 md:col-span-2 text-sm font-semibold md:text-right py-6">
            <div className="flex justify-center md:justify-end">
              <Link href="#">
                <a className="rounded px-4 py-3 border border-gray-700 bg-gray-700 hover:bg-white text-white hover:text-gray-700">
                  Create New Project
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/*  */}
    <div className="relative bg-indigo-100 bg-opacity-25 pb-20">
      <div className="GRADIENT w-full absolute py-24 z-0 bg-gradient-to-b from-indigo-100 opacity-25">
        <div className="h-64"></div>
      </div>
      <div className="relative z-10 max-w-5xl mx-auto antialiased py-6 px-4 sm:px-6">
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-5 md:col-span-3">
            <div className="-mt-20 pt-2 md:pr-6">
            {projects?.map(project => <ProjectCard slug="" project={project} />)}
            </div>
          </div>
          <div className="col-span-5 md:col-span-2">
            <h3 className="text-lg text-gray-500 tracking-wider font-bold md:-mt-16 mb-6 pt-1">
              Activities
            </h3>
            <p>Praesent et phasellus in himenaeos hac conubia dapibus neque, litora sagittis feugiat aptent mollis iaculis rhoncus platea dignissim, class maximus consectetur potenti odio eleifend pellentesque nulla sodales, penatibus suspendisse vulputate vivamus nostra nunc malesuada. Viverra justo euismod tempus eget sociosqu vehicula risus suscipit ridiculus penatibus, at elementum vulputate cras mauris nec curabitur consequat nisi, rutrum fusce velit semper proin volutpat feugiat neque efficitur, habitasse curae mi primis nascetur vivamus quisque ipsum erat.</p>
          </div>
        </div>
        {/*  */}
        <pre className="bg-green text-xs h-64">PROJECTS {JSON.stringify(licenseInfo, null, 2)}</pre>
      </div>
    </div>
    </>
  )
}
//
