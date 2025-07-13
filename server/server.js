const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'db.json');

// --- Helper functions to read/write DB ---
const readDb = async () => JSON.parse(await fs.readFile(dbPath, 'utf8'));
const writeDb = async (data) => fs.writeFile(dbPath, JSON.stringify(data, null, 2));

// --- API Endpoints ---

// Login Endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { role, username, password } = req.body;
        const db = await readDb();
        const userList = db[role + 's'];
        if (!userList) return res.status(400).json({ message: "Invalid role" });
        const user = userList.find(u => u.username === username && u.password === password);
        if (user) {
            const { password, ...userToReturn } = user;
            res.json({ ...userToReturn, role });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) { res.status(500).json({ message: "Server error" }); }
});

// Sign Up Endpoint
app.post('/api/signup', async (req, res) => {
    try {
        const { role, username, password, name, grade, subjects } = req.body;
        const db = await readDb();
        const userListKey = `${role}s`;
        
        const userExists = db[userListKey].some(u => u.username === username);
        if (userExists) {
            return res.status(409).json({ message: "Username already exists." });
        }

        const newUser = {
            id: role === 'student' ? `stu${db.students.length + 1}` : `t${db.teachers.length + 1}`,
            username,
            password,
            name,
            grade: role === 'student' ? grade : undefined,
            subjects: role === 'teacher' ? subjects : undefined,
            info: role === 'student' ? `Grade ${grade}` : `Teaches: ${subjects.join(', ')}`,
            avatarUrl: `https://placehold.co/100x100/E2E8F0/4A5568?text=${name.charAt(0)}`
        };

        db[userListKey].push(newUser);
        await writeDb(db);

        const { password: _, ...userToReturn } = newUser;
        res.status(201).json({ ...userToReturn, role });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// User Update Endpoint
app.put('/api/users/:role/:id', async (req, res) => {
    try {
        const db = await readDb();
        const { role, id } = req.params;
        const updatedInfo = req.body;
        const userListKey = `${role}s`;
        const userIndex = db[userListKey]?.findIndex(u => u.id === id);
        if (userIndex === -1 || !db[userListKey]) return res.status(404).json({ message: "User not found" });
        const originalUser = db[userListKey][userIndex];
        db[userListKey][userIndex] = { ...originalUser, name: updatedInfo.name || originalUser.name, info: updatedInfo.info || originalUser.info };
        await writeDb(db);
        const { password, ...userToReturn } = db[userListKey][userIndex];
        res.json({ ...userToReturn, role });
    } catch (error) { res.status(500).json({ message: "Server error" }); }
});

// Library Endpoint
app.get('/api/library', async (req, res) => {
    try {
        const db = await readDb();
        res.json(db.library || {});
    } catch (error) { res.status(500).json({ message: "Server error" }); }
});

// Assignments Endpoints
app.get('/api/assignments', async (req, res) => {
    try {
        const db = await readDb();
        res.json(db.assignments || []);
    } catch (error) { res.status(500).json({ message: "Server error" }); }
});
app.post('/api/assignments', async (req, res) => {
    try {
        const db = await readDb();
        const newAssignment = { id: uuidv4(), ...req.body };
        db.assignments.push(newAssignment);
        await writeDb(db);
        res.status(201).json(newAssignment);
    } catch (error) { res.status(500).json({ message: "Server error" }); }
});
app.delete('/api/assignments/:id', async (req, res) => {
    try {
        const db = await readDb();
        const { id } = req.params;
        const initialLength = db.assignments.length;
        db.assignments = db.assignments.filter(a => a.id !== id);
        if (db.assignments.length === initialLength) return res.status(404).json({ message: "Assignment not found" });
        await writeDb(db);
        res.status(200).json({ message: "Assignment deleted" });
    } catch (error) { res.status(500).json({ message: "Server error" }); }
});
app.put('/api/assignments/submit', async (req, res) => {
    const { assignmentId, studentId } = req.body;
    const db = await readDb();
    if (!db.submissions) db.submissions = [];
    const existing = db.submissions.find(s => s.assignmentId === assignmentId && s.studentId === studentId);
    if (existing) {
        existing.status = 'submitted';
    } else {
        db.submissions.push({ id: uuidv4(), assignmentId, studentId, status: 'submitted' });
    }
    await writeDb(db);
    res.status(200).json({ message: 'Assignment submitted' });
});
app.get('/api/submissions/:studentId', async (req, res) => {
    const { studentId } = req.params;
    const db = await readDb();
    const userSubmissions = db.submissions.filter(s => s.studentId === studentId);
    res.json(userSubmissions);
});

// Booking & Schedule Endpoints
app.get('/api/availability', async (req, res) => {
    try {
        const db = await readDb();
        const availableSlots = db.availability.filter(slot => !slot.booked);
        res.json(availableSlots);
    } catch (error) { res.status(500).json({ message: "Server error" }); }
});
app.post('/api/availability', async (req, res) => {
    try {
        const db = await readDb();
        const newSlot = { id: uuidv4(), ...req.body, booked: false };
        if (!db.availability) db.availability = [];
        db.availability.push(newSlot);
        await writeDb(db);
        res.status(201).json(newSlot);
    } catch (error) { res.status(500).json({ message: "Server error" }); }
});
app.get('/api/bookings', async (req, res) => {
    try {
        const db = await readDb();
        const { userId } = req.query;
        if (userId) {
            const userBookings = db.bookings.filter(b => b.studentId === userId || b.teacherId === userId);
            return res.json(userBookings);
        }
        res.json(db.bookings || []);
    } catch (error) { res.status(500).json({ message: "Server error" }); }
});
app.post('/api/bookings', async (req, res) => {
    try {
        const db = await readDb();
        const { availabilityId, studentId, studentName } = req.body;
        const slot = db.availability.find(a => a.id === availabilityId);
        if (!slot || slot.booked) return res.status(400).json({ message: "Slot not available." });
        slot.booked = true;
        const newBooking = { id: uuidv4(), availabilityId, studentId, studentName, teacherId: slot.teacherId, teacherName: slot.teacherName, date: slot.date, time: slot.time };
        if (!db.bookings) db.bookings = [];
        db.bookings.push(newBooking);
        if (!db.lessons) db.lessons = {};
        db.lessons[newBooking.id] = [];
        if (!db.notifications) db.notifications = [];
        db.notifications.push({ id: uuidv4(), userId: slot.teacherId, message: `${studentName} has booked a lesson with you.`, read: false });
        await writeDb(db);
        res.status(201).json(newBooking);
    } catch (error) { res.status(500).json({ message: "Server error" }); }
});
app.delete('/api/bookings/:id', async (req, res) => {
    const { id } = req.params;
    const db = await readDb();
    const booking = db.bookings.find(b => b.id === id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    const slot = db.availability.find(a => a.id === booking.availabilityId);
    if (slot) slot.booked = false;
    db.bookings = db.bookings.filter(b => b.id !== id);
    delete db.lessons[id];
    await writeDb(db);
    res.status(200).json({ message: "Booking cancelled" });
});

// Notifications Endpoints
app.get('/api/notifications/:userId', async (req, res) => {
    const { userId } = req.params;
    const db = await readDb();
    const userNotifications = db.notifications.filter(n => n.userId === userId);
    res.json(userNotifications);
});
app.put('/api/notifications/read', async (req, res) => {
    const { userId } = req.body;
    const db = await readDb();
    db.notifications.forEach(n => { if (n.userId === userId) n.read = true; });
    await writeDb(db);
    res.status(200).json({ message: "Notifications marked as read" });
});

// Lesson Chat Endpoints
app.get('/api/lessons/:bookingId/messages', async (req, res) => {
    try {
        const db = await readDb();
        const { bookingId } = req.params;
        res.json(db.lessons[bookingId] || []);
    } catch (error) { res.status(500).json({ message: "Server error" }); }
});
app.post('/api/lessons/:bookingId/messages', async (req, res) => {
    try {
        const db = await readDb();
        const { bookingId } = req.params;
        const newMessage = { id: uuidv4(), ...req.body, timestamp: new Date().toISOString() };
        if (!db.lessons[bookingId]) return res.status(404).json({ message: "Lesson not found." });
        db.lessons[bookingId].push(newMessage);
        await writeDb(db);
        res.status(201).json(newMessage);
    } catch (error) { res.status(500).json({ message: "Server error" }); }
});

app.listen(port, () => { console.log(`Server is running successfully on http://localhost:${port}`); });
