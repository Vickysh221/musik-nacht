# Demo Release Checklist

## Goal

Prepare `musik-nacht` for a first public-facing demo release where other people can:
- open the project
- see the curated bots-mode experience
- understand the aesthetic and system direction
- do all of that **without NetEase login or `ncm-cli` setup**

This checklist focuses on:
- release-readiness
- repo cleanup
- project structure adjustments
- safe demo data packaging

It does **not** include:
- user-uploaded song generation
- self-serve song import
- generalized music ingestion for outside users

---

# 1. Scope the first demo intentionally

## Must decide
- Which bots are in the first public demo?
- Which songs are polished enough to represent the project?
- Which entries are too rough / internal / experimental to expose yet?

## Recommended first-demo candidates
Start with a small, taste-defining set, for example:
- `clawd-spring-traveler` → `春を待って`
- `clawd-rain-waiter` → `いつも雨`
- `clawd-lunar-goddess` → `La lune`
- `clawd-night-train-watcher` → `夜车`
- `ghost-witch-night-train-companion` → `夜车`
- optionally 1–2 non-clawd experiments if they look strong enough

## Project modification
Create an explicit concept of:
- **public demo entries**
- vs **internal / experimental entries**

This can be done by either:
1. keeping a separate curated JSON file for demo release
2. or adding a `publicDemo: true/false` flag to bot/song entries

Recommended first step:
- keep a separate curated file for clarity

Suggested new file:
- `notes/demo-bot-song-map.json`

That avoids mixing public-release decisions with internal exploration.

---

# 2. Remove runtime dependence on NetEase login for viewers

## Principle
Viewers should consume prepared data.
Only Vicky should use `ncm-cli` locally.

## Must-have
For every public demo entry, pre-bake:
- song metadata
- lyric text
- lyric timing (if used in playback)
- cover image or stable cover URL
- bot scene config
- animation HTML

## Project modification
Introduce a clearly separated demo data layer.

Suggested structure:

```text
public/demo-data/
  songs/
    340376.json
    1364351242.json
  lyrics/
    340376.json
    1364351242.json
  covers/
    340376.jpg
  manifests/
    demo-song-index.json
```

Alternative if current architecture prefers src-based imports:

```text
src/demo-data/
  songs/
  lyrics/
  manifests/
```

## Recommendation
Prefer `public/demo-data/` for release assets that should load without build-time complexity.

---

# 3. Add a clean demo-data ingestion boundary

## Current problem
Right now local creation and public runtime can easily blur together.
That is fine during exploration, but not for release.

## Desired boundary
- `ncm-cli` = backstage ingestion tool
- demo runtime = static prepared data only

## Project modification
Create one explicit export/import boundary.

Suggested pattern:

### Local private step
Vicky uses `ncm-cli` to gather:
- song info
- lyrics
- synced lyrics
- cover references

### Project step
A local script or manual curation step writes cleaned public data into:
- `public/demo-data/...`

### Public runtime step
The site only reads:
- `public/demo-data/...`
- `notes/demo-bot-song-map.json` or equivalent manifest
- `src/data/botSceneMap.ts`
- `public/clawd-animations/*.html`

## Recommendation
Do not over-automate this first.
A manual or semi-manual export step is enough for phase 1.

---

# 4. Separate public demo mapping from internal mapping

## Why
The current `notes/clawd-bot-song-map.json` is serving ongoing exploration.
That means it may include:
- internal experiments
- rough entries
- entries not meant for public exposure

## Project modification
Add a public-demo manifest.

Suggested file:
- `notes/demo-bot-song-map.json`

This file should contain only the entries meant for the public demo.

## Runtime options
Two options:

### Option A — simplest for first release
Swap the runtime to read from `demo-bot-song-map.json` in public demo mode.

### Option B — more flexible
Keep the full map, but add a filtering layer:
- `visibility: public-demo | internal`

## Recommendation
Use **Option A** first.
It is simpler, easier to reason about, and safer.

---

# 5. Make bots mode support a clear public-demo path

## Goal
A stranger should be able to open the project and directly reach the best experience.

## Project modification
Decide how public demo mode is exposed.

Suggested options:

### Option A
Use existing `/?mode=bots` as the main public entry.

### Option B
Add a clearer route such as:
- `/?mode=demo`
- or a landing page that links into bots mode

