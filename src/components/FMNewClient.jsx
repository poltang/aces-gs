import { useState } from 'react'

export default function Form({ license }) {
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

  return (
    <div className="bg-gray-200 bg-gradient-to-bs sfrom-indigo-100 bg-opacity-25 px-4 sm:px-6">
      <div className="max-w-xl mx-auto py-24">
        <div className="rounded-lg bg-blue-200 bg-opacity-50 p-1 -m-1">
          <div className="bg-white antialiased rounded-md border border-blue-400">
            {/* title */}
            <div className="flex flex-row px-6 py-6 items-end border-b">
              <div className="flex-grow">
                <h1 className="text-gray-800 text-2xl font-semibold">New Client</h1>
                <p className="text-gray-600 text-sm">{license.licenseName}</p>
              </div>
              <div className="flex-0">
                <p className="rounded-md border text-sm text-gray-600 px-3 py-1">
                  Cancel
                </p>
              </div>
            </div>
            {/* body */}
            <div className="px-6 py-8">
              <div className="MAIN">
                <label className="block text-sm text-gray-500 uppercase mb-4">
                  <div className="mb-2">Nama perusahaan</div>
                  <input type="text" className={inputNormal} />
                </label>
                <label className="block text-sm text-gray-500 uppercase mb-4">
                  <div className="mb-2">Alamat</div>
                  <input type="text" className={inputNormal} />
                </label>
                <label className="block text-sm text-gray-500 uppercase mb-4">
                  <div className="mb-2">Kota</div>
                  <input type="text" className={inputNormal} />
                </label>
                <label className="block text-sm text-gray-500 uppercase mb-4">
                  <div className="mb-2">Telepon</div>
                  <input type="text" className={inputNormal} />
                </label>
              </div>
              <div className="CLIENT-CONTACT bg-gray-100 rounded-md border mt-8">
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
                      {contactList.map((contact, index) => (
                        <div key={`CT${index}`} className="flex flex-row border-b py-2">
                          <div className="flex-grow">
                            <span className="text-gray-700 font-semibold">{contact.name}</span>
                            <span className="ml-2">{contact.phone ? contact.phone : '[no phone]'}</span>
                            <span className="ml-2 text-blue-600">{contact.email ? contact.email : '[no email]'}</span>
                          </div>
                          <div className="flex flex-0 items-center leading-5">
                            <button value={index} className="inline-block cursor-pointer px-1 rounded-sm hover:bg-gray-600 hover:text-white">&#10007;</button>
                          </div>
                        </div>
                      ))}

                    </div>
                  </div>
                  </>
                )}
              </div>
            </div>
            {/* bottom */}
            <div className="flex flex-row border-t border-gray-400 px-6 py-8">
              <div className="flex-grow">
                <button className="rounded-md border border-gray-400 text-gray-500 font-semibold px-4 py-2">Cancel</button>
              </div>
              <div className="flex-0">
                <button className="rounded-md border border-gray-400 text-gray-500 font-semibold px-4 py-2">Save Client Data</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// export function ContactRow({ index, contact }) {
//   return (
//     <div className="flex flex-row border-b py-2">
//       <div className="flex-grow">
//         <span className="text-gray-700 font-semibold">{contact.name}</span>
//         <span className="ml-2">{contact.phone ? contact.phone : '[no phone]'}</span>
//         <span className="ml-2 text-blue-600">{contact.email ? contact.email : '[no email]'}</span>
//       </div>
//       <div className="flex flex-0 items-center leading-5">
//         <button value={index} className="inline-block cursor-pointer px-1 rounded-sm hover:bg-gray-600 hover:text-white">&#10007;</button>
//       </div>
//     </div>
//   )
// }