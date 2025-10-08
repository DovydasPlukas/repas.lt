'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function HeroSection() {
    const [zipCode, setZipCode] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log('ZIP code submitted:', zipCode);
    };

    return (
        <div className="relative w-full h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px] bg-[#E4DDD8]/10 rounded-xl overflow-hidden">
            {/* Main Image Section */}
            <div className="hidden lg:block absolute z-10 top-[5%] bottom-[5%] left-[40%] right-[5%]">
                <Image
                    src="/Laundry.png"
                    alt="Hero Image"
                    fill
                    className="object-contain scale-x-[-1]"
                    priority
                />
            </div>
            <div className="relative w-full h-full overflow-hidden">
                <div className="absolute inset-0 lg:bg-gradient-to-r from-black/30 to 60% lg:to-transparent">
                    {/* Content Overlay */}
                    <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Title and Description */}
                        <div className="absolute left-4 sm:left-6 lg:left-8 top-[15%] sm:top-[20%] w-full sm:w-[500px] lg:w-[600px]">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#4F508E] lg:text-white mb-3 sm:mb-4 lg:mb-6 drop-shadow-lg">
                                Repas
                            </h1>
                            <p className="text-lg sm:text-xl lg:text-2xl text-[#4F508E]/80 lg:text-white/90 drop-shadow-md leading-relaxed mb-8 sm:mb-10 lg:mb-12 max-w-[90%]">
                                Profesionalios skalbimo paslaugos jūsų patogumui. Kokybiškas drabužių priežiūros sprendimas.
                            </p>
                        </div>
                        
                        {/* ZIP Code Input Section*/}
                        <div className="absolute left-4 sm:left-6 lg:left-8 bottom-8 sm:bottom-16 lg:bottom-20 w-[calc(100%-32px)] sm:w-[300px] lg:w-[450px] bg-white/95 backdrop-blur-sm p-3 sm:p-6 lg:p-8 rounded-lg shadow-lg">
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
                                    className="w-full bg-[#E9594B] hover:bg-[#E9594B]/90 text-white text-base sm:text-lg h-10 sm:h-12"
                                >
                                    Pateikti
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}