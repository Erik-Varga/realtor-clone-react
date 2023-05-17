import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";
import { db } from "../firebase"
import { doc, getDocs, query, where, orderBy, updateDoc, collection } from "firebase/firestore";
import { toast } from 'react-toastify';
import { FcHome } from "react-icons/fc";
import ListingItem from '../components/ListingItem'

export default function Profile() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [changeDetail, setChangeDetail] = useState(false);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData ] = useState({
    fullname: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { fullname, email } = formData;

  function onLogout() {
    auth.signOut();
    navigate("/");
  }

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmit() {
    try {
      if (auth.currentUser.displayName !== fullname) {
        // update displayName in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: fullname,
        });

        // update fullname in firestore
        const docRef = doc(db, "users", auth.currentUser.uid);
        const data = { fullname };
        await updateDoc(docRef, data);
      }
      toast.success("Profile details updated.");
    } catch (error) {
      console.log(error);
      toast.error("Could not update the profile details.");
    }
  }

  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
      const q = query(listingRef, where("userRef", "==", auth.currentUser.uid), orderBy("timestamp", "desc"));
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);

  return (
    <>
      <section className="max-width-6xl mx-auto flex flex-col justify-center items-center">
        <h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
        <div className="w-full md:w-[60%] mt-6 px-3">
          <form>
            {/* Name Input */}
            <input
              type="text"
              id="fullname"
              value={fullname}
              disabled={!changeDetail}
              className={`w-full mb-4 px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-300 ease-in-out ${
                changeDetail && "bg-blue-100 focus:bg-blue-100"
              }`}
              onChange={onChange}
            ></input>

            {/* Email Input */}
            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="w-full mb-4 px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-300 ease-in-out"
            ></input>

            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
              <p className="mb-6">
                Do you want to change your profile?
                <Link
                  to="/profile"
                  className="text-red-600 hover:text-blue-700 hover:font-semibold transition duration-800 ease-in-out ml-1"
                  onClick={() => {
                    changeDetail && onSubmit();
                    setChangeDetail((prevState) => !prevState);
                  }}
                >
                  {changeDetail ? "Apply change" : "Edit"}
                </Link>
              </p>
              <p
                className="text-blue-600 hover:text-red-800 hover:font-semibold transition duration-800 ease-in-out cursor-pointer"
                onClick={onLogout}
              >
                Sign Out
              </p>
            </div>

            {/* Login */}
            <button
              className="w-full flex flex-col justify-center items-center px-7 py-3 bg-blue-600 text-white text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-150 ease-in-out active:bg-blue-800"
              type="submit"
            >
              <Link
                to="/create-listing"
                className="flex justify-center items-center"
              >
                <FcHome className="mr-2 text-4xl bg-red-200 rounded-full p-1 border-2" />
                &nbsp; Rent or Sell Your Home
              </Link>
            </button>
          </form>
        </div>
      </section>
      <div>
        {!loading && listings.length > 0 && (
          <div className='max-w-6xl px-3 mt-6 mx-auto'>
            <h2 className="text-2xl text-center font-semi">My Listings</h2>
            <ul>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
