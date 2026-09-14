# RecToom-jeu (game-login branch)

Prototype de jeu Web minimal pour RecToom.

Structure:
- game.html : page d'entrée (login + loading + canvas)
- auth.js : wrapper Firebase (même firebaseConfig que le site)
- game.js : prototype three.js
- style.css : styles

Tester localement:
1. Servir le dossier (ex: `npx http-server . -p 8080`) depuis la racine du repo.
2. Ouvrir http://localhost:8080/game.html
3. Se connecter avec un compte Firebase existant (même projet que le site).

Déploiement GitHub Pages:
- Active GitHub Pages sur la branche `game-login` (ou merge dans main), puis accède à https://<user>.github.io/RecToom-jeu/game.html
