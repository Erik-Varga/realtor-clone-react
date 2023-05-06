import React from 'react'
import { Link } from "react-router-dom";
import { AiFillGithub } from "react-icons/ai";
import { BsCodeSlash } from "react-icons/bs";

export default function Footer() {
  return (
    <div className='flex justify-center items-center card-footer m-1 p-1 text-sm hover:text-blue-600 hover:font-semibold transition duration-400 ease-in-out'>
        <span>
          <Link to="https://github.com/Erik-Varga" target="_blank" className='flex items-center justify-center'>
              &copy; {(new Date().getFullYear())} Erik Varga | Web Developer 
              
              <AiFillGithub className='ml-1' />
          </Link>
        </span>
        
        <span>
        <Link to="https://github.com/Erik-Varga/realtor-clone-react" target="_blank" className='flex items-center justify-center'>
          &nbsp;
          Source Code &nbsp;<BsCodeSlash />
        </Link>
        </span>
    </div>
  )
}
