import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import FloatingParticles from "@/components/FloatingParticles";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  Globe,
  Linkedin,
  Instagram,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMobile } from "@/contexts/mobile-context";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { isMobile } = useMobile();
  const [submitStatus, setSubmitStatus] = React.useState<
    "idle" | "success" | "error"
  >("idle");

  const contactInfo = [
    {
      icon: <Mail className="h-8 w-8" />,
      title: "Email",
      details: "inventronix4u@gmail.com",
      description: "Send us an email and we'll respond within 24 hours",
    },
    {
      icon: <Phone className="h-8 w-8" />,
      title: "Phone",
      details: "+91 76758 95113",
      description: "Call us during business hours for immediate assistance",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Business Hours",
      details: "Mon - Sat: 9:00 AM - 6:00 PM",
      description: "We're available to help you during these hours",
    },
  ];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const formData = new FormData(event.currentTarget);
    formData.append("access_key", "6f0fe61f-bef7-47cc-9e27-8ce8dd687ae9");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus("success");
        (event.target as HTMLFormElement).reset();
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Get In{" "}
              <span className="text-glow bg-gradient-primary bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ready to accelerate your engineering journey? Let's connect and
              discuss how we can help you achieve your goals
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="glass p-8 interactive-3d border-card-border">
                <div className="flex items-center mb-8">
                  <MessageSquare className="h-8 w-8 text-primary mr-3" />
                  <h2 className="text-3xl font-bold text-foreground">
                    Send us a Message
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <input
                    type="hidden"
                    name="from_name"
                    value="Inventronix Website"
                  />
                  <input
                    type="hidden"
                    name="subject"
                    value="New Contact Form Submission"
                  />
                  <div className="h-captcha" data-captcha="true"></div>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      className="glass-subtle border-card-border focus:border-primary transition-all duration-300"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="glass-subtle border-card-border focus:border-primary transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      className="glass-subtle border-card-border focus:border-primary transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-foreground">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="How can we help you?"
                      className="glass-subtle border-card-border focus:border-primary transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-foreground">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more about your project or questions..."
                      rows={6}
                      className="glass-subtle border-card-border focus:border-primary transition-all duration-300 resize-none"
                      required
                    />
                  </div>

                  {submitStatus === "success" && (
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500">
                      Thank you for your message! We'll get back to you soon.
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
                      Sorry, there was an error sending your message. Please try
                      again.
                    </div>
                  )}

                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full group"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    {!isSubmitting && (
                      <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    )}
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Contact Information
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  We're here to help you succeed. Whether you have questions
                  about our services, need guidance on a project, or want to
                  discuss collaboration opportunities, don't hesitate to reach
                  out.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                  >
                    <Card className="glass p-6 interactive-3d border-card-border hover:border-primary/50 transition-all duration-300">
                      <div className="flex items-start space-x-4">
                        <div className="text-primary mt-1">{info.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-foreground mb-2">
                            {info.title}
                          </h3>
                          <p className="text-primary font-medium mb-2">
                            {info.details}
                          </p>
                          <p className="text-muted-foreground">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Social Media Icons */}
              <div className="mt-12 flex justify-center space-x-8 text-primary">
                <a
                  href="https://www.linkedin.com/company/inventronix4u/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="hover:text-blue-600 transition-colors"
                >
                  <Linkedin className="h-8 w-8" />
                </a>
                <a
                  href="mailto:inventronix4u@gmail.com"
                  aria-label="Email"
                  className="hover:text-red-600 transition-colors"
                >
                  <Mail className="h-8 w-8" />
                </a>
                <a
                  href="https://www.instagram.com/inventronix?igsh=MXo4ZGxlN2l2ZmVt"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="hover:text-pink-600 transition-colors"
                >
                  <Instagram className="h-8 w-8" />
                </a>
              </div>
            </motion.div>
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
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of students who have transformed their careers with
              InventroniX
            </p>
            <a 
              href="/INTX Broc.pdf" 
              download="INTX_Brochure.pdf"
              className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium text-center text-white rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/30 transition-all duration-300 min-h-[44px] whitespace-nowrap"
            >
              Download Brochure
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
