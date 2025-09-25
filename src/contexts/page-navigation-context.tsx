import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMobile } from "./mobile-context";

interface PageNavigationContextType {
  currentPage: string;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: string) => void;
  isTransitioning: boolean;
  pageIndex: number;
  totalPages: number;
}

const pages = ["/", "/services", "/creators", "/about", "/contact", "/faq"];

const PageNavigationContext = createContext<PageNavigationContextType>({
  currentPage: "/",
  nextPage: () => {},
  previousPage: () => {},
  goToPage: () => {},
  isTransitioning: false,
  pageIndex: 0,
  totalPages: pages.length,
});

export const PageNavigationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useMobile();
  const [currentPage, setCurrentPage] = useState(location.pathname);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location.pathname]);

  const getCurrentPageIndex = useCallback(
    () => pages.indexOf(currentPage),
    [currentPage]
  );

  const handleTransition = useCallback(
    async (targetPage: string) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      navigate(targetPage);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for animation
      setIsTransitioning(false);
    },
    [navigate, isTransitioning]
  );

  const nextPage = useCallback(() => {
    if (!isMobile) return;
    const currentIndex = getCurrentPageIndex();
    if (currentIndex < pages.length - 1) {
      handleTransition(pages[currentIndex + 1]);
    }
  }, [isMobile, getCurrentPageIndex, handleTransition]);

  const previousPage = useCallback(() => {
    if (!isMobile) return;
    const currentIndex = getCurrentPageIndex();
    if (currentIndex > 0) {
      handleTransition(pages[currentIndex - 1]);
    }
  }, [isMobile, getCurrentPageIndex, handleTransition]);

  const goToPage = useCallback(
    (page: string) => {
      if (pages.includes(page)) {
        handleTransition(page);
      }
    },
    [handleTransition]
  );

  return (
    <PageNavigationContext.Provider
      value={{
        currentPage,
        nextPage,
        previousPage,
        goToPage,
        isTransitioning,
        pageIndex: getCurrentPageIndex(),
        totalPages: pages.length,
      }}
    >
      {children}
    </PageNavigationContext.Provider>
  );
};

export const usePageNavigation = () => useContext(PageNavigationContext);
