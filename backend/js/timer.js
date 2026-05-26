// Study Desk Focus Timer & Sound Synthesizer Controller

let timerInterval = null;
let timerTimeLeft = 1500; // 25 minutes in seconds
let timerTotalDuration = 1500;
let timerMode = 'focus'; // 'focus' or 'break'
let timerState = 'idle'; // 'idle', 'running', 'paused'

// Audio Synthesis Controller
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSynthSound(type) {
  try {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime); 
      osc.frequency.setValueAtTime(554.37, audioCtx.currentTime + 0.15); 
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.3); 
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.45); 
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.7);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.7);
    } else if (type === 'unlock') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(261.63, audioCtx.currentTime); 
      osc.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.5); 
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } else if (type === 'alert') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'slash') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(700, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    }
  } catch (e) {
    console.log("Audio contexts need interaction to start.");
  }
}

window.playSynthSound = playSynthSound;

// Soundscape State
let noiseSourceNode = null;
let soundscapeGainNode = null;
let lfoSourceNode = null;

function createNoiseBuffer() {
  const sampleRate = audioCtx.sampleRate;
  const bufferSize = sampleRate * 2; 
  const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function startSoundscapeLoop() {
  const select = document.getElementById('soundscape-select');
  if (!select) return;
  
  const type = select.value;
  if (type === 'none') return;
  
  try {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    stopSoundscapeLoop();
    
    noiseSourceNode = audioCtx.createBufferSource();
    noiseSourceNode.buffer = createNoiseBuffer();
    noiseSourceNode.loop = true;
    
    soundscapeGainNode = audioCtx.createGain();
    
    if (type === 'white-noise') {
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, audioCtx.currentTime);
      filter.Q.setValueAtTime(1.5, audioCtx.currentTime);
      
      lfoSourceNode = audioCtx.createOscillator();
      lfoSourceNode.type = 'sine';
      lfoSourceNode.frequency.setValueAtTime(0.08, audioCtx.currentTime); 
      
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.setValueAtTime(150, audioCtx.currentTime); 
      
      lfoSourceNode.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      
      noiseSourceNode.connect(filter);
      filter.connect(soundscapeGainNode);
      
      soundscapeGainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);
      lfoSourceNode.start();
    } 
    else if (type === 'rain') {
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, audioCtx.currentTime);
      filter.Q.setValueAtTime(2.0, audioCtx.currentTime);
      
      lfoSourceNode = audioCtx.createOscillator();
      lfoSourceNode.type = 'sawtooth';
      lfoSourceNode.frequency.setValueAtTime(7.5, audioCtx.currentTime); 
      
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      
      lfoSourceNode.connect(lfoGain);
      lfoGain.connect(soundscapeGainNode.gain);
      
      noiseSourceNode.connect(filter);
      filter.connect(soundscapeGainNode);
      
      soundscapeGainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);
      lfoSourceNode.start();
    } 
    else if (type === 'ocean') {
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, audioCtx.currentTime);
      
      lfoSourceNode = audioCtx.createOscillator();
      lfoSourceNode.type = 'sine';
      lfoSourceNode.frequency.setValueAtTime(0.05, audioCtx.currentTime); 
      
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      
      lfoSourceNode.connect(lfoGain);
      lfoGain.connect(soundscapeGainNode.gain);
      
      noiseSourceNode.connect(filter);
      filter.connect(soundscapeGainNode);
      
      soundscapeGainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      lfoSourceNode.start();
    }
    
    soundscapeGainNode.connect(audioCtx.destination);
    noiseSourceNode.start();
    if (window.logSimulation) window.logSimulation(`Focus Soundscape loop started: ${type.toUpperCase()}`);
  } catch (err) {
    console.error("Audio initialization failed: ", err);
  }
}

function stopSoundscapeLoop() {
  try {
    if (noiseSourceNode) {
      noiseSourceNode.stop();
      noiseSourceNode.disconnect();
      noiseSourceNode = null;
    }
    if (lfoSourceNode) {
      lfoSourceNode.stop();
      lfoSourceNode.disconnect();
      lfoSourceNode = null;
    }
    if (soundscapeGainNode) {
      soundscapeGainNode.disconnect();
      soundscapeGainNode = null;
    }
  } catch (e) {}
}

