import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { BsListCheck } from "react-icons/bs";

export default function CreateListing() {
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
        discountPrice
    } = formData;

    function onChange() {

    }

  return (
    <main className='max-w-md px-2 mx-auto'>
        <h1 className='text-3xl text-center mt-6 font-bold'>Create a Listing</h1>
        <form>

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
              <Link to="/" className='flex justify-center items-center'>
                <BsListCheck className='mr-2 text-4xl bg-transparent rounded-full p-1 border-2' />&nbsp;
                Create Listing
              </Link>
            </button>
        </form>
    </main>
  )
}
