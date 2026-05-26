// Study Streak Leaderboard Controller

function loadLeaderboard() {
  const container = document.getElementById('leaderboard-list');
  if (!container) return;
  
  const token = localStorage.getItem('token');
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  const usernameKey = token && token.startsWith('local_session_') ? token.split('local_session_')[1] : '';
  const activeUser = users[usernameKey];
  
  if (!activeUser) return;
  
  const list = [];
  
  // Convert active users
  Object.keys(users).forEach(k => {
    const u = users[k];
    const cumulativeXP = u.xp + (u.level - 1) * 150 + calculateAccXP(u.level);
    list.push({
      username: u.username,
      xp: cumulativeXP,
      level: u.level,
      streak: u.streak,
      branch: u.branch,
      isUser: u.username.toLowerCase() === activeUser.username.toLowerCase()
    });
  });
  
  // Sort descending
  list.sort((a, b) => b.xp - a.xp);

  container.innerHTML = '';

  // Empty state — only current user, no peers yet
  if (list.length <= 1) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <i class="fa-solid fa-users" style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--primary-color); opacity: 0.5;"></i>
        <p style="font-size: 1rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem;">You're the first one here!</p>
        <p style="font-size: 0.82rem; line-height: 1.5;">Share StudyStreak with your classmates. Once they sign up, they'll appear on this leaderboard automatically.</p>
      </div>
    `;
    // Still show the current user at the top if they exist
    if (list.length === 1) {
      const userEntry = document.createElement('div');
      userEntry.className = 'leaderboard-item rank-1 user-highlight';
      userEntry.innerHTML = `
        <div class="rank-badge">1</div>
        <div class="leaderboard-avatar"><i class="fa-solid fa-shield-halved"></i></div>
        <div class="leaderboard-info">
          <div class="leaderboard-name">
            ${list[0].username} <span class="branch-tag">[${list[0].branch}]</span> <span class="you-label">YOU</span>
          </div>
          <div class="leaderboard-xp-level">
            Level ${list[0].level} &bull; <span>${list[0].xp} Cumulative XP</span>
          </div>
        </div>
        <div class="leaderboard-streak-pill" title="Current Active Streak">
          <i class="fa-solid fa-fire"></i> ${list[0].streak}d
        </div>
      `;
      container.insertBefore(userEntry, container.firstChild);
    }
    return;
  }

  list.forEach((rival, idx) => {
    const isMe = rival.isUser;
    const rankClass = `rank-${idx + 1}`;

    const item = document.createElement('div');
    item.className = `leaderboard-item ${rankClass} ${isMe ? 'user-highlight' : ''}`;

    item.innerHTML = `
      <div class="rank-badge">${idx + 1}</div>
      <div class="leaderboard-avatar">
        <i class="fa-solid ${isMe ? 'fa-shield-halved' : 'fa-user'}"></i>
      </div>
      <div class="leaderboard-info">
        <div class="leaderboard-name">
          ${rival.username} <span class="branch-tag">[${rival.branch}]</span> ${isMe ? '<span class="you-label">YOU</span>' : ''}
        </div>
        <div class="leaderboard-xp-level">
          Level ${rival.level} &bull; <span>${rival.xp} Cumulative XP</span>
        </div>
      </div>
      <div class="leaderboard-streak-pill" title="Current Active Streak">
        <i class="fa-solid fa-fire"></i> ${rival.streak}d
      </div>
    `;
    container.appendChild(item);
  });
}

function calculateAccXP(lvl) {
  let acc = 0;
  for (let i = 1; i < lvl; i++) acc += i * 150;
  return acc;
}

document.addEventListener('DOMContentLoaded', async () => {
  // Protect session
  const user = await window.checkSession('leaderboard');
  if (!user) return;
  
  // Applyequipped custom theme
  const body = document.body;
  body.classList.remove('cyberpunk-theme', 'forest-theme', 'solar-theme');
  if (user.activeTheme === 'cyber') body.classList.add('cyberpunk-theme');
  else if (user.activeTheme === 'forest') body.classList.add('forest-theme');
  else if (user.activeTheme === 'solar') body.classList.add('solar-theme');
  
  // Navigation details
  const nameEl = document.getElementById('user-display-name');
  const levelEl = document.getElementById('user-display-level');
  const hpEl = document.getElementById('header-hp');
  const goldEl = document.getElementById('header-gold');
  
  if (nameEl) nameEl.innerText = user.username;
  if (levelEl) levelEl.innerText = `Level ${user.level} (${user.branch || 'General'})`;
  if (hpEl) hpEl.innerText = `${user.hp} / 100`;
  if (goldEl) goldEl.innerText = `${user.gold} GP`;
  
  const themeToggle = document.getElementById('theme-toggle-btn');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      if (window.playSynthSound) window.playSynthSound('click');
      const body = document.body;
      const isDark = body.classList.contains('dark-theme');
      body.classList.toggle('dark-theme', !isDark);
      body.classList.toggle('light-theme', isDark);
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });
    
    const savedVisual = localStorage.getItem('theme');
    if (savedVisual === 'light') {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
    }
  }

  loadLeaderboard();
});
