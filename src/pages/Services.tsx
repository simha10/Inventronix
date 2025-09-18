import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FloatingParticles from '@/components/FloatingParticles';
import {
  Code,
  BookOpen,
  Video,
  FileText,
  Presentation,
  Users,
  Zap,
  Target,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      icon: <Code className="h-12 w-12" />,
      title: "Project Development",
      description: "Complete project lifecycle support from ideation to deployment",
      features: [
        "Project development guidance",
        "Code review and optimization",
        "Architecture design consultation",
        "Technology stack selection",
        "Performance optimization"
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <BookOpen className="h-12 w-12" />,
      title: "Documentation Services",
      description: "Professional technical documentation and academic writing",
      features: [
        "Technical documentation",
        "Research paper writing",
        "API documentation",
        "User manuals",
        "Project reports"
      ],
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Presentation className="h-12 w-12" />,
      title: "PPT Preparation",
      description: "Compelling presentations for projects and academic purposes",
      features: [
        "Professional slide design",
        "Content structuring",
        "Visual storytelling",
        "Presentation coaching",
        "Interactive elements"
      ],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Video className="h-12 w-12" />,
      title: "Webinars",
      description: "Interactive online sessions on cutting-edge technologies",
      features: [
        "Live interactive sessions",
        "Q&A with experts",
        "Real-world case studies",
        "Industry insights",
        "Recorded sessions"
      ],
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Users className="h-12 w-12" />,
      title: "Workshops",
      description: "Hands-on learning experiences with practical implementations",
      features: [
        "Hands-on coding sessions",
        "Project-based learning",
        "Collaborative environment",
        "Expert mentorship",
        "Certificate of completion"
      ],
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: <Target className="h-12 w-12" />,
      title: "Project Mentorship",
      description: "One-on-one guidance for your technical journey",
      features: [
        "Personalized guidance",
        "Regular progress reviews",
        "Career counseling",
        "Industry connections",
        "Skill development"
      ],
      color: "from-teal-500 to-cyan-500"
    }
  ];

  return (
    <div className="relative min-h-screen pt-16">
      <FloatingParticles />
      
      {/* Hero Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-foreground text-3d mb-6">
              Our <span className="text-glow bg-gradient-primary bg-clip-text text-transparent">Services</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive technical solutions designed to accelerate your learning and career growth
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -10, rotateY: 5 }}
                className="group perspective-1000"
              >
                <Card className="glass p-8 h-full interactive-3d border-card-border hover:border-primary/50 transition-all duration-500 transform-gpu">
                  <div className="relative">
                    <div className={`text-primary mb-6 p-4 rounded-xl bg-gradient-to-r ${service.color} bg-opacity-10 inline-block group-hover:scale-110 transition-transform duration-300`}>
                      {service.icon}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-glow transition-all">
                      {service.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <div className="space-y-3 mb-8">
                      {service.features.map((feature, featureIndex) => (
                        <motion.div 
                          key={featureIndex}
                          className="flex items-center space-x-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 + featureIndex * 0.1 }}
                        >
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                    
                    <Link to="/contact">
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                      >
                        Learn More
                        <Zap className="ml-2 h-4 w-4 group-hover:text-primary-foreground" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Choose the service that best fits your needs and let's accelerate your journey together
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="hero" size="lg">
                  Contact Us Today
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;