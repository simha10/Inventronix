import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Cpu, FileSpreadsheet, Hammer, Code2, Rocket } from "lucide-react";
import { GrowthAnimation } from "./GrowthAnimation";

const stages = [
  {
    id: "01",
    title: "System Spec",
    description: "Architectural definition and BOM analysis. Mentors review constraints before design begins.",
    icon: <FileSpreadsheet className="w-8 h-8" />,
    stats: "Training Goal: Select 3 ICs + cost BOM for use case",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20"
  },
  {
    id: "02",
    title: "Schematic Design",
    description: "Capturing the logic. Mentors provide 1-on-1 sessions for design rule checks (DRC).",
    icon: <Cpu className="w-8 h-8" />,
    stats: "Tech Stack: KiCad / Altium Designer",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20"
  },
  {
    id: "03",
    title: "Fabrication",
    description: "Assembly and Soldering. Real-time debugging of hardware manufacturing issues.",
    icon: <Hammer className="w-8 h-8" />,
    stats: "Lab Report: Test points verified precise",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20"
  },
  {
    id: "04",
    title: "Firmware Rev",
    description: "Writing the soul of the hardware. Focus on memory optimization and RTOS.",
    icon: <Code2 className="w-8 h-8" />,
    stats: "C / C++: No 'delay()' function usage!",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20"
  },
  {
    id: "05",
    title: "QA & Deploy",
    description: "Testing for EMI/EMC and final product packaging for your professional portfolio.",
    icon: <Rocket className="w-8 h-8" />,
    stats: "Outcome: Product ready for real-world showcase",
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20"
  }
];

export const SuccessRoute = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 uppercase tracking-wider">
            The 5-Stage Project Engine
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our proprietary development lifecycle that mimics Tier-1 R&D labs, emphasizing constant mentor-student feedback loops.
          </p>
        </div>

        <div className="relative flex gap-8">
            {/* Growth Animation displayed on the left side on large screens */}
            <GrowthAnimation />

            {/* Timeline Content */}
            <div className="flex-1 space-y-8 relative z-10 pl-0 lg:pl-16">
            {stages.map((stage, index) => (
                <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                <Card className={`glass p-6 md:p-8 border ${stage.border} hover:border-opacity-50 transition-all duration-300 group`}>
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    {/* ID Indicator */}
                    <div className={`hidden md:flex flex-col items-center justify-center w-16 h-16 rounded-2xl ${stage.bg} ${stage.color} font-bold text-xl border ${stage.border}`}>
                        <span className="text-xs opacity-70">STAGE</span>
                        {stage.id}
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 md:mb-1">
                            <span className={`md:hidden text-xs font-bold px-2 py-1 rounded ${stage.bg} ${stage.color}`}>STAGE {stage.id}</span>
                            <h3 className="text-2xl font-bold text-foreground group-hover:text-glow transition-all">{stage.title}</h3>
                        </div>
                        <p className="text-muted-foreground text-lg mb-4">{stage.description}</p>
                        
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${stage.bg} border ${stage.border}`}>
                             <div className={`${stage.color}`}>{stage.icon}</div>
                             <span className={`text-sm font-medium ${stage.color}`}>{stage.stats}</span>
                        </div>
                    </div>
                    </div>
                </Card>
                </motion.div>
            ))}
            </div>
        </div>

      </div>
    </section>
  );
};
