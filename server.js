import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import multer from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { User, ChatSession, ActiveRoom, GiftLog } from './models.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// ── Environment Variables & MongoDB connection ──
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studystreak';

console.log('🍃 Connecting to MongoDB...');
mongoose.connect(MONGODB_URI)
  .then(() => console.log('🍃 MongoDB connected successfully!'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    console.log('⚠️ Running in offline-memory mode for database fallback.');
  });

// ── Multer Storage Configuration (Photo Uploads) ──
const uploadDir = join(__dirname, 'uploads');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage
});
const upload = multer({ storage });

// ── Middleware ──
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── In-memory OTP store (phone → {otp, expiresAt}) ──
const otpStore = new Map();

// ──────────────────────────────────────────────────────────
// API Router — must be registered BEFORE static files
// ──────────────────────────────────────────────────────────
const apiRouter = express.Router();

// POST /api/send-otp
apiRouter.post('/send-otp', async (req, res) => {
  const { phone } = req.body;

  if (!phone || !/^[0-9]{10}$/.test(phone)) {
    return res.status(400).json({ success: false, message: 'Invalid phone number. Must be 10 digits.' });
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store with 5-minute expiry
  otpStore.set(phone, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  // Read API key
  const apiKey = process.env.FAST2SMS_API_KEY || '';

  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    console.warn('⚠️  FAST2SMS_API_KEY not set. OTP generated but NOT sent via SMS. OTP:', otp);
    return res.json({
      success: true,
      message: 'OTP generated (SMS key not configured — check server console for OTP)',
      devOtp: otp,
    });
  }

  try {
    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&variables_values=${otp}&route=otp&numbers=${phone}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.return === true) {
      return res.json({ success: true, message: 'OTP sent to your phone!' });
    } else {
      console.error('Fast2SMS error:', data);
      return res.status(500).json({ success: false, message: data.message?.[0] || 'Failed to send OTP. Try again.' });
    }
  } catch (err) {
    console.error('SMS send error:', err);
    return res.status(500).json({ success: false, message: 'Server error while sending OTP.' });
  }
});

// POST /api/verify-otp
apiRouter.post('/verify-otp', (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ success: false, message: 'Phone and OTP are required.' });
  }

  const record = otpStore.get(phone);

  if (!record) {
    return res.status(400).json({ success: false, message: 'No OTP found for this number. Please request a new one.' });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(phone);
    return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
  }

  otpStore.delete(phone);
  return res.json({ success: true, message: 'Phone verified successfully!' });
});

// ─── MongoDB User Sync APIs ───
apiRouter.post('/sync-user', async (req, res) => {
  const { username, data } = req.body;
  if (!username || !data) return res.status(400).json({ success: false, message: 'Username and data are required.' });

  try {
    const key = username.toLowerCase();
    const user = await User.findOneAndUpdate(
      { username: new RegExp(`^${key}$`, 'i') },
      { $set: data },
      { new: true, upsert: true }
    );
    return res.json({ success: true, user });
  } catch (err) {
    console.error('User sync error:', err);
    return res.status(500).json({ success: false, message: 'Failed to sync user data.' });
  }
});

apiRouter.get('/user/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    return res.json({ success: true, user });
  } catch (err) {
    console.error('Fetch user error:', err);
    return res.status(500).json({ success: false, message: 'Database error.' });
  }
});

// ─── Companion Doubt Chat Session APIs ───
apiRouter.get('/chats/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const session = await ChatSession.findOne({ username: new RegExp(`^${username}$`, 'i') });
    return res.json({ success: true, messages: session ? session.messages : [] });
  } catch (err) {
    console.error('Fetch chats error:', err);
    return res.status(500).json({ success: false, message: 'Database error.' });
  }
});

