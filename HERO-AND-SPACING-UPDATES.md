# Hero Text & Section Spacing Updates

## Changes Made

### 1. ✅ All Hero Sections - White Text

All hero sections across all pages now have **white text** for better visibility and consistency.

#### Home Page Hero:
- **Eyebrow**: "COFFEE PASSION" - White with decorative lines
- **Main Heading**: "TODAY'S GOOD MOOD IS SPONSORED BY COFFEE" - White
- **Italic Word**: "Coffee" - White (was gold)

#### Menu Page Hero:
- **Main Heading**: "Our Menu" - **White** (was gold)

#### About Page Hero:
- **Main Heading**: White (consistent across all pages)

---

### 2. ✅ Home Page Hero - Styled to Match Reference

#### Eyebrow Text:
- Added decorative lines on both sides
- Color changed to white
- Font size: 13px → **11px**
- Letter spacing reduced

**Visual**:
```
Before:
COFFEE PASSION

After:
—————— COFFEE PASSION ——————
```

#### Main Heading:
- Size increased: 38-64px → **42-68px**
- Letter spacing reduced for cleaner look
- Weight: 500 → **400** (lighter)

#### Italic Text ("Coffee"):
- Font: Changed to **Playfair Display** (elegant serif)
- Color: Gold → **White**
- Maintains italic style

---

### 3. ✅ Section Spacing Reduced

Reduced white space between sections across all pages for better flow.

#### General Sections:
- **Before**: `padding: 100px 0;`
- **After**: `padding: 60px 0;`
- **Reduction**: 40% less vertical spacing

#### Specific Sections:
- Brunch section: Already optimized (60px top, 80px bottom)
- Instagram section: No padding (seamless)
- Menu page sections: Now tighter

---

## CSS Changes

### Hero Eyebrow (All Pages):
```css
.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-size: 11px;        /* was 13px */
  color: #fff;            /* was var(--gold) */
  font-weight: 400;       /* was 500 */
  letter-spacing: 3px;    /* was 4px */
}

.hero-eyebrow::before,
.hero-eyebrow::after {
  content: '';
  width: 45px;
  height: 1px;
  background: rgba(255, 255, 255, 0.5);
}
```

### Hero Heading (Home Page):
```css
.hero h1 {
  font-size: clamp(42px, 6vw, 68px);  /* larger */
  color: #fff;
  letter-spacing: 1px;                 /* was 2px */
  font-weight: 400;                    /* was 500 */
}

.hero h1 em {
  font-style: italic;
  color: #fff;                         /* was var(--gold-light) */
  font-family: 'Playfair Display', serif;  /* NEW */
}
```

### Menu/About Page Heroes:
```css
.hero-page h1 {
  color: #fff;  /* was default/inherited */
}

.hero-menu-single .hero-inner h1 {
  color: #fff;  /* was var(--gold) */
}

.hero-menu-grid + .hero-inner h1 {
  color: #fff;  /* was var(--gold) */
}
```

### Section Spacing:
```css
.section {
  padding: 60px 0;  /* was 100px 0 */
}
```

---

## Visual Comparison

### Home Hero Before:
```
[GOLD] COFFEE PASSION

TODAY'S GOOD MOOD IS
SPONSORED BY Coffee
              [gold italic]

[GOLD BUTTON]
```

### Home Hero After:
```
[WHITE] —————— COFFEE PASSION ——————

TODAY'S GOOD MOOD IS
SPONSORED BY Coffee
        [white italic serif]

[GOLD BUTTON]
```

---

## Section Spacing Impact

### Before (100px padding):
```
[Hero Section]
                    ← 100px space
[Menu Section]
                    ← 100px space
[Brunch Section]
                    ← 100px space
[Instagram Section]
```

### After (60px padding):
```
[Hero Section]
              ← 60px space
[Menu Section]
              ← 60px space  
[Brunch Section]
              ← 60px space
[Instagram Section]
```

**Result**: More compact, less white space, better flow!

---

## Pages Affected

### ✅ Home Page:
- Hero text white with decorative lines
- Italic text in Playfair Display
- Reduced spacing between sections

### ✅ Menu Page:
- Hero heading now white (was gold)
- Reduced spacing between menu and brunch sections

### ✅ About Page:
- Hero heading white (consistent)
- Reduced spacing throughout

---

## Testing Checklist

### Hero Sections:
- [ ] Home hero eyebrow has white lines on sides
- [ ] Home hero "Coffee" is white italic Playfair
- [ ] Menu page "Our Menu" is white
- [ ] About page hero text is white
- [ ] All hero text is clearly visible

### Spacing:
- [ ] Less white space between sections
- [ ] No awkward gaps on home page
- [ ] Smooth flow from section to section
- [ ] Still enough breathing room
- [ ] Not too cramped

---

## Files Modified

### `client/src/index.css`:
1. `.hero-eyebrow` - White color, decorative lines, smaller font
2. `.hero h1` - Larger size, lighter weight
3. `.hero h1 em` - White color, Playfair Display font
4. `.hero-page h1` - White color
5. `.hero-menu-single .hero-inner h1` - White color
6. `.hero-menu-grid + .hero-inner h1` - White color
7. `.section` - Reduced padding (100px → 60px)

---

## Summary

✅ **All hero text** now white for consistency  
✅ **Home hero eyebrow** has decorative lines  
✅ **Italic text** styled with elegant Playfair Display  
✅ **Section spacing** reduced by 40% (100px → 60px)  
✅ **Better flow** throughout all pages  
✅ **Matches reference** design perfectly  

**Result**: Cleaner, more elegant, better-paced design! ✨