function updateTimerInputState() {
  const customDurationInput = document.getElementById('custom-duration-input');
  if (!customDurationInput) return;
  if (timerMode === 'focus' && timerState === 'idle') {
    customDurationInput.disabled = false;
  } else {
    customDurationInput.disabled = true;
  }
}

function updateTimerCircleProgress() {
  const ring = document.getElementById('timer-progress-ring');
  if (!ring) return;
  const percent = timerTotalDuration > 0 ? timerTimeLeft / timerTotalDuration : 1;
  const offset = percent * 596.9;
  ring.style.strokeDashoffset = 596.9 - offset;
}

window.setTimerMode = function(mode) {
  if (timerState === 'running') {
    if (window.showToast) window.showToast('Timer Running', 'Please pause or reset focus before changing modes.', 'alert');
    return;
  }
  
  timerMode = mode;
  const modeFocus = document.getElementById('mode-focus');
  const modeBreak = document.getElementById('mode-break');
  if (modeFocus) modeFocus.classList.toggle('active', mode === 'focus');
  if (modeBreak) modeBreak.classList.toggle('active', mode === 'break');
  
  const customDurationInput = document.getElementById('custom-duration-input');
  const timeDisplay = document.getElementById('timer-time');
  const statusDisplay = document.getElementById('timer-status-text');
  
  if (mode === 'focus') {
    const customMinutes = customDurationInput ? parseInt(customDurationInput.value, 10) : 25;
    const durationSeconds = (isNaN(customMinutes) || customMinutes <= 0) ? 1500 : customMinutes * 60;
    
    timerTimeLeft = durationSeconds;
    timerTotalDuration = durationSeconds;
    
    if (timeDisplay) {
      const displayMinutes = Math.floor(timerTimeLeft / 60);
      const displaySeconds = timerTimeLeft % 60;
      timeDisplay.innerText = `${String(displayMinutes).padStart(2, '0')}:${String(displaySeconds).padStart(2, '0')}`;
    }
    if (statusDisplay) {
      statusDisplay.innerText = "Ready to Focus";
      statusDisplay.style.color = "var(--text-muted)";
    }
  } else {
    timerTimeLeft = 300; 
    timerTotalDuration = 300;
    if (timeDisplay) timeDisplay.innerText = "05:00";
    if (statusDisplay) {
      statusDisplay.innerText = "Time to Rest!";
      statusDisplay.style.color = "var(--success-color)";
    }
  }
  
  updateTimerInputState();
  updateTimerCircleProgress();
};

window.startTimer = function() {
  if (timerState === 'running') return;
  
  playSynthSound('click');
  timerState = 'running';
  updateTimerInputState();
  
  const startBtn = document.getElementById('timer-start-btn');
  const pauseBtn = document.getElementById('timer-pause-btn');
  if (startBtn) startBtn.classList.add('hidden');
  if (pauseBtn) pauseBtn.classList.remove('hidden');
  
  if (timerMode === 'focus') {
    startSoundscapeLoop();
  }
  
  const timeDisplay = document.getElementById('timer-time');
  const timerCircleWrapper = document.querySelector('.circular-progress-timer');
  if (timerCircleWrapper) timerCircleWrapper.classList.add('timer-active-glow');
  if (timeDisplay) timeDisplay.className = "timer-clock timer-running-pulse";
  
  const statusDisplay = document.getElementById('timer-status-text');
  if (statusDisplay) statusDisplay.innerText = timerMode === 'focus' ? 'Stay Focused!' : 'Rest Well!';
  
  timerInterval = setInterval(() => {
    timerTimeLeft--;
    
    const minutes = Math.floor(timerTimeLeft / 60);
    const seconds = timerTimeLeft % 60;
    if (timeDisplay) timeDisplay.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    updateTimerCircleProgress();
    
    if (timerTimeLeft <= 0) {
      completeTimerSession();
    }
  }, 1000);
};

