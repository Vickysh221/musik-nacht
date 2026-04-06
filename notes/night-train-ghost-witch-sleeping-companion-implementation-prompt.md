# Night Train × Ghost Witch × Sleeping Companion

## Goal
Create a standalone pixel-scene HTML prototype for a 10-second music-video moment.

Main character: `ghost-witch` (the previously registered small ghost with witch hat)
Format: standalone `.html`
Visual mode: pixel-art, scene-first, not a Three.js stage, not a UI card, not a white-background presentation
Structure: 4 stitched scene phases that feel like one short nocturnal MV

## Core story
This is a short night-train collage about a small ghost who begins alone and then discovers another small sleeping ghost beside them.

The emotional arc is:
- waiting alone
- being carried away by the train
- noticing another presence
- quietly staying beside them

This is not a dramatic story beat.
It should feel restrained, lonely, and then softly accompanied.

## Scene structure

### Phase 1 — At the station sign (0–2s)
Scene:
- A dark night station platform with a visible station sign as the main visual anchor
- Cold dim lighting
- Slight reflective ground, but very restrained
- Sparse environment; do not over-detail the platform

Character:
- `ghost-witch` stands small near the station sign
- Hat brim low, body lightly floating / swaying
- No exaggerated acting
- It should feel like waiting, not preparing heroically for departure

Visual priorities:
- Keep the ghost small relative to the station sign
- Emphasize loneliness and stillness
- A faint hint that a train or moving light will arrive soon

### Phase 2 — Inside the moving train (2–5s)
Scene:
- Cut into a dark train interior
- Window is visible
- Outside the window: horizontal pass-by lights, blurred tree shadows, faint moonlight fragments
- Train interior stays dim

Character:
- `ghost-witch` is seated or near the window
- Main motion comes from environment, not character acting
- Slight sway from train movement
- Attention mostly outward or forward

Visual priorities:
- Outside motion is the main performer
- Pass-by bands of light should move horizontally, not flicker randomly
- Tree shadows and moon wash should help the sense of travel
- Optional object memory: a small key or bottle shadow can exist, but do not make props take over

### Phase 3 — Discovering another little ghost (5–8s)
Scene:
- Still inside the train
- Focus shifts from the window area toward the neighboring seat / nearby carriage space
- The second ghost becomes visible as if it had always been there

Second ghost:
- Another small ghost, softly sleeping
- Small floating `zzz` above its head
- `zzz` should be gentle, slow, and light — not cartoonishly loud

Main character:
- `ghost-witch` notices the other ghost quietly
- No exaggerated surprise
- Only a small shift of attention / body angle / gaze

Visual priorities:
- This is the emotional peak, but not via brightness explosion
- The peak is the discovery itself
- Window lights may still pass, but now they support the intimacy of the interior moment

### Phase 4 — Sitting beside the sleeping ghost (8–10s)
Scene:
- Train interior near the seat/window area
- Outside lights, tree shadows, and moon fragments continue softly
- Environment should feel calmer than Phase 2

Character relationship:
- The sleeping ghost remains asleep
- `zzz` keeps drifting gently
- `ghost-witch` sits or stays beside them, watching quietly
- No waking, touching, or dramatic interaction

Visual priorities:
- Two small ghosts in a quiet shared frame
- Outside movement continues, but now it feels like the world moving around a tiny still center
- End on a residual feeling of companionship, not a resolved plot beat

Loop hook:
- The final frame should still contain enough night motion / darkness / drift that it can plausibly return to the opening station mood
- Favor residual loop over exact frame match

## Pixel scene requirements
- Output one standalone `.html` file
- Build the scene in understandable pixel layers
- Keep the look scene-first, not engine-demo-first
- No white background
- No overlay control panel as a visual focus
- No card framing
- No giant centered mascot on a blank stage
- The 4 phases must be stitched as one continuous MV, not 4 unrelated clips
- Character continuity must be treated as a hard constraint, not a soft suggestion

## Continuity rules for stitching
The HTML must be designed so that the end of one phase can hand off cleanly into the next phase.
Do not treat phase changes as full resets.

### Continuity dimensions that must stay coherent
- character screen position
- facing direction
- body height / seat height relationship
- gaze direction
- movement residue (small sway, drift, or pause that carries across the cut)

### Phase-to-phase continuity requirements

#### Phase 1 → Phase 2
- Phase 1 ends with `ghost-witch` already oriented toward the arriving train / future movement direction
- The final pose of Phase 1 should not be a closed static wait pose; it should contain a slight readiness or pull to the right side / travel direction
- Phase 2 should begin from a matching directional logic, so the viewer feels that the ghost has moved into the train rather than being replaced by another instance

#### Phase 2 → Phase 3
- Phase 2 ends with the ghost's attention beginning to shift away from the window
- Phase 3 begins with that same body already inside the carriage logic, now turning slightly toward the neighboring seat area
- Do not reset the character to a totally unrelated pose or screen location

#### Phase 3 → Phase 4
- Phase 3 ends with the ghost having already noticed the sleeping companion
- Phase 4 should begin with only a minimal settling adjustment, not a fresh reposition
- The distance between `ghost-witch` and the sleeping ghost must feel inherited from the previous phase

### Loop closure rule
- The end of Phase 4 should preserve enough night drift, dim motion, and quiet posture that the piece can plausibly return to the solitude of Phase 1
- Prefer emotional and positional residue over a hard exact-frame loop
- The final image should feel like a calm held breath that can dissolve back into the station opening

### Practical implementation rule
If separate phase blocks are used in code, define explicit start and end anchor states for the main ghost:
- `endPose.phase1` must approximately match `startPose.phase2`
- `endPose.phase2` must approximately match `startPose.phase3`
- `endPose.phase3` must approximately match `startPose.phase4`

These anchor states should at minimum specify:
- x/y screen position
- facing
- seated vs standing state
- gaze target

## Layering guidance
Each scene should think in layers such as:
- far background darkness / sky / night wash
- station sign / train wall / window frame / seat structures
- outside moving light bands
- outside tree shadow bands
- moonlight wash / cold glow
- character layer (`ghost-witch`)
- second ghost layer
- `zzz` glyph layer
- small prop layer (optional key / bottle, only if truly helpful)
- subtle reflection / floor gloss layer where relevant

## Character rules
- Use the previously registered small `ghost-witch` as the protagonist
- Preserve the hat silhouette and the small, quiet ghost body
- Keep acting minimal
- Let posture / orientation / proximity do the storytelling

## Mood rules
- restrained
- nocturnal
- slightly lonely
- soft discovery rather than dramatic reveal
- companionship without explicit explanation

## Things to avoid
- no exaggerated cartoon acting
- no over-busy platform detail
- no bright cheerful palette
- no giant shader-demo look
- no UI-first presentation
- no white cards / debug panels dominating the frame
- do not turn the second ghost reveal into a jump-scare or comedy beat

## Desired result
The result should feel like a small pixel-night collage where:
- a tiny ghost waits alone
- gets carried into the moving train night
- notices another sleeping ghost
- quietly stays beside them

It should read as a compact, emotionally legible 10-second MV moment rather than a technical animation test.
