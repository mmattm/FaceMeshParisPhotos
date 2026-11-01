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

Quand le suivi disparaît, le visage passe en **Mode Autonome** : il joue uniquement les presets manuels enregistrés ou importés. La position, la rotation et les expressions rejoignent le preset en une demi-seconde ; les enchaînements entre lectures sont également lissés. Sans preset manuel disponible, le visage conserve sa dernière pose. Aucun mouvement de regard, clignement ou expression n’est généré automatiquement.

Dès le premier visage, puis au retour après au moins **3 secondes sans visage détecté**, une nouvelle visite démarre, même si la même personne revient. Le délai est réglable de 1 à 10 secondes avec **Absence visiteur**. Aucune comparaison de visages n'est effectuée. Le système met à jour sa référence faciale, signale l'événement au récepteur **WebRTC** et peut lancer automatiquement un workflow **ComfyUI**. Sortir du carré de sortie ou forcer le mode autonome ne compte pas comme une absence tant que la webcam détecte encore le visage.

---

## ✨ Fonctionnalités Majeures

### 1. Visage Face Cap et caméra frontale (branche expérimentale)
- Le modèle `public/models/facecap.glb` de l’[exemple three.js](https://threejs.org/examples/webgl_morphtargets_webcam.html) remplace le buste et l’ancien masque calculé à partir des landmarks.
- Les expressions MediaPipe pilotent les morph targets du modèle. Ses yeux texturés et ses dents sont conservés ; aucun œil ou intérieur de bouche supplémentaire n’est généré.
- **Intensité** : le slider règle les expressions de 0 à 300 % en Live, dans les presets et avec le lipsync audio, dans tous les affichages. 100 % correspond à l’intensité normale ; ↺ revient à 100 %. Les clignements et plissements des yeux restent indépendants du slider, même à 0 %, tandis que l’ouverture des yeux peut être amplifiée, avec une ouverture maximale légèrement renforcée de 10 %. La fin du clignement est renforcée pour atteindre une fermeture complète dès un score de 0,6 ; l’ouverture est atténuée pendant le clignement pour ne pas contrarier la paupière. Le réglage est mémorisé et ne modifie ni la pose, ni la direction du regard, ni les enregistrements.
- **Angle vertical** : correction manuelle de −45° à +45°, enregistrée automatiquement dans le navigateur ; ↺ revient à 0°. Elle incline le visage autour de son centre dans tous les affichages, en Live comme en autonome, y compris les presets et Minimaliste, en Tracking comme en Locked. Les données enregistrées gardent leur pose originale et les transitions restent lissées. L’ancien réglage mémorisé est conservé.
- **Réglages fins** : le bouton **Réglages** regroupe uniquement les sliders : zoom, rotation maximale, intensité, angle vertical, absence visiteur et délai audio. Les boutons d’affichage, bibliothèques, Autonome, ComfyUI, audio et OSC restent directement accessibles sur la vue principale.
- **Rotation max** : limite l’angle total de rotation par rapport à la position frontale, dans toutes les directions, en Live, dans les presets et en Minimaliste. De 0° (orientation frontale fixe) à 180° (**Libre**, valeur initiale et remise à zéro via ↺). Le réglage est mémorisé ; la position, le zoom, les expressions et les enregistrements restent indépendants. La limite s’applique aussi pendant les raccords entre modes et entre presets.
- **Zoom FaceMesh** : de 50 à 200 %, mémorisé dans le navigateur, avec retour à 100 % via ↺. Il agrandit le visage autour de son centre dans tous les affichages, y compris Minimaliste, en Tracking comme en Locked et en Live comme dans les presets. Il ne modifie ni la caméra, ni le fond webcam, ni les enregistrements.
- La caméra perspective reste à l’origine, orientée vers −Z, avec un champ vertical de 63°. La matrice de pose MediaPipe est appliquée directement. La scène entière est réfléchie pour l’affichage selfie.
- La photo du visiteur est transférée sur la peau par les triangles du visage canonique. Les UV du cliché restent attachés au modèle pendant les expressions, en Live comme en Autonome.
- **Tracking / Locked** : choix commun aux rendus avec photo, sans texture et Minimaliste, en Live, Autonome et lecture de presets. Tracking conserve la position et la distance suivies ou enregistrées ; Locked fixe le visage au centre avec un cadrage rapproché identique dans tous les affichages, tout en gardant rotations et expressions. La webcam de fond est masquée en Locked. Le choix est mémorisé dans le navigateur, avec Tracking par défaut. Les enregistrements gardent toujours la pose réelle.
- Le bouton **Webcam** affiche ou masque la vidéo de fond en Live. **Expressions** ouvre les valeurs des morph targets. **Sans texture**, actif par défaut, affiche les normales colorées du visage avec des sourcils sombres attachés à la peau et aux morph targets pour mieux lire leurs mouvements, en Live comme en Autonome ; un second clic restaure la photo. Les anciens profils Align 3D ne sont plus utilisés.
- Les ressources du modèle et le décodeur KTX2 des yeux sont locaux (`public/models/facecap.glb`, `public/wasm/basis/`).

### 2. Lecture autonome des presets manuels (`AutonomousGazeEngine`)
- À la perte du suivi, les presets manuels sont lus sans ajouter de mouvements procéduraux.
- Un raccord **ease-in-out de 0,5 seconde** lisse pose et expressions à l’entrée, au retour vers le suivi Live et entre les lectures. À l’entrée depuis le Live, le visage rejoint la première image du preset avant que sa lecture commence : la bouche ne passe pas par une expression neutre intermédiaire. Entre presets et à chaque reprise de boucle, le preset suivant avance pendant le fondu, sans pause sur sa première pose. En Locked, le visage reste centré pendant tout le raccord.
- Les performances s’enchaînent ; si plusieurs sont disponibles, la sélection évite de répéter immédiatement la même.
- Une bibliothèque vide reste vide. Sans preset, ou si leur lecture automatique est désactivée, la dernière pose est conservée.
- Au retour d’un visage, la pose et les expressions rejoignent le suivi Live en une demi-seconde, puis le suivi reste brut sans lissage supplémentaire.

### 3. Bibliothèque d'Animations (`AnimationLibrary`)
- **Catalogue manuel** : seuls les presets enregistrés ou importés avec une pose métrique sont lus automatiquement. Ouvrir **Animation** puis **▶ Tester** pour une lecture manuelle. Désactiver **Autonome** pour reprendre le Live.
- **Protection des pertes de suivi** : Les changements brusques de pose non confirmés sont écartés avant l’affichage et l’enregistrement, notamment lorsqu’une main masque la webcam. La transition autonome part ainsi de la dernière pose fiable. Une vraie rotation rapide est acceptée après une courte confirmation.
- **Live direct** : Les scores MediaPipe et la matrice de pose sont appliqués tels quels au modèle Face Cap, comme dans l’exemple three.js. L’ancien calibrateur (gains/gamma), l’amplification des expressions, les déformations et les transitions de landmarks ne participent plus au Live. Le suivi reste Live partout dans l’image webcam ; le recadrage OBS ne déclenche pas de mouvement autonome.
- **Bibliothèque audio** : Cliquez sur **Audio** en haut pour afficher les pistes de `public/audio/`. **Écouter** permet une préécoute, **Utiliser** sélectionne une piste pour les presets et **Alterner toutes les pistes** réactive la rotation de toute la bibliothèque. La sélection reste mémorisée dans le navigateur. Vous pouvez importer, télécharger ou retirer une piste. Les pistes retirées restent récupérables dans `.audio-trash/`, hors du dossier public.
- **Audio** : Un clic sur **🔇 Audio** en bas active les pistes sélectionnées en test manuel comme en mode autonome. L’audio pilote uniquement le lipsync : les presets d’animation gardent leur durée, leurs mouvements et la pose du visage, avec le regard défini par le preset Face Cap. Changer de piste ne redémarre pas les gestes. Une courte pause sépare les lectures. Le son s’arrête au retour en Live ou en désactivant le bouton. Le badge **Audio** indique le fichier en cours. La préécoute suspend la piste des presets pour éviter les sons superposés.
- **Décalage audio/lipsync** : La fenêtre **Réglages** propose un délai de 0 à 3 000 ms, mémorisé dans le navigateur. Il retarde le son après les lèvres, sur l’ordinateur comme en WebRTC, sans décaler l’analyse des mouvements. La fin de piste différée est jouée en entier et l’arrêt du mode autonome coupe aussi le son en attente.
- **Hébergement** : La liste audio est intégrée au build pour fonctionner aussi sur un hébergement statique. L’import et le retrait nécessitent le serveur Vite (`npm run dev` ou `npm run preview`).
- **Bouche sans audio** : En l’absence de lecture audio, la bouche suit les expressions et mouvements naturels du preset. La fin de la piste libère immédiatement la bouche, et les gestes continuent pendant la transition de sortie.
- **Articulation audio** : Le volume de la voix pilote une ouverture de mâchoire modérée et lissée sur le modèle Face Cap. Pendant la piste, les levées, pincements, étirements et arrondis des lèvres sont neutralisés pour éviter leur cumul avec le preset. Les sourires, les autres expressions et les mouvements de tête restent ceux du preset ; sans audio, la bouche enregistrée est restituée entièrement.
- **Son sur le second écran** : La piste est aussi transmise par WebRTC. Sur le récepteur, cliquez sur **Activer le son** pour l’entendre.
- **Catalogue fourni** : Cinq animations prédéfinies sans audio (clin d'œil, étonnement, hochement, regard pensif et sourcils froncés). Les anciennes performances parlées ont été retirées.
- **Enregistrement simple sans audio** : Saisissez éventuellement un nom, démarrez la capture, puis arrêtez-la. La pose de tête et les expressions faciales sont ajoutées directement à la bibliothèque, sans microphone ni donnée Base64.
- **Interface simplifiée** : L'import vidéo, la lecture manuelle en boucle et leurs contrôles audio ont été retirés.
- **Téléchargement & Importation JSON en un clic** : Téléchargez les fichiers `.json` depuis l'interface ou importez un preset existant.
- **Catalogue & Dépôt dédié** : Référentiel complet disponible dans [`library/`](./library/README.md) et [`public/animations/`](./public/animations/).

### 4. Diffusion WebRTC Pure vers Second Écran (`CanvasBroadcaster`)
- **Flux Vidéo Brut sans Interface** : Sortie dédiée carrée `1080×1080` à 30 FPS, sans aucun bouton ni menu dans l'image transmise. Le cadrage utilise un recadrage central sans déformation ni bandes noires et reste indépendant de la taille de la fenêtre opérateur.
- **Serveur de Signalement WebSocket Intégré** : Relais instantané d'offres/réponses SDP et candidats ICE via Vite.
- **Interface Récepteur Plein Écran** : Page dédiée [`receiver.html`](./receiver.html) pour afficher le flux sur une demi-seconde machine via le réseau local avec indicateur de connexion discret.

### Affichage Face Cap
Le rendu 3D Live et Autonome utilise le même modèle, ses mêmes yeux et ses mêmes dents.
La source de texture est la webcam, le meilleur cliché mémorisé ou la photo de secours.
Le mode **Minimaliste** affiche 478 points ronds blancs de 4 pixels sur fond noir. En Live, les positions viennent directement de MediaPipe, iris compris. En autonome, les points sont répartis sur l’avant du visage uniquement, avec une densité renforcée sur les contours des yeux et des lèvres pour mieux lire les expressions. Ils suivent les poses et expressions des presets, y compris le lipsync audio ; il ne s’agit alors pas d’une détection caméra. Les presets existants restent compatibles. Les changements de forme et de pose sont raccordés par un ease-in-out de 0,5 seconde dans les deux sens. Sans preset disponible, la dernière forme affichée est conservée. Tracking / Locked, zoom, limite de rotation et correction d’angle restent disponibles. Un seul bouton **Minimaliste** permet d’activer ou quitter cet affichage.
La sortie opérateur et WebRTC utilise le même canvas, avec un cadrage carré pour OBS.

### 5. Détecteur de nouvelle visite (`VisitorDetector`)
- **ID de session visiteur** : Affiché en version courte en haut, à côté de `STATE`. Cliquez dessus pour copier l’ID complet, également disponible au survol, dans la console et dans les alertes WebRTC (`visitorId`). Il reste identique pendant la session et le mode autonome ; une nouvelle détection ou le bouton **Test visiteur** génère un nouvel ID aléatoire. Il ne constitue pas une identité permanente pour reconnaître une personne lors de visites ultérieures.
- **Absence** : Une nouvelle visite commence au retour après le délai configuré (3 secondes par défaut). Aucune comparaison biométrique entre personnes.
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
│   └── wasm/                    # MediaPipe et décodeur KTX2 Basis pour les yeux
│
└── src/
    ├── main.js                  # Chef d'orchestre de l'application & machine d'états
    │
    ├── core/
    │   ├── camera.js            # Capture vidéo webcam 720p 60 FPS
    │   ├── tracker.js           # Détecteur MediaPipe FaceLandmarker, sortie brute en Live
    │   ├── renderer.js          # Face Cap, caméra fixe, webcam et texture photo
    │   ├── autonomousGazeEngine.js # Lecture des presets manuels et maintien de pose
    │   ├── animationLibrary.js  # Gestionnaire de chargement / sauvegarde d'animations
    │   ├── visitorDetector.js   # Nouvelle visite au retour après absence
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
- **Indicateur Animation** : Affiche le preset en cours ou « En attente de preset manuel ». Un clic ouvre la bibliothèque, où le preset actif est surligné avec la mention « En cours ».
- **Enregistrer un preset** : Donnez éventuellement un nom, cliquez sur `● Enregistrer un preset`, jouez le mouvement, puis cliquez sur `■ Arrêter et ajouter`. Le preset conserve les expressions brutes, la rotation et la position 3D complète (matrice MediaPipe) sans audio. La lecture restitue les translations X/Y/Z et la distance, y compris pour les anciens presets enregistrés qui possèdent déjà ces coordonnées. Le choix Locked recentre le rendu dans tous les affichages sans modifier les données enregistrées.
- **Bouton 🎬 BIBLIOTHÈQUE** : Ouvrez la fenêtre d'animations pour :
  - Tester immédiatement une animation (`▶ Tester`).
  - Télécharger son fichier JSON (`⬇`).
  - Importer un nouveau fichier `.json` (`📥 Importer`).
  - Activer/Désactiver la lecture des presets manuels en mode autonome.
- **Sensibilité Visiteur** : Ajuste le seuil utilisé pour reconnaître l'arrivée d'une nouvelle personne.
- **Indicateur WebRTC** : Affiche le statut de connexion du second écran (`WebRTC: En attente` ou `WebRTC: 1 ordi connecté`).
- **Réglages ComfyUI** : Le bouton `⚙ ComfyUI` permet de saisir l'adresse de l'instance, choisir un JSON placé dans `comfyWorkflow/`, tester la connexion, exécuter le workflow immédiatement et activer son lancement automatique lors d'un nouveau visiteur.
- **Webcam / Expressions** : Affichez la vidéo de fond ou inspectez les morph targets Face Cap. La caméra reste fixe.

### TouchDesigner : nouveau visiteur sur PC 2

Le serveur de développement envoie un message OSC UDP `/newVisitor` avec la
valeur entière `1` à chaque activation du mode Minimaliste, vers **PC 2 : `192.168.50.2:9000`**.
Le récepteur VIDEO OUT n'a pas besoin d'être ouvert. Le bouton **Test OSC**
envoie uniquement ce signal. Une détection visiteur seule ne l'envoie pas :
l'activation de Minimaliste au démarrage de la génération le déclenche.
À la fin réussie du rendu ComfyUI, `/generationDone 1` est envoyé à la même destination.

Un nouveau visiteur remplace les demandes ComfyUI précédentes de l'application :
les prompts en attente sont supprimés et le prompt en cours est interrompu par son
identifiant. La nouvelle génération attend la confirmation de cet arrêt. Les
anciens rendus ne déclenchent plus `/generationDone`. Les tâches d'autres
applications ne sont pas supprimées. Le suivi des identifiants dure pendant la
session du serveur ; les tâches lancées avant son redémarrage ne sont pas suivies.

Sur PC 2, créer un
**OSC In CHOP** dans TouchDesigner : **Network Port = 9000**, **Active = On**,
**Pulse Mode = On** pour obtenir une impulsion par visiteur. Autoriser UDP 9000
dans le pare-feu de PC 2 si nécessaire.

Pour une destination fixe sans récepteur ouvert, définir `TD_OSC_HOST` (IP de
PC 2) et éventuellement `TD_OSC_PORT` avant de lancer `npm run dev`.
L'envoi UDP ne confirme pas la réception par TouchDesigner.

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

Le serveur Photomaton transmet le workflow à `/prompt` uniquement lorsqu’un cliché FaceMesh du visiteur actuel est mémorisé, et au plus tôt une demi-seconde après sa détection. Si la capture arrive plus tard, l’envoi attend cette capture. Une nouvelle détection remplace l’attente précédente. Le lancement manuel exige aussi un cliché mémorisé. Le workflow doit être autonome : aucune capture webcam n'est injectée automatiquement.

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
- **Modèle Face Cap** : [Face Cap / bannaflak](https://www.bannaflak.com/face-cap), distribué dans les exemples three.js.
- **Technologies** : Three.js, MediaPipe Vision Tasks, Kokoro TTS ONNX, WebRTC, Vite.


### Sortie vid?o propre dans OBS ? NDI ? TouchDesigner

1. Garder l?application ouverte sur l?ordinateur 1, avec le serveur de d?veloppement actif.
2. Sur ce m?me ordinateur, ajouter une source **Navigateur** dans OBS avec l?URL `http://127.0.0.1:5173/receiver.html?output=obs` (adapter le port ? celui de l?application).
3. R?gler la source sur **1080 ? 1080**, ? **30 FPS**. D?sactiver la fermeture de la source lorsqu?elle n?est pas visible pour garder la connexion active.
4. La source contient uniquement la vid?o : aucun contr?le, message d?attente ou indicateur de connexion. Sans flux, elle reste noire. Aucune deuxi?me fen?tre de navigateur n?est n?cessaire. La source est muette.
5. Installer et configurer **DistroAV** et ses pr?requis NDI pour OBS. Activer sa sortie NDI ; la sortie principale transmet la sc?ne OBS, ? composer uniquement avec cette source si l?on veut la vid?o seule.
6. Sur l?ordinateur 2, dans TouchDesigner, cr?er un **NDI In TOP**, puis s?lectionner la source OBS dans **Source Name**. Utiliser de pr?f?rence Ethernet.

Le transport entre l?application et la source Navigateur OBS reste WebRTC en local. L??mission NDI est faite par OBS/DistroAV ; l?application n??met pas directement de NDI. OBS, DistroAV et la r?ception TouchDesigner n?cessitent une v?rification sur les machines concern?es.


### Vérification du rendu Face Cap

```bash
node --test src/core/faceCapRig.test.js
npm run build
```

Avec le serveur Vite lancé, ouvrir `/fallback-check.html` pour vérifier le modèle,
les textures originales des yeux, les expressions, le cliché mémorisé et le mode
Autonome sur une image fixe, sans webcam. Le rapport doit afficher `webglError: 0`
et `errors: []`.
