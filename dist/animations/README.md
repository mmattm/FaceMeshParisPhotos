# Public Animations Storage

Ce répertoire stocke les fichiers d'animation faciale `.json` du Photomaton. Le catalogue fourni contient cinq presets sans audio. Les trois anciennes animations parlées avec audio Base64 ont été supprimées.

L'ancien enregistrement webcam/micro a été retiré. Un enregistreur simplifié capture uniquement les mouvements de tête et les expressions faciales, sans ouvrir le microphone ni stocker d'audio. L'import JSON reste disponible ; l'import vidéo et la lecture manuelle en boucle ont été retirés.

Les fichiers de ce dossier sont automatiquement :
1. Détectés et chargés en mémoire par [`AnimationLibrary`](../../src/core/animationLibrary.js).
2. Servis publiquement sous l'URL relative `/animations/<nom_du_fichier>.json`.
3. Lus aléatoirement (~50% de probabilité) par le moteur de comportement en **Mode Autonome**.

Consultez le catalogue détaillé, les spécifications du format et les instructions de téléchargement dans :
👉 **[`library/README.md`](../../library/README.md)**
👉 **[`library/manifest.json`](../../library/manifest.json)**
