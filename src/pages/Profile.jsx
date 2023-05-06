import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

export default function Profile() {
  const navigate = useNavigate();

  const auth = getAuth();

  const [formData, setFormDate ] = useState({
    fullname: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { fullname, email } = formData;

  function onLogout() {
    auth.signOut();
    navigate("/");
  }

  return (
    <section className='max-width-6xl mx-auto flex flex-col justify-center items-center'>
      <h1 className='text-3xl text-center mt-6 font-bold'>My Profile</h1>
      <div className='w-full md:w-[50%] mt-6 px-3'>
        <form>
          {/* Name Input */}
          <input type='text' id='fullname' value={fullname} disabled className='w-full mb-4 px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-300 ease-in-out'></input>
          
          {/* Email Input */}
          <input type='email' id='email' value={email} disabled className='w-full mb-4 px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-300 ease-in-out'></input>

          <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
              <p className="mb-6">
                Do you want to change your profile?
                <Link
                  to="/profile"
                  className="text-red-600 hover:text-blue-700 hover:font-semibold transition duration-800 ease-in-out ml-1"
                >
                  Edit
                </Link>
              </p>
              <p className="text-blue-600 hover:text-red-800 hover:font-semibold transition duration-800 ease-in-out cursor-pointer" onClick={onLogout}
                >
                  Sign Out
              </p>
            </div>

            {/* Login */}
            {/* <button
              className="w-full px-7 py-3 bg-blue-600 text-white text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-150 ease-in-out active:bg-blue-800"
              type="submit"
            >
              Register
            </button> */}


        </form>
      </div>
    </section>
  )
}
