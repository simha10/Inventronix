import { createContext, useContext, useEffect, useState, useCallback } from "react";

interface MobileContextType {
  isMobile: boolean;
  isLandscape: boolean;
}

const MobileContext = createContext<MobileContextType>({
  isMobile: false,
  isLandscape: false,
});

export const MobileProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  const checkDevice = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
    setIsLandscape(window.innerWidth > window.innerHeight);
  }, []);

  useEffect(() => {
    // Check on mount
    checkDevice();

    let timeoutId: NodeJS.Timeout;
    const debouncedCheck = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkDevice, 100);
    };

    // Add event listeners with debounce
    window.addEventListener("resize", debouncedCheck);
    window.addEventListener("orientationchange", checkDevice);

    // Cleanup
    return () => {
      window.removeEventListener("resize", debouncedCheck);
      window.removeEventListener("orientationchange", checkDevice);
      clearTimeout(timeoutId);
    };
  }, [checkDevice]);

  return (
    <MobileContext.Provider value={{ isMobile, isLandscape }}>
      {children}
    </MobileContext.Provider>
  );
};

export const useMobile = () => useContext(MobileContext);
