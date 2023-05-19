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
import { FaShare } from 'react-icons/fa';

export default function Listing() {
    const navigate = useNavigate();
    const auth = getAuth();

    // const [geolocationEnabled, setGeoLocationEnabled] = useState(false);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);
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
    </main>
  );
}
