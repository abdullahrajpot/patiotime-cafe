# Infinite Brunch Carousel

## Overview
The brunch carousel on the home page now displays **real brunch items from the database** with a **seamless infinite loop** animation - no gaps, continuous scrolling.

---

## Features

### 1. **Database-Driven Content**
- Fetches real brunch items from API
- Category: `all-day-brunch`
- Shows item name, price, and image
- Dynamic content updates when items are added/removed

### 2. **Infinite Loop Animation**
- Continuous scrolling from right to left
- **No gaps** between loops
- Seamless transition when loop restarts
- Smooth 50fps animation (20ms interval)

### 3. **Responsive Display**
- **Desktop (> 900px)**: 3 items visible
- **Tablet (≤ 900px)**: 2 items visible
- **Mobile (≤ 600px)**: 1 item visible

### 4. **Visual Design**
- Item image with overlay gradient
- Item name in elegant Playfair Display
- Price in gold accent color
- Rounded corners (4px)
- Smooth animations

---

## Technical Implementation

### How the Infinite Loop Works

1. **Triple the Items**
   ```javascript
   const displayItems = [...brunchItems, ...brunchItems, ...brunchItems];
   ```
   - Original items are duplicated 3 times
   - Creates: [Items] [Items] [Items]

2. **Continuous Scroll**
   ```javascript
   setTranslateX((prev) => {
     const newTranslate = prev - 0.05; // Move left
     
     // Reset when scrolled past first set
     if (Math.abs(newTranslate) >= (brunchItems.length * cardWidth)) {
       return 0; // Jump back to start
     }
     
     return newTranslate;
   });
   ```

3. **Seamless Reset**
   - When first set scrolls out of view
   - Position resets to beginning
   - User sees no gap (second set already visible)
   - Creates infinite illusion

### Animation Speed
- **Interval**: 20ms (50 frames per second)
- **Scroll Speed**: 0.05% per frame
- **Smooth Performance**: Uses `will-change: transform`
- **No CSS Transition**: Pure JS animation for precise control

---

## Database Integration

### API Call
```javascript
const items = await getMenuByCategory('all-day-brunch');
```

### Data Structure
Each brunch item has:
- `_id`: Unique identifier
- `name`: Item name (e.g., "Blueberry Waffles")
- `price`: Price as number
- `image`: Image filename
- `description`: Optional description
- `category`: 'all-day-brunch'

### Fallback
- If no items found: Component returns `null` (hidden)
- If image missing: Uses placeholder image

---

## Visual Components

### 1. Card Structure
```
┌─────────────────────┐
│                     │
│   [Image]           │
│                     │
│   ┌───────────────┐ │
│   │ Name    Price │ │ ← Gradient overlay
│   └───────────────┘ │
└─────────────────────┘
```

### 2. Overlay Gradient
- **Bottom**: `rgba(0, 0, 0, 0.85)` - Dark
- **Middle**: `rgba(0, 0, 0, 0.6)` - Medium
- **Top**: `transparent` - Fades out

### 3. Typography
- **Name**: 14px Playfair Display, white
- **Price**: 13px Playfair Display, gold
- **Layout**: Flexbox space-between

---

## Styling Details

### Card Dimensions
- **Width**: 33.33% of container (desktop)
- **Height**: 200px (desktop), 180px (tablet), 220px (mobile)
- **Gap**: 16px between cards
- **Max Container**: 1200px

### Colors
- **Text**: White (#fff)
- **Price**: Gold light (#d4b06a)
- **Overlay**: Black with transparency
- **Border Radius**: 4px

### Responsive Breakpoints
- **> 900px**: 3 cards, 200px height
- **≤ 900px**: 2 cards, 180px height
- **≤ 600px**: 1 card, 220px height

---

## Performance Optimizations

### 1. **GPU Acceleration**
```css
will-change: transform;
```
- Hints browser to optimize animation
- Uses hardware acceleration
- Smooth 60fps performance

### 2. **Lazy Loading**
```jsx
<img loading="lazy" />
```
- Images load as they come into view
- Reduces initial page load
- Better performance

### 3. **Efficient Animation**
- Uses `transform` (GPU accelerated)
- No layout recalculations
- Pure translate operations
- No CSS transitions (JS controlled)

---

## Adding Brunch Items

To add items to the carousel:

1. **Go to Admin Panel** (`/admin`)
2. **Menu Items tab**
3. **Add New Item**
4. **Set Category**: "All-Day Brunch"
5. **Upload Image**
6. **Set Name & Price**
7. **Save**

Items appear immediately in the carousel on the home page!

---

## Animation Math

### Scroll Calculation
```javascript
// Each card width percentage
const cardWidth = 100 / 3 = 33.33%

// If 6 items total
// Full loop = 6 * 33.33% = 200%

// When translateX reaches -200%:
// Reset to 0%
// User sees items 7-9 (which are items 1-3 duplicated)
```

### Speed Tuning
- **Faster**: Increase `0.05` to `0.1`
- **Slower**: Decrease `0.05` to `0.02`
- **Frame Rate**: Change interval from `20ms`

---

## Browser Compatibility

### Supported
- ✅ Chrome/Edge (all versions)
- ✅ Firefox (all versions)
- ✅ Safari (all versions)
- ✅ Mobile browsers

### Features Used
- `transform: translateX()` - Full support
- `will-change` - Optimization hint
- Flexbox - Full support
- CSS gradients - Full support

---

## Troubleshooting

### No Items Showing?
1. Check if brunch items exist in database
2. Verify category is `'all-day-brunch'`
3. Check browser console for errors
4. Ensure images exist in `/images/` folder

### Animation Stuttering?
1. Reduce scroll speed (lower than 0.05)
2. Check CPU usage (too many items?)
3. Verify GPU acceleration is working
4. Test on different browser

### Gap Visible?
1. Ensure items are duplicated 3 times
2. Check reset logic fires correctly
3. Verify card widths calculate properly
4. Test with different item counts

---

## Future Enhancements

Possible improvements:
- [ ] Pause on hover
- [ ] Variable speed control
- [ ] Click to view item details
- [ ] Add to cart from carousel
- [ ] Swipe gestures on mobile
- [ ] Direction toggle (RTL/LTR)

---

**Implementation Date**: January 2025  
**Animation**: Infinite seamless loop  
**Speed**: 0.05% per 20ms (50fps)  
**Data Source**: Database (all-day-brunch category)
