```markdown
# Design System Document: Henny Automotive

## 1. Overview & Creative North Star: "The Kinetic Monolith"
The design system for Henny Automotive is built upon the "Kinetic Monolith" philosophy. We are not building a standard car dealership website; we are creating a high-performance digital showroom that mirrors the aggression, precision, and prestige of a luxury sports car. 

To break the "template" look, this system utilizes **intentional asymmetry**—large, overlapping typography that bleeds off the grid, and "stacked" surface depth. The experience must feel heavy yet fast, utilizing high-contrast visuals to guide the user toward the primary conversion point: direct communication.

## 2. Colors & Surface Architecture
The palette is rooted in a deep, nocturnal foundation with a high-energy pulse of red.

### The Color Palette
- **Core Foundation:** `surface` (#131313) provides the obsidian canvas.
- **The Pulse:** `primary_container` (#E11D2E) is our "Ignition Red," reserved strictly for high-value actions and brand signatures.
- **The Secondary Logic:** `secondary` (#41E575) is used exclusively for WhatsApp lead generation, providing a high-contrast "safety green" that stands out against the dark theme.

### The "No-Line" Rule
Designers are strictly prohibited from using 1px solid borders to section content. Boundaries must be defined solely through background shifts.
*   **Implementation:** A hero section using `surface` might transition into a vehicle gallery using `surface_container_low`. The eye should perceive change through tonal depth, not structural lines.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of carbon fiber and tinted glass.
*   **Layer 0 (Base):** `surface` (#131313)
*   **Layer 1 (Raised Sections):** `surface_container_low` (#1C1B1B)
*   **Layer 2 (Feature Cards):** `surface_container_high` (#2A2A2A)
*   **Layer 3 (Modals/Floating Elements):** `surface_bright` (#3A3939)

### The "Glass & Gradient" Rule
To evoke the finish of a premium vehicle, use Glassmorphism for floating navigation bars or Snapchat CTAs. Use a `surface_container` color with a 60% opacity and a `backdrop-blur` of 20px. 
*   **Signature Texture:** Apply a subtle linear gradient to Hero CTAs: `primary_container` (#E11D2E) to `on_primary_fixed_variant` (#930015) at a 135-degree angle to simulate light hitting a curved car panel.

## 3. Typography: Editorial Authority
We use a dual-typeface system to balance technical precision with high-impact personality.

*   **Display & Headlines (Space Grotesk):** This is our "Engine." It is wide, technical, and aggressive. Use `display-lg` for vehicle names and `headline-lg` for value propositions. Overlap these over car imagery with -2% letter spacing to create an editorial, high-fashion look.
*   **Body & UI (Inter):** This is our "Dashboard." Inter provides maximum readability for technical specs and shipping details. 
*   **Hierarchy Tip:** Use `label-md` in All Caps with 10% letter spacing for "Status" tags (e.g., "JUST ARRIVED" or "SHIPPING FROM USA") to mimic the aesthetic of performance part labels.

## 4. Elevation & Depth
In this system, depth is "felt," not "seen."

*   **The Layering Principle:** Instead of shadows, achieve lift by stacking. Place a `surface_container_highest` card on top of a `surface_container_low` background. 
*   **Ambient Shadows:** If a floating element (like a mobile WhatsApp button) requires a shadow, use a 32px blur at 8% opacity using the `surface_container_lowest` color. It should feel like an ambient occlusion shadow under a parked car.
*   **The "Ghost Border" Fallback:** For input fields, use a "Ghost Border": `outline_variant` (#5D3F3D) at 20% opacity. It should be barely perceptible, providing a hint of structure without breaking the dark-mode immersion.

## 5. Components

### The "Ignition" Buttons (Primary CTA)
*   **Style:** Sharp corners (`md` - 0.375rem). High-gloss gradient (Red to Deep Red).
*   **State:** On hover, the button should "glow"—add a soft red drop shadow and slightly increase the `surface_brightness` of the gradient.
*   **Focus:** WhatsApp buttons should use the `secondary` (#41E575) palette but maintain the same sharp styling.

### Vehicle Specification Chips
*   **Style:** No background. Use the "Ghost Border" (20% opacity `outline_variant`).
*   **Typography:** `label-sm` All Caps. This keeps the technical data clean and non-distracting.

### Performance Cards (Inventory)
*   **Rule:** Forbid the use of divider lines. 
*   **Structure:** Use vertical whitespace (32px+) to separate the car image, the title, and the price.
*   **Interaction:** On hover, the card should shift from `surface_container_low` to `surface_container_high` and slightly scale the image (1.05x) to simulate movement.

### Lead-Gen Floating Dock
*   **Context:** Specifically for the Ghana-to-USA market.
*   **Design:** A bottom-anchored, glassmorphic dock containing two primary icons: WhatsApp (Left, Primary) and Snapchat (Right, Secondary). Use `surface_bright` with a heavy blur.

## 6. Do’s and Don'ts

### Do:
*   **Use Asymmetry:** Place vehicle images off-center, allowing the `display-lg` text to wrap or hide behind the car's silhouette.
*   **Embrace Negative Space:** Give the cars room to breathe. High-end brands aren't crowded.
*   **Tonal Transitions:** Use `surface_container_lowest` for the footer to "ground" the page heavily.

### Don’t:
*   **No Standard Blue:** Never use default link colors. All interactive elements must be Red, Green (WhatsApp), or White.
*   **No 1px Borders:** Do not draw boxes. Use color blocks to define space.
*   **No Rounded "Pills":** Avoid the `full` roundedness scale for buttons. We want aggressive, architectural edges (`md` or `none`).
*   **No Generic Shadows:** Avoid heavy, muddy black shadows. Keep them subtle or use tonal layering instead.

---
**Director's Note:** Every pixel must feel like it was machined, not just placed. If the layout feels too "safe," increase the typography size and remove a container background. Let the photography and the "Ignition Red" do the heavy lifting.```