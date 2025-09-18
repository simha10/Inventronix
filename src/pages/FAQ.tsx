import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import FloatingParticles from '@/components/FloatingParticles';
import { HelpCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const faqs = [
    {
      question: "What services does Inventronix offer?",
      answer: "Inventronix offers comprehensive technical mentorship including project development guidance, documentation services, PPT preparation, webinars, hands-on workshops, and personalized project mentorship. We cover the complete spectrum of technical education and career development."
    },
    {
      question: "Who can benefit from Inventronix mentorship?",
      answer: "Our services are designed for engineering students, recent graduates, professionals looking to upskill, and anyone passionate about technology. Whether you're a beginner or looking to advance your career, our tailored approach ensures everyone finds value."
    },
    {
      question: "How do I get started with Inventronix?",
      answer: "Getting started is simple! Contact us through our website, email, or phone. We'll schedule a consultation to understand your goals and recommend the best services for your needs. From there, we'll create a personalized learning path."
    },
    {
      question: "Are the mentorship sessions conducted online or offline?",
      answer: "We offer both online and offline mentorship options to suit your preferences and location. Our online sessions use advanced interactive platforms, while offline sessions are available at our centers. Remote mentorship allows us to serve students globally."
    },
    {
      question: "What technologies and programming languages do you cover?",
      answer: "We cover a wide range of technologies including web development (React, Node.js, Python), mobile development, cloud computing, AI/ML, data science, cybersecurity, and emerging technologies. Our curriculum is regularly updated to reflect industry trends."
    },
    {
      question: "How experienced are your mentors?",
      answer: "Our mentors are industry professionals with 10+ years of experience in their respective fields. They have worked with leading companies and have a proven track record of successful project delivery and student mentorship."
    },
    {
      question: "Do you provide placement assistance?",
      answer: "Yes, we provide comprehensive placement assistance including resume building, interview preparation, portfolio development, and connections with our industry partners. We have a strong network of companies that regularly hire our students."
    },
    {
      question: "What is the duration of your programs?",
      answer: "Program duration varies based on your goals and chosen services. We offer flexible options from short-term workshops (1-2 weeks) to comprehensive mentorship programs (3-6 months). We also provide ongoing support for long-term projects."
    },
    {
      question: "How much do your services cost?",
      answer: "Our pricing is competitive and varies based on the services you choose. We offer flexible payment options and packages to suit different budgets. Contact us for detailed pricing information and available discounts."
    },
    {
      question: "Do you offer group discounts or corporate training?",
      answer: "Yes, we offer attractive group discounts for teams and comprehensive corporate training programs. Our corporate solutions are customized to meet specific organizational needs and can be delivered on-site or remotely."
    },
    {
      question: "Can I get a certificate upon completion?",
      answer: "Absolutely! We provide certificates of completion for all our programs and workshops. These certificates are recognized by industry partners and can add value to your professional profile."
    },
    {
      question: "What if I'm not satisfied with the service?",
      answer: "We're committed to your success and satisfaction. If you're not completely satisfied with our service, we offer a money-back guarantee within the first week of starting your program. We also provide ongoing support to ensure your success."
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
              Frequently Asked <span className="text-glow bg-gradient-primary bg-clip-text text-transparent">Questions</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Find answers to common questions about our services, programs, and how we can help accelerate your technical journey
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="glass p-8 border-card-border">
              <div className="flex items-center mb-8">
                <HelpCircle className="h-8 w-8 text-primary mr-3" />
                <h2 className="text-3xl font-bold text-foreground">Common Questions</h2>
              </div>
              
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <AccordionItem 
                      value={`item-${index}`} 
                      className="glass-subtle rounded-lg px-6 border-card-border hover:border-primary/30 transition-all duration-300"
                    >
                      <AccordionTrigger className="text-foreground hover:text-primary transition-colors text-left py-6">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass p-12 rounded-2xl"
          >
            <MessageCircle className="h-16 w-16 text-primary mx-auto mb-6 animate-float" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Still Have Questions?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Can't find what you're looking for? Our team is here to help you with personalized answers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="glass" size="lg">
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

export default FAQ;