import React from 'react';
import studyImage2 from '../../assets/images/study-imge2.jpg';

export default function Main() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
      <img 
        src={studyImage2} 
        alt="Asosiy sahifa rasmi" 
        className="max-w-full h-auto rounded-lg shadow-md"
      />
    </div>
  );
}