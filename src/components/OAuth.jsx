import React from 'react'
import { FcGoogle } from "react-icons/fc";

export default function OAuth() {
  return (
    <button className="w-full flex items-center justify-center px-7 py-3 bg-red-600 text-white text-sm font-medium uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg transition duration-150 ease-in-out active:bg-red-800"
    type="submit">
      <FcGoogle className='mr-2 bg-white rounded-full text-2xl' /> Continue with Google
    </button>
  )
}
