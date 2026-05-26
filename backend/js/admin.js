/* ============================================================
   STUDYSTREAK — ADMIN PANEL CONTROLLER
   Password: admin123  (change ADMIN_PASSWORD below to update)
   ============================================================ */

const ADMIN_PASSWORD = 'admin123';
const GIFT_LOG_KEY = 'admin_gift_log'; // tracks total GP gifted

let currentSort = 'xp';
let searchQuery = '';
let pendingDeleteKey = null;

// ─── Utility: Admin Toast ────────────────────────────────────
function adminToast(message, color = '#f59e0b') {
  const t = document.createElement('div');
  t.className = 'admin-toast';
  t.style.background = color === 'green'
    ? 'linear-gradient(135deg,#22c55e,#16a34a)'
    : color === 'red'
      ? 'linear-gradient(135deg,#ef4444,#dc2626)'
      : 'linear-gradient(135deg,#f59e0b,#d97706)';
  t.innerHTML = `<i class="fa-solid fa-coins"></i> ${message}`;
  document.body.appendChild(t);
  setTimeout(() => {
    t.classList.add('out');
    t.addEventListener('animationend', () => t.remove());
  }, 3000);
}

// ─── Load users from MongoDB Cache ───────────────────────────
let adminUsersCache = null;

function getUsers() {
  if (adminUsersCache) return adminUsersCache;
  return JSON.parse(localStorage.getItem('users') || '{}');
}

function fetchDbUsers(callback) {
  fetch('/api/admin/users')
  .then(res => res.json())
  .then(data => {
    if (data.success && data.users) {
      adminUsersCache = data.users;
      localStorage.setItem('users', JSON.stringify(data.users));
    }
    fetch('/api/admin/gift-total')
    .then(res => res.json())
    .then(giftData => {
      if (giftData.success) {
        localStorage.setItem(GIFT_LOG_KEY, giftData.totalGifted.toString());
      }
      if (callback) callback();
    })
    .catch(() => { if (callback) callback(); });
  })
  .catch(err => {
    console.warn('Admin Desk running in offline fallback mode:', err);
    if (callback) callback();
  });
}

// ─── Compute cumulative XP same way leaderboard does ────────
function calcCumulativeXP(u) {
  let acc = 0;
  for (let i = 1; i < u.level; i++) acc += i * 150;
  return u.xp + (u.level - 1) * 150 + acc;
}

// ─── Update overview stat cards ─────────────────────────────
function updateStats() {
  const users = getUsers();
  const keys = Object.keys(users);
  const total = keys.length;
  const avgStreak = total
    ? Math.round(keys.reduce((s, k) => s + (users[k].streak || 0), 0) / total)
    : 0;
  const totalXP = keys.reduce((s, k) => s + calcCumulativeXP(users[k]), 0);

  // Total GP gifted (tracked in a separate key)
  const giftLog = JSON.parse(localStorage.getItem(GIFT_LOG_KEY) || '0');

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-streak').textContent = avgStreak + 'd';
  document.getElementById('stat-gp').textContent = giftLog;
  document.getElementById('stat-xp').textContent = totalXP.toLocaleString();
}

// ─── Sort helper ─────────────────────────────────────────────
function sortedUsers(users) {
  const keys = Object.keys(users).filter(k => {
    const u = users[k];
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return u.username.toLowerCase().includes(q)
      || (u.branch || '').toLowerCase().includes(q);
  });

  keys.sort((a, b) => {
    const ua = users[a], ub = users[b];
    if (currentSort === 'xp') return calcCumulativeXP(ub) - calcCumulativeXP(ua);
    if (currentSort === 'streak') return (ub.streak || 0) - (ua.streak || 0);
    if (currentSort === 'alpha') return ua.username.localeCompare(ub.username);
    return 0;
  });

  return keys;
}

// ─── Gift GP to a student ────────────────────────────────────
function giftGP(key) {
  const inputEl = document.getElementById(`gp-input-${key}`);
  const amount = parseInt(inputEl.value);

  if (!amount || amount <= 0 || amount > 99999) {
    adminToast('Enter a valid GP amount (1–99999)', 'red');
    return;
  }

  fetch('/api/admin/gift-gp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: key, amount })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      adminToast(`✅ Gifted ${amount} GP to ${data.user.username}!`, 'green');
      if (adminUsersCache) {
        adminUsersCache[key.toLowerCase()] = data.user;
      }
      localStorage.setItem(GIFT_LOG_KEY, data.totalGifted.toString());
      inputEl.value = '';
      renderStudents();
      updateStats();
    } else {
      adminToast('Failed to gift GP: ' + (data.message || 'error'), 'red');
    }
  })
  .catch(err => {
    adminToast('Network error gifting GP.', 'red');
  });
}

