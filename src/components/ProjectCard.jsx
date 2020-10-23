export default function ProjectCard({ slug, project }) {
  return (
    <div className="h-64s bg-white rounded-lg border border-gray-400 px-6 pt-4 pbs-6 mb-10">
      <span className="float-right rounded-md border text-sm text-gray-600 leading-4 mt-1 px-4 py-2">Settings</span>
      <h4 className="text-xl text-blue-500 font-bold mb-8">{project.title}</h4>
      <div className="">
        <p className="text-sm leading-normal">
          <span className="bg-yellow-s200 inline-block w-20 text-rights text-gray-700 pr-3">Client:</span>
          <span className="text-8ray-700 font-semibolds">{project.clientId}</span>
        </p>
        <p className="text-sm leading-normal">
          <span className="bg-yellow-s200 inline-block w-20 text-rights text-gray-700 pr-3">Contact:</span>
          <span className="text-8ray-700 font-semibolds">{project.contact}</span>
        </p>
        <p className="text-sm leading-normal">
          <span className="bg-yellow-s200 inline-block w-20 text-rights text-gray-700 pr-3">Admin:</span>
          <span className="text-8ray-700 font-semibolds">{project.admin}</span>
        </p>
        <p className="text-sm leading-normal">
          <span className="bg-yellow-s200 inline-block w-20 text-rights text-gray-700 pr-3">Date:</span>
          <span className="text-8ray-700 font-semibolds">{project.startDate}</span>
        </p>
        <p className="text-sm mt-4 -mx-6 px-6 py-4 border-t leading-normal">
          <span className="bg-yellow-s200 inline-block w-20 float-left text-gray-700 pr-3">Modules:</span>
          <span className="text-gray-800 block font-semibolds ml-20">
          {project.modules.map(module => (
            <span className="inline-block rounded bg-indigo-200 border border-indigo-200 text-xs text-blue-700 font-semibold mr-2 mb-2 px-2 py-1">{module.slug}</span>
          ))}
          </span>
        </p>
      </div>
    </div>
  )
}