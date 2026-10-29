# QA report

Production build (`npm run build` + `astro preview`) tested in Chromium (Playwright) on 29 October 2026.
Taste Skill's own scripts (`draw.mjs`, `inspect.mjs`) could not be run in the build environment, so the
direction was chosen from its library by hand and its house rules were checked with the scripts below.

## Automated sweep

Pages: `/`, `/services/`, `/projects/`, `/about/`, `/contact/`, 404. Widths: 1440, 1280, 1024, 834, 390, 360.

| Check | Result |
| --- | --- |
| Console errors, failed requests | None (the 404 page logs its own expected 404 status) |
| Horizontal overflow | None at any width |
| One `h1` per page | Yes |
| Headings (`h1`, `h2`) of two lines or fewer | Yes, at every width |
| Images with `alt`, `width`, `height` | All |
| Internal links and anchors (48) | All resolve |
| axe-core 4 (WCAG 2.0/2.1/2.2 A and AA, best practice), 1440 and 390 | 0 violations on every page |
| Touch targets on phones | 40 to 44 px or larger (radios and checkboxes sit inside 44 px labels) |
| `astro check` | 0 errors, 0 warnings, 0 hints |

## Click-through (46 checks, all passed)

- Hero: 3D scene goes live; time slider by keyboard (End, Home, arrows, with `aria-valuetext`); night
  status announced; Play the day starts and pauses; the hero field follows the hour.
- Services preview follows hover and keyboard focus; the log preview follows row focus.
- Header takes the chapter under it, and its button turns navy over the amber chapter.
- Map zooms to Metro Manila and Rizal and back; list items light their dot.
- Footer windows light up on arrival.
- Every keyboard focus stop on the home page shows a focus indicator.
- Mobile menu opens, closes with Escape, returns focus, and its links navigate.
- Projects filters (type, province), empty state and reset; chart tooltips on focus; bars link to their
  entries, including entries hidden by a filter; deep links from other pages land on the entry.
- Quotation form: empty submit shows errors and focuses the first field; invalid email caught; valid
  submit writes the request (subject, name, property, needs, bill).
- Reduced motion: no motion class, everything visible immediately.
- JavaScript disabled: headline and still image visible, scripted controls hidden, menu falls back to a
  link to the footer navigation, the form posts through `mailto:`.
- Main navigation opens each page and marks it as current.

## Lab performance (local, headless Chromium, no throttling)

Real-device field data was not measured.

| Page | LCP 1440 / 390 | CLS |
| --- | --- | --- |
| Home | 272 / 124 ms | 0 |
| Services | 344 / 344 ms | 0 |
| Projects | 188 / 236 ms | 0 |
| About | 168 / 184 ms | 0 |
| Contact | 156 / 192 ms | 0 |

JavaScript (gzipped): three.js scene 150 KB, lazy-loaded on the home page only; GSAP 27 KB; ScrollTrigger 17 KB.

## Anti-Slop delivery gate (DURING mode)

**Hard gate**

| Rule | Status | Evidence |
| --- | --- | --- |
| R-02 em dash | PASS | 0 in source copy and built HTML |
| R-03 mobile | PASS | No overflow at 390 and 360; targets at 40 to 44 px |
| R-17 numbers | PASS | Only profile figures or sums of them (125.84 kWp is the total of the 14 listed systems) |
| R-18 testimonials | PASS | None |
| R-23 assets | PASS | Logo traced from JTEC's own logo; portraits are JTEC's and the supplied photo; no invented logos or people |
| R-24 navigation | PASS | Every nav item has a page; 48 links resolve |
| R-25 contrast | PASS | axe colour-contrast clean; lowest text pair computed at 4.77:1 |
| R-26 controls | PASS | Every control exercised; scripted controls hidden without JavaScript |
| R-27 states | PASS | Filter empty state; form error and done states; 3D loading still and WebGL fallback |
| R-28 FAQ | PASS | None |
| R-32 keyboard | PASS | Focus visible on every stop tested; slider and menu keyboard-operable |
| R-33 patch scripts | PASS | None; asset scripts only prepare images and map data |
| R-34 themes | PASS | No theme toggle; colour chapters are the theme |
| R-35 verified | PASS | Build, type check and the click-through above |
| R-36 claims | PASS | No security, compliance or performance claims |
| R-37 direction | PASS | DESIGN.md with the design read and dials |
| R-38 real content | PASS | All content from the company profile (see "To confirm") |
| R-39 semantics | PASS | Native controls, labels, `alt`, landmarks, `lang`, pause on the only long motion |
| R-40 performance | PASS | Sized media; eager hero image with `fetchpriority="high"`; no third-party scripts |

**Purpose gate** (all PASS, reasons in DESIGN.md): gradients only as real light in the 3D scene and the
button's hover light; glow only on the sun and the lit windows; Archivo chosen for its nameplate
widths; no icon set; no arrows on buttons; glass on two elements; shadows only on floating elements
(hero control, chart tooltip); no identical feature cards; every animation has a stated purpose and a
reduced-motion fallback; the illustration shows JTEC's own system type.

**Liveliness:** dials ENERGY 3 / RHYTHM 3 / MOTION 3; one focal point per screen; amber as the deliberate
accent; one identity motif (the cable and ring terminal).

**Craftsmanship and locks:** no template layout (seven real project steps, no trusted-by bar, no pricing
grid); square buttons by decision; specific calls to action; no buzzwords; palette of navy and blue with
amber accent on stone; not a clone of any product.

## To confirm with JTEC before launch

- Map positions are approximate; "Red Planet Hotel Aurora" is placed on Aurora Boulevard, Quezon City.
- The "Useful to have ready" list on the contact page is advice written for the site, not from the profile.
- Photo captions describe what each photo shows; confirm they are all JTEC jobs and may be published.
- Robert S. Mallillin's title is "Assistant Manager" as instructed; no engineering title was added.
