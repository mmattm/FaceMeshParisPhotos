# Last-visitor portrait comparison

Uses the locally served face-api.js 0.22.2 faceRecognitionNet and its 128-value descriptors.
MediaPipe locates the face; an aligned 150 x 150 webcam portrait is passed to computeFaceDescriptor.
Only the last accepted portrait and its descriptor remain in browser memory.
Without a previous portrait, the first usable webcam capture starts a visit immediately,
including after the absence reset. It does not wait for the recognition model or require
the frontal pose used for comparisons. The reference descriptor is computed lazily when
another portrait needs comparing. A stalled inference times out after 12 seconds and
reports an error before retrying; it cannot leave recognition permanently busy.
After at least one second without an accepted face, the returning portrait is compared
directly to that reference using Euclidean distance. During continuous presence the
visitor session stays locked: expressions and movements do not trigger more visits.
Two people replacing each other must leave the camera without an accepted face for
one second to rearm comparison. Manual new-visitor and reset controls still rearm it.
Distance at or below the configurable threshold (default 0.42) keeps the visitor session.
A greater distance immediately starts a new visit and replaces the reference portrait.
There are no votes, uncertainty bands or confirmation delays. Each arrival has one
successful comparison; unusable images retry at most once per 400 ms, with one inference
in flight. No recognition model runs again while the same visit remains present.
Tracking loss, reset and disabling invalidate in-flight results. Recognition remains paused
during an active minimalist generation. A continuous absence of 60 seconds forgets the
reference by default; this timeout can be changed or disabled in Settings.
Settings displays the reference portrait and the most recently analyzed portrait side by side.
Reloading clears the portraits. No recognition portrait is written to disk or sent to a service.
The separate ComfyUI visitor-image upload still occurs when a new visit launches a workflow.

Model source: https://github.com/justadudewhohacks/face-api.js/tree/0.22.2/weights
Documentation: https://justadudewhohacks.github.io/face-api.js/docs/index.html
Library license: /vendor/face-api.LICENSE

Validation: node --test src/core/visitorIdentity.test.js; npm run build.
