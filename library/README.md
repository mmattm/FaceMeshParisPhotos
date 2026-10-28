# Photomaton Animation Library (Catalogue d'Animations)

Bienvenue dans la bibliothèque d'animations faciales pour le projet **Soft Photography // Photomaton**.

Le catalogue fourni contient cinq animations prédéfinies sans audio, prêtes à être jouées en mode autonome. Les anciennes performances parlées avec audio Base64 ont été retirées. L'interface propose un enregistrement simple des mouvements, sans microphone, ainsi que l'import de fichiers JSON. L'import vidéo et la lecture manuelle en boucle ont été retirés.

---

## 📦 Animations Disponibles

Le tableau ci-dessous liste l'ensemble des animations prêtes au téléchargement et à l'utilisation :

| Nom | Fichier | Durée | Frames | Audio | Description / Source | Téléchargement direct |
| :--- | :--- | :---: | :---: | :---: | :--- | :---: |
| **Clin d'œil & Sourire** | `preset_clin_doeil_sourire.json` | 2.80s | 84 | 🔇 Non | Clin d'œil complice de l'œil gauche avec sourire chaleureux et inclinaison de tête | [Télécharger](/animations/preset_clin_doeil_sourire.json) |
| **Étonnement & Curiosité** | `preset_etonnement_curieux.json` | 3.00s | 90 | 🔇 Non | Haussement franc des sourcils, léger recul de tête et ouverture curieuse des lèvres | [Télécharger](/animations/preset_etonnement_curieux.json) |
| **Hochement Complice** | `preset_hochement_complice.json` | 2.60s | 78 | 🔇 Non | Hochement de tête affirmatif avec sourire discret et micro-mouvements des yeux | [Télécharger](/animations/preset_hochement_complice.json) |
| **Regard Pensif & Éclat** | `preset_regard_pensif.json` | 3.20s | 96 | 🔇 Non | Regard contemplatif vers le haut, retour progressif au centre et éclat de sourire | [Télécharger](/animations/preset_regard_pensif.json) |
| **Sourcils froncés** | `preset_sourcils_fronces.json` | 3.20s | 96 | 🔇 Non | Concentration, sourcils rapprochés et abaissés, yeux légèrement plissés, bouche au repos | [Télécharger](/animations/preset_sourcils_fronces.json) |

Un catalogue structuré au format machine est également disponible dans [`manifest.json`](./manifest.json).

---

## 💾 Comment Télécharger & Utiliser

### 1. Téléchargement depuis l'interface web (En un clic)
Le bouton **Animation** dans le bandeau supérieur affiche le preset en cours ; cliquez dessus pour ouvrir la bibliothèque. La carte active porte la mention **▶ En cours**.

1. Ouvrez l'application Photomaton (`http://localhost:5173/`).
2. Cliquez sur le bouton **🎬 BIBLIOTHÈQUE** dans le bandeau de contrôle.
3. Sur la carte de l'animation de votre choix, cliquez sur **⬇ Télécharger**. Le fichier `.json` complet est instantanément enregistré sur votre ordinateur.

### 2. Téléchargement direct depuis le serveur
Toutes les animations sont directement servies sous la route `/animations/` :
```bash
# Exemple de téléchargement avec curl :
curl -O http://localhost:5173/animations/preset_clin_doeil_sourire.json
```

### 3. Importer une animation dans l'application
Dans la fenêtre **BIBLIOTHÈQUE D'ANIMATIONS** :
1. Cliquez sur le bouton **📁 Importer (.json)** en bas de la fenêtre.
2. Sélectionnez le fichier `.json` téléchargé sur votre machine.
3. L'animation est immédiatement validée, sauvegardée dans `public/animations/` et prête à être jouée sur le masque 3D !

---

## 🧬 Structure & Format d'un fichier d'animation JSON

Chaque animation est encapsulée dans un fichier JSON autonome contenant l'ensemble des données géométriques, blendshapes et audio :

```json
{
  "id": "preset_clin_doeil_sourire",
  "name": "Clin d'œil & Sourire",
  "filename": "preset_clin_doeil_sourire.json",
  "durationMs": 2800,
  "frameCount": 84,
  "createdAt": "2026-10-25T09:27:52.313Z",
  "hasAudio": false,
  "referenceHeadPose": {
    "pitch": 2.1,
    "yaw": -0.8,
    "roll": 0.4
  },
  "referenceLocal": [
    { "x": 0.061, "y": -1.757, "z": 0.398 }
    /* 468 coordonnées crâniennes invariantes */
  ],
  "frames": [
    {
      "timeOffsetMs": 0,
      "headPose": { "pitch": 2.1, "yaw": -0.8, "roll": 0.4 },
      "blendshapes": {
        "jawOpen": 0.05,
        "mouthSmileLeft": 0.12,
        "mouthSmileRight": 0.14,
        "eyeBlinkLeft": 0.0,
        "eyeBlinkRight": 0.0
      },
      "localCoords": [
        /* 468 sommets morphologiques */
      ]
    }
  ]
}
```

### Champs principaux :
- **`durationMs`** : Durée totale de la séquence en millisecondes.
- **`frameCount`** : Nombre de frames enregistrées (typiquement 30 à 60 FPS).
- **`hasAudio`** & **`audioData`** : Flux audio encodé en Base64 (WAV ou MP3), décodé matériellement via Web Audio API pour une synchronisation labiale instantanée (zéro latence).
- **`referenceLocal`** : Empreinte crânienne 3D du visage d'origine en repère anatomique invariant (indépendant de la position et de l'éloignement de la caméra).
- **`frames[].blendshapes`** : 52 coefficients ARKit / MediaPipe (sourire, mâchoire, paupières, sourcils).
- **`frames[].localCoords`** : Positions 3D des 468 points de repère déformés à chaque instant.

---

## 🛠️ Ajouter de Nouvelles Animations

Le mode le plus simple se trouve directement dans le panneau principal :

1. Saisissez éventuellement le nom du preset et gardez brièvement le visage neutre.
2. Cliquez sur **● Enregistrer un preset**, attendez une fraction de seconde, puis jouez le mouvement devant la caméra.
3. Cliquez sur **■ Arrêter et ajouter**. Le fichier JSON est sauvegardé dans `public/animations/` et la bibliothèque s'ouvre sur la liste mise à jour.

Cette capture enregistre la pose de tête et les blendshapes du visage à 30 FPS, pendant 30 secondes maximum. Les 350 premières millisecondes servent de référence neutre afin de ne conserver que le mouvement. Elle ne demande jamais l'accès au microphone et n'écrit aucun champ `audioData`.

Vous pouvez également importer un fichier JSON depuis **BIBLIOTHÈQUE**.
