import React from 'react';

const Header = () => {
  return (
    <div className="relative flex items-center justify-center h-20 border-b border-gray-700 shadow-2xl overflow-hidden"
         style={{
           background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)'
         }}>
      {/* Animated background */}
      <div className="absolute inset-0 opacity-60"
           style={{
             background: 'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)'
           }} />
      
      {/* Main title */}
      <h1 className="text-4xl md:text-5xl font-black tracking-wide relative z-10 bg-gradient-to-r from-green-400 via-purple-500 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
        Let's Draw
      </h1>
      
      {/* Decorative dots */}
      <div className="absolute left-1/4 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-400" />
      <div className="absolute right-1/4 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-purple-500 shadow-lg shadow-purple-500" />
    </div>
  );
};

export default Header;