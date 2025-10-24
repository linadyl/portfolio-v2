"use client";

import Header from '@/components/Header';
import CustomCursor from "@/components/cursor";
import AnimatedBook from "@/components/AnimatedBook";
import CustomHighlight from "@/components/CustomHighlight";
import { CursorProvider } from '@/components/CursorContext';
import { motion, useAnimationControls } from "motion/react";
import { useEffect, useState } from "react";
import WigglingAsciiBackground from "@/components/WigglingAsciiBackground";

const TypewriterText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const controls = useAnimationControls();
  
  const cursorVariants = {
    blink: {
      opacity: [1, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
  };

  useEffect(() => {
    let currentIndex = 0;
    setDisplayedText('');
    
    const typeNextCharacter = () => {
      if (currentIndex < text.length) {
        setDisplayedText(text.substring(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeNextCharacter, 50);
      }
    };
    
    setTimeout(() => {
      typeNextCharacter();
      controls.start("blink");
    }, 500);
    
    return () => {
      currentIndex = text.length;
    };
  }, [text, controls]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <span>{displayedText}</span>
      <motion.span
        variants={cursorVariants}
        animate="blink"
        style={{
          display: 'inline-block',
          width: '0.2em',
          height: '1.2em',
          backgroundColor: '#a3b1ff',
          marginLeft: '2px',
          verticalAlign: 'middle',
        }}
      />
    </div>
  );
};

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const stickers = [
    {
      id: "brewmatch",
      src: "/stickers/brewmatch.png",
      popupImage: "/projects/brewmatch-proj.png",
      alt: "brewmatch project logo sticker",
      link: "/brewmatch",
      title: "brewmatch",
      position: { top: "18%", left: "17%" },
      mobilePosition: { top: "15%", left: "15%" },
      // Add medium desktop position
      mediumPosition: { top: "17%", left: "17%" },
      size: { width: 280, height: 280 },
      mobileSize: { width: 100, height: 100 },
      // Add medium desktop size
      mediumSize: { width: 180, height: 180 },
      rotationDeg: 10,
      desc: "a personality based cafe locator app!", 
      popupDesc: "a fully functional mock mobile app built with no frameworks, and features full backend implementation (yay for the fundamentals!). users take a personality quiz, and their results influence the local cafe recommendations!",
      disableLink: false,
      buttonText: "view my case study!", 
      popupColor: "#562B15", 
      textColor: "#ffffff",
      tags: [
        { name: "HTML", color: "#EC5D28", textColor: "#ffffff" },
        { name: "CSS", color: "#1572B6", textColor: "ffffff"},
        { name: "VanillaJS", color: "#F7DF1E", textColor: "#000000" },
        { name: "PHP", color: "#777BB3", textColor: "#ffffff" },
        { name: "SQL", color: "#3397DC", textColor: "#ffffff"}
      ]  
    },
    {
      id: "quickcatch",
      src: "/stickers/qc.png",
      popupImage: "/projects/quickcatch-popup.jpg",
      alt: "quickcatch project logo sticker",
      link: "https://devpost.com/software/spotlite-8b0lhg",
      title: "quickcatch",
      position: { top: "20%", left: "60%"},
      mobilePosition: { top: "15%", left: "60%" },
      // Add medium desktop position
      mediumPosition: { top: "18%", left: "60%" },
      size: { width: 250, height: 250 },
      mobileSize: { width: 90, height: 90 },
      // Add medium desktop size
      mediumSize: { width: 160, height: 160 },
      rotationDeg: 15,
      desc: "AI powered personalized sports content updator", 
      popupDesc: "(BearHacks 2025) QuickCatch is an AI-powered sports content aggregator that personalizes updates based on user preferences. It uses machine learning to deliver the most relevant sports news, highlights, and statistics tailored to each user's favorite teams and players.",
      buttonText: "DEVPOST LINK →", 
      popupColor: "#F0FFB2",
      textColor: "#271918",
      tags: [
        { name: "AI", color: "#FF5A5F", textColor: "#ffffff" },
        { name: "Python", color: "#3776AB", textColor: "#ffffff" },
        { name: "Next.js", color: "#000000", textColor: "#ffffff" }
      ]
    },
    {
      id: "portfolio",
      src: "/stickers/site.png",
      popupImage: "/projects/portfolio.gif",
      alt: "portfolio site logo sticker",
      link: "/porfolio",
      title: "my portfolio!",
      position: { top: "60%", left: "25%" },
      mobilePosition: { top: "55%", left: "20%" },
      // Add medium desktop position
      mediumPosition: { top: "58%", left: "23%" },
      size: { width: 250, height: 250 },
      mobileSize: { width: 90, height: 90 },
      // Add medium desktop size
      mediumSize: { width: 150, height: 150 },
      rotationDeg: 8,
      desc: "my portfolio! :D", 
      popupDesc: "my portfolio website built from scratch (with lots of moral support from caffeine), and contains a few hand drawn elements here and there. hope u enjoy!!", 
      buttonText: "you are here! :D", 
      disableLink: true, 
      popupColor: "#3f764c", 
      textColor: "#ffffff",
      tags: [
        { name: "Next.js", color: "#000000", textColor: "#ffffff" },
        { name: "Tailwind", color: "#38B2AC", textColor: "#ffffff" },
        { name: "TypeScript", color: "#3178C6", textColor: "#ffffff" },
        { name: "motion.dev", color: "#F0E510", textColor: "#000000"}
      ]   
    },
    {
      id: "handmotion",
      src: "/stickers/arduino.gif",
      alt: "gif of hand instrument demo",
      link: "https://drive.google.com/file/d/1nAkwEEwkN5K-lEfeXWhmHFzaRQoDNb9u/view?usp=sharing",
      title: "hand instrument",
      position: { top: "60%", left: "60%" },
      mobilePosition: { top: "55%", left: "60%" },
      // Add medium desktop position
      mediumPosition: { top: "58%", left: "58%" },
      size: { width: 300, height: 200 },
      mobileSize: { width: 110, height: 75 },
      // Add medium desktop size
      mediumSize: { width: 180, height: 120 },
      rotationDeg: 10,
      desc: "my arduino project that turns hand gestures into musical notes ♪♪♪", 
      popupDesc: "my little interactive project that uses computer vision to track hand movements via a webcam. It detects when finger touches occur (like thumb to index) to trigger MIDI notes, creates visual ribbons that follow hand movements, and uses an Arduino with an ultrasonic sensor to control sustain effects!",
      buttonText: "DEMO VIDEO →", 
      popupColor: "#f4e5ff", 
      textColor: "#271918",
      tags: [
        { name: "Arduino", color: "#00979D", textColor: "#ffffff" },
        { name: "C++", color: "#00599C", textColor: "#ffffff" },
        { name: "Python", color: "#3271A0", textColor: "#FFE974" }
      ]  
    },
  ];

  return (
    <CursorProvider>
      <main className="overflow-x-hidden min-h-screen flex flex-col">
        <WigglingAsciiBackground />
        <CustomCursor />
        <Header />
        
        {/* Significantly increased padding on top for mobile */}
        <div className="font-mono p-6 pt-28 sm:pt-32 md:pt-36 sm:p-10 md:p-16 lg:p-24 xl:p-44 w-full sm:w-4/5 lg:w-3/5 text-[20px] sm:text-[28px] md:text-[35px] lg:text-[50px] leading-tight sm:leading-[119.958%] tracking-[-0.5px] sm:tracking-[-1px] md:tracking-[-2px] lg:tracking-[-3.5px] text-foreground">
          ʕ•ᴥ•ʔ&lt; hi! my name is <span className="text-accent"><CustomHighlight>lina</CustomHighlight></span> and i&apos;m a <span className="text-xs sm:text-xl md:text-2xl lg:text-3xl -ml-1 sm:-ml-2 md:-ml-3 lg:-ml-5">(n aspiring)</span> <span className="text-accent">design engineer</span> based in toronto
          <div className="mt-2 text-xs sm:text-sm md:text-lg lg:text-[25px]">
            <TypewriterText text="↪ studying interactive media @ sheridan college 🥸" />
          </div>
        </div>
        
        {/* Pushed "my project book" text near bottom of viewport on mobile */}
        <div className={`flex justify-center mt-auto ${isMobile ? 'mb-6' : 'mt-6 md:mt-8 lg:mt-13'}`}>
          <motion.div 
            animate={{ 
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
            className="font-mono text-accent text-center text-sm sm:text-base md:text-lg"
          >
            my project book!
            <div className="mt-2 -mb-5">↓</div>
          </motion.div>
        </div>
        
        <AnimatedBook 
          bookImageSrc="/book.png" 
          stickers={stickers}
        />
      </main>
    </CursorProvider>
  );
}