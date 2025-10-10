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

    // Section-based smooth scrolling like navbar
    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;
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

    const scrollToSection = (sectionId: string, direction: 'up' | 'down') => {
      const currentSection = getCurrentSection();
      const currentIndex = sections.indexOf(currentSection);
      let targetIndex = currentIndex;
      
      // Only move one section at a time
      if (direction === 'down') {
        targetIndex = Math.min(currentIndex + 1, sections.length - 1);
      } else {
        targetIndex = Math.max(currentIndex - 1, 0);
      }
      
      // Prevent scrolling if already at the target section
      if (targetIndex === currentIndex) {
        return;
      }
      
      const targetSection = sections[targetIndex];
      const targetElement = document.getElementById(targetSection);
      
      if (targetElement) {
        // Use the same offset logic as navbar
        const offset = targetSection === 'contact' ? 0 : 80;
        const targetPosition = targetElement.offsetTop - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isScrolling) return;
      
      isScrolling = true;
      clearTimeout(scrollTimeout);
      
      const delta = e.deltaY;
      const direction = delta > 0 ? 'down' : 'up';
      
      // Scroll to next/previous section like navbar
      scrollToSection('', direction);
      
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 100); // Much shorter timeout for immediate response to single scroll
    };

    // Add wheel event listener
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
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
