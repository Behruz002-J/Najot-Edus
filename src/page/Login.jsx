import React from 'react';
import { useNavigate } from 'react-router-dom';
import studentSvg from '../assets/images/student.svg';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    window.localStorage.setItem("token", "fake-token");
    window.localStorage.setItem("username", username);
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side with illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1A2542] items-center justify-center p-12">
        <div className="w-full max-w-lg mx-auto flex justify-center items-center">
          <img 
            src={studentSvg} 
            alt="Student Illustration" 
            className="w-full h-auto object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 md:p-16 lg:p-24 bg-white relative">
        <div className="flex-grow flex flex-col justify-center max-w-md mx-auto w-full">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-[10px] sm:text-xs font-semibold text-gray-800 tracking-wider mb-6 leading-relaxed">
              MUHAMMAD AL-XORAZMIY NOMIDAGI<br />
              TOSHKENT AXBOROT TEXNOLOGIYALARI<br />
              UNIVERSITETI
            </h1>
            
            {/* Logo placeholder - using a styled div with a border to represent the seal */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-green-600 rounded-full mx-auto mb-6 flex items-center justify-center bg-gray-50">
              <span className="text-green-700 font-bold text-2xl">TUIT</span>
            </div>
            
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-8">
              LEARNING MANAGEMENT SYSTEM
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Login
              </label>
              <input
                type="text"
                placeholder="Loginni kiriting"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1A2542] focus:border-transparent transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parol
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Parolni kiriting"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1A2542] focus:border-transparent transition-colors"
                  required
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1A2542] text-white py-3 px-4 rounded hover:bg-[#121a30] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A2542] font-medium"
            >
              Kirish
            </button>
          </form>
        </div>

        {/* Footer text */}
        <div className="text-center mt-12 text-xs text-gray-500">
          Copyright © 2021 of Tashkent University of Information Technologies
        </div>
      </div>
    </div>
  );
}