## Recommendation
For the first release, keep architecture small:
- continue using `/?mode=bots`
- but make sure it resolves only curated demo entries when running in demo mode

Possible follow-up:
- add a small homepage or intro page later

---

# 6. Decide how to handle duplicate-song entries

## Current reality
`夜车` now has more than one bot interpretation:
- `clawd-night-train-watcher`
- `ghost-witch-night-train-companion`

This is artistically interesting, but public viewers may need help understanding it.

## Project modification
Choose one of these approaches:

### Option A
Allow multiple bots per song as a feature.

### Option B
Only expose one representative bot per song in the first demo.

## Recommendation
For phase 1, either:
- expose both but label them clearly as different interpretations
- or keep only the stronger one in the public manifest

Do not leave duplicate-song entries unexplained.

---

# 7. Cleanly separate experimental assets from release assets

## Current risk
The repo may contain:
- prototype notes
- intermediate prompts
- old generated HTMLs
- rough scenes
- parallel experiments

That is fine for ongoing work, but confusing for public release.

## Project modification
Create a release-oriented asset policy.

### Public-release assets
Keep these easy to identify:
- final animation HTMLs under `public/clawd-animations/`
- release-ready manifests
- release-ready demo data

### Internal assets
Keep these in notes/prototype areas, but do not rely on them at runtime.

If helpful, add conventions such as:
- `public/clawd-animations/` = release/runtime-facing
- `notes/` = planning, prompts, internal docs
- `src/prototypes/` = runtime prototype shell

---

# 8. Prepare README for strangers, not for yourself

## Goal
A stranger should know how to run the demo in under a few minutes.

## README should prioritize
1. What this project is
2. How to install and run it
3. Which route to open
4. What the viewer should expect
5. What is intentionally out of scope

## README should NOT prioritize first
- `ncm-cli` setup
- NetEase login
- private API key workflows
- long internal architecture dumps

## Project modification
Update README to include:

### Minimal run section
```bash
npm install
npm run dev
```
Then open:
- `http://localhost:5174/?mode=bots`
  or whatever the correct dev URL is

### Demo note
Explain that:
- the public demo uses curated sample data
- NetEase login is not required for viewing
- music-ingestion workflows are private/local for now

---

# 9. Add a release sanity pass before GitHub upload

## Must check
- no private credentials in repo
- no login-state files in repo
- no `.credentials` leaks
- no accidental personal data in manifests or notes
- no dependency on local absolute paths for public runtime

## Project modification
Before release, specifically audit:
- `notes/*.json`
- `src/data/*.ts`
- `public/*.html`
- `.gitignore`
- any generated metadata files

Look especially for:
- local machine paths
- hidden private IDs not meant for release
- debug text / scratch notes accidentally surfaced in runtime

---

# 10. Keep phase 1 deliberately narrow

## Rule
Phase 1 is a demo release, not a platform release.

That means the project only needs to prove:
- the aesthetic system exists
- the bots-mode pairing works
- the scene/music relationship is legible
- viewers can immediately experience the idea

It does **not** need to prove:
- scalable ingestion
- self-serve generation
- public music import
- user accounts
- generalized NetEase integration

## Project modification mindset
When unsure whether to add something, ask:

> Does this help a stranger understand the demo faster?

If no, it probably belongs after phase 1.

---

# Suggested immediate next actions

## Tier 1 — do first
- [ ] Decide the first public demo bot list
- [ ] Create `notes/demo-bot-song-map.json`
- [ ] Decide where release-ready lyric/song data should live (`public/demo-data/` recommended)
- [ ] Confirm `/?mode=bots` can run without NetEase login
- [ ] Confirm all public bot entries point to real animation files

## Tier 2 — do next
- [ ] Export / curate static song metadata for selected demo entries
- [ ] Export / curate static lyric data for selected demo entries
- [ ] Add runtime loading path for demo data
- [ ] Update README for public demo usage

## Tier 3 — do before upload
- [ ] Remove or ignore anything private / local-only
- [ ] Check animation files for accidental internal/debug leftovers
- [ ] Verify the demo on a clean environment mindset
- [ ] Confirm public users can see the core experience without music login

---

# Short conclusion

The right first public version of `musik-nacht` should behave like a curated exhibition.

To get there, the project should be modified so that:
- public runtime reads only prepared demo data
- public bots mode uses a curated manifest
- local music ingestion remains backstage and private

This keeps the first release clean, understandable, and actually runnable by other people.
