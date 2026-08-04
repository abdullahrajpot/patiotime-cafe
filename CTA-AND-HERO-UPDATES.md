# CTA Section & Hero Background Updates

## Changes Made

### 1. ✅ Hero Background Images Updated

#### Home Page:
- **Old**: `herobg.jpg`
- **New**: `herobg.png` ✨
- Location: `client/src/utils/images.js`

#### Menu Page:
- **Old**: `home-03.jpg`
- **New**: `menuherobg.jpg` ✨
- Location: `client/src/utils/images.js`

#### File Updated:
```javascript
// client/src/utils/images.js
export const HERO_HOME = img('herobg.png');      // Changed
export const HERO_MENU = img('menuherobg.jpg');  // Changed
```

---

### 2. ✅ Newsletter/CTA Section Styling Updated

Matching the reference image styling for "Waiting For You Every Day" section.

#### Eyebrow Text (VISIT US FOR GOOD COFFEE & FOOD):
**Before:**
- Color: Gold
- No decorative lines
- Font size: 12px

**After:**
- Color: **White** ✨
- **Decorative lines on both sides** (50px each)
- Font size: **11px**
- Lines: 1px white with 40% opacity

#### Main Heading (Waiting For You Every Day):
**Before:**
- Font: Jost (sans-serif)
- Size: 32-42px
- Weight: 500
- Style: Normal

**After:**
- Font: **Playfair Display** (serif) ✨
- Size: **36-48px** (larger)
- Weight: **400** (lighter)
- Style: **Italic** ✨

#### Description Text:
**Before:**
- Color: rgba(255, 255, 255, 0.75)
- Max width: 540px
- Font size: 15px
- Line height: default

**After:**
- Color: **rgba(255, 255, 255, 0.85)** (brighter)
- Max width: **600px** (wider)
- Font size: **14px**
- Line height: **1.7** (more spacious)

---

## Visual Changes

### Eyebrow with Decorative Lines:
```
Before:
VISIT US FOR GOOD COFFEE & FOOD

After:
—————— VISIT US FOR GOOD COFFEE & FOOD ——————
```

### Typography Hierarchy:
```
Before:
[GOLD] VISIT US FOR GOOD COFFEE & FOOD
Waiting For You Every Day (Jost, regular)

After:
[WHITE] —— VISIT US FOR GOOD COFFEE & FOOD ——
Waiting For You Every Day (Playfair, italic)
```

---

## CSS Changes

```css
/* Eyebrow with decorative lines */
.newsletter-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  font-size: 11px;       /* was 12px */
  color: #fff;           /* was var(--gold) */
}

.newsletter-eyebrow::before,
.newsletter-eyebrow::after {
  content: '';
  width: 50px;
  height: 1px;
  background: rgba(255, 255, 255, 0.4);
}

/* Main heading - italic serif */
.newsletter h2 {
  color: #fff;
  font-size: clamp(36px, 5vw, 48px);  /* larger */
  font-weight: 400;                     /* lighter */
  font-family: 'Playfair Display', serif;  /* changed */
  font-style: italic;                   /* NEW */
}

/* Description text */
.newsletter-text {
  color: rgba(255, 255, 255, 0.85);  /* brighter */
  max-width: 600px;                   /* wider */
  font-size: 14px;                    /* smaller */
  line-height: 1.7;                   /* more spacious */
}
```

---

## Files Modified

### 1. Images Configuration:
**File**: `client/src/utils/images.js`
- Updated HERO_HOME to use `herobg.png`
- Updated HERO_MENU to use `menuherobg.jpg`

### 2. Newsletter Styling:
**File**: `client/src/index.css`
- Updated `.newsletter-eyebrow` (white color, decorative lines)
- Updated `.newsletter h2` (italic Playfair Display font)
- Updated `.newsletter-text` (brighter, wider, better spacing)

---

## Image Requirements

Make sure these images exist in `client/public/images/`:

### Required Files:
- ✅ `herobg.png` - Home page hero background
- ✅ `menuherobg.jpg` - Menu page hero background

If these files don't exist yet:
1. Add them to `client/public/images/` folder
2. Restart the dev server if needed
3. Hard refresh browser (Ctrl+Shift+R)

---

## Testing Checklist

### Hero Backgrounds:
- [ ] Home page hero shows `herobg.png`
- [ ] Menu page hero shows `menuherobg.jpg`
- [ ] Images cover full width
- [ ] No broken image errors in console

### Newsletter Section:
- [ ] Eyebrow text is white (not gold)
- [ ] Decorative lines appear on both sides of eyebrow
- [ ] Main heading is in italic Playfair Display font
- [ ] Main heading is larger and more elegant
- [ ] Description text is brighter and easier to read
- [ ] Overall look matches reference image

---

## Visual Result

### Newsletter Section Appearance:

```
        ————————  VISIT US FOR GOOD COFFEE & FOOD  ————————

                  Waiting For You Every Day
                     (italic, elegant serif)

        If you would like to stay connected and be the first to know
        about our news, events, and exclusive offers, please sign
        up for our newsletter. You can opt out at any time...

                [Email input field with arrow]
                 ☐ I agree to the Privacy Policy
```

---

## Pages Affected

This CTA/Newsletter section appears on:
1. **Home Page** - Bottom of page (before footer)
2. **Menu Page** - After brunch section (before footer)
3. **About Page** - Before footer

All pages will now have the updated styling automatically.

---

## Summary

✅ **Hero backgrounds** updated to use specific images  
✅ **Newsletter eyebrow** changed to white with decorative lines  
✅ **Main heading** changed to italic Playfair Display font  
✅ **Typography** refined for better visual hierarchy  
✅ **Spacing & sizing** adjusted to match reference  

**Result**: More elegant, refined CTA section matching the reference design! ✨