// ─── Delete a student account ─────────────────────────────────
function confirmDelete(key) {
  const users = getUsers();
  pendingDeleteKey = key;
  const name = users[key] ? users[key].username : key;
  document.getElementById('confirm-text').textContent =
    `This will permanently remove "${name}"'s account. This cannot be undone.`;
  document.getElementById('confirm-overlay').style.display = 'flex';
}

// ─── Branch UI Metadata Mapping ──────────────────────────────
const BRANCH_METADATA = {
  'CSE++': { icon: 'fa-laptop-code', color: '#818cf8', label: 'CSE++ (Computer Science & Eng ++)' },
  'CSE core': { icon: 'fa-desktop', color: '#2dd4bf', label: 'CSE Core (Computer Science & Eng Core)' },
  'Ai/Ml': { icon: 'fa-robot', color: '#f59e0b', label: 'AI/ML (Artificial Intelligence & ML)' },
  'ECE': { icon: 'fa-satellite-dish', color: '#f472b6', label: 'ECE (Electronics & Communication)' },
  'ME': { icon: 'fa-screwdriver-wrench', color: '#fb923c', label: 'ME (Mechanical Engineering)' },
  'EE': { icon: 'fa-bolt', color: '#facc15', label: 'EE (Electrical Engineering)' },
  'CE': { icon: 'fa-building', color: '#34d399', label: 'CE (Civil Engineering)' },
  'Unknown': { icon: 'fa-circle-question', color: '#94a3b8', label: 'Other/Unspecified Branch' }
};

