import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Home,
  Briefcase,
  Users,
  Info,
  Mail,
  HelpCircle,
} from "lucide-react";
import { useMobile } from "@/contexts/mobile-context";
import { usePageNavigation } from "@/contexts/page-navigation-context";

const Navigation = () => {
  const { isMobile } = useMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/services", label: "Services", icon: Briefcase },
    { path: "/creators", label: "Creators", icon: Users },
    { path: "/about", label: "About", icon: Info },
    { path: "/contact", label: "Contact", icon: Mail },
    { path: "/faq", label: "FAQ", icon: HelpCircle },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled ? "glass shadow-3d" : "bg-transparent"
      } ${isOpen ? "glass" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="h-8 w-8 text-primary group-hover:text-primary-glow transition-colors duration-300 rounded-full overflow-hidden">
                <img
                  src="/thunder.png"
                  alt="Inventronix Logo"
                  className="h-full w-full rounded-full object-cover object-center"
                />
              </div>
              <div className="absolute inset-0 h-8 w-8 text-primary animate-glow-pulse opacity-50" />
            </div>
            <span className="text-xl font-bold text-foreground group-hover:text-glow transition-all duration-300">
              InventroniX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 group ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-foreground hover:text-primary-glow"
                }`}
              >
                {item.label}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                {location.pathname === item.path && (
                  <motion.span
                    layoutId="activeTab"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"
                    initial={false}
                  />
                )}
              </Link>
            ))}
            <Button variant="hero" size="sm" className="ml-4">
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden z-[110]">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-[110] text-foreground hover:text-primary"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isOpen ? "close" : "open"}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 40,
              mass: 1,
            }}
            className="md:hidden fixed top-0 left-0 w-[280px] h-[100dvh] bg-background/95 border-r border-card-border overflow-hidden will-change-[opacity,transform] z-[105]"
            style={{
              backdropFilter: "blur(16px)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="h-16 flex items-center px-6 border-b border-card-border">
              <Link
                to="/"
                className="flex items-center space-x-2"
                onClick={() => setIsOpen(false)}
              >
                <div className="h-8 w-8">
                  <img
                    src="/thunder.png"
                    alt="Logo"
                    className="h-full w-full rounded-full"
                  />
                </div>
                <span className="text-xl font-bold text-foreground">
                  InventroniX
                </span>
              </Link>
            </div>
            <div className="px-4 py-6 space-y-2 overflow-y-auto max-h-[calc(100dvh-4rem)]">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                      ease: "easeOut",
                    }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center px-4 py-3.5 text-base font-medium rounded-lg transition-all duration-300 active:scale-95 ${
                        location.pathname === item.path
                          ? "text-primary bg-primary/10 shadow-glow-sm"
                          : "text-foreground hover:text-primary-glow hover:bg-accent/20"
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span>{item.label}</span>
                      {location.pathname === item.path && (
                        <motion.div
                          layoutId="activeMenuItem"
                          className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                className="pt-4 px-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button variant="hero" size="lg" className="w-full group">
                  Get Started
                  <motion.span
                    className="ml-2 inline-block"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                  >
                    →
                  </motion.span>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[102] md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation;
