import React from 'react'
import { Link } from "react-router-dom";
import { AiFillGithub } from "react-icons/ai";

export default function Footer() {
  return (
    <div className='card-footer m-2 p-2 hover:text-blue-600 hover:font-semibold transition duration-400 ease-in-out'>
        <Link to="https://github.com/Erik-Varga" target="_blank" className='flex items-center justify-center'>
            &copy; {(new Date().getFullYear())} Erik Varga | Web Developer 
            
            <AiFillGithub className='ml-1' />
        </Link>
    </div>


    // <div>
    //   <a href="https://github.com/Erik-Varga" target="_blank">&copy; <script>document.write(new Date().getFullYear())</script> Erik Varga | Web Developer <i class="fa-brands fa-github"></i></a>
    // </div>



  )
}
