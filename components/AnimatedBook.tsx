"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, Variants } from "motion/react";
import { useCursor } from "./CursorContext";
import StickerPopup from "./StickerPopup";

interface StickerType {
  id: string;
  src: string;
  alt: string;
  link: string;
  title?: string;
  position: {
    top: string;
    left: string;
  };
  mobilePosition?: {
    top: string;
    left: string;
  };
  mediumPosition?: {
    top: string;
    left: string;
  };
  size: {
    width: number;
    height: number;
  };
  mobileSize?: {
    width: number;
    height: number;
  };
  mediumSize?: {
    width: number;
    height: number;
  };
  rotationDeg?: number;
  desc: string; // This is for the hover tooltip
  popupDesc?: string; // This is for the popup description
  popupImage?: string; // This is for the popup image
  buttonText?: string; // This is for the button text
  disableLink?: boolean; // This is to disable the link
  popupColor?: string;
  textColor?: string;
  tags?: Array<{
    name: string;
    color?: string;
    textColor?: string;
  }>;
}

// Interface for tracking open popups
interface OpenPopup {
  sticker: StickerType;
  stickerEl: HTMLElement;
  zIndex: number;
}

interface AnimatedBookProps {
  bookImageSrc: string;
  stickers?: StickerType[];
}

// Tag component for the hover tooltip
interface TooltipTagProps {
  name: string;
  color?: string;
  textColor?: string;
}

const TooltipTag: React.FC<TooltipTagProps> = ({ name, color = "#d4d4d4", textColor = "#271918" }) => {
  return (
    <div 
      className="px-2 py-0.5 rounded-full text-xs font-mono inline-flex items-center justify-center"
      style={{ 
        backgroundColor: color,
        color: textColor,
        border: "1px solid #271918",
        margin: "2px",
        fontSize: "0.65rem"
      }}
    >
      {name}
    </div>
  );
};

