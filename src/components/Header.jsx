import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from "react-router"
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setPageState('Profile')
        } else {
          setPageState('Login')
        }
      })
    }, [auth])

    const [pageState, setPageState] = useState('Login');

    function pathMatchRoute(route) {
        if (route === location.pathname) {
            return true
        }
    }

  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-40">
      <header className="flex justify-between items-center px-3 max-w-6xl mx-auto">
        <div>
            <img src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg" alt="logo" className="h-5 cursor-pointer" onClick={()=>navigate("/")} />
        </div>
        <div>
            <ul className="flex space-x-5">
                <li className={`py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent cursor-pointer ${pathMatchRoute("/") && "text-black border-b-red-500"}`} onClick={()=>navigate("/")} >Home</li>

                {/* <li className={`py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent cursor-pointer ${pathMatchRoute("/offers") && "text-black border-b-red-500"}`} onClick={()=>navigate("/offers")} >Offers</li> */}
                
                <li className={`py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent cursor-pointer ${pathMatchRoute("/contactAdmin") && "text-black border-b-red-500"}`} onClick={()=>navigate("/contactAdmin")} >Contact</li>

                <li className={`py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent cursor-pointer ${(pathMatchRoute("/login") || pathMatchRoute("/profile")) && "text-black border-b-red-500"}`} onClick={()=>navigate("/profile")} >{pageState}</li>
            </ul>
        </div>
      </header>
    </div>
  )
}
