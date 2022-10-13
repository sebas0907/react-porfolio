import CodeIcon from "../icons/CodeIcon"

import { useSelector } from 'react-redux';

export default function Projects() {

    const projects = useSelector(state=>state.projects);

    return (
      <section id="projects" className="text-white bg-indigo-900 body-font">
          <div className="container px-5 py-10 mx-auto text-center lg:px-40">
              <div className="flex flex-col w-full mb-20">
                  <CodeIcon />
                  <h1 className="sm:text-4xl text-3xl font-medium title-font mb-4 text-white">Apps I've Built</h1>
                  <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Here you can find some funny apps (at least the fully working ones) in few lines of code.</p>
              </div>
          <div className="flex flex-wrap -m-4">
            {projects.map((project,i) => (
              <a
                href={project.link}
                key={i}
                target="_blank"
                rel="noreferrer"
                className="sm:w-1/2 w-100 p-4">
                <div className="flex relative">
                  <div className="px-8 py-10 relative z-10 w-full border-4 border-gray-400 bg-indigo-900 hover:opacity-80">
                    <h2 className="tracking-widest text-sm title-font font-medium text-green-400 mb-1">
                      {project.subtitle}
                    </h2>
                    <h1 className="title-font text-lg font-medium text-white mb-3">
                      {project.title}
                    </h1>
                    <p className="leading-relaxed">{project.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    );
}