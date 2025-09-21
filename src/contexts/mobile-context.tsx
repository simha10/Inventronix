import { createContext, useContext, useEffect, useState } from "react";

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

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    // Check on mount
    checkDevice();

    // Add event listeners
    window.addEventListener("resize", checkDevice);
    window.addEventListener("orientationchange", checkDevice);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("orientationchange", checkDevice);
    };
  }, []);

  return (
    <MobileContext.Provider value={{ isMobile, isLandscape }}>
      {children}
    </MobileContext.Provider>
  );
};

export const useMobile = () => useContext(MobileContext);
