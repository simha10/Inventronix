import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Hero3D from "@/components/Hero3D";
import FloatingParticles from "@/components/FloatingParticles";
import {
  ArrowRight,
  Code,
  Users,
  Lightbulb,
  Rocket,
  BookOpen,
  Video,
} from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
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
    <div className="relative">
      <FloatingParticles />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Hero3D />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-foreground text-3d"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Welcome to{" "}
              <span className="text-glow bg-gradient-primary bg-clip-text text-transparent">
                InventroniX
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Empowering future engineers through innovative mentorship,
              technical guidance, and immersive learning experiences in the
              digital frontier.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/contact">
                <Button variant="hero" size="lg" className="group">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="glass" size="lg">
                  Explore Services
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              Comprehensive technical mentorship designed to accelerate your
              engineering journey
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
                className="group"
              >
                <Card className="glass p-8 h-full interactive-3d border-card-border hover:border-primary/50 transition-all duration-300">
                  <div className="text-primary mb-6 group-hover:text-primary-glow transition-colors">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/services">
              <Button variant="outline" size="lg" className="group">
                View All Services
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass p-12 rounded-2xl"
          >
            <Rocket className="h-16 w-16 text-primary mx-auto mb-6 animate-float" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Transform Your Future?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of students who have accelerated their careers with
              InventroniX mentorship
            </p>
            <Link to="/contact">
              <Button variant="hero" size="lg">
                Get Started Today
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
