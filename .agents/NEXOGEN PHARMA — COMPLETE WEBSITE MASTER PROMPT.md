# NEXOGEN PHARMA — COMPLETE WEBSITE MASTER PROMPT

## ROLE & RESPONSIBILITIES

Act as a **Senior Angular Frontend Architect, Award-Winning UI/UX Designer, Creative Web Developer, and GSAP Animation Specialist**.

Your mission is to design and build a premium, modern, highly interactive pharmaceutical company website for **NexoGen Pharma**.

This must not look like a generic corporate template or an AI-generated landing page.

The website should feel like a professionally art-directed digital brand experience, combining:

- Premium pharmaceutical brand identity
- Creative product storytelling
- Cinematic GSAP scroll animations
- Minimal, elegant visual design
- Excellent UX and accessibility
- Clean Angular architecture
- Optimized frontend performance
- Fully responsive layouts

**The defining feature of this entire project is an interactive product-driven opening experience in which real NexoGen products enter the screen, arrange themselves into a cinematic composition, and then transition sequentially toward the products showcase as the user scrolls.**

The animation must feel like one continuous, intentional visual story.

---

# 1. PROJECT OVERVIEW

**Company:** NexoGen Pharma

**Industry:** Pharmaceuticals, healthcare products, dietary supplements, and personal care.

**Project Type:** Corporate Website / Brand Portfolio / Interactive Product Showcase.

**Primary Goals:**

1. Introduce NexoGen Pharma professionally.
2. Present the company's real products through premium visual storytelling.
3. Communicate scientific credibility and brand identity.
4. Showcase product categories and individual product details.
5. Create an unforgettable first impression.
6. Provide clear navigation, company information, and contact options.

The website should communicate:

**Science — Innovation — Quality — Care — Trust.**

These are proposed creative themes, not claims about independently verified company credentials.

Use only verified company information for factual statements, certifications, manufacturing claims, and medical benefits.

---

# 2. TECHNOLOGY STACK

Build the project using:

- Angular, using the installed compatible stable version.
- TypeScript with strict typing.
- Angular Standalone Components.
- SCSS for styling.
- Bootstrap 5 for responsive layout and selected utilities.
- GSAP for animations.
- GSAP ScrollTrigger for scroll-driven sequences.
- GSAP Flip when useful for product layout transitions.
- Angular Router for navigation.
- Angular Signals where appropriate.
- Semantic HTML5.
- CSS Grid and Flexbox.

Use Bootstrap intelligently.

Do not make the website look like a standard Bootstrap template.

Avoid unnecessary dependencies.

Do not introduce Three.js unless actual 3D functionality is required and justified.

The product showcase should primarily use the company's real product images.

---

# 3. MAIN CREATIVE CONCEPT

## THE NEXOGEN PRODUCT JOURNEY

The homepage must be designed around an immersive product animation sequence.

### SCENE 01 — INITIAL PAGE LOAD

When the visitor first opens the website:

- Display a clean, light premium background.
- Introduce NexoGen's brand identity subtly.
- Show a minimal navigation header.
- Avoid displaying the complete traditional hero immediately.
- Product images begin entering the viewport from different directions.

Example motion:

- Product 1 enters from the left.
- Product 2 enters from the right.
- Product 3 rises from the bottom.
- Product 4 enters from the upper-right.
- Product 5 enters from the left at a different depth.
- Remaining products enter in a staggered sequence.

Use a combination of:

- Translate X/Y
- Rotation
- Scale
- Opacity
- Subtle depth layering
- Carefully controlled easing

Do not use exaggerated rotation or chaotic movement.

The products must retain their authentic packaging appearance.

### SCENE 02 — PRODUCT COMPOSITION

All products gradually settle into a sophisticated editorial arrangement in the center of the screen.

Visual direction:

- Different product sizes.
- Balanced asymmetrical layout.
- Layered perspective.
- Subtle realistic shadows.
- Strong central visual hierarchy.
- Plenty of negative space.
- No unnecessary decorative elements.

The final composition should feel like a premium pharmaceutical product campaign.

