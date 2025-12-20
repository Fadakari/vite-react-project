import React from 'react';
import PostCard from '../components/PostCard';

const Blog = () => {
  return (
    <div className="pt-24 md:pt-44 w-full container mx-auto px-4 max-w-6xl">
      <h1 className="text-center font-bold text-xl md:text-2xl text-primary mb-8 md:mb-10">
        آخرین نوشته‌های بلاگ
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
         {[...Array(8)].map((_, index) => (
            <PostCard key={index} />
         ))}
      </div>
    </div>
  );
};

export default Blog;