# Design Notes - ReserveIT Hotel & Restaurant Booking System

## Typography

### Fonts
- **Primary UI Font**: Inter (Google Fonts)
  - Weights: 300, 400, 500, 600, 700, 800
  - Used for: Body text, buttons, forms, navigation, UI elements

- **Display Font**: Playfair Display (Google Fonts)
  - Weights: 400, 500, 600, 700, 800, 900
  - Used for: Hero headings, section titles, large display text

### Font Sizes
- Hero Headings: 4xl (2.25rem) → 5xl (3rem) → 6xl (3.75rem) responsive
- Section Headings: 3xl (1.875rem) → 4xl (2.25rem) responsive
- Body Text: Base (1rem / 16px)
- Small Text: sm (0.875rem / 14px)

## Color Palette

### Primary Colors
- **Primary (Deep Navy)**: `#0F172A` (slate-900)
  - Used for: Headers, primary text, dark overlays

- **Accent (Blue)**: `#2563EB` (blue-600)
  - Used for: Primary buttons, links, focus states, badges
  - Hover: `#1D4ED8` (blue-700)

- **Accent Alternative (Teal)**: `#0EA5A4` (teal-500)
  - Optional alternative accent color

### Success
- **Success (Green)**: `#16A34A` (green-600)
  - Used for: Success messages, available status, positive indicators

### Neutral Colors
- **Background Light**: `#F8FAFC` (slate-50)
- **Background Medium**: `#F1F5F9` (slate-100)
- **Border**: `#E2E8F0` (slate-200)
- **Text Secondary**: `#64748B` (slate-600)
- **Text Primary**: `#0F172A` (slate-900)

### Status Colors
- **Available/Success**: Green variants
- **Unavailable/Error**: Red variants
- **Warning**: Yellow variants
- **Info**: Blue variants

## Spacing Scale

Based on Tailwind's default spacing scale (4px base unit):
- **xs**: 0.5rem (8px)
- **sm**: 0.75rem (12px)
- **base**: 1rem (16px)
- **md**: 1.5rem (24px)
- **lg**: 2rem (32px)
- **xl**: 3rem (48px)
- **2xl**: 4rem (64px)
- **3xl**: 6rem (96px)

### Component Spacing
- **Card Padding**: 1.5rem (24px) → 2rem (32px) on larger screens
- **Section Padding**: 3rem (48px) → 4rem (64px) vertical
- **Gap Between Cards**: 2rem (32px)
- **Form Field Spacing**: 1rem (16px) → 1.5rem (24px)

## Border Radius

- **Cards**: 12px (md) → 16px (lg) on larger screens
- **Controls (buttons, inputs)**: 8px (base) → 12px (lg) on larger screens
- **Badges/Pills**: Full (9999px)

## Shadows

- **Card Shadow**: `0 8px 24px rgba(15, 23, 42, 0.06)`
- **Card Hover Shadow**: `0 12px 32px rgba(15, 23, 42, 0.12)`
- **Elevated Shadow**: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`

## Breakpoints (Responsive Design)

- **Mobile First**: Base styles for mobile (320px+)
- **sm**: 640px (Small tablets, large phones)
- **md**: 768px (Tablets)
- **lg**: 1024px (Small desktops)
- **xl**: 1280px (Large desktops)
- **2xl**: 1536px (Extra large desktops)

## Component Specifications

### Hero Section
- **Height**: 600px (mobile) → 700px (tablet) → 800px (desktop)
- **Overlay**: Dark gradient from slate-900/80 to slate-900/40
- **Content**: Left-aligned, max-width 3xl container
- **Search Card**: White background, rounded-2xl, shadow-2xl, overlapping hero

### Hotel Cards
- **Image Height**: 192px (mobile) → 224px (desktop)
- **Hover Effect**: translateY(-6px), shadow increase
- **Border Radius**: 16px (rounded-2xl)
- **Badge Position**: Top-left, 16px offset

### Room Cards
- **Layout**: Image left (1/3 width), content right (2/3 width) on desktop
- **Stacked**: Full width, image top on mobile
- **Selected State**: Blue border (2px), ring effect

### Booking Sidebar
- **Position**: Sticky, top-24 (96px from top)
- **Background**: White, rounded-2xl, shadow-lg
- **Padding**: 1.5rem (24px)

### Restaurant Table Cards
- **Image Height**: 128px (h-32)
- **Grid**: 1 column (mobile) → 2 columns (tablet+)
- **Selected State**: Blue border, ring-2 ring-blue-200

## Animation & Transitions

- **Duration**: 200ms (fast) → 300ms (standard)
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1) (smooth)
- **Hover Transitions**: All interactive elements have smooth color/shadow transitions
- **Transform**: Used for hover lift effects (translateY)

## Accessibility

### Color Contrast
- All text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- Focus states: 2px blue ring with 2px offset
- Error states: Red border + text

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Tab order follows visual flow
- Enter/Space activate buttons and cards
- Focus visible on all focusable elements

### Screen Readers
- Semantic HTML (header, nav, main, aside, footer, article, section)
- ARIA labels where needed
- Alt text for all images
- Form labels associated with inputs

## Image Specifications

### Placeholders
All images are configured in `src/config/images.js`:
- HERO_IMAGE: Main hero background
- HOTEL1_IMAGE, HOTEL2_IMAGE, HOTEL3_IMAGE: Hotel card images
- RESTAURANT_IMAGE: Restaurant hero background
- TABLE_IMAGE: Restaurant table images

### Image Loading
- Lazy loading for below-fold images
- Eager loading for hero images
- Responsive srcset for different screen sizes
- Fallback placeholder for missing images

## Print Styles

- Hide navigation and action buttons when printing
- Optimize layout for A4 paper
- Maintain readability and branding

