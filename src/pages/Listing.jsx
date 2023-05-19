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

export default function Listing() {
    const navigate = useNavigate();
    const auth = getAuth();

    // const [geolocationEnabled, setGeoLocationEnabled] = useState(false);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
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
    </main>
  );
}
