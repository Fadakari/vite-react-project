import React from 'react';
import PostCard from './PostCard';

// کامپوننت JobCard به عنوان یک پوشش سازگار برای PostCard کار می‌کند
const JobCard = (props) => {
  return <PostCard {...props} />;
};

export default JobCard;