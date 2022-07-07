import ChipIcon from "../icons/ChipIcon"
import BadgeCheckIcon from "../icons/BadgeCheckIcon";
import ExternalLinkIcon from "../icons/ExternalLinkIcon";

import { useSelector } from 'react-redux';

export default function Skills() {

    const skills = useSelector(state=>state.skills);

    return (
      <section id="skills">
        <div className="container px-5 py-10 mx-auto">
          <div className="text-center mb-20">
            <ChipIcon />
            <h1 className="sm:text-4xl text-3xl font-medium title-font mb-4">
              Skills &amp; Technologies
            </h1>
            <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">
              List of my recent stack. This is what I use in my day-to-day projects: 
            </p>
          </div>
          <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
            {skills.map((skill) => (
              <div key={skill.description} className="p-2 sm:w-1/2 w-full">
                <div className="bg-gray-800 rounded flex p-4 h-full items-center">
                  <BadgeCheckIcon />
                  <span className="title-font font-medium text-white">
                    {skill.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mx-auto mt-10">
            <a href="https://resume.io/r/Fgo9J9SCI" 
            target="_blank"
            rel="noreferrer"
            className="text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg">
              Check out my CV <ExternalLinkIcon /></a>
          </div>
        </div>
      </section>
    );
  }