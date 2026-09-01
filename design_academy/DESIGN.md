---
name: Design Academy
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464e'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#75777e'
  outline-variant: '#c6c6ce'
  surface-tint: '#525e7f'
  primary: '#182442'
  on-primary: '#ffffff'
  primary-container: '#2e3a59'
  on-primary-container: '#98a4c9'
  inverse-primary: '#bac6ec'
  secondary: '#5a5f62'
  on-secondary: '#ffffff'
  secondary-container: '#dce0e4'
  on-secondary-container: '#5e6367'
  tertiary: '#002b25'
  on-tertiary: '#ffffff'
  tertiary-container: '#00433b'
  on-tertiary-container: '#00b9a6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#bac6ec'
  on-primary-fixed: '#0d1a38'
  on-primary-fixed-variant: '#3a4666'
  secondary-fixed: '#dfe3e7'
  secondary-fixed-dim: '#c3c7cb'
  on-secondary-fixed: '#171c1f'
  on-secondary-fixed-variant: '#43474b'
  tertiary-fixed: '#62fae3'
  tertiary-fixed-dim: '#3cddc7'
  on-tertiary-fixed: '#00201c'
  on-tertiary-fixed-variant: '#005047'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  stack-xl: 64px
---

## Brand & Style

This design system is built on a "knowledge-first" philosophy, prioritizing content clarity and structural integrity to serve as a living example of UI/UX excellence. The brand personality is academic yet accessible—combining the authority of a traditional institution with the agility of a modern tech startup.

The visual style is **Corporate / Modern** with a lean towards **Minimalism**. It utilizes expansive whitespace to reduce cognitive load during the learning process. The aesthetic is defined by high-precision alignment, intentional contrast, and a systematic approach to hierarchy that guides the student's eye through complex educational material without friction.

## Colors

The color strategy uses **Deep Indigo** to establish a foundation of trust and professional authority. This is contrasted against **Soft Slate Blue** surfaces, which provide a cooler, more sophisticated alternative to pure white or grey backgrounds.

**Vibrant Teal** is reserved exclusively for primary actions and progress indicators, ensuring that interactive elements are immediately identifiable. Semantic colors follow standard conventions but are adjusted for high legibility against the secondary background. Use the primary color for text and iconography to maintain a cohesive, high-contrast reading experience.

## Typography

The design system utilizes **Inter** across all levels to leverage its exceptional legibility and systematic, utilitarian feel. The hierarchy is "top-heavy," featuring bold, impactful headings to clearly demarcate sections of study.

For body text, a generous line-height of 1.5x to 1.6x is mandated to ensure long-form educational content remains readable. Labels use a slightly increased letter-spacing and higher font-weight to distinguish them from prose. On mobile devices, headline sizes scale down to prevent excessive line-breaking while maintaining the bold character of the brand.

## Layout & Spacing

This design system employs a **12-column fluid grid** for desktop and a **4-column grid** for mobile. A strict 8px square-grid system governs all internal component spacing and external margins, ensuring mathematical harmony across the UI.

Educational modules should be centered in a fixed-width container on desktop to maintain optimal line lengths for reading. Layouts rely on "The Stack" — a vertical spacing scale that uses doubling increments (8, 16, 32, 64) to create a clear rhythm between lessons, sub-sections, and interactive exercises.

## Elevation & Depth

Depth is communicated through **Tonal Layers** supplemented by **Ambient Shadows**. The background uses the Secondary color (`#F0F4F8`), while primary content containers (like lesson cards or video players) use pure white backgrounds to "pop" forward.

Shadows are extremely subtle, using a soft Deep Indigo tint instead of pure black to maintain a clean, professional look.
- **Level 1 (Cards):** 0px 2px 4px rgba(46, 58, 89, 0.05)
- **Level 2 (Dropdowns/Modals):** 0px 10px 25px rgba(46, 58, 89, 0.1)

Low-contrast outlines (1px solid, `#E2E8F0`) are used for inactive or secondary elements to keep the interface flat and focused.

## Shapes

The shape language is **Rounded**, reflecting an approachable and modern academic environment. 
- Standard components (buttons, inputs) use a **0.5rem (8px)** radius.
- Larger containers (cards, featured sections) use a **1rem (16px)** radius to soften the overall interface.
- Progress bars and tags utilize the **rounded-xl (24px)** or full pill-shape to contrast against the more structured rectangular grid of the content.

## Components

### Buttons & Actions
Primary buttons use the Vibrant Teal background with white text, featuring a subtle 2px bottom-heavy shadow to imply clickability. Secondary buttons use the Deep Indigo outline with no fill.

### Input Fields
Inputs are styled with a 1px border in `#CBD5E1`. On focus, the border transitions to Vibrant Teal with a 3px soft outer glow. Labels always sit above the input in the `label-md` style.

### Learning Cards
Cards are the primary vessel for courses. They feature a white background, the Level 1 shadow, and a top-aligned image or icon. The card footer should always clearly display metadata (time to complete, difficulty level) using `body-sm`.

### Progress Indicators
Progress bars use a thick 8px track in Slate Blue with a Teal fill. Success states for completed lessons should use the Emerald semantic color to provide positive reinforcement.

### Navigation
The sidebar navigation uses a "Ghost" style, where active links are indicated by a subtle Slate Blue background and a 4px Deep Indigo vertical pill on the leading edge.