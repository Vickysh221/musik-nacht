# Semantic-to-Visual Demo Scope

## Positioning

This demo is no longer framed as a full semantic understanding product.

It is a **semantic-to-visual planning demo**:

- input a sentence with atmosphere, trace, breathing room, and refinement constraints
- convert it into an explainable visual planning schema
- compress that schema into a structured visual brief
- synthesize an image-generation-ready prompt

The value of the demo is not:

- “the system fully understood the sentence”

The value is:

- the system can **stabilize vague but art-directed language into visual planning**
- the planning layer can **preserve project-specific semantics**
- the planning layer can **suppress common image-generation drift**

---

## What This Demo Shows

### 1. Semantic-to-visual planning

The demo takes language like:

- atmosphere-first descriptions
- trace-not-object descriptions
- breathing / openness preferences
- mixed imagery
- refinement-led constraints such as “不要太满”

and turns them into a planning schema oriented toward image construction.

The schema is not an ontology exercise.
It is a visual planning intermediate representation.

---

### 2. Structured translation of project-native semantics

The demo is specifically built to show that the project can preserve and translate:

- threshold atmosphere
- trace instead of fully named objects
- open, breathable composition
- smell / climate / air quality as visual material
- correction-style preference language

These are the semantics the project currently handles with the most distinctive taste.

---

### 3. Visual brief and prompt synthesis

The demo should show a clear pipeline:

1. raw semantic input
2. visual planning schema
3. negative drift guardrails
4. structured visual brief
5. image-generation-ready prompt

If the UI supports comparison, the strongest comparison is:

- raw direct prompt from the input sentence
- planned prompt synthesized from schema + guardrails

That comparison makes the demo legible:
the planning layer is not just extracting tags, it is guiding image formation and blocking common failure modes.

---

## What This Demo Does Not Show

This demo does **not** claim:

- full natural-language understanding
- production-grade intent recognition
- unlimited ontology coverage
- broad question planning
- complete LLM product behavior
- general-purpose visual reasoning for arbitrary user language

It is intentionally narrower:

- a demo of how this project handles a specific, high-value semantic band
- then converts it into controllable visual planning

---

## Sample Strategy

The new fixture pool should come from language patterns the project has actually grown around.

Primary emphasis:

- `烟雨里有一点竹影`
- `花叶意向，但不要太满`
- `海边那种被晒白的空气感`
- `下雨前五分钟的空气`
- `加州沙滩和柠檬叶的香气`

Alternate pool:

- `薰衣草的芳香`
- `黛色浮云`
- one rotation slot reusing a primary sample for layout stability and A/B comparison

Why this pool works:

- it is closer to the project's real semantic assets
- it is more diagnostic of the planning layer
- it shows atmosphere, trace, openness, mixed imagery, and constraint-led refinement
- it avoids falling back into generic poetic-line demos

---

## Showcase Chain

Each demo example should expose a compact chain:

### A. Input

One short semantic sentence.

### B. Planning schema

Recommended minimum fields:

- `subjects`
- `scene`
- `palette`
- `atmosphere`
- `lighting`
- `styleHints`
- `motifs`
- `textures`
- `composition`
- `negativeVisualDrift`

This schema should be visual-planning biased.
It should not read like slot-filling for semantic correctness.

### C. Structured visual brief

The brief should keep project language alive while making planning decisions explicit:

- what is primary
- what should remain secondary
- what density should be suppressed
- what kind of image pressure or openness should be preserved

### D. Image-generation-ready prompt

The prompt should:

- be usable by an image model
- preserve the project's atmosphere / trace / breathing semantics
- carry negative guardrails
- avoid flattening into generic aesthetic adjective soup

---

## Presentation Guidance

The cleanest demo presentation is:

- one selected sample at a time
- a visible planning schema panel
- a visual brief panel
- a final prompt panel
- optional direct-prompt baseline for comparison

The primary audience takeaway should be:

> the project is good at converting nuanced, airy, refinement-heavy language into visual planning that is more controllable than direct prompting.

---

## Out of Scope

Do not expand this demo into:

- a full productized semantic system
- a large benchmark suite
- an ontology expansion exercise
- a generalized text-to-everything platform claim

Keep the scope narrow and strong:

- a high-quality planning demo
- using the semantic band where the project already has real depth

---

## Why The Sample Pool Changed

The earlier generic poetic samples were too easy to read as “nice language in, nice mood words out.”

The new pool is better because:

- it comes from the project's real accumulated language
- it better reflects what the project actually knows how to structure
- it exposes the strongest current planning behaviors
- it makes the demo feel like **this** project, instead of a generic aesthetics prototype
