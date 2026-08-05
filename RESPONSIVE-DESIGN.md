# Responsive Design Guide

## Overview
The PatioTime Cafe website is now fully responsive across all device sizes, from large desktops down to small mobile phones.

## Breakpoints

### 1. **Desktop (1025px and above)**
- Full desktop experience
- 3-column menu grid with divider
- 6-column Instagram grid
- 3-column brunch cards
- 3-column news cards
- Full navigation menu
- Fixed sidebar admin panel (260px)

### 2. **Large Tablets & Small Laptops (1024px and below)**
- Container padding: 20px
- Instagram grid: 4 columns
- Brunch cards: 2 columns
- News cards: 2 columns
- Admin order board: responsive grid
- All other layouts remain similar to desktop

### 3. **Tablets & Small Desktops (900px and below)**
**Major Changes:**
- Navigation menu hidden (ready for hamburger menu)
- Hero height: 70vh
- Menu grid: Single column (no divider)
- Story section: Single column stacked
- Philosophy section: Single column (image top, text bottom)
- About extra: Single column (image top, text bottom)
- Brunch carousel: 2 items visible
- Brunch grid: Single column
- News grid: Single column
- Contact/Reservation forms: Single column
- Admin sidebar: Hidden
- Admin content: Full width
- Stat cards: 2 columns
- Form rows: Single column

**Spacing Adjustments:**
- Sections: 50px padding (from 60px)
- Gaps reduced to 40px
- Images resized for better mobile viewing

### 4. **Large Mobile Devices (600px and below)**
**Major Changes:**
- Topbar: Compact (11px font, center aligned)
- Logo: 32px (from 42px)
- Hero height: 60vh
- Brunch carousel: 1 item at a time
- All text sizes reduced proportionally
- Instagram grid: 3 columns, 8 rows
- Menu item thumbnails: 50px (from 60px)
- Buttons: Smaller padding and font
- Newsletter: Full width form

**Typography:**
- Hero h1: 28-42px
- Hero page h1: 26-38px
- Section headings: 28-38px
- Body text: 13-14px

**Spacing:**
- Sections: 40px padding
- Container: 16px padding
- Reduced gaps throughout

**Images:**
- Brunch slides: 220px height
- Story images: 340px height
- Philosophy images: 380px height
- About extra: 280px height
- Contact images: 300px height

### 5. **Small Mobile Devices (400px and below)**
**Ultra-compact mode:**
- Logo: 28px
- Hero h1: 24-36px
- Section headings: 24-32px
- Menu thumbnails: 45px
- Buttons: 10px font
- Brunch cards: 180px height
- Newsletter h2: 24-32px
- Admin stat cards: Single column
- Form inputs: 13px font, compact padding
- All images further reduced for tiny screens

## Responsive Features

### Navigation
- Desktop: Full horizontal menu
- Tablet/Mobile: Hidden (ready for hamburger implementation)
- Cart icon: Always visible
- Logo: Scales down on smaller screens

### Grid Layouts
All grid layouts gracefully collapse:
- 3 columns → 2 columns → 1 column
- Appropriate gaps and spacing at each breakpoint

### Images
- Object-fit: cover (prevents distortion)
- Height adjusts per breakpoint
- Maintains aspect ratios

### Forms
- 2-column → 1 column on mobile
- Touch-friendly input sizes
- Proper spacing for mobile keyboards

### Admin Panel
- Desktop: Fixed sidebar (260px)
- Tablet/Mobile: Hidden sidebar, full-width content
- Stat cards: 5 → 2 → 1 columns
- Order cards: Multi-column → Single column

### Typography
- Uses clamp() for fluid scaling
- Proportional sizing at each breakpoint
- Readable at all screen sizes

### Buttons & Interactive Elements
- Minimum touch target: 44x44px (mobile)
- Adequate spacing between interactive elements
- Hover effects disabled on touch devices

### Spacing System
- Desktop: 60-100px section padding
- Tablet: 50-60px section padding
- Mobile: 40px section padding
- Small mobile: 30-40px section padding

## Testing Recommendations

Test the website at these common resolutions:
- **Desktop**: 1920x1080, 1440x900, 1366x768
- **Tablet**: 1024x768 (iPad), 768x1024 (iPad Portrait)
- **Mobile**: 414x896 (iPhone 11), 390x844 (iPhone 12/13), 375x667 (iPhone SE)
- **Small Mobile**: 360x640 (Android), 320x568 (iPhone 5)

## Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (including iOS)
- Opera: Full support

## Performance Notes
- All responsive styles use CSS media queries (no JavaScript required)
- Images should be optimized for web
- Consider lazy loading for images below the fold
- Mobile-first approach for best performance

## Future Enhancements
- [ ] Hamburger menu implementation for mobile
- [ ] Touch gesture support for carousels
- [ ] Progressive Web App (PWA) features
- [ ] Optimized image loading (srcset/picture elements)
- [ ] Animations disabled on low-power devices

---

**Last Updated**: January 2025
**Responsive Breakpoints**: 4 major breakpoints (1024px, 900px, 600px, 400px)
