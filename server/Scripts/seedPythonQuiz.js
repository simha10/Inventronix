import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Quiz } from '../models/Quiz.js';

dotenv.config();

const pythonQuiz = {
    title: 'Python Programming',
    description: 'Test your knowledge of Python programming fundamentals',
    questions: [
        {
            id: 'q0',
            question: 'Which of the following is the correct extension of a Python file?',
            options: ['.py', '.python', '.p', '.pyt'],
            correctAnswer: '.py',
        },
        {
            id: 'q1',
            question: 'How do you create a variable with the numeric value 5 in Python?',
            options: ['x = int(5)', 'x = 5', 'Both A and B are correct', 'var x = 5'],
            correctAnswer: 'Both A and B are correct',
        },
        {
            id: 'q2',
            question: 'What is the correct syntax to output "Hello World" in Python?',
            options: ['echo("Hello World")', 'print("Hello World")', 'p("Hello World")', 'console.log("Hello World")'],
            correctAnswer: 'print("Hello World")',
        },
        {
            id: 'q3',
            question: 'Which data type is used to store a sequence of characters?',
            options: ['int', 'float', 'str', 'complex'],
            correctAnswer: 'str',
        },
        {
            id: 'q4',
            question: 'Which of these is used to define a block of code (like loops or functions) in Python?',
            options: ['Brackets', 'Parentheses', 'Indentation', 'Quotation marks'],
            correctAnswer: 'Indentation',
        },
        {
            id: 'q5',
            question: 'How do you start a "for" loop in Python?',
            options: ['for x in y:', 'for x > y:', 'for each x in y:', 'for (i=0; i<10; i++)'],
            correctAnswer: 'for x in y:',
        },
        {
            id: 'q6',
            question: 'What is the correct way to create a list in Python?',
            options: ['fruits = ["apple", "banana", "cherry"]', 'fruits = {"apple", "banana", "cherry"}', 'fruits = ("apple", "banana", "cherry")', 'fruits = <"apple", "banana", "cherry">'],
            correctAnswer: 'fruits = ["apple", "banana", "cherry"]',
        },
        {
            id: 'q7',
            question: 'Which keyword is used to create a function in Python?',
            options: ['function', 'method', 'def', 'create'],
            correctAnswer: 'def',
        },
        {
            id: 'q8',
            question: 'What is the output of print(2 ** 3)?',
            options: ['6', '8', '9', '5'],
            correctAnswer: '8',
        },
        {
            id: 'q9',
            question: 'Which of the following is used to handle exceptions in Python?',
            options: ['try...except', 'throw...catch', 'try...catch', 'attempt...error'],
            correctAnswer: 'try...except',
        },
    ],
};

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');

        // Delete old quiz with the same title
        const deleted = await Quiz.deleteMany({ title: 'Python Programming' });
        console.log(`🗑️  Deleted ${deleted.deletedCount} old "Python Programming" quiz(es)`);

        const quiz = new Quiz(pythonQuiz);
        await quiz.save();
        console.log('✅ Python Programming quiz added successfully!');
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
