import React from 'react'
import { FcGoogle } from "react-icons/fc";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from 'react-toastify';
import { db } from "../firebase"
import { serverTimestamp, getDoc, setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const navigate = useNavigate();

  async function onGoogleClick() {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // check for existing user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          fullname: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {
      toast.error("Could not authorize with Google");
    }
  }

  return (
    <button className="w-full flex items-center justify-center px-7 py-3 bg-red-600 text-white text-sm font-medium uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg transition duration-150 ease-in-out active:bg-red-800" onClick={onGoogleClick}
    type="button">
      <FcGoogle className='mr-2 bg-white rounded-full text-2xl' /> Continue with Google
    </button>
  )
}
