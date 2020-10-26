import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { connect } from 'lib/database'
import useUser from 'lib/useUser'
import fetchJson from 'lib/fetchJson'
import FormLayout from "components/FormLayout";
import NotFound from 'components/404';

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
    let license = JSON.stringify(rs)
    license = JSON.parse(license)
    console.log(license)

    return {
      props: { license }
    }
  } catch (error) {
    throw error
  }
}

export default function NewProject({ license }) {
  const { user } = useUser({ redirecTo: "/login" })

  if(!license || !user || license.slug != user?.license) return NotFound

  return (
    <FormLayout license={license}>
      <Form license={license} user={user} />
    </FormLayout>
  )
}

const Form = ({ license, user }) => {
  const router = useRouter()
  const [clientType, setClientType] = useState(null)
  const [projectData, setProjectData] = useState({
    license: license.slug,
    clientId: '',
    contractId: '',
    path: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    admin: user.username,
    createdBy: user.username,
    modules: [],
    groups: [],
    settings: [],
    clientType: '',
    clientName: '',
    clientAddress: '',
    clientCity: '',
  })

  const inputNormal = "w-full appearance-none rounded-md bg-gray-100 text-gray-700 focus:text-gray-700 focus:bg-white border hover:border-gray-500 focus:border-blue-400 focus:outline-none px-3 py-2"
  const inputContact = "w-full appearance-none rounded-md bg-white text-gray-700 focus:text-gray-700 focus:bg-white border hover:border-gray-500 focus:border-blue-400 focus:outline-none px-3 py-2"
  const inputContactErr = "w-full appearance-none rounded-md bg-white text-gray-700 focus:text-gray-700 focus:bg-white border hover:border-gray-500 focus:border-blue-400 focus:outline-none px-3 py-2"
  const addBtn = "w-full rounded-md bg-gray-600 border border-gray-600 text-white hover:bg-gray-700 hover:border-gray-700 focus:outline-none px-3 py-2"
  const addBtnDisabled = "w-full cursor-not-allowed rounded-md bg-gray-400 border border-gray-400 text-white px-3 py-2"
  const inputLabel = "block text-sm text-gray-600 uppercase mb-4"
  const btnClient = "inline-block leading-tight rounded-md border text-sm text-gray-600 hover:border-gray-500 hover:text-gray-700 px-3 py-1 mr-3"
  const btnClientSelected = "inline-block leading-tight rounded-md border text-sm bg-gray-500 border-gray-500 text-white px-3 py-1 mr-3"
  const inputKlien = "w-full appearance-none rounded-md bg-blue-100 sbg-opacity-50 text-gray-700 focus:text-gray-700 focus:bg-white border border-blue-200 hover:border-blue-300 focus:border-blue-400 focus:outline-none px-3 py-2"

  function handleClick(e) {
    setClientType(e.target.value)
    setProjectData(prevState => ({
      ...prevState,
      ['clientType']: e.target.value
    }))
  }

  function _handleChange(e) {
    const key = e.target.id
    // TODO Find the proper method to update state item
    let copy = projectData
    copy[key] = e.target.value
    setProjectData(copy)
    // console.log(projectData)
  }

  // https://stackoverflow.com/questions/54150783/react-hooks-usestate-with-object
  const handleChange = e => {
    const { name, value } = e.target
    setProjectData(prevState => ({
      ...prevState,
      [name]: value
    }))
    // console.log(projectData)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const body = projectData
    console.log(body)
    const response = await fetchJson("/api/post?project", {
      method: 'POST',
      headers: { Accept: 'application/json', },
      body: JSON.stringify(body),
    })
    console.log(response)
    router.push(`/${license.slug}/projects`)
  }

  return (
    <div className="rounded-lg bg-blue-200 bg-opacity-0 hover:bg-opacity-50 p-1 -m-1">
      <div className="bg-white antialiased shadow rounded-md border border-gray-400 hover:border-blue-300">
        <div className="flex flex-row px-6 py-6 items-end border-b">
          <div className="flex-grow">
            <h1 className="text-gray-700 text-2xl font-semibold">New Project</h1>
            <p className="text-gray-600 text-sm">User: <span className="text-blue-600 font-bold">{user.username}</span></p>
          </div>
          <div className="flex-0">
            <Link href="/[license]" as={`/${license.slug}`}>
              <a className="rounded-md border text-sm text-gray-600 hover:border-gray-500 hover:text-gray-700 px-3 py-1">
                Cancel
              </a>
            </Link>
          </div>
        </div>
        {/*  */}
        <div className="px-6 pt-8 pb-4">
          <div className="MAIN">
            <div>
              <label className={inputLabel}>
                <div className="mb-2">Judul proyek</div>
                <input value={projectData.title} onChange={handleChange} type="text" name="title" autoComplete="off" className={inputNormal} />
              </label>
            </div>
            <div>
              <label className={inputLabel}>
                <div className="mb-2">Deskripsi singkat</div>
                <input value={projectData.description} onChange={handleChange} type="text" name="description" autoComplete="off" className={inputNormal} />
              </label>
            </div>
            {/* <div>
              <label className="block text-sm text-gray-500 uppercase mb-4">
                <div className="mb-2">Nama klien / nama organisasi</div>
                <input id="client-city" type="text" name="client-city" autoComplete="off" className={inputNormal} />
              </label>
            </div> */}
            <div className="grid grid-cols-2 gap-6">
              <label className={inputLabel}>
                <div className="mb-2">Tanggal mulai</div>
                <input value={projectData.startDate} onChange={handleChange}  type="text" name="startDate" autoComplete="off" className={inputNormal} />
              </label>
              <label className={inputLabel}>
                <div className="mb-2">Tanggal berakhir</div>
                <input value={projectData.endDate} onChange={handleChange}  type="text" name="endDate" autoComplete="off" className={inputNormal} />
              </label>
            </div>
          </div>
        </div>

        <div className="border-t text-sm px-6 py-6">
          {/* client type select */}
          <div className="flex flex-row items-center">
            {/* <div className="flex-grow text-blue-400 text-right pr-4">Tipe klien:</div> */}
            <div className="w-auto mx-auto">
              <span className="text-blue-400 text-right pr-3">
                Proyek untuk:
              </span>
              <button value="new" onClick={(e) => handleClick(e)} className={clientType == 'new' ? btnClientSelected : btnClient}>
                Klien Baru
              </button>
              <button value="existing" onClick={(e) => handleClick(e)} className={clientType == 'existing' ? btnClientSelected : btnClient}>
                Klien lama
              </button>
            </div>
          </div>
          {clientType == 'new' && (
          <div className="border-t pt-4 mt-6">
            <div>
              <label className={inputLabel}>
                <div className="mb-2">Nama organisasi</div>
                <input value={projectData.clientName} onChange={handleChange}  type="text" name="clientName" autoComplete="off" className={inputNormal} />
              </label>
            </div>
            <div>
              <label className={inputLabel}>
                <div className="mb-2">Alamat</div>
                <input value={projectData.clientAddress} onChange={handleChange}  type="text" name="clientAddress" autoComplete="off" className={inputNormal} />
              </label>
            </div>
            <div>
              <label className={inputLabel}>
                <div className="mb-2">Kota</div>
                <input value={projectData.clientCity} onChange={handleChange}  type="text" name="clientCity" autoComplete="off" className={inputNormal} />
              </label>
            </div>
          </div>
          )}
          {clientType == 'existing' && (
          <div className="border-t pt-4 mt-6">
            <span className="text-red-500">Not implemented yet.</span>
          </div>
          )}
        </div>
        {/* )} */}
        {/*  */}
        <form>
          <div className="flex flex-row items-center rounded-b-md bg-gray-100 border-t border-gray-300 px-6 py-6">
            <div className="flex-grow">
              <Link href="/[license]" as={`/${license.slug}`}>
                <a className="inline-block rounded-md border text-gray-500 font-semibold hover:border-gray-500 hover:text-gray-700 px-4 py-2">
                  Cancel
                </a>
              </Link>
              {/* <button className="rounded-md border border-gray-400 text-gray-500 font-semibold px-4 py-2">Cancel</button> */}
            </div>
            <div className="flex-0">
              <button type="submit" onClick={handleSubmit} className="rounded-md border border-gray-400 text-gray-500 font-semibold hover:text-white hover:border-gray-600 hover:bg-gray-600 px-4 py-2">Save Project</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}