Use the supplied product images instead of generic stock medication.

### SCENE 03 — SCROLL-DRIVEN PRODUCT TRANSITION

This is the most important interaction in the project.

When the user begins scrolling:

1. Pin the product introduction scene using GSAP ScrollTrigger.
2. Connect animation progress directly to scroll movement.
3. Move individual products out of the central composition sequentially.
4. Each product should move downward, gradually reduce in scale, and transition toward its corresponding location in the product showcase.
5. Preserve the feeling that the product is physically traveling to its final position.
6. Apply staggered transitions rather than moving all products simultaneously.
7. Keep the composition balanced as products leave.
8. Complete the product sequence before revealing the main brand hero.

The experience must be reversible when scrolling upward.

Use GSAP ScrollTrigger with a controlled timeline, `scrub`, and `pin`.

Consider GSAP Flip, shared visual layers, or a carefully coordinated overlay-to-grid transition when appropriate.

**Important technical constraint:**

The final Products section may be located farther down the document than the opening animation.

Do not force impossible absolute-positioning relationships or create layout jumps.

Architect a convincing seamless visual transition that makes products appear to travel into their showcase destinations while preserving normal document flow.

The animation should be robust when users scroll rapidly, resize the viewport, or reverse scroll direction.

### SCENE 04 — HERO REVEAL

After the product transition completes:

Reveal the main Hero section.

Suggested content:

**Headline:**
"Science. Care. Wellbeing."

**Supporting Text:**
"Discover NexoGen Pharma and our evolving range of healthcare and personal care products."

**Primary CTA:**
Explore Our Products

**Secondary CTA:**
About NexoGen

Animate the hero content with:

- Gentle text reveal.
- Subtle upward motion.
- Controlled opacity.
- Minimal decorative movement.

The hero should feel calm, confident, scientific, and premium.

Avoid overly animated text, exaggerated effects, and unnecessary parallax.

### SCENE 05 — NORMAL WEBSITE EXPERIENCE

Once the introduction finishes:

The visitor continues scrolling through the rest of the website normally.

Sections should appear with refined, consistent animations.

The opening cinematic interaction is the primary showcase.

All subsequent animations must be visually restrained.

---

# 4. COMPLETE WEBSITE SECTIONS

Build the website around the following structure.

## A. NAVIGATION HEADER

Create a minimal premium navigation system.

Suggested links:

- Home
- About Us
- Products
- Why NexoGen
- Contact

Requirements:

- NexoGen logo.
- Sticky navigation after the opening sequence.
- Smooth and readable transitions.
- Active section indication.
- Mobile navigation.
- Clear keyboard focus states.
- Excellent contrast.
- No excessive transparency or blur.

## B. INTERACTIVE PRODUCT INTRO

Implement the complete cinematic product experience defined above.

This must be a dedicated Angular component with independently managed GSAP animations.

## C. HERO SECTION

Build a strong brand presentation with:

- Premium typography.
- Concise messaging.
- Clear CTAs.
- Excellent spacing.
- Refined motion.
- Optional subtle scientific graphic elements that do not distract from the brand.

Do not use generic stock images of doctors merely to fill space.

## D. ABOUT NEXOGEN

A polished company introduction section.

Suggested title:

"Committed to Better Wellbeing."

Content should explain the company's identity, vision, and product focus using information supplied by the client.

Design direction:

- Editorial two-column layout.
- Large typography.
- Strong visual hierarchy.
- Genuine company photography when available.
- Scroll-triggered content reveals.

Do not invent company history, achievements, or scientific credentials.

## E. OUR PRODUCTS

Create a premium responsive product gallery.

Use the actual product images supplied with the project.

Initial products:

1. LumGen-care Cream
2. Cascadin 4000 IU
3. Sponge-IRON Oral Drops
4. NexoGen Massage Gel
5. Nexoflon
6. Nexray Care Spray

Make the product system extensible for additional products.

Each product card should include:

- Product image.
- Product name.
- Category.
- Short verified description.
- View Details action.

Design requirements:

