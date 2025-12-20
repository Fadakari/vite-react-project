import React from 'react';
import SearchBox from '../components/SearchBox';
import PostCard from '../components/PostCard';
import { FaPhone } from "react-icons/fa";

const Home = () => {
  return (
    <div className="pt-24 md:pt-60 w-full transition-all duration-300"> 
      
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* باکس سفید بالا: در موبایل ارتفاع کمتر و گوشه ها کمی تیزتر */}
        <div className="bg-white rounded-tl-[5rem] rounded-br-[5rem] md:rounded-tl-[5rem] md:rounded-br-[5rem] w-full h-40 md:h-80 shadow-sm mb-8 md:mb-12"></div>

        <div className="mb-12 md:mb-16">
            <SearchBox />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            <PostCard />
            <PostCard />
            <PostCard />
            <PostCard />
        </div>

      </div>

      <div className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-40">
        <button className="bg-primary text-white p-3 md:p-4 rounded-full shadow-lg hover:scale-110 transition flex items-center justify-center">
            <FaPhone className="text-xl md:text-2xl transform scale-x-[-1]" />
        </button>
      </div>

    </div>
  );
};

export default Home;