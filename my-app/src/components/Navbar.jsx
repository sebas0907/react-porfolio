
import ArrowRightIcon from "../icons/ArrowRightIcon";
import { Link } from 'react-router-dom';
import { NavHashLink } from "react-router-hash-link";

export default function Navbar() {

  return (
    <header className="bg-black md:sticky top-0 z-10">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <div className="title-font font-medium text-white mb-4 md:mb-0">
          <Link to="/" reloadDocument><img src="android-chrome-512x512.png" alt="logo" width="40px" className="rounded-full ml-3"/></Link> 
        </div>
        <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-700	flex flex-wrap items-center text-base justify-center">
          <NavHashLink to="/#about" className="mr-5 text-white hover:text-gray-100">
            About Me
          </NavHashLink>
          <NavHashLink to="/#projects" className="mr-5 text-white hover:text-gray-100">
            Past Work
          </NavHashLink>
          <NavHashLink to="/#skills" className="mr-5 text-white hover:text-gray-100">
            Skills
          </NavHashLink>
        </nav>
        <NavHashLink to="/#contact" className="text-white inline-flex items-center bg-purple-800 border-0 py-1 px-3 focus:outline-none hover:bg-purple-700 rounded text-base mt-4 md:mt-0">
          Contact Me
          <ArrowRightIcon />
        </NavHashLink>
      </div>
    </header>
  );
}