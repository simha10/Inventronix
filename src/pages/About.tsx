import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import FloatingParticles from '@/components/FloatingParticles';
import { useMobile } from '@/contexts/mobile-context';
import { Target, Eye, Heart, Rocket, Users, Globe, Award, Lightbulb } from 'lucide-react';

const About = () => {
  const { isMobile } = useMobile();

  const values = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Excellence",
      description: "We strive for excellence in every aspect of our mentorship and technical guidance."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Innovation",
      description: "Embracing cutting-edge technologies and creative problem-solving approaches."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community",
      description: "Building a supportive community of learners, mentors, and industry professionals."
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Impact",
      description: "Creating meaningful impact in the lives of aspiring engineers worldwide."
    }
  ];

  const milestones = [
    {
      year: "2024",
      title: "Foundation",
      description: "InventroniX was founded with a vision to revolutionize technical education"
    },
    {
      year: "Aug 2025",
      title: "First Cohort",
      description: "Successfully mentored our first batch of 250 students"
    },
    {
      year: "2026 Onwards",
      title: "Global Expansion",
      description: "Expanded our mentorship programs to include online and offline sessions for students"
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
              About <span className="text-glow bg-gradient-primary bg-clip-text text-transparent">InventroniX</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Pioneering the future of technical education through innovative mentorship and immersive learning experiences
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="glass p-8 h-full interactive-3d border-card-border">
                <div className="flex items-center mb-6">
                  <Target className="h-12 w-12 text-primary mr-4" />
                  <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  To empower aspiring engineers with cutting-edge technical knowledge, 
                  practical skills, and mentorship that bridges the gap between academic 
                  learning and industry requirements. We are committed to fostering innovation, 
                  creativity, and technical excellence in the next generation of engineers.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="glass p-8 h-full interactive-3d border-card-border">
                <div className="flex items-center mb-6">
                  <Eye className="h-12 w-12 text-primary mr-4" />
                  <h2 className="text-3xl font-bold text-foreground">Our Vision</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  To become the global leader in technical mentorship, creating a world where 
                  every aspiring engineer has access to world-class guidance, resources, and 
                  opportunities to realize their full potential and contribute to technological 
                  advancement.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our <span className="text-glow text-primary">Values</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The core principles that guide everything we do at InventroniX
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -10, rotateY: 5 }}
                className="group"
              >
                <Card className="glass p-6 h-full interactive-3d border-card-border hover:border-primary/50 transition-all duration-300 text-center">
                  <div className="text-primary mb-4 group-hover:text-primary-glow transition-colors mx-auto w-fit">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {value.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our <span className="text-glow text-primary">Journey</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Milestones that mark our evolution and growth in the technical education space
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-primary h-full opacity-30"></div>
            
            <div className="space-y-16">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-col md:flex-row' : 'flex-col md:flex-row-reverse'}`}
                >
                  <div className="flex-1 px-8">
                    <Card className="glass p-6 interactive-3d border-card-border hover:border-primary/50 transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold text-lg mr-4">
                          {milestone.year}
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">
                          {milestone.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground">
                        {milestone.description}
                      </p>
                    </Card>
                  </div>
                  
                  <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full border-4 border-background-secondary shadow-glow relative z-10"></div>
                  
                  <div className="flex-1"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
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
              Making a Difference
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">Students Mentored</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">10+</div>
                <div className="text-muted-foreground">Projects Completed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">95%</div>
                <div className="text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;