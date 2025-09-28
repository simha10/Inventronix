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

      {/* Hero Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-foreground text-3d mb-6">
              Meet Our{" "}
              <span className="text-glow bg-gradient-primary bg-clip-text text-transparent">
                Creators
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The visionary minds behind InventroniX, dedicated to empowering
              the next generation of engineers
            </p>
          </motion.div>
        </div>
      </section>

      {/* Creators Grid */}
      <section className="py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {creators.map((creator, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card className="glass p-8 interactive-3d border-card-border hover:border-primary/50 transition-all duration-500 h-full">
                  <div className="flex flex-col items-center text-center mb-8">
                    {/* Avatar */}
                    <motion.div
                      className="relative mb-6"
                      whileHover={{ scale: 1.05, rotateY: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-40 h-40 rounded-full bg-gradient-primary p-1 shadow-glow">
                        <div className="w-full h-full rounded-full bg-background-secondary flex items-center justify-center">
                          <User className="h-20 w-20 text-primary" />
                        </div>
                      </div>
                      <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-20 animate-glow-pulse" />
                    </motion.div>

                    {/* Name and Role */}
                    <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-glow transition-all">
                      {creator.name}
                    </h3>
                    <p className="text-lg text-primary font-semibold mb-4">
                      {creator.role}
                    </p>

                    {/* Contact Info */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                      <div className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                        <Mail className="h-4 w-4" />
                        <a
                          href={`mailto:${creator.email}`}
                          className="text-sm hover:underline"
                        >
                          {creator.email}
                        </a>
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                        <Phone className="h-4 w-4" />
                        <a
                          href={`tel:${creator.phone}`}
                          className="text-sm hover:underline"
                        >
                          {creator.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    {creator.bio}
                  </p>

                  {/* Expertise */}
                  <div className="mb-8">
                    <h4 className="flex items-center text-lg font-semibold text-foreground mb-4">
                      <Code className="h-5 w-5 text-primary mr-2" />
                      Expertise
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {creator.expertise.map((skill, skillIndex) => (
                        <motion.div
                          key={skillIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.5,
                            delay: skillIndex * 0.1,
                          }}
                          className="flex items-center space-x-2"
                        >
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-foreground">{skill}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="mb-8">
                    <h4 className="flex items-center text-lg font-semibold text-foreground mb-4">
                      <Award className="h-5 w-5 text-primary mr-2" />
                      Achievements
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {creator.achievements.map(
                        (achievement, achievementIndex) => (
                          <motion.div
                            key={achievementIndex}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.5,
                              delay: achievementIndex * 0.1,
                            }}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-2 h-2 bg-accent rounded-full" />
                            <span className="text-foreground">
                              {achievement}
                            </span>
                          </motion.div>
                        )
                      )}
                    </div>
                  </div>

                  {/* LinkedIn Connect Button */}
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
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
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass p-12 rounded-2xl"
          >
            <BookOpen className="h-16 w-16 text-primary mx-auto mb-6 animate-float" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Our Shared Vision
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Together, we're committed to creating an ecosystem where aspiring
              engineers can thrive, learn from real-world experiences, and build
              the technologies that will shape tomorrow.
            </p>
            <Link to="/contact">
              <Button variant="hero" size="lg">
                Join Our Mission
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Creators;
