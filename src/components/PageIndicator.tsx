import { useMobile } from "@/contexts/mobile-context";
import { usePageNavigation } from "@/contexts/page-navigation-context";
import { motion } from "framer-motion";

const pages = ["/", "/services", "/creators", "/about", "/contact", "/faq"];

export const PageIndicator = () => {
  const { isMobile } = useMobile();
  const { currentPage, goToPage, isTransitioning } = usePageNavigation();

  if (!isMobile) return null;

  return (
    <motion.div
      className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-50"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      {pages.map((page, index) => (
        <motion.div
          key={page}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => !isTransitioning && goToPage(page)}
          className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
            currentPage === page
              ? "bg-primary scale-125 shadow-glow"
              : "bg-muted-foreground/30 hover:bg-primary/50"
          }`}
          style={{
            transition: "all 0.3s ease",
          }}
        />
      ))}
    </motion.div>
  );
};
