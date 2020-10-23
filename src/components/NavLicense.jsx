import Link from 'next/link'

export default function NavLicense({ slug, selected }) {
  const active = "bg-pink-200s px-3 mr-3z text-gray-800"
  const normal = "bg-pink-200s px-3 mr-3z text-gray-600 hover:text-gray-800"
  const innerActive = "block py-3 -mb-px border-b-2 border-gray-800"
  const innerNormal = "block py-3 -mb-px border-b-2 border-transparent"

  return (
    <div id="aces-fixed" className="bg-white z-50 tracking-wider border-b border-gray-400">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-row items-center text-sm antialiased">
          <Link href={`/${slug}`}>
            <a className={selected == 'license' ? active + ' -ml-3' : normal  + ' -ml-3'}>
              <span className={selected == 'license' ? innerActive : innerNormal}>
                Home
              </span>
            </a>
          </Link>
          <Link href={`/${slug}/projects`}>
            <a className={selected == 'projects' ? active : normal}>
              <span className={selected == 'projects' ? innerActive : innerNormal}>
                Projects
              </span>
            </a>
          </Link>
          <Link href={`/${slug}/clients`}>
            <a className={selected == 'clients' ? active : normal}>
              <span className={selected == 'clients' ? innerActive : innerNormal}>
                Clients
              </span>
            </a>
          </Link>
          <Link href={`/${slug}/settings`}>
            <a className={selected == 'settings' ? active : normal}>
              <span className={selected == 'settings' ? innerActive : innerNormal}>
                Settings
              </span>
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}