const AnimatedBook: React.FC<AnimatedBookProps> = ({ bookImageSrc, stickers = [] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animatedStickers, setAnimatedStickers] = useState<boolean[]>(Array(stickers.length).fill(false));
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { setHoverColor, setIsStickerHovered } = useCursor();
  const [isMobile, setIsMobile] = useState(false);
  const [isMediumDesktop, setIsMediumDesktop] = useState(false);
  
  // New state for multiple popups
  const [openPopups, setOpenPopups] = useState<OpenPopup[]>([]);
  const [nextZIndex, setNextZIndex] = useState(100); // Starting z-index
  
  // For single popup on mobile (existing behavior)
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState<StickerType | null>(null);
  const [activeStickerEl, setActiveStickerEl] = useState<HTMLElement | null>(null);
  
  // Check for device/screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsMediumDesktop(width >= 768 && width < 1200); // Medium desktop range
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  useEffect(() => {
    const currentContainer = containerRef.current;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Animate stickers in sequence
          stickers.forEach((_, index) => {
            setTimeout(() => {
              setAnimatedStickers(prev => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            }, 700 + (index * 80));
          });
        }
      },
      { threshold: 0.5 }
    );
    
    if (currentContainer) {
      observer.observe(currentContainer);
    }
    
    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, [stickers]);

  // Set hover color when hovering over a sticker
  useEffect(() => {
    if (hoveredIndex !== null && stickers[hoveredIndex]?.popupColor) {
      setHoverColor(stickers[hoveredIndex].popupColor);
      setIsStickerHovered(true);
    } else {
      setHoverColor(null);
      setIsStickerHovered(false);
    }
    
    return () => {
      setHoverColor(null);
      setIsStickerHovered(false);
    };
  }, [hoveredIndex, stickers, setHoverColor, setIsStickerHovered]);

  const bookVariants: Variants = {
    offscreen: {
      y: 100,
      opacity: 0.5,
      scale: 0.95,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  // Handle sticker click - now with support for multiple popups on desktop
  const handleStickerClick = (sticker: StickerType) => {
    // Store the sticker element for positioning
    const stickerElement = document.getElementById(`sticker-${sticker.id}`);
    
    if (!stickerElement) return;
    
    if (isMobile) {
      // Mobile behavior - single popup
      setActiveStickerEl(stickerElement);
      setSelectedSticker(sticker);
      setIsPopupOpen(true);
    } else {
      // Desktop behavior - multiple popups
      // Check if this popup is already open
      const existingPopupIndex = openPopups.findIndex(popup => popup.sticker.id === sticker.id);
      
      if (existingPopupIndex !== -1) {
        // If already open, bring it to the front
        bringPopupToFront(sticker.id);
      } else {
        // If not open, add it to the openPopups array with the next z-index
        setOpenPopups(prev => [
          ...prev,
          {
            sticker,
            stickerEl: stickerElement,
            zIndex: nextZIndex
          }
        ]);
        setNextZIndex(prev => prev + 1);
      }
    }
  };

  // Function to bring a popup to the front by updating its z-index
  const bringPopupToFront = (stickerId: string) => {
    setOpenPopups(prev => {
      // Find the popup to update
      const newPopups = [...prev];
      const popupIndex = newPopups.findIndex(popup => popup.sticker.id === stickerId);
      
      if (popupIndex === -1) return prev;
      
      // Update its z-index to be the highest
      newPopups[popupIndex] = {
        ...newPopups[popupIndex],
        zIndex: nextZIndex
      };
      
      setNextZIndex(nextZIndex + 1);
      return newPopups;
    });
  };

  // Close a specific popup (for desktop)
  const handleClosePopup = (stickerId: string) => {
    setOpenPopups(prev => prev.filter(popup => popup.sticker.id !== stickerId));
  };

  // Close the single popup (for mobile)
  const handleCloseMobilePopup = () => {
    setIsPopupOpen(false);
    setSelectedSticker(null);
    setActiveStickerEl(null);
  };

  // Helper function to get the appropriate sticker position based on device
  const getStickerPosition = (sticker: StickerType) => {
    if (isMobile && sticker.mobilePosition) {
      return sticker.mobilePosition;
    }
    if (!isMobile && isMediumDesktop && sticker.mediumPosition) {
      return sticker.mediumPosition;
    }
    return sticker.position;
  };

  // Helper function to get the appropriate sticker size based on device
  const getStickerSize = (sticker: StickerType) => {
    if (isMobile && sticker.mobileSize) {
      return sticker.mobileSize;
    }
    if (!isMobile && isMediumDesktop && sticker.mediumSize) {
      return sticker.mediumSize;
    }
    return sticker.size;
  };

  return (
    <div className="w-full py-12 sm:py-20 md:py-32 overflow-hidden relative" ref={containerRef}>
      <motion.div
        className="relative flex justify-center items-center"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: false, amount: 0.5 }}
      >
        <motion.div 
          className="relative"
          variants={bookVariants}
        >
          <Image
            src={bookImageSrc}
            alt="Open book"
            width={1300}
            height={900}
            priority
            className="w-full"
          />
          
          {stickers.map((sticker, idx) => {
            const position = getStickerPosition(sticker);
            const size = getStickerSize(sticker);
            
            return (
              <motion.div
                key={sticker.id}
                id={`sticker-${sticker.id}`}
                className="absolute cursor-pointer"
                style={{
                  top: position.top,
                  left: position.left,
                  zIndex: hoveredIndex === idx ? 20 : 10,
                  cursor: "none",
                }}
                initial={{
                  y: 20,
                  opacity: 0,
                  scale: 0.9,
                  rotate: 0
                }}
                animate={{
                  y: animatedStickers[idx] ? 0 : 20,
                  opacity: animatedStickers[idx] ? 1 : 0,
                  scale: hoveredIndex === idx ? 1.05 : 1,
                  rotate: hoveredIndex === idx ? 0 : (sticker.rotationDeg || (idx % 2 === 0 ? 8 : -8)),
                  zIndex: hoveredIndex === idx ? 20 : 10
                }}
                transition={{
                  duration: hoveredIndex === idx ? 0.1 : 0.5,
                  ease: "easeOut"
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleStickerClick(sticker)}
              >
                <Image
                  src={sticker.src}
                  alt={sticker.alt}
                  width={size.width}
                  height={size.height}
                  className="drop-shadow-md"
                />
              </motion.div>
            );
          })}
          
          {/* Tooltip that follows cursor when hovering a sticker - hide on mobile */}
          {!isMobile && hoveredIndex !== null && (
            <motion.div
              className="fixed pointer-events-none z-50 rounded-md font-mono text-sm"
              style={{
                left: `${mousePosition.x + 15}px`, // Offset from cursor
                top: `${mousePosition.y + 15}px`,
                backgroundColor: stickers[hoveredIndex].popupColor || "#e3e7ff",
                color: stickers[hoveredIndex].textColor || "#271918",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                border: "2px solid #271918",
                overflow: "hidden",
                maxWidth: "250px"
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              <div className="px-3 py-2">
                {stickers[hoveredIndex].desc}
              </div>
              
              {/* Tags section below description */}
              {stickers[hoveredIndex].tags && stickers[hoveredIndex].tags.length > 0 && (
                <div 
                  className="flex flex-wrap gap-1 p-2 mt-1"
                  style={{ 
                    borderTop: `1px solid ${stickers[hoveredIndex].textColor || "#271918"}`,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {stickers[hoveredIndex].tags.map((tag, i) => (
                    <TooltipTag 
                      key={i} 
                      name={tag.name} 
                      color={tag.color}
                      textColor={tag.textColor}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Mobile - Single Popup component */}
      {isMobile && (
        <StickerPopup 
          isOpen={isPopupOpen}
          onClose={handleCloseMobilePopup}
          sticker={selectedSticker}
          position={{ x: 0, y: 0 }}
          stickerEl={activeStickerEl}
          tags={selectedSticker?.tags || []}
          isMobile={isMobile}
        />
      )}
      
      {/* Desktop - Multiple Popup components */}
      {!isMobile && openPopups.map(popup => (
        <StickerPopup
          key={popup.sticker.id}
          isOpen={true}
          onClose={() => handleClosePopup(popup.sticker.id)}
          sticker={popup.sticker}
          position={{ x: 0, y: 0 }}
          stickerEl={popup.stickerEl}
          tags={popup.sticker.tags || []}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
};

export default AnimatedBook;