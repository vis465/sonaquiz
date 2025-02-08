import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../lottie/four.json';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};

const Fourzerofour = () => {
  return (
    <>
      <div 
        className="flex flex-col justify-center items-center h-screen w-full bg-gray-100" // Flexbox container
        style={{ backgroundColor: '#f8f8f8' }} // Optional background color
      >
        <Lottie 
          options={defaultOptions}
          height={500} // Larger height
          width={500}  // Larger width
        />
        
        {/* Centered and visually appealing button */}
        <button 
          className="mt-6 bg-blue-500 text-white text-lg font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-red-600 transition-all duration-300"
          onClick={()=>{window.history.go(-1)}}
        >
          GO BACK
        </button>
      </div>
    </>
  );
};

export default Fourzerofour;
