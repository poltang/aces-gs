import Link from 'next/link'

export default function NavProject({ project, selected }) {
  const _active = "bg-pink-200s px-3 mr-3z text-gray-800"
  const _normal = "bg-pink-200s px-3 text-gray-600 hover:text-gray-800"
  const active = "bg-pink-200s px-3 -mb-px text-gray-800 leading-10"
  const normal = "bg-pink-200s px-3 -mb-px text-gray-600 leading-10 hover:text-gray-800"
  const _innerActive = "block py-3 -mb-px border-b-2 border-gray-800"
  const _innerNormal = "block py-3 -mb-px border-b-2 border-transparent"
  const innerActive = "project-nav py-1 -mb-1s block"
  const innerNormal = "block py-1 -mb-p1x "

  return (
    <div id="aces-fixed" className="bg-white z-50 tracking-wider border-b border-gray-400">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-row items-center text-sm antialiased">
          <Link href={`/${project.license}/projects/${project._id}`}>
            <a className={selected == 'overview' ? active + ' -ml-3' : normal  + ' -ml-3'}>
              <span className={selected == 'overview' ? innerActive : innerNormal}>
                Overview
              </span>
            </a>
          </Link>
          <Link href={`/${project.license}/projects/${project._id}/modules`}>
            <a className={selected == 'modules' ? active : normal}>
              <span className={selected == 'modules' ? innerActive : innerNormal}>
                Modules
              </span>
            </a>
          </Link>
          <Link href={`/${project.license}/projects/${project._id}/personas`}>
            <a className={selected == 'personas' ? active : normal}>
              <span className={selected == 'personas' ? innerActive : innerNormal}>
                Personas
              </span>
            </a>
          </Link>
          <Link href={`/${project.license}/projects/${project._id}/settings`}>
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