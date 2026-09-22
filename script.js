/**
 * Islamafy Landing Page - Standalone JavaScript
 * High-performance, zero-dependency interactive script.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------------------------
  // 1. Sticky Header Reveal on Scroll (Reveals after 50vh)
  // ---------------------------------------------------------------------------
  const headerSticky = document.getElementById('header-sticky');

  const handleScroll = () => {
    // Reveal sticky navbar when scrolled past 50vh (half viewport)
    const threshold = window.innerHeight * 0.5;
    if (window.scrollY >= threshold) {
      headerSticky?.classList.add('scrolled');
    } else {
      headerSticky?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll, { passive: true });
  handleScroll();

  // "Join Waitlist" in navbar scrolls to Hero form and focuses input
  const navWaitlistBtn = document.getElementById('nav-waitlist-btn');
  navWaitlistBtn?.addEventListener('click', () => {
    const heroSection = document.getElementById('hero');
    heroSection?.scrollIntoView({ behavior: 'smooth' });
    const heroInput = document.getElementById('hero-email-input');
    setTimeout(() => heroInput?.focus(), 400);
  });

  // ---------------------------------------------------------------------------
  // 2. Toast Notification System
  // ---------------------------------------------------------------------------
  const toastNotification = document.getElementById('toast-notification');
  const toastMessageText = document.getElementById('toast-message-text');
  const toastCloseBtn = document.getElementById('toast-close-btn');
  let toastTimeout = null;

  const showToast = (message) => {
    if (!toastNotification || !toastMessageText) return;
    if (toastTimeout) clearTimeout(toastTimeout);

    toastMessageText.textContent = message;
    toastNotification.classList.add('active');

    toastTimeout = setTimeout(() => {
      toastNotification.classList.remove('active');
    }, 5000);
  };

  toastCloseBtn?.addEventListener('click', () => {
    if (toastTimeout) clearTimeout(toastTimeout);
    toastNotification?.classList.remove('active');
  });

  // ---------------------------------------------------------------------------
  // 3. Waitlist Form Submission (Hero & CTA)
  // ---------------------------------------------------------------------------
  const setupWaitlistForm = (formId, inputId, errorId, containerId) => {
    const form = document.getElementById(formId);
    const input = document.getElementById(inputId);
    const errorMsg = document.getElementById(errorId);
    const container = document.getElementById(containerId);
    const submitBtn = form?.querySelector('button[type="submit"]');

    if (!form || !input || !container) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = input.value.trim();

      // Basic validation
      if (!email || !email.includes('@') || !email.includes('.')) {
        if (errorMsg) {
          errorMsg.textContent = 'Please enter a valid email address.';
          errorMsg.style.display = 'block';
        }
        input.focus();
        return;
      }

      if (errorMsg) errorMsg.style.display = 'none';

      // Show button loading spinner
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0077FF" stroke-width="3">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
          </svg>
          <span>Joining...</span>
        `;
      }

      // Simulate quick API dispatch
      setTimeout(() => {
        // Replace form with verified badge
        container.innerHTML = `
          <div class="waitlist-success-badge">
            <div class="icon-circle">✓</div>
            <span>You're on the waitlist! We'll notify you first.</span>
          </div>
        `;

        // Trigger toast
        showToast(`Welcome aboard! ${email} has been added to priority early access.`);
      }, 600);
    });

    // Clear error on input
    input.addEventListener('input', () => {
      if (errorMsg && errorMsg.style.display !== 'none') {
        errorMsg.style.display = 'none';
      }
    });
  };

  setupWaitlistForm('hero-waitlist-form', 'hero-email-input', 'hero-error-msg', 'hero-waitlist-container');
  setupWaitlistForm('cta-waitlist-form', 'cta-email-input', 'cta-error-msg', 'cta-waitlist-container');

  // ---------------------------------------------------------------------------
  // 4. Hero Phones Interactive Hover Showcase
  // ---------------------------------------------------------------------------
  const phoneCards = document.querySelectorAll('.phone-card');
  phoneCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      phoneCards.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  // ---------------------------------------------------------------------------
  // 5. Feature Card 1: Search & Topic Filter Tags
  // ---------------------------------------------------------------------------
  const searchInput = document.getElementById('feature-search-field');
  const tagButtons = document.querySelectorAll('.feature-tag-btn');

  tagButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tag = btn.getAttribute('data-tag');
      const isAlreadyActive = btn.classList.contains('active');

      tagButtons.forEach((b) => b.classList.remove('active'));

      if (!isAlreadyActive) {
        btn.classList.add('active');
        if (searchInput) searchInput.value = tag;
      } else {
        if (searchInput && searchInput.value === tag) {
          searchInput.value = '';
        }
      }
    });
  });

  // ---------------------------------------------------------------------------
  // 6. Global Audio Player Preview & Continue Listening Card Sync
  // ---------------------------------------------------------------------------
  const audioPlayer = document.getElementById('audio-player-preview');
  const continuePlayBtn = document.getElementById('continue-play-btn');
  const continueCoverImg = document.getElementById('continue-cover-img');
  const continuePlayIcon = document.getElementById('continue-play-icon');
  const continueStatusText = document.getElementById('continue-status-text');
  const continueScrubber = document.getElementById('continue-scrubber');
  const continueScrubberFill = document.getElementById('continue-scrubber-fill');

  const playerPlayPauseBtn = document.getElementById('btn-player-play-pause');
  const playerMainPlayIcon = document.getElementById('player-main-play-icon');
  const playerScrubber = document.getElementById('player-scrubber');
  const playerScrubberBar = document.getElementById('player-scrubber-bar');
  const btnPlayerClose = document.getElementById('btn-player-close');
  const btnPlayerLike = document.getElementById('btn-player-like');
  const btnPlayerMute = document.getElementById('btn-player-mute');

  let isPlaying = false;
  let isMuted = false;

  const playIconSVG = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
  const pauseIconSVG = `
    <rect x="5" y="4" width="4" height="16" fill="currentColor"></rect>
    <rect x="15" y="4" width="4" height="16" fill="currentColor"></rect>
  `;

  const updatePlaybackState = (playing) => {
    isPlaying = playing;

    if (continueCoverImg) {
      if (isPlaying) {
        continueCoverImg.style.opacity = '0.35';
      } else {
        continueCoverImg.style.opacity = '1';
      }
    }

    if (continuePlayIcon) {
      continuePlayIcon.innerHTML = isPlaying ? pauseIconSVG : playIconSVG;
    }

    if (continueStatusText) {
      continueStatusText.textContent = isPlaying ? 'Playing' : '8 min left';
    }

    if (playerMainPlayIcon) {
      playerMainPlayIcon.innerHTML = isPlaying ? pauseIconSVG : playIconSVG;
    }
  };

  const togglePlayback = () => {
    // Reveal player if hidden
    if (audioPlayer && !audioPlayer.classList.contains('visible')) {
      audioPlayer.classList.add('visible');
    }
    updatePlaybackState(!isPlaying);
  };

  continuePlayBtn?.addEventListener('click', togglePlayback);
  playerPlayPauseBtn?.addEventListener('click', () => updatePlaybackState(!isPlaying));

  // Scrubbing on Card
  continueScrubber?.addEventListener('click', (e) => {
    const rect = continueScrubber.getBoundingClientRect();
    const percent = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    if (continueScrubberFill) continueScrubberFill.style.width = `${percent}%`;
    if (playerScrubberBar) playerScrubberBar.style.width = `${percent}%`;
  });

  // Scrubbing on Bottom Player
  playerScrubber?.addEventListener('click', (e) => {
    const rect = playerScrubber.getBoundingClientRect();
    const percent = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    if (playerScrubberBar) playerScrubberBar.style.width = `${percent}%`;
    if (continueScrubberFill) continueScrubberFill.style.width = `${percent}%`;
  });

  // Close audio player preview
  btnPlayerClose?.addEventListener('click', () => {
    audioPlayer?.classList.remove('visible');
    updatePlaybackState(false);
  });

  // Like / Save toggle
  btnPlayerLike?.addEventListener('click', () => {
    btnPlayerLike.classList.toggle('liked');
  });

  // Mute toggle
  btnPlayerMute?.addEventListener('click', () => {
    isMuted = !isMuted;
    if (isMuted) {
      btnPlayerMute.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
      `;
    } else {
      btnPlayerMute.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
      `;
    }
  });

  // ---------------------------------------------------------------------------
  // 7. Feature Card 3: Follow Scholar Toggle
  // ---------------------------------------------------------------------------
  const btnFollowScholar = document.getElementById('btn-follow-scholar');
  let isFollowing = true;

  btnFollowScholar?.addEventListener('click', () => {
    isFollowing = !isFollowing;
    if (isFollowing) {
      btnFollowScholar.className = 'btn-follow following';
      btnFollowScholar.textContent = 'Following';
    } else {
      btnFollowScholar.className = 'btn-follow';
      btnFollowScholar.textContent = '+ Follow';
    }
  });

  // ---------------------------------------------------------------------------
  // 8. Feature Card 4: Save Bookmark Toggle
  // ---------------------------------------------------------------------------
  const btnBookmark = document.getElementById('btn-bookmark-toggle');
  btnBookmark?.addEventListener('click', () => {
    const isBookmarked = btnBookmark.classList.toggle('bookmarked');
    btnBookmark.setAttribute('title', isBookmarked ? 'Saved to Library' : 'Save to Library');
  });

  // ---------------------------------------------------------------------------
  // 9. Feature Card 6: Offline Download Simulation
  // ---------------------------------------------------------------------------
  const btnDownloadToggle = document.getElementById('btn-download-toggle');
  let isDownloaded = true;
  let isDownloading = false;

  const downloadIconDownloaded = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  `;

  const downloadIconInitial = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `;

  const downloadSpinner = `
    <div style="width: 18px; height: 18px; border: 2px solid #10B981; border-top-color: transparent; border-radius: 50%;" class="spinner"></div>
  `;

  btnDownloadToggle?.addEventListener('click', () => {
    if (isDownloading) return;

    if (isDownloaded) {
      // Remove download
      isDownloaded = false;
      btnDownloadToggle.className = 'btn-download-toggle';
      btnDownloadToggle.innerHTML = downloadIconInitial;
      btnDownloadToggle.setAttribute('title', 'Download for offline listening');
    } else {
      // Start download
      isDownloading = true;
      btnDownloadToggle.className = 'btn-download-toggle downloading';
      btnDownloadToggle.innerHTML = downloadSpinner;

      setTimeout(() => {
        isDownloading = false;
        isDownloaded = true;
        btnDownloadToggle.className = 'btn-download-toggle downloaded';
        btnDownloadToggle.innerHTML = downloadIconDownloaded;
        btnDownloadToggle.setAttribute('title', 'Downloaded (Click to remove)');
      }, 900);
    }
  });

  // ---------------------------------------------------------------------------
  // 10. Steps Section: Interactive Step Hover
  // ---------------------------------------------------------------------------
  const stepItems = document.querySelectorAll('.step-item');
  stepItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      stepItems.forEach((s) => s.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // ---------------------------------------------------------------------------
  // 11. Dynamic Year in Footer
  // ---------------------------------------------------------------------------
  const currentYearEl = document.getElementById('current-year');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear().toString();
  }
});
