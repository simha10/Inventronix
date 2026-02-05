import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FloatingParticles from "@/components/FloatingParticles";
import { Mail, Phone, User, Award, Code, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useMobile } from "@/contexts/mobile-context";

const Creators = () => {
  const { isMobile } = useMobile();
  const creators = [
    {
      name: "RAMESH SV V",
      role: "Technical Instructor Mentor",
      email: "inventronix4u@gmail.com",
      phone: "917675895113",
      avatar: "/api/placeholder/300/300",
      connectedIn: "https://www.linkedin.com/in/sarakanam-veera-venkata-ramesh",
      bio: "Passionate technical mentor with extensive experience in guiding students through complex engineering challenges. Specializes in modern development practices and industry-relevant skills.",
      expertise: [
        "VLSI Development",
        "Technical Mentorship",
        "Project Architecture",
        "Career Guidance",
      ],
      achievements: [
        "500+ students mentored",
        "Industry expert in modern frameworks",
        "Published research in technical journals",
      ],
    },
    {
      name: "Nagasai Devavarapu",
      role: "Project Development Lead",
      email: "inventronix4u@gmail.com",
      phone: "917675895113",
      avatar: "/api/placeholder/300/300",
      connectedIn: "https://www.linkedin.com/in/nagasai-devavarapu",
      bio: "Expert project developer focused on delivering cutting-edge solutions and guiding teams through the complete development lifecycle. Passionate about innovation and technical excellence.",
      expertise: [
        "Project Management",
        "Team Leadership",
        "Technology Integration",
        "Quality Assurance",
      ],
      achievements: [
        "Expert in project methodologies",
        "Innovation award recipient",
        "Led multiple successful project launches",
      ],
    },
  ];

  return (
    <div className="relative min-h-screen pt-16 overflow-x-hidden">
      {!isMobile && <FloatingParticles />}

      {/* Background Image */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src="/assets/creators-bg.avif" 
          alt="Creators Background" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" /> {/* Reduced overlay for better visibility */}
      </div>

      {/* Hero Section */}
      <section className="pt-24 pb-4 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground text-3d mb-2">
              Meet Our{" "}
              <span className="text-glow bg-gradient-primary bg-clip-text text-transparent">
                Creators
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Visionary minds empowering the next generation
            </p>
          </motion.div>
        </div>
      </section>

      {/* Creators Grid */}
      <section className="py-2 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-4">
            {creators.map((creator, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="bg-transparent border-none shadow-none p-5 interactive-3d transition-all duration-500 h-full">
                  <div className="flex flex-row items-start gap-4 mb-4">
                    {/* Compact Avatar */}
                    <div className="flex-shrink-0">
                        <motion.div
                        className="relative"
                        whileHover={{ scale: 1.05, rotateY: 5 }}
                        transition={{ duration: 0.3 }}
                        >
                        <div className="w-24 h-24 rounded-full bg-gradient-primary p-1 shadow-glow">
                            <div className="w-full h-full rounded-full bg-background-secondary flex items-center justify-center">
                            <User className="h-12 w-12 text-primary" />
                            </div>
                        </div>
                        <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-20 animate-glow-pulse" />
                        </motion.div>
                    </div>

                    
                    <div className="flex-1 text-left">
                        {/* Name and Role */}
                        <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-glow transition-all">
                        {creator.name}
                        </h3>
                        <p className="text-sm text-primary font-semibold mb-2">
                        {creator.role}
                        </p>

                        {/* Contact Info */}
                        <div className="flex flex-col gap-1 mb-0">
                        <div className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                            <Mail className="h-3 w-3" />
                            <a
                            href={`mailto:${creator.email}`}
                            className="text-xs hover:underline"
                            >
                            {creator.email}
                            </a>
                        </div>
                        <div className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                            <Phone className="h-3 w-3" />
                            <a
                            href={`tel:${creator.phone}`}
                            className="text-xs hover:underline"
                            >
                            {creator.phone}
                            </a>
                        </div>
                        </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-3">
                    {creator.bio}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                      {/* Expertise */}
                      <div className="mb-0">
                        <h4 className="flex items-center text-sm font-semibold text-foreground mb-2">
                          <Code className="h-4 w-4 text-primary mr-2" />
                          Expertise
                        </h4>
                        <div className="grid grid-cols-1 gap-1">
                          {creator.expertise.slice(0, 3).map((skill, skillIndex) => (
                            <div key={skillIndex} className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                              <span className="text-foreground text-xs">{skill}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Achievements */}
                      <div className="mb-0">
                        <h4 className="flex items-center text-sm font-semibold text-foreground mb-2">
                          <Award className="h-4 w-4 text-primary mr-2" />
                          Achievements
                        </h4>
                        <div className="grid grid-cols-1 gap-1">
                          {creator.achievements.slice(0, 3).map(
                            (achievement, achievementIndex) => (
                                <div key={achievementIndex} className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                                <span className="text-foreground text-xs line-clamp-1">
                                  {achievement}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                  </div>

                  {/* LinkedIn Connect Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4 border-primary/20 hover:bg-gradient-to-r hover:from-primary hover:to-accent hover:text-white transition-all duration-300 shadow-lg hover:shadow-primary/25 h-8 text-xs"
                    onClick={() =>
                      window.open(
                        creator.connectedIn,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    Connect with {creator.name.split(" ")[0]}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Vision */}
      <section className="py-8 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
              Our Shared Vision
            </h2>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed max-w-2xl mx-auto">
              Creating an ecosystem where aspiring engineers can thrive.
            </p>
            <Link to="/contact">
              <Button variant="hero" size="sm" className="h-9">
                Join Our Mission
              </Button>
            </Link>
        </div>
      </section>
    </div>
  );
};

export default Creators;
