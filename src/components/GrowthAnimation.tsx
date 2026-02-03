import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Sprout, TreeDeciduous, TreePine, Flower2, Leaf } from "lucide-react";

export const GrowthAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.5, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  // Transform icons based on scroll progress
  const seedOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const sproutOpacity = useTransform(scrollYProgress, [0.15, 0.35, 0.45], [0, 1, 0]);
  const plantOpacity = useTransform(scrollYProgress, [0.4, 0.6, 0.7], [0, 1, 0]);
  const smallTreeOpacity = useTransform(scrollYProgress, [0.65, 0.85, 0.95], [0, 1, 0]);
  const fullTreeOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);

  return (
    <div ref={containerRef} className="absolute left-4 top-0 bottom-0 w-24 hidden lg:flex flex-col items-center justify-center pointer-events-none z-0">
      <div className="sticky top-1/2 -translate-y-1/2 h-64 w-64 flex items-center justify-center">
        {/* Connection Line */}
        <motion.div 
          style={{ scaleY: scrollYProgress, originY: 0 }}
          className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 to-primary/80"
        />

        {/* Growth Stages */}
        <div className="relative z-10 p-4 rounded-full bg-background/50 backdrop-blur-sm border border-primary/20">
            {/* Stage 1: Seed */}
            <motion.div style={{ opacity: seedOpacity, position: 'absolute', inset: 0 }} className="flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
            </motion.div>

            {/* Stage 2: Sprout */}
            <motion.div style={{ opacity: sproutOpacity, position: 'absolute', inset: 0 }} className="flex items-center justify-center">
                <Sprout className="w-12 h-12 text-green-400" />
            </motion.div>

            {/* Stage 3: Flowering Plant */}
            <motion.div style={{ opacity: plantOpacity, position: 'absolute', inset: 0 }} className="flex items-center justify-center">
                 <Flower2 className="w-16 h-16 text-pink-400" />
            </motion.div>

             {/* Stage 4: Small Tree */}
             <motion.div style={{ opacity: smallTreeOpacity, position: 'absolute', inset: 0 }} className="flex items-center justify-center">
                 <TreePine className="w-20 h-20 text-emerald-500" />
            </motion.div>

             {/* Stage 5: Big Tree */}
             <motion.div style={{ opacity: fullTreeOpacity, position: 'absolute', inset: 0 }} className="flex items-center justify-center">
                 <TreeDeciduous className="w-24 h-24 text-green-600 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
            </motion.div>
        </div>
      </div>
    </div>
  );
};
