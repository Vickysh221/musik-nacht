# Demo Release Plan

## Goal

The first public release goal is simple:

> let other people open the project and directly see the demo experience.

This phase is **not** about letting other users upload their own songs or generate their own music-video scenes.
It is only about making Vicky's existing curated demo playable and viewable with as little setup friction as possible.

---

## Core decision

For the first public-facing release:

- **Do not make `ncm-cli` a required runtime dependency for viewers**
- **Do not require other users to log in to NetEase Cloud Music**
- **Do not require other users to configure API keys**
- **Do not try to expose Vicky's own login/session setup**

Instead:

- use `ncm-cli` only as a **private local ingestion tool**
- export the needed song metadata/content into the project
- let the public demo consume prepared static/demo data

In short:

> `ncm-cli` stays in the backstage.
> The public release only shows the prepared frontstage result.

---

## Why this is the right first step

`ncm-cli` is useful for local creation because it can help gather:
- song info
- lyrics
- lyric timing / sync
- album cover
- playback-related metadata

But it is a poor public dependency for a demo release because it introduces:
- login friction
- expired session issues
- API key configuration burden
- local environment variability
- unclear stability for casual users

If the release goal is:

> “let people quickly see what this project feels like”

then the public version should behave like a ready-made exhibition, not like a toolchain setup challenge.

---

## First-release product shape

The first release should be treated as a:

- **curated demo gallery**
- **playable prototype showcase**
- **bots-mode sample experience**

It should let viewers:
- open the page
- browse a small set of existing bots
- click into scenes
- see animation / scene / lyric / song pairing
- understand the aesthetic direction of the project

It should **not** yet ask them to:
- import their own music
- log in with their own NetEase account
- run `ncm-cli`
- generate new scenes from arbitrary songs

---

## Recommended architecture split

### A. Private local workflow
Keep this for Vicky only.

Use `ncm-cli` locally to:
- inspect songs
- fetch lyrics
- fetch lyric timing
- fetch metadata
- fetch cover information
- prototype and refine bots/scenes

This remains part of the creation workflow, not the viewer workflow.

### B. Public demo workflow
Use prepared project data only.

The public viewer should consume:
- prepared bot-song mappings
- prepared song metadata
- prepared lyric text / lyric timing
- prepared cover images or stable cover references
- prepared animation HTML files
- prepared scene config

This lets the site behave like a self-contained demo.

---

## What should be pre-baked into the repo/demo

For each public demo song/bot entry, prepare these ahead of time:

### 1. Song metadata
Examples:
- song title
- artist name
- songId (if useful internally)
- duration
- album / cover metadata

### 2. Lyric data
Examples:
- plain lyric text
- timed lyric segments (if the demo uses sync)
- cleaned display-ready lyric format

### 3. Visual binding data
Examples:
- botId
- animation file path
- lyric surface type
- scene mood / color config
- player placement / lyric placement info

### 4. Visual assets
Examples:
- animation HTML
- optional cover image
- optional static preview images or thumbnails

This is enough for viewers to experience the demo without touching NetEase login flows.

---

## What should NOT be required for the public demo

Do not require viewers to have:
- `ncm-cli`
- NetEase login state
- `appId`
- `privateKey`
- mpv
- personal music library access

If any of those become required, the first public release goal is no longer a simple demo release.

---

## First-release success criteria

The first release succeeds if a new person can:

1. open the project
2. understand what the bots mode is
3. click into at least a few curated music-scene examples
4. see the intended aesthetic / emotional direction
5. do all of that **without logging in or configuring music tooling**

If this works, the release has already achieved its purpose.

---

## Recommended scope for the first public demo

Keep the scope deliberately small.

A good first demo release might include only a small number of polished entries, for example:
- `春を待って`
- `いつも雨`
- `La lune`
- `夜车`
- one or two non-clawd experiments if they are visually strong

The goal is not breadth.
The goal is to show the taste and structure of the system clearly.

---

## Suggested project messaging

When presenting the first public version, frame it as:

- a curated prototype
- a playable scene gallery
- a music-scene bot experiment
- an aesthetic system demo

Do **not** frame it yet as:
- a consumer tool for generating scenes from arbitrary songs
- a self-serve music import platform
- a public NetEase integration product

That future path may exist later, but it should not define the first release.

---

## Practical release rule

Before publishing, ask this question:

> Can a stranger see the core magic of the project without installing music tooling or logging into anything?

If the answer is yes, the demo is ready for first exposure.
If the answer is no, the project is still too dependent on backstage tools.

---

## Phase boundary

This document is only for **Phase 1**:

> show Vicky's existing demo samples to other people.

It explicitly does **not** cover:
- user-uploaded songs
- self-serve scene generation
- public account import
- generalized NetEase login for outside users
- turning the project into a mass-facing creation tool

Those are future possibilities, but they should stay out of scope for now.

---

## Short conclusion

For the first public release:

- keep `ncm-cli` private and backstage
- publish only prepared sample content
- optimize for immediate viewing, not tooling flexibility
- treat the release as an exhibition of the system, not the full system itself

That is the cleanest way to let more people experience the demo quickly.