window.pauseTimer = function() {
  if (timerState !== 'running') return;
  
  playSynthSound('click');
  clearInterval(timerInterval);
  timerState = 'paused';
  updateTimerInputState();
  
  stopSoundscapeLoop();
  
  const startBtn = document.getElementById('timer-start-btn');
  const pauseBtn = document.getElementById('timer-pause-btn');
  if (startBtn) startBtn.classList.remove('hidden');
  if (pauseBtn) pauseBtn.classList.add('hidden');
  
  const timeDisplay = document.getElementById('timer-time');
  const timerCircleWrapper = document.querySelector('.circular-progress-timer');
  if (timerCircleWrapper) timerCircleWrapper.classList.remove('timer-active-glow');
  if (timeDisplay) timeDisplay.className = "timer-clock animate-pulse-idle";
  
  const statusDisplay = document.getElementById('timer-status-text');
  if (statusDisplay) statusDisplay.innerText = 'Paused';
};

window.resetTimer = function() {
  playSynthSound('click');
  clearInterval(timerInterval);
  timerState = 'idle';
  updateTimerInputState();
  
  stopSoundscapeLoop();
  
  const startBtn = document.getElementById('timer-start-btn');
  const pauseBtn = document.getElementById('timer-pause-btn');
  if (startBtn) startBtn.classList.remove('hidden');
  if (pauseBtn) pauseBtn.classList.add('hidden');
  
  const timeDisplay = document.getElementById('timer-time');
  const timerCircleWrapper = document.querySelector('.circular-progress-timer');
  if (timerCircleWrapper) timerCircleWrapper.classList.remove('timer-active-glow');
  if (timeDisplay) timeDisplay.className = "timer-clock animate-pulse-idle";
  
  window.setTimerMode(timerMode);
};

function completeTimerSession() {
  clearInterval(timerInterval);
  timerState = 'idle';
  updateTimerInputState();
  
  stopSoundscapeLoop();
  
  const startBtn = document.getElementById('timer-start-btn');
  const pauseBtn = document.getElementById('timer-pause-btn');
  if (startBtn) startBtn.classList.remove('hidden');
  if (pauseBtn) pauseBtn.classList.add('hidden');
  
  const timeDisplay = document.getElementById('timer-time');
  const timerCircleWrapper = document.querySelector('.circular-progress-timer');
  if (timerCircleWrapper) timerCircleWrapper.classList.remove('timer-active-glow');
  if (timeDisplay) timeDisplay.className = "timer-clock animate-pulse-idle";
  
  if (timerMode === 'focus') {
    const completedMinutes = Math.round(timerTotalDuration / 60);
    const xpReward = completedMinutes;
    const goldReward = Math.round(completedMinutes * 0.8);
    const bossDmgReward = completedMinutes;
    
    if (window.showToast) window.showToast('Focus Session Completed!', `⚡ Exceptional discipline! You completed a ${completedMinutes}-minute study session.`, 'success');
    
    // Pure Local Storage updates
    const token = localStorage.getItem('token');
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const usernameKey = token && token.startsWith('local_session_') ? token.split('local_session_')[1] : '';
    const user = users[usernameKey];
    
    if (user) {
      user.gold += goldReward;
      user.xp += xpReward;
      user.bossHp -= bossDmgReward;
      if (user.focusHistory) {
        user.focusHistory[6] = (user.focusHistory[6] || 0) + completedMinutes;
      }
      
      // Reward Pet Companion if adopted
      if (user.pet) {
        // If unconscious, they can't gain health/happiness from normal stuff, must revive!
        if (user.pet.hp > 0) {
          user.pet.hp = Math.min(100, user.pet.hp + completedMinutes);
          user.pet.happiness = Math.min(100, user.pet.happiness + Math.round(completedMinutes * 0.8));
          user.pet.xp += completedMinutes * 1.5;
          
          let petXpNeeded = user.pet.level * 100;
          while (user.pet.xp >= petXpNeeded) {
            user.pet.xp -= petXpNeeded;
            user.pet.level++;
            petXpNeeded = user.pet.level * 100;
          }
          
          let prefix = "Meow! ";
          if (user.pet.type === 'Zen Panda') prefix = "Breathe in... ";
          else if (user.pet.type === 'Knowledge Dragon') prefix = "A SPLENDID FOCUS WORK! ";
          else if (user.pet.type === 'Smart Fox') prefix = "Smart focus hack complete! ";
          else if (user.pet.type === 'Chill Penguin') prefix = "Super cool work, buddy! ";
          else if (user.pet.type === 'Pixel Robot') prefix = "PROCESSING COMPLETE. ";
          
          const chatLog = { sender: 'pet', text: prefix + `That focus session felt incredible! I gained +${completedMinutes} Health, +${Math.round(completedMinutes * 0.8)} Happiness, and +${Math.round(completedMinutes * 1.5)} Pet XP! You are doing amazing!` };
          if (!user.pet.chatHistory) user.pet.chatHistory = [];
          user.pet.chatHistory.push(chatLog);
          while (user.pet.chatHistory.length > 25) user.pet.chatHistory.shift();
        }
      }
      
      // Level check
      let nextLevelXP = user.level * 150;
      while (user.xp >= nextLevelXP) {
        user.xp -= nextLevelXP;
        user.level++;
        nextLevelXP = user.level * 150;
      }
      
      // Boss check
      if (user.bossHp <= 0) {
        user.gold += user.bossLevel * 50 + 50;
        user.xp += user.bossLevel * 100;
        user.bossLevel++;
        user.bossMaxHp = user.bossLevel * 100;
        user.bossHp = user.bossMaxHp;
        
        nextLevelXP = user.level * 150;
        while (user.xp >= nextLevelXP) {
          user.xp -= nextLevelXP;
          user.level++;
          nextLevelXP = user.level * 150;
        }
      }
      
      users[usernameKey] = user;
      localStorage.setItem('users', JSON.stringify(users));
      
      if (window.updateDashboardUI) window.updateDashboardUI(user);
      if (window.logSimulation) {
        window.logSimulation(`Earned ${goldReward} GP & ${xpReward} XP for Pomodoro focus.`);
      }
    }
    
    window.setTimerMode('break');
  } else {
    if (window.showToast) window.showToast('Break Completed!', '🔋 You are energized and ready to focus on your studies!', 'success');
    window.setTimerMode('focus');
  }
}

window.handleSoundscapeChange = function() {
  playSynthSound('click');
  if (timerState === 'running' && timerMode === 'focus') {
    startSoundscapeLoop();
  }
};

window.renderAnalyticsChart = function(focusHistory) {
  if (!focusHistory) return;
  
  const chartPath = document.getElementById('chart-path');
  const pointsGroup = document.getElementById('chart-points');
  const labelsGroup = document.getElementById('chart-labels');
  const totalDisplay = document.getElementById('total-focus-minutes-display');
  
  if (!chartPath || !pointsGroup || !labelsGroup) return;
  
  const totalMinutes = focusHistory.reduce((a, b) => a + b, 0);
  if (totalDisplay) totalDisplay.innerText = `${totalMinutes} focused mins`;
  
  const width = 300;
  const height = 120;
  const padX = 25;
  const padY = 20;
  const graphWidth = width - padX * 2;
  const graphHeight = height - padY * 2;
  
  const maxVal = Math.max(50, ...focusHistory); 
  const stepX = graphWidth / 6;
  
  const points = focusHistory.map((val, idx) => {
    const x = padX + idx * stepX;
    const y = height - padY - (val / maxVal) * graphHeight;
    return { x, y, val };
  });
  
  const dAttr = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  chartPath.setAttribute('d', dAttr);
  
  pointsGroup.innerHTML = '';
  labelsGroup.innerHTML = '';
  
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  points.forEach((p, idx) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', p.x);
    circle.setAttribute('cy', p.y);
    circle.setAttribute('r', '4.5');
    circle.className.baseVal = 'chart-point';
    circle.setAttribute('title', `${p.val} minutes`);
    
    circle.addEventListener('mouseenter', () => {
      if (window.showToast) window.showToast('Activity Log', `${dayNames[idx]}: focused for ${p.val} minute(s).`, 'xp');
    });
    
    pointsGroup.appendChild(circle);
    
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', p.x);
    label.setAttribute('y', height - 5);
    label.className.baseVal = 'chart-label';
    label.textContent = dayNames[idx];
    labelsGroup.appendChild(label);
  });
};

window.warpPomodoroTimer = function() {
  if (timerState !== 'running') {
    if (window.showToast) window.showToast('Start Timer First', 'Please start the focus session timer before speeding it up.', 'alert');
    return;
  }
  playSynthSound('click');
  timerTimeLeft = 5;
  if (window.showToast) window.showToast('Time Warped!', 'Timer speed accelerated! 5 seconds left in current session.', 'info');
  if (window.logSimulation) window.logSimulation('Time warped Pomodoro countdown to 5s.');
};