// ─── Render student cards grouped by branch ──────────────────
function renderStudents() {
  const grid = document.getElementById('student-grid');
  const users = getUsers();
  const keys = sortedUsers(users);

  grid.innerHTML = '';

  if (keys.length === 0) {
    grid.innerHTML = `
      <div class="admin-empty">
        <i class="fa-solid fa-user-slash"></i>
        <p>No students registered yet${searchQuery ? ' matching your search' : ''}.</p>
      </div>`;
    return;
  }

  // Group globally sorted students by branch
  const grouped = {};
  keys.forEach(key => {
    const u = users[key];
    const branch = u.branch || 'Unknown';
    if (!grouped[branch]) {
      grouped[branch] = [];
    }
    grouped[branch].push(key);
  });

  const branchOrder = ['CSE++', 'CSE core', 'Ai/Ml', 'ECE', 'ME', 'EE', 'CE', 'Unknown'];

  branchOrder.forEach(branch => {
    const studentKeys = grouped[branch];
    if (!studentKeys || studentKeys.length === 0) return;

    const meta = BRANCH_METADATA[branch] || BRANCH_METADATA['Unknown'];

    // Create branch section
    const section = document.createElement('div');
    section.className = 'branch-section';

    // Create header with total count and colored badge
    const header = document.createElement('div');
    header.className = 'branch-section-header';
    header.innerHTML = `
      <h3>
        <i class="fa-solid ${meta.icon}" style="color: ${meta.color};"></i>
        <span>${meta.label}</span>
        <span class="branch-count-badge" style="background: ${meta.color}15; border-color: ${meta.color}35; color: ${meta.color};">
          ${studentKeys.length} ${studentKeys.length === 1 ? 'Student' : 'Students'}
        </span>
      </h3>
    `;
    section.appendChild(header);

    // Create student cards grid for this branch
    const cardsGrid = document.createElement('div');
    cardsGrid.className = 'branch-cards-grid';

    studentKeys.forEach(key => {
      const u = users[key];
      const xp = calcCumulativeXP(u);
      const maxXP = u.level * 150;
      const pct = Math.min(100, Math.round((u.xp / maxXP) * 100));
      const initials = (u.username || '?').slice(0, 2).toUpperCase();

      // Find this user's global leaderboard rank
      const globalRank = keys.indexOf(key);
      const medal = globalRank === 0 ? '🥇' : globalRank === 1 ? '🥈' : globalRank === 2 ? '🥉' : `#${globalRank + 1}`;

      const card = document.createElement('div');
      card.className = 'student-card';
      card.innerHTML = `
        <div class="student-card-top">
          <div class="student-avatar" style="background: linear-gradient(135deg, ${meta.color}, ${meta.color}c0);">${initials}</div>
          <div class="student-name-block" style="flex:1;">
            <h4>${medal} ${u.username}</h4>
            <span class="branch-chip" style="background: ${meta.color}15; color: ${meta.color};">${u.branch || 'Unknown'}</span>
          </div>
          <button
            onclick="confirmDelete('${key}')"
            style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.2);
                   border-radius:8px; padding:5px 9px; color:#f87171; cursor:pointer;
                   font-size:0.75rem; transition:background 0.2s;"
            title="Delete account"
            onmouseover="this.style.background='rgba(239,68,68,0.25)'"
            onmouseout="this.style.background='rgba(239,68,68,0.1)'"
          ><i class="fa-solid fa-trash"></i></button>
        </div>

        <div class="student-meta" style="margin-bottom: 0.8rem; line-height: 1.4;">
          <i class="fa-solid fa-phone"></i> ${u.phone || 'N/A'} &nbsp;|&nbsp;
          <i class="fa-solid fa-key"></i> Freezes: ${u.freezes ?? 3}<br>
          <i class="fa-solid fa-id-badge"></i> Stu ID: <strong>${u.studentId || 'SSB0000'}</strong> &nbsp;|&nbsp;
          <i class="fa-solid fa-user-shield"></i> Parent ID: <strong>${u.parentId || 'SSBP0000'}</strong>
        </div>

        <div class="student-stats-row">
          <div class="stu-stat">
            <div class="sv sv-xp">${xp}</div>
            <div class="sl">Total XP</div>
          </div>
          <div class="stu-stat">
            <div class="sv sv-level">Lv.${u.level}</div>
            <div class="sl">Level</div>
          </div>
          <div class="stu-stat">
            <div class="sv sv-streak">${u.streak}d</div>
            <div class="sl">Streak</div>
          </div>
          <div class="stu-stat">
            <div class="sv sv-gold">${u.gold ?? 0}</div>
            <div class="sl">Gold GP</div>
          </div>
        </div>

        <div class="student-progress-wrap">
          <div class="student-progress-label">
            <span>XP Progress (Lv.${u.level} → ${u.level + 1})</span>
            <span>${u.xp} / ${maxXP} XP &nbsp;(${pct}%)</span>
          </div>
          <div class="student-progress-bar">
            <div class="student-progress-fill" style="width:${pct}%; background: linear-gradient(90deg, ${meta.color}, ${meta.color}a0);"></div>
          </div>
        </div>

        <div class="gift-gp-row">
          <input
            type="number" min="1" max="99999"
            id="gp-input-${key}"
            class="gift-gp-input"
            placeholder="Amount of GP..."
            onkeydown="if(event.key==='Enter') giftGP('${key}')"
          >
          <button class="gift-gp-btn" onclick="giftGP('${key}')" style="background: linear-gradient(135deg, ${meta.color}, ${meta.color}c0);">
            <i class="fa-solid fa-coins"></i> Gift GP
          </button>
        </div>
      `;
      cardsGrid.appendChild(card);
    });

    section.appendChild(cardsGrid);
    grid.appendChild(section);
  });

  // Update last refresh time
  document.getElementById('admin-last-refresh').textContent =
    'Last updated: ' + new Date().toLocaleTimeString();
}

// ─── Companion AI Config (Admin Restricted) ───────────────────
function initAdminAI() {
  const mode = localStorage.getItem('ss_gemini_brain_mode') || 'persona';
  const apiKey = localStorage.getItem('ss_gemini_api_key') || '';
  
  const selectMode = document.getElementById('admin-ai-brain-mode');
  const keyInput = document.getElementById('admin-gemini-key-input');
  const keyContainer = document.getElementById('admin-ai-key-container');
  
  if (selectMode) selectMode.value = mode;
  if (keyInput) keyInput.value = apiKey;
  if (keyContainer) {
    keyContainer.classList.toggle('hidden', mode !== 'gemini');
  }
}

