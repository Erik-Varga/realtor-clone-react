import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { EffectFade, Autoplay, Navigation, Pagination } from 'swiper';
import "swiper/css/bundle";
import { FaShare, FaBath, FaBed, FaParking, FaChair } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import Contact from "../components/Contact";

export default function Listing() {
    const navigate = useNavigate();
    const auth = getAuth();

    // const [geolocationEnabled, setGeoLocationEnabled] = useState(false);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);
    const [contactLandlord, setContactLandlord] = useState(false);
    SwiperCore.use([Autoplay, Navigation, Pagination]);
    
    const params = useParams();

    useEffect(()=>{
        async function fetchListing() {
            const docRef = doc(db, 'listings', params.listingId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setListing(docSnap.data());
                // setFormData({...docSnap.data()});
                setLoading(false);
            } else {
                navigate('/');
                toast.error('Listing does not exist');
            }
        }
        fetchListing();
    }, [navigate, params.listingId]);
    
    if (loading) {
        return <Spinner />;
    }

  return (
    <main>
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[EffectFade]}
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-[300px]"
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className='fixed top-[7%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center' onClick={()=>{
        navigator.clipboard.writeText(window.location.href);
        setShareLinkCopied(true);
        setTimeout(()=>{
          setShareLinkCopied(false);
        }, 3000);
      }}>
        <FaShare className='text-lg text-slate-500'/>
      </div>
      {shareLinkCopied && (
        <p className='fixed top-[7%] right-[15%] z-20 font-semibold border-2 border-gray-200 round-md bg-white text-green-800 p-2'>Link Copied!</p>
      )}

      <div className='flex flex-col md:flex-row max-w-6xl lg:mx-auto m-4 p-4 rounded-lg border-3 shadow-lg lg:space-x-4'>
        <div className='w-full'>
          <p className='text-2xl font-bold mb-3 text-blue-900'>
            {listing.name} - 
            $
            {listing.offer
            ? listing.discountPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
            : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            {listing.type === "rent" ? " / month" : ""}
          </p>
          <p className='flex items-center mt-6 mb-3 font-semibold mr-1'>
            <MdLocationOn className='h-4 w-4 text-green-600' />
            {listing.address}
          </p>
          <div className='flex justify-start items-center space-x-4 w-[75%]'>
            <p className='bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md'>{listing.type === "rent" ? "Rent" : "Sale"}</p>
            {listing.offer && (
            <p className='bg-green-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md'>${listing.regularPrice - listing.discountPrice} discount</p>
            )}
          </div>
          <p className='font-semibold mt-3 mb-3'>
            Description - <span>{listing.description}</span>
          </p>
          <div className='flex flex-col items-center mt-[10px] space-x-3'>
            <ul className='w-full flex items-center justify-evenly mb-6'>
              <li className='flex items-center font-bold text-xs gap-1'>
                <FaBed className='text-[20px]' />
                {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
              </li>
              <li className='flex items-center font-bold text-xs gap-1'>
                <FaBath className='text-[18px]' />
              {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}</li>
              <li className='flex items-center font-bold text-xs gap-1'>
              <FaParking className='text-[18px]' />
                {listing.parking ? `${listing.bedrooms} Parking Spot Available` : "No Parking"}
              </li>
              <li className='flex items-center font-bold text-xs gap-1'>
              <FaChair className='text-[18px]' />
                {listing.furnished ? `${listing.bathrooms} Furnished` : "Not Furnished"}
              </li>
            </ul>
          </div>
          {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
          <div className='mt-6'>
            <button className='px-7 py-3 bg-blue-600 text-center text-white font-medium text-sm uppercase rounded shadow-md w-full hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg transition duration-150 ease-in-out' onClick={()=> setContactLandlord(true)}>Contact Landlord</button>
          </div>
          )}
          {/* if contactLandlord is true, than show contact compoenent */}
          {contactLandlord && (
            <Contact userRef={listing.userRef} listing={listing} />
          )}
        </div>
        <div className='bg-blue-300 w-full h-[200px] lg-[400] z-10 overflow-x-hidden'></div>
      </div>
      
    </main>
  );
}
