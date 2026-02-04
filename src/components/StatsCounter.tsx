import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Users, Award, Briefcase, Star } from 'lucide-react';

function AnimatedCounter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { 
    duration: 3000,
    bounce: 0
  });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        const displayValue = value % 1 === 0 
          ? Math.floor(latest) 
          : latest.toFixed(1);
        ref.current.textContent = prefix + displayValue + suffix;
      }
    });
  }, [springValue, suffix, prefix, value]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

export default function StatsCounter() {
  const stats = [
    { 
      icon: Users,
      value: 5000, 
      suffix: "+", 
      label: "Students Trained",
      description: "Across 15+ countries",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      icon: Award,
      value: 98, 
      suffix: "%", 
      label: "Placement Rate",
      description: "In top tech companies",
      color: "from-purple-500 to-pink-500"
    },
    { 
      icon: Briefcase,
      value: 50, 
      suffix: "+", 
      label: "Industry Partners",
      description: "Google, Amazon, Microsoft",
      color: "from-orange-500 to-red-500"
    },
    { 
      icon: Star,
      value: 4.9, 
      suffix: "/5", 
      label: "Student Rating",
      description: "Based on 2000+ reviews",
      color: "from-yellow-500 to-amber-500"
    }
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-blue-900/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="glass rounded-3xl p-8 hover:border-cyan-500/50 transition-all duration-300"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`inline-block p-4 rounded-2xl bg-gradient-to-r ${stat.color} mb-6 shadow-lg shadow-cyan-500/20`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </motion.div>

                <div className={`text-5xl font-bold mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>

                <h3 className="text-xl font-semibold text-white mb-2">
                  {stat.label}
                </h3>

                <p className="text-sm text-gray-400">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
