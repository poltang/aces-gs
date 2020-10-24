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

export default function NewClient({ license }) {
  const { user } = useUser({ redirecTo: "/login" })

  if(!license || !user || license.slug != user?.license) return NotFound

  return (
    <FormLayout license={license}>
      <Form license={license} />
    </FormLayout>
  )
}

const Form = ({ license }) => {
  const router = useRouter()
  const [contactShow, setContactShow] = useState(false)
  const [contactList, setContactList] = useState([])
  const [addable, setAddable] = useState(false)

  const inputNormal = "w-full appearance-none rounded-md bg-gray-100 text-gray-700 focus:text-gray-700 focus:bg-white border hover:border-gray-500 focus:border-blue-400 focus:outline-none px-3 py-2"
  const inputContact = "w-full appearance-none rounded-md bg-white text-gray-700 focus:text-gray-700 focus:bg-white border hover:border-gray-500 focus:border-blue-400 focus:outline-none px-3 py-2"
  const inputContactErr = "w-full appearance-none rounded-md bg-white text-gray-700 focus:text-gray-700 focus:bg-white border hover:border-gray-500 focus:border-blue-400 focus:outline-none px-3 py-2"
  const addBtn = "w-full rounded-md bg-gray-600 border border-gray-600 text-white hover:bg-gray-700 hover:border-gray-700 focus:outline-none px-3 py-2"
  const addBtnDisabled = "w-full cursor-not-allowed rounded-md bg-gray-400 border border-gray-400 text-white px-3 py-2"

  function addContact() {
    const contact = {
      name: document.getElementById("contact-name").value,
      phone: document.getElementById("contact-phone").value,
      email: document.getElementById("contact-email").value
    }
    console.log(contact)
    setContactList([...contactList, contact])
    document.getElementById("contact-name").value =''
    document.getElementById("contact-phone").value =''
    document.getElementById("contact-email").value = ''
    setAddable(false)
  }

  function handleChange(event) {
    if (event.target.value.length > 2) {
      setAddable(true)
    } else {
      setAddable(false)
    }
  }

  function handleDeletion(e) {
    const v = e.target.value
    console.log(contactList[v])
    console.log(contactList)
    // let  newList = contactList
    // newList.splice(v, 1)
    // setContactList([...contactList, newList])
    // console.log(contactList)
    setContactList(prev => [
      ...prev.filter(c => c != prev[v])
    ])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const body = {
      license: license.slug,
      name: document.getElementById("client-name").value,
      phone: document.getElementById("client-phone").value,
      address: document.getElementById("client-address").value,
      city: document.getElementById("client-city").value,
      contacts: contactList,
    }
    console.log(body)
    const response = await fetchJson("/api/post?client", {
      method: 'POST',
      headers: { Accept: 'application/json', },
      body: JSON.stringify(body),
    })
    console.log(response)
    router.push(`/${license.slug}/clients`)
  }

  return (
    <div className="relative sbg-gray-100 bg-gradient-to-b from-gray-200 px-4 sm:px-6 pb-24">
      {/* <div className="GRAD absolute z-0 w-full h-64 bg-gradient-to-b from-blue-200 opacity-50"></div> */}
      <div className="relative max-w-xl mx-auto py-24">
        <div className="rounded-lg bg-blue-200 bg-opacity-50 p-1 -m-1">
          <div className="bg-white antialiased rounded-md border border-blue-400">

            <div className="flex flex-row px-6 py-6 items-end border-b">
              <div className="flex-grow">
                <h1 className="text-gray-800 text-2xl font-semibold">New Client</h1>
                <p className="text-gray-600 text-sm">{license.licenseName}</p>
              </div>
              <div className="flex-0">
                <Link href="/[license]/clients" as={`/${license.slug}/clients`}>
                  <a className="rounded-md border text-sm text-gray-600 hover:border-gray-500 hover:text-gray-700 px-3 py-1">
                    Cancel
                  </a>
                </Link>
              </div>
            </div>

            <div className="px-6 py-8">
              <div className="MAIN">
                <label className="block text-sm text-gray-500 uppercase mb-4">
                  <div className="mb-2">Nama perusahaan</div>
                  <input id="client-name" type="text" name="client-name" autoComplete="off" className={inputNormal} />
                </label>
                <label className="block text-sm text-gray-500 uppercase mb-4">
                  <div className="mb-2">Alamat</div>
                  <input id="client-address" type="text" name="client-address" autoComplete="off" className={inputNormal} />
                </label>
                <label className="block text-sm text-gray-500 uppercase mb-4">
                  <div className="mb-2">Kota</div>
                  <input id="client-city" type="text" name="client-city" autoComplete="off" className={inputNormal} />
                </label>
                <label className="block text-sm text-gray-500 uppercase mb-4">
                  <div className="mb-2">Telepon</div>
                  <input id="client-phone" type="text" name="client-phone" autoComplete="off" className={inputNormal} />
                </label>
              </div>
              <div className="CONTACT bg-gray-100 rounded-md border mt-8">
                {!contactShow && <div onClick={e => setContactShow(true)} className="cursor-pointer text-sm leading-8 text-gray-700 hover:text-blue-500 px-3 py-1">&#9654; Daftar kontak perusahaan</div>}
                {contactShow && (<div className="text-sm leading-8 text-gray-700 px-3 py-1">&#9660; Daftar kontak perusahaan</div>)}
                {contactShow && (
                  <>
                  <div className="contact mt-1 px-3 pt-2 pb-4">
                    <div className="grid grid-cols-5 gap-2">
                      <div className="col-span-3 pr-2">
                        <label className="block text-sm text-gray-500 uppercase">
                          <div className="mb-1">Nama</div>
                          <input onChange={event => handleChange(event)} id="contact-name" type="text" name="contact-name" className={inputContact} />
                        </label>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm text-gray-500 uppercase">
                          <div className="mb-1">Telepon</div>
                          <input id="contact-phone" type="text" name="contact-phone" className={inputContact} />
                        </label>
                      </div>
                      <div className="col-span-3 pr-2">
                        <label className="block text-sm text-gray-500 uppercase">
                          <div className="mb-1">Email</div>
                          <input id="contact-email" type="text" name="contact-email" className={inputContact} />
                        </label>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm text-gray-500 uppercase">
                          <div className="mb-1">&nbsp;</div>
                          {!addable && <button disabled className={addBtnDisabled}>Add Contact</button>}
                          {addable && <button onClick={addContact} className={addBtn}>Add Contact</button>}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="contact mt-1 px-3 pt-2 pb-4 border-ts">
                    <hr />
                    <div className="text-center uppercase -mt-3">
                      <span className="inline-block bg-gray-100 text-sm text-gray-500 px-4">Daftar Kontak</span>
                    </div>
                    <div id="CONTACTS-BOX" className="text-sm text-gray-600 leading-8">
                      {contactList.length == 0 && (
                        <p className="text-sm text-center py-4">[Belum ada kontak]</p>
                      )}
                      {contactList.map((contact, index) => <ContactRow key={`ct` + index} index={index} contact={contact} clickHandler={handleDeletion} />)}

                    </div>
                  </div>
                  </>
                )}
              </div>
            </div>

            <form>
              <div className="flex flex-row items-center border-t border-gray-400 px-6 py-8">
                <div className="flex-grow">
                  <Link href="/[license]/clients" as={`/${license.slug}/clients`}>
                    <a className="inline-block rounded-md border text-gray-500 font-semibold hover:border-gray-500 hover:text-gray-700 px-4 py-2">
                      Cancel
                    </a>
                  </Link>
                  {/* <button className="rounded-md border border-gray-400 text-gray-500 font-semibold px-4 py-2">Cancel</button> */}
                </div>
                <div className="flex-0">
                  <button type="submit" onClick={event => handleSubmit(event)} className="rounded-md border border-gray-400 text-gray-500 font-semibold hover:text-white hover:border-gray-600 hover:bg-gray-600 px-4 py-2">Save Client Data</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

const ContactRow = ({ index, contact, clickHandler }) => {
  return (
    <div className="flex flex-row border-b py-2">
      <div className="flex-grow">
        <span className="text-gray-700 font-semibold">{contact.name}</span>
        <span className="ml-2">{contact.phone ? contact.phone : '[no phone]'}</span>
        <span className="ml-2 text-blue-600">{contact.email ? contact.email : '[no email]'}</span>
      </div>
      <div className="flex flex-0 items-center leading-5">
        <button onClick={clickHandler} value={index} className="inline-block cursor-pointer px-1 rounded-sm hover:bg-gray-600 hover:text-white">&#10007;</button>
      </div>
    </div>
  )
}