apiRouter.post('/chats/message', async (req, res) => {
  const { username, sender, text, imageUrl } = req.body;
  if (!username || !sender) return res.status(400).json({ success: false, message: 'Username and sender are required.' });

  try {
    const key = username.toLowerCase();
    const session = await ChatSession.findOneAndUpdate(
      { username: new RegExp(`^${key}$`, 'i') },
      {
        $push: { messages: { sender, text, imageUrl, timestamp: new Date() } },
        $set: { updatedAt: new Date() }
      },
      { new: true, upsert: true }
    );
    return res.json({ success: true, messages: session.messages });
  } catch (err) {
    console.error('Add message error:', err);
    return res.status(500).json({ success: false, message: 'Failed to save message.' });
  }
});

// POST /api/chats/upload - Photo Attachment Channel
apiRouter.post('/chats/upload', upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });
  const fileUrl = `/uploads/${req.file.filename}`;
  return res.json({ success: true, fileUrl });
});

// ─── Admin Desk APIs ───
apiRouter.get('/admin/users', async (req, res) => {
  try {
    const usersList = await User.find({}).sort({ xp: -1 });
    const usersMap = {};
    usersList.forEach(u => {
      usersMap[u.username.toLowerCase()] = u;
    });
    return res.json({ success: true, users: usersMap });
  } catch (err) {
    console.error('Admin fetch error:', err);
    return res.status(500).json({ success: false, message: 'Database error.' });
  }
});

apiRouter.post('/admin/gift-gp', async (req, res) => {
  const { username, amount } = req.body;
  if (!username || !amount || amount <= 0) return res.status(400).json({ success: false, message: 'Invalid parameter.' });

  try {
    const key = username.toLowerCase();
    const user = await User.findOneAndUpdate(
      { username: new RegExp(`^${key}$`, 'i') },
      { $inc: { gold: amount } },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'Student not found.' });

    // Save gift log audit record
    const log = new GiftLog({ recipient: user.username, amount });
    await log.save();

    // Sum overall gifted coins
    const logs = await GiftLog.find({});
    const totalGifted = logs.reduce((sum, l) => sum + l.amount, 0);

    return res.json({ success: true, user, totalGifted });
  } catch (err) {
    console.error('Gift GP error:', err);
    return res.status(500).json({ success: false, message: 'Failed to gift GP.' });
  }
});

apiRouter.delete('/admin/delete/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOneAndDelete({ username: new RegExp(`^${username}$`, 'i') });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    return res.json({ success: true, message: `Account for ${user.username} deleted.` });
  } catch (err) {
    console.error('Admin delete error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete account.' });
  }
});

apiRouter.get('/admin/gift-total', async (req, res) => {
  try {
    const logs = await GiftLog.find({});
    const totalGifted = logs.reduce((sum, l) => sum + l.amount, 0);
    return res.json({ success: true, totalGifted });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Database error.' });
  }
});

// ─── Live Study Room APIs ───
apiRouter.post('/studyrooms/host', async (req, res) => {
  const { roomCode, hostUsername } = req.body;
  try {
    const room = await ActiveRoom.findOneAndUpdate(
      { roomCode: roomCode.toUpperCase() },
      {
        $set: {
          hostUsername,
          participants: [{ username: hostUsername, micActive: true, camActive: true, screenActive: false, statusText: 'Focus Desk', joinedAt: new Date() }],
          events: []
        }
      },
      { new: true, upsert: true }
    );
    return res.json({ success: true, room });
  } catch (err) {
    console.error('Host room error:', err);
    return res.status(500).json({ success: false, message: 'Failed to host room.' });
  }
});

apiRouter.post('/studyrooms/join', async (req, res) => {
  const { roomCode, username } = req.body;
  try {
    const code = roomCode.toUpperCase();
    const room = await ActiveRoom.findOne({ roomCode: code });
    if (!room) return res.status(404).json({ success: false, message: 'Session Not Found.' });

    // Avoid duplicate join
    const exists = room.participants.find(p => p.username.toLowerCase() === username.toLowerCase());
    if (!exists) {
      room.participants.push({ username, micActive: true, camActive: true, screenActive: false, statusText: 'Focus Desk', joinedAt: new Date() });
      await room.save();
    }
    return res.json({ success: true, room });
  } catch (err) {
    console.error('Join room error:', err);
    return res.status(500).json({ success: false, message: 'Failed to join room.' });
  }
});

