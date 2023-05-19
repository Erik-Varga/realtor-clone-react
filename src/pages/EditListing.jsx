import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom";
import { BsListCheck } from "react-icons/bs";
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function EditListing() {
    const navigate = useNavigate();
    const auth = getAuth();
    const [geolocationEnabled, setGeoLocationEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [listing, setListing] = useState(null);

    const [formData, setFormData] = useState({
        type: "rent",
        name: "",
        bedrooms: 1,
        bathrooms: 1,
        parking: true,
        furnished: false,
        address: '',
        description: '',
        offer: true,
        regularPrice: 0,
        discountPrice: 0,
        latitude: 0,
        longitude: 0,
        images: {}
    });

    const { 
        type, 
        name, 
        bedrooms, 
        bathrooms, 
        parking, 
        furnished, 
        address, 
        description, 
        offer,
        regularPrice,
        discountPrice,
        latitude,
        longitude,
        images,
    } = formData;

    const params = useParams();

    useEffect(()=>{
        if (listing && listing.userRef !== auth.currentUser.uid) {
            toast.error("You are not authorized to edit this listing");
            navigate('/');
        }
    }, [auth.currentUser.uid, listing, navigate]);

    useEffect(()=>{
        // setLoading(true);
        async function fetchListing() {
            const docRef = doc(db, 'listings', params.listingId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setListing(docSnap.data());
                setFormData({...docSnap.data()});
                setLoading(false);
            } else {
                navigate('/');
                toast.error('Listing does not exist');
            }
        }
        fetchListing();
    }, [navigate, params.listingId]);



    function onChange(e) {
        let boolean = null;
        if (e.target.value === 'true') {
            boolean = true;
        }
        if (e.target.value === 'false') {
            boolean = false;
        }
        
        // Files
        if (e.target.files) {
           setFormData((prevState) => ({
            ...prevState,
            images: e.target.files,
           }));
        }

        // Text/Boolean/Number
        if (!e.target.files) {
           setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: boolean ?? e.target.value,
           }));
        }
    }

    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);

        if (+discountPrice >= +regularPrice) {
            setLoading(false);
            toast.error("Discount Price must be less Regular Price");
            return;
        }

        if (images.length > 6) {
            setLoading(false);
            toast.error("Maximum of 6 images allowed.");
            return;
        }

        let geolocation = {};
        let location;
        
        if (geolocationEnabled) {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`);
            const data = await response.json();
            console.log(data);
            geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
            geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

            location = data.status === "ZERO_RESULTS" && undefined;

            // || location.includes("undefined")
            if (location === undefined) {
                setLoading(false);
                toast.error("Please enter a valid address");
                return;
            }
        } else {
            geolocation.lat = latitude;
            geolocation.lng = longitude;
        }

        async function storeImage(image) {
            return new Promise((resolve, reject)=>{
                const storage = getStorage();
                const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
                const storageRef = ref(storage, filename);
                const uploadTask = uploadBytesResumable(storageRef, image);
                
                // Register three observers:
                // 1. 'state_changed' observer, called any time the state changes
                // 2. Error observer, called on failure
                // 3. Completion observer, called on successful completion

                uploadTask.on('state_changed', 
                (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                        default:
                            break;
                        }
                    }, 
                    (error) => {
                        // Handle unsuccessful uploads
                        reject(error)
                    }, 
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL);
                        });
                    }
                );
            });
        }

        const imgUrls = await Promise.all(
            [...images].map((image)=>storeImage(image))).catch((error)=>{
                setLoading(false);
                toast.error("Image(s) not uploaded");
                return;
            });
        
        const formDataCopy = {
            ...formData,
            imgUrls,
            geolocation,
            timestamp: serverTimestamp(),
            userRef: auth.currentUser.uid,
        };
        delete formDataCopy.images;
        !formDataCopy.offer && delete formDataCopy.discountPrice;
        delete formDataCopy.latitude;
        delete formDataCopy.longitude;
        const docRef = doc(db, 'listings', params.listingId);

        await updateDoc(docRef, formDataCopy);
        setLoading(false);
        toast.success('Listing edited');
        navigate(`/category/${formDataCopy.type}/${docRef}`);
    }

    if (loading) {
        return <Spinner />;
    }

  return (
    <main className='max-w-md px-2 mx-auto'>
        <h1 className='text-3xl text-center mt-6 font-bold'>Edit Listing</h1>
        <form onSubmit={onSubmit}>

            {/* Sell / Rent */}
            <p className='text-lg mt-3 font-semibold'>Sell / Rent</p>
            <div className='flex'>                
                <button className={`w-full mr-2 px-7 py-3 font-bold text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out 
                
                ${type === "rent" ? "bg-white text-black" : "bg-slate-600 text-white"}

                `} id='type' value="sell" type='button' onClick={onChange}>
                    Sell
                </button>

                <button className={`w-full ml-2 px-7 py-3 font-bold text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out 
                
                ${type === "sell" ? "bg-white text-black" : "bg-slate-600 text-white"}

                `} id='type' value="rent" type='button' onClick={onChange}>
                    Rent
                </button>
            </div>

            {/* Name */}
            <p className='text-lg mt-3 font-semibold'>Name</p>
            <div>
                <input className='w-full px-4 py-2 text-gray bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-blue-50 focus:border-slate-600' type='text' id='name' value={name} placeholder='Name' maxLength="32" minLength="2" onChange={onChange} required></input>
            </div>

            {/* Beds / Baths */}
            <div className='flex justify-evenly mt-3'>
                {/* Beds */}
                <div>
                    <p className='text-lg font-semibold'>Bedrooms</p>
                    <input className='w-full px-4 py-2 text-2xl text-center text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-blue-50 focus:border-slate-600' type='number' id='bedrooms' value={bedrooms} onChange={onChange} min="1" max="10" required />
                </div>

                {/* Baths */}
                <div>
                    <p className='text-lg font-semibold'>Bathrooms</p>
                    <input className='w-full px-4 py-2 text-2xl text-center text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-blue-50 focus:border-slate-600' type='number' id='bathrooms' value={bathrooms} onChange={onChange} min="1" max="5" required />
                </div>
            </div>

            {/* Parking */}
            <p className='text-lg mt-3 font-semibold'>Parking spot</p>
            <div className='flex'>                
                <button className={`w-full mr-2 px-7 py-3 font-bold text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out 
                
                ${!parking ? "bg-white text-black" : "bg-slate-600 text-white"}

                `} id='parking' value={true} type='button' onClick={onChange}>
                    Yes
                </button>

                <button className={`w-full ml-2 px-7 py-3 font-bold text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out 
                
                ${parking ? "bg-white text-black" : "bg-slate-600 text-white"}

                `} id='parking' value={false} type='button' onClick={onChange}>
                    No
                </button>

            </div>

            {/* Furnished */}
            <p className='text-lg mt-3 font-semibold'>Furnished</p>
            <div className='flex'>                
                <button className={`w-full mr-2 px-7 py-3 font-bold text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out 
                
                ${!furnished ? "bg-white text-black" : "bg-slate-600 text-white"}

                `} id='furnished' value={true} type='button' onClick={onChange}>
                    Yes
                </button>

                <button className={`w-full ml-2 px-7 py-3 font-bold text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out 
                
                ${furnished ? "bg-white text-black" : "bg-slate-600 text-white"}

                `} id='furnished' value={false} type='button' onClick={onChange}>
                    No
                </button>

            </div>

            {/* Address */}
            <p className='text-lg mt-3 font-semibold'>Address</p>
            <div>
                <textarea className='w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-blue-50 focus:border-slate-600' type="text" id='address' value={address} onChange={onChange} placeholder='Address' required>
                </textarea>

            </div>

            {!geolocationEnabled && (
                <div className='flex space-x-6 justify-start mb-6'>

                    {/* Latitude */}
                    <div className='text-lg font-semibold'>
                        <p>Latitude</p>
                        <input className='w-full px-4 py-2 text-center text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600' type='number' id='latitude' value={latitude} min='-90' max='90' step='any' onChange={onChange} required></input>
                    </div>

                    {/* Longitude */}
                    <div className='text-lg font-semibold'>
                        <p>Longitude</p>
                        <input className='w-full px-4 py-2 text-center text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600' type='number' id='longitude' value={longitude} min='-180' max='180' step='any' onChange={onChange} required></input>
                    </div>

                </div>
            )}

            {/* Description */}
            <p className='text-lg mt-3 font-semibold'>Description</p>
            <div>
                <textarea className='w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-blue-50 focus:border-slate-600' type="text" id='description' value={description} onChange={onChange} placeholder='Description' required>
                </textarea>
            </div>

            {/* Offer */}
            <p className='text-lg mt-3 font-semibold'>Offer</p>
            <div className='flex'>                
                <button className={`w-full mr-2 px-7 py-3 font-bold text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out 
                
                ${!offer ? "bg-white text-black" : "bg-slate-600 text-white"}
                
                `} id='offer' value={true} type='button' onClick={onChange}>
                    Yes
                </button>

                <button className={`w-full ml-2 px-7 py-3 font-bold text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out 
                
                ${offer ? "bg-white text-black" : "bg-slate-600 text-white"}
                
                `} id='offer' value={false} type='button' onClick={onChange}>
                    No
                </button>

            </div>

            {/* Regular Price / Discount Price */}
            <div className='flex flex-col justify-evenly'>
                {/* Regular Price */}
                <div>
                    <p className='mt-3 text-lg font-semibold'>Regular Price</p>
                    <div className='flex justify-center items-center'>
                    <input className='w-full px-4 py-2 text-right text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-blue-50 focus:border-slate-600' type='number' id='regularPrice' value={regularPrice} onChange={onChange} min="1" max="4000000" required />
                    
                    {type === "rent" && (
                        <div className='w-full ml-2'>
                        $ / Month
                        </div>
                    )}
                    </div>
                </div>

                {/* Discount Price */}
                <div>
                    {offer && (
                        <div>
                            <p className='mt-3 text-lg font-semibold'>Discount Price</p>
                            <div className='flex justify-center items-center'>
                                <input className='w-full px-4 py-2 text-right text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-blue-50 focus:border-slate-600' type='number' id='discountPrice' value={discountPrice} onChange={onChange} min="1" max="4000000" required />
                        
                                {type === "rent" && (
                                    <div className='w-full ml-2'>
                                    $ / Month
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className='w-full mb-10'>
                <p className='text-lg mt-3 font-semibold'>Images</p>
                <div className='mx-0'>
                <p className='text-gray-600'>The first image will be the cover (max 6)</p>
                <input className='w-full px-3 py-1.5 bg-white border border-gray-300 rounded focus:bg-white focus:border-slate-600 transition duration-150 ease-in-out' type='file' id="images" onChange={onChange} accept='.jpg,.jpeg,.png' multiple required></input>
                </div>
            </div>

            {/* Create Listing */}
            <button
              className="w-full mb-6 flex flex-col justify-center items-center px-7 py-3 bg-blue-600 text-white text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-150 ease-in-out active:bg-blue-800"
              type="submit"
            >
              <div className='flex justify-center items-center'>
                <BsListCheck className='mr-2 text-4xl bg-transparent rounded-full p-1 border-2' />&nbsp;
                Edit Listing
              </div>
            </button>
        </form>
    </main>
  )
}
