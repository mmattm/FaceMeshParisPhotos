# Presets manuels

Ce dossier contient uniquement les performances enregistrées ou importées par l’opérateur.
L’application ne génère et ne recrée aucun preset lorsque le dossier est vide.

À la perte du suivi, le mode autonome lit les presets manuels disponibles, avec
un raccord d’une demi-seconde sur la position, la rotation et les expressions. Les
lectures s’enchaînent avec un ease-in-out de 0,5 seconde : le preset suivant avance
pendant le fondu, y compris à la reprise d’une boucle. Aucun mouvement procédural
n’est ajouté. Sans preset disponible,
le visage conserve sa dernière pose.

Les enregistrements conservent la matrice MediaPipe complète et les coordonnées
X/Y/Z. Le choix **Tracking / Locked** affecte uniquement l’affichage : les données
originales restent intactes. Les anciens fichiers `recorded_*` sont compatibles.

Le fichier `src/core/presetAnimations.js` est une fixture de vérification hors ligne ;
il n’est jamais utilisé pour remplir la bibliothèque de l’application.
