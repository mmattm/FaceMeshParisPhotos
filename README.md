# Soft Photography // Photomaton (Prototype v2)

> **ECAL / University of Art and Design Lausanne** — 2025–2026  
> Real-Time 3D Facial Motion Capture, Topological Retargeting, Autonomous Behavior Engine & Peer-to-Peer WebRTC Display Streaming.

[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r170-black?logo=three.js&logoColor=white)](https://threejs.org/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-FaceLandmarker-0078D4?logo=google&logoColor=white)](https://developers.google.com/mediapipe)
[![WebRTC](https://img.shields.io/badge/WebRTC-Peer--to--Peer-333333?logo=webrtc&logoColor=white)](https://webrtc.org/)
[![Web Audio API](https://img.shields.io/badge/Web_Audio-Lip_Sync-FFA500)](https://developer.mozilla.org/fr/docs/Web/API/Web_Audio_API)

---

## 📖 Présentation du Projet

**Photomaton** est un dispositif artistique interactif explorant la matérialité de l'image photographique à travers le masque numérique et la réincarnation faciale. 

Le système capture en direct les expressions faciales, les micro-mouvements et l'orientation 6-DoF de la tête d'un visiteur à 60 FPS via un modèle d'IA vision par ordinateur (MediaPipe FaceLandmarker). Il compense les mouvements rigides grâce à un système de coordonnées crâniennes local, puis projette des performances faciales enregistrées ou autonomes sur le visage de la personne présente.

Lorsque personne n'est détecté, ou en transition subtile, le masque entre en **Mode Autonome** : il explore l'espace avec des micro-saccades oculaires naturelles, un réflexe vestibulo-oculaire (VOR), des clignements anatomiques complets et joue les cinq animations prédéfinies sans audio du catalogue fourni.

Dès qu'un **Nouveau Visiteur** est détecté (changement biométrique crânien drastique après absence), le système met à jour sa référence faciale, signale l'événement au récepteur **WebRTC** et peut lancer automatiquement un workflow **ComfyUI**. Aucune image visiteur n'est enregistrée.

---

## ✨ Fonctionnalités Majeures

### 1. Suivi & Retargeting Facial 3D Haute Fidélité
- **468 Repères MediaPipe** : Cartographie topologique dense du visage en temps réel.
- **Référentiel Crânien Local Invariant** : Normalisation 3D insensible à la distance de la caméra et aux rotations de la tête.
- **Masque Sculptural 3D** :
  - Yeux 3D avec sclère, iris texturé, pupille et reflet spéculaire (catchlight).
  - Écrêtage au pochoir (*stencil buffer*) : les yeux ne dépassent jamais hors du creux palpébral.
  - Cavité buccale 3D anatomique avec un voile d'obscurcissement à 50% d'opacité (préservant la transparence sur le fond réel).

### 2. Moteur de Comportement & Regard Autonome (`AutonomousGazeEngine`)
- **Regard Vivant & Naturel** : Parcours doux et réaliste du champ de vision sans exagération vers les bords, avec adaptation aux fortes inclinaisons de tête.
- **Clignement Anatomique Complet** : Fermeture douce de l'ensemble de la fente palpébrale et descente du pli orbitaire (sans pincement isolé).
- **Réflexe Vestibulo-Oculaire (VOR)** : Compensation oculaire des mouvements de tête pour fixer un point de curiosité.
- **Alternance Dynamique 50%** : Bascule fluide entre exploration procédurale et jeu de performances enregistrées issues du catalogue d'animations.

### 3. Bibliothèque d'Animations (`AnimationLibrary`)
- **Expressions** : Le curseur en bas règle l’intensité de 50 à 220 %, avec 160 % par défaut. Sourcils, regard et sourire sont renforcés ; 100 % retrouve le rendu sans amplification supplémentaire. Le choix reste mémorisé dans le navigateur. Les fichiers enregistrés et les mouvements de tête restent inchangés, ainsi que l’articulation de la bouche pendant le lipsync.
- **Bibliothèque audio** : Cliquez sur **Audio** en haut pour afficher les pistes de `public/audio/`. **Écouter** permet une préécoute, **Utiliser** sélectionne une piste pour les presets et **Alterner toutes les pistes** réactive la rotation de toute la bibliothèque. La sélection reste mémorisée dans le navigateur. Vous pouvez importer, télécharger ou retirer une piste. Les pistes retirées restent récupérables dans `.audio-trash/`, hors du dossier public.
- **Audio** : Un clic sur **🔇 Audio** en bas active les pistes sélectionnées en test manuel comme en mode autonome. L’audio pilote uniquement le lipsync : les presets d’animation gardent leur durée, leurs mouvements et la pose du visage et du buste, avec le regard autonome aléatoire. Changer de piste ne redémarre pas les gestes. Une courte pause sépare les lectures. Le son s’arrête au retour en Live ou en désactivant le bouton. Le badge **Audio** indique le fichier en cours. La préécoute suspend la piste des presets pour éviter les sons superposés.
- **Décalage audio/lipsync** : La bibliothèque audio propose un délai de 0 à 2 000 ms, mémorisé dans le navigateur. Il retarde le son après les lèvres, sur l’ordinateur comme en WebRTC, sans décaler l’analyse des mouvements. La fin de piste différée est jouée en entier et l’arrêt du mode autonome coupe aussi le son en attente.
- **Hébergement** : La liste audio est intégrée au build pour fonctionner aussi sur un hébergement statique. L’import et le retrait nécessitent le serveur Vite (`npm run dev` ou `npm run preview`).
- **Bouche sans audio** : En l’absence de lecture audio, la bouche suit les expressions et mouvements naturels du preset. La fin de la piste libère immédiatement la bouche, et les gestes continuent pendant la transition de sortie.
- **Articulation de la bouche** : Les animations et le lipsync utilisent une ouverture proportionnelle à la largeur de la bouche, répartie entre les deux lèvres et les tissus voisins jusqu’au menton. Les commissures restent stables pendant l’ouverture et les lèvres s’arrondissent ensemble. L’intensité des expressions renforce les sourires sans amplifier la descente de la lèvre inférieure ni du menton.
- **Son sur le second écran** : La piste est aussi transmise par WebRTC. Sur le récepteur, cliquez sur **Activer le son** pour l’entendre.
- **Catalogue fourni** : Cinq animations prédéfinies sans audio (clin d'œil, étonnement, hochement, regard pensif et sourcils froncés). Les anciennes performances parlées ont été retirées.
- **Enregistrement simple sans audio** : Saisissez éventuellement un nom, démarrez la capture, puis arrêtez-la. La pose de tête et les expressions faciales sont ajoutées directement à la bibliothèque, sans microphone ni donnée Base64.
- **Interface simplifiée** : L'import vidéo, la lecture manuelle en boucle et leurs contrôles audio ont été retirés.
- **Téléchargement & Importation JSON en un clic** : Téléchargez les fichiers `.json` depuis l'interface ou importez un preset existant.
- **Catalogue & Dépôt dédié** : Référentiel complet disponible dans [`library/`](./library/README.md) et [`public/animations/`](./public/animations/).

### 4. Diffusion WebRTC Pure vers Second Écran (`CanvasBroadcaster`)
- **Flux Vidéo Brut sans Interface** : Sortie dédiée carrée `1080×1080` à 30 FPS, sans aucun bouton ni menu dans l'image transmise. Le cadrage utilise un recadrage central sans déformation ni bandes noires et reste indépendant de la taille de la fenêtre opérateur.
- **Serveur de Signalement WebSocket Intégré** : Relais instantané d'offres/réponses SDP et candidats ICE via Vite.
- **Interface Récepteur Plein Écran** : Page dédiée [`receiver.html`](./receiver.html) pour afficher le flux sur une seconde machine via le réseau local avec indicateur de connexion discret.

### Mode optionnel Buste 3D
- **Minimaliste** : Le bouton **⚪ Minimaliste** en bas affiche uniquement les 478 points blancs du FaceMesh sur fond noir, localement et dans la sortie WebRTC. L’image caméra, le buste, la texture, les yeux 3D et la cavité buccale sont masqués ; le suivi, la capture de référence et les animations restent actifs. Le buste est indisponible pendant ce mode et retrouve son état prévu à la désactivation. Ce mode peut servir pendant l’attente d’une image ComfyUI ; son activation et sa désactivation sont manuelles pour l’instant.
- Le mode **Buste 3D** s’active automatiquement en Autonome et se désactive au retour en Live. Le bouton **Buste 3D** permet aussi de tester manuellement cet affichage, avec un modèle OBJ comprenant le crâne, le cou et les épaules derrière le masque photo.
- **Cliché requis** : Le mode autonome et les tests d’animations sont désactivés tant qu’aucun cliché FaceMesh du visiteur actuel n’est mémorisé. Une ancienne référence archivée ne suffit pas à les activer pour un nouveau visiteur.
- Le mode utilise `public/models/male_facemesh_zone_creusee.obj`.
- Le panneau **FaceMesh** ajuste le visage dans le mode actif, indiqué en haut du panneau : **Mode normal** pour l’aligner sur l’image caméra, ou **Buste 3D** pour l’aligner sur le buste. Ouvrir ce panneau conserve le mode courant. Chaque mode dispose de sa position, sa taille et ses inclinaisons (haut/bas, gauche/droite et roulis en degrés), mémorisées séparément dans ce navigateur avec **Save**. Les inclinaisons pivotent autour du milieu des yeux et suivent l’orientation de la tête. Les anciens réglages du buste sont conservés. Par défaut, le mode normal reste neutre (`x/y/z: 0`, taille `100 %`, angles `0°`) ; le buste garde `x: 0`, `y: -16.5`, `z: -9` (en % de l’écart entre les yeux), taille `95.5 %`, angles `0°`. **Réinitialiser** rétablit les valeurs par défaut du mode actif ; cliquez ensuite sur **Save** pour les conserver.
- En mode autonome, la tête explore librement les deux côtés et varie son inclinaison, y compris pendant les presets ; les gestes des animations s’ajoutent à ce mouvement avec des transitions fluides.
- Le rendu autonome agrandit l’ensemble visage et buste de 25 %, avec une transition progressive à l’entrée et au retour en Live. Cet agrandissement apparaît aussi dans la sortie WebRTC.
- Le buste suit automatiquement la position, l'échelle et la rotation du visage en Live comme en mode Autonome, et apparaît également dans la sortie WebRTC. Lorsqu'il est actif, l'image webcam complète est masquée : elle continue uniquement d'alimenter la texture photo du masque, affiché avec le buste sur fond noir.

### 5. Détecteur Biométrique de Nouveau Visiteur (`VisitorDetector`)
- **ID de session visiteur** : Affiché en version courte en haut, à côté de `STATE`. Cliquez dessus pour copier l’ID complet, également disponible au survol, dans la console et dans les alertes WebRTC (`visitorId`). Il reste identique pendant la session et le mode autonome ; une nouvelle détection ou le bouton **Test visiteur** génère un nouvel ID aléatoire. Il ne constitue pas une identité permanente pour reconnaître une personne lors de visites ultérieures.
- **Condition sine qua non d'absence** : Nécessite une perte de tracking préalable $\ge 1,5$ s pour éviter tout faux positif pendant qu'une personne est active devant la caméra.
- **Double analyse morphométrique crânienne** : Écart géométrique crânien $\Delta_{\text{morph}} \ge 0.16$ et dissimilarité globale $\ge 0.20$ confirmée sur 6 images consécutives.
- **Tampon de Texture Frontale Idéale (`FaceTextureHistoryBuffer`)** : Retient automatiquement l'image où le visage était le plus net, frontal et centré (au moins 2 secondes avant la perte de suivi) pour servir de texture de référence.
- **Capture dès l’alignement** : Le premier cliché qui passe les contrôles de cadrage, d’alignement, de stabilité, d’yeux ouverts et de bouche au repos est mémorisé immédiatement, sans attendre plusieurs images ou un score élevé. Il est remplacé dès qu’un meilleur candidat arrive. Au départ, le FaceMesh reprend une image déjà mémorisée, sans refaire de capture webcam.
- **Axe du visage obligatoire** : Toutes les captures, y compris celles de secours, exigent une orientation connue à ±10° maximum horizontalement/verticalement et une inclinaison latérale à ±6° maximum. Sinon, la capture attend que le visage revienne dans l’axe.

---

## 📁 Architecture du Codebase

```
prototype_v2/
├── index.html                   # Interface opérateur principale (Studio & Paramétrage)
├── receiver.html                # Interface plein écran WebRTC pour 2e ordinateur
├── vite.config.js               # Serveur Vite, API TTS, Animations, ComfyUI & Signalement WebRTC
├── package.json                 # Dépendances (Three.js, MediaPipe, Kokoro, WS)
│
├── library/                     # 📂 DÉPÔT DU CATALOGUE D'ANIMATIONS
│   ├── README.md                # Documentation complète de la bibliothèque d'animations
│   └── manifest.json            # Index structuré des animations avec métadonnées & liens
├── comfyWorkflow/               # Workflows ComfyUI au format API JSON
│
├── public/
│   ├── animations/              # Fichiers d'animations .json (servis sous /animations/)
│   │   └── preset_*.json
│   ├── models/                  # Modèle MediaPipe FaceLandmarker Task
│   └── wasm/                    # Binaires WebAssembly MediaPipe
│
└── src/
    ├── main.js                  # Chef d'orchestre de l'application & machine d'états
    │
    ├── core/
    │   ├── camera.js            # Capture vidéo webcam 720p 60 FPS
    │   ├── tracker.js           # Détecteur MediaPipe FaceLandmarker avec lissage 1€
    │   ├── renderer.js          # Rendu Three.js (Masque 3D, Stencil Yeux, Cavité Buccale)
    │   ├── autonomousGazeEngine.js # Moteur de comportement, regard, VOR & clignements
    │   ├── animationLibrary.js  # Gestionnaire de chargement / sauvegarde d'animations
    │   ├── visitorDetector.js   # Détection biométrique crânienne de nouveau visiteur
    │   ├── faceTextureHistoryBuffer.js # Tampon d'image frontale idéale sans obstruction
    │   └── triangulation.js     # Topologie canonique du maillage facial 3D
    │
    ├── webrtc/
    │   └── canvasBroadcaster.js # Capture canvas et diffusion WebRTC multi-pairs
    │
    ├── mocap/
    │   ├── cranialCoordinateSystem.js # Coordonnées crâniennes 3D invariantes
    │   ├── expressionLooper.js        # Lecture et retargeting de performances importées
    │   ├── motionPresetRecorder.js    # Capture simple de presets de mouvement sans audio
    │   └── autoCalibrator.js          # Calibrateur automatique de blendshapes
    │
    └── styles/
        └── main.css             # Design system sombre, moderne et ultra-responsive
```

---

## 🚀 Installation & Démarrage Rapide

### Prérequis
- [Node.js](https://nodejs.org/) (version 18 ou supérieure recommandée).
- Une webcam fonctionnelle compatible 720p/1080p.
- Un navigateur moderne supportant WebGL 2, Web Audio et WebRTC (Chrome, Edge, Safari, Firefox).

### 1. Installation des dépendances
```bash
npm install
```

### 2. Lancement du serveur de développement
```bash
npm run dev
```
Par défaut, Vite écoute sur le port `5173` ou `5174` et ouvre l'accès sur le réseau local (`host: true`) :
```
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.xxx:5173/
```

### 3. Compilation pour la production
```bash
npm run build
```
Les bundles optimisés pour `index.html` et `receiver.html` sont générés dans le dossier `dist/`.

---

## 🖥️ Mode d'Emploi

### 1. Poste Opérateur Principal (`index.html`)
- Ouvrez `http://localhost:5173/` sur l'ordinateur équipé de la caméra.
- L'interface affiche le flux vidéo en direct avec le masque 3D superposé.
- **Indicateur Animation** : Affiche le preset en cours ou « Regard autonome ». Un clic ouvre la bibliothèque, où le preset actif est surligné avec la mention « En cours ».
- **Enregistrer un preset** : Donnez éventuellement un nom, cliquez sur `● Enregistrer un preset`, jouez le mouvement, puis cliquez sur `■ Arrêter et ajouter`. Le preset apparaît immédiatement dans la bibliothèque et ne contient aucun audio.
- **Bouton 🎬 BIBLIOTHÈQUE** : Ouvrez la fenêtre d'animations pour :
  - Tester immédiatement une animation (`▶ Tester`).
  - Télécharger son fichier JSON (`⬇`).
  - Importer un nouveau fichier `.json` (`📥 Importer`).
  - Activer/Désactiver la lecture aléatoire à 50% en mode autonome.
- **Sensibilité Visiteur** : Ajuste le seuil utilisé pour reconnaître l'arrivée d'une nouvelle personne.
- **Indicateur WebRTC** : Affiche le statut de connexion du second écran (`WebRTC: En attente` ou `WebRTC: 1 ordi connecté`).
- **Réglages ComfyUI** : Le bouton `⚙ ComfyUI` permet de saisir l'adresse de l'instance, choisir un JSON placé dans `comfyWorkflow/`, tester la connexion, exécuter le workflow immédiatement et activer son lancement automatique lors d'un nouveau visiteur.
- **Align 3D — Save** : Mémorise la position X/Y, les trois angles et le zoom dans ce navigateur, puis les restaure au rechargement. Les ajustements restent temporaires jusqu’au clic sur **Save**, y compris **Tout réinitialiser** : cliquez sur **Save** après la remise à zéro pour la conserver.

### 2. Second Ordinateur Récepteur (`receiver.html`)
- Sur un second ordinateur connecté au même réseau Wi-Fi/LAN, ouvrez :
  ```
  http://<IP_DU_PREMIER_ORDI>:5173/receiver.html
  ```
- La page négocie automatiquement la connexion WebRTC avec l'ordinateur principal.
- Elle affiche **uniquement le flux vidéo du canvas 3D** (sans interface), en plein écran.
- Appuyez sur la touche `F` pour basculer en plein écran natif sans bordures.
- Lorsqu'un nouveau visiteur arrive devant la caméra principale, une bordure verte pulse subtilement sur le second écran pour le signaler. Le récepteur ne capture et ne sauvegarde aucune image.

### 3. ComfyUI

1. Dans ComfyUI, activez le mode développeur et exportez votre workflow avec **Save (API Format)**.
2. Placez le fichier `.json` dans `comfyWorkflow/`.
3. Dans l'application, ouvrez `⚙ ComfyUI`, entrez par exemple `http://192.168.1.50:8188`, choisissez le workflow et testez la connexion.
4. Activez **Exécuter au nouveau visiteur**, puis enregistrez.

Le serveur Photomaton transmet le workflow à `/prompt` uniquement lorsqu’un cliché FaceMesh du visiteur actuel est mémorisé, et au plus tôt une seconde après sa détection. Si la capture arrive plus tard, l’envoi attend cette capture. Une nouvelle détection remplace l’attente précédente. Le lancement manuel exige aussi un cliché mémorisé. Le workflow doit être autonome : aucune capture webcam n'est injectée automatiquement.

---

## 📦 Bibliothèque d'Animations

Le projet intègre un système complet d'import/export de performances faciales. Vous pouvez télécharger des animations existantes ou partager les vôtres.

Pour explorer les animations disponibles, leurs métadonnées et le schéma de données :
👉 **Consultez [`library/README.md`](./library/README.md)**  
👉 **Consultez [`library/manifest.json`](./library/manifest.json)**

---

## 👥 Auteur & Crédits

- **Projet** : Photomaton // Soft Photography (2025–2026)
- **Institution** : ECAL (École cantonale d'art de Lausanne)
- **Auteur** : Jamy Herrmann
- **Technologies** : Three.js, MediaPipe Vision Tasks, Kokoro TTS ONNX, WebRTC, Vite.
