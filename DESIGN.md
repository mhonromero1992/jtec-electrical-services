# DESIGN.md: JTEC Electrical Services

Art direction for the JTEC website. Everything here is derived from the JTEC company profile
(Canva PDF, 2026) and the client's instruction to add Robert S. Mallillin as Assistant Manager.
Read this before changing any page; it is the reason behind every visual decision.

## Design read

> Reading this as: a company profile and lead-generation site for a Tarlac-based electrical
> contractor with a solar division, for homeowners and business owners across Luzon, in a
> "colour chapters" editorial style built on the JTEC brand palette.
> Dials: **ENERGY 3 / RHYTHM 3 / MOTION 3** (bold, varied, choreographed, never scroll-jacked).

## Direction

- **Taste Skill direction:** `colour-chapters` ("Colour chapters", taste-skill v2.1.5 library).
  Chosen over `page-is-the-object` and `one-motif` because a solar company's material *is* the
  sun's day: every section is a full-bleed field coloured by the hour it stands for.
- **Brand kept:** palette and logo come from the profile (`--keep palette,type` equivalent).
- **Anti-Slop:** applied in DURING mode (session override from the client's brief).

### The idea

> On this page, **one day of sun over a JTEC rooftop (dawn, noon, the afternoon the battery
> fills, the night it carries the house)** becomes **the colour chapters**: navy dawn, stone
> morning, sky blue, amber noon, navy dusk and a night footer where the windows light up.

Why it is JTEC's and not any installer's: 13 of the 14 systems in JTEC's own installation log are
hybrid setups with battery storage, so the night chapter is literally what they sell; the roofs in
the hero model and photographs are the painted corrugated roofs of the Antipolo, Bulacan,
Tarlac and Pangasinan homes they fitted.

### The live thing

The hero diorama: a Filipino house with a red corrugated roof, a JTEC-style rooftop array, a
wall-mounted hybrid inverter and battery, on a plinth of Tarlac rice paddies. A **time-of-day
control** (keyboard and thumb friendly range input, plus "Play the day") moves the sun across
the sky; shadows swing, the panels catch the light, the battery gauge fills, and after sunset the
windows light up on battery power. Fallback without WebGL or JavaScript: a rendered still of the
same scene.

### Identity motif

**The cable.** One round-capped line ending in a ring terminal (the lug an electrician crimps onto
a wire). It underlines "wired" in the hero, strings the project steps together, underlines
secondary links on hover and wires the houses in the night footer. Nothing else is decorative.

## Colour

Brand values sampled from the profile: navy `#004B7E` (gear, wordmark, bands), amber `#FFB303`
(bolt), bright blue `#0461BD` (chevron bands).

| Token | Value | Role | Why |
| --- | --- | --- | --- |
| `--c-dawn` | `#032B4F` | Hero field | The brand navy before sunrise; lets the amber sun and the lit model carry the screen |
| `--c-stone` | `#F1F0EB` | Light field | Low-chroma concrete/stone (Filipino concrete homes), never cream |
| `--c-stone-2` | `#E4E2DA` | Surface step on stone | Form fields, portrait grounds; separates by tone, not lines |
| `--c-blue` | `#0461BD` | Sky field | The profile's bright blue; daytime sky |
| `--c-amber` | `#FFB303` | Accent + noon field | The bolt; the primary action, and the one sun-coloured chapter |
| `--c-navy` | `#004B7E` | Dusk field | Brand navy |
| `--c-night` | `#01182C` | Night field, footer | The last chapter; windows glow amber against it |
| `--c-ink` | `#06223D` | Text on light fields | Navy-black, softer than pure black |
| `--c-paper` | `#F4F3EE` | Text on dark fields | Soft white, not `#fff` on navy |

Rules: fields meet edge to edge with no gradient between them (chapters, not tints). Each field
uses its own ink at full strength. Amber is the accent on every field except the amber chapter,
where actions turn navy. Core palette: navy family + blue, amber accent, stone neutral (R-29).
The only gradients are real light: the sky and sunlight inside the WebGL scene.

## Type

**Archivo** (Omnibus-Type, variable `wght 100–900`, `wdth 62–125`, self-hosted). One family:
its expanded widths read like the lettering on switchgear and equipment nameplates, and the width
axis lets the hero headline "power up" from compressed to expanded.

| Step | Size | Setting |
| --- | --- | --- |
| Display | `clamp(2.6rem, 0.9rem + 6.6vw, 8.25rem)` | 800, wdth 112, -0.035em, leading 0.92 |
| Head | `clamp(2.25rem, 1.2rem + 3.6vw, 4.5rem)` | 760, wdth 106, -0.025em, leading 1.0 |
| Lead | `clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem)` | 420, leading 1.35 |
| Body | `clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem)` | 400, leading 1.55, 45–70ch |
| Small | `clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)` | 500 |

Headlines two lines or fewer at every width, sentence case. Tabular figures in the installation
log and anywhere numbers align. No monospace, no tracked-out uppercase labels.

## Layout

- One 12-column grid, outer margins `clamp(16px, 4vw, 56px)`, max content width 1440px.
- Section padding `clamp(88px, 11vw, 200px)`; chapters are at least ~90svh where content allows.
- Every chapter has a heading that names it, a different composition from its neighbours, and
  uses the full width (text on one side, its picture, list or figure on the other).
- Photographs: square corners, untouched colour, `object-fit: cover`; small project photos are
  never shown larger than their source resolution allows.
- Portraits: one framing for all six (same head size and position), cutouts on a tone step.

## Components

- **Header:** a plain bar (logo mark + wordmark, four links, one action). It is one of the two
  glass surfaces on the site (backdrop blur over the chapter beneath, solid fallback when
  `backdrop-filter` or reduced transparency applies). It takes the ink and a tint of the chapter
  under it with a 300ms transition; over the amber chapter its action turns navy. It tucks away
  while reading downwards and returns on any upward scroll or keyboard focus.
- **Hero control:** the second glass surface (time-of-day control and readout).
- **Primary button:** flat amber, square corners, ink label. Hover: the surface brightens and a
  soft highlight follows the pointer (lighting, no movement). Pressed: darker, 0.985 scale.
  Focus: a two-step halo (chapter-coloured gap + amber ring), never removed. Disabled and busy
  states are defined. No arrows by default.
- **Secondary action:** a text link with the cable underline; on hover the cable extends and the
  terminal fills.
- **Forms:** filled fields on the surface tone, visible labels, inline validation, amber focus
  halo, `mailto:` hand-off with a copyable fallback (no backend exists).

## Motion

Tokens: feedback 160ms, colour 300ms, reveal 700–900ms, ease `cubic-bezier(.2,.7,.1,1)`.

1. **Signature:** the hero headline charges up (width 62 → 112, weight 300 → 800) line by line,
   the cable under "wired" draws in, and the diorama's sun rises from 05:30 to 08:00.
2. **Entrances:** heading, then text, then picture, 70ms apart, 24px rise + opacity, once.
   Content is visible without JavaScript.
3. **Scroll-linked:** the project-steps cable draws as it scrolls past; map points light up in
   date order once. Native scrolling only: no pinning, snapping or hijacking.
4. **Night footer:** windows switch on one by one when the footer arrives.
5. **Page transitions:** cross-document View Transitions (shutter reveal), header persists.
6. **Reduced motion:** no travel, no auto-play, no pulses; the 3D scene still responds to the
   control because the visitor drives it.

## Content rules

- All facts come from the company profile: services, mission, vision, values, 14 installations
  (kWp, battery Ah, place, date), seven electrical projects (2016 to 2026), the team, contact.
- Derived figures are computed, not invented: 125.84 kWp is the sum of the 14 listed systems.
- No testimonials, client logos, ratings or statistics that the profile does not contain.
- No em dashes in site copy. CTAs say what they do ("Request a quotation").
- Map positions are approximate town/barangay centres and say so.

## Decisions and reasons (R-31)

- Colour chapters: the sun's day is the subject's own material.
- Archivo only: one sturdy, nameplate-like family; two weights do the work.
- Square buttons: switchgear and nameplates are square; it reads engineered, not app-like.
- Glass on two elements only: the brief asks for Liquid Glass, Anti-Slop caps it at 1-2.
- Real photographs everywhere: the profile has them; stock-looking images from the PDF
  (generic close-up panels, a solar farm, product renders) are deliberately not used.
- 3D diorama instead of an abstract object: it shows what JTEC actually installs.
- Five pages (Home, Services, Projects, About, Contact) because the profile has the depth
  for them; Home tells the day, inner pages hold the full detail.