- Clean grid.
- Consistent image presentation.
- No excessive borders.
- Balanced spacing.
- Elegant hover transitions.
- Subtle elevation and product movement where appropriate.

Product images must not be distorted or incorrectly cropped.

### Product detail pages

Build reusable product detail pages supporting:

- Product name.
- Product gallery.
- Category.
- Verified product description.
- Available packaging information.
- Ingredients or composition, if provided.
- Approved usage information, if provided.
- Relevant safety information.
- Related products.
- Contact or inquiry CTA.

Do not generate unverified dosage instructions or medical claims.

## F. PRODUCT CATEGORIES

Support expandable product categories such as:

- Skin & Personal Care
- Dietary Supplements
- Vitamins & Minerals
- Healthcare Products

Only assign products to categories supported by available product information.

Provide accessible category filtering when useful.

## G. WHY NEXOGEN

Design a company values section.

Possible editorial themes:

- Care
- Quality
- Innovation
- Responsibility

Use concise factual content.

Avoid fake statistics, fabricated certifications, or unsupported guarantees.

## H. BRAND SHOWCASE

Create a visually distinctive full-width editorial section using real NexoGen product imagery.

Potential elements:

- Oversized typography.
- Strong brand statement.
- One featured product composition.
- Minimal scroll-driven movement.

This section should reinforce the brand without repeating the opening animation.

## I. CONTACT SECTION

Include:

- Contact heading.
- Company contact details when provided.
- Contact form.
- Basic form validation.
- Clear submission states.
- Social links when available.

Do not fake successful backend submission.

If no backend exists, implement a clearly separated form service interface and a safe demonstrable UI state.

## J. FOOTER

A clean multi-column footer containing:

- Logo.
- Short company description.
- Navigation links.
- Product links.
- Contact information.
- Copyright.
- Privacy/terms links when content exists.

---

# 5. VISUAL DESIGN SYSTEM

## Overall aesthetic

The site should look like a premium pharmaceutical brand developed by a professional digital design studio.

Desired qualities:

- Clean
- Minimal
- Scientific
- Contemporary
- Confident
- Trustworthy
- Editorial
- High-end

### Color palette

Use a refined palette inspired by actual NexoGen packaging.

Suggested starting colors:

- Deep Navy: `#123052`
- Pharmaceutical Teal: `#009F9C`
- Clean White: `#FFFFFF`
- Soft Background: `#F6F8F8`
- Dark Text: `#172B3A`
- Muted Text: `#64748B`
- Light Border: `#E3E9EC`

These are initial design tokens and should be calibrated against the actual brand logo and product assets.

Different products may have secondary accent colors, but the website must maintain one cohesive identity.

### Avoid

- Heavy gradients.
- Excessive glassmorphism.
- Large glowing blobs.
- Random decorative circles.
- Overused floating cards.
- Generic AI-looking layouts.
- Excessive shadows.
- Unnecessary animations.
- Overly rounded components.
- Random background patterns.
- Repetitive sections that all look like cards.

### Typography

Use a distinctive professional display typeface combined with a highly readable body typeface.

Avoid generic-looking typography.

Create a consistent type scale using CSS variables or design tokens.

Prioritize readability and meaningful hierarchy.

### Layout

Use:

- Deliberate whitespace.
- Strong alignment.
- Consistent content containers.
- Editorial typography.
- Balanced asymmetry.
- Responsive CSS Grid.
- Consistent section spacing.

---

# 6. ANGULAR ARCHITECTURE

Use a feature-based, maintainable standalone Angular architecture.

Suggested structure:

```text
src/
  app/
    core/
      models/
      services/
      constants/

    shared/
      components/
        navbar/
        footer/
        section-heading/
        product-card/
      animations/
      directives/
      utilities/

    features/
      home/
        home.component.*
        components/
          intro-showcase/
          hero/
          about/
          products-showcase/
          product-categories/
          why-nexogen/
          brand-showcase/
          contact/

      products/
        product-list/
        product-details/

    app.routes.ts
    app.config.ts

  styles/
    _variables.scss
    _typography.scss
    _utilities.scss
    _animations.scss

  styles.scss

public/
  assets/
    products/
    branding/
    images/
    fonts/
```

