// import React from 'react'

// const Nav = ({ setMode }) => {
//   return (
//     <div className='bg-neutral-800 h-20 flex items-center justify-around text-2xl border-b-1 border-b-emerald-800'>
//       <button 
//         onClick={() => setMode("text")} 
//         className='text-white rounded-2xl bg-green-700 px-4 py-3'
//       >
//         Write
//       </button>

//       <button 
//         onClick={() => setMode("shapes")} 
//         className='text-white rounded-2xl bg-green-700 px-4 py-3'
//       >
//         Shapes
//       </button>

//       <button 
//         onClick={() => setMode("freedraw")} 
//         className='text-white rounded-2xl bg-green-700 px-4 py-3'
//       >
//         Freedraw
//       </button>
//     </div>
//   )
// }

// export default Nav


import React, { useState } from 'react';

const Navigation = ({ activeModule, setActiveModule }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const modules = [
    { id: 'write', name: 'Write Mode', icon: '✎', color: 'from-green-400 to-emerald-600' },
    { id: 'shapes', name: 'Shape Mode', icon: '⬜', color: 'from-purple-400 to-purple-600' },
    { id: 'freeDraw', name: 'Draw Mode', icon: '🖌️', color: 'from-blue-400 to-blue-600' }
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center justify-center space-x-8 px-6 py-4 bg-gray-900 border-b border-gray-800 shadow-lg">
        {modules.map((module) => (
          <button
            key={module.id}
            onClick={() => setActiveModule(module.id)}
            className={`relative px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
              activeModule === module.id
                ? `bg-gradient-to-r ${module.color} text-white shadow-lg`
                : 'text-gray-400 hover:text-gray-200 bg-gray-800 hover:bg-gray-750'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{module.icon}</span>
              <span>{module.name}</span>
            </div>
            
            {/* Active indicator */}
            {activeModule === module.id && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-green-400 to-purple-500 rounded-full shadow-lg" />
            )}
          </button>
        ))}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-gray-900 border-b border-gray-800 shadow-lg">
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          <div className="text-gray-300 font-semibold text-sm">
            {modules.find(m => m.id === activeModule)?.name}
          </div>
          
          <div className={`w-3 h-3 rounded-full ${
            activeModule === 'write' ? 'bg-green-400' :
            activeModule === 'shapes' ? 'bg-purple-500' : 'bg-blue-500'
          }`} />
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="px-4 pb-4 space-y-2 bg-gray-800 border-t border-gray-700">
            {modules.map((module) => (
              <button
                key={module.id}
                onClick={() => {
                  setActiveModule(module.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-lg font-semibold text-left transition-all ${
                  activeModule === module.id
                    ? `bg-gradient-to-r ${module.color} text-white shadow-lg`
                    : 'text-gray-400 hover:text-gray-200 bg-gray-750'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{module.icon}</span>
                  <span>{module.name}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-2 border-b border-gray-800">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Online</span>
            </div>
            <div className="hidden sm:flex items-center space-x-1">
              <span>🎨</span>
              <span>Creative Studio</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-1">
              <span>💾</span>
              <span>Auto-save</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>⚡</span>
              <span>Ready</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;