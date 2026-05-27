import mongoose from 'mongoose';

// ─── 1. User Schema (RPG Student Profile) ───
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true, lowercase: true },
  password: { type: String, required: true },
  studentId: { type: String },
  parentId: { type: String },
  phone: { type: String },
  branch: { type: String },
  streak: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  freezes: { type: Number, default: 3 },
  lastCheckIn: { type: Date, default: null },
  gold: { type: Number, default: 0 },
  hp: { type: Number, default: 100 },
  unlockedBadges: [{ type: String }],
  quests: [{
    id: String,
    text: String,
    xp: Number,
    gp: Number,
    rarity: String,
    completed: Boolean,
    createdAt: { type: Date, default: Date.now }
  }],
  unlockedThemes: [{ type: String }],
  activeTheme: { type: String, default: 'default' },
  bossHp: { type: Number, default: 100 },
  bossMaxHp: { type: Number, default: 100 },
  bossLevel: { type: Number, default: 1 },
  focusHistory: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0] },
  createdAt: { type: Date, default: Date.now }
});

// ─── 2. ChatSession Schema (Companion Doubt Log with Photo Uploads) ───
const ChatSessionSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true, lowercase: true },
  messages: [{
    sender: { type: String, enum: ['user', 'companion'], required: true },
    text: { type: String },
    imageUrl: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  updatedAt: { type: Date, default: Date.now }
});

// ─── 3. ActiveRoom Schema (Live Group Study Session) ───
const ActiveRoomSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, unique: true, index: true },
  hostUsername: { type: String, required: true },
  participants: [{
    username: { type: String, required: true },
    micActive: { type: Boolean, default: true },
    camActive: { type: Boolean, default: true },
    screenActive: { type: Boolean, default: false },
    statusText: { type: String, default: 'Focus Desk' },
    joinedAt: { type: Date, default: Date.now }
  }],
  events: [{
    type: { type: String }, // 'mic', 'cam', 'kick', 'mute'
    target: String,
    value: mongoose.Schema.Types.Mixed,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

// ─── 4. GiftLog Schema (Admin GP Auditing) ───
const GiftLogSchema = new mongoose.Schema({
  recipient: { type: String, required: true },
  amount: { type: Number, required: true },
  giftedAt: { type: Date, default: Date.now }
});

// Create Mongoose models
export const User = mongoose.model('User', UserSchema);
export const ChatSession = mongoose.model('ChatSession', ChatSessionSchema);
export const ActiveRoom = mongoose.model('ActiveRoom', ActiveRoomSchema);
export const GiftLog = mongoose.model('GiftLog', GiftLogSchema);