window.toggleAdminAIBrainMode = function() {
  const selectMode = document.getElementById('admin-ai-brain-mode');
  if (!selectMode) return;
  const val = selectMode.value;
  
  localStorage.setItem('ss_gemini_brain_mode', val);
  
  const keyContainer = document.getElementById('admin-ai-key-container');
  if (keyContainer) {
    keyContainer.classList.toggle('hidden', val !== 'gemini');
  }
  
  adminToast(`Brain Config: ${val === 'gemini' ? 'Gemini 2.5 Live AI' : 'Simulated Persona Engine'}`, 'amber');
};

window.saveAdminGeminiApiKey = function() {
  const keyInput = document.getElementById('admin-gemini-key-input');
  const val = keyInput ? keyInput.value.trim() : '';
  
  localStorage.setItem('ss_gemini_api_key', val);
  
  if (val !== '') {
    localStorage.setItem('ss_gemini_brain_mode', 'gemini');
    const selectMode = document.getElementById('admin-ai-brain-mode');
    if (selectMode) selectMode.value = 'gemini';
    
    const keyContainer = document.getElementById('admin-ai-key-container');
    if (keyContainer) {
      keyContainer.classList.remove('hidden');
    }
    
    adminToast('✅ Gemini 2.5 Key Saved & Live AI Enabled!', 'green');
  } else {
    localStorage.setItem('ss_gemini_brain_mode', 'persona');
    const selectMode = document.getElementById('admin-ai-brain-mode');
    if (selectMode) selectMode.value = 'persona';
    
    const keyContainer = document.getElementById('admin-ai-key-container');
    if (keyContainer) {
      keyContainer.classList.add('hidden');
    }
    
    adminToast('API Key Cleared. Reverted to offline mode.', 'amber');
  }
};

// ─── Unlock the admin panel ──────────────────────────────────
function unlockAdmin() {
  const pw = document.getElementById('gate-password').value;
  if (pw === ADMIN_PASSWORD) {
    document.getElementById('admin-gate').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    
    // Load users from MongoDB on unlock
    fetchDbUsers(() => {
      updateStats();
      renderStudents();
      initAdminAI();
    });

    // Auto-refresh every 15 seconds
    setInterval(() => {
      fetchDbUsers(() => {
        updateStats();
        renderStudents();
      });
    }, 15000);
  } else {
    const err = document.getElementById('gate-error');
    err.style.display = 'block';
    document.getElementById('gate-password').value = '';
    setTimeout(() => { err.style.display = 'none'; }, 3000);
  }
}

// ─── DOM Ready ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Gate submit
  document.getElementById('gate-submit-btn').addEventListener('click', unlockAdmin);
  document.getElementById('gate-password').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') unlockAdmin();
  });

  // Logout
  document.getElementById('admin-logout').addEventListener('click', () => {
    document.getElementById('admin-gate').style.display = 'flex';
    document.getElementById('admin-dashboard').style.display = 'none';
    document.getElementById('gate-password').value = '';
  });

  // Refresh button
  document.getElementById('refresh-btn').addEventListener('click', () => {
    fetchDbUsers(() => {
      updateStats();
      renderStudents();
    });
  });

  // Search
  document.getElementById('admin-search').addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    renderStudents();
  });

  // Sort buttons
  document.querySelectorAll('.admin-sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-sort-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSort = btn.dataset.sort;
      renderStudents();
    });
  });

  // Delete confirm modal
  document.getElementById('confirm-cancel').addEventListener('click', () => {
    document.getElementById('confirm-overlay').style.display = 'none';
    pendingDeleteKey = null;
  });

  document.getElementById('confirm-delete').addEventListener('click', () => {
    if (!pendingDeleteKey) return;
    const username = pendingDeleteKey;

    fetch(`/api/admin/delete/${username}`, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        if (adminUsersCache) delete adminUsersCache[username.toLowerCase()];
        document.getElementById('confirm-overlay').style.display = 'none';
        pendingDeleteKey = null;
        adminToast(`🗑️ Deleted account: ${username}`, 'red');
        updateStats();
        renderStudents();
      } else {
        adminToast('Failed to delete account: ' + (data.message || 'error'), 'red');
      }
    })
    .catch(err => {
      adminToast('Network error deleting account.', 'red');
    });
  });

  // Theme: always dark for admin panel
  document.body.classList.add('dark-theme');
});
