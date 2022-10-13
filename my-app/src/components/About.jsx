//import foto from '../profileudnie.jpeg';

import { HashLink } from "react-router-hash-link";

export default function About() {
  return (
    <section id="about">
      <div className="container mx-auto flex px-10 py-20 md:flex-row flex-col items-center">
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-justify">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-center">
            Hi, I'm Sebastian Arenas.
            <br className="hidden lg:inline-block" /> 
          </h1>
          <h2 className="sm:text-3xl text-2xl mb-4 font-normal text-purple-600 text-center">Physicst, Developer and Data Scientist.</h2>
          <p className="mb-8 leading-relaxed">
          Born in Colombia now based in Cologne, Germany, I am an independent Physicst and Developer working on understanding some of the laws of nature 
          while attempting to keep track of the non-stopping advance of new technologies. Majored in physics with a M.Sc. in 
          theoretical physics at the University of Cologne, I have focused mainly on General Relativity, Black Hole physics and 
          ultimately Quantum Gravity and have been since the last couple of years fully dedicated on multiple 
          areas, working on new projects in Machine-, Deep-Learning, Backend/Frontend Development and Cloud Computing. The purpose of this site is twofold: to serve as a playground for whatever
          ideas I want to develope and deploy and finally to give a general showcase of my curriculum and portfolio of activities.

          Hit me up in case you want to know more!  
          </p>
          <div className="flex justify-center text-center">
            <HashLink
              to="/#projects"
              className="inline-flex text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded md:text-lg text-sm">
              See my Work
            </HashLink>
            <HashLink 
              to="/yolo"
              className="ml-4 inline-flex text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded md:text-lg text-sm">
              Object Detection
            </HashLink>
            <HashLink 
              to="/transfer"
              className="ml-4 inline-flex text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded md:text-lg text-sm">
              Style Transfer
            </HashLink>
          </div>
        </div>
        <div className="block text-center lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
          <figure className="inline-block" >
            <img className="object-cover object-center block ml-auto mr-auto rounded-full w-60 h-60 sm:w-80 sm:h-80" width="150" height="auto" alt="dude" 
            src="images/profiletoon.jpeg"/>
            <figcaption className="pt-2 font-medium text-gray-500">Image generated via Neural Style Transfer with <a className="text-green-500 hover:text-green-400" href="https://ml5js.org" target="_blank" rel="noreferrer">ml5.js</a>.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}