apiRouter.post('/studyrooms/leave', async (req, res) => {
  const { roomCode, username } = req.body;
  try {
    const code = roomCode.toUpperCase();
    const room = await ActiveRoom.findOne({ roomCode: code });
    if (!room) return res.json({ success: true });

    if (room.hostUsername.toLowerCase() === username.toLowerCase()) {
      // Host is leaving, terminate room entirely
      await ActiveRoom.deleteOne({ roomCode: code });
      return res.json({ success: true, terminated: true });
    } else {
      // Remove participant
      room.participants = room.participants.filter(p => p.username.toLowerCase() !== username.toLowerCase());
      await room.save();
      return res.json({ success: true, terminated: false });
    }
  } catch (err) {
    console.error('Leave room error:', err);
    return res.status(500).json({ success: false, message: 'Failed to leave room.' });
  }
});

apiRouter.get('/studyrooms/active/:roomCode', async (req, res) => {
  const { roomCode } = req.params;
  try {
    const room = await ActiveRoom.findOne({ roomCode: roomCode.toUpperCase() });
    if (!room) return res.status(404).json({ success: false, message: 'Session Not Found.' });
    return res.json({ success: true, room });
  } catch (err) {
    console.error('Fetch active room error:', err);
    return res.status(500).json({ success: false, message: 'Database error.' });
  }
});

apiRouter.post('/studyrooms/event', async (req, res) => {
  const { roomCode, type, target, value } = req.body;
  try {
    const code = roomCode.toUpperCase();
    const room = await ActiveRoom.findOne({ roomCode: code });
    if (!room) return res.status(404).json({ success: false, message: 'Room not found.' });

    // Update participant states dynamically
    if (type === 'mic' || type === 'cam' || type === 'screen' || type === 'status') {
      const p = room.participants.find(p => p.username.toLowerCase() === target.toLowerCase());
      if (p) {
        if (type === 'mic') p.micActive = value;
        if (type === 'cam') p.camActive = value;
        if (type === 'screen') p.screenActive = value;
        if (type === 'status') p.statusText = value;
      }
    }

    room.events.push({ type, target, value, timestamp: new Date() });
    await room.save();
    return res.json({ success: true, room });
  } catch (err) {
    console.error('Post room event error:', err);
    return res.status(500).json({ success: false, message: 'Failed to post event.' });
  }
});

// GET /api/health — quick health check
apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount the API router at /api
app.use('/api', apiRouter);

// ── Serve static files (AFTER API routes) ──
app.use('/uploads', express.static(uploadDir));
app.use('/backend', express.static(join(__dirname, 'backend')));
app.use(express.static(join(__dirname, 'frontend')));

// ── Start ──
const server = createServer(app);

server.listen(PORT, () => {
  console.log(`\n🎓 Study Streak Battle server running at http://localhost:${PORT}`);
  console.log(`   Frontend:     http://localhost:${PORT}/login.html`);
  console.log(`   Send OTP:     POST http://localhost:${PORT}/api/send-otp`);
  console.log(`   Verify OTP:   POST http://localhost:${PORT}/api/verify-otp`);
  console.log(`   Health Check: GET  http://localhost:${PORT}/api/health\n`);
  if (!process.env.FAST2SMS_API_KEY || process.env.FAST2SMS_API_KEY === 'YOUR_API_KEY_HERE') {
    console.log('⚠️  FAST2SMS_API_KEY is not set.');
    console.log('   → Create a FREE account at https://www.fast2sms.com');
    console.log('   → Copy your API key from the Dev API section');
    console.log('   → Set it in .env file: FAST2SMS_API_KEY=your_key_here\n');
  }
});
