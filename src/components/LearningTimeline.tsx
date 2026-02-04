import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { BookOpen, Code, Trophy, GraduationCap, Briefcase } from 'lucide-react';
import { Card } from '@/components/ui/card';

const timelineData = [
  {
    title: "The Beginning",
    description: "Start your journey with fundamental concepts and core programming logic. Build your first 'Hello World'.",
    icon: BookOpen,
    date: "Step 1",
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Deep Dive",
    description: "Master advanced algorithms, data structures, and system design patterns. The code becomes your canvas.",
    icon: Code,
    date: "Step 2",
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Real World Projects",
    description: "Collaborate on production-level applications. Learn git, CI/CD, and agile methodologies.",
    icon: Briefcase,
    date: "Step 3",
    color: "from-orange-500 to-red-500"
  },
  {
    title: "Mastery & Certification",
    description: "Validate your skills with industry-recognized certifications and portfolio reviews.",
    icon: Trophy,
    date: "Step 4",
    color: "from-yellow-500 to-amber-500"
  },
  {
    title: "Career Launch",
    description: "Mock interviews, resume building, and placement assistance to land your dream job.",
    icon: GraduationCap,
    date: "Step 5",
    color: "from-green-500 to-emerald-500"
  }
];

const LearningTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Your <span className="gradient-text">Learning Journey</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
             A structured path from beginner to professional engineer.
          </p>
        </motion.div>

        <div className="relative">
          {/* Central Line - Desktop */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gray-800 hidden md:block">
            <motion.div 
              style={{ height: lineHeight }} 
              className="w-full bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500 origin-top"
            />
          </div>

           {/* Central Line - Mobile */}
           <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-800 md:hidden">
            <motion.div 
              style={{ height: lineHeight }} 
              className="w-full bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500 origin-top"
            />
          </div>


          <div className="space-y-12 md:space-y-24">
            {timelineData.map((item, index) => {
               const isEven = index % 2 === 0;
               const Icon = item.icon;
               
               return (
                 <motion.div
                    key={index}
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
                      !isEven ? "md:direction-rtl" : ""
                    }`}
                 >
                   {/* Timeline Node - Desktop */}
                   <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full border-4 border-gray-900 bg-gray-800 z-10 hidden md:flex">
                     <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${item.color}`} />
                   </div>

                   {/* Content Side */}
                   <div className={`${!isEven ? "md:order-2 md:pl-12" : "md:pr-12 md:text-right"} pl-20 md:pl-0`}>
                      {/* Mobile Node */}
                      <div className="absolute left-5 transform -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full border-4 border-gray-900 bg-gray-800 z-10 md:hidden">
                         <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color}`} />
                      </div>

                      <Card className={`glass p-6 md:p-8 hover:border-primary/50 transition-all duration-300 relative group overflow-hidden`}>
                         <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                         
                         <div className={`flex items-center gap-4 mb-4 ${!isEven && "md:flex-row-reverse"}`}>
                            <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color}`}>
                               <Icon className="w-6 h-6 text-white" />
                            </div>
                            <span className={`text-sm font-bold tracking-wider uppercase bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                              {item.date}
                            </span>
                         </div>
                         
                         <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                           {item.title}
                         </h3>
                         <p className="text-gray-400 leading-relaxed">
                           {item.description}
                         </p>
                      </Card>
                   </div>
                   
                   {/* Empty Side for layout balance */}
                   <div className="hidden md:block" />
                 </motion.div>
               );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningTimeline;
