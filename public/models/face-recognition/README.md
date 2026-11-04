# Experimental last-visitor comparison

Model: face-api.js 0.22.2 faceRecognitionNet (128-value face descriptors).
Source: https://github.com/justadudewhohacks/face-api.js/tree/0.22.2/weights
Library: `/vendor/face-api.min.js`; MIT license in `/vendor/face-api.LICENSE`.
The upstream README credits the recognition weights to Davis King (dlib).

All library/model files are served locally. No face image or descriptor is sent
to a recognition service or saved by this experiment. The existing ComfyUI webcam
upload remains part of a confirmed new visit.

On each arrival allowed by the existing absence timer, MediaPipe supplies a
frontal, sufficiently large face. Its eyes align a 150 x 150 crop. The descriptor
is computed on CPU at most once per 400 ms, with one inference in flight. Three
consistent samples are required. Only the last accepted visitor's three
descriptors remain in memory; refreshing the page clears them.

Euclidean distance <= 0.50 confirms the same visitor; >= 0.62 confirms a different
visitor. The interval between thresholds waits for further evidence. These are
experimental thresholds and must be checked under the booth's actual lighting.
Unclear, profile, small or failed inputs do not trigger OSC or ComfyUI.

The Recognition button shows the decision and toggles back to absence-only
detection. The existing manual new-visitor button bypasses recognition and
refreshes the reference when possible. A different person still needs an arrival
event from the absence detector: continuous face replacement without an absence
is not classified by this experiment.

Timing: identity confirmation, then the existing one-second wait, webcam capture,
200 ms wait, minimalist transition /newVisitor OSC, and ComfyUI submission.
Manual minimalist and manual OSC controls retain their existing behavior.

Checks: `node --test src/core/visitorIdentity.test.js` and `npm run build`.
Booth checks: initial visitor triggers once; same person returns after >3 seconds
without new workflow/OSC; another person triggers once; uncertain/profile face
waits; recognition toggle restores absence-only behavior; reload forgets identity.

Browser smoke check (headless Chrome, CPU, November 2026): local model loaded,
finite 128-value descriptors, about 250–300 ms per warm inference. Distances:
fallback v1/v5 0.289; two different photos of the same public demo subject 0.394;
two distinct demo subjects 0.654. Demo portraits came from
https://github.com/ageitgey/face_recognition/tree/master/examples and were used
only as temporary test inputs, not shipped with this application. These fixture
results do not establish accuracy under the booth's lighting.
