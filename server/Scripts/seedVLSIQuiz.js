import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Quiz } from '../models/Quiz.js';

dotenv.config();

const vlsiQuiz = {
    title: 'VLSI',
    description: 'Test your knowledge of VLSI (Very Large Scale Integration) basics, covering semiconductor physics, CMOS logic, and fabrication.',
    questions: [
        {
            id: 'q0',
            question: 'What is the primary reason CMOS technology is preferred over NMOS-only logic?',
            options: [
                'It uses fewer transistors for the same logic function.',
                'It has virtually zero static power dissipation.',
                'It is much easier to fabricate on a silicon wafer.',
                'It operates at much higher clock speeds.',
            ],
            correctAnswer: 'It has virtually zero static power dissipation.',
        },
        {
            id: 'q1',
            question: 'In a CMOS inverter, which transistor is typically placed in the Pull-Up Network (PUN)?',
            options: ['PMOS', 'NMOS', 'BJT', 'Pass-transistor'],
            correctAnswer: 'PMOS',
        },
        {
            id: 'q2',
            question: 'What does the term "Moore\'s Law" describe in the context of VLSI?',
            options: [
                'The speed of processors doubles every year.',
                'The power consumption of chips decreases by half every two years.',
                'The number of transistors on a microchip doubles approximately every two years.',
                'The cost of fabricating a wafer remains constant regardless of complexity.',
            ],
            correctAnswer: 'The number of transistors on a microchip doubles approximately every two years.',
        },
        {
            id: 'q3',
            question: 'Which region of operation is a MOS transistor in when it acts as a closed switch?',
            options: ['Cut-off region', 'Saturation region', 'Linear (Triode) region', 'Breakdown region'],
            correctAnswer: 'Cut-off region',
        },
        {
            id: 'q4',
            question: 'What is the purpose of a "Thick Oxide" in a MOSFET structure?',
            options: [
                'To increase the switching speed of the device.',
                'To provide insulation between the gate and the channel.',
                'To act as the source and drain terminals.',
                'To reduce the physical size of the transistor.',
            ],
            correctAnswer: 'To provide insulation between the gate and the channel.',
        },
        {
            id: 'q5',
            question: 'In VLSI design, what does "Layout" refer to?',
            options: [
                'The architectural block diagram of the CPU.',
                'The physical representation of the layers (diffusion, polysilicon, metal) on the chip.',
                'The assembly code used to program the hardware.',
                'The timing analysis report of the circuit.',
            ],
            correctAnswer: 'The physical representation of the layers (diffusion, polysilicon, metal) on the chip.',
        },
        {
            id: 'q6',
            question: 'Which effect occurs when the threshold voltage of a MOSFET changes due to a non-zero source-to-substrate voltage?',
            options: ['Channel Length Modulation', 'Body Effect', 'Subthreshold Leakage', 'Velocity Saturation'],
            correctAnswer: 'Channel Length Modulation',
        },
        {
            id: 'q7',
            question: 'What is a "Standard Cell" in VLSI design?',
            options: [
                'A customized transistor designed for a specific chip.',
                'A pre-designed logic gate with fixed height and functionality used in automated layout.',
                'The physical container used to ship the silicon wafers.',
                'A battery cell used to power low-voltage mobile processors.',
            ],
            correctAnswer: 'A pre-designed logic gate with fixed height and functionality used in automated layout.',
        },
        {
            id: 'q8',
            question: 'The process of adding impurities to a pure semiconductor to change its electrical properties is called:',
            options: ['Etching', 'Diffusion', 'Doping', 'Lithography'],
            correctAnswer: 'Doping',
        },
        {
            id: 'q9',
            question: 'Which type of power dissipation in CMOS is caused by the charging and discharging of load capacitances?',
            options: ['Static Power', 'Short-circuit Power', 'Dynamic Power', 'Leakage Power'],
            correctAnswer: 'Dynamic Power',
        },
    ],
};

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');

        // Delete old quiz with the same title
        const deleted = await Quiz.deleteMany({ title: 'VLSI' });
        console.log(`🗑️  Deleted ${deleted.deletedCount} old "VLSI" quiz(es)`);

        const quiz = new Quiz(vlsiQuiz);
        await quiz.save();
        console.log('✅ VLSI quiz added successfully!');
        console.log(`   Quiz ID: ${quiz._id}`);
        console.log(`   Title: ${quiz.title}`);
        console.log(`   Questions: ${quiz.questions.length}`);
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 MongoDB Disconnected');
    }
}

seed();
