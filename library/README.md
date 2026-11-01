# Bibliothèque de presets manuels

Ouvrir **Animation** dans le bandeau supérieur pour enregistrer, importer,
télécharger, tester ou supprimer une performance. Les fichiers sont stockés dans
`public/animations/` ; `/api/animations` fournit le catalogue courant.

Les enregistrements contiennent les expressions brutes, la rotation et la position
3D complète de la tête, sans microphone ni audio. Ils utilisent `rig: "facecap"`,
`poseSpace: "mediapipe"` et `frames[].headPose.matrix` ; les coordonnées X/Y/Z restent
également disponibles. Les anciens fichiers `recorded_*` sont compatibles.

À la perte du suivi, les presets manuels s’enchaînent automatiquement. Les raccords
de position, rotation et expressions utilisent la même courbe **ease-in-out sur 0,5 seconde**. Pendant ce raccord, la cible reste la première image du preset ; la lecture commence ensuite, sans remise à zéro intermédiaire de la bouche ni perte du début du geste. Aucun mouvement de tête,
regard, clignement ou expression procédural n’est ajouté. Sans preset disponible,
la dernière pose est maintenue. Une bibliothèque vide reste vide.

**Tracking** restitue la position enregistrée. **Locked** garde le visage au centre
avec le même zoom dans tous les rendus, y compris Minimaliste, et masque la webcam.
Ce choix ne modifie pas l’enregistrement.

**▶ Tester** lance une performance ; désactiver **Autonome** pour reprendre le Live.
Le retour d’un visage après une perte automatique rejoint le suivi Live en une demi-seconde, puis conserve les valeurs brutes du suivi.