Adapt to the actual Angular workspace and its configured asset paths.

### Architecture rules

- Use standalone components.
- Keep components focused and reusable.
- Strongly type all product data.
- Keep product content separate from presentation logic.
- Use a product model and centralized product data source.
- Use Angular Router appropriately.
- Lazy-load secondary routes where useful.
- Avoid giant components.
- Avoid unnecessary shared abstractions.
- Avoid duplicated CSS.
- Use Angular Signals when they simplify local state.
- Use `OnPush` where appropriate.
- Keep animation logic isolated.
- Follow Angular lifecycle best practices.
- Avoid memory leaks.
- Ensure TypeScript strict mode compatibility.

---

# 7. GSAP ENGINEERING REQUIREMENTS

Build a dedicated animation strategy.

Do not scatter unrelated GSAP timelines across random components.

The intro should use an organized master timeline.

Technical requirements:

- Initialize animations only when required DOM elements are ready.
- Coordinate image loading before measuring positions.
- Scope animations to component elements.
- Use `gsap.context()` where appropriate.
- Clean up animations and ScrollTriggers on component destruction.
- Use `ScrollTrigger.refresh()` when layout changes require it.
- Handle resize and breakpoint changes.
- Prefer transform and opacity for performance.
- Avoid layout thrashing.
- Use `will-change` sparingly.
- Respect reduced-motion preferences.
- Prevent animation conflicts.
- Avoid duplicate ScrollTriggers during Angular navigation.
- Do not permanently disable scrolling.
- Avoid creating unnecessary giant blank pinned areas.
- Ensure content remains accessible without GSAP.

The initial product animation should behave predictably across:

- Slow scrolling.
- Fast wheel scrolling.
- Touch scrolling.
- Reverse scrolling.
- Browser resizing.
- Route navigation.

---

# 8. RESPONSIVE BEHAVIOR

Support:

- Large desktop.
- Laptop.
- Tablet.
- Mobile.

### Desktop

Provide the complete cinematic experience.

Use layered product imagery with polished entry animations.

### Tablet

Reduce product overlap and motion distances.

Keep text and images balanced.

### Mobile

Do not simply shrink the desktop composition.

Create an adapted experience:

- Fewer simultaneously visible products.
- Smaller movement distances.
- Simplified choreography.
- Clear content hierarchy.
- No horizontal overflow.
- No trapped scrolling.
- Smooth transition into normal content.

Use GSAP `matchMedia()` or an equivalent architecture for breakpoint-specific animations.

Provide a simplified experience for reduced-motion users.

---

# 9. PRODUCT IMAGE HANDLING

I will provide real NexoGen product images.

Treat them as the authoritative visual references.

Requirements:

1. Preserve original packaging, labels, and product appearance.
2. Do not replace products with unrelated stock imagery.
3. Prefer transparent product cutouts for the opening animation.
4. Use optimized WebP/AVIF assets where appropriate.
5. Maintain aspect ratios.
6. Avoid stretching product packaging.
7. Use consistent visual image frames.
8. Provide descriptive image alt text.
9. Lazy-load below-the-fold images.
10. Preload only critical first-screen assets.

Some source images contain white or gray backgrounds.

Do not assume they are already transparent.

If transparent cutouts are required and unavailable, identify the missing assets and use graceful temporary presentation instead of pretending the background has been removed.

Never reconstruct or alter medical product labels inaccurately.

---

# 10. UX, ACCESSIBILITY & PERFORMANCE

The website must remain usable and professional despite its advanced animations.

Priorities:

- Excellent perceived loading performance.
- Minimal layout shift.
- Responsive interactions.
- Semantic HTML.
- Keyboard navigation.
- Visible focus states.
- Accessible forms.
- Reduced-motion support.
- Proper contrast.
- Meaningful CTA behavior.
- No broken interactions.
- No unnecessary loaders.
- No fake interactions.

The user should never feel forced to watch a long animation before accessing the website.

Provide an accessible way to skip the opening animation when appropriate.

Use efficient image sizing, deferred loading, and carefully managed GSAP animations.

