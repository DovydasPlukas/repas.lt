'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

export default function HeroSection() {
  const router = useRouter();
  // generate rising bubbles on client
  const [bubbles, setBubbles] = useState<
    { id: number; left: string; size: string; duration: string; delay: string }[]
  >([]);

  useEffect(() => {
    const newBubbles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 60 + 20}px`, // 20px to 80px
      duration: `${Math.random() * 5 + 5}s`, // 5s to 10s
      delay: `${Math.random() * 1}s`,
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="relative w-full h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px] rounded-xl overflow-hidden bg-gradient-to-r from-[#D0E6F7]/10 via-[#E4F0FA]/50 to-[#D0E6F7]/40 animate-gradient-x">
      {/* --- BACKGROUND: dynamic rising bubbles --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="absolute bottom-[-100px] rounded-full bg-white/30 border border-white/40 shadow-sm backdrop-blur-sm animate-rise"
            style={{
              left: bubble.left,
              width: bubble.size,
              height: bubble.size,
              animationDuration: bubble.duration,
              animationDelay: bubble.delay,
            }}
          />
        ))}
      </div>

      {/* --- BACKGROUND: animated waves at the bottom --- */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-0 pointer-events-none">
        <svg
          className="relative block w-[200%] h-[100px] sm:h-[150px] animate-wave opacity-60"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-[#494B8B]"
            fillOpacity="0.08"
          ></path>
        </svg>
        <svg
          className="absolute bottom-0 left-0 w-[200%] h-[100px] sm:h-[150px] animate-wave-slow opacity-40"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{ animationDelay: '-2s' }}
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="fill-[#4F508E]"
            fillOpacity="0.16"
          ></path>
        </svg>
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
          {/* Two-layer water text: outline + animated fill */}
          <div className="relative">
            {/* outline (still selectable) */}
            <h1
              className="absolute inset-0 m-0 text-[5.2rem] sm:text-[6.2rem] md:text-[7.2rem] lg:text-[8rem] font-extrabold tracking-tight text-[#Ea5548]"
              aria-hidden
              style={{ WebkitTextStroke: '4px #494B8B' }}
            >
              Repas
            </h1>

            {/* animated fill (now unselectable) */}
            <h1
              className="m-0 text-[5.2rem] sm:text-[6.2rem] md:text-[7.2rem] lg:text-[8rem] font-extrabold tracking-tight text-[#494B8B] overflow-hidden select-none"
              aria-label="Repas"
            >
              <span className="block relative water-fill select-none">Repas</span>
            </h1>
          </div>

          <p className="text-lg sm:text-xl lg:text-2xl text-[#4F508E]/80 lg:text-[#4F508E]/90 drop-shadow-md leading-relaxed mb-8 sm:mb-10 lg:mb-12 max-w-[90%]">
            Profesionalios skalbimo paslaugos jūsų patogumui. Kokybiškas drabužių priežiūros sprendimas.
          </p>

          {/* Button only */}
          <Button
            onClick={() => router.push('/paslaugos')}
            className="bg-[#E9594B] hover:bg-[#E9594B]/90 text-white text-base sm:text-lg h-12 px-8 shadow-lg transition-all duration-300 hover:scale-105"
          >
            Peržiūrėti paslaugas
          </Button>
        </div>
      </div>

      {/* Tailwind + component-specific styles */}
      <style jsx>{`
        /* Water text animation (clip-path waves) */
        .water-fill {
          display: inline-block;
          animation: water 4s ease-in-out infinite;
        }

        @keyframes water {
          0%,
          100% {
            clip-path: polygon(
              0% 45%,
              16% 44%,
              33% 50%,
              54% 60%,
              70% 61%,
              84% 59%,
              100% 52%,
              100% 100%,
              0% 100%
            );
          }

          50% {
            clip-path: polygon(
              0% 60%,
              15% 65%,
              34% 66%,
              51% 62%,
              67% 50%,
              84% 45%,
              100% 46%,
              100% 100%,
              0% 100%
            );
          }
        }

        /* Rising bubbles animation */
        @keyframes rise {
          0% {
            bottom: -100px;
            transform: translateX(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          50% {
            transform: translateX(20px); /* Sway right */
          }
          70% {
            opacity: 0.8;
          }
          100% {
            bottom: 110%; /* Move above the container */
            transform: translateX(-20px); /* Sway left */
            opacity: 0;
          }
        }
        .animate-rise {
          animation-name: rise;
          animation-timing-function: ease-in;
          animation-iteration-count: infinite;
        }

        /* Wave Animations */
        @keyframes wave {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-25%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-wave {
          animation: wave 15s linear infinite;
        }
        .animate-wave-slow {
          animation: wave 20s ease-in-out infinite reverse;
        }

        /* gradient background animation */
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }

        /* float for hero image */
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}