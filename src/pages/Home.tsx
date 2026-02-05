import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMobile } from "@/contexts/mobile-context";
import {
  ArrowRight,
  Code,
  BookOpen,
  Video,
  Rocket,
  Sparkles,
  ChevronDown
} from "lucide-react";
import { Link } from "react-router-dom";
import { SuccessRoute } from "@/components/SuccessRoute";
import LearningTimeline from "@/components/LearningTimeline";


const Home = () => {
  const { isMobile } = useMobile();
  const { scrollY } = useScroll();
  
  // Parallax effect for hero
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const services = [
    {
      icon: <Code className="h-8 w-8" />,
      title: "Project Development",
      description:
        "End-to-end project guidance from concept to deployment with cutting-edge technologies.",
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Documentation",
      description:
        "Professional documentation and technical writing for your projects and research.",
    },
    {
      icon: <Video className="h-8 w-8" />,
      title: "Webinars & Workshops",
      description:
        "Interactive learning sessions designed to accelerate your technical growth.",
    },
  ];

  return (
    <div className="relative overflow-x-hidden">
      {/* Video Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-background/50 z-10" /> {/* Reduced blocking overlay to 50% */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-60" // Increased video visibility to 60%
        >
          <source src="/assets/background.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden z-10">
        {/* Hero Content */}
        <motion.div 
            style={{ opacity: heroOpacity }}
            className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center"
        >
          {/* Animated Rocket Icon - Removed */}

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight mt-16"
          >
            Your{" "}
            <span className="gradient-text">
              Engineering Journey
            </span>
            {" "}Starts Here
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Step into the time capsule of knowledge. From basics to mastery, 
            we'll guide you through every milestone of your technical adventure.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full"
          >
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(6, 182, 212, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center gap-2"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-6 mt-16"
          >
            {[
              { icon: BookOpen, text: "Expert Mentorship" },
              { icon: Code, text: "Hands-on Projects" },
              { icon: Sparkles, text: "Industry Ready" }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="flex items-center gap-2 text-primary-glow bg-white/5 px-4 py-2 rounded-full border border-white/10"
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
             <ChevronDown className="w-8 h-8 text-white/50" />
          </motion.div>
        </motion.div>
      </section>


      {/* Learning Timeline Section */}
      <LearningTimeline />

      {/* Legacy Services Section - Adapted */}
      <section className="py-24 relative" id="services">
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our <span className="text-glow text-primary">Core Services</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive technical guidance designed to support your development.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="group h-full"
              >
                <Card className="glass p-8 h-full interactive-3d border-card-border hover:border-primary/50 transition-all duration-300 flex flex-col items-start bg-gradient-to-br from-card to-card/50">
                  <div className="p-4 rounded-2xl bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-black transition-all duration-500">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed flex-grow">
                      {service.description}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                      Learn more <ArrowRight className="w-4 h-4" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Success Route / Project Engine */}
      <SuccessRoute />

      {/* Call to Action */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-pink/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-cyan/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="glass p-12 md:p-16 rounded-3xl border border-white/10 shadow-2xl"
          >
            <div className="inline-block p-4 rounded-full bg-white/5 mb-8 animate-float">
                <Rocket className="h-12 w-12 text-accent-cyan" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Transform Your Future?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of students who have accelerated their careers with
              InventroniX mentorship.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                <Button variant="default" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full bg-gradient-to-r from-accent-cyan to-blue-600 hover:scale-105 transition-transform">
                    Get Started Today
                </Button>
                </Link>
                <Link to="/contact">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full border-2 hover:bg-white hover:text-black transition-colors">
                        Contact Us
                    </Button>
                </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Simple placeholder if the image placeholder component doesn't exist
function ImagePlaceholder({ className }: { className?: string }) {
    return <div className={`bg-white/10 ${className}`} />
}

export default Home;
