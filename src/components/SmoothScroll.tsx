import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    // Apply smooth scrolling styles
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-behavior: smooth;
      }
      
      body {
        overflow-x: hidden;
      }
    `;
    document.head.appendChild(style);

    const sections = ['hero', 'about', 'featured', 'contract', 'team', 'contact'];

    const getCurrentSection = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Check if we're at the very bottom (for contact section)
      const isAtBottom = (scrollPosition + windowHeight) >= (documentHeight - 10);
      
      if (isAtBottom) {
        return 'contact';
      }
      
      // Find which section is most visible
      let currentSection = '';
      let bestVisibility = 0;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top;
          const elementBottom = rect.bottom;
          const elementHeight = rect.height;
          
          // Calculate how much of the section is visible
          let visibleHeight = 0;
          
          if (elementTop >= 0 && elementBottom <= windowHeight) {
            visibleHeight = elementHeight;
          } else if (elementTop < 0 && elementBottom > 0) {
            visibleHeight = elementBottom;
          } else if (elementTop < windowHeight && elementBottom > windowHeight) {
            visibleHeight = windowHeight - elementTop;
          } else if (elementTop >= 0 && elementTop < windowHeight) {
            visibleHeight = Math.min(elementHeight, windowHeight - elementTop);
          }
          
          const visibilityPercentage = visibleHeight / elementHeight;
          
          if (visibilityPercentage > bestVisibility) {
            bestVisibility = visibilityPercentage;
            currentSection = section;
          }
          
          // Check if section is in the top half of viewport
          if (elementTop <= windowHeight / 2 && elementBottom > 0) {
            currentSection = section;
          }
        }
      }
      
      return currentSection || 'hero';
    };

    // Smooth scroll functionality is now handled by the navbar component
    // This component only provides basic smooth scroll behavior

    // Mouse wheel scrolling is disabled - users can scroll normally

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
}
