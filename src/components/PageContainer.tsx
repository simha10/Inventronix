import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMobile } from "@/contexts/mobile-context";
import { usePageNavigation } from "@/contexts/page-navigation-context";

interface PageContainerProps {
  children: React.ReactNode;
}

export const PageContainer = ({ children }: PageContainerProps) => {
  const { isMobile } = useMobile();
  const { nextPage, previousPage, isTransitioning, pageIndex, currentPage } =
    usePageNavigation();
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchStartTime = useRef(0);
  const minSwipeDistance = 80;
  const minSwipeVelocity = 0.6; // pixels per ms

  useEffect(() => {
    if (!isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
      touchStartTime.current = Date.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndY.current = e.touches[0].clientY;
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (isTransitioning) return;

      const deltaTime = Date.now() - touchStartTime.current;
      const deltaY = Math.abs(touchStartY.current - touchEndY.current);
      const deltaX = Math.abs(touchStartX.current - touchEndX.current);
      const velocityY = deltaY / deltaTime;

      // Only trigger vertical swipe if vertical movement is dominant, distance met, and velocity indicates swipe not scroll
      if (deltaY > deltaX && deltaY > minSwipeDistance && velocityY > minSwipeVelocity) {
        const swipeDistance = touchStartY.current - touchEndY.current;
        if (swipeDistance > 0) {
          nextPage();
        } else {
          previousPage();
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMobile, nextPage, previousPage, isTransitioning]);

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPage}
        className="min-h-screen w-full pt-16 overflow-y-auto"
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "-100%" }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.8,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
