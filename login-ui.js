// login-ui.js — handles intro TTS/audio and shows/hides the login card
document.addEventListener('DOMContentLoaded', () => {
  const playBtn = document.getElementById('play-btn');
  const muteBtn = document.getElementById('mute-btn');
  const themeAudio = document.getElementById('theme-audio');
  const introAudio = document.getElementById('intro-audio');

  const ttsMessage = "Bienvenue dans RecToom. Connecte‑toi et clique sur Jouer pour entrer dans l'espace. Bon jeu!";

  async function playIntroThenTheme() {
    try {
      if (introAudio && introAudio.src && !introAudio.src.endsWith('undefined')) {
        await introAudio.play();
        introAudio.onended = async () => {
          themeAudio.volume = 0.7;
          await themeAudio.play().catch(()=>{});
        };
      } else {
        if ('speechSynthesis' in window) {
          await new Promise((resolve) => {
            const ut = new SpeechSynthesisUtterance(ttsMessage);
            ut.lang = 'fr-FR';
            ut.onend = resolve;
            speechSynthesis.speak(ut);
            setTimeout(resolve, 8000);
          });
        }
        themeAudio.volume = 0.7;
        await themeAudio.play().catch(()=>{});
      }
    } catch (err) {
      console.warn('Erreur lecture audio/TTS:', err);
    }
  }

  playBtn.addEventListener('click', async () => {
    await playIntroThenTheme();
    const card = document.querySelector('.login-card');
    if (card) card.style.display = 'none';
    // startGame may be defined in game.js; call it if available
    if (typeof startGame === 'function') {
      try { startGame(); } catch(e) { console.warn('startGame error:', e); }
    }
  });

  muteBtn.addEventListener('click', () => {
    const muted = !themeAudio.muted;
    themeAudio.muted = muted;
    if (introAudio) introAudio.muted = muted;
    muteBtn.setAttribute('aria-pressed', String(muted));
    muteBtn.textContent = muted ? '🔇' : '🔊';
  });
});
