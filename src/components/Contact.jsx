import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';

export default function Contact({ userRef, listing }) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(()=> {
        async function getLandlord() {
            const docRef = doc(db, 'users', userRef);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setLandlord(docSnap.data());
            } else {
                toast.error('Could not get landlord data');
            }
        }
        getLandlord();
    }, [userRef]);

    function onChange(e) {
        setMessage(e.target.value);
    }
  
    return (
    <>
        {/* if landlord is not equal to null then show email */}
        {/* {landlord !== null && landlord.email} */}
        <div className='flex flex-col w-full'>

            <p>Contact Erik for the {listing.name.toLowerCase()}</p>
            <div className='mt-3 mb-6'>

            {/* <p>Contact {landlord.name} for the {listing.name.toLowerCase()}</p> */}

                <textarea className='w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border border-gray-800 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600' name="message" id="message" rows="2" value={message} onChange={onChange}></textarea>
            </div>

            <a href={`mailto:spudev50@gmail.com?Subject=${listing.name}&body={message}`}>
            
            {/* <a href={`mailto:${landlord.email}?Subject=${listing.name}&body={message}`}> */}

                <button className='w-full px-7 py-3 bg-blue-600 text-white text-sm text-center uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out' type='button'>Send Message</button>
            </a>
        </div>

    </>
  )
}
