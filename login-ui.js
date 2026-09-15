// login-ui.js — improved debugging, safe checks and fallbacks
document.addEventListener('DOMContentLoaded', () => {
  const playBtn = document.getElementById('play-btn');
  const muteBtn = document.getElementById('mute-btn');
  const themeAudio = document.getElementById('theme-audio');
  const introAudio = document.getElementById('intro-audio');

  console.log('login-ui initialized', {
    playBtnExists: !!playBtn,
    muteBtnExists: !!muteBtn,
    themeAudioSrc: themeAudio?.src || null,
    introAudioSrc: introAudio?.src || null,
    loginBackgroundPath: getComputedStyle(document.documentElement).getPropertyValue('--dummy') // noop
  });

  const ttsMessage = "Bienvenue dans RecToom. Connecte‑toi et clique sur Jouer pour entrer dans l'espace. Bon jeu!";

  async function playIntroThenTheme() {
    try {
      console.log('playIntroThenTheme start', { introAvailable: !!(introAudio && introAudio.src), themeAvailable: !!(themeAudio && themeAudio.src) });

      if (introAudio && introAudio.src && introAudio.src.indexOf('undefined') === -1) {
        try {
          await introAudio.play();
          console.log('introAudio played');
          introAudio.onended = async () => {
            if (themeAudio) {
              themeAudio.volume = 0.7;
              await themeAudio.play().catch(e => console.warn('themeAudio play after intro failed', e));
            }
          };
        } catch (err) {
          console.warn('introAudio play() rejected or failed', err);
          // fallback to TTS then theme
          await ttsThenTheme();
        }
      } else {
        await ttsThenTheme();
      }
    } catch (err) {
      console.error('Error in playIntroThenTheme', err);
    }
  }

  async function ttsThenTheme() {
    try {
      if ('speechSynthesis' in window) {
        console.log('Using speechSynthesis fallback');
        await new Promise((resolve) => {
          const ut = new SpeechSynthesisUtterance(ttsMessage);
          ut.lang = 'fr-FR';
          ut.onend = resolve;
          try { speechSynthesis.speak(ut); } catch(e) { console.warn('speechSynthesis speak error', e); resolve(); }
          // safety timeout
          setTimeout(resolve, 6000);
        });
      } else {
        console.log('No speechSynthesis available');
      }
      if (themeAudio) {
        themeAudio.volume = 0.7;
        await themeAudio.play().catch(e => console.warn('themeAudio play failed', e));
      }
    } catch (err) {
      console.error('ttsThenTheme error', err);
    }
  }

  if (!playBtn) {
    console.error('Play button not found — login UI elements may be missing.');
    return;
  }

  playBtn.addEventListener('click', async () => {
    console.log('Play clicked');
    // log network / element state for debugging
    if (introAudio) console.log('introAudio.src ->', introAudio.src);
    if (themeAudio) console.log('themeAudio.src ->', themeAudio.src);

    try {
      await playIntroThenTheme();
    } catch (err) {
      console.error('Unhandled error during play flow', err);
    }

    const card = document.querySelector('.login-card');
    if (card) card.style.display = 'none';

    // If startGame is defined, call it. Otherwise reveal background/canvas so errors are visible.
    if (typeof startGame === 'function') {
      try {
        startGame();
        console.log('startGame() called');
      } catch (e) {
        console.error('startGame error:', e);
        revealBehind();
      }
    } else {
      console.warn('startGame not defined — game.js may be missing or errored');
      revealBehind();
    }
  });

  muteBtn?.addEventListener('click', () => {
    const muted = !(themeAudio?.muted);
    if (themeAudio) themeAudio.muted = muted;
    if (introAudio) introAudio.muted = muted;
    muteBtn.setAttribute('aria-pressed', String(muted));
    muteBtn.textContent = muted ? '🔇' : '🔊';
    console.log('Mute toggled', { muted });
  });

  function revealBehind() {
    // lower overlays so canvas / scene behind can be seen for debugging
    document.querySelector('.login-bg')?.classList.add('login-hidden-overlay');
    document.querySelector('.login-overlay')?.classList.add('login-hidden-overlay');
    console.log('Revealed content behind login overlays');
  }
});
