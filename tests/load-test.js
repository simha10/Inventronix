
// Usage: node tests/load-test.js
// Ensure server is running on localhost:5000

const API_URL = 'http://localhost:5000/api';
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'admin123'; // Matches .env default

async function runLoadTest(concurrentUsers = 500) {
    console.log(`🚀 Starting Load Test with ${concurrentUsers} users...`);

    try {
        // 1. Admin Login / Setup
        console.log('🔹 Creating Quiz and Room...');

        // Create Quiz
        const quizRes = await fetch(`${API_URL}/quiz/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-secret': ADMIN_SECRET
            },
            body: JSON.stringify({
                title: 'Load Test Quiz',
                description: 'Stress testing',
                questions: [
                    { question: '1+1?', options: ['1', '2', '3', '4'], correctAnswer: '2' },
                    { question: 'Color of sky?', options: ['Green', 'Blue', 'Red'], correctAnswer: 'Blue' }
                ]
            })
        });
        const quizData = await quizRes.json();
        if (!quizData.success) {
            console.error('Quiz Creation Failed:', JSON.stringify(quizData, null, 2));
            throw new Error('Failed to create quiz');
        }
        const quizId = quizData.quiz._id;

        // Create Room
        const roomRes = await fetch(`${API_URL}/room/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-secret': ADMIN_SECRET
            },
            body: JSON.stringify({ quizId, durationMinutes: 10 })
        });
        const roomData = await roomRes.json();
        if (!roomData.success) throw new Error('Failed to create room');
        const roomCode = roomData.room.code;
        console.log(`✅ Room Created: ${roomCode}`);

        // Start Room
        await fetch(`${API_URL}/room/${roomCode}/start`, {
            method: 'POST',
            headers: { 'x-admin-secret': ADMIN_SECRET }
        });
        console.log('✅ Room Started');

        // 2. Concurrent Joins
        console.log(`🔹 Simulating ${concurrentUsers} Joins...`);
        const startJoin = Date.now();
        const joinPromises = [];
        const users = [];

        for (let i = 0; i < concurrentUsers; i++) {
            joinPromises.push(
                fetch(`${API_URL}/room/join`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code: roomCode, name: `User_${i}` })
                }).then(res => res.json()).then(data => {
                    if (data.success) users.push({ ...data, name: `User_${i}` });
                    return data;
                })
            );
        }

        await Promise.all(joinPromises);
        const joinTime = Date.now() - startJoin;
        console.log(`✅ Joins completed in ${joinTime}ms (${users.length}/${concurrentUsers} successful)`);

        // 3. Concurrent Submissions
        console.log(`🔹 Simulating ${users.length} Submissions...`);
        const startSubmit = Date.now();
        const submitPromises = users.map(user => {
            // Randomly answer
            const answers = {};
            user.questions.forEach(q => {
                answers[q.id] = String(Math.floor(Math.random() * q.options.length));
            });

            return fetch(`${API_URL}/room/${roomCode}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    participantId: user.participantId,
                    answers,
                    submit: true
                })
            }).then(res => res.json());
        });

        await Promise.all(submitPromises);
        const submitTime = Date.now() - startSubmit;
        console.log(`✅ Submissions completed in ${submitTime}ms`);

        // 4. Verification
        console.log('🔹 Verifying Leaderboard...');
        // Force Close to compute leaderboard (if not using wait time)
        await fetch(`${API_URL}/room/${roomCode}/close`, {
            method: 'POST',
            headers: { 'x-admin-secret': ADMIN_SECRET }
        });

        const lbRes = await fetch(`${API_URL}/room/${roomCode}/leaderboard`);
        const lbData = await lbRes.json();

        // Fetch info to verify submission counts (since leaderboard is limited to 50)
        const infoRes = await fetch(`${API_URL}/room/${roomCode}/info`);
        const info = await infoRes.json();

        console.log('--- Results ---');
        console.log(`Leaderboard Entries: ${lbData.leaderboard.length}`);
        console.log(`Total Participants: ${info.participantCount}`);
        console.log(`Total Submitted (via info): ${info.submittedCount}`);

        if (info.participantCount === users.length && info.submittedCount === users.length) {
            console.log('🎉 SUCCESS: All users joined and submitted!');
            if (lbData.leaderboard.length === 50) {
                console.log('✅ Leaderboard correctly limited to top 50.');
            } else {
                console.log(`⚠️ Leaderboard count unexpected: ${lbData.leaderboard.length}`);
            }
        } else {
            console.log(`⚠️ MISMATCH: Expected ${users.length}, got P:${info.participantCount} / S:${info.submittedCount}`);
        }

    } catch (error) {
        console.error('❌ Test Failed:', error);
    }
}

runLoadTest();
