import React, { useState } from "react";

export default function ContactAdmin() {
  const [message, setMessage] = useState("");

  function onChange(e) {
    setMessage(e.target.value);
  }

  return (
    <div className="flex justify-center items-center m-4">
      <div className="flex flex-col w-[90%]">
        <h1 className="font-semibold text-2xl">Contact Erik</h1>&nbsp;

        <div className="ml-2 mb-6">
            <img className="border border-gray-300 w-[100px] h-[100px] mb-1" style={{ filter: "grayscale(100%)" }} src="https://avatars.githubusercontent.com/u/67766949?v=4" alt="profile" />
            Erik Varga | Web Developer
            <div>
                <a className="text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out" href="mailto:spudev50@gmail.com">spudev50@gmail.com</a>
            </div>
        </div>

        <div className="mb-6">
          Message:
          <textarea
            className="w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border border-gray-800 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
          ></textarea>
        </div>
        <a href={`mailto:spudev50@gmail.com?Subject='Message'&body={message}`}>
          <button
            className="w-full px-7 py-3 bg-blue-600 text-white text-sm text-center uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            type="button"
          >
            Send Message
          </button>
        </a>
      </div>
    </div>
  );
}