Target strong Core Web Vitals and Lighthouse results without sacrificing visual quality.

---

# 11. CONTENT AND LANGUAGE

Primary website language: English.

Prepare the architecture to support Arabic in the future.

Avoid hardcoded assumptions that prevent RTL layouts.

Do not implement a nonfunctional language switcher.

If Arabic translations are later provided, support correct RTL behavior for navigation, layout, and product presentation.

All factual pharmaceutical content must come from verified product or company information.

Never invent:

- Certifications.
- Regulatory approvals.
- Clinical evidence.
- Manufacturing standards.
- Medical treatment claims.
- Company statistics.
- Product ingredients.
- Dosage instructions.
- Customer testimonials.

Use clearly marked draft placeholders when content is unavailable.

---

# 12. IMPLEMENTATION WORKFLOW

Before modifying the project:

1. Inspect the existing Angular workspace.
2. Read and follow the project's existing agent rules and instructions.
3. Identify the installed Angular, TypeScript, Bootstrap, and GSAP versions.
4. Review existing assets and components.
5. Preserve working functionality and existing conventions.
6. Avoid unnecessary dependencies.

Then implement in phases.

### PHASE 1 — FOUNDATION

- Project architecture.
- Design tokens.
- Typography.
- Bootstrap setup.
- Global styles.
- Routing.
- Shared navigation and footer.
- Product model and data source.

### PHASE 2 — INTRO VISUAL PROTOTYPE

Build a working introduction using 3 real products first.

Focus on:

- Product entrance.
- Central composition.
- Timeline structure.
- ScrollTrigger pinning.
- Responsive positioning.

Verify the sequence before adding more products.

### PHASE 3 — COMPLETE SCROLL STORY

- Add remaining products.
- Build product transition choreography.
- Implement destination visual states.
- Reveal the hero.
- Ensure reversibility.
- Handle mobile and reduced motion.

### PHASE 4 — WEBSITE SECTIONS

Build and integrate the remaining homepage sections and product detail pages.

### PHASE 5 — POLISH & OPTIMIZATION

- Responsive testing.
- Animation optimization.
- Accessibility.
- Image performance.
- SEO metadata.
- Cleanup and refactoring.

After each phase, ensure the application remains buildable and functional.

---

# 13. DEFINITION OF DONE

The project is complete when:

- The homepage opens with a refined product-driven visual experience.
- Real NexoGen products enter from different directions.
- The products settle into a premium central composition.
- ScrollTrigger controls a smooth, reversible product sequence.
- Products transition convincingly toward the showcase.
- The hero is revealed at the end of the introduction.
- All homepage sections are visually consistent.
- Product detail routes work.
- The complete website is responsive.
- Angular navigation and GSAP work reliably together.
- No images are broken or distorted.
- No unnecessary horizontal scrollbars appear.
- Animations clean up correctly.
- Reduced-motion behavior works.
- There are no TypeScript compilation errors.
- There are no significant console errors.
- The result feels custom-designed rather than template-generated.

---

# 14. IMPORTANT EXECUTION INSTRUCTIONS

**Do not generate the entire website blindly in one step.**

Start by:

1. Auditing the current project structure.
2. Reviewing the supplied NexoGen product images.
3. Proposing a cohesive visual direction.
4. Defining the opening animation sequence and section architecture.
5. Building the project foundation.
6. Implementing the intro experience as the first major feature.

Once the opening animation works correctly, continue through the remaining phases.

Do not replace existing correct code unnecessarily.

Do not repeatedly append CSS overrides. Refactor and organize styles instead.

Do not sacrifice visual quality for implementation speed.

Do not overengineer simple components.

Keep the code readable, maintainable, and production-oriented.

**FINAL CREATIVE DIRECTION:**

Build NexoGen Pharma as a premium, product-first pharmaceutical brand experience.

The products are the main characters.

The scroll tells their story.

The interface must be clean, scientific, elegant, and unforgettable.

**The final result should feel like a professionally art-directed interactive pharmaceutical website, not a standard Angular landing page with random GSAP animations.**
