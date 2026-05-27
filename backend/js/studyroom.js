/* ==========================================
   STUDY STREAK BATTLE - GROUP STUDY ARENA SCRIPT
   ========================================== */

let currentUser = null;
let localMediaStream = null;
let screenMediaStream = null;
let micEnabled = true;
let camEnabled = false;
let screenSharingActive = false;

// Custom Toast helper
function showToast(title, message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconClass = 'fa-circle-info';
  if (type === 'success') {
    iconClass = 'fa-circle-check';
  } else if (type === 'alert') {
    iconClass = 'fa-triangle-exclamation';
  }
  
  toast.innerHTML = `
    <i class="fa-solid ${iconClass} toast-icon"></i>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('toast-out');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 4000);
}

// Dom Loader
document.addEventListener('DOMContentLoaded', async () => {
  const user = await window.checkSession('studyroom');
  if (!user) return;
  currentUser = user;
  
  // Update header details
  const nameEl = document.getElementById('user-display-name');
  const levelEl = document.getElementById('user-display-level');
  if (nameEl) nameEl.innerText = user.username;
  if (levelEl) levelEl.innerText = `Level ${user.level} (${user.branch || 'General'})`;
  
  // Play enter chime if playSynthSound is loaded
  if (window.playSynthSound) window.playSynthSound('unlock');
});

// Group Study Room Controls
function adjustVideoGridLayout() {
  const grid = document.querySelector('.big-room-video-grid');
  if (!grid) return;
  const boxes = grid.querySelectorAll('.big-video-box');
  const count = boxes.length;
  
  grid.classList.remove('cols-2', 'cols-3', 'cols-4');
  
  if (count <= 4) {
    grid.classList.add('cols-2');
  } else if (count <= 9) {
    grid.classList.add('cols-3');
  } else {
    grid.classList.add('cols-4');
  }
}

const poolOfSimulatedPeers = [
  { name: "Liam Davies", bg: "rgba(6, 182, 212, 0.1)", color: "#06b6d4", status: "Focus Desk", icon: "fa-stopwatch animate-pulse", muted: false },
  { name: "Zoe Johnson", bg: "rgba(244, 63, 94, 0.1)", color: "#f43f5e", status: "Syllabus Roll", icon: "fa-book-open", muted: true },
  { name: "Ethan Hunt", bg: "rgba(16, 185, 129, 0.1)", color: "#10b981", status: "Break Time", icon: "fa-hourglass-half", muted: false },
  { name: "Emma Watson", bg: "rgba(234, 179, 8, 0.1)", color: "#eab308", status: "Focus Desk", icon: "fa-stopwatch animate-pulse", muted: true },
  { name: "Mason Reed", bg: "rgba(168, 85, 247, 0.1)", color: "#a855f7", status: "Syllabus Roll", icon: "fa-book-open", muted: false },
  { name: "Chloe Vance", bg: "rgba(236, 72, 153, 0.1)", color: "#ec4899", status: "Break Time", icon: "fa-hourglass-half", muted: true },
  { name: "Noah Brooks", bg: "rgba(16, 185, 129, 0.1)", color: "#10b981", status: "Focus Desk", icon: "fa-stopwatch animate-pulse", muted: false },
  { name: "Mia Foster", bg: "rgba(245, 158, 11, 0.1)", color: "#f59e0b", status: "Focus Desk", icon: "fa-stopwatch animate-pulse", muted: true },
  { name: "Leo Harris", bg: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", status: "Syllabus Roll", icon: "fa-book-open", muted: false },
  { name: "Grace Miller", bg: "rgba(20, 184, 166, 0.1)", color: "#20b8a6", status: "Break Time", icon: "fa-hourglass-half", muted: true }
];
let addedPeers = [];
let localSimulatedPeers = {};

window.addSimulatedPeer = function() {
  if (window.playSynthSound) window.playSynthSound('unlock');
  const grid = document.querySelector('.big-room-video-grid');
  if (!grid) return;
  
  const boxes = grid.querySelectorAll('.big-video-box');
  const currentCount = boxes.length;
  if (currentCount >= 12) {
    showToast('Room Full', 'Maximum simulated classmate count reached (12 participants)!', 'alert');
    return;
  }

  const peerData = poolOfSimulatedPeers[addedPeers.length % poolOfSimulatedPeers.length];
  const peerId = `simulated-peer-${Date.now()}`;
  const colorIdx = addedPeers.length;

  // Register simulated peer into local map so single-tab testing
  // behaves identically to cross-tab real participants without database clutter
  if (activeRoomCode) {
    localSimulatedPeers[peerData.name] = {
      joinedAt: Date.now(),
      muted: peerData.muted,
      camOff: false,
      simulated: true,
      peerId: peerId,
      statusText: peerData.status
    };
  }

  // Build card via the shared helper (same as real participants)
  const peerDiv = buildPeerCard(peerData.name, peerId, colorIdx);
  peerDiv.classList.add('simulated-addition');

  // Append status badge
  const statusLabel = document.createElement('div');
  statusLabel.className = 'big-focusing-status-label';
  statusLabel.innerHTML = `<i class="fa-solid ${peerData.icon}"></i> ${peerData.status}`;
  peerDiv.appendChild(statusLabel);

  // Apply muted mic badge if needed
  if (peerData.muted) {
    const micBadge = peerDiv.querySelector('.big-mic-status-badge');
    if (micBadge) micBadge.innerHTML = '<i class="fa-solid fa-microphone-slash" style="color:var(--danger-color);"></i>';
  }

  grid.appendChild(peerDiv);
  addedPeers.push(peerId);
  
  adjustVideoGridLayout();
  showToast('Peer Joined', `${peerData.name} entered the study room arena!`, 'success');
};

window.removeSimulatedPeer = function() {
  if (window.playSynthSound) window.playSynthSound('click');
  const grid = document.querySelector('.big-room-video-grid');
  if (!grid) return;
  
  if (addedPeers.length > 0) {
    const peerId = addedPeers.pop();
    // Remove from localSimulatedPeers
    for (const name in localSimulatedPeers) {
      if (localSimulatedPeers[name].peerId === peerId) {
        delete localSimulatedPeers[name];
        break;
      }
    }
    // Safety check: if this peer is pinned, unpin them first to clean up the layout
    if (pinnedParticipantId === peerId) {
      window.togglePinParticipant(peerId);
    }
    const element = document.getElementById(peerId);
    if (element) {
      element.remove();
      adjustVideoGridLayout();
      showToast('Peer Left', 'A simulated peer left the study arena.', 'info');
      return;
    }
  }
  
  const peerFeeds = grid.querySelectorAll('.peer-feed');
  if (peerFeeds.length > 0) {
    const lastPeer = peerFeeds[peerFeeds.length - 1];
    const peerId = lastPeer.id;
    // Safety check: if this peer is pinned, unpin them first to clean up the layout
    if (peerId && pinnedParticipantId === peerId) {
      window.togglePinParticipant(peerId);
    }
    // Extract participant name if it was a real one
    const nameEl = lastPeer.querySelector('.big-participant-name');
    if (nameEl) {
      const uname = nameEl.innerText.replace(' (Host)', '');
      fetch('/api/studyrooms/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode: activeRoomCode, username: uname })
      }).catch(err => console.error(err));
    }
    lastPeer.remove();
    adjustVideoGridLayout();
    showToast('Peer Left', 'A classmate left the study room.', 'info');
  } else {
    showToast('Cannot Remove', 'You are the only participant left in the room!', 'alert');
  }
};

/* ==========================================================
   REAL-TIME ROOM SESSION ENGINE (MongoDB Database Polling Sync)
   ========================================================== */

let activeRoomCode = null;
let isRoomHost = false;
let syncInterval = null;
let lastKnownParticipants = {};

// Peer colour palette (deterministic based on username hash)
const PEER_COLORS = [
  { bg: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' },
  { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
  { bg: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' },
  { bg: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' },
  { bg: 'rgba(6, 182, 212, 0.1)',  color: '#06b6d4' },
  { bg: 'rgba(244, 63, 94, 0.1)',  color: '#f43f5e' },
  { bg: 'rgba(234, 179, 8, 0.1)', color: '#eab308' },
  { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' },
  { bg: 'rgba(20, 184, 166, 0.1)', color: '#14b8a6' }
];

async function pushRoomEvent(type, target, value) {
  if (!activeRoomCode) return;
  try {
    await fetch('/api/studyrooms/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomCode: activeRoomCode, type, target, value })
    });
  } catch (err) {
    console.error('Failed to push room state event:', err);
  }
}

async function pushEvent(code, eventObj) {
  try {
    const res = await fetch('/api/studyrooms/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomCode: code,
        type: eventObj.action,
        target: eventObj.target,
        value: eventObj.action
      })
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to push room event:', err);
  }
}

// ── WebRTC Peer-to-Peer Mesh Connection Manager ──
const peerConnections = {};
const rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

// Send WebRTC signaling payload via MongoDB room events
async function sendSignal(target, signalType, payload) {
  if (!activeRoomCode || !currentUser) return;
  const signalValue = {
    sender: currentUser.username,
    signalType,
    payload
  };
  await pushRoomEvent('webrtc_signal', target, signalValue);
}

// Get or create RTCPeerConnection for a classmate
function getOrCreatePC(classmateName) {
  if (peerConnections[classmateName]) {
    return peerConnections[classmateName];
  }

  console.log(`📡 [WebRTC]: Initializing RTCPeerConnection for ${classmateName}...`);
  const pc = new RTCPeerConnection(rtcConfig);
  peerConnections[classmateName] = pc;

  // Add all existing local media tracks to the PC
  if (localMediaStream) {
    localMediaStream.getTracks().forEach(track => {
      pc.addTrack(track, localMediaStream);
    });
  }

  // Handle ICE Candidates
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      console.log(`📡 [WebRTC]: Sending ICE candidate to ${classmateName}`);
      sendSignal(classmateName, 'candidate', event.candidate);
    }
  };

  // Handle stream tracks received from remote classmate
  pc.ontrack = (event) => {
    console.log(`📡 [WebRTC]: Received remote track from ${classmateName}`);
    const peerId = `peer-${classmateName.toLowerCase().replace(/\s+/g, '-')}`;
    const videoEl = document.getElementById(`video-${peerId}`);
    const placeholder = document.getElementById(`placeholder-${peerId}`);
    
    if (videoEl && event.streams && event.streams[0]) {
      videoEl.srcObject = event.streams[0];
      videoEl.classList.remove('hidden');
      if (placeholder) placeholder.classList.add('hidden');
    }
  };

  pc.onconnectionstatechange = () => {
    console.log(`📡 [WebRTC Connection State with ${classmateName}]: ${pc.connectionState}`);
    if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed' || pc.connectionState === 'closed') {
      closePC(classmateName);
    }
  };

  return pc;
}

// Close connection and clean up elements
function closePC(classmateName) {
  const pc = peerConnections[classmateName];
  if (pc) {
    console.log(`📡 [WebRTC]: Closing RTCPeerConnection for ${classmateName}`);
    try {
      pc.close();
    } catch (e) {}
    delete peerConnections[classmateName];
  }
  const peerId = `peer-${classmateName.toLowerCase().replace(/\s+/g, '-')}`;
  const videoEl = document.getElementById(`video-${peerId}`);
  const placeholder = document.getElementById(`placeholder-${peerId}`);
  if (videoEl) {
    videoEl.srcObject = null;
    videoEl.classList.add('hidden');
  }
  if (placeholder) {
    placeholder.classList.remove('hidden');
  }
}

// Process incoming signaling messages
async function handleIncomingSignal(sender, signalType, payload) {
  console.log(`📡 [WebRTC]: Received signal [${signalType}] from ${sender}`);
  const pc = getOrCreatePC(sender);

  if (signalType === 'offer') {
    try {
      await pc.setRemoteDescription(new RTCSessionDescription(payload));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      console.log(`📡 [WebRTC]: Sending SDP answer to ${sender}`);
      sendSignal(sender, 'answer', pc.localDescription);
    } catch (err) {
      console.error('Failed to handle incoming SDP offer:', err);
    }
  } else if (signalType === 'answer') {
    try {
      await pc.setRemoteDescription(new RTCSessionDescription(payload));
    } catch (err) {
      console.error('Failed to handle incoming SDP answer:', err);
    }
  } else if (signalType === 'candidate') {
    try {
      if (payload) {
        await pc.addIceCandidate(new RTCIceCandidate(payload));
      }
    } catch (err) {
      console.error('Failed to add remote ICE candidate:', err);
    }
  }
}

// Generate a peer card element for a participant
function buildPeerCard(username, peerId, colorIdx) {
  const palette = PEER_COLORS[colorIdx % PEER_COLORS.length];
  const div = document.createElement('div');
  div.className = 'big-video-box peer-feed synced-peer';
  div.id = peerId;
  div.innerHTML = `
    <button class="pin-btn" onclick="window.togglePinParticipant('${peerId}')" title="Pin Profile">
      <i class="fa-solid fa-thumbtack"></i>
    </button>
    <div class="host-controls-overlay">
      <button class="host-action-btn mute-btn" onclick="window.hostToggleMute('${peerId}')" title="Mute ${username}">
        <i class="fa-solid fa-microphone"></i>
      </button>
      <button class="host-action-btn cam-btn" onclick="window.hostToggleCam('${peerId}')" title="Disable ${username}'s Video">
        <i class="fa-solid fa-video"></i>
      </button>
      <button class="host-action-btn kick-btn" onclick="window.hostKickPeer('${peerId}')" style="color: var(--danger-color);" title="Remove ${username}">
        <i class="fa-solid fa-user-minus"></i>
      </button>
    </div>
    <div class="big-video-placeholder" id="placeholder-${peerId}">
      <div class="big-placeholder-avatar" style="background: ${palette.bg}; color: ${palette.color}; border-color: ${palette.color.replace(')', ', 0.2)').replace('rgb', 'rgba')};">
        <i class="fa-solid fa-user-graduate"></i>
      </div>
      <span class="big-placeholder-name">${username}</span>
    </div>
    <video id="video-${peerId}" autoplay playsinline class="big-video-feed hidden"></video>
    <div class="big-video-overlay-info">
      <span class="big-participant-name">${username}</span>
      <span class="big-mic-status-badge" id="${peerId}-mic"><i class="fa-solid fa-microphone"></i></span>
    </div>
  `;
  return div;
}

// Main state sync — called on interval
async function syncRoomState() {
  if (!activeRoomCode) return;

  let room = null;
  try {
    const res = await fetch(`/api/studyrooms/active/${activeRoomCode}`);
    if (res.status === 404) {
      if (!isRoomHost) {
        stopSyncEngine();
        showToast('Session Ended', 'The host has ended this study session.', 'alert');
        setTimeout(() => {
          exitToLobby();
        }, 1800);
      }
      return;
    }
    const data = await res.json();
    if (data.success) {
      room = data.room;
    }
  } catch (err) {
    console.error('Failed to fetch room state:', err);
    return;
  }

  if (!room) return;

  // Map server participants to required map format
  const participants = {};
  if (room.participants) {
    room.participants.forEach(p => {
      participants[p.username] = {
        joinedAt: p.joinedAt,
        muted: !p.micActive,
        camOff: !p.camActive,
        screenActive: p.screenActive,
        statusText: p.statusText
      };
    });
  }

  // Mix in local simulated peers so they are not deleted by the sync cleanup
  Object.keys(localSimulatedPeers).forEach(name => {
    participants[name] = localSimulatedPeers[name];
  });

  // ── Render new participants who joined ───────────────────────────────────
  const grid = document.querySelector('.big-room-video-grid');
  if (!grid) return;

  let colorIdx = 0;
  Object.keys(participants).forEach(uname => {
    if (uname === currentUser?.username) { colorIdx++; return; } // skip self
    const peerId = `peer-${uname.toLowerCase().replace(/\s+/g, '-')}`;
    let card = document.getElementById(peerId);
    if (!card) {
      card = buildPeerCard(uname, peerId, colorIdx);
      grid.appendChild(card);
      adjustVideoGridLayout();
    }

    // Update classmate's real-time state from MongoDB data
    const participant = participants[uname];
    if (participant) {
      // 1. Mic State
      const micBadge = document.getElementById(`${peerId}-mic`) || card.querySelector('.big-mic-status-badge');
      if (micBadge) {
        if (participant.muted) {
          micBadge.className = "big-mic-status-badge muted";
          micBadge.innerHTML = '<i class="fa-solid fa-microphone-slash" style="color: var(--danger-color);"></i>';
        } else {
          micBadge.className = "big-mic-status-badge";
          micBadge.innerHTML = '<i class="fa-solid fa-microphone"></i>';
        }
      }

      // 2. Camera/Video State
      let disabledOverlay = document.getElementById(`cam-disabled-overlay-${peerId}`);
      if (participant.camOff) {
        if (!disabledOverlay) {
          disabledOverlay = document.createElement('div');
          disabledOverlay.className = 'cam-disabled-overlay';
          disabledOverlay.id = `cam-disabled-overlay-${peerId}`;
          disabledOverlay.innerHTML = `<i class="fa-solid fa-video-slash"></i><span>Camera Disabled</span>`;
          card.appendChild(disabledOverlay);
        }
      } else {
        if (disabledOverlay) disabledOverlay.remove();
      }

      // 3. Status Text & Icon
      if (participant.statusText) {
        let statusLabel = card.querySelector('.big-focusing-status-label');
        if (!statusLabel) {
          statusLabel = document.createElement('div');
          statusLabel.className = 'big-focusing-status-label';
          card.appendChild(statusLabel);
        }
        let iconClass = 'fa-stopwatch animate-pulse';
        if (participant.statusText === 'Syllabus Roll') iconClass = 'fa-book-open';
        else if (participant.statusText === 'Break Time') iconClass = 'fa-hourglass-half';

        statusLabel.innerHTML = `<i class="fa-solid ${iconClass}"></i> ${participant.statusText}`;
      }
    }

    colorIdx++;
  });

  // Ensure WebRTC peer connections are active for all real participants in the room
  Object.keys(participants).forEach(uname => {
    if (uname === currentUser?.username) return; // skip self
    const participant = participants[uname];
    if (participant && !participant.simulated) {
      if (!peerConnections[uname]) {
        const pc = getOrCreatePC(uname);
        const isCaller = currentUser.username.toLowerCase() < uname.toLowerCase();
        if (isCaller) {
          pc.createOffer()
            .then(offer => pc.setLocalDescription(offer))
            .then(() => {
              console.log(`📡 [WebRTC]: Initiating SDP offer to ${uname}`);
              sendSignal(uname, 'offer', pc.localDescription);
            })
            .catch(err => console.error('Failed to create WebRTC offer:', err));
        }
      }
    }
  });

  // ── Remove participants who left ──────────────────────────────────────────
  Object.keys(lastKnownParticipants).forEach(uname => {
    if (uname === currentUser?.username) return;
    if (!participants[uname]) {
      const peerId = `peer-${uname.toLowerCase().replace(/\s+/g, '-')}`;
      const card = document.getElementById(peerId);
      if (card) {
        // WebRTC: Close connection
        closePC(uname);

        if (pinnedParticipantId === peerId) window.togglePinParticipant(peerId);
        card.style.opacity = '0';
        card.style.transform = 'scale(0.85)';
        card.style.transition = 'all 0.35s ease';
        setTimeout(() => { card.remove(); adjustVideoGridLayout(); }, 350);
      }
    }
  });

  lastKnownParticipants = { ...participants };

  // ── Process host moderation events ───────────────────────────────────────
  const myUsername = currentUser?.username;
  const events = (room.events || []).map(e => ({
    action: e.type,
    target: e.target,
    value: e.value,
    ts: new Date(e.timestamp).getTime()
  }));

  const processedKey = `ssb_processed_${activeRoomCode}`;
  const processedTs = parseInt(localStorage.getItem(processedKey) || '0');
  let latestProcessedTs = processedTs;

  events.forEach(ev => {
    if (ev.ts <= processedTs) return; // already handled
    latestProcessedTs = Math.max(latestProcessedTs, ev.ts);

    // WebRTC: Process incoming signaling events
    if (ev.action === 'webrtc_signal' && ev.target.toLowerCase() === myUsername.toLowerCase()) {
      const signal = ev.value;
      if (signal && signal.sender !== myUsername) {
        handleIncomingSignal(signal.sender, signal.signalType, signal.payload);
      }
    }

    // Events that target ME (non-host tab receiving commands)
    if (!isRoomHost && ev.target === myUsername) {
      if (ev.action === 'mute') {
        micEnabled = false;
        if (localMediaStream) localMediaStream.getAudioTracks().forEach(t => t.enabled = false);
        const micBtn = document.getElementById('toggle-mic-btn');
        const micBadge = document.getElementById('local-mic-badge');
        if (micBtn) { micBtn.className = 'btn btn-outline btn-circle disabled-mic'; micBtn.innerHTML = '<i class="fa-solid fa-microphone-slash"></i>'; }
        if (micBadge) micBadge.innerHTML = '<i class="fa-solid fa-microphone-slash" style="color:var(--danger-color);"></i>';
        showToast('Muted by Host', 'The host has muted your microphone.', 'alert');
      } else if (ev.action === 'unmute') {
        micEnabled = true;
        if (localMediaStream) localMediaStream.getAudioTracks().forEach(t => t.enabled = true);
        const micBtn = document.getElementById('toggle-mic-btn');
        const micBadge = document.getElementById('local-mic-badge');
        if (micBtn) { micBtn.className = 'btn btn-outline btn-circle active-mic'; micBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>'; }
        if (micBadge) micBadge.innerHTML = '<i class="fa-solid fa-microphone"></i>';
        showToast('Unmuted by Host', 'The host has allowed you to speak.', 'success');
      } else if (ev.action === 'camoff') {
        if (localMediaStream) localMediaStream.getVideoTracks().forEach(t => t.stop());
        const camBtn = document.getElementById('toggle-cam-btn');
        const videoEl = document.getElementById('room-local-video');
        const placeholder = document.getElementById('local-video-placeholder');
        camEnabled = false;
        if (camBtn) { camBtn.className = 'btn btn-outline btn-circle disabled-cam'; camBtn.innerHTML = '<i class="fa-solid fa-video-slash"></i>'; }
        if (videoEl) { videoEl.srcObject = null; videoEl.classList.add('hidden'); }
        if (placeholder) placeholder.classList.remove('hidden');
        showToast('Camera Disabled by Host', 'The host has turned off your camera.', 'alert');
      } else if (ev.action === 'kick') {
        stopSyncEngine();
        // Remove self from room
        fetch('/api/studyrooms/leave', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomCode: activeRoomCode, username: myUsername })
        }).catch(err => console.error(err));

        showToast('Removed from Session', 'You have been removed from the room by the host.', 'alert');
        setTimeout(() => exitToLobby(), 1800);
      }
    }

    // Events for host-side UI updates (visual feedback on peer cards)
    if (isRoomHost) {
      if (ev.action === 'mute' || ev.action === 'camoff') {
        const tgtPeerId = `peer-${ev.target.toLowerCase().replace(/\s+/g, '-')}`;
        const card = document.getElementById(tgtPeerId);
        if (card) {
          if (ev.action === 'mute') {
            const micBadge = document.getElementById(`${tgtPeerId}-mic`);
            if (micBadge) micBadge.innerHTML = '<i class="fa-solid fa-microphone-slash" style="color:var(--danger-color);"></i>';
          }
        }
      }
    }
  });

  if (latestProcessedTs > processedTs) {
    localStorage.setItem(processedKey, String(latestProcessedTs));
  }
}

function startSyncEngine(code) {
  activeRoomCode = code;
  lastKnownParticipants = {};
  if (syncInterval) clearInterval(syncInterval);
  syncInterval = setInterval(syncRoomState, 1000);
}

function stopSyncEngine() {
  if (syncInterval) { clearInterval(syncInterval); syncInterval = null; }
}

function onStorageChange(e) {
  if (e.key === ROOMS_DB_KEY || e.key === ROOM_EVENTS_KEY) {
    syncRoomState();
  }
}

function exitToLobby() {
  // Stop all media tracks
  if (localMediaStream) { localMediaStream.getTracks().forEach(t => t.stop()); localMediaStream = null; }
  if (screenMediaStream) { screenMediaStream.getTracks().forEach(t => t.stop()); screenMediaStream = null; }
  
  // WebRTC: Close all active classmate peer connections
  Object.keys(peerConnections).forEach(uname => {
    closePC(uname);
  });

  micEnabled = true; camEnabled = false; screenSharingActive = false;
  activeRoomCode = null; isRoomHost = false;
  addedPeers = [];
  document.body.classList.remove('no-scroll');
  const footer = document.getElementById('studyroom-footer');
  if (footer) footer.classList.remove('hidden');
  window.location.reload();
}

// ── WebRTC Pre-warmed Media Stream Initialization ──
async function initLocalMediaStream() {
  try {
    console.log('📡 [WebRTC]: Initializing local camera & microphone capture...');
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localMediaStream = stream;
    
    // Disable tracks initially if muted/disabled
    stream.getVideoTracks().forEach(track => track.enabled = camEnabled);
    stream.getAudioTracks().forEach(track => track.enabled = micEnabled);

    // Bind local stream to preview feed
    const videoEl = document.getElementById('room-local-video');
    const placeholder = document.getElementById('local-video-placeholder');
    if (videoEl) {
      videoEl.srcObject = stream;
      if (camEnabled) {
        videoEl.classList.remove('hidden');
        if (placeholder) placeholder.classList.add('hidden');
      }
    }
  } catch (err) {
    console.warn('📡 [WebRTC]: Media access capture failed:', err);
    showToast('Media Access Alert', 'Please allow camera and mic permissions to participate in co-working calls!', 'alert');
  }
}

// ── Host a new room ───────────────────────────────────────────────────────
window.hostStudyRoom = async function() {
  if (window.playSynthSound) window.playSynthSound('click');
  const randomCode = 'ST-' + Math.floor(100 + Math.random() * 900);
  const myName = currentUser?.username || 'Host';

  // Warm up video & audio stream tracks first
  await initLocalMediaStream();

  try {
    const res = await fetch('/api/studyrooms/host', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomCode: randomCode, hostUsername: myName })
    });
    const data = await res.json();
    if (!data.success) {
      showToast('Failed to Host', data.message || 'Could not host room. Try again.', 'alert');
      return;
    }
  } catch (err) {
    console.error('Failed to host study room:', err);
    showToast('Server Error', 'Failed to communicate with database server.', 'alert');
    return;
  }

  activeRoomCode = randomCode;
  isRoomHost = true;

  document.getElementById('active-room-title').innerText = `Room: ${randomCode}`;
  // Show host badge on own card name
  const hostNameEl = document.querySelector('#user-video-box .big-participant-name');
  if (hostNameEl) hostNameEl.innerText = `${myName} (Host)`;

  document.getElementById('room-lobby-state').classList.add('hidden');
  document.getElementById('room-active-state').classList.remove('hidden');
  document.body.classList.add('no-scroll');
  const footer = document.getElementById('studyroom-footer');
  if (footer) footer.classList.add('hidden');

  adjustVideoGridLayout();
  startSyncEngine(randomCode);
  showToast('Study Room Created!', `Invite code: ${randomCode}`, 'success');
};

// ── Join an existing room ─────────────────────────────────────────────────
window.joinStudyRoom = async function() {
  const codeInput = document.getElementById('room-code-input');
  const code = codeInput.value.trim().toUpperCase();

  if (!code) {
    showToast('Enter Code', 'Please input a valid room code!', 'alert');
    return;
  }

  const myName = currentUser?.username || 'Guest';

  // Warm up video & audio stream tracks first
  await initLocalMediaStream();

  try {
    const res = await fetch('/api/studyrooms/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomCode: code, username: myName })
    });
    if (res.status === 404) {
      showToast('Session Not Found', `Room "${code}" does not exist or has already ended.`, 'alert');
      return;
    }
    const data = await res.json();
    if (!data.success) {
      showToast('Failed to Join', data.message || 'Could not join room. Try again.', 'alert');
      return;
    }
  } catch (err) {
    console.error('Failed to join study room:', err);
    showToast('Server Error', 'Failed to communicate with database server.', 'alert');
    return;
  }

  if (window.playSynthSound) window.playSynthSound('click');

  activeRoomCode = code;
  isRoomHost = false;

  document.getElementById('active-room-title').innerText = `Room: ${code}`;
  const hostNameEl = document.querySelector('#user-video-box .big-participant-name');
  if (hostNameEl) hostNameEl.innerText = myName;

  document.getElementById('room-lobby-state').classList.add('hidden');
  document.getElementById('room-active-state').classList.remove('hidden');
  document.body.classList.add('no-scroll');
  const footer = document.getElementById('studyroom-footer');
  if (footer) footer.classList.add('hidden');

  adjustVideoGridLayout();
  startSyncEngine(code);
  showToast('Connected!', `Joined study room: ${code}`, 'success');
};

window.copyRoomCode = function() {
  const title = document.getElementById('active-room-title').innerText;
  const code = title.split('Room: ')[1] || 'ST-100';
  
  navigator.clipboard.writeText(code).then(() => {
    showToast('Code Copied!', `Room code ${code} copied to clipboard!`, 'success');
  }).catch(() => {
    alert(`Invite Code: ${code}`);
  });
};

window.toggleLocalMic = function() {
  micEnabled = !micEnabled;
  if (window.playSynthSound) window.playSynthSound('click');
  
  const btn = document.getElementById('toggle-mic-btn');
  const badge = document.getElementById('local-mic-badge');
  
  if (localMediaStream) {
    localMediaStream.getAudioTracks().forEach(track => {
      track.enabled = micEnabled;
    });
  }

  if (micEnabled) {
    btn.className = "btn btn-outline btn-circle active-mic";
    btn.innerHTML = `<i class="fa-solid fa-microphone"></i>`;
    if (badge) {
      badge.className = "big-mic-status-badge";
      badge.innerHTML = `<i class="fa-solid fa-microphone"></i>`;
    }
    showToast('Mic Unmuted', 'Microphone audio capture active.', 'info');
  } else {
    btn.className = "btn btn-outline btn-circle disabled-mic";
    btn.innerHTML = `<i class="fa-solid fa-microphone-slash" style="color: var(--danger-color);"></i>`;
    if (badge) {
      badge.className = "big-mic-status-badge muted";
      badge.innerHTML = `<i class="fa-solid fa-microphone-slash" style="color: var(--danger-color);"></i>`;
    }
    showToast('Mic Muted', 'Microphone audio capture disabled.', 'info');
  }

  // Sync state to MongoDB
  if (activeRoomCode && currentUser) {
    pushRoomEvent('mic', currentUser.username, micEnabled);
  }
};

window.toggleLocalCam = function() {
  camEnabled = !camEnabled;
  if (window.playSynthSound) window.playSynthSound('click');
  
  const btn = document.getElementById('toggle-cam-btn');
  const videoEl = document.getElementById('room-local-video');
  const webcamOverlayEl = document.getElementById('room-local-webcam');
  const placeholder = document.getElementById('local-video-placeholder');
  
  if (localMediaStream) {
    localMediaStream.getVideoTracks().forEach(track => {
      track.enabled = camEnabled;
    });
  }

  if (camEnabled) {
    btn.className = "btn btn-outline btn-circle active-cam";
    btn.innerHTML = `<i class="fa-solid fa-video"></i>`;
    
    if (screenSharingActive) {
      if (webcamOverlayEl) {
        webcamOverlayEl.srcObject = localMediaStream;
        webcamOverlayEl.classList.remove('hidden');
      }
    } else {
      if (videoEl) {
        videoEl.classList.remove('hidden');
      }
      if (placeholder) placeholder.classList.add('hidden');
    }
    showToast('Camera Connected', 'Active video broadcast streaming.', 'success');
    if (activeRoomCode && currentUser) {
      pushRoomEvent('cam', currentUser.username, true);
    }
  } else {
    btn.className = "btn btn-outline btn-circle disabled-cam";
    btn.innerHTML = `<i class="fa-solid fa-video-slash"></i>`;
    
    if (screenSharingActive) {
      if (webcamOverlayEl) {
        webcamOverlayEl.srcObject = null;
        webcamOverlayEl.classList.add('hidden');
      }
    } else {
      if (videoEl) {
        videoEl.classList.add('hidden');
      }
      if (placeholder) placeholder.classList.remove('hidden');
    }
    showToast('Camera Disconnected', 'Video feed closed.', 'info');
    if (activeRoomCode && currentUser) {
      pushRoomEvent('cam', currentUser.username, false);
    }
  }
};

window.leaveStudyRoom = async function() {
  if (window.playSynthSound) window.playSynthSound('click');

  // WebRTC: Close all active classmate connections
  Object.keys(peerConnections).forEach(uname => {
    closePC(uname);
  });

  if (activeRoomCode) {
    const myName = currentUser?.username;

    try {
      await fetch('/api/studyrooms/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode: activeRoomCode, username: myName })
      });
      if (isRoomHost) {
        showToast('Room Closed', 'You have ended the session. The room code is now invalid.', 'info');
      }
    } catch (err) {
      console.error('Failed to leave study room:', err);
    }

    // Clean up local processed-event cursor
    localStorage.removeItem(`ssb_processed_${activeRoomCode}`);
  }

  stopSyncEngine();
  exitToLobby();
};

window.toggleStatusDropdown = function() {
  if (window.playSynthSound) window.playSynthSound('click');
  const menu = document.getElementById('status-dropdown-menu');
  if (menu) menu.classList.toggle('hidden');
};

window.setLocalStatus = function(statusName, iconClass, color) {
  if (window.playSynthSound) window.playSynthSound('unlock');
  
  // Update Selector Button
  const btnIcon = document.getElementById('status-select-icon');
  const btnTxt = document.getElementById('current-status-txt');
  if (btnIcon) {
    btnIcon.className = `fa-solid ${iconClass}`;
    btnIcon.style.color = color;
  }
  if (btnTxt) btnTxt.innerText = statusName;
  
  // Update Local Video Card Badge
  const badge = document.getElementById('local-status-label');
  if (badge) {
    badge.innerHTML = `<i class="fa-solid ${iconClass} animate-pulse" style="color: ${color};"></i> ${statusName}`;
    badge.classList.remove('hidden');
    showToast('Status Updated', `Your status is now set to: ${statusName}!`, 'success');
  }
  
  // Close Dropdown
  const menu = document.getElementById('status-dropdown-menu');
  if (menu) menu.classList.add('hidden');

  // Sync state to MongoDB
  if (activeRoomCode && currentUser) {
    pushRoomEvent('status', currentUser.username, statusName);
  }
};

window.toggleScreenShare = function() {
  if (window.playSynthSound) window.playSynthSound('click');
  const btn = document.getElementById('share-screen-btn');
  const videoEl = document.getElementById('room-local-video');
  const webcamOverlayEl = document.getElementById('room-local-webcam');
  const placeholder = document.getElementById('local-video-placeholder');
  
  if (!screenSharingActive) {
    // Attempt display media capture (screen share)
    navigator.mediaDevices.getDisplayMedia({ video: true })
      .then(stream => {
        screenMediaStream = stream;
        screenSharingActive = true;
        
        btn.className = "btn btn-outline btn-circle active-screen";
        
        if (videoEl) {
          videoEl.srcObject = stream;
          videoEl.classList.remove('hidden');
        }
        if (placeholder) placeholder.classList.add('hidden');
        
        // Add screen sharing active style hook
        const userBox = document.getElementById('user-video-box');
        if (userBox) userBox.classList.add('sharing-screen');
        
        // Redirect webcam stream to PIP overlay if camera is currently enabled
        if (camEnabled && localMediaStream && webcamOverlayEl) {
          webcamOverlayEl.srcObject = localMediaStream;
          webcamOverlayEl.classList.remove('hidden');
        }
        
        // Listen for screen sharing stop button click inside native browser bar
        stream.getVideoTracks()[0].onended = function() {
          if (screenSharingActive) {
            window.toggleScreenShare();
          }
        };
        
        showToast('Screen Sharing Active', 'Sharing your workspace with classmates.', 'success');
        if (activeRoomCode && currentUser) {
          pushRoomEvent('screen', currentUser.username, true);
        }
      })
      .catch(err => {
        console.warn('Screen share blocked or failed: ', err);
        screenSharingActive = false;
        btn.className = "btn btn-outline btn-circle disabled-cam";
        showToast('Screen Share Failed', 'Could not start display capture stream!', 'alert');
      });
  } else {
    // Stop screen share stream tracks
    if (screenMediaStream) {
      screenMediaStream.getTracks().forEach(track => track.stop());
      screenMediaStream = null;
    }
    screenSharingActive = false;
    btn.className = "btn btn-outline btn-circle disabled-cam";
    
    // Remove screen sharing active style hook
    const userBox = document.getElementById('user-video-box');
    if (userBox) userBox.classList.remove('sharing-screen');
    
    // Disconnect PIP webcam overlay
    if (webcamOverlayEl) {
      webcamOverlayEl.srcObject = null;
      webcamOverlayEl.classList.add('hidden');
    }
    
    // Restore webcam stream to main video element if webcam was active before screen share
    if (camEnabled && localMediaStream) {
      if (videoEl) {
        videoEl.srcObject = localMediaStream;
        videoEl.classList.remove('hidden');
      }
      if (placeholder) placeholder.classList.add('hidden');
    } else {
      if (videoEl) {
        videoEl.srcObject = null;
        videoEl.classList.add('hidden');
      }
      if (placeholder) placeholder.classList.remove('hidden');
    }
    
    showToast('Screen Sharing Stopped', 'Workspace broadcast feed closed.', 'info');
    if (activeRoomCode && currentUser) {
      pushRoomEvent('screen', currentUser.username, false);
    }
  }
};

/* ==========================================================
   PROFILE PINNING / UNPINNING Spotlighting Logic
   ========================================================== */
let pinnedParticipantId = null;

window.togglePinParticipant = function(boxId) {
  if (window.playSynthSound) window.playSynthSound('click');
  
  const targetBox = document.getElementById(boxId);
  if (!targetBox) return;
  
  const layout = document.querySelector('.studyroom-arena-layout');
  const pinnedPane = document.getElementById('pinned-participant-pane');
  const grid = document.querySelector('.big-room-video-grid');
  
  if (!layout || !pinnedPane || !grid) return;
  
  if (pinnedParticipantId === boxId) {
    // UNPINNING: Return the card to its original position in the grid
    const placeholder = document.getElementById(`placeholder-${boxId}`);
    if (placeholder) {
      grid.insertBefore(targetBox, placeholder);
      placeholder.remove();
    } else {
      grid.appendChild(targetBox);
    }
    
    targetBox.classList.remove('pinned');
    
    // Restore pin button icon and tooltip
    const pinBtn = targetBox.querySelector('.pin-btn');
    if (pinBtn) {
      pinBtn.setAttribute('title', 'Pin Profile');
      pinBtn.innerHTML = `<i class="fa-solid fa-thumbtack"></i>`;
    }
    
    pinnedParticipantId = null;
    layout.classList.remove('has-pinned');
    pinnedPane.classList.add('hidden');
    
    showToast('Profile Unpinned', 'Returned to grid layout.', 'info');
  } else {
    // PINNING: Pin the target box to the featured pane
    
    // If another box is already pinned, unpin it first in silence
    if (pinnedParticipantId) {
      const oldPinnedId = pinnedParticipantId;
      const oldTarget = document.getElementById(oldPinnedId);
      const oldPlaceholder = document.getElementById(`placeholder-${oldPinnedId}`);
      if (oldTarget) {
        if (oldPlaceholder) {
          grid.insertBefore(oldTarget, oldPlaceholder);
          oldPlaceholder.remove();
        } else {
          grid.appendChild(oldTarget);
        }
        oldTarget.classList.remove('pinned');
        const oldPinBtn = oldTarget.querySelector('.pin-btn');
        if (oldPinBtn) {
          oldPinBtn.setAttribute('title', 'Pin Profile');
          oldPinBtn.innerHTML = `<i class="fa-solid fa-thumbtack"></i>`;
        }
      }
      pinnedParticipantId = null;
    }
    
    // Create a hidden placeholder at targetBox's exact current index inside the grid
    const placeholder = document.createElement('div');
    placeholder.id = `placeholder-${boxId}`;
    placeholder.style.display = 'none';
    grid.insertBefore(placeholder, targetBox);
    
    // Relocate the targetBox to the spotlight pane
    pinnedPane.appendChild(targetBox);
    pinnedPane.classList.remove('hidden');
    targetBox.classList.add('pinned');
    
    // Update pin button icon and tooltip for unpin action
    const pinBtn = targetBox.querySelector('.pin-btn');
    if (pinBtn) {
      pinBtn.setAttribute('title', 'Unpin Profile');
      pinBtn.innerHTML = `<i class="fa-solid fa-thumbtack-slash" style="color: var(--primary-color);"></i>`;
    }
    
    pinnedParticipantId = boxId;
    layout.classList.add('has-pinned');
    
    // Safety check: ensure active video streams inside the card continue playing seamlessly
    const videoEl = targetBox.querySelector('video');
    if (videoEl && videoEl.srcObject) {
      videoEl.play().catch(e => console.log("Video autoplay play check:", e));
    }
    
    showToast('Profile Pinned', 'Focused participant view magnified.', 'success');
  }
  
  // Re-adjust grid columns since the count of items in the grid has updated
  adjustVideoGridLayout();
};

/* ==========================================================
   HOST MODERATION CONSOLE ACTIONS
   ========================================================== */

function getPeerDisplayName(peerId) {
  const card = document.getElementById(peerId);
  if (!card) return "Classmate";
  const nameEl = card.querySelector('.big-participant-name');
  return nameEl ? nameEl.innerText : "Classmate";
}

window.hostToggleMute = function(peerId) {
  if (window.playSynthSound) window.playSynthSound('click');
  const card = document.getElementById(peerId);
  if (!card) return;
  
  const muteBtn = card.querySelector('.host-controls-overlay .mute-btn');
  const micBadge = document.getElementById(`${peerId}-mic`) || card.querySelector('.big-mic-status-badge');
  const classmateName = getPeerDisplayName(peerId);
  
  if (!muteBtn || !micBadge) return;
  
  const isMuted = muteBtn.classList.contains('active-muted');
  
  if (!isMuted) {
    muteBtn.classList.add('active-muted');
    muteBtn.setAttribute('title', `Unmute ${classmateName}`);
    muteBtn.innerHTML = `<i class="fa-solid fa-microphone-slash"></i>`;
    micBadge.className = "big-mic-status-badge muted";
    micBadge.innerHTML = `<i class="fa-solid fa-microphone-slash" style="color: var(--danger-color);"></i>`;
    // Push real-time event so classmate's tab mutes themselves
    if (activeRoomCode) pushEvent(activeRoomCode, { action: 'mute', target: classmateName });
    showToast('Classmate Muted', `${classmateName} has been muted by the host.`, 'info');
  } else {
    muteBtn.classList.remove('active-muted');
    muteBtn.setAttribute('title', `Mute ${classmateName}`);
    muteBtn.innerHTML = `<i class="fa-solid fa-microphone"></i>`;
    micBadge.className = "big-mic-status-badge";
    micBadge.innerHTML = `<i class="fa-solid fa-microphone"></i>`;
    // Push unmute event
    if (activeRoomCode) pushEvent(activeRoomCode, { action: 'unmute', target: classmateName });
    showToast('Classmate Unmuted', `${classmateName} is allowed to speak.`, 'success');
  }
};

window.hostToggleCam = function(peerId) {
  if (window.playSynthSound) window.playSynthSound('click');
  const card = document.getElementById(peerId);
  if (!card) return;
  
  const camBtn = card.querySelector('.host-controls-overlay .cam-btn');
  const classmateName = getPeerDisplayName(peerId);
  
  if (!camBtn) return;
  
  const isCamOff = camBtn.classList.contains('active-cam-off');
  
  if (!isCamOff) {
    camBtn.classList.add('active-cam-off');
    camBtn.setAttribute('title', `Enable ${classmateName}'s Camera`);
    camBtn.innerHTML = `<i class="fa-solid fa-video-slash"></i>`;
    const disabledOverlay = document.createElement('div');
    disabledOverlay.className = 'cam-disabled-overlay';
    disabledOverlay.id = `cam-disabled-overlay-${peerId}`;
    disabledOverlay.innerHTML = `<i class="fa-solid fa-video-slash"></i><span>Camera Disabled by Host</span>`;
    card.appendChild(disabledOverlay);
    // Push real-time event so classmate's tab stops their camera
    if (activeRoomCode) pushEvent(activeRoomCode, { action: 'camoff', target: classmateName });
    showToast('Video Disabled', `Disabled ${classmateName}'s video feed.`, 'alert');
  } else {
    camBtn.classList.remove('active-cam-off');
    camBtn.setAttribute('title', `Disable ${classmateName}'s Camera`);
    camBtn.innerHTML = `<i class="fa-solid fa-video"></i>`;
    const disabledOverlay = document.getElementById(`cam-disabled-overlay-${peerId}`);
    if (disabledOverlay) disabledOverlay.remove();
    showToast('Video Enabled', `${classmateName} is allowed to share video.`, 'success');
  }
};

window.hostKickPeer = function(peerId) {
  if (window.playSynthSound) window.playSynthSound('unlock');
  const card = document.getElementById(peerId);
  if (!card) return;
  
  const classmateName = getPeerDisplayName(peerId);
  
  if (pinnedParticipantId === peerId) {
    window.togglePinParticipant(peerId);
  }

  // Push real-time kick event so classmate's tab is evicted
  if (activeRoomCode) pushEvent(activeRoomCode, { action: 'kick', target: classmateName });

  // Also remove from the room participant map in MongoDB
  if (activeRoomCode) {
    fetch('/api/studyrooms/leave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomCode: activeRoomCode, username: classmateName })
    }).catch(err => console.error(err));
  }

  card.style.opacity = '0';
  card.style.transform = 'scale(0.8)';
  card.style.transition = 'all 0.4s ease';
  
  setTimeout(() => {
    card.remove();
    const index = addedPeers.indexOf(peerId);
    if (index > -1) addedPeers.splice(index, 1);
    adjustVideoGridLayout();
    showToast('Participant Removed', `${classmateName} has been kicked from the study session.`, 'alert');
  }, 400);
  
  showToast('Removing Classmate...', `Initiating host session disconnect for ${classmateName}.`, 'info');
};
