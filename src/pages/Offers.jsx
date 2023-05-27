import React, { useEffect, useState } from 'react';
import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import { db } from '../firebase';
import ListingItem from '../components/ListingItem';
import Spinner from '../components/Spinner';

export default function Offers() {
// Offers
const [offerListings, setOfferListings] = useState(null);
const [loading, setLoading] = useState(true);
const [lastFetchListing, setLastFetchListing] = useState(null);

useEffect(()=>{
  async function fetchListings() {
    try {
      // gets the reference
      const listingsRef = collection(db, 'listings')
      // creates the query
      const q = query(listingsRef, where('offer', '==', true), orderBy('timestamp', 'desc'), limit(8));
      
      // executes the query
      const querySnap = await getDocs(q);

      // configures state for last visible listing
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchListing(lastVisible);

      // saves data inside variable
      let listings = [];
      querySnap.forEach((doc)=>{
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setOfferListings(listings);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }
    fetchListings();
  }, []);

  async function onFetchMoreListings() {
    try {
      // gets the reference
      const listingsRef = collection(db, 'listings')
      // creates the query
      const q = query(listingsRef, where('offer', '==', true), orderBy('timestamp', 'desc'), startAfter(lastFetchListing), limit(4));
      
      // executes the query
      const querySnap = await getDocs(q);

      // configures state for last visible listing
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchListing(lastVisible);

      // saves data inside variable
      let listings = [];
      querySnap.forEach((doc)=>{
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setOfferListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='max-w-6xl mx-auto pt-4 space-y-6'>

    {loading ? (<Spinner />) : offerListings && offerListings.length > 0 ? (
    <>
    <div className='m-2 mb-6'>
        <h2 className='px-3 text-2xl mt-6 font-semibold'>Offers</h2>

        <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'>
          {offerListings.map((listing) => (
            <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
          ))}
        </ul>
        {/* if lastFetchListing is true, then */}
        {lastFetchListing && (
          <div className='flex justify-center item-center'>
            <button onClick={onFetchMoreListings} className='bg-white px-3 py-1.5 text-gray-700 border border-gray-300 m-6 hover:border-slate-600 rounded transition duration-150 ease-in-out'>Load more</button>
          </div>
        )}
      </div>
    </>
    ) : (
      <p>There are no current offers</p>
    )}


    </div>
  )
}
