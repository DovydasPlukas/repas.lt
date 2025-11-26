'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import { Input } from './ui/input';

import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const [zipCode, setZipCode] = useState('');
  
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (zipCode.trim()) {
      router.push(`/adresas?zip=${encodeURIComponent(zipCode)}`)
    }
  }

  return (
    <div className="relative w-full h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px] rounded-xl overflow-hidden bg-gradient-to-r from-[#D0E6F7]/10 via-[#E4F0FA]/50 to-[#D0E6F7]/40 animate-gradient-x">
      {/* Bubble overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-20 h-20 bg-blue-300 rounded-full blur-3xl animate-bubble top-10 left-10"></div>
        <div className="absolute w-32 h-32 bg-blue-300 rounded-full blur-2xl animate-bubble delay-2000 bottom-12 left-1/4"></div>
        <div className="absolute w-16 h-16 bg-blue-300 rounded-full blur-xl animate-bubble delay-1000 bottom-20 right-1/3"></div>
        <div className="absolute w-24 h-24 bg-blue-300 rounded-full blur-2xl animate-bubble delay-1500 top-20 right-1/4"></div>
      </div>

      {/* Main Image Section */}
      <div className="hidden lg:block absolute z-10 top-[5%] bottom-[5%] left-[40%] right-[5%] animate-float">
        <Image
          src="/Laundry.png"
          alt="Hero Image"
          fill
          className="object-contain scale-x-[-1]"
          priority
        />
      </div>

      {/* Content Overlay */}
      <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Title and Description */}
        <div className="absolute left-4 sm:left-6 lg:left-8 top-[15%] sm:top-[20%] w-full sm:w-[500px] lg:w-[600px]">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#4F508E] mb-3 sm:mb-4 lg:mb-6 drop-shadow-lg">
            Repas
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-[#4F508E]/80 lg:text-[#4F508E]/90 drop-shadow-md leading-relaxed mb-8 sm:mb-10 lg:mb-12 max-w-[90%]">
            Profesionalios skalbimo paslaugos jūsų patogumui. Kokybiškas drabužių priežiūros sprendimas.
          </p>
        </div>

        {/* ZIP Code Input Section */}
        <div className="absolute left-4 sm:left-6 lg:left-8 bottom-8 sm:bottom-16 lg:bottom-20 w-[calc(100%-32px)] sm:w-[300px] lg:w-[450px] bg-white/90 backdrop-blur-sm p-3 sm:p-6 lg:p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
            <Input
              type="text"
              placeholder="Įveskite pašto kodą"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="border-[#4F508E] focus:ring-[#E9594B] text-base sm:text-lg h-10 sm:h-12"
              pattern="[0-9]*"
              maxLength={5}
            />
            <Button
              type="submit"
              className="w-full bg-[#E9594B] transition-all duration-300 ease-in-out hover:bg-[#E9594B]/90 text-white text-base sm:text-lg h-10 sm:h-12"
            >
              Pateikti
            </Button>
          </form>
        </div>
      </div>

      {/* Tailwind Animations */}
      <style jsx>{`
        @keyframes bubble {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-20px) scale(1.1); opacity: 0.8; }
          100% { transform: translateY(0) scale(1); opacity: 0.6; }
        }
        .animate-bubble { animation: bubble 6s infinite ease-in-out; }
        .animate-bubble.delay-1000 { animation-delay: 1s; }
        .animate-bubble.delay-1500 { animation-delay: 1.5s; }
        .animate-bubble.delay-2000 { animation-delay: 2s; }

        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 15s ease infinite; }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}