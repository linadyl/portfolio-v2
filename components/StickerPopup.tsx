"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

interface TagProps {
  name: string;
  color?: string;
  textColor?: string;
}

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
  size: {
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

interface StickerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  sticker: StickerType | null;
  position: { x: number; y: number };
  stickerEl?: HTMLElement | null;
  tags?: TagProps[];
  isMobile?: boolean;
}

const Tag: React.FC<TagProps> = ({ name, color = "#d4d4d4", textColor = "#271918" }) => {
  return (
    <div 
      className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-mono inline-flex items-center justify-center"
      style={{ 
        backgroundColor: color,
        color: textColor,
        border: "1px solid #271918",
        cursor: 'none'
      }}
    >
      {name}
    </div>
  );
};

const StickerPopup: React.FC<StickerPopupProps> = ({ 
  isOpen, 
  onClose, 
  sticker, 
  stickerEl,
  tags = [],
  isMobile = false
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Handle drag functionality
  useEffect(() => {
    if (!isDragging) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      setPopupPosition(prev => ({
        left: prev.left + deltaX,
        top: prev.top + deltaY
      }));
      
      setDragStart({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);
  
  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node) && !isDragging) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, isDragging]);

  // Calculate position based on whether mobile or desktop
  useEffect(() => {
    if (isOpen) {
      if (isMobile) {
        // For mobile, position in the center of the viewport at a fixed position
        setPopupPosition({
          top: window.innerHeight * 0.15, // Position at 15% from the top
          left: (window.innerWidth - 280) / 2  // Center horizontally (assuming 280px width)
        });
      } else if (stickerEl) {
        // For desktop, position near the sticker
        const stickerRect = stickerEl.getBoundingClientRect();
        const popupWidth = 380;
        
        // Center horizontally over the sticker
        const left = stickerRect.left + (stickerRect.width / 2) - (popupWidth / 2);
        
        // Position above the sticker
        const top = stickerRect.top - 450; // Place 450px above the top of sticker
        
        // Handle case where popup would go off the top of the screen
        const finalTop = top < 20 ? 20 : top;
        
        // Handle case where popup would go off the sides
        const finalLeft = Math.max(20, Math.min(left, window.innerWidth - popupWidth - 20));
        
        setPopupPosition({ 
          top: finalTop, 
          left: finalLeft 
        });
      }
    }
  }, [isOpen, stickerEl, isMobile]);

  if (!sticker) return null;
  
  const backgroundColor = sticker.popupColor || "#e3e7ff";
  const textColor = sticker.textColor || "#271918";
  
  // Use popup description if available, otherwise fall back to hover description
  const description = sticker.popupDesc || sticker.desc;
  
  // Use popup image if available, otherwise use the sticker image
  const imageSrc = sticker.popupImage || sticker.src;
  
  // Use custom button text if available, otherwise use default
  const buttonText = sticker.buttonText || "VIEW PROJECT →";

  // Decide whether to render a Link or a div based on disableLink
  const ActionButton = () => {
    const buttonStyle = {
      backgroundColor: textColor,
      color: backgroundColor,
      width: '100%',
      border: `2px outset ${textColor}`
    };
    
    const className = "py-2 px-4 text-center text-xs sm:text-sm cursor-pointer";
    
    // If link is disabled, render a div instead
    if (sticker.disableLink) {
      return (
        <div 
          className={className}
          style={{ ...buttonStyle, cursor: 'none' }}
        >
          {buttonText}
        </div>
      );
    }
    
    // Determine if the link is external (starts with http:// or https://)
    const isExternalLink = sticker.link.startsWith('http://') || sticker.link.startsWith('https://');
    
    // Otherwise render a Link component
    return (
      <Link 
        href={sticker.link} 
        target={isExternalLink ? "_blank" : undefined}
        rel={isExternalLink ? "noopener noreferrer" : undefined}
      >
        <div 
          className={className}
          style={{ ...buttonStyle, cursor: 'none' }}
        >
          {buttonText}
        </div>
      </Link>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popupRef}
          className={`fixed z-[100] w-[280px] sm:w-[380px] font-mono ${isMobile ? 'max-h-[70vh] overflow-y-auto' : ''}`}
          style={{
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
          }}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Retro-style popup container */}
          <div 
            className="p-3 sm:p-4 rounded-md shadow-md"
            style={{ 
              backgroundColor: backgroundColor,
              color: textColor,
              border: `3px solid #271918`,
              boxShadow: `4px 4px 0px #271918`,
              cursor: 'none'
            }}
            onMouseDown={(e) => {
              // Don't start drag if clicking on interactive elements
              const target = e.target as HTMLElement;
              const isInteractive = 
                target.closest('button') || 
                target.closest('a') || 
                target.closest('[role="button"]') ||
                target.tagName === 'BUTTON' ||
                target.tagName === 'A';
                
              if (!isInteractive) {
                setIsDragging(true);
                setDragStart({ x: e.clientX, y: e.clientY });
                e.preventDefault();
              }
            }}
          >
            {/* Close button - drag handle area */}
            <div 
              className="flex justify-between items-center mb-2 sm:mb-3"
              style={{ cursor: 'none' }}
            >
              <div className="text-base sm:text-lg font-bold uppercase select-none">
                {sticker.title || sticker.id}
              </div>
              <button 
                onClick={onClose}
                className="w-6 h-6 flex items-center justify-center rounded-full"
                style={{ 
                  backgroundColor: textColor,
                  color: backgroundColor,
                  cursor: 'none'
                }}
              >
                ×
              </button>
            </div>
            
            {/* Project image */}
            <div 
              className="w-full h-28 sm:h-48 mb-2 sm:mb-3 relative bg-gray-200 flex items-center justify-center overflow-hidden"
              style={{ border: `2px solid ${textColor}` }}
            >
              <Image
                src={imageSrc}
                alt={sticker.alt || sticker.title || sticker.id}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
              {tags.map((tag, index) => (
                <Tag 
                  key={index} 
                  name={tag.name} 
                  color={tag.color}
                  textColor={tag.textColor}
                />
              ))}
            </div>
            
            {/* Description */}
            <div 
              className="mb-3 sm:mb-4 text-xs sm:text-sm"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.4)', 
                border: `1px solid ${textColor}`,
                padding: '8px',
                borderRadius: '2px'
              }}
            >
              {description}
            </div>
            
            {/* Action Button (Link or div) */}
            <ActionButton />
            
            {/* Draggable indicator text */}
            <div className="text-center mt-2 text-[10px] opacity-50">
              (drag to move)
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickerPopup;