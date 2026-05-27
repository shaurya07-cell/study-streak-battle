/* ==========================================
   STUDY STREAK BATTLE - CLIENT AUTHENTICATION (PURE LOCAL STORAGE)
   ========================================== */

// Global file:// protocol API base URL redirect helper
if (window.location.protocol === 'file:') {
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    if (typeof input === 'string' && input.startsWith('/api')) {
      input = 'http://localhost:3000' + input;
    }
    return originalFetch(input, init);
  };
}

// ════════════════════════════════════════════════════════════
// Authentication is powered by Fast2SMS server-side API endpoints
// ════════════════════════════════════════════════════════════

// Smart navigation routing helper to resolve relative paths directly into standard .html pages
window.navigateTo = function (page) {
  if (page === '/dashboard') window.location.href = 'dashboard.html';
  else if (page === '/login') window.location.href = 'login.html';
  else if (page === '/leaderboard') window.location.href = 'leaderboard.html';
  else if (page === '/profile') window.location.href = 'profile.html';
  else window.location.href = 'index.html';
};

// Premium Toast System (Purely Client-Side)
window.showToast = function (title, message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconClass = 'fa-circle-info';
  if (type === 'success') {
    iconClass = 'fa-circle-check';
    if (window.playSynthSound) window.playSynthSound('success');
  } else if (type === 'level') {
    iconClass = 'fa-circle-up';
    if (window.playSynthSound) window.playSynthSound('unlock');
  } else if (type === 'xp') {
    iconClass = 'fa-bolt';
    if (window.playSynthSound) window.playSynthSound('click');
  } else if (type === 'alert') {
    iconClass = 'fa-triangle-exclamation';
    if (window.playSynthSound) window.playSynthSound('alert');
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
};

// Check session locally on page entry
window.checkSession = async function (page) {
  const token = localStorage.getItem('token');
  const users = JSON.parse(localStorage.getItem('users') || '{}');

  if (page === 'auth') {
    if (token) {
      window.navigateTo('/dashboard');
    }
    return null;
  } else {
    if (!token) {
      window.navigateTo('/login');
      return null;
    }

    const usernameKey = token.startsWith('local_session_') ? token.split('local_session_')[1] : '';
    const user = users[usernameKey];

    if (!user) {
      localStorage.removeItem('token');
      window.navigateTo('/login');
      return null;
    }

    return user;
  }
};

// Bind elements on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  // Backfill existing user IDs if missing sequentially
  const backfillUserIds = () => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    let updated = false;
    Object.keys(users).forEach((key, index) => {
      const u = users[key];
      if (!u.studentId || !u.parentId) {
        u.studentId = `SSB${String(index + 1).padStart(4, '0')}`;
        u.parentId = `SSBP${String(index + 1).padStart(4, '0')}`;
        updated = true;
      }
    });
    if (updated) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  };
  backfillUserIds();

  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout-btn');

  // Toggle triggers for authentication cards
  const toSignup = document.getElementById('to-signup');
  const toLogin = document.getElementById('to-login');
  const loginCard = document.getElementById('login-card');
  const signupCard = document.getElementById('signup-card');

  if (toSignup && toLogin) {
    toSignup.addEventListener('click', () => {
      loginCard.classList.add('hidden');
      signupCard.classList.remove('hidden');
    });

    toLogin.addEventListener('click', () => {
      signupCard.classList.add('hidden');
      loginCard.classList.remove('hidden');
    });
  }

  // Handle OTP Verification Logic
  const sendOtpBtn = document.getElementById('send-otp-btn');
  const verifyOtpBtn = document.getElementById('verify-otp-btn');
  const otpGroup = document.getElementById('otp-group');
  const otpTimerLabel = document.getElementById('otp-timer-label');
  const spawnBtn = document.getElementById('spawn-btn');

  let activeOtp = null;
  let activePhone = null;
  let otpVerified = false;
  let resendCountdown = 0;
  let timerInterval = null;
  let confirmationResult = null;
  let recaptchaVerifier = null;

  if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', () => {
      const phoneInput = document.getElementById('signup-phone');
      const phone = phoneInput.value.trim();

      if (!/^[0-9]{10}$/.test(phone)) {
        if (window.showToast) {
          window.showToast('Invalid Phone', 'Please enter a valid 10-digit phone number!', 'alert');
        } else {
          alert('Please enter a valid 10-digit phone number!');
        }
        return;
      }

      activePhone = phone;
      
      // Disable send button during the request
      sendOtpBtn.setAttribute('disabled', 'true');
      sendOtpBtn.innerText = 'Sending...';

      fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (otpGroup) otpGroup.classList.remove('hidden');

          let successMessage = data.message;
          // If the server console mock returns the OTP because key is not set
          if (data.devOtp) {
            activeOtp = data.devOtp;
            // If the message contains an error or failure, display it so the developer knows exactly why SMS failed
            if (data.message && (data.message.includes('failed') || data.message.includes('error') || data.message.includes('Failed'))) {
              successMessage = `${data.message}. Dev OTP: ${data.devOtp}`;
            } else {
              successMessage = `Dev Mode: OTP is ${data.devOtp} (Logged to server console)`;
            }
            if (window.showToast) {
              window.showToast('🛡️ Dev Verification', successMessage, 'success');
            } else {
              alert(successMessage);
            }
          } else {
            if (window.showToast) {
              window.showToast('🛡️ OTP Sent', 'A secure 6-digit verification code has been sent to your phone!', 'success');
            } else {
              alert('A secure 6-digit verification code has been sent to your phone!');
            }
          }

          // Start Countdown timer
          resendCountdown = 30;
          sendOtpBtn.innerText = `Resend (${resendCountdown}s)`;
          if (timerInterval) clearInterval(timerInterval);
          timerInterval = setInterval(() => {
            resendCountdown--;
            if (resendCountdown <= 0) {
              clearInterval(timerInterval);
              sendOtpBtn.removeAttribute('disabled');
              sendOtpBtn.innerText = 'Resend OTP';
              if (otpTimerLabel) otpTimerLabel.innerText = '';
            } else {
              sendOtpBtn.innerText = `Resend (${resendCountdown}s)`;
              if (otpTimerLabel) otpTimerLabel.innerText = `You can request a new OTP code in ${resendCountdown} seconds.`;
            }
          }, 1000);
        } else {
          sendOtpBtn.removeAttribute('disabled');
          sendOtpBtn.innerText = 'Send OTP';
          if (window.showToast) {
            window.showToast('OTP Dispatch Failed', data.message || 'Failed to dispatch SMS.', 'alert');
          } else {
            alert(data.message || 'Failed to dispatch SMS.');
          }
        }
      })
      .catch(err => {
        console.error('Send OTP network error:', err);
        sendOtpBtn.removeAttribute('disabled');
        sendOtpBtn.innerText = 'Send OTP';
        if (window.showToast) {
          window.showToast('Server Error', 'Failed to communicate with OTP dispatcher.', 'alert');
        } else {
          alert('Failed to communicate with OTP dispatcher.');
        }
      });
    });
  }

  if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener('click', () => {
      const otpInput = document.getElementById('signup-otp');
      const typedOtp = otpInput.value.trim();

      if (!/^[0-9]{6}$/.test(typedOtp)) {
        if (window.showToast) {
          window.showToast('Invalid OTP', 'Please enter a valid 6-digit OTP!', 'alert');
        } else {
          alert('Please enter a valid 6-digit OTP!');
        }
        return;
      }

      verifyOtpBtn.setAttribute('disabled', 'true');
      verifyOtpBtn.innerText = 'Verifying...';

      fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: activePhone, otp: typedOtp })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          otpVerified = true;

          // Lock UI inputs
          otpInput.setAttribute('disabled', 'true');
          document.getElementById('signup-phone').setAttribute('disabled', 'true');
          verifyOtpBtn.setAttribute('disabled', 'true');
          verifyOtpBtn.innerText = 'Verified';
          if (sendOtpBtn) sendOtpBtn.setAttribute('disabled', 'true');
          if (timerInterval) clearInterval(timerInterval);

          if (otpTimerLabel) {
            otpTimerLabel.innerText = '✅ Phone Verified Successfully!';
            otpTimerLabel.style.color = '#22c55e';
          }

          if (spawnBtn) spawnBtn.removeAttribute('disabled');

          if (window.showToast) {
            window.showToast('Verified!', 'Your phone is successfully verified. Create your profile!', 'success');
          }
        } else {
          verifyOtpBtn.removeAttribute('disabled');
          verifyOtpBtn.innerText = 'Verify';
          otpInput.value = '';
          if (window.showToast) {
            window.showToast('Verification Failed', data.message || 'Incorrect SMS code. Please try again!', 'alert');
          } else {
            alert(data.message || 'Incorrect SMS code. Please try again!');
          }
        }
      })
      .catch(err => {
        console.error('Verify OTP network error:', err);
        verifyOtpBtn.removeAttribute('disabled');
        verifyOtpBtn.innerText = 'Verify';
        if (window.showToast) {
          window.showToast('Server Error', 'Failed to communicate with OTP verifier.', 'alert');
        } else {
          alert('Failed to communicate with OTP verifier.');
        }
      });
    });
  }

  // Handle Signup
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!otpVerified) {
        if (window.showToast) {
          window.showToast('Verify Phone First', 'Please verify your phone number using the OTP code before registering!', 'alert');
        } else {
          alert('Please verify your phone number using the OTP code before registering!');
        }
        return;
      }

      const usernameInput = document.getElementById('signup-username').value.trim();
      const passwordInput = document.getElementById('signup-password').value;
      const branchInput = document.getElementById('signup-branch').value;
      const key = usernameInput.toLowerCase();

      const users = JSON.parse(localStorage.getItem('users') || '{}');

      if (users[key]) {
        if (window.showToast) {
          window.showToast('Profile Exists', 'This username has already been registered. Choose another!', 'alert');
        } else {
          alert('This username has already been registered. Choose another!');
        }
        return;
      }

      const userCount = Object.keys(users).length;
      const studentId = `SSB${String(userCount + 1).padStart(4, '0')}`;
      const parentId = `SSBP${String(userCount + 1).padStart(4, '0')}`;

      const newUser = {
        username: usernameInput,
        password: passwordInput,
        studentId: studentId,
        parentId: parentId,
        phone: activePhone,
        branch: branchInput,
        streak: 0,
        xp: 0,
        level: 1,
        freezes: 3,
        lastCheckIn: null,
        unlockedBadges: [],
        gold: 0,
        hp: 100,
        quests: [],
        unlockedThemes: [],
        activeTheme: 'default',
        bossHp: 100,
        bossMaxHp: 100,
        bossLevel: 1,
        focusHistory: [0, 0, 0, 0, 0, 0, 0]
      };

      // Sync to MongoDB database
      fetch('/api/sync-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, data: newUser })
      })
      .then(res => res.json())
      .then(data => {
        const syncedUser = data.success ? data.user : newUser;
        users[key] = syncedUser;
        localStorage.setItem('users', JSON.stringify(users));

        const sessionToken = `local_session_${key}`;
        localStorage.setItem('token', sessionToken);
        window.navigateTo('/dashboard');
      })
      .catch(err => {
        console.warn('MongoDB offline fallback registration active:', err);
        users[key] = newUser;
        localStorage.setItem('users', JSON.stringify(users));

        const sessionToken = `local_session_${key}`;
        localStorage.setItem('token', sessionToken);
        window.navigateTo('/dashboard');
      });
    });
  }

  // Handle Login
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const usernameInput = document.getElementById('login-username').value.trim();
      const passwordInput = document.getElementById('login-password').value;
      const key = usernameInput.toLowerCase();

      const submitBtn = loginForm.querySelector('button[type="submit"]');
      let originalBtnHtml = '';
      if (submitBtn) {
        originalBtnHtml = submitBtn.innerHTML;
        submitBtn.setAttribute('disabled', 'true');
        submitBtn.innerHTML = `<span>Authenticating...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>`;
      }

      const resetSubmitBtn = () => {
        if (submitBtn) {
          submitBtn.removeAttribute('disabled');
          submitBtn.innerHTML = originalBtnHtml;
        }
      };

      // ── 1. INSTANT LOCAL-FIRST CREDENTIAL BYPASS ──
      const localUsers = JSON.parse(localStorage.getItem('users') || '{}');
      const localUser = localUsers[key];

      if (localUser && localUser.password === passwordInput) {
        console.log('⚡ [Instant Login]: Local credentials verified. Granting instant entry.');
        
        // Log in immediately!
        const sessionToken = `local_session_${key}`;
        localStorage.setItem('token', sessionToken);
        
        // Concurrently run a silent background profile refresh from the database
        fetch(`/api/user/${key}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.user) {
              const updatedUsers = JSON.parse(localStorage.getItem('users') || '{}');
              updatedUsers[key] = data.user;
              localStorage.setItem('users', JSON.stringify(updatedUsers));
              console.log('🍃 [Instant Login background sync]: Profile updated from server successfully.');
            }
          })
          .catch(err => console.warn('🍃 [Instant Login background sync]: Failed to connect to server. Local state kept.'));

        // Navigate instantly!
        window.navigateTo('/dashboard');
        return;
      }

      // ── 2. SECURE NETWORK FALLBACK (New device/session or updated password) ──
      // Fetch user profile stats from MongoDB
      fetch(`/api/user/${key}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          const user = data.user;
          if (user.password === passwordInput) {
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            users[key] = user;
            localStorage.setItem('users', JSON.stringify(users));

            const sessionToken = `local_session_${key}`;
            localStorage.setItem('token', sessionToken);
            window.navigateTo('/dashboard');
          } else {
            resetSubmitBtn();
            if (window.showToast) {
              window.showToast('Access Denied', 'Invalid credentials. Double check password!', 'alert');
            } else {
              alert('Invalid credentials. Double check password!');
            }
          }
        } else {
          // Local storage fallback for offline support
          const users = JSON.parse(localStorage.getItem('users') || '{}');
          const user = users[key];

          if (user && user.password === passwordInput) {
            const sessionToken = `local_session_${key}`;
            localStorage.setItem('token', sessionToken);
            window.navigateTo('/dashboard');
          } else {
            resetSubmitBtn();
            if (window.showToast) {
              window.showToast('Access Denied', 'Invalid credentials or user not registered!', 'alert');
            } else {
              alert('Invalid credentials or user not registered!');
            }
          }
        }
      })
      .catch(err => {
        console.warn('Database fetch failed. Falling back to local accounts:', err);
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        const user = users[key];

        if (user && user.password === passwordInput) {
          const sessionToken = `local_session_${key}`;
          localStorage.setItem('token', sessionToken);
          window.navigateTo('/dashboard');
        } else {
          resetSubmitBtn();
          if (window.showToast) {
            window.showToast('Access Denied', 'Invalid credentials. Offline mode mismatch!', 'alert');
          } else {
            alert('Invalid credentials!');
          }
        }
      });
    });
  }

  // Handle Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.navigateTo('/login');
    });
  }

  // Intercept relative path links and route them via window.navigateTo
  const navLinks = document.querySelectorAll('a, .auth-toggle span');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('/')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.navigateTo(href);
      });
    }
  });
});

// ──────────────────────────────────────────────────────────
// TRANSPARENT BACKGROUND SYNC ENGINE (MongoDB Persistence)
// ──────────────────────────────────────────────────────────
window.syncCurrentUserState = function () {
  const token = localStorage.getItem('token');
  if (!token) return;
  const usernameKey = token.startsWith('local_session_') ? token.split('local_session_')[1] : '';
  if (!usernameKey) return;

  const users = JSON.parse(localStorage.getItem('users') || '{}');
  const currentUser = users[usernameKey];
  if (!currentUser) return;

  fetch('/api/sync-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: currentUser.username, data: currentUser })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log('🍃 Database Sync: Local state saved in MongoDB.');
    }
  })
  .catch(err => console.warn('🍃 Database Sync: Offline-mode active (local fallback only).'));
};

// Hook background sync interval (auto-saves locally modified data every 10 seconds)
if (localStorage.getItem('token')) {
  setInterval(() => {
    if (window.syncCurrentUserState) window.syncCurrentUserState();
  }, 10000